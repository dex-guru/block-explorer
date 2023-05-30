import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { Page } from '@/components'
import Verifier from '@/components/Verifier'
import { initializeApollo, addApolloState } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'

const VerifyContract: NextPage<{ chainConfig: ChainConfigModel }> = ({
  chainConfig,
}) => {
  return (
    <>
      <Head>
        <title>Verify Contract</title>
        <meta name="description" content="Block Explorer" />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        <Verifier />
      </Page>
    </>
  )
}

export default VerifyContract

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
