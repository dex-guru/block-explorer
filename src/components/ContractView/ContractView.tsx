import { FC } from 'react'
import Head from 'next/head'
import Link from 'next/link'
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
  Table,
  Grid,
  ConnectButton,
} from '@/components'
import { useSourcifyMetadata } from '@/hooks/useSourcify'
import IconVerify from '@/images/icons/verified.svg'

const ContractView: FC<IContractViewProps> = ({ address, tab }) => {
  const match = useSourcifyMetadata(address, 7700)
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
              },
              {
                title: 'Internal TXns',
                value: 'internaltx',
              },
              {
                title: 'Erc20 Token TXns',
                value: 'tokentxns',
              },

              {
                title: 'Contract',
                indicator: <IconVerify />,
                value: ['code', 'readContract', 'writeContract'],
              },
              {
                title: 'Events',
                value: 'events',
              },
              {
                title: 'Analytics',
                value: 'analytics',
              },

              {
                title: 'Comments',
                indicator: <IconVerify />,
                value: 'comments',
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
                    },
                    {
                      title: 'Read Contract',
                      value: 'readContract',
                    },
                    {
                      title: 'Write Contract',
                      value: 'writeContract',
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

              {!isSubTab && <Table columns={txsColumns} data={[]} />}
            </Card>
          </TabPanel>
        </DetailsView>
      </Page>
    </>
  )
}

export default ContractView
