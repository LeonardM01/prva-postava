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
    clubHeadline: 'Find your next signing in one evening.',
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
    clubHeadline: 'Nađi sljedeće pojačanje u jednoj večeri.',
  },
  footer: {
    label: 'Podnožje',
    privacy: 'Privatnost',
    contact: 'Kontakt',
  },
}

export const LANDING_STRINGS: Readonly<Record<Language, LandingStrings>> = { en, hr }
