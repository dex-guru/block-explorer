import { useCallback, useEffect, useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useLazyQuery } from '@apollo/client'
import {
  ChainStatsModel,
  TransactionModel,
  TransactionStatsModel,
} from '@/__generated__/resolvers-types'
import { Delta, DetailsView, Empty, Page, Summary } from '@/components'
import DataTable from '@/components/DataTable'
import { txsColumns } from '@/components/Table/columns'
import { useIsMount } from '@/hooks'
import IconEmpty from '@/images/icons/no-flash.svg'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_TRANSACTIONS } from '@/lib/apollo/queries'
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
  block?: number
}

const Txs: NextPage<ITxsProps> = (props) => {
  const isMount = useIsMount()
  const [transactions, setTransactions] = useState(props.transactions)
  const [getTransactions, { data, loading }] = useLazyQuery(GET_TRANSACTIONS)

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getTransactions({ variables: { blockNumber: props.block, ...variables } })
    },
    [getTransactions, props.block]
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
        <DetailsView
          title={props.block ? 'Transactions for block' : 'Transactions'}
          address={props.block?.toString()}
        >
          {!props.block && (
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
                        value={
                          props.transactionStats?.transactionsDelta24H * 100
                        }
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
                          props.transactionStats
                            ?.networkTransactionsFeeDelta24H * 100
                        }
                      />
                    </>
                  ),
                },
              ]}
            />
          )}

          {transactions.length > 0 && (
            <DataTable
              isLoading={loading}
              columns={txsColumns}
              data={transactions}
              total={props.transactionStats.transactionsCount}
              perPage={perPage[1]}
              onPageChange={onPaginationChange}
            />
          )}

          {!transactions.length && (
            <Empty
              icon={<IconEmpty />}
              title="No transactions for this block"
            />
          )}
        </DetailsView>
      </Page>
    </>
  )
}

export default Txs

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const apolloClient = initializeApollo({ ctx })

  const blocks = ctx.query.block as string
  const block = blocks && blocks[0] ? parseInt(blocks) : null

  const {
    data: { transactions, transactionStats, chainStats },
  } = await apolloClient.query({
    query: GET_TRANSACTIONS,
    variables: { blockNumber: block, first: 10, skip: 0 },
  })

  return addApolloState(apolloClient, {
    props: {
      transactions,
      chainStats,
      transactionStats,
      block,
    },
  })
}
