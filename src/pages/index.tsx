import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { TransactionModel } from '@/__generated__/resolvers-types'
import {
  Address,
  Avatar,
  Banner,
  Card,
  DetailsView,
  Heading,
  Label,
  Page,
  Properties,
  Summary,
  TabPanel,
  Tile,
} from '@/components'
import Search from '@/components/Search'
import IconVerify from '@/images/icons/verified.svg'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { TRANSACTIONS_FIRST_TEN } from '@/lib/apollo/queries'

interface IndexProps {
  data: { transactions: TransactionModel[] }
}

const Index: NextPage<IndexProps> = (props) => {
  return (
    <>
      <Head>
        <title>Block Explorer</title>
        <meta name="description" content="Block Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <Banner>
          <Heading size="lg">Dex.guru Explorer</Heading>
          <Search />
        </Banner>

        <Summary
          charts={[
            {
              title: 'Ethereum Transaction History in 14 days',
              data: [
                [0, 1400],
                [0, 1410],
                [0, 1405],
                [0, 1407],
                [0, 1411],
                [0, 1415],
                [0, 1420],
              ],
              color: '#9488F0',
            },
          ]}
        />

        <Card
          isHalf
          title="Latest Blocks"
          actions={[
            {
              caption: 'View all blocks',
              to: '/',
            },
          ]}
        >
          <table className="data-table">
            <tbody>
              {props.data.transactions.map((item) => {
                return (
                  <tr className="data-table__trow" key={item.hash}>
                    <th className="data-table__tcell data-table__tcell--asset">
                      <Tile
                        letters="Bk"
                        title={
                          <Address
                            address={`${item.blockNumber}`}
                            type="block"
                          />
                        }
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
                )
              })}
            </tbody>
          </table>
        </Card>

        <Card
          isHalf
          title="Latest Transactions"
          actions={[
            {
              caption: 'View all transactions',
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

          <table className="data-table">
            <tbody>
              {props.data.transactions.map((item) => {
                return (
                  <tr className="data-table__trow" key={item.hash}>
                    <th className="data-table__tcell data-table__tcell--asset">
                      <Tile
                        letters="Bk"
                        title={
                          <Address address={`${item.blockHash}`} type="tx" />
                        }
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
                )
              })}
            </tbody>
          </table>
        </Card>
      </Page>
    </>
  )
}

export default Index

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const apolloClient = initializeApollo({ ctx })

  const { data } = await apolloClient.query({
    query: TRANSACTIONS_FIRST_TEN,
  })

  return addApolloState(apolloClient, {
    props: { data },
  })
}
