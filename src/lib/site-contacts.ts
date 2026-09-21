/**
 * The addresses the site publishes. Both mailboxes are on the site's own domain, so they are
 * code-owned facts rather than environment variables: the footer, the structured data and any
 * future contact copy must all name the same two addresses.
 *
 * `GENERAL_EMAIL` answers everything about the product itself and is the one the footer opens.
 * `SUPPORT_EMAIL` answers anything technical and is published only as the support contact point.
 */
export const GENERAL_EMAIL = 'neven@prvapostava.co'

export const SUPPORT_EMAIL = 'leonard@prvapostava.co'

export const GENERAL_MAILTO = `mailto:${GENERAL_EMAIL}`
