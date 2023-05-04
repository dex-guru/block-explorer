import { FC, Suspense, useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'
import { Abi, AbiFunction } from 'abitype'
import { txsColumns } from '../Table/columns'
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
  DataTable,
  Card,
} from '@/components'
import { useIsMount } from '@/hooks'
import { useSourcifyMetadata } from '@/hooks/useSourcify'
import IconVerify from '@/images/icons/verified.svg'
import { GET_TRANSACTIONS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'

const perPage = [5, 10, 25, 50, 100]

const ContractView: FC<IContractViewProps> = ({
  address,
  tab,
  addressInfo,
  chain,
  ...props
}) => {
  const router = useRouter()
  const pathname = router.asPath.split('?')[0]
  const match = useSourcifyMetadata(address, 7700)
  const isMount = useIsMount()
  const [transactions, setTransactions] = useState(props.transactions)

  const [getTransactions, { data, loading }] = useLazyQuery(GET_TRANSACTIONS)

  useEffect(() => {
    if (data && isMount) {
      setTransactions(data.transactions)
    }
  }, [data, isMount])

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getTransactions({ variables: { ...variables, address } })
    },
    [getTransactions, address]
  )

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
              title="Contract Overview:"
              data={[
                {
                  title: 'Balance:',
                  value: addressInfo.nativeBalance,
                },
                {
                  title: `${chain.config.nativeCurrency.symbol} Value`,
                  value: addressInfo.nativeBalanceUSD,
                },
                {
                  title: 'Token:',
                  value: addressInfo.assetsValueUSD,
                },
              ]}
            />

            <Properties
              title="Contract Creator:"
              data={[
                {
                  title: 'Contract Creator:',
                  value: (
                    <>
                      <Address address="🫠" type="account" /> at txn{' '}
                      <Address address="🫠" type="tx" />
                    </>
                  ),
                },
                {
                  title: 'Token Tracker:',
                  value: <>🫠</>,
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
                  <Suspense>
                    <DataTable
                      isLoading={loading}
                      columns={txsColumns(chain.config, chain.stats)}
                      data={transactions || []}
                      total={
                        transactions &&
                        transactions[0] &&
                        transactions[0].blockNumber
                      }
                      perPage={perPage[1]}
                      onPageChange={onPaginationChange}
                      empty={{
                        title: 'No transactions for this contract',
                      }}
                    />
                  </Suspense>
                ),
              },
              {
                title: 'Internal TXns',
                value: 'internaltx',
                to: `${pathname}?tab=internaltx`,
                content: (
                  <Suspense>
                    <DataTable
                      isLoading={loading}
                      columns={txsColumns(chain.config, chain.stats)}
                      data={[]}
                      total={0}
                      perPage={perPage[1]}
                      onPageChange={onPaginationChange}
                      empty={{
                        title: 'No internal transactions for this contract',
                      }}
                    />
                  </Suspense>
                ),
              },
              {
                title: 'Erc20 Token TXns',
                value: 'tokentxns',
                to: `${pathname}?tab=tokentxns`,
                content: (
                  <Suspense>
                    <DataTable
                      isLoading={loading}
                      columns={txsColumns(chain.config, chain.stats)}
                      data={[]}
                      total={0}
                      perPage={perPage[1]}
                      onPageChange={onPaginationChange}
                      empty={{
                        title: 'No token transactions for this contract',
                      }}
                    />
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
                    <Card>Some events here soon</Card>
                  </Suspense>
                ),
              },
              {
                title: 'Analytics',
                value: 'analytics',
                to: `${pathname}?tab=analytics`,
                content: (
                  <Suspense>
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
                  <Suspense>
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
