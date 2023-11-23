export enum CHAIN_IDS {
  'CANTO' = 7700,
}
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || CHAIN_IDS.CANTO.toString())

export const WALLET_CONNECT_PROJECT_ID = '1e58a7f9d4c5cbcb303af41525c9cc14'
export const AUTH_COOKIE_NAME = 'access_token_cookie'
export const AUTH_REFRESH_COOKIE_NAME = 'refresh_token_cookie'
export const JWT_TOKEN_REFRESH_INTERVAL = 60 * 60 * 1000 // 1 hour

export const environment = process.env.NODE_ENV

const authApiHost =
  environment?.toLocaleLowerCase() !== 'production'
    ? 'https://auth-api-stage.dex.guru'
    : 'https://auth-developers.dex.guru'

export const dexGuruLoginApiV3Url = `${authApiHost}/v3`
export const dexGuruLoginApiV2Url = `${authApiHost}/v2`

export enum LocalStorageKeyEnum {
  account_id = 'accountId',
  access_token = 'accessToken',
  refresh_token = 'refreshToken',
}
