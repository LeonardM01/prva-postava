import { parsePlayersSearch } from './players-search'

/**
 * Shared by the file route and the unit-test router: the search lives in the address on the
 * layout that holds the list, so the list stays mounted while the opened profile changes.
 */
export const PLAYERS_ROUTE_OPTIONS = {
  validateSearch: parsePlayersSearch,
}
