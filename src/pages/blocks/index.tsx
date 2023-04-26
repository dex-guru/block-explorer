import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import {
  ChainStatsModel,
  TransactionModel,
} from '@/__generated__/resolvers-types'
import { Card, DetailsView, Page, Summary } from '@/components'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { CHAIN_STATS, TRANSACTIONS_LAST } from '@/lib/apollo/queries'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'

interface TxsProps {
  transactions: TransactionModel[]
  chainStats: ChainStatsModel
}

const TxsPage: NextPage<TxsProps> = ({ chainStats, transactions }) => {
  return (
    <>
      <Head>
        <title>Block Explorer</title>
        <meta name="description" content="Block Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <DetailsView title="Blocks">
          <Summary
            stats={[
              {
                title: 'Last Block Number',
                value: financialFormatLowValueHighPrecision(
                  chainStats?.lastBlockNumber
                ),
              },
            ]}
          />

          <Card></Card>
        </DetailsView>
      </Page>
    </>
  )
}

export default TxsPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const apolloClient = initializeApollo({ ctx })

  const { data: transactions } = await apolloClient.query({
    query: TRANSACTIONS_LAST,
  })
  const { data: chainStats } = await apolloClient.query({
    query: CHAIN_STATS,
  })

  return addApolloState(apolloClient, {
    props: {
      ...transactions,
      ...chainStats,
    },
  })
}
