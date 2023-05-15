import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { Error, Page } from '@/components'
import { initializeApollo, addApolloState } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'

const AddressIndex: NextPage<{ chainConfig: ChainConfigModel }> = ({
  chainConfig,
}) => {
  return (
    <>
      <Head>
        <title>No address provided</title>
        <meta name="description" content="Block Explorer" />
      </Head>
      <Page withSearch chainConfig={chainConfig}>
        <Error title="No address provided" />
      </Page>
    </>
  )
}

export default AddressIndex

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
