/**
 * Real league names from the Croatian pyramid as HNS names them for 2025/26, top tier first.
 * The sample data uses only these; HNL is open to listings but has no sample rows.
 */
export const LEAGUES = [
  'Prva NL',
  'Druga NL',
  'Treća NL Centar',
  'Treća NL Zapad',
  'Treća NL Sjever',
  'Treća NL Istok',
  'Treća NL Jug',
  'Četvrta NL Središte Zagreb',
  'Četvrta NL Rijeka',
  'MŽNL Osijek–Vinkovci',
  'MŽNL Brod–Požega',
  '1. ŽNL Zagrebačka',
  '1. ŽNL Splitsko-dalmatinska',
  '1. ŽNL Istarska',
] as const

export type League = (typeof LEAGUES)[number]
