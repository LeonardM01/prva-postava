import { z } from 'zod'

import { env } from '#/env'

import { type LineupSignup } from './lineup-signup-schema'
import { type Role } from './role-context'

const LOOPS_API = 'https://app.loops.so/api/v1'

/**
 * Where the contact came from, shown in Loops next to every contact. The CTA band is the only
 * thing on the site that writes contacts, so one value is enough.
 */
const SIGNUP_SOURCE = 'Landing signup'

/**
 * The event both welcome workflows trigger on. Renaming it here silently stops the emails, so
 * it must be changed in Loops at the same time.
 */
const SIGNUP_EVENT = 'joined_lineup'

/**
 * Loops answers every write with `success`, plus fields that differ per endpoint and that
 * nothing here reads.
 */
const loopsResultSchema = z.object({ success: z.literal(true) })

function listIdFor(role: Role): string {
  switch (role) {
    case 'club': {
      return env.LOOPS_CLUBS_LIST_ID
    }
    case 'player': {
      return env.LOOPS_PLAYERS_LIST_ID
    }
  }
}

async function callLoops(method: 'POST' | 'PUT', path: string, body: unknown): Promise<void> {
  const response = await fetch(`${LOOPS_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.LOOPS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(
      `Loops answered ${String(response.status)} to ${method} ${path}: ${await response.text()}`,
    )
  }

  const payload: unknown = await response.json()
  if (!loopsResultSchema.safeParse(payload).success) {
    throw new Error(`Loops did not confirm ${method} ${path}: ${JSON.stringify(payload)}`)
  }
}

/**
 * Writes a signup to the Loops audience: the contact joins the mailing list for its side and
 * carries the language it signed up in, then the event triggers that side's welcome email.
 *
 * The contact call is an upsert, so signing up twice updates the existing contact instead of
 * failing. Both calls throw when Loops refuses: Loops is the only place a signup is kept, so a
 * failure must reach the visitor rather than look like a success.
 */
export async function addSignupToAudience(signup: LineupSignup): Promise<void> {
  const { email, language, role } = signup

  await callLoops('PUT', '/contacts/update', {
    email,
    language,
    source: SIGNUP_SOURCE,
    userGroup: role,
    mailingLists: { [listIdFor(role)]: true },
  })

  await callLoops('POST', '/events/send', {
    email,
    eventName: SIGNUP_EVENT,
    eventProperties: { language, role },
  })
}
