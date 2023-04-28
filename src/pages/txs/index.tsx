import { useCallback, useEffect, useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useLazyQuery } from '@apollo/client'
import {
  ChainStatsModel,
  TransactionModel,
  TransactionStatsModel,
} from '@/__generated__/resolvers-types'
import { Delta, DetailsView, Page, Summary } from '@/components'
import DataTable from '@/components/DataTable'
import { txsColumns } from '@/components/Table/columns'
import { useIsMount } from '@/hooks'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import {
  CHAIN_STATS,
  GET_TRANSACTIONS,
  TRANSACTIONS_STATS,
} from '@/lib/apollo/queries'
import {
  financialFormatLowValueHighPrecision,
  getNormalizedValue,
} from '@/lib/utils'
import { PaginationVariables } from '@/types'

const perPage = [5, 10, 25, 50, 100]

interface ITxsProps {
  transactions: TransactionModel[]
  transactionStats: TransactionStatsModel
  chainStats: ChainStatsModel
}

const Txs: NextPage<ITxsProps> = (props) => {
  const isMount = useIsMount()
  const [transactions, setTransactions] = useState(props.transactions)
  const [getTransactions, { data, loading }] = useLazyQuery(GET_TRANSACTIONS)

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

  console.log(props.transactionStats)

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
                  props.chainStats?.transactionsCount || 0
                ),
              },
              {
                title: 'Transactions per Second',
                value: financialFormatLowValueHighPrecision(
                  props.chainStats?.transactionsPerSecond || 0
                ),
              },
              {
                title: 'Transactions, 24h',
                value: (
                  <>
                    {financialFormatLowValueHighPrecision(
                      props.transactionStats?.transactions24H
                    )}{' '}
                    <Delta
                      value={props.transactionStats?.transactionsDelta24H * 100}
                    />
                  </>
                ),
              },
              {
                title: 'Network Transactions Fee, 24h',
                value: (
                  <>
                    {getNormalizedValue(
                      props.transactionStats?.networkTransactionsFee24H
                    )}{' '}
                    <Delta
                      value={
                        props.transactionStats?.networkTransactionsFeeDelta24H *
                        100
                      }
                    />
                  </>
                ),
              },
            ]}
          />

          <DataTable
            isLoading={loading}
            columns={txsColumns}
            data={transactions}
            total={transactions[0].blockNumber}
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

  const { data: transactionStats } = await apolloClient.query({
    query: TRANSACTIONS_STATS,
  })

  return addApolloState(apolloClient, {
    props: { ...transactions, ...chainStats, ...transactionStats },
  })
}
