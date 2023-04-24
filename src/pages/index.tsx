import Header from '@/components/Header'
import Head from 'next/head'
import { IBM_Plex_Sans_Condensed, Sora } from 'next/font/google'
import classNames from 'classnames'
import Card from '@/components/Card'
import Tile from '@/components/Tile'
import Button from '@/components/Button'
import Label from '@/components/Label'
import Link from 'next/link'
import Address from '@/components/Address'
import { Heading } from '@/components/Heading'
import Tabs from '@/components/Tabs'
import TabPanel from '@/components/TabPanel'
import Properties from '@/components/Properties'
const fontIBM = IBM_Plex_Sans_Condensed({
  weight: ['400', '500'],
  subsets: ['latin-ext'],
})
const fontSora = Sora({
  weight: ['500'],
  subsets: ['latin-ext'],
})

export default function Home() {
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
                      letters="Bk"
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
          <div className="page__title">
            <Heading size="lg" className="page__heading">
              Transaction Details
            </Heading>
          </div>

          <TabPanel
            className="tab-panel"
            tabs={[
              {
                title: 'Overview',
                value: 'overview',
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
            value="overview"
          >
            <Card>
              <Properties
                data={[
                  {
                    title: 'Transaction Hash:',
                    value:
                      '0x995590a78bcae74c64282a7ff42d8e7c3b7ae9030c1319a18fc53257b8666c99',
                  },
                  {
                    title: 'Status:',
                    value: 'Success',
                  },
                  {
                    title: 'Block / Position:',
                    value: '40,340,230',
                  },
                  {
                    title: 'Timestamp:',
                    value: '5 hrs 5 mins ago (Jul 18 2023 10:34:23 AM +UTC)',
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
        </div>
      </div>
    </>
  )
}
