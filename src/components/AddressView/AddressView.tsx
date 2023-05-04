import { FC, Suspense, useCallback, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'
import { txsColumns } from '../Table/columns'
import { Erc721DataTable } from '../Tables/Erc721DataTable'
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

const AddressView: FC<IAddressViewProps> = ({
  address,
  tab,
  addressInfo,
  ...props
}) => {
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
                  value: addressInfo.nativeBalance,
                },
                {
                  title: 'Canto Value:',
                  value: addressInfo.nativeBalanceUSD,
                },
                {
                  title: 'Token:',
                  value: addressInfo.assetsValueUSD,
                },
              ]}
            />

            <Properties data={[]} />
          </Grid>

          <TabPanel
            tabs={[
              {
                title: 'Transactions',
                value: '',
                to: pathname,
                content: (
                  <Suspense>
                    <DataTable
                      isLoading={loading}
                      columns={txsColumns}
                      data={transactions || []}
                      total={
                        transactions &&
                        transactions[0] &&
                        transactions[0].blockNumber
                      }
                      perPage={perPage[1]}
                      onPageChange={onPaginationChange}
                      empty={{
                        title: 'No transactions for this address',
                      }}
                    />
                  </Suspense>
                ),
              },
              {
                title: 'Internal TXns',
                value: 'internaltx',
                to: `${pathname}?tab=internaltx`,
                content: (
                  <Suspense>
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
                  </Suspense>
                ),
              },
              {
                title: 'Erc20 Token TXns',
                value: 'tokentxns',
                to: `${pathname}?tab=tokentxns`,
                content: (
                  <Suspense>
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
                  </Suspense>
                ),
              },
              {
                title: 'Erc721 Token TXns',
                value: 'tokentxns721',
                to: `${pathname}?tab=tokentxns721`,
                content: (
                  <Suspense>
                    <Erc721DataTable address={address} />
                  </Suspense>
                ),
              },
              {
                title: 'Analytics',
                value: 'analytics',
                to: `${pathname}?tab=analytics`,
                content: (
                  <Suspense>
                    <Card>Some analytics here soon</Card>
                  </Suspense>
                ),
              },
              {
                title: 'Comments',
                value: 'comments',
                to: `${pathname}?tab=comments`,
                content: (
                  <Suspense>
                    <Card>Some comments here soon</Card>
                  </Suspense>
                ),
              },
            ]}
            value={tab || ''}
          />
        </DetailsView>
      </Page>
    </>
  )
}

export default AddressView
