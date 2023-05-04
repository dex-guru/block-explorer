import { FC } from 'react'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import styles from '../../pages/Pages.module.scss'
import {
  ChainConfigModel,
  ChainStatsModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import {
  Address,
  Code,
  DateTime,
  Label,
  Properties,
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
}> = ({ data, chainConfig, chainStats }) => {
  const gigaNative = ` G${chainConfig.nativeCurrency.symbol.toLowerCase()}`

  const properties = [
    {
      title: 'Transaction Hash:',
      tooltip: '?',
      value: <Address address={data.hash} isLink={false} isCopy />,
    },
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
    {
      title: 'ERC-20 Tokens Transferred: ', // TODO: tx count label
      tooltip: '?',
      value: '', // list erc20 tokens as etherscan
    },
    {
      title: 'ERC-721 Tokens Transferred:', // TODO: tx count label
      tooltip: '?',
      value: '', // list erc721 tokens as etherscan
    },
    {
      title: 'Transaction Action:', // TODO: tx count label
      tooltip: '?',
      value: '', // TODO: swap + burn + mint
    },
    {
      title: 'Value:',
      tooltip: '?',
      value: <Value value={getNormalizedValue(data.value)} prefix="$" />,
    },
    {
      title: 'Transaction Fee:',
      tooltip: '',
      value: (
        <Value
          value={getNormalizedValue(
            new BigNumber(data.receiptCumulativeGasUsed || 0)
              .multipliedBy(data.gasPrice || 0)
              .multipliedBy(chainStats.nativeTokenPriceUsd || 0)
          )}
          suffix={` ${chainConfig.nativeCurrency.symbol}`}
        />
      ),
    },
    {
      title: 'Gas Price:',
      tooltip: '?',
      value: (
        <Value
          value={getNormalizedValue(data.gasPrice)}
          suffix={` ${chainConfig.nativeCurrency.symbol}`}
        />
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
      value: <Code>{data.input}</Code>,
    },
  ]

  return (
    <>
      <Properties data={properties} />
      <Properties data={detailsProperties} />
    </>
  )
}

export default TxOverview
