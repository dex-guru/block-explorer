import { isAddress } from 'viem'

type CMCCryptoDataField = string
type CMCCryptoDataValue = string | number | string[]
type CMCCryptoDataItem = CMCCryptoDataValue[]
type CMCCryptoData = { batch: string; fields: CMCCryptoDataField[]; values: CMCCryptoDataItem[] }

export const getCMCTokenList = async (): Promise<CMCCryptoData | null> => {
  const res = await fetch('https://s3.coinmarketcap.com/generated/core/crypto/cryptos.json', {
    cache: 'force-cache',
    next: { revalidate: 24 * 60 * 60 },
  })

  try {
    return res.json() || null
  } catch {
    return null
  }
}

export const getCMCTokenSlug = async (address: string): Promise<string | null> => {
  if (!isAddress(address)) {
    return null
  }

  const data = await getCMCTokenList()

  if (!data) {
    return null
  }

  const addressLower = address.toLowerCase()

  const fieldSlugIdx = data.fields.indexOf('slug')
  const fieldAddressIdx = data.fields.indexOf('address')

  const tokenData = data.values.find((item) =>
    (item[fieldAddressIdx] as string[]).map((addr) => addr.toLowerCase()).includes(addressLower)
  )

  const slug = tokenData?.[fieldSlugIdx]

  if (!slug) {
    return null
  }

  return slug as string
}
