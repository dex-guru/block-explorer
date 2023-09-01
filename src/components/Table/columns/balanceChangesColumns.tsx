import {
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { IColumn } from '@/components/Table/types'
import { TokenProps } from '@/components/Token'
import Token from '@/components/Token/Token'

export const balanceChangesColumns = (
  chainConfig?: ChainConfigModel,
  chainStats?: ChainStatsModel
): IColumn<{
  address: string
  tokens: TokenProps[]
  tokenIds: string[]
  balances: number[]
}>[] => [
  {
    accessor: 'address',
    title: 'Address',
    modifier: 'address',
    render: (data) => <Address address={data.address} type="tx" isCopy />,
  },
  {
    accessor: 'tokens',
    title: 'Token',
    modifier: 'token',
    render: (data) => (
      <>
        {data.tokens?.map((token, idx) => (
          <Token {...token} key={idx} />
        ))}
      </>
    ),
  },
  {
    accessor: 'tokenIds',
    title: 'Token ID',
    render: (data) => (
      <>
        {data.tokenIds?.map((tokenID, idx) => (
          <span key={idx}>{tokenID}</span>
        ))}
      </>
    ),
  },
  {
    accessor: 'balances',
    title: 'Balance',
    render: (data) => (
      <>
        {data.balances?.map((balance, idx) => (
          <span key={idx}>{balance}</span>
        ))}
      </>
    ),
  },
  {
    accessor: 'balances',
    title: 'Value',
    render: (data) => (
      <>
        {data.balances?.map((balance, idx) => (
          <span key={idx}>{balance}</span>
        ))}
      </>
    ),
  },
]
