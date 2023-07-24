import { FC } from 'react'
import { useMemo } from 'react'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { Abi, AbiFunction } from 'abitype'
import { isAddress, getAddress } from 'viem'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import ContractMethodForm from './ContractMethodForm'
import ContractProperty from './ContractProperty'
import Files from './Files'
import { IContractViewProps } from './types'
import {
  ContractCreatorModel,
  TokenBalancesStatsModel,
} from '@/__generated__/resolvers-types'
import Address from '@/components/Address'
import { AddressValues } from '@/components/Address/helpers'
import AddressWallet from '@/components/AddressWallet'
import Avatar from '@/components/Avatar'
import Card from '@/components/Card'
import Comments from '@/components/Comments'
import CommonChart, { CommonChartDataset } from '@/components/CommonChart'
import ConnectButton from '@/components/ConnectButton'
import DateTime from '@/components/DateTime'
import DetailsView from '@/components/DetailsView'
import Grid from '@/components/Grid'
import {
  IconContract,
  IconNoIcon,
  IconShield,
  IconVerify,
} from '@/components/Icons'
import Message from '@/components/Message'
import Page from '@/components/Page'
import Properties from '@/components/Properties'
import Separated from '@/components/Separated'
import TabPanel from '@/components/TabPanel'
import { TransfersDataTable } from '@/components/Tables'
import Value from '@/components/Value'
import { CHAIN_ID, WALLET_CONNECT_PROJECT_ID } from '@/constants'
import { useSourcifyMetadata } from '@/hooks/useSourcify'
import { GET_CONTRACT_INFO } from '@/lib/apollo/queries'
import { checkChainFeature, financialFormat } from '@/lib/utils'
import styles from './ContractView.module.scss'
import tabsStyles from '@/components/Tabs/Tabs.module.scss'
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
const Analytics = dynamic(() => import('@/components/Analytics'))

const ContractView: FC<IContractViewProps> = ({
  address,
  tab,
  type = 'contract',
  addressInfo,
  chain,
  tokenHoldingsStats,
}) => {
  const { data } = useQuery(GET_CONTRACT_INFO, { variables: { address } })

  const contractCreator: ContractCreatorModel = data?.contractCreator
  const balancesStats: TokenBalancesStatsModel = data?.balancesStats

  const { chains, publicClient } = useMemo(() => {
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
        projectId: WALLET_CONNECT_PROJECT_ID,
      }),
    [chains]
  )

  const wagmiConfig = useMemo(
    () =>
      createConfig({
        autoConnect: true,
        connectors,
        publicClient,
      }),
    [connectors, publicClient]
  )

  const router = useRouter()
  const pathname = router.asPath.split('?')[0]
  const match = useSourcifyMetadata(address, CHAIN_ID)

  const isMatchLoading = match === undefined

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
                className={styles.verified}
                data-tooltip-id="app-tooltip"
                data-tooltip-content={`This token is verified by ${addressInfo?.tokenLists.join(
                  ', '
                )}`}
              />
            )}
          </>
        ) : null}
      </>
    ) : (
      'Contract'
    )

  const pageTitle = `${
    type === 'token'
      ? `Token ${addressInfo.symbol}${
          addressInfo.name !== addressInfo.symbol
            ? ` (${addressInfo.name})`
            : ''
        }`
      : `Contract ${checkSumAddress}`
  } on ${chain.config.name}`

  return (
    <WagmiConfig config={wagmiConfig}>
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
            tag={
              type === 'contract'
                ? `${addressInfo.symbol ? 'Token' : 'Smart'} Contract`
                : undefined
            }
            type="address"
            chainConfig={chain.config}
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
                                <CommonChart
                                  className={styles.holdersChart}
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
                        tooltip: `Transactions where an EOA (Externally Owned Address aka a wallet address) sends ${chain.config.nativeCurrency.symbol} directly to another EOA.`,
                        value: '',
                        to: pathname,
                        content: <TxsDataTable address={address} />,
                      },
                      {
                        title: 'Token TXs (ERC-20)',
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
                            chainConfig={chain.config}
                            tag={
                              type === 'token'
                                ? 'Token Contract'
                                : 'Smart Contract'
                            }
                            params={{
                              chain_id: chain.config.chainId,
                              ...(type === 'token'
                                ? {
                                    token_address_requested:
                                      address.toLowerCase(),
                                  }
                                : { address: address.toLowerCase() }),
                            }}
                          />
                        ),
                      },
                    ]
                  : []),
                {
                  title: 'Comments',
                  value: 'comments',
                  to: { pathname, query: { tab: 'comments' } },
                  content: (
                    <Card>
                      <Comments
                        id={`address/${address}`}
                        title={`Contract ${address}`}
                      />
                    </Card>
                  ),
                },
              ]}
              value={tab || ''}
            >
              {/* Content here should depend on Tab's query param value */}

              {isSubTab && (
                <Card>
                  {!isMatchLoading && !hasSources && abi && (
                    <>
                      <Message type="danger">
                        This smart contract is not verified according to{' '}
                        <Link
                          href="https://sourcify.dev/"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Sourcify
                        </Link>
                        . Make sure you understand the risks of interacting with
                        unverified smart contracts.
                      </Message>
                      <Message type="info">
                        As a contract owner, you can get your smart contract
                        verified with Sourcify{' '}
                        <Link
                          href="/verifyContract"
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          here
                        </Link>
                        .
                      </Message>
                    </>
                  )}

                  <TabPanel
                    tabsClassName={tabsStyles.inner}
                    tabs={contractTabs}
                    value={tab}
                  >
                    {abi &&
                      ['readContract', 'writeContract'].includes(
                        tab as string
                      ) && <ConnectButton />}

                    {(tab === 'code' || !abi) && (
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
