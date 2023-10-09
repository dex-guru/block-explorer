import { FC, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLazyQuery, useQuery } from '@apollo/client'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { Abi } from 'abitype'
import { isAddress, getAddress } from 'viem'
import Ad from '../Ad'
import { IContractViewProps } from './types'
import {
  ContractCreatorModel,
  TokenBalancesStatsModel,
} from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { AddressValues } from '@/components/Address/helpers'
import AddressWallet from '@/components/AddressWallet'
import Avatar from '@/components/Avatar'
import CommonChart, { CommonChartDataset } from '@/components/CommonChart'
import DateTime from '@/components/DateTime'
import DetailsView from '@/components/DetailsView'
import Grid from '@/components/Grid'
import {
  IconContract,
  IconImpersonator,
  IconNoIcon,
  IconShield,
  IconVerify,
} from '@/components/Icons'
import OpenWith from '@/components/OpenWith'
import Page from '@/components/Page'
import Properties from '@/components/Properties'
import Separated from '@/components/Separated'
import TabPanel from '@/components/TabPanel'
import { TransfersDataTable } from '@/components/Tables'
import Value from '@/components/Value'
import { CHAIN_ID } from '@/constants'
import RainbowKitAuthWrapper from '@/containers/RainbowKitAuthWrapper'
import { useSourcifyMetadata } from '@/hooks/useSourcify'
import { GET_CONTRACT_INFO, GET_TOKEN_INFO } from '@/lib/apollo/queries'
import { checkChainFeature, financialFormat } from '@/lib/utils'
import styles from './ContractView.module.scss'
import pageStyles from '@/pages/Pages.module.scss'

const TxsDataTable = dynamic(() => import('@/components/Tables/TxsDataTable/'))
const HoldersDataTable = dynamic(
  () => import('@/components/Tables/HoldersDataTable/')
)
const DexTradesDataTable = dynamic(
  () => import('@/components/Tables/DexTradesDataTable/')
)
const Erc20DataTable = dynamic(
  () => import('@/components/Tables/Erc20DataTable')
)
const NftDataTable = dynamic(() => import('@/components/Tables/NftDataTable'))
const InternalTxs = dynamic(() => import('@/components/TabContent/InternalTxs'))
const Analytics = dynamic(() => import('@/components/Analytics'))

const ContractTab = dynamic(() => import('./ContractTab'))

const ContractView: FC<IContractViewProps> = ({
  address,
  tab,
  type = 'contract',
  addressInfo,
  chain,
  chains,
  tokenHoldingsStats,
}) => {
  const { data } = useQuery(GET_CONTRACT_INFO, { variables: { address } })
  const [getTokenData, { data: tokenData }] = useLazyQuery<{
    checkTokenImpersonator: boolean
  }>(GET_TOKEN_INFO)

  useEffect(() => {
    if (type !== 'token') {
      return
    }

    getTokenData({
      variables: {
        address: addressInfo.address?.toLowerCase(),
        ticker: addressInfo.symbol,
      },
    })
  }, [type, addressInfo, getTokenData])

  const contractCreator: ContractCreatorModel = data?.contractCreator
  const balancesStats: TokenBalancesStatsModel = data?.balancesStats

  const router = useRouter()
  const pathname = router.asPath.split('?')[0]
  const match = useSourcifyMetadata(address, CHAIN_ID)

  const abi = (match?.metadata?.output?.abi as Abi) || undefined

  const hasSources = !!match?.metadata?.sources

  const isSubTab =
    !!tab && ['code', 'readContract', 'writeContract'].includes(tab as string)

  const checkSumAddress = isAddress(address) ? getAddress(address) : address

  const holdersSeries: CommonChartDataset[] = [
    {
      id: 'holders',
      name: 'Holders',
      color: '#46a6ff',
      data: balancesStats?.holdersChart || [],
      yAxis: 'left',
    },
  ]

  const contractTabs = [
    {
      title: 'Code',
      value: 'code',
      to: `${pathname}?tab=code`,
    },
  ]

  if (abi) {
    contractTabs.push(
      {
        title: 'Read Contract',
        value: 'readContract',
        to: `${pathname}?tab=readContract`,
      },
      {
        title: 'Write Contract',
        value: 'writeContract',
        to: `${pathname}?tab=writeContract`,
      }
    )
  }

  const addressIcon =
    type === 'token' && addressInfo.logoURL ? (
      <Image
        src={addressInfo.logoURL}
        alt={addressInfo.symbol || ''}
        className={styles.icon}
        width={32}
        height={32}
      />
    ) : (
      <Avatar address={address} className={styles.icon} />
    )

  const tokenIcon = addressInfo.logoURL ? (
    <Image
      src={addressInfo.logoURL}
      alt={addressInfo.symbol || ''}
      className={styles.tokenIcon}
      width={32}
      height={32}
    />
  ) : (
    <IconNoIcon className={styles.tokenIcon} />
  )

  const detailsTitle =
    type === 'token' ? (
      <>
        Token {addressInfo.symbol}
        {addressInfo.name !== addressInfo.symbol ? (
          <>
            {' '}
            <span className={styles.muted}>({addressInfo.name})</span>{' '}
            {!!addressInfo?.tokenLists?.length && (
              <IconVerify
                className={styles.verification}
                data-tooltip-id="app-tooltip"
                data-tooltip-content={`This token is verified by ${addressInfo?.tokenLists.join(
                  ', '
                )}`}
              />
            )}
            {!!tokenData?.checkTokenImpersonator && (
              <IconImpersonator
                className={styles.verification}
                data-tooltip-id="app-tooltip"
                data-tooltip-content="Caution: While the token's ticker may resemble an authentic one, always cross-verify the address to detect potential impersonation."
              />
            )}
          </>
        ) : null}
      </>
    ) : (
      'Contract'
    )

  const pageTitle = `${chain.config.name} ${
    type === 'token'
      ? `Token ${addressInfo.symbol}${
          addressInfo.name !== addressInfo.symbol
            ? ` (${addressInfo.name})`
            : ''
        }`
      : `Contract ${checkSumAddress}`
  }`

  return (
    <RainbowKitAuthWrapper>
      <RainbowKitProvider chains={chains}>
        <Head>
          <title>{pageTitle}</title>
          <link rel="icon" href={chain.config.icon} />
          <link rel="canonical" href={pathname} />
          <meta
            name="description"
            content={`Explore smart contract ${
              addressInfo.name || addressInfo.address
            } to track recent transactions, read or write contact variables using ABI interface, and view smart contract activity in real-time.`}
          />
        </Head>
        <Page chainConfig={chain.config}>
          <DetailsView
            icon={addressIcon}
            title={detailsTitle}
            address={type !== 'token' ? checkSumAddress : undefined}
            tags={[`${addressInfo.symbol ? 'Token' : 'Smart'} Contract`]}
            type="address"
            chainConfig={chain.config}
            header={
              <OpenWith
                type={type === 'token' ? 'token' : 'address'}
                chainConfig={chain.config}
                address={address}
              />
            }
          >
            <Grid>
              <Properties
                title="Overview:"
                data={[
                  ...(type === 'contract'
                    ? [
                        {
                          title: `${chain?.config?.nativeCurrency.symbol} Balance:`,
                          value: (
                            <Value
                              value={financialFormat(addressInfo.nativeBalance)}
                              suffix={
                                <>
                                  &nbsp;{chain?.config?.nativeCurrency.symbol}
                                </>
                              }
                            />
                          ),
                        },
                        {
                          title: `${chain?.config?.nativeCurrency.symbol} Value:`,
                          value: (
                            <Value
                              value={financialFormat(
                                addressInfo.nativeBalanceUSD
                              )}
                              prefix="$"
                            />
                          ),
                        },
                        {
                          title: 'Token Holdings:',
                          value: (
                            <AddressWallet
                              address={address}
                              tokenHoldingsStats={tokenHoldingsStats}
                              className={pageStyles.addressWallet}
                            />
                          ),
                        },
                      ]
                    : []),

                  ...(type === 'token'
                    ? [
                        {
                          title: 'FDV / Max Supply:',
                          value: (
                            <Separated>
                              <Value
                                value={financialFormat(
                                  balancesStats?.fullyDilutedValuation || 0
                                )}
                                prefix="$"
                              />
                              <Value
                                value={financialFormat(
                                  balancesStats?.maxTotalSupply || 0
                                )}
                              />
                            </Separated>
                          ),
                        },
                        {
                          title: 'Total Transfers:',
                          value: financialFormat(
                            balancesStats?.totalTransfers || 0
                          ),
                        },
                        {
                          title: 'Holders:',
                          value: (
                            <div className={styles.holders}>
                              <Separated>
                                <Value
                                  value={financialFormat(
                                    balancesStats?.holders || 0
                                  )}
                                  delta={
                                    balancesStats?.holdersChange
                                      ? (balancesStats.holdersChange || 0) * 100
                                      : undefined
                                  }
                                />
                                <div className={styles.holdersChart}>
                                  <CommonChart
                                    data={holdersSeries}
                                    options={{
                                      axis: {
                                        x: {
                                          type: 'number',
                                          dataKey: 'timestamp',
                                          hide: true,
                                          tickFormatter: (value: number) => {
                                            const date = new Date(value * 1000)
                                            return date.toLocaleDateString(
                                              'en-GB',
                                              {
                                                timeZone: 'UTC',
                                                month: 'short',
                                                year: '2-digit',
                                                day: '2-digit',
                                              }
                                            )
                                          },
                                          axisLine: false,
                                          tickLine: false,
                                        },
                                        y: {
                                          hide: true,
                                          tickFormatter: (value: number) =>
                                            financialFormat(value, {
                                              roundBigNumbersFrom: 'K',
                                            }),
                                          axisLine: false,
                                          tickLine: false,
                                        },
                                      },
                                    }}
                                  />
                                </div>
                              </Separated>
                            </div>
                          ),
                        },
                      ]
                    : []),
                ]}
              />

              <Properties
                title="More Info:"
                data={[
                  ...(type === 'token'
                    ? [
                        {
                          title: 'Price:',
                          value: (
                            <Value
                              value={financialFormat(balancesStats?.price || 0)}
                              prefix="$"
                              delta={
                                balancesStats?.priceChange
                                  ? (balancesStats.priceChange || 0) * 100
                                  : undefined
                              }
                            />
                          ),
                        },
                      ]
                    : []),

                  ...(contractCreator
                    ? [
                        {
                          title: 'Creator:',
                          value: (
                            <div>
                              <Address
                                address={contractCreator.creatorAddress}
                                type="account"
                                isCopy
                              />{' '}
                              at txn{' '}
                              <Address
                                address={contractCreator.txHash}
                                type="tx"
                                isCopy
                              />
                            </div>
                          ),
                        },
                        {
                          title: 'Timestamp:',
                          value: (
                            <DateTime timestamp={contractCreator.timestamp} />
                          ),
                        },
                      ]
                    : []),

                  ...(type === 'contract' && addressInfo.symbol
                    ? [
                        {
                          title: 'Token Tracker:',
                          value: (
                            <div>
                              <Link
                                href={
                                  AddressValues['token'].url(address || '') ||
                                  ''
                                }
                                className={styles.token}
                              >
                                {tokenIcon}{' '}
                                <span className={styles.tokenName}>
                                  {addressInfo.name} ({addressInfo.symbol})
                                </span>{' '}
                                <span className={styles.tokenPrice}>
                                  (@$
                                  {financialFormat(balancesStats?.price || 0)})
                                </span>
                              </Link>
                            </div>
                          ),
                        },
                      ]
                    : []),

                  ...(type === 'token'
                    ? [
                        {
                          title: 'Token Contract:',
                          value: (
                            <Value
                              className={styles.token}
                              value={
                                <Address
                                  address={address}
                                  type="account"
                                  isCopy
                                />
                              }
                              icon={
                                <IconContract
                                  data-tooltip-id="app-tooltip"
                                  data-tooltip-content="Smart Contract"
                                  className={styles.contractIcon}
                                />
                              }
                            />
                          ),
                        },
                      ]
                    : []),
                ]}
              />
            </Grid>

            <Ad />

            <TabPanel
              tabs={[
                ...(type === 'token'
                  ? [
                      {
                        title: 'Transfers',
                        value: '',
                        to: pathname,
                        content: <TransfersDataTable address={address} />,
                      },
                      {
                        title: 'Holders',
                        value: 'balances',
                        to: { pathname, query: { tab: 'balances' } },
                        content: <HoldersDataTable address={address} />,
                      },
                      {
                        title: 'DEX Trades',
                        value: 'trades',
                        to: { pathname, query: { tab: 'trades' } },
                        content: <DexTradesDataTable address={address} />,
                      },
                    ]
                  : []),

                ...(type === 'contract'
                  ? [
                      {
                        title: 'Transactions',
                        tooltip:
                          'Transactions where the address is a sending party.',
                        value: '',
                        to: pathname,
                        content: <TxsDataTable address={address} />,
                      },
                      {
                        title: 'Internal Transactions',
                        value: 'txsinternal',
                        to: { pathname, query: { tab: 'txsinternal' } },
                        content: (
                          <InternalTxs
                            chainConfig={chain.config}
                            chainStats={chain.stats}
                            address={address.toLowerCase()}
                          />
                        ),
                      },
                      {
                        title: 'Token TXs (ERC-20)',
                        tooltip:
                          'On-chain events where the address either received or sent ERC-20 tokens.',
                        value: 'tokentxns',
                        to: { pathname, query: { tab: 'tokentxns' } },
                        content: <Erc20DataTable address={address} />,
                      },
                      {
                        title: 'NFT Token TXs',
                        value: 'nfttxns',
                        to: { pathname, query: { tab: 'nfttxns' } },
                        content: <NftDataTable address={address} />,
                      },
                    ]
                  : []),

                {
                  title: 'Contract',
                  indicator: hasSources && (
                    <IconShield
                      data-tooltip-id="app-tooltip"
                      data-tooltip-html="This contract has been verified through <a href='https://sourcify.dev/' rel='noopener noreferrer' target='_blank'>Sourcify</a>."
                    />
                  ),
                  value: 'code',
                  isActive: isSubTab,
                  to: `${pathname}?tab=code`,
                },
                ...(checkChainFeature(chain.config, 'charts')
                  ? [
                      {
                        title: 'Analytics',
                        value: 'analytics',
                        to: { pathname, query: { tab: 'analytics' } },
                        content: (
                          <Analytics
                            tag={
                              type === 'token'
                                ? 'Token Contract'
                                : 'Smart Contract'
                            }
                            params={{
                              network: chain.config.shortName,
                              address: address.toLowerCase(),
                            }}
                          />
                        ),
                      },
                    ]
                  : []),
              ]}
              value={tab || ''}
            >
              {/* Content here should depend on Tab's query param value */}

              {isSubTab && (
                <ContractTab
                  match={match}
                  address={address}
                  tab={tab as string}
                />
              )}
            </TabPanel>
          </DetailsView>
        </Page>
      </RainbowKitProvider>
    </RainbowKitAuthWrapper>
  )
}

export default ContractView
