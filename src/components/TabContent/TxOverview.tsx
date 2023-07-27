import { FC, useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { LoadingCard } from '../Loading'
import {
  ChainConfigModel,
  ChainStatsModel,
  Erc20EventModel,
  Erc721TransferModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import Card from '@/components/Card'
import Code from '@/components/Code'
import DateTime from '@/components/DateTime'
import Details from '@/components/Details'
import { IconCross, IconVerify, IconWatch } from '@/components/Icons'
import Label from '@/components/Label'
import Properties, { Property } from '@/components/Properties'
import Separated from '@/components/Separated/Separated'
import Table, {
  erc20ActionColumns,
  erc20TransfersColumns,
  nftTransfersColumns,
} from '@/components/Table'
import TimeAgo from '@/components/TimeAgo'
import Value from '@/components/Value'
import { GET_ERC20_EVENTS, GET_ERC721_EVENTS } from '@/lib/apollo/queries'
import {
  checkChainFeature,
  financialFormat,
  getNormalizedValue,
} from '@/lib/utils'
import { MAX_EVENTS_PER_PAGE } from '@/pages/tx/[tx]'
import styles from './TxOverview.module.scss'
import pageStyles from '@/pages/Pages.module.scss'

const TxOverview: FC<{
  data: TransactionModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
}> = ({ data, chainConfig, chainStats }) => {
  const [erc20TransfersData, setErc20TransfersData] = useState<
    Erc20EventModel[]
  >([])
  const [getErc2Events, { loading: loadingTransfers }] = useLazyQuery<{
    erc20Events: { total: number; data: Erc20EventModel[] }
  }>(GET_ERC20_EVENTS)

  const [erc20ActionsData, setErc20ActionsData] = useState<Erc20EventModel[]>(
    []
  )
  const [getErc2Actions, { loading: loadingActions }] = useLazyQuery<{
    erc20Events: { total: number; data: Erc20EventModel[] }
  }>(GET_ERC20_EVENTS)

  const [nftEventsData, setNftEventsData] = useState<Erc721TransferModel[]>([])
  const [getNft, { loading: loadingNft }] = useLazyQuery<{
    nftEvents: { total: number; data: Erc721TransferModel[] }
  }>(GET_ERC721_EVENTS)

  const [transfersTotal, setTransfersTotal] = useState(0)
  const [actionsTotal, setActionsTotal] = useState(0)
  const [nftTotal, setNftTotal] = useState(0)

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
    setTransfersTotal(result?.data?.erc20Events?.total || 0)

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
    setActionsTotal(result?.data?.erc20Events?.total || 0)

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
    setNftTotal(result?.data?.nftEvents?.total || 0)

    if (newData?.length) {
      setNftEventsData([...nftEventsData, ...newData])
    }
  }

  useEffect(() => {
    handleClickMoreTransfers()
    handleClickMoreActions()
    handleClickMoreNft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          icon={<IconWatch className={pageStyles.muted} />}
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
      title: 'Gas Limit & Usage by TX:',
      tooltip: `Maximum amount of gas allocated for the transaction & the amount eventually used. Normal  ${chainConfig.nativeCurrency.symbol}  transfers involve 21,000 gas units while contracts involve higher values.`,
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

  checkChainFeature(chainConfig, 'EIP1559') &&
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

  const countMoreTransfers = Math.min(
    transfersTotal - erc20TransfersData.length,
    MAX_EVENTS_PER_PAGE
  )
  const countMoreNft = Math.min(
    nftTotal - nftEventsData.length,
    MAX_EVENTS_PER_PAGE
  )
  const countMoreActions = Math.min(
    actionsTotal - erc20ActionsData.length,
    MAX_EVENTS_PER_PAGE
  )

  return (
    <>
      <Properties data={properties} />
      {(loadingTransfers || loadingActions || loadingNft) && <LoadingCard />}
      {(!!transfersTotal || !!actionsTotal || !!nftTotal) && (
        <Card>
          {!!transfersTotal && (
            <Details
              isOpen
              title={
                <div className={styles.cardTitle}>
                  ERC-20 Tokens Transferred:{' '}
                  <Label className={pageStyles.propertyIndicator}>
                    {transfersTotal}
                  </Label>
                </div>
              }
            >
              <Card
                actions={
                  countMoreTransfers > 0
                    ? [
                        {
                          caption: `Load ${countMoreTransfers} More Transfer${
                            countMoreTransfers > 1 ? 's' : ''
                          }`,
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

          {!!nftTotal && (
            <Details
              isOpen
              title={
                <div className={styles.cardTitle}>
                  NFT Tokens Transferred:{' '}
                  <Label className={pageStyles.propertyIndicator}>
                    {nftTotal}
                  </Label>
                </div>
              }
            >
              <Card
                actions={
                  countMoreNft > 0
                    ? [
                        {
                          caption: `Load ${countMoreNft} More NFT Transfer${
                            countMoreNft > 1 ? 's' : ''
                          }`,
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

          {!!actionsTotal && (
            <Details
              isOpen
              title={
                <div className={styles.cardTitle}>
                  Transaction Actions:{' '}
                  <Label className={pageStyles.propertyIndicator}>
                    {actionsTotal}
                  </Label>
                </div>
              }
            >
              <Card
                actions={
                  countMoreActions > 0
                    ? [
                        {
                          caption: `Load ${countMoreActions} More Action${
                            countMoreActions ? 's' : ''
                          }`,
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
