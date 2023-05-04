import { useMemo } from 'react'
import { Interface } from '@ethersproject/abi'
import { ErrorDescription } from '@ethersproject/abi/lib/interface'
import { Fetcher } from 'swr'
import useSWRImmutable from 'swr/immutable'
import { Match, Metadata, MatchType, SourcifySource } from '@/types'

const ipfsGatewayPrefix = 'https://explorer-graph-stage.dexguru.biz/api'

export const sourcifyPath = (address: string, chainId: number) => {
  return `${ipfsGatewayPrefix}/${chainId}/${address}`
}

export const sourcifyMetadata = (address: string, chainId: number) => {
  return `${sourcifyPath(address, chainId)}/metadata.json`
}

export const sourcifySourceFile = (
  address: string,
  chainId: number,
  filepath: string
) =>
  `${sourcifyPath(address, chainId)}/${chainId}/${address}/sources/${filepath}`

const sourcifyFetcher: Fetcher<
  Match | null | undefined,
  ['sourcify', string, number, SourcifySource]
  // this "_" is important for sourcify metadata
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
> = async ([_, address, chainId, sourcifySource]) => {
  // Try full match
  try {
    const url = sourcifyMetadata(address, chainId)
    const res = await fetch(url)
    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.info(
      `error while getting Sourcify full_match metadata: chainId=${chainId} address=${address} err=${err}; falling back to partial_match`
    )
  }

  // Fallback to try partial match
  try {
    const url = sourcifyMetadata(address, chainId)
    const res = await fetch(url)
    if (res.ok) {
      return {
        type: MatchType.PARTIAL_MATCH,
        metadata: await res.json(),
      }
    }
    return null
  } catch (err) {
    console.warn(
      `error while getting Sourcify partial_match metadata: chainId=${chainId} address=${address} err=${err}`
    )
    return null
  }
}

export const useSourcifyMetadata = (
  address: string | undefined,
  chainId: number | undefined
): Match | null | undefined => {
  const sourcifySource = SourcifySource.IPFS_IPNS
  const metadataURL = () =>
    address === undefined || chainId === undefined
      ? null
      : ['sourcify', address, chainId, sourcifySource]
  const { data, error } = useSWRImmutable<Match | null | undefined>(
    metadataURL,
    sourcifyFetcher
  )
  if (error) {
    return null
  }
  return data
}

const contractFetcher: Fetcher<string | null, string> = async (url: string) => {
  const res = await fetch(url)
  if (res.ok) {
    return await res.text()
  }
  return null
}

export const useContract = (
  checksummedAddress: string,
  networkId: number,
  filename: string
) => {
  const normalizedFilename = filename.replaceAll(/[@:]/g, '_')
  const url = sourcifySourceFile(
    checksummedAddress,
    networkId,
    normalizedFilename
  )

  const { data, error } = useSWRImmutable(url, contractFetcher)
  if (error) {
    return undefined
  }
  return data
}

export const useHasCode = (
  address: string | undefined
): boolean | undefined => {
  const url = `https://sourcify.dev/server/check-all-by-addresses?addresses=${address}&chainIds=7700`
  const { data, error } = useSWRImmutable(url, (fetchUrl: string) =>
    fetch(fetchUrl).then((r) => r.json())
  )
  if (error) {
    return undefined
  }
  return data[0].status !== 'false'
}

export const useError = (
  metadata: Metadata | null | undefined,
  output: string | null | undefined
): ErrorDescription | null | undefined => {
  const err = useMemo(() => {
    if (!metadata || !output) {
      return undefined
    }

    const abi = metadata?.output?.abi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const intf = new Interface(abi as any)
    try {
      return intf.parseError(output)
    } catch (err) {
      console.warn("Couldn't find error signature", err)
      return null
    }
  }, [metadata, output])

  return err
}
