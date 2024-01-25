import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'

import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { IconNoData } from '@/components/Icons'
import Page from '@/components/Page'
import StateView from '@/components/StateView'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'

const TxIndex: NextPage<{ chainConfig: ChainConfigModel }> = ({ chainConfig }) => {
  const pageTitle = `No TX hash provided on ${chainConfig.name}`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Explore transactions to see what happened with token balances and smart contracts.`}
        />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Page chainConfig={chainConfig}>
        <StateView icon={<IconNoData />} title="No TX hash was provided" />
      </Page>
    </>
  )
}

export default TxIndex

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
