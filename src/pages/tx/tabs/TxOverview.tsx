import { FC } from 'react'
import clsx from 'clsx'
import styles from '../../Pages.module.scss'
import { TransactionModel } from '@/__generated__/resolvers-types'
import {
  Address,
  Copy,
  DateTime,
  Label,
  Properties,
  TimeAgo,
  Value,
} from '@/components'
import Separated from '@/components/Separated/Separated'
import StopwatchIcon from '@/images/icons/stop-watch.svg'
import IconVerify from '@/images/icons/verified.svg'
import { getNormalizedValue } from '@/lib/utils'

const TxOverview: FC<{ data: TransactionModel }> = ({ data }) => {
  return (
    <Properties
      data={[
        {
          title: 'Transaction Hash:',
          tooltip: '?',
          value: (
            <>
              {data.hash} <Copy text={data.hash} />
            </>
          ),
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
          title: 'Value:',
          tooltip: '?',
          value: <Value value={getNormalizedValue(data.value)} prefix="$" />,
        },
        {
          title: 'Transaction Action:',
          tooltip: '?',
          value: '',
        },
      ]}
    />
  )
}

export default TxOverview
