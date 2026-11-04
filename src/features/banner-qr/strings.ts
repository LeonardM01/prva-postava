import { LANDING_STRINGS } from '#/features/landing/strings'

// The door titles are the home page's role switch labels, so the side a visitor picks here is
// worded exactly as the switch they land on.
const ROLE_SWITCH = LANDING_STRINGS.hr.hero.roleSwitch

/**
 * Croatian only, like the match-day banners that link here (decided 2026-11-04). Written in
 * code, not in Figma: needs Leonard's read before the banners go to print.
 */
export const BANNER_QR_STRINGS = {
  meta: {
    title: 'Igraš ili tražiš igrače? · Prva postava',
  },
  brand: LANDING_STRINGS.hr.brand,
  headline: 'Igraš ili tražiš igrače?',
  // What each side no longer has to do; the doors below say what each side gets.
  lead: 'Igraču ne treba menadžer. Klubu ne treba skaut na svakoj utakmici.',
  doorsLabel: ROLE_SWITCH.label,
  doors: {
    player: {
      title: ROLE_SWITCH.player,
      detail: 'Oglasi se besplatno. Klubovi te traže po poziciji.',
      // The banner's open card reads "TI / Tvoje ime ovdje"; the player door carries the same mark.
      mark: 'TI',
    },
    club: {
      title: ROLE_SWITCH.club,
      detail: 'Filtriraj igrače po poziciji, dobi i ligi.',
    },
  },
} as const
