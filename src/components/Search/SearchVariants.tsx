import { FC, useState } from 'react'
import Link from 'next/link'
import { Address, Copy, TimeAgo } from '..'
import clsx from 'clsx'
import { AddressValues } from '../Address/helpers'
import Avatar from '../Avatar'
import Card from '../Card'
import TabPanel from '../TabPanel'
import Tile from '../Tile'
import { SearchVariantsProps } from './types'
import styles from './Search.module.scss'

const SearchVariants: FC<SearchVariantsProps> = ({ data, className }) => {
  const [resultsTab, setResultsTab] = useState<string | null>(null)

  if (!data) {
    return null
  }

  const tabs = []

  if (data.addresses?.length) {
    const renderedContent = data.addresses?.map((account) => {
      const addressValues = AddressValues['account']

      return (
        <li className={styles.item} key={account.address}>
          <Link
            className={styles.link}
            href={
              addressValues?.url
                ? addressValues?.url(account.address || '')
                : ''
            }
          >
            <Tile
              className={styles.variant}
              icon={
                <Avatar address={account.address} className={styles.avatar} />
              }
              title={account.address}
              postfix={account.addressType}
            />
          </Link>
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
      const blockValues = AddressValues['block']

      return (
        <li className={styles.item} key={block.number}>
          <Link
            className={styles.link}
            href={
              blockValues?.url ? blockValues?.url(block.number.toString()) : ''
            }
          >
            <Tile
              className={styles.variant}
              icon={<Avatar letters="Bk" className={styles.avatar} />}
              title={block.number}
              postfix={`${block.transactionCount} txs`}
            />
          </Link>
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
    const renderedContent = data.transactions?.map((tx) => {
      const txValues = AddressValues['tx']

      return (
        <li className={styles.item} key={tx.hash}>
          <Link
            className={styles.link}
            href={txValues?.url ? txValues?.url(tx.hash) : ''}
          >
            <Tile
              className={styles.variant}
              icon={
                <Avatar letters="Tx" type="rounded" className={styles.avatar} />
              }
              title={<Address address={tx.hash} type="tx" isLink={false} />}
              postfix={<TimeAgo timestamp={tx.blockTimestamp} />}
            />
          </Link>
          <Copy text={tx.hash} className={styles.copy} />
        </li>
      )
    })

    tabs.push({
      title: 'Transactions',
      value: 'txs',
      onClick: () => {
        setResultsTab('txs')
      },
      content: <ul className={styles.list}>{renderedContent}</ul>,
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
