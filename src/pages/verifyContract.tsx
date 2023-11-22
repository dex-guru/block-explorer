import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import DetailsView from '@/components/DetailsView'
import { IconVerify } from '@/components/Icons'
import Page from '@/components/Page'
import Verifier from '@/components/Verifier'
import { initializeApollo, addApolloState } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

const VerifyContract: NextPage<{ chainConfig: ChainConfigModel }> = ({ chainConfig }) => {
  return (
    <>
      <Head>
        <title>Verify Contract</title>
        <meta name="description" content="Block Explorer" />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Page chainConfig={chainConfig}>
        <DetailsView title="Verify Contract" icon={<IconVerify className="" />}>
          <Verifier />
        </DetailsView>
      </Page>
    </>
  )
}

export default VerifyContract

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('verifyContract')

  const apolloClient = initializeApollo({ ctx })

  const {
    data: { chainConfig },
    error,
  } = await apolloClient.query({
    query: GET_CHAIN_CONFIG,
  })

  error
    ? logger.error(error, 'Error getting GET_CHAIN_CONFIG info')
    : logger.info({ msg: 'Got GET_CHAIN_CONFIG info', chainConfig })

  return addApolloState(apolloClient, {
    props: {
      chainConfig,
    },
  })
}
