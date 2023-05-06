import { FC, useState } from 'react'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { AddressValues } from '../Address/helpers'
import Avatar from '../Avatar'
import Card from '../Card'
import TabPanel from '../TabPanel'
import { searchTxsColumns } from '../Table/columns/searchTxsColumns'
import Tile from '../Tile'
import { SearchVariantsProps } from './types'
import { Address, Label, Table } from '@/components'
import styles from './Search.module.scss'

const SearchVariants: FC<SearchVariantsProps> = ({ data, className }) => {
  const [resultsTab, setResultsTab] = useState<string | null>(null)
  const router = useRouter()

  if (!data) {
    return null
  }

  const tabs = []

  if (data.addresses?.length) {
    const accountValue = AddressValues['account']

    const renderedContent = data.addresses?.map((account) => {
      const url = accountValue?.url ? accountValue?.url(account.address) : ''

      return (
        <li
          className={styles.item}
          key={account.address}
          onClick={() => {
            router.push(url)
          }}
        >
          <Tile
            className={styles.variant}
            icon={
              <Avatar address={account.address} className={styles.avatar} />
            }
            title={
              <Address
                address={account.address}
                type="account"
                isCopy
                isShorten={false}
                className={styles.address}
              />
            }
            postfix={
              <Label type="tag" className={styles.tag}>
                {account.addressType === 'smart_contract'
                  ? 'Smart Contract'
                  : 'Address'}
              </Label>
            }
          />
        </li>
      )
    })

    tabs.push({
      title: 'Addresses',
      value: 'addresses',
      onClick: () => {
        setResultsTab('addresses')
      },
      content: <ul className={styles.list}>{renderedContent}</ul>,
    })
  }

  if (data.blocks?.length) {
    const blockValue = AddressValues['account']

    const renderedContent = data.blocks?.map((block) => {
      const url = blockValue?.url
        ? blockValue?.url(block.number.toString())
        : ''

      return (
        <li
          className={styles.item}
          key={block.number}
          onClick={() => {
            router.push(url)
          }}
        >
          <Tile
            className={styles.variant}
            icon={<Avatar letters="Bk" className={styles.avatar} />}
            title={
              <Address
                address={block.number.toString()}
                type="block"
                isCopy
                className={styles.address}
              />
            }
            postfix={`${block.transactionCount} txs`}
          />
        </li>
      )
    })

    tabs.push({
      title: 'Blocks',
      value: 'blocks',
      onClick: () => {
        setResultsTab('blocks')
      },
      content: <ul className={styles.list}>{renderedContent}</ul>,
    })
  }

  if (data.transactions?.length) {
    const blockValue = AddressValues['account']

    tabs.push({
      title: 'Transactions',
      value: 'txs',
      onClick: () => {
        setResultsTab('txs')
      },
      content: (
        <Table
          className={styles.table}
          columns={searchTxsColumns}
          data={data.transactions}
          showHeader={false}
          onRowClick={(data) => {
            if (blockValue?.url) {
              router.push(blockValue?.url(data.hash))
            }
          }}
        />
      ),
    })
  }

  return (
    <Card className={clsx(styles.variants, className)}>
      <TabPanel
        className={styles.tabs}
        tabs={tabs}
        value={resultsTab || tabs[0]?.value || ''}
      />
    </Card>
  )
}

export default SearchVariants
