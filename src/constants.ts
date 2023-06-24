export enum CHAIN_IDS {
  'CANTO' = 7700,
}
export const CHAIN_ID = parseInt(
  process.env.NEXT_PUBLIC_CHAIN_ID || CHAIN_IDS.CANTO.toString()
)

export const ITEMS_PER_PAGE = 10

export const MAX_EVENTS_PER_PAGE = 10
