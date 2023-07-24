import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { IconNoData, Page, StateView } from '@/components'
import { initializeApollo, addApolloState } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'

const TokenIndex: NextPage<{ chainConfig: ChainConfigModel }> = ({
  chainConfig,
}) => {
  return (
    <>
      <Head>
        <title>No address provided</title>
        <meta
          name="description"
          content={`Explore token to track recent transactions, explore its balances, and view token activity in real time.`}
        />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        <StateView icon={<IconNoData />} title="No address provided" />
      </Page>
    </>
  )
}

export default TokenIndex

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const apolloClient = initializeApollo({ ctx })

  const {
    data: { chainConfig },
  } = await apolloClient.query({
    query: GET_CHAIN_CONFIG,
  })

  return addApolloState(apolloClient, {
    props: {
      chainConfig,
    },
  })
}
