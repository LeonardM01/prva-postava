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
  board: {
    caption: 'Every position on one board',
    sampleNote: 'Sample players, not real listings',
    promotedIn: 'Promoted in',
    promoted: 'promoted',
    age: 'age',
    // The captions the position tour shows for each line.
    lines: {
      GK: 'Goalkeepers',
      DEF: 'Defenders',
      MID: 'Midfielders',
      FWD: 'Forwards',
    },
    units: {
      goals: 'goals',
      assists: 'assists',
      matches: 'matches',
      cleanSheets: 'clean sheets',
    },
  },
  positions: {
    GK: { short: 'GK', name: 'Goalkeeper' },
    LB: { short: 'LB', name: 'Left back' },
    CB: { short: 'CB', name: 'Centre back' },
    RB: { short: 'RB', name: 'Right back' },
    CM: { short: 'CM', name: 'Central midfielder' },
    LW: { short: 'LW', name: 'Left wing' },
    ST: { short: 'ST', name: 'Striker' },
    RW: { short: 'RW', name: 'Right wing' },
  },
  clubs: {
    headline: 'Clubs filter the whole pool, not the one match they could drive to.',
    body: "Filter by position, age and league, then by the season's numbers. Save who fits and make contact. One membership: monthly, quarterly or yearly.",
    demoLink: 'See how a club searches',
    // Not in the copy deck: the demo's sample-data caption. Needs Leonard's review before launch.
    demoCaption: 'Sample club search, not real listings',
    filters: {
      label: 'Filters',
      position: 'Position: LW',
      age: 'Age 18–24',
      matches: 'Min. 15 matches',
      league: '3. NL and below',
      add: '+ Add filter',
      addShort: '+ Filter',
    },
    table: {
      position: 'Pos',
      player: 'Player',
      age: 'Age',
      matches: 'Matches',
      goals: 'Goals',
      assists: 'Assists',
      minutes: 'Min',
      // Headers nobody sees: the phone's combined statistic and the Save column.
      season: 'Goals and assists',
      actions: 'Actions',
      promoted: 'Promoted',
      save: 'Save',
      goalsShort: 'g',
      assistsShort: 'a',
    },
    contactPlayer: 'Contact player',
    saveSearch: 'Save this search',
  },
  players: {
    headline: "Players publish their season, then pay to sit first on their position's list.",
    body: 'A profile and your statistics, free. When you want to be seen first, pay to sit at the top of the list for your position, and watch how many clubs have looked.',
    demoLink: 'See a player profile',
    // Not in the copy deck: the demo's sample-data caption. Needs Leonard's review before launch.
    demoCaption: 'Sample player profile, not a real listing',
    promotedUntil: 'Promoted in the LW list until 30 Sep',
    stats: {
      matches: 'Matches',
      goals: 'Goals',
      assists: 'Assists',
      minutes: 'Minutes',
      minutesShort: 'Min',
    },
    seenByClubs: 'Seen by clubs this week',
    promote: 'Promote me to the top of LW',
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
  board: {
    caption: 'Svaka pozicija na jednoj ploči',
    sampleNote: 'Primjeri igrača, nisu pravi oglasi',
    promotedIn: 'Promoviran u',
    promoted: 'promoviran',
    age: 'dob',
    // Not in the Figma copy deck: the line names are translated in code for this build. Needs
    // Leonard's review before launch.
    lines: {
      GK: 'Vratari',
      DEF: 'Braniči',
      MID: 'Vezni igrači',
      FWD: 'Napadači',
    },
    units: {
      goals: 'golovi',
      assists: 'asistencije',
      matches: 'utakmice',
      cleanSheets: 'čista mreža',
    },
  },
  // Only LK (lijevo krilo) is in the Figma copy deck. The other abbreviations and the
  // position names are translated in code for this build. Needs Leonard's review before launch.
  positions: {
    GK: { short: 'VR', name: 'Vratar' },
    LB: { short: 'LB', name: 'Lijevi bek' },
    CB: { short: 'SB', name: 'Središnji branič' },
    RB: { short: 'DB', name: 'Desni bek' },
    CM: { short: 'SV', name: 'Središnji vezni' },
    LW: { short: 'LK', name: 'Lijevo krilo' },
    ST: { short: 'NA', name: 'Napadač' },
    RW: { short: 'DK', name: 'Desno krilo' },
  },
  clubs: {
    headline: 'Klubovi filtriraju cijelu bazu, a ne samo utakmicu do koje su mogli doći.',
    body: 'Filtriraj po poziciji, dobi i ligi, pa po brojkama iz sezone. Spremi one koji odgovaraju i javi im se. Jedna članarina: mjesečna, tromjesečna ili godišnja.',
    demoLink: 'Pogledaj kako klub pretražuje',
    // Not in the copy deck, nor are the filter label, the short filter chip and the hidden
    // headers below. Needs Leonard's review before launch.
    demoCaption: 'Primjer pretrage kluba, nisu pravi oglasi',
    filters: {
      label: 'Filteri',
      position: 'Pozicija: LK',
      age: 'Dob 18–24',
      matches: 'Min. 15 nastupa',
      league: '3. NL i niže',
      add: '+ Dodaj filter',
      addShort: '+ Filter',
    },
    table: {
      position: 'Poz',
      player: 'Igrač',
      age: 'Dob',
      matches: 'Utakmice',
      goals: 'Golovi',
      assists: 'Asist.',
      minutes: 'Min',
      season: 'Golovi i asistencije',
      actions: 'Radnje',
      promoted: 'Promoviran',
      save: 'Spremi',
      goalsShort: 'g',
      assistsShort: 'a',
    },
    contactPlayer: 'Kontaktiraj igrača',
    saveSearch: 'Spremi pretragu',
  },
  players: {
    headline: 'Igrači objave sezonu, pa plate mjesto na vrhu liste za svoju poziciju.',
    body: 'Profil i tvoja statistika, besplatno. Kad želiš da te prvo vide, plati mjesto na vrhu liste za svoju poziciju i prati koliko te klubova pogledalo.',
    demoLink: 'Pogledaj profil igrača',
    // Not in the copy deck. Needs Leonard's review before launch.
    demoCaption: 'Primjer profila igrača, nije pravi oglas',
    promotedUntil: 'Promoviran na listi LK do 30. rujna',
    stats: {
      matches: 'Utakmice',
      goals: 'Golovi',
      assists: 'Asistencije',
      minutes: 'Minute',
      minutesShort: 'Min',
    },
    seenByClubs: 'Klubovi su pogledali ovaj tjedan',
    promote: 'Promoviraj me na vrh liste LK',
  },
  footer: {
    label: 'Podnožje',
    privacy: 'Privatnost',
    contact: 'Kontakt',
  },
}

export const LANDING_STRINGS: Readonly<Record<Language, LandingStrings>> = { en, hr }
