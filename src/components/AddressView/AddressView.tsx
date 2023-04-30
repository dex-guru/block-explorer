import { FC, useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'
import { txsColumns } from '../Table/columns'
import { IAddressViewProps } from './types'
import {
  Avatar,
  DetailsView,
  Grid,
  Page,
  Properties,
  TabPanel,
  DataTable,
  Card,
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
            {/* Content here should depend on Tab's query param value */}
            {/* Transactions tab */}
            {tab === undefined && (
              <DataTable
                isLoading={loading}
                columns={txsColumns}
                data={transactions || []}
                total={
                  transactions && transactions[0] && transactions[0].blockNumber
                }
                perPage={perPage[1]}
                onPageChange={onPaginationChange}
                empty={{
                  title: 'No transactions for this address',
                }}
              />
            )}

            {tab === 'internaltx' && (
              <DataTable
                isLoading={loading}
                columns={txsColumns}
                data={[]}
                total={0}
                perPage={perPage[1]}
                onPageChange={onPaginationChange}
                empty={{
                  title: 'No internal transactions for this address',
                }}
              />
            )}

            {tab === 'tokentxns' && (
              <DataTable
                isLoading={loading}
                columns={txsColumns}
                data={[]}
                total={0}
                perPage={perPage[1]}
                onPageChange={onPaginationChange}
                empty={{
                  title: 'No token transactions for this address',
                }}
              />
            )}

            {tab === 'analytics' && <Card>Some analytics here soon</Card>}
            {tab === 'comments' && <Card>Some comments here soon</Card>}
          </TabPanel>
        </DetailsView>
      </Page>
    </>
  )
}

export default AddressView
