import { GetServerSidePropsContext, NextPage } from 'next'
import HoldingsPage from './[address]'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { initializeApollo, addApolloState } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'

const HoldingsIndex: NextPage<{ chainConfig: ChainConfigModel }> = ({
  chainConfig,
}) => <HoldingsPage address="" chainConfig={chainConfig} />

export default HoldingsIndex

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
