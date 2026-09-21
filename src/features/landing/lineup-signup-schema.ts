import { z } from 'zod'

import { LANGUAGES } from '#/lib/language'

import { ROLES } from './role-context'

export const signupEmailSchema = z.string().trim().pipe(z.email())

/**
 * What the CTA band sends: the side the visitor picked, where to write to them, and the language
 * they were reading, which decides the language of the welcome email. The form checks the email
 * with the same rule before it calls the server.
 */
export const lineupSignupSchema = z.object({
  role: z.enum(ROLES),
  email: signupEmailSchema,
  language: z.enum(LANGUAGES),
})

export type LineupSignup = z.infer<typeof lineupSignupSchema>
