import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { BlockModel, ChainStatsModel } from '@/__generated__/resolvers-types'
import { Card, DetailsView, Page, Summary } from '@/components'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { BLOCKS_LAST, CHAIN_STATS } from '@/lib/apollo/queries'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'

interface TxsProps {
  blocks: BlockModel[]
  chainStats: ChainStatsModel
}

const TxsPage: NextPage<TxsProps> = ({ chainStats }) => {
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

  const { data: blocks } = await apolloClient.query({
    query: BLOCKS_LAST,
  })
  const { data: chainStats } = await apolloClient.query({
    query: CHAIN_STATS,
  })

  return addApolloState(apolloClient, {
    props: {
      ...blocks,
      ...chainStats,
    },
  })
}
