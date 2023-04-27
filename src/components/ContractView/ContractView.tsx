import { FC } from 'react'
import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Abi, AbiFunction } from 'abitype'
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
} from '@/components'
import { useSourcifyMetadata } from '@/hooks/useSourcify'
import IconVerify from '@/images/icons/verified.svg'

const ContractView: FC<IContractViewProps> = ({ address, tab }) => {
  const match = useSourcifyMetadata(address, 7700)
  const abi = match?.metadata.output.abi as Abi
  if (!abi) {
    return null
  }
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
          <Card className="card--half">
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
                  value: '🫠,
                },
                {
                  title: 'Token:',
                  value: '🫠',
                },
              ]}
            />
          </Card>
          <Card className="card--half">
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
                      Not Availiable <a href="/">Login to update</a>
                    </>
                  ),
                },
                {
                  title: 'Contract Creator:',
                  value: (
                    <>
                      <Address address="🫠" type="account" />{' '}
                      at txn{' '}
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
          </Card>

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
              {/* move contract tabs array to the const */}
              {tab &&
              ['code', 'readContract', 'writeContract'].includes(
                tab as string
              ) ? (
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
                  <Card>
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
                  </Card>
                </TabPanel>
              ) : (
                <table className="data-table">
                  <thead className="data-table__thead">
                    <tr className="data-table__trow">
                      <th className="data-table__tcell" />
                      <th className="data-table__tcell">
                        <div className="data-table__tcaption">Txn Hash</div>
                      </th>
                      <th className="data-table__tcell">
                        <div className="data-table__tcaption">Method</div>
                      </th>
                      <th className="data-table__tcell">
                        <div className="data-table__tcaption">Block</div>
                      </th>
                      <th className="data-table__tcell">
                        <div className="data-table__tcaption">Age</div>
                      </th>
                      <th className="data-table__tcell">
                        <div className="data-table__tcaption">From</div>
                      </th>
                      <th className="data-table__tcell" />
                      <th className="data-table__tcell">
                        <div className="data-table__tcaption">To</div>
                      </th>
                      <th className="data-table__tcell">
                        <div className="data-table__tcaption">Value</div>
                      </th>
                      <th className="data-table__tcell">
                        <div className="data-table__tcaption">Txn Fee</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="data-table__tbody">
                    <tr>
                      <td className="data-table__tcell" />
                      <td className="data-table__tcell">
                        <Address
                          address="0x7FcC933f6042f840864886fa7f32e0397d3218eb"
                          type="tx"
                        />
                      </td>
                      <td className="data-table__tcell">
                        <div className="data-table__tag data-table__tag--approve">
                          Approve
                        </div>
                      </td>
                      <td className="data-table__tcell">Pending</td>
                      <td className="data-table__tcell">5 mins ago</td>
                      <td className="data-table__tcell">
                        <Address
                          address="0x7FcC933f6042f840864886fa7f32e0397d3218eb"
                          type="account"
                        />
                      </td>
                      <td className="data-table__tcell">
                        <div className="data-table__tag data-table__tag--in">
                          IN
                        </div>
                      </td>
                      <td className="data-table__tcell">
                        ChainLink: LINK TOKEN
                      </td>
                      <td className="data-table__tcell">O Ether</td>
                      <td className="data-table__tcell">Pending</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </Card>
          </TabPanel>
        </DetailsView>
      </Page>
    </>
  )
}

export default ContractView
