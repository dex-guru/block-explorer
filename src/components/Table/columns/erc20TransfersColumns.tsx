import { Erc20EventModel } from '@/__generated__/resolvers-types'
import { Address } from '@/components'
import { IColumn } from '@/components/Table/types'
import Token from '@/components/Token'
import TooltipAnchor from '@/components/TooltipAnchor'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'
import styles from '@/components/Tables/Erc20DataTable/Erc20DataTable.module.scss'

export const erc20TransfersColumns: IColumn<Erc20EventModel>[] = [
  {
    accessor: 'fromAddress',
    title: (
      <>
        Address Out{' '}
        <TooltipAnchor tooltip="The address where the token(s) were sent from." />
      </>
    ),
    modifier: 'address',
    render: (data) => (
      <div className={styles.data}>
        <div className={styles.dataRow}>
          <Address address={data.fromAddress} type="account" isCopy />
        </div>
      </div>
    ),
  },
  {
    accessor: 'toAddress',
    title: (
      <>
        Address In{' '}
        <TooltipAnchor tooltip="The address that received the token(s)." />
      </>
    ),
    modifier: 'address',
    render: (data) => (
      <div className={styles.data}>
        <div className={styles.dataRow}>
          <Address address={`${data.toAddress}`} type="account" isCopy />
        </div>
      </div>
    ),
  },
  {
    accessor: 'amounts',
    title: 'Quantity',
    type: 'number',
    modifier: 'tokenValue',
    render: (data) => (
      <div className={styles.data}>
        {data.amounts.map((amount, idx) => {
          return (
            <div className={styles.dataRow} key={idx}>
              <div className={styles.dataNumber}>
                {financialFormatLowValueHighPrecision(data.amounts[idx], {
                  highPrecession: true,
                })}
              </div>
            </div>
          )
        })}
      </div>
    ),
  },
  {
    accessor: 'tokenSymbols',
    title: 'Token',
    type: 'text',
    render: (data) => (
      <div className={styles.data}>
        {data.tokenAddresses?.map((addr, idx) => {
          return (
            <div className={styles.dataRow} key={idx}>
              <Token
                address={data.tokenAddresses[idx]}
                name={data.tokenNames[idx]}
                logo={data.tokenLogos[idx]}
                symbol={data.tokenSymbols[idx]}
              />
            </div>
          )
        })}
      </div>
    ),
  },
]
