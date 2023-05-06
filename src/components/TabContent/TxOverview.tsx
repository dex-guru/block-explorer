import { FC } from 'react'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import styles from '../../pages/Pages.module.scss'
import { Property } from '../Properties/types'
import {
  erc20ActionColumns,
  erc20TransfersColumns,
  nftTransfersColumns,
} from '../Table'
import {
  ChainConfigModel,
  ChainStatsModel,
  Erc20EventModel,
  Erc721TransferModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import {
  Address,
  Card,
  Code,
  DateTime,
  Details,
  Label,
  Properties,
  Table,
  TimeAgo,
  Value,
} from '@/components'
import Separated from '@/components/Separated/Separated'
import StopwatchIcon from '@/images/icons/stop-watch.svg'
import IconVerify from '@/images/icons/verified.svg'
import { financialFormat, getNormalizedValue } from '@/lib/utils'

const TxOverview: FC<{
  data: TransactionModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
  erc20Events: Erc20EventModel[]
  nftEvents: Erc721TransferModel[]
}> = ({ data, chainConfig, chainStats, erc20Events, nftEvents }) => {
  const gigaNative = ` G${chainConfig.nativeCurrency.symbol.toLowerCase()}`

  const transfers = erc20Events.filter(
    (event) => event.eventType === 'transfer'
  )
  const actions = erc20Events.filter((event) => event.eventType !== 'transfer')

  const properties: Property[] = [
    {
      title: 'Status:',
      tooltip: '?',
      value: (
        <Value
          icon={
            !!data.receiptStatus ? (
              <IconVerify className={styles.icon} />
            ) : undefined
          }
          value={data.receiptStatus ? 'Success' : 'Failed'}
          className={clsx({
            [styles.positive]: !!data.receiptStatus,
            [styles.negative]: !data.receiptStatus,
          })}
        />
      ),
    },
    {
      title: 'Block / Position:',
      tooltip: '?',
      value: <Address type="block" address={`${data.blockNumber}`} />,
    },
    {
      title: 'Timestamp:',
      tooltip: '?',
      value: (
        <Value
          icon={<StopwatchIcon className={styles.muted} />}
          value={<TimeAgo timestamp={data.blockTimestamp} />}
          suffix={
            <>
              {' '}
              <DateTime
                timestamp={data.blockTimestamp}
                className={styles.muted}
              />
            </>
          }
        />
      ),
    },
    {
      title: 'From / Nonce:',
      tooltip: '?',
      value: (
        <Separated>
          <Address
            address={data.fromAddress}
            type="account"
            isShorten={false}
            isCopy
          />
          <Label type="tag" className={styles.success}>
            {data.nonce}
          </Label>
        </Separated>
      ),
    },
    {
      title: 'Interacted With (To):',
      tooltip: '?',
      value: data.toAddress ? (
        <Address
          address={data.toAddress}
          type="account"
          isShorten={false}
          isCopy
        />
      ) : null,
    },
  ]

  const priceProperties = [
    {
      title: 'Value:',
      tooltip: '?',
      value: (
        <Value
          value={getNormalizedValue(data.value)}
          suffix={` ${chainConfig.nativeCurrency.symbol}`}
        />
      ),
    },
    {
      title: 'Transaction Fee:',
      tooltip: '',
      value: (
        <Separated>
          <Value
            value={getNormalizedValue(
              new BigNumber(data.receiptCumulativeGasUsed || 0).multipliedBy(
                data.gasPrice || 0
              ),
              chainConfig.nativeCurrency.decimals
            )}
            suffix={` ${chainConfig.nativeCurrency.symbol}`}
          />
          <Value
            value={getNormalizedValue(
              new BigNumber(data.receiptCumulativeGasUsed || 0)
                .multipliedBy(data.gasPrice || 0)
                .multipliedBy(chainStats.nativeTokenPriceUsd),
              chainConfig.nativeCurrency.decimals,
              { decimals: 2 }
            )}
            prefix="$"
          />
        </Separated>
      ),
    },
    {
      title: 'Gas Price:',
      tooltip: '?',
      value: (
        <Separated>
          <Value
            value={getNormalizedValue(
              data.gasPrice,
              chainConfig.nativeCurrency.decimals - 9
            )}
            suffix={` ${gigaNative}`}
          />
          <Value
            value={getNormalizedValue(
              data.gasPrice,
              chainConfig.nativeCurrency.decimals
            )}
            suffix={` ${chainConfig.nativeCurrency.symbol}`}
          />
        </Separated>
      ),
    },
  ]

  const detailsProperties = [
    {
      title: 'Gas Limit & Usage by Txn:',
      tooltip: '?',
      value: (
        <Separated>
          <Value value={financialFormat(data.gas)} />
          <Value value={financialFormat(data.receiptCumulativeGasUsed)} />
          <Value
            value={financialFormat(
              (data.receiptCumulativeGasUsed * 100) / data.gas
            )}
            suffix="%"
          />
        </Separated>
      ),
    },
    {
      title: 'Gas Fees:',
      tooltip: '?',
      value: (
        <Separated>
          <Value
            prefix="Base: "
            value={getNormalizedValue(
              data.gasPrice,
              chainConfig.nativeCurrency.decimals - 9
            )}
            suffix={gigaNative}
          />
          <Value
            prefix="Max: "
            value={getNormalizedValue(data.maxFeePerGas || 0, 9)}
            suffix={gigaNative}
          />
          <Value
            prefix="Max Priority: "
            value={getNormalizedValue(data.maxPriorityFeePerGas || 0, 9)}
            suffix={gigaNative}
          />
        </Separated>
      ),
    },
    {
      title: 'Other Attributes:',
      tooltip: '?',
      value: <Value value={financialFormat(data.transactionIndex)} />,
    },
    {
      title: 'Input Data:',
      tooltip: '?',
      value: (
        <Code defaultFormat="hex" isCopy>
          {data.input}
        </Code>
      ),
    },
  ]

  return (
    <>
      <Properties data={properties} />
      {(!!transfers?.length || !!actions?.length || !!nftEvents?.length) && (
        <Card>
          {!!transfers.length && (
            <Details
              isOpen
              title={
                <>
                  ERC-20 Tokens Transferred:{' '}
                  <Label className={styles.propertyIndicator}>
                    {erc20Events.length}
                  </Label>
                </>
              }
            >
              <Table data={transfers} columns={erc20TransfersColumns} />
            </Details>
          )}

          {!!nftEvents.length && (
            <Details
              isOpen
              title={
                <>
                  NFT Tokens Transferred:{' '}
                  <Label className={styles.propertyIndicator}>
                    {nftEvents.length}
                  </Label>
                </>
              }
            >
              <Table data={nftEvents} columns={nftTransfersColumns} />
            </Details>
          )}

          {!!actions.length && (
            <Details
              isOpen
              title={
                <>
                  Transaction Actions:{' '}
                  <Label className={styles.propertyIndicator}>
                    {actions.length}
                  </Label>
                </>
              }
            >
              <Table data={actions} columns={erc20ActionColumns} />
            </Details>
          )}
        </Card>
      )}
      <Properties data={priceProperties} />
      <Properties data={detailsProperties} />
    </>
  )
}

export default TxOverview
