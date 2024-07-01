export enum CHAIN_IDS {
  'CANTO' = 7700,
}
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || CHAIN_IDS.CANTO.toString())

export const APP_OWNER = process.env.NEXT_PUBLIC_OWNED_BY
export const APP_OWNER_TERMS = process.env.NEXT_PUBLIC_OWNED_TERMS
export const APP_OWNER_DISCORD = process.env.NEXT_PUBLIC_OWNED_DISCORD
export const APP_OWNER_TWITTER = process.env.NEXT_PUBLIC_OWNED_TWITTER
export const APP_OWNER_TELEGRAM = process.env.NEXT_PUBLIC_OWNED_TELEGRAM
export const APP_OWNER_PLATFORM = process.env.NEXT_PUBLIC_OWNED_PLATFORM
export const APP_OWNER_NEWSLETTER = process.env.NEXT_PUBLIC_OWNED_NEWSLETTER
export const APP_OWNER_FORUM = process.env.NEXT_PUBLIC_OWNED_FORUM

export const APP_ABI_VERIFY_URL = process.env.NEXT_PUBLIC_ABI_VERIFY_URL ?? ''
export const APP_S3_REGION = process.env.NEXT_PUBLIC_S3_REGION ?? ''
export const APP_S3_ACCESS_KEY = process.env.NEXT_PUBLIC_S3_ACCESS_KEY ?? ''
export const APP_S3_SECRET_KEY = process.env.NEXT_PUBLIC_S3_SECRET_KEY ?? ''
export const APP_S3_BUCKET = process.env.NEXT_PUBLIC_S3_BUCKET ?? ''
export const APP_S3_PATH = process.env.NEXT_PUBLIC_S3_PATH ?? ''

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
