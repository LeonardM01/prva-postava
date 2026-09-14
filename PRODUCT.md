# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Clubs (primary, paying).** Sporting directors, coaches, and recruiters at clubs who need to find transferable players without sending scouts to as many matches as possible. Their job: browse and filter the player pool by position and statistics, shortlist suitable players, and make contact. They pay a recurring membership (monthly, quarterly, or yearly) to see players.

**Lower-league players (secondary).** Players in lower leagues who want to be noticed, transferred, and better paid. Their job: create a profile, publish their statistics, and get seen by clubs. Signing up and listing is free. Players may pay to be promoted to the top of the list for their position (for example, top of the goalkeeper list or the left-wing list).

The product is primarily B2B (club memberships) with a smaller B2C component (player promotion).

## Product Purpose

A marketplace where players sell themselves to clubs and clubs find players they can transfer. Players publish profiles and statistics; clubs search, filter, and evaluate that pool. Success means clubs find suitable players faster and cheaper than in-person scouting, and players who want out of a lower league actually get transferred and better paid.

Main revenue: club memberships. Secondary revenue: paid list placement for players.

## Positioning

Reference point named by the founder: Njuškalo (njuskalo.hr), Croatia's largest classifieds marketplace; the founder describes Prva postava as "a marketplace like Njuškalo, except the listings are players". Sofascore is the founder's reference for a football product done well. Compared with sending recruiters to games, Prva postava lets a club filter the entire player pool by what it actually needs, for example excluding goalkeepers when none is wanted, and see statistics before any travel. Compared with generic social or CV platforms, the listing is structured around positions and statistics, and the ranking within a position is a product surface players can pay for.

## Operating Context

- Clubs evaluate players from a desk: browsing, filtering by position and statistics, and comparing candidates. Recruiters are the day-to-day users on the club side.
- Players maintain their own profile and statistics, and check whether they are being seen.
- Two sign-up paths exist, player and club, with different permissions: clubs see players only while their membership is active.
- Two payment flows: recurring club membership (monthly, quarterly, yearly) and one-off or timed player promotion within a position list.

## Capabilities and Constraints

Confirmed:

- Sport: football only (confirmed 2026-09-14).
- Languages: Croatian and English, both at launch, because many players in Croatia are not Croatian (confirmed 2026-09-14).
- Player accounts with a profile and statistics.
- Club accounts gated by paid membership.
- Player list filterable by position (and statistics), with positions as a first-class concept.
- Paid promotion moves a player to the top of the list for their position.
- Terminology: "players", "clubs", "recruiters", "positions" (goalkeeper, left wing, ...), "transfer", "membership".
- Stack is fixed by the repository: TanStack Start on bun, deployed to Vercel, PostHog analytics, Loops email.

Undecided (record, do not invent):

- Which statistics a player can publish and how they are verified.
- Membership pricing and tiers, and promotion pricing or duration.
- How clubs contact players once found.
- Payment provider.

## Brand Commitments

Name: "Prva postava". No logo, voice, assets, or other identity constraints exist yet. (The founder once wrote "Proposta" in the interview; treated as a slip, not a second name.)

## Evidence on Hand

None. No real player data, club logos, testimonials, case studies, pricing, or press exist. Future work must not fabricate any of these. The only content in the repository is a placeholder home page.

## Product Principles

1. Clubs pay, so the club search-and-filter experience is the core product; it must be fast to scan and precise to filter.
2. A player's profile is a sales pitch; the product should make a lower-league player look credible and comparable, not decorated.
3. Positions are the organising axis. Every list, filter, and paid placement is per position.
4. Paid placement must stay legible as sponsored ordering, so clubs keep trusting the list.
5. Replace travel with evidence: statistics and profile data have to carry the weight a scout's eyes used to.
