import { FC } from 'react'
import clsx from 'clsx'
import styles from '../../pages/Pages.module.scss'
import { TransactionModel } from '@/__generated__/resolvers-types'
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

const TxOverview: FC<{ data: TransactionModel }> = ({ data }) => {
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
      title: 'ERC-20 Tokens Transferred: 2:', // TODO: 2 is tx count
      tooltip: '?',
      value: <Value value={getNormalizedValue(data.value)} prefix="$" />,
    },
    {
      title: 'ERC-721 Tokens Transferred:', // TODO: 2 is tx count
      tooltip: '?',
      value: <Value value={getNormalizedValue(data.value)} prefix="$" />,
    },
    {
      title: 'Transaction Action:', // TODO: swap + burn + mint
      tooltip: '?',
      value: '',
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
            data.receiptCumulativeGasUsed * data.gasPrice // TODO: multiply it to chainsStats.usd
          )}
          suffix=" CANTO" // TODO: in Native price
        />
      ),
    },
    {
      title: 'Gas Price:', // TODO: swap + burn + mint
      tooltip: '?',
      value: (
        <Value value={getNormalizedValue(data.gasPrice)} suffix={' CANTO'} />
      ), // TODO chainConfig.tokenName
    },
  ]

  const detailsProperties = [
    {
      title: 'Gas Limit & Usage by Txn:', // TODO: swap + burn + mint
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
      title: 'Gas Fees:', // TODO: swap + burn + mint
      tooltip: '?',
      value: (
        <Separated>
          <Value
            prefix="Base: "
            value={getNormalizedValue(data.gasPrice, 9)}
            suffix=" Gcanto"
          />
          {/* // TODO: 9 is toiken decimals - 9 */}
          {/* // TODO: Gcanto is weiName || nativeTokenName */}
          <Value
            prefix="Max: "
            value={getNormalizedValue(data.maxFeePerGas || 0, 9)}
            suffix=" Gcanto"
          />
          <Value
            prefix="Max Priority: "
            value={getNormalizedValue(data.maxPriorityFeePerGas || 0, 9)}
            suffix=" Gcanto"
          />
        </Separated>
      ),
    },
    {
      title: 'Other Attributes:', // TODO: swap + burn + mint
      tooltip: '?',
      value: <Value value={financialFormat(data.transactionIndex)} />,
    },
    {
      title: 'Input Data:', // TODO: swap + burn + mint
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
