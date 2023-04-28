import { FC, useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useLazyQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import { txsColumns } from '../Table/columns'
import { IAddressViewProps } from './types'
import {
  Avatar,
  Card,
  DetailsView,
  Grid,
  Page,
  Properties,
  TabPanel,
  DataTable,
} from '@/components'
import { useIsMount } from '@/hooks'
import { GET_TRANSACTIONS } from '@/lib/apollo/queries'
import { PaginationVariables } from '@/types'

const perPage = [5, 10, 25, 50, 100]

const AddressView: FC<IAddressViewProps> = ({ address, tab, ...props }) => {
  const router = useRouter()
  const pathname = router.asPath.split('?')[0]
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
          <Grid>
            <Properties
              data={[
                {
                  title: 'Balance:',
                  value: '😕',
                },
                {
                  title: 'Ether Value:',
                  value: '😕',
                },
                {
                  title: 'Token:',
                  value: '😕',
                },
              ]}
            />

            <Properties
              data={[
                {
                  title: 'More Info:',
                  value: '😕',
                },
                {
                  title: 'My Name Tag:',
                  tooltip: '😕',
                  value: (
                    <>
                      Not Availiable <Link href="/">Login to update</Link>
                    </>
                  ),
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
                title: 'Analytics',
                value: 'analytics',
                to: `${pathname}?tab=analytics`,
              },
              {
                title: 'Comments',
                value: 'comments',
                to: `${pathname}?tab=comments`,
              },
            ]}
            value={tab}
          >
            {/* Card here should depend on Tab's query param value */}
            <Card>
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

export default AddressView
