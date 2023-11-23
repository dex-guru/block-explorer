import { FC, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { SearchVariantsProps } from './types'
import Address from '@/components/Address'
import { AddressValues } from '@/components/Address/helpers'
import Avatar from '@/components/Avatar'
import { IconBlock } from '@/components/Icons'
import Label from '@/components/Label'
import TabPanel from '@/components/TabPanel'
import Table from '@/components/Table'
import { searchTxsColumns } from '@/components/Table/columns/searchTxsColumns'
import Tile from '@/components/Tile'
import styles from './Search.module.scss'

const SearchVariants: FC<SearchVariantsProps> = ({ data, className }) => {
  const [resultsTab, setResultsTab] = useState<string | null>(null)
  const router = useRouter()

  if (!data) {
    return null
  }

  const tabs = []

  if (data.addresses?.length) {
    const renderedContent = data.addresses?.map((account) => {
      const addressIcon = account.logoURL ? (
        <Image
          src={account.logoURL}
          alt={account.symbol || ''}
          className={styles.icon}
          width={32}
          height={32}
        />
      ) : (
        <Avatar address={account.address} className={styles.icon} />
      )

      const addressTitle = account.symbol ? (
        `${account.symbol}${account.name !== account.symbol ? ` (${account.name})` : ''} `
      ) : (
        <Address
          address={account.address}
          type="account"
          isCopy
          isShorten={false}
          className={styles.address}
          isLink={false}
        />
      )

      return (
        <li
          className={styles.item}
          key={account.address}
          onClick={() => {
            router.push(AddressValues['account'].url(account.address) || '')
          }}>
          <Tile
            className={styles.variant}
            icon={addressIcon}
            title={addressTitle}
            postfix={
              <Label type="tag" className={styles.tag}>
                {account.addressType === 'smart_contract' ? 'Smart Contract' : 'Address'}
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
    const renderedContent = data.blocks?.map((block) => {
      return (
        <li
          className={styles.item}
          key={block.number}
          onClick={() => {
            router.push(AddressValues['block'].url(block.number.toString()) || '')
          }}>
          <Tile
            className={styles.variant}
            icon={<IconBlock className={styles.avatar} />}
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
            router.push(AddressValues['account']?.url(data.hash) || '')
          }}
        />
      ),
    })
  }

  return (
    <TabPanel
      className={clsx(styles.tabs, className)}
      tabs={tabs}
      value={resultsTab || tabs[0]?.value || ''}
    />
  )
}

export default SearchVariants
