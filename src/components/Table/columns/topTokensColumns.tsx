import { TopTokenModel } from '@/__generated__/resolvers-types'
import Delta from '@/components/Delta'
import { IColumn } from '@/components/Table/types'
import Token from '@/components/Token'
import Value from '@/components/Value'
import { financialFormat, financialFormatLowValueHighPrecision } from '@/lib/utils'

export const topTokensColumns: IColumn<TopTokenModel>[] = [
  {
    accessor: 'symbol',
    title: 'Token',
    render: (data) => (
      <Token
        address={data.address}
        symbol={data.symbol}
        logo={data.logoURI || ''}
        name={data.name}
      />
    ),
  },
  {
    accessor: 'volume24',
    title: 'Volume, 24h',
    type: 'number',
    render: (data) => <Value prefix="$" value={financialFormat(data.volume24h)} />,
  },
  {
    accessor: 'liquidity',
    title: 'Liquidity',
    type: 'number',
    render: (data) => <Value prefix="$" value={financialFormat(data.liquidity)} />,
  },
  {
    accessor: 'price',
    title: 'Price',
    type: 'number',
    render: (data) => <Value prefix="$" value={financialFormatLowValueHighPrecision(data.price)} />,
  },
  {
    accessor: 'priceChange24h',
    title: '24h',
    render: (data) => <Delta value={data.priceChange24h * 100} />,
  },
]
