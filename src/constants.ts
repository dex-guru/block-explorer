export enum CHAIN_IDS {
  'CANTO' = 7700,
}
export const CHAIN_ID = parseInt(
  process.env.NEXT_PUBLIC_CHAIN_ID || CHAIN_IDS.CANTO.toString()
)

export const WALLET_CONNECT_PROJECT_ID = '1e58a7f9d4c5cbcb303af41525c9cc14'
