import { type Language } from '#/lib/language'

const en = {
  brand: 'Prva postava',
  nav: {
    label: 'Main',
    forClubs: 'For clubs',
    forPlayers: 'For players',
    language: 'Language',
    switchLanguage: 'Switch to Croatian',
    logIn: 'Log in',
    searchPlayers: 'Search players',
    openMenu: 'Open menu',
  },
  hero: {
    roleSwitch: {
      // The group's accessible name is not in the copy deck; it borrows the CTA band's wording.
      label: 'Pick a side',
      club: 'I scout for a club',
      player: "I'm a player",
    },
    club: {
      headline: 'Find your next signing in one evening.',
      subheading:
        "Not one away match at a time. Every lower-league player who wants a transfer is on one board with his season's numbers: filter by the position you're missing, save the ones who fit, and make contact from your desk.",
      cta: 'Search players by position',
      note: 'Free for players. Clubs pay a membership.',
    },
    player: {
      headline: "Get in front of every club that's searching.",
      subheading:
        "Free. Your profile and your season's numbers, listed under your position, where clubs filter and make contact. Want to be first in your list? Promote yourself.",
      cta: 'List yourself, free',
      note: 'Publish your profile and statistics at no cost.',
    },
  },
  footer: {
    label: 'Footer',
    privacy: 'Privacy',
    contact: 'Contact',
  },
}

/**
 * Every language must provide every key English has; a missing key is a type error.
 */
export type LandingStrings = typeof en

const hr: LandingStrings = {
  brand: 'Prva postava',
  nav: {
    label: 'Glavna navigacija',
    forClubs: 'Za klubove',
    forPlayers: 'Za igrače',
    language: 'Jezik',
    switchLanguage: 'Prebaci na engleski',
    logIn: 'Prijava',
    searchPlayers: 'Pretraži igrače',
    openMenu: 'Otvori izbornik',
  },
  hero: {
    roleSwitch: {
      label: 'Odaberi stranu',
      club: 'Tražim igrače za klub',
      player: 'Ja sam igrač',
    },
    club: {
      headline: 'Nađi sljedeće pojačanje u jednoj večeri.',
      subheading:
        'A ne utakmicu po utakmicu. Svaki igrač niže lige koji želi transfer je na jednoj ploči sa svojim brojkama iz sezone: filtriraj po poziciji koja ti nedostaje, spremi one koji odgovaraju i javi se od stola.',
      cta: 'Pretraži igrače po poziciji',
      note: 'Besplatno za igrače. Klubovi plaćaju članarinu.',
    },
    // Not in Figma: translated in code for this build. Needs Leonard's review before launch.
    player: {
      headline: 'Pokaži se svakom klubu koji traži.',
      subheading:
        'Besplatno. Tvoj profil i tvoje brojke iz sezone, na listi tvoje pozicije, gdje klubovi filtriraju i javljaju se. Želiš biti prvi na svojoj listi? Promoviraj se.',
      cta: 'Oglasi se besplatno',
      note: 'Profil i statistiku objavljuješ bez naknade.',
    },
  },
  footer: {
    label: 'Podnožje',
    privacy: 'Privatnost',
    contact: 'Kontakt',
  },
}

export const LANDING_STRINGS: Readonly<Record<Language, LandingStrings>> = { en, hr }
