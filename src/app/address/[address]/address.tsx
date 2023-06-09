'use client'

import { FC } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import '@rainbow-me/rainbowkit/styles.css'
import {
  AddressModel,
  ChainConfigModel,
  ChainStatsModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'
import { ContractView, AddressView } from '@/components'

interface AddressPageServerProps {
  address: AddressModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
  tokenHoldingsStats: TokenHoldingsStatsModel
}

const AddressPage: FC<AddressPageServerProps> = ({
  address: addressInfo,
  chainStats,
  chainConfig,
  tokenHoldingsStats,
}) => {
  const params = useParams()
  const searchParams = useSearchParams()
  if (!params || !searchParams) {
    return null
  }
  const address = params.address
  const tab = searchParams.get('tab')
  if (!address) {
    return null
  }

  const onlyAddress = (
    Array.isArray(address) ? address[0] : address
  ).toLowerCase()

  const isContract = addressInfo?.addressType === 'smart_contract'

  if (isContract) {
    return (
      <ContractView
        address={onlyAddress}
        tab={tab}
        addressInfo={addressInfo}
        chain={{ stats: chainStats, config: chainConfig }}
        tokenHoldingsStats={tokenHoldingsStats}
      />
    )
  }

  return (
    <AddressView
      address={onlyAddress}
      tab={tab}
      addressInfo={addressInfo}
      chain={{ stats: chainStats, config: chainConfig }}
      tokenHoldingsStats={tokenHoldingsStats}
    />
  )
}

export default AddressPage
