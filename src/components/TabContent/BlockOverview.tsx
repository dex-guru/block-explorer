import { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import styles from '../../pages/Pages.module.scss'
import { AddressValues } from '../Address/helpers'
import {
  Address,
  DateTime,
  IconLeft,
  IconRight,
  IconVerify,
  IconWatch,
  Properties,
  Separated,
  TimeAgo,
  Value,
} from '@/components'
import { financialFormat, getNormalizedValue, hex2ascii } from '@/lib/utils'
import { IBlockProps } from '@/pages/block/[block]'

const BlockOverview: FC<IBlockProps> = ({ data, chainConfig, chainStats }) => {
  if (!data?.number) {
    return null
  }

  const blockValues = AddressValues['block']

  const extraDataDisplay = hex2ascii(data.extraData)

  const mainProperties = [
    {
      title: 'Block Height:',
      value: (
        <div>
          {data.number}{' '}
          <Link
            data-tooltip-content="Previous Block"
            data-tooltip-id="app-tooltip"
            href={
              blockValues?.url ? blockValues?.url(`${data.number - 1}`) : ''
            }
            className={clsx(styles.pageTo, {
              [styles.disabled]: data.number < 2,
            })}
          >
            <IconLeft className={styles.icon} />
          </Link>{' '}
          <Link
            data-tooltip-content="Next Block"
            data-tooltip-id="app-tooltip"
            href={
              blockValues?.url ? blockValues?.url(`${data.number + 1}`) : ''
            }
            className={clsx(styles.pageTo, {
              [styles.disabled]: chainStats?.lastBlockNumber === data.number,
            })}
          >
            <IconRight className={styles.icon} />
          </Link>
        </div>
      ),
      tooltip: '?',
    },
    {
      title: 'Status:',
      tooltip: '?',
      value: (
        <Value
          icon={<IconVerify className={styles.icon} />}
          value="Finalized"
          className={styles.positive}
        />
      ),
    },
    {
      title: 'Timestamp:',
      tooltip: '?',
      value: (
        <Value
          icon={<IconWatch />}
          value={
            <>
              <TimeAgo timestamp={data.timestamp} showTooltip={false} />{' '}
              <span className={styles.muted}>
                (
                <DateTime timestamp={data.timestamp} className={styles.muted} />
                )
              </span>
            </>
          }
        />
      ),
    },
    {
      title: 'Transactions:',
      tooltip: '?',
      value: data.transactionCount ? (
        <Link href={`/txs?block=${data.number}?`}>
          {financialFormat(data.transactionCount)} transactions in this block
        </Link>
      ) : null,
    },
    {
      title: 'Fee Recipient:',
      tooltip: '?',
      value: (
        <Address type="account" address={data.miner} isShorten={false} isCopy />
      ),
    },
    {
      title: 'Block Reward:',
      tooltip: '?',
      value: (
        <Value
          value={getNormalizedValue(
            data.gasUsed * data.baseFeePerGas,
            chainConfig.nativeCurrency.decimals
          )}
          suffix={<>&nbsp;${chainConfig.nativeCurrency.symbol}</>}
        />
      ),
    },
    {
      title: 'Size:',
      tooltip: '?',
      value: financialFormat(data.size),
    },
    {
      title: 'Gas Used:',
      tooltip: data.gasUsed,
      value: (
        <Separated>
          <div>{financialFormat(data.gasUsed)}</div>
          <Value value={(data.gasUsed * 100) / data.gasLimit} suffix="%" />
        </Separated>
      ),
    },
    {
      title: 'Gas Limit:',
      tooltip: '?',
      value: financialFormat(data.gasLimit),
    },
    {
      title: 'Base Fee Per Gas:',
      tooltip: '?',
      value: (
        <Value
          value={getNormalizedValue(data.baseFeePerGas || 0)}
          suffix={<>&nbsp;{chainConfig.nativeCurrency.symbol}</>}
        />
      ),
    },
    {
      title: 'Extra Data:',
      tooltip: '?',
      value: (
        <Separated>
          {!!extraDataDisplay && <span>{extraDataDisplay}</span>}
          <Address address={data.extraData} isCopy={!!extraDataDisplay} />
        </Separated>
      ),
    },
  ]

  const extraProperties = [
    {
      title: 'Hash: ',
      tooltip: '?',
      value: <Address address={data.hash} isCopy />,
    },
    {
      title: 'Parent Hash: ',
      tooltip: '?',
      value: <Address address={data.parentHash} isCopy />,
    },
    {
      title: 'StateRoot: ',
      tooltip: '?',
      value: <Address address={data.stateRoot} isCopy />,
    },
    {
      title: 'Nonce: ',
      tooltip: '?',
      value: <Address address={data.nonce} isCopy />,
    },
  ]

  return (
    <>
      <Properties data={mainProperties} />

      <Properties data={extraProperties} />
    </>
  )
}

export default BlockOverview
