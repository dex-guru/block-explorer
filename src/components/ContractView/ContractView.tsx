import { FC, useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { Abi, AbiFunction } from 'abitype'
import { txsColumns } from '../Table/columns'
import ContractMethodForm from './ContractMethodForm'
import ContractProperty from './ContractProperty'
import { IContractViewProps } from './types'
import {
  Address,
  Avatar,
  Card,
  DetailsView,
  Page,
  Properties,
  TabPanel,
  Files,
  Grid,
  ConnectButton,
  DataTable,
} from '@/components'
import { useIsMount } from '@/hooks'
import { useSourcifyMetadata } from '@/hooks/useSourcify'
import IconVerify from '@/images/icons/verified.svg'
import { GET_TRANSACTIONS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'

const perPage = [5, 10, 25, 50, 100]

const ContractView: FC<IContractViewProps> = ({ address, tab, ...props }) => {
  const router = useRouter()
  const pathname = router.asPath.split('?')[0]
  const match = useSourcifyMetadata(address, 7700)
  const isMount = useIsMount()
  const [transactions, setTransactions] = useState(props.transactions)

  const [getTransactions, { data }] = useLazyQuery(GET_TRANSACTIONS)

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

  const abi = match?.metadata.output.abi as Abi
  if (!abi) {
    return null
  }

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
              data={[
                {
                  title: 'Contract Overview:',
                  value: '🫠',
                },
                {
                  title: 'Balance:',
                  value: '🫠',
                },
                {
                  title: 'Ether Value:',
                  value: '🫠',
                },
                {
                  title: 'Token:',
                  value: '🫠',
                },
              ]}
            />

            <Properties
              data={[
                {
                  title: 'More Info:',
                  value: '🫠',
                },
                {
                  title: 'My Name Tag:',
                  tooltip: '🫠',
                  value: (
                    <>
                      Not Availiable <Link href="/">Login to update</Link>
                    </>
                  ),
                },
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
            className="tab-panel"
            tabs={[
              {
                title: 'Transactions',
                value: '',
                to: pathname,
              },
              {
                title: 'Internal TXns',
                value: 'internaltx',
                to: `${pathname}?tab=internaltx`,
              },
              {
                title: 'Erc20 Token TXns',
                value: 'tokentxns',
                to: `${pathname}?tab=tokentxns`,
              },

              {
                title: 'Contract',
                indicator: <IconVerify />,
                value: ['code', 'readContract', 'writeContract'],
                to: `${pathname}?tab=code`,
              },
              {
                title: 'Events',
                value: 'events',
                to: `${pathname}?tab=events`,
              },
              {
                title: 'Analytics',
                value: 'analytics',
                to: `${pathname}?tab=analytics`,
              },

              {
                title: 'Comments',
                indicator: <IconVerify />,
                value: 'comments',
                to: `${pathname}?tab=comments`,
              },
            ]}
            value={tab}
          >
            {/* Card here should depend on Tab's query param value */}
            <Card>
              {isSubTab && (
                <TabPanel
                  className="tab-panel"
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
                  {tab === 'code' && <Files match={match} />}
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
              )}
              {/* Transactions tab */}
              {tab === undefined && transactions && transactions.length > 0 && (
                <DataTable
                  columns={txsColumns}
                  data={transactions}
                  total={transactions[0].blockNumber}
                  perPage={perPage[1]}
                  onPageChange={onPaginationChange}
                />
              )}
            </Card>
          </TabPanel>
        </DetailsView>
      </Page>
    </>
  )
}

export default ContractView
