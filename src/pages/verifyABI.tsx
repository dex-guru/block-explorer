import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'

import { ChainConfigModel } from '@/__generated__/resolvers-types'
import DetailsView from '@/components/DetailsView'
import { IconVerify } from '@/components/Icons'
import Page from '@/components/Page'
import VerifyABI from '@/components/VerifyABI'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

const VerifyABIPage: NextPage<{ chainConfig: ChainConfigModel }> = ({ chainConfig }) => {
  return (
    <>
      <Head>
        <title>Verify Contract</title>
        <meta name="description" content="Block Explorer" />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        <DetailsView title="Verify ABI" icon={<IconVerify className="" />}>
          <VerifyABI />
        </DetailsView>
      </Page>
    </>
  )
}

export default VerifyABIPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('verifyContract')

  const apolloClient = initializeApollo({ ctx })

  const {
    data: { chainConfig },
    error,
  } = await apolloClient.query({
    query: GET_CHAIN_CONFIG,
  })

  error && logger.error(error, 'Error getting GET_CHAIN_CONFIG info')

  return addApolloState(apolloClient, {
    props: {
      chainConfig,
    },
  })
}
