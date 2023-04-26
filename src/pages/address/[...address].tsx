import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { canto } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'
import {
  Address,
  Avatar,
  Card,
  DetailsView,
  Page,
  Properties,
  TabPanel,
} from '@/components'
import IconVerify from '@/images/icons/verified.svg'

const { chains, provider } = configureChains([canto], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: 'Block Explorer',
  chains,
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
})

const AddressPage: NextPage = () => {
  const router = useRouter()
  const { address, tab } = router.query
  if (!address) {
    return null
  }
  // call json rpc eth_getCode to get deployed code (if it exists then this is a contract, otherwise - wallet)

  // if it is a contract - fetch metadata and files from sourcify
  const normalizedAddress = Array.isArray(address) ? address[0] : address
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Head>
          <title>Block Explorer</title>
          <meta name="description" content="Block Explorer" />
        </Head>
        <Page withSearch>
          <DetailsView
            icon={<Avatar address={normalizedAddress} />}
            title="Contract"
            address={normalizedAddress}
            tag="Token Contract"
          >
            <Card className="card--half">
              <Properties
                data={[
                  {
                    title: 'Contract Overview:',
                    value: 'ChainLink: LINK Token',
                  },
                  {
                    title: 'Balance:',
                    value: '0 Ether',
                  },
                  {
                    title: 'Ether Value:',
                    value: '$0.00',
                  },
                  {
                    title: 'Token:',
                    value: '>$23,811.08',
                  },
                ]}
              />
            </Card>
            <Card className="card--half">
              <Properties
                data={[
                  {
                    title: 'More Info:',
                    value: 'ChainLink: LINK Token',
                  },
                  {
                    title: 'My Name Tag:',
                    tooltip: '',
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
                        <Address
                          address="0xf55037738604fddfc40"
                          type="account"
                        />{' '}
                        at txn{' '}
                        <Address address="0xf55037738604fddfc40" type="tx" />
                      </>
                    ),
                  },
                  {
                    title: 'Token Tracker:',
                    value: <>ChainLink Token (LINK) (@$22.93)</>,
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
                <h2>Current tab: {tab}</h2>
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
                      <h3>Current tab: {tab}</h3>

                      {['readContract', 'writeContract'].includes(
                        tab as string
                      ) && <ConnectButton />}

                      <table className="data-table">
                        <thead className="data-table__thead">
                          <tr className="data-table__trow">
                            <th className="data-table__tcell" />
                            <th className="data-table__tcell">
                              <div className="data-table__tcaption">
                                Txn Hash
                              </div>
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
                              <div className="data-table__tcaption">
                                Txn Fee
                              </div>
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
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default AddressPage
