import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { Page } from '@/components'
import { initializeApollo, addApolloState } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import styles from './Pages.module.scss'

const VerifyContract: NextPage<{ chainConfig: ChainConfigModel }> = ({
  chainConfig,
}) => {
  return (
    <>
      <Head>
        <title>Verify Contract</title>
        <meta name="description" content="Block Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page chainConfig={chainConfig}>
        <iframe
          src="https://sourcify.dev/#/verifier"
          className={styles.verifyContractFrame}
        />
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
