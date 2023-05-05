import { FC, Suspense, lazy } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Abi, AbiFunction } from 'abitype'
import styles from '../../pages/Pages.module.scss'
import { LoadingCard } from '../Loading'
import { EventsTable } from '../Tables/EventsTable'
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
} from '@/components'
import { useSourcifyMetadata } from '@/hooks/useSourcify'
import IconVerify from '@/images/icons/verified.svg'
import { financialFormat } from '@/lib/utils'

const TxsDataTable = lazy(() => import('../Tables/TxsDataTable/'))
const Erc20DataTable = lazy(() => import('../Tables/Erc20DataTable'))
const NftDataTable = lazy(() => import('../Tables/NftDataTable'))
const EventsTable = lazy(() => import('../Tables/EventsTable'))

const ContractView: FC<IContractViewProps> = ({
  address,
  tab,
  addressInfo,
  chain,
  contractCreator,
}) => {
  const router = useRouter()
  const pathname = router.asPath.split('?')[0]
  const match = useSourcifyMetadata(address, 7700)

  const abi = (match?.metadata?.output?.abi as Abi) || undefined

  if (!abi) {
    return null
  }

  const hasSources = match?.metadata?.sources || undefined

  const isSubTab =
    tab && ['code', 'readContract', 'writeContract'].includes(tab as string)

  return (
    <>
      <Head>
        <title>Block Explorer</title>
        <meta name="description" content="Block Explorer" />
      </Head>
      <Page withSearch>
        <DetailsView
          icon={<Avatar address={address} />}
          title="Contract"
          address={address}
          tag="Token Contract"
        >
          <Grid>
            <Properties
              className={styles.span2Only}
              title="Contract Overview:"
              data={[
                {
                  title: `${chain.config.nativeCurrency.symbol} Value:`,
                  value: (
                    <Value
                      value={financialFormat(addressInfo.nativeBalance)}
                      suffix={` ${chain.config.nativeCurrency.symbol}`}
                    />
                  ),
                },
                {
                  title: `${chain.config.nativeCurrency.symbol} Value:`,
                  value: (
                    <Value
                      value={financialFormat(addressInfo.nativeBalanceUSD)}
                      prefix="$"
                    />
                  ),
                },
                {
                  title: 'Token holdings:',
                  value: addressInfo.assetsValueUSD,
                },
              ]}
            />

            {!!contractCreator && (
              <Properties
                title="Contract Creator:"
                data={[
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
                    value: <DateTime timestamp={contractCreator.timestamp} />,
                  },
                ]}
              />
            )}
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
                title: 'ERC-20 Token TXns',
                value: 'tokentxns',
                to: `${pathname}?tab=tokentxns`,
                content: (
                  <Suspense fallback={<LoadingCard />}>
                    <Erc20DataTable address={address} />
                  </Suspense>
                ),
              },

              {
                title: 'NFT Token TXns',
                value: 'nfttxns',
                to: `${pathname}?tab=nfttxns`,
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
                to: `${pathname}?tab=events`,
                content: (
                  <Suspense>
                    <EventsTable address={address} />
                  </Suspense>
                ),
              },
              {
                title: 'Analytics',
                value: 'analytics',
                to: `${pathname}?tab=analytics`,
                content: (
                  <Suspense fallback={<LoadingCard />}>
                    <Card>Some analytics here soon</Card>
                  </Suspense>
                ),
              },

              {
                title: 'Comments',
                indicator: <IconVerify />,
                value: 'comments',
                to: `${pathname}?tab=comments`,
                content: (
                  <Suspense fallback={<LoadingCard />}>
                    <Card>Some comments here soon</Card>
                  </Suspense>
                ),
              },
            ]}
            value={tab || ''}
          >
            {/* Content here should depend on Tab's query param value */}

            {isSubTab && (
              <Card>
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
                  {tab === 'code' && <Files match={match} address={address} />}
                  {tab === 'readContract' && (
                    <>
                      {(abi as Abi)
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
                      {(abi as Abi)
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
    </>
  )
}

export default ContractView
