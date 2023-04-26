import { FC } from 'react'
import Head from 'next/head'
import { IAddressViewProps } from './types'
import {
  Address,
  Avatar,
  Card,
  DetailsView,
  Page,
  Properties,
  TabPanel,
} from '@/components'

const AddressView: FC<IAddressViewProps> = ({ address, tab }) => {
  return (
    <>
      <Head>
        <title>Block Explorer</title>
        <meta name="description" content="Block Explorer" />
      </Head>
      <Page withSearch>
        <DetailsView
          icon={<Avatar address={address} />}
          title="Address"
          address={address}
          tag="Address"
        >
          <Card className="card--half">
            <Properties
              data={[
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
                  value: 'Address',
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
                title: 'Analytics',
                value: 'analytics',
              },
              {
                title: 'Comments',
                value: 'comments',
              },
            ]}
            value={tab}
          >
            {/* Card here should depend on Tab's query param value */}
            <Card>
              <h2>Current tab: {tab}</h2>
              {/* move contract tabs array to the const */}

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
                    <td className="data-table__tcell">ChainLink: LINK TOKEN</td>
                    <td className="data-table__tcell">O Ether</td>
                    <td className="data-table__tcell">Pending</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </TabPanel>
        </DetailsView>
      </Page>
    </>
  )
}

export default AddressView
