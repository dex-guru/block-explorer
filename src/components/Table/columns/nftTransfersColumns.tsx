import Link from 'next/link'
import { Erc721TransferModel } from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { AddressValues } from '@/components/Address/helpers'
import { IColumn } from '@/components/Table/types'
import { financialFormat } from '@/lib/utils'

export const nftTransfersColumns: IColumn<Erc721TransferModel>[] = [
  {
    accessor: 'fromAddress',
    title: 'From',
    modifier: 'address',
    render: (data) => <Address address={data.fromAddress} type="account" isCopy />,
  },
  {
    accessor: 'toAddress',
    title: 'To',
    modifier: 'address',
    render: (data) => <Address address={`${data.toAddress}`} type="account" isCopy />,
  },
  {
    accessor: 'value',
    title: 'For',
    type: 'number',
    modifier: 'tokenValue',
    render: (data) => financialFormat(data.value),
  },
  {
    accessor: 'tokenSymbols',
    type: 'text',
    render: (data) => {
      return <Link href={AddressValues['token'].url(data.tokenAddress) || ''}>{data.tokenId}</Link>
    },
  },
]
