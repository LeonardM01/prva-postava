import { z } from 'zod'

import { ROLES } from './role-context'

export const signupEmailSchema = z.string().trim().pipe(z.email())

/**
 * What the CTA band sends: the side the visitor picked and where to write to them. The form
 * checks the email with the same rule before it calls the server.
 */
export const lineupSignupSchema = z.object({
  role: z.enum(ROLES),
  email: signupEmailSchema,
})

export type LineupSignup = z.infer<typeof lineupSignupSchema>
