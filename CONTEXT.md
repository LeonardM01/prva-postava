# Prva postava

A marketplace where lower-league footballers list themselves under a position and clubs search that list. Players list for free; clubs pay a membership to see them.

## Language

### People and organisations

**Player**:
A footballer aged 18 or over with an account. May or may not have a Listing.
_Avoid_: user, athlete, talent

**Club**:
An organisation with an account that sees Listings while its Membership is active.
_Avoid_: team, customer, account

**Recruiter**:
The person at a Club who searches, shortlists and contacts Players. Sporting directors and coaches are Recruiters when they use the search.
_Avoid_: scout, user

### The listing

**Listing**:
A Player's published entry under one Position with this season's numbers. One per Player. What a search returns as a row.
_Avoid_: profile card, ad, oglas (in code), entry

**Profile**:
The full page a Recruiter opens from a Listing row: identity, Position, Club, League, season numbers, Score, and whether it is Promoted.
_Avoid_: player page, detail, fact sheet (landing-page name for the demo object)

**Position**:
The single on-pitch role a Listing is filed under. The organising axis of every list, filter and Promoted spot.
_Avoid_: role, slot

**Line**:
A grouping of Positions used to make filters scannable: goalkeeper, defence, midfield, attack. Never a filing axis.
_Avoid_: area, group, unit

**League**:
The competition a Player's Club plays in this season, named as the Croatian pyramid names it (HNL, Prva NL, Druga NL, Treća NL Centar, Četvrta NL, 1. ŽNL). Any tier may list; the product is aimed at the tiers below Prva NL.
_Avoid_: division, tier, level

**Season numbers**:
The statistics a Listing publishes for the current season and the one before: matches, minutes, goals, assists, and clean sheets for goalkeepers. Which ones the live product verifies is an open product decision.
_Avoid_: stats, data, metrics

**Contract status**:
Whether the Player is under contract, has a contract expiring this season, or is a free agent. The field that says a Player can actually move.
_Avoid_: availability, status, situation

**Highlights**:
One short video clip on a Profile.
_Avoid_: reel, showreel, video, footage

### Ranking

**Score**:
A per-Position number from 0 to 100 on a Listing, computed from its season numbers. The default sort of a search below the Promoted rows. Players see their own.
_Avoid_: rating, index, ranking, grade

**Promoted**:
A Listing whose Player paid to sit at the top of its Position's list. Always labelled as such so the order stays legible.
_Avoid_: featured, sponsored, boosted, pinned

### Club-side actions

**Shortlist**:
The set of Listings a Recruiter has saved for their Club.
_Avoid_: favourites, saved players, watchlist, bookmarks

**Contact**:
The act of a Club reaching a Player from a Profile. The method is an open product decision.
_Avoid_: message, DM, enquiry

**Membership**:
A Club's paid, recurring right to see Listings (monthly, quarterly or yearly). Nothing is visible without an active one.
_Avoid_: subscription, plan, licence

### Player-side

**Seen by clubs**:
The count of Clubs that opened a Player's Profile in a period, shown to that Player.
_Avoid_: views, impressions, visits

**Promotion**:
The paid act by which a Listing becomes Promoted for a period.
_Avoid_: boost, upgrade, ad

### Demo

**Demo**:
The `/app` surface that shows the product on Sample data with no accounts, payments or backend. Exists to show clubs, players and investors what the product will be.
_Avoid_: MVP, prototype, mock-up, app (on its own)

**Sample**:
Synthetic data shown in the marketing page and the Demo. Never real people, never real Clubs. Always labelled.
_Avoid_: mock, fake, dummy, test data

**Seat**:
Which side of the marketplace the Demo visitor is looking from: the club seat or the player seat. A Demo control, not a product concept.
_Avoid_: role, mode, view, persona
