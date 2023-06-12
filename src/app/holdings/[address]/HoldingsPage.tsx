'use client'

import { FC } from 'react'
import { isAddress, getAddress } from '@ethersproject/address'
import '@rainbow-me/rainbowkit/styles.css'
import {
  ChainConfigModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'
import {
  Page,
  DetailsView,
  Summary,
  Value,
  Empty,
  Error,
  IconSearch,
} from '@/components'
import { SummaryStat } from '@/components/Summary/types'
import TokensDataTable from '@/components/Tables/TokensDataTable'
import { financialFormat } from '@/lib/utils'

export interface IHoldingsPageProps {
  address: string
  tokenHoldingsStats?: TokenHoldingsStatsModel
  chainConfig: ChainConfigModel
}

const HoldingsPage: FC<IHoldingsPageProps> = ({
  address,
  tokenHoldingsStats,
  chainConfig,
}) => {
  const checkSumAddress = isAddress(address) ? getAddress(address) : address

  const renderStats = (): SummaryStat[] => [
    {
      title: 'Assets in Wallet',
      value: financialFormat(tokenHoldingsStats?.tokenCount || 0),
    },
    {
      title: 'Assets Total',
      value: (
        <Value
          value={financialFormat(tokenHoldingsStats?.totalNative || 0)}
          delta={(tokenHoldingsStats?.change24H || 0) * 100}
        />
      ),
    },
    {
      title: 'Assets Value',
      value: (
        <Value
          value={financialFormat(tokenHoldingsStats?.totalStable || 0)}
          prefix="$"
        />
      ),
    },
  ]
  return (
    <Page chainConfig={chainConfig}>
      {isAddress(address) && !tokenHoldingsStats && (
        <Empty
          icon={<IconSearch />}
          title="No holdings"
          subtitle={address ? `for address ${checkSumAddress}` : undefined}
        />
      )}

      {!isAddress(address) && <Error title="No correct address provided" />}

      {!!tokenHoldingsStats && (
        <DetailsView
          title="Token Holdings"
          address={checkSumAddress || undefined}
        >
          <Summary stats={renderStats()} />
          <TokensDataTable address={address} />
        </DetailsView>
      )}
    </Page>
  )
}

export default HoldingsPage
