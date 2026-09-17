import { type Language } from '#/lib/language'

const en = {
  brand: 'Prva postava',
  // What search results show. Titles stay within 70 characters and descriptions within 155 so
  // the snippet is not cut.
  meta: {
    title: 'Free agent footballers and clubs looking for players | Prva postava',
    description:
      'Free agent and lower-league footballers list a profile and season stats for free. Clubs filter them by position and league, then make contact.',
  },
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
        "Players list themselves here because they want a transfer, each with a position and this season's numbers. Filter for the position you're missing, save the ones who fit, and contact them from your desk. Then drive only to the matches worth watching.",
      cta: 'Search players by position',
      note: 'Start with your email. Players list for free, clubs pay a membership.',
    },
    player: {
      headline: 'Stop waiting for a scout to come to your match.',
      subheading:
        "List your position and this season's numbers for free. Clubs filter the list by position, age and league, then contact the players who fit.",
      cta: 'List yourself, free',
      note: 'All you need is an email. No agent, no fee to list.',
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
    // The headline reads out the filters the demo beside it has set.
    headline: "A left winger under 25 with at least 15 matches this season? That's one search.",
    body: "Filter by position, age and league, then by the season's numbers. Players who paid for the top spot are marked as promoted, so you always know why a name comes first. One membership: monthly, quarterly or yearly.",
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
      positionName: 'Position',
      player: 'Player',
      age: 'Age',
      matches: 'Matches',
      goals: 'Goals',
      assists: 'Assists',
      minutes: 'Min',
      minutesName: 'Minutes',
      // Headers nobody sees: the phone's combined statistic and the Save column.
      goalsAndAssists: 'Goals and assists',
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
    headline: 'See how many clubs looked at your profile this week.',
    body: "Listing your profile and your season's numbers costs nothing, and your profile shows how many clubs saw it each week. When you want to be the first name they see, pay to sit at the top of the list for your position.",
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
  cta: {
    headline: 'Get in the lineup.',
    body: "Pick your side and leave your email. We'll write to you to finish your player profile or your club account. Players list for free. Clubs pay a membership to see them.",
    emailLabel: 'Email',
    emailPlaceholder: 'name@club.hr',
    emailError: 'Enter an email address like name@club.hr',
    sending: 'Sending…',
    // Not in the copy deck: shown when the server cannot be reached. Like the field error, it
    // names the fix. Needs Leonard's review.
    submitFailed: "Your email didn't reach us. Try again.",
    successTitle: "You're on the list.",
    // `{email}` is replaced with the address the visitor left. The player line is not in the
    // copy deck. Needs Leonard's review before launch.
    successBody: {
      club: "We'll write to {email} to finish your club account.",
      player:
        "We'll write to {email} to finish the profile clubs see when they search your position.",
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
  // Needs Leonard's review before launch.
  meta: {
    title: 'Slobodni nogometaši i klubovi koji traže igrače | Prva postava',
    description:
      'Slobodni nogometaši i igrači nižih liga besplatno objave profil i statistiku sezone. Klubovi ih filtriraju po poziciji i ligi te im se javljaju.',
  },
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
    // The sub-heading and note are not in Figma: rewritten in code. Needs Leonard's review
    // before launch.
    club: {
      headline: 'Nađi sljedeće pojačanje u jednoj večeri.',
      subheading:
        'Igrači se ovdje oglašavaju sami jer žele transfer, svaki sa svojom pozicijom i brojkama iz ove sezone. Filtriraj po poziciji koja ti nedostaje, spremi one koji odgovaraju i javi im se od stola. Putuj samo na one utakmice koje vrijedi gledati.',
      cta: 'Pretraži igrače po poziciji',
      note: 'Dovoljan je e-mail. Igrači se oglašavaju besplatno, klubovi plaćaju članarinu.',
    },
    // Not in Figma: translated in code for this build. Needs Leonard's review before launch.
    player: {
      headline: 'Ne čekaj da skaut dođe na tvoju utakmicu.',
      subheading:
        'Besplatno objavi svoju poziciju i brojke iz ove sezone. Klubovi filtriraju listu po poziciji, dobi i ligi pa se javljaju igračima koji im odgovaraju.',
      cta: 'Oglasi se besplatno',
      note: 'Treba ti samo e-mail. Bez menadžera i bez naknade za oglas.',
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
    headline: 'Lijevo krilo mlađe od 25 s barem 15 nastupa ove sezone? To je jedna pretraga.',
    body: 'Filtriraj po poziciji, dobi i ligi, pa po brojkama iz sezone. Igrači koji su platili vrh liste označeni su kao promovirani, pa uvijek znaš zašto je netko prvi. Jedna članarina: mjesečna, tromjesečna ili godišnja.',
    demoLink: 'Pogledaj kako klub pretražuje',
    // Not in the copy deck, nor are the headline and body above, the filter label, the short
    // filter chip and the hidden headers below. Needs Leonard's review before launch.
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
      positionName: 'Pozicija',
      player: 'Igrač',
      age: 'Dob',
      matches: 'Utakmice',
      goals: 'Golovi',
      assists: 'Asist.',
      minutes: 'Min',
      minutesName: 'Minute',
      goalsAndAssists: 'Golovi i asistencije',
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
    // Not in the copy deck: the headline and body are rewritten in code. Needs Leonard's review
    // before launch.
    headline: 'Vidi koliko je klubova ovaj tjedan pogledalo tvoj profil.',
    body: 'Objava profila i brojki iz sezone ne košta ništa, a na profilu vidiš koliko ga je klubova pogledalo svaki tjedan. Kad želiš biti prvo ime koje vide, plati mjesto na vrhu liste za svoju poziciju.',
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
  cta: {
    headline: 'Uđi u prvu postavu.',
    body: 'Odaberi stranu i ostavi e-mail. Javit ćemo ti se da dovršiš profil igrača ili račun kluba. Igrači se oglašavaju besplatno. Klubovi plaćaju članarinu da bi ih vidjeli.',
    emailLabel: 'E-mail',
    emailPlaceholder: 'ime@klub.hr',
    // Only the heading, label and placeholder are in the copy deck. The body and the form states
    // are written in code for this build. Needs Leonard's review before launch.
    emailError: 'Upiši e-mail adresu u obliku ime@klub.hr',
    sending: 'Slanje…',
    submitFailed: 'Tvoj e-mail nije stigao do nas. Pokušaj ponovno.',
    successTitle: 'Na popisu si.',
    successBody: {
      club: 'Javit ćemo ti se na {email} da dovršiš račun kluba.',
      player:
        'Javit ćemo ti se na {email} da dovršiš profil koji klubovi vide kad traže tvoju poziciju.',
    },
  },
  footer: {
    label: 'Podnožje',
    privacy: 'Privatnost',
    contact: 'Kontakt',
  },
}

export const LANDING_STRINGS: Readonly<Record<Language, LandingStrings>> = { en, hr }
