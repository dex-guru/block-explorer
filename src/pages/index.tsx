import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Address from '@/components/Address'
import Avatar from '@/components/Avatar'
import Card from '@/components/Card'
import DetailsView from '@/components/DetailsView'
import Header from '@/components/Header'
import Label from '@/components/Label'
import Properties from '@/components/Properties'
import TabPanel from '@/components/TabPanel'
import Tile from '@/components/Tile'
import IconVerify from '@/images/icons/verified.svg'

export default function Home() {
  const router = useRouter()
  const { tab } = router.query
  return (
    <>
      <Head>
        <title>Block Explorer</title>
        <meta name="description" content="Block Explorer" />
      </Head>
      <div className="page">
        <div className="page__header">
          <Header withSearch />
        </div>

        <div className="page__body">
          <Card
            title="Latest Blocks"
            className="card--half"
            actions={[
              {
                caption: 'View all blocks',
                className: 'card__action--more',
              },
            ]}
          >
            <table className="data-table">
              <tbody>
                <tr className="data-table__trow">
                  <th className="data-table__tcell data-table__tcell--asset">
                    <Tile
                      letters="Bk"
                      title={<Address address="1532392321" type="block" />}
                      postfix="38 sec ago"
                    />
                  </th>
                  <td className="data-table__tcell data-table__tcell--data">
                    <div className="data-table__data">
                      <div className="value">
                        Miner <Link href="/">Poolin 2</Link>
                      </div>
                      <small className="value">
                        <Link href="/">171 txns</Link> in 29 sec
                      </small>
                    </div>
                  </td>
                  <td className="data-table__tcell data-table__tcell--label">
                    <Label title="2.34912 ETH" />
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card
            title="Latest Transactions"
            className="card--half"
            actions={[
              {
                caption: 'View all transactions',
                className: 'card__action--more',
              },
            ]}
          >
            <table className="data-table">
              <tbody>
                <tr className="data-table__trow">
                  <th className="data-table__tcell data-table__tcell--asset">
                    <Tile
                      letters="Tx"
                      avatarType="rounded"
                      title={
                        <Address
                          address="0x61e1A8041186CeB8a561F6F264e8B2BB2E20e06D"
                          type="tx"
                        />
                      }
                      postfix="38 sec ago"
                    />
                  </th>
                  <td className="data-table__tcell data-table__tcell--data">
                    <div className="data-table__data">
                      <div className="value">
                        From{' '}
                        <Address
                          address="0x61e1A8041186CeB8a561F6F264e8B2BB2E20e06D"
                          type="account"
                        />
                      </div>
                      <div className="value">
                        To{' '}
                        <Address
                          address="0x61e1A8041186CeB8a561F6F264e8B2BB2E20e06D"
                          type="account"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="data-table__tcell data-table__tcell--label">
                    <Label title="2.34912 ETH" />
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>
        </div>

        <div className="page__body">
          <DetailsView title="Transaction Details">
            <TabPanel
              className="tab-panel"
              tabs={[
                {
                  title: 'Overview',
                  value: '',
                },
                {
                  title: 'Logs (16)',
                  value: 'logs',
                },
                {
                  title: 'Trace',
                  value: 'trace',
                },
              ]}
              value={tab}
            >
              <Card>
                <Properties
                  data={[
                    {
                      title: 'Transaction Hash:',
                      value:
                        '0x995590a78bcae74c64282a7ff42d8e7c3b7ae9030c1319a18fc53257b8666c99',
                      tooltip: 'Transaction Hash',
                    },
                    {
                      title: 'Status:',
                      value: 'Success',
                      tooltip: 'Status',
                    },
                    {
                      title: 'Block / Position:',
                      value: (
                        <>
                          <Address address="40340230" type="block" />
                          <Label>
                            <small>26143 Block Confirmations</small>
                          </Label>
                        </>
                      ),
                      tooltip: 'Block / Position',
                    },
                    {
                      title: 'Timestamp:',
                      value: '5 hrs 5 mins ago (Jul 18 2023 10:34:23 AM +UTC)',
                      tooltip: 'Timestamp',
                    },
                  ]}
                />
              </Card>
              <Card>
                <Properties
                  data={[
                    {
                      title: 'Transaction Hash:',
                      value:
                        '0x995590a78bcae74c64282a7ff42d8e7c3b7ae9030c1319a18fc53257b8666c99',
                    },
                    {
                      title: 'Timestamp:',
                      value: '5 hrs 5 mins ago (Jul 18 2023 10:34:23 AM +UTC)',
                    },
                  ]}
                />
              </Card>
            </TabPanel>
          </DetailsView>
        </div>

        <div className="page__body">
          <DetailsView
            icon={
              <Avatar address="0x514910771AF9Ca656af840dff83E8264EcF986CA" />
            }
            title="Contract"
            address="0x514910771AF9Ca656af840dff83E8264EcF986CA"
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
                        Not Availiable <a href="/">Login to update</a>
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
                  value: 'txs',
                },
                {
                  title: 'Internal TXns',
                  value: 'internal-txs',
                },
                {
                  title: 'Erc20 Token TXns',
                  value: 'erc20',
                },
                {
                  title: 'Erc721 Token TXns',
                  value: 'erc721',
                },
                {
                  title: 'Contract',
                  indicator: <IconVerify />,
                  value: 'contract',
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
                  title: 'Info',
                  value: 'info',
                },
                {
                  title: 'Comments',
                  indicator: <IconVerify />,
                  value: 'comments',
                },
              ]}
              value="txs"
            >
              <Card>
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
              </Card>
            </TabPanel>
          </DetailsView>
        </div>
      </div>
    </>
  )
}
