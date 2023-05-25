import { FC, Suspense } from 'react'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { isAddress, getAddress } from '@ethersproject/address'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { Abi, AbiFunction } from 'abitype'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import pageStyles from '../../pages/Pages.module.scss'
import AddressWallet from '../AddressWallet'
import { LineChartDataset } from '../LineChart'
import { generateLineChartData } from '../LineChart/utils'
import { LoadingCard } from '../Loading'
import tabsStyles from '../Tabs/Tabs.module.scss'
import ContractMethodForm from './ContractMethodForm'
import ContractProperty from './ContractProperty'
import { IContractViewProps } from './types'
import {
  Address,
  Avatar,
  DetailsView,
  Page,
  Properties,
  TabPanel,
  Files,
  Grid,
  ConnectButton,
  Card,
  Value,
  DateTime,
  Comments,
  Separated,
  Label,
  LineChart,
  Message,
} from '@/components'
import { CHAIN_ID } from '@/constants'
import { useSourcifyMetadata } from '@/hooks/useSourcify'
import IconVerify from '@/images/icons/verified.svg'
import { financialFormat } from '@/lib/utils'
import styles from './ContractView.module.scss'

const TxsDataTable = dynamic(() => import('../Tables/TxsDataTable/'), {
  ssr: false,
})
const HoldersDataTable = dynamic(() => import('../Tables/HoldersDataTable/'), {
  ssr: false,
})
const Erc20DataTable = dynamic(() => import('../Tables/Erc20DataTable'), {
  ssr: false,
})
const NftDataTable = dynamic(() => import('../Tables/NftDataTable'), {
  ssr: false,
})
const EventsDataTable = dynamic(() => import('../Tables/EventsDataTable'), {
  ssr: false,
})

const ContractView: FC<IContractViewProps> = ({
  address,
  tab,
  addressInfo,
  chain,
  contractCreator,
  tokenHoldingsStats,
  balancesStats,
}) => {
  const { chains, provider } = useMemo(() => {
    const currentChain = {
      id: chain.config.chainId,
      name: chain.config.name,
      network: chain.config.shortName,
      nativeCurrency: chain.config.nativeCurrency,
      rpcUrls: {
        default: {
          http: chain.config.rpc,
        },
        public: {
          http: chain.config.rpc,
        },
      },
      blockExplorers: {
        default: {
          name: chain.config.explorers[0].name,
          url: chain.config.explorers[0].url,
        },
      },
    }
    return configureChains([currentChain], [publicProvider()])
  }, [
    chain.config.chainId,
    chain.config.explorers,
    chain.config.name,
    chain.config.nativeCurrency,
    chain.config.rpc,
    chain.config.shortName,
  ])

  const { connectors } = useMemo(
    () =>
      getDefaultWallets({
        appName: 'Block Explorer',
        chains,
      }),
    [chains]
  )

  const wagmiClient = useMemo(
    () =>
      createClient({
        autoConnect: true,
        connectors,
        provider,
      }),
    [connectors, provider]
  )

  const router = useRouter()
  const pathname = router.asPath.split('?')[0]
  const match = useSourcifyMetadata(address, CHAIN_ID)

  const abi = (match?.metadata?.output?.abi as Abi) || undefined

  const hasSources = match?.metadata?.sources || undefined

  const isSubTab =
    tab && ['code', 'readContract', 'writeContract'].includes(tab as string)

  const checkSumAddress = isAddress(address) ? getAddress(address) : address
  const pageTitle = `Contract ${checkSumAddress}`

  const holdersSeries: LineChartDataset[] = [
    {
      id: 'holders',
      name: 'Holders',
      color: '#46a6ff',
      data: balancesStats?.holdersChart || [],
      yAxis: 'left',
    },
  ]

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Head>
          <title>{pageTitle}</title>
          <link rel="icon" href={chain.config.icon} />
          <meta name="description" content="Block Explorer" />
        </Head>
        <Page withSearch chainConfig={chain.config}>
          <DetailsView
            icon={<Avatar address={address} />}
            title="Contract"
            address={address}
            tag="Token Contract"
          >
            <Grid>
              <Properties
                title="Contract Overview:"
                header={
                  <Label className={pageStyles.contractName} type="accent">
                    {addressInfo.name}
                  </Label>
                }
                data={[
                  {
                    title: `${chain?.config?.nativeCurrency.symbol} Balance:`,
                    value: (
                      <Value
                        value={financialFormat(addressInfo.nativeBalance)}
                        suffix={
                          <>&nbsp;{chain?.config?.nativeCurrency.symbol}</>
                        }
                      />
                    ),
                  },
                  {
                    title: `${chain?.config?.nativeCurrency.symbol} Value:`,
                    value: (
                      <Value
                        value={financialFormat(addressInfo.nativeBalanceUSD)}
                        prefix="$"
                      />
                    ),
                  },

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
                ]}
              />

              <Properties
                title="Balances:"
                header={
                  <Value
                    value={financialFormat(balancesStats?.price || 0)}
                    prefix="Price: $"
                    delta={
                      balancesStats?.priceChange
                        ? (balancesStats.priceChange || 0) * 100
                        : undefined
                    }
                  />
                }
                data={[
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
                  {
                    title: 'Holders:',
                    value: (
                      <div className={styles.holders}>
                        <Separated>
                          <Value
                            value={financialFormat(balancesStats?.holders || 0)}
                            delta={
                              balancesStats?.holdersChange
                                ? (balancesStats.holdersChange || 0) * 100
                                : undefined
                            }
                          />
                          <LineChart
                            className={styles.holdersChart}
                            data={generateLineChartData(holdersSeries || [])}
                            series={holdersSeries}
                            options={{
                              axis: {
                                x: {
                                  hide: true,
                                  tickFormatter: (value: number) => {
                                    const date = new Date(value * 1000)
                                    return date.toLocaleDateString('en-GB', {
                                      timeZone: 'UTC',
                                      month: 'short',
                                      year: '2-digit',
                                      day: '2-digit',
                                    })
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
                        </Separated>
                      </div>
                    ),
                  },
                  {
                    title: 'FDV / Max Total Supply:',
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
                    value: financialFormat(balancesStats?.totalTransfers || 0),
                  },
                ]}
              />
            </Grid>

            <TabPanel
              tabs={[
                {
                  title: 'Transactions',
                  value: '',
                  to: pathname,
                  content: (
                    <Suspense fallback={<LoadingCard />}>
                      <TxsDataTable address={address} />
                    </Suspense>
                  ),
                },

                {
                  title: 'Holders',
                  value: 'balances',
                  to: { pathname, query: { tab: 'balances' } },
                  content: (
                    <Suspense fallback={<LoadingCard />}>
                      <HoldersDataTable address={address} />
                    </Suspense>
                  ),
                },

                {
                  title: 'ERC-20 Token TXns',
                  value: 'tokentxns',
                  to: { pathname, query: { tab: 'tokentxns' } },
                  content: (
                    <Suspense fallback={<LoadingCard />}>
                      <Erc20DataTable address={address} />
                    </Suspense>
                  ),
                },

                {
                  title: 'NFT Token TXns',
                  value: 'nfttxns',
                  to: { pathname, query: { tab: 'nfttxns' } },
                  content: (
                    <Suspense fallback={<LoadingCard />}>
                      <NftDataTable address={address} />
                    </Suspense>
                  ),
                },

                {
                  title: 'Contract',
                  indicator: hasSources && <IconVerify />,
                  value: ['code', 'readContract', 'writeContract'],
                  to: `${pathname}?tab=code`,
                },
                {
                  title: 'Events',
                  value: 'events',
                  to: { pathname, query: { tab: 'events' } },
                  content: (
                    <Suspense>
                      <EventsDataTable address={address} />
                    </Suspense>
                  ),
                },
                {
                  title: 'Analytics',
                  value: 'analytics',
                  to: { pathname, query: { tab: 'analytics' } },
                  content: (
                    <Suspense fallback={<LoadingCard />}>
                      <Card>Some analytics here soon</Card>
                    </Suspense>
                  ),
                },

                {
                  title: 'Comments',
                  value: 'comments',
                  to: { pathname, query: { tab: 'comments' } },
                  content: (
                    <Suspense fallback={<LoadingCard />}>
                      <Card>
                        <Comments
                          id={`address/${address}`}
                          title={`Contract ${address}`}
                        />
                      </Card>
                    </Suspense>
                  ),
                },
              ]}
              value={tab || ''}
            >
              {/* Content here should depend on Tab's query param value */}

              {isSubTab && (
                <Card>
                  {!match?.metadata?.sources && (
                    <Message type="danger">
                      This smart contract isn&apos;t verified, but we have a
                      matching hash for the smart contract. Make sure you
                      understand the risks of interacting with unverified smart
                      contracts. You may lose your money!
                    </Message>
                  )}
                  <TabPanel
                    tabsClassName={tabsStyles.inner}
                    tabs={[
                      {
                        title: 'Code',
                        value: 'code',
                        to: `${pathname}?tab=code`,
                      },
                      {
                        title: 'Read Contract',
                        value: 'readContract',
                        to: `${pathname}?tab=readContract`,
                      },
                      {
                        title: 'Write Contract',
                        value: 'writeContract',
                        to: `${pathname}?tab=writeContract`,
                      },
                    ]}
                    value={tab}
                  >
                    {['readContract', 'writeContract'].includes(
                      tab as string
                    ) && <ConnectButton />}
                    {tab === 'code' && (
                      <Files match={match} address={address} />
                    )}
                    {tab === 'readContract' && (
                      <>
                        {!!abi &&
                          (abi as Abi)
                            .filter(
                              (item) =>
                                item.type === 'function' &&
                                item.stateMutability === 'view'
                            )
                            .map((method, index) => {
                              const contractMethod = method as AbiFunction & {
                                type: 'function'
                              }
                              return contractMethod.inputs.length === 0 ? (
                                <ContractProperty
                                  key={`${index}-${contractMethod}`}
                                  method={contractMethod}
                                  address={address}
                                  abi={abi}
                                />
                              ) : (
                                <ContractMethodForm
                                  key={`${index}-${contractMethod}`}
                                  method={contractMethod}
                                  address={address}
                                  abi={abi}
                                />
                              )
                            })}
                      </>
                    )}
                    {tab === 'writeContract' && (
                      <>
                        {!!abi &&
                          (abi as Abi)
                            .filter(
                              (item) =>
                                item.type === 'function' &&
                                (item.stateMutability === 'nonpayable' ||
                                  item.stateMutability === 'payable')
                            )
                            .map((method, index) => {
                              const contractMethod = method as AbiFunction & {
                                type: 'function'
                              }
                              return (
                                <ContractMethodForm
                                  key={`${index}-${contractMethod}`}
                                  method={contractMethod}
                                  address={address}
                                  abi={abi}
                                  isWrite
                                />
                              )
                            })}
                      </>
                    )}
                  </TabPanel>
                </Card>
              )}
            </TabPanel>
          </DetailsView>
        </Page>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default ContractView
