import { useCallback, useEffect, useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useLazyQuery } from '@apollo/client'
import {
  ChainStatsModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import { DetailsView, Page, Summary } from '@/components'
import DataTable from '@/components/DataTable'
import { txsColumns } from '@/components/Table/columns'
import { useIsMount } from '@/hooks'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { CHAIN_STATS, GET_TRANSACTIONS } from '@/lib/apollo/queries'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'
import { PaginationVariables } from '@/types'

const perPage = [5, 10, 25, 50, 100]

interface ITxsProps {
  transactions: TransactionModel[]
  chainStats: ChainStatsModel
}

const Txs: NextPage<ITxsProps> = (props) => {
  const isMount = useIsMount()
  const [transactions, setTransactions] = useState(props.transactions)
  const [getTransactions, { data }] = useLazyQuery(GET_TRANSACTIONS)

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getTransactions({ variables })
    },
    [getTransactions]
  )

  useEffect(() => {
    if (data && isMount) {
      setTransactions(data.transactions)
    }
  }, [data, isMount])

  return (
    <>
      <Head>
        <title>Block Explorer</title>
        <meta name="description" content="Block Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page withSearch>
        <DetailsView title="Transactions">
          <Summary
            stats={[
              {
                title: 'Transactions Count',
                value: financialFormatLowValueHighPrecision(
                  props.chainStats.transactionsCount || 0
                ),
              },
              {
                title: 'Transactions per Second',
                value: financialFormatLowValueHighPrecision(
                  props.chainStats.transactionsPerSecond || 0
                ),
              },
            ]}
          />

          <DataTable
            columns={txsColumns}
            data={transactions}
            total={props.chainStats.transactionsCount}
            perPage={perPage[1]}
            onPageChange={onPaginationChange}
          />
        </DetailsView>
      </Page>
    </>
  )
}

export default Txs

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const apolloClient = initializeApollo({ ctx })

  const { data: transactions } = await apolloClient.query({
    query: GET_TRANSACTIONS,
    variables: { first: 10, skip: 0 },
  })

  const { data: chainStats } = await apolloClient.query({
    query: CHAIN_STATS,
  })

  return addApolloState(apolloClient, {
    props: { ...transactions, ...chainStats },
  })
}
