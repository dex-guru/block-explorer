import { FC } from 'react'
import Link from 'next/link'
import clsx from 'clsx'
import styles from '../../pages/Pages.module.scss'
import { AddressValues } from '../Address/helpers'
import {
  Address,
  Code,
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

  const mainProperties = [
    {
      title: 'Block Height:',
      tooltip:
        'Also known as Block Number. The block height, which indicates the length of the blockchain, increases after the addition of the new block.',
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
    },
    {
      title: 'Status:',
      tooltip: 'The finality status of the block. ',
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
      tooltip: 'The date and time at which a block is produced.',
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
      tooltip:
        'The number of transactions in the block. Internal transaction is transactions as a result of contract execution that involves Ether value.',
      value: data.transactionCount ? (
        <Link href={`/txs?block=${data.number}?`}>
          {financialFormat(data.transactionCount)} transactions in this block
        </Link>
      ) : null,
    },
    {
      title: 'Fee Recipient:',
      tooltip: 'Address receiving fees from transactions in this block',
      value: (
        <Address type="account" address={data.miner} isShorten={false} isCopy />
      ),
    },
    {
      title: 'Block Reward:',
      tooltip:
        'For each block, the block producer is rewarded with a finite amount of Ether on top of the fees paid for all transactions in the block.',
      value: (
        <Value
          value={getNormalizedValue(
            data.gasUsed * data.baseFeePerGas,
            chainConfig?.nativeCurrency.decimals
          )}
          suffix={<>&nbsp;${chainConfig?.nativeCurrency.symbol}</>}
        />
      ),
    },
    {
      title: 'Size:',
      tooltip:
        "The block size is actually determined by the block's gas limit.",
      value: financialFormat(data.size),
    },
    {
      title: 'Gas Used:',
      tooltip:
        'The total gas used in the block and its percentage of gas filled in the block.',
      value: (
        <Separated>
          <div>{financialFormat(data.gasUsed)}</div>
          <Value value={(data.gasUsed * 100) / data.gasLimit} suffix="%" />
        </Separated>
      ),
    },
    {
      title: 'Gas Limit:',
      tooltip: 'Total gas limit provided by all transactions in the block.',
      value: financialFormat(data.gasLimit),
    },
    {
      title: 'Base Fee Per Gas:',
      tooltip:
        'Post-London Upgrade, this represents the minimum gasUsed multiplier required for a tx to be included in a block. ',
      value: (
        <Value
          value={getNormalizedValue(data.baseFeePerGas || 0)}
          suffix={<>&nbsp;{chainConfig?.nativeCurrency.symbol}</>}
        />
      ),
    },
    {
      title: 'Extra Data:',
      tooltip:
        'Any data that can be included by the block producer in the block.',
      value: (
        <Code
          isCopy
          defaultFormat="hex"
          format={{ hex: true, decode: hex2ascii }}
        >
          {data.extraData}
        </Code>
      ),
    },
  ]

  const extraProperties = [
    {
      title: 'Hash: ',
      tooltip: 'The hash of the block header of the current block.',
      value: <Address address={data.hash} isCopy />,
    },
    {
      title: 'Parent Hash: ',
      tooltip:
        'The hash of the block from which this block was generated, also known as its parent block.',
      value: <Address address={data.parentHash} isCopy />,
    },
    {
      title: 'StateRoot: ',
      tooltip: 'The root of the state trie',
      value: <Address address={data.stateRoot} isCopy />,
    },
    {
      title: 'Nonce: ',
      tooltip:
        'Block nonce is a value used during mining to demonstrate proof of work for a block.',
      value: (
        <Code defaultFormat="hex" format={{ dec: true, hex: true }}>
          {data.nonce}
        </Code>
      ),
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
