import { FC, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import pageStyles from '../../app/Pages.module.scss'
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
  IconCross,
  Label,
  Properties,
  Table,
  TimeAgo,
  Value,
} from '@/components'
import Separated from '@/components/Separated/Separated'
import StopwatchIcon from '@/images/icons/stop-watch.svg'
import IconVerify from '@/images/icons/verified.svg'
import { GET_ERC20_EVENTS, GET_ERC721_EVENTS } from '@/lib/apollo/queries'
import { financialFormat, getNormalizedValue } from '@/lib/utils'
import { MAX_EVENTS_PER_PAGE, TxEventsData } from '@/pages/tx/[tx]'
import styles from './TxOverview.module.scss'

const TxOverview: FC<{
  data: TransactionModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
  erc20Transfers: TxEventsData<Erc20EventModel>
  erc20Actions: TxEventsData<Erc20EventModel>
  nftEvents: TxEventsData<Erc721TransferModel>
}> = ({
  data,
  chainConfig,
  chainStats,
  erc20Transfers,
  erc20Actions,
  nftEvents,
}) => {
  const [erc20TransfersData, setErc20TransfersData] = useState(
    erc20Transfers.data || []
  )
  const [getErc2Events, { loading: loadingTransfers }] = useLazyQuery<{
    erc20Events: { total: number; data: Erc20EventModel[] }
  }>(GET_ERC20_EVENTS)

  const [erc20ActionsData, setErc20ActionsData] = useState(
    erc20Actions.data || []
  )
  const [getErc2Actions, { loading: loadingActions }] = useLazyQuery<{
    erc20Events: { total: number; data: Erc20EventModel[] }
  }>(GET_ERC20_EVENTS)

  const [nftEventsData, setNftEventsData] = useState(nftEvents.data || [])
  const [getNft, { loading: loadingNft }] = useLazyQuery<{
    nftEvents: { total: number; data: Erc721TransferModel[] }
  }>(GET_ERC721_EVENTS)

  const handleClickMoreTransfers = async () => {
    const result = await getErc2Events({
      variables: {
        hash: data.hash,
        eventTypes: 'transfers',
        first: MAX_EVENTS_PER_PAGE,
        skip: erc20TransfersData.length,
      },
    })

    const newData = result?.data?.erc20Events?.data

    if (newData?.length) {
      setErc20TransfersData([...erc20TransfersData, ...newData])
    }
  }

  const handleClickMoreActions = async () => {
    const result = await getErc2Actions({
      variables: {
        hash: data.hash,
        eventTypes: 'actions',
        first: MAX_EVENTS_PER_PAGE,
        skip: erc20ActionsData.length,
      },
    })

    const newData = result?.data?.erc20Events?.data

    if (newData?.length) {
      setErc20ActionsData([...erc20ActionsData, ...newData])
    }
  }

  const handleClickMoreNft = async () => {
    const result = await getNft({
      variables: {
        hash: data.hash,
        first: MAX_EVENTS_PER_PAGE,
        skip: nftEventsData.length,
      },
    })

    const newData = result?.data?.nftEvents?.data

    if (newData?.length) {
      setNftEventsData([...nftEventsData, ...newData])
    }
  }

  const gigaNative = <>&nbsp;{chainConfig.gasUnit}</>

  const IconStatus = data.receiptStatus ? IconVerify : IconCross

  const properties: Property[] = [
    {
      title: 'Status:',
      tooltip: 'The status of the transaction.',
      value: (
        <Value
          icon={<IconStatus className={pageStyles.icon} />}
          value={data.receiptStatus ? 'Success' : 'Failed'}
          className={clsx({
            [pageStyles.positive]: !!data.receiptStatus,
            [pageStyles.negative]: !data.receiptStatus,
          })}
        />
      ),
    },
    {
      title: 'Block:',
      tooltip:
        'Number of the block in which the transaction is recorded. Block confirmations indicate how many blocks have been added since the transaction was produced.',
      value: <Address type="block" address={`${data.blockNumber}`} />,
    },
    {
      title: 'Timestamp:',
      tooltip: 'The date and time at which a transaction is produced.',
      value: (
        <Value
          icon={<StopwatchIcon className={pageStyles.muted} />}
          value={<TimeAgo timestamp={data.blockTimestamp} />}
          suffix={
            <>
              &nbsp;
              <DateTime
                timestamp={data.blockTimestamp}
                className={pageStyles.muted}
              />
            </>
          }
        />
      ),
    },
    {
      title: 'From | Nonce:',
      tooltip: 'The sending party of the transaction.',
      value: (
        <Separated>
          <Address
            address={data.fromAddress}
            type="account"
            isShorten={false}
            isCopy
          />
          <Label type="tag" className={pageStyles.success}>
            {data.nonce}
          </Label>
        </Separated>
      ),
    },
    {
      title: 'Interacted With (To):',
      tooltip:
        'The receiving party of the transaction (could be a contract address).',
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

  const bigTxFee = new BigNumber(data.receiptGasUsed || 0).multipliedBy(
    data.receiptEffectiveGasPrice || 0
  )

  const priceProperties = [
    {
      title: 'Value:',
      tooltip:
        'The value being transacted in Ether and fiat value. Note: You can click the fiat value (if available) to see historical value at the time of transaction.',
      value: (
        <Separated>
          <Value
            value={getNormalizedValue(data.value)}
            suffix={<>&nbsp;{chainConfig.nativeCurrency.symbol}</>}
          />
          <Value
            value={getNormalizedValue(
              data.value * chainStats.nativeTokenPriceUsd
            )}
            prefix="$"
          />
        </Separated>
      ),
    },
    {
      title: 'Transaction Fee:',
      tooltip:
        'Amount paid to the block producer for processing the transaction.',
      value: (
        <Separated>
          <Value
            value={getNormalizedValue(
              bigTxFee,
              chainConfig.nativeCurrency.decimals
            )}
            suffix={<>&nbsp;{chainConfig.nativeCurrency.symbol}</>}
          />
          <Value
            value={getNormalizedValue(
              bigTxFee.multipliedBy(chainStats.nativeTokenPriceUsd),
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
      tooltip:
        'Cost per unit of gas specified for the transaction, in Ether and Gwei. The higher the gas price the higher chance of getting included in a block.',
      value: (
        <Separated>
          <Value
            value={getNormalizedValue(
              data.receiptEffectiveGasPrice || 0,
              chainConfig.nativeCurrency.decimals - 9
            )}
            suffix={gigaNative}
          />
          <Value
            value={getNormalizedValue(
              data.receiptEffectiveGasPrice || 0,
              chainConfig.nativeCurrency.decimals
            )}
            suffix={<>&nbsp;{chainConfig.nativeCurrency.symbol}</>}
          />
        </Separated>
      ),
    },
  ]

  const detailsProperties = [
    {
      title: 'Gas Limit & Usage by Txn:',
      tooltip:
        'Maximum amount of gas allocated for the transaction & the amount eventually used. Normal ETH transfers involve 21,000 gas units while contracts involve higher values.',
      value: (
        <Separated>
          <Value value={financialFormat(data.gas)} />
          <Value value={financialFormat(data.receiptGasUsed)} />
          <Value
            value={financialFormat((data.receiptGasUsed * 100) / data.gas)}
            suffix="%"
          />
        </Separated>
      ),
    },

    {
      title: 'Other Attributes:',
      tooltip: 'Other data related to this transaction.',
      value: <Value value={financialFormat(data.transactionIndex)} />,
    },
    {
      title: 'Input Data:',
      tooltip:
        'Additional data included for this transaction. Commonly used as part of contract interaction or as a message sent to the recipient.',
      value: (
        <Code defaultFormat="hex" isCopy>
          {data.input}
        </Code>
      ),
    },
  ]
  chainConfig.features.some((x) => x.name === 'EIP1559') &&
    detailsProperties.splice(1, 0, {
      title: 'Gas Fees:',
      tooltip:
        'Base Fee refers to the network Base Fee at the time of the block, while Max Fee & Max Priority Fee refer to the max amount a user is willing to pay for their tx & to give to the block producer respectively.',
      value: (
        <Separated>
          <Value
            prefix={<>Base&nbsp;</>}
            value={getNormalizedValue(data.gasPrice, 9)}
            suffix={gigaNative}
          />
          <Value
            prefix={<>Max&nbsp;</>}
            value={getNormalizedValue(data.maxFeePerGas || 0, 9)}
            suffix={gigaNative}
          />
          <Value
            prefix={<>Max Priority&nbsp;</>}
            value={getNormalizedValue(data.maxPriorityFeePerGas || 0, 9)}
            suffix={gigaNative}
          />
        </Separated>
      ),
    })

  const countMoreTransfers = erc20Transfers?.total - erc20TransfersData.length
  const countMoreNft = erc20Transfers?.total - nftEventsData.length
  const countMoreActions = erc20Actions?.total - erc20ActionsData.length

  return (
    <>
      <Properties data={properties} />
      {(!!erc20Transfers?.total ||
        !!erc20Actions?.total ||
        !!nftEvents?.total) && (
        <Card>
          {!!erc20Transfers?.total && (
            <Details
              isOpen
              title={
                <>
                  ERC-20 Tokens Transferred:{' '}
                  <Label className={pageStyles.propertyIndicator}>
                    {erc20Transfers?.total}
                  </Label>
                </>
              }
            >
              <Card
                actions={
                  countMoreTransfers > 0
                    ? [
                        {
                          caption: `Load ${countMoreTransfers} More Transfers`,
                          onClick: handleClickMoreTransfers,
                          disabled: loadingTransfers,
                        },
                      ]
                    : undefined
                }
                className={styles.innerCard}
              >
                <Table
                  className={styles.table}
                  data={erc20TransfersData}
                  columns={erc20TransfersColumns}
                />
              </Card>
            </Details>
          )}

          {!!nftEvents.total && (
            <Details
              isOpen
              title={
                <>
                  NFT Tokens Transferred:{' '}
                  <Label className={pageStyles.propertyIndicator}>
                    {nftEvents.total}
                  </Label>
                </>
              }
            >
              <Card
                actions={
                  countMoreNft > 0
                    ? [
                        {
                          caption: `Load ${countMoreNft} More NFT Transfers`,
                          onClick: handleClickMoreNft,
                          disabled: loadingNft,
                        },
                      ]
                    : undefined
                }
                className={styles.innerCard}
              >
                <Table
                  className={styles.table}
                  data={nftEventsData}
                  columns={nftTransfersColumns}
                />
              </Card>
            </Details>
          )}

          {!!erc20Actions.total && (
            <Details
              isOpen
              title={
                <>
                  Transaction Actions:{' '}
                  <Label className={pageStyles.propertyIndicator}>
                    {erc20Actions.total}
                  </Label>
                </>
              }
            >
              <Card
                actions={
                  countMoreActions > 0
                    ? [
                        {
                          caption: `Load ${countMoreActions} More Actions`,
                          onClick: handleClickMoreActions,
                          disabled: loadingActions,
                        },
                      ]
                    : undefined
                }
                className={styles.innerCard}
              >
                <Table
                  className={styles.table}
                  data={erc20ActionsData}
                  columns={erc20ActionColumns}
                />
              </Card>
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
