import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import {
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'
import DetailsView from '@/components/DetailsView'
import Page from '@/components/Page'
import { Erc20DataTable } from '@/components/Tables'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_CHAIN_CONFIG } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

interface ITxsProps {
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
}

const Txs: NextPage<ITxsProps> = ({ ...props }) => {
  return (
    <>
      <Head>
        <title>ERC-20 Token TXns</title>
        <meta
          name="description"
          content={`Explore recent ERC-20 tokens transfers on ${props.chainConfig.name} ${props.chainConfig.chain}`}
        />
        <link rel="icon" href={props.chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Page chainConfig={props.chainConfig}>
        <DetailsView title="ERC-20 Token TXns">
          <Erc20DataTable />
        </DetailsView>
      </Page>
    </>
  )
}

export default Txs

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('txs')
  try {
    const apolloClient = initializeApollo({ ctx })

    const { data, error } = await apolloClient.query({
      query: GET_CHAIN_CONFIG,
    })
    error
      ? logger.error(error, 'Error getting GET_TRANSACTIONS_STATS info')
      : logger.info({ msg: 'Got GET_TRANSACTIONS_STATS info', data })

    return addApolloState(apolloClient, {
      props: {
        ...data,
      },
    })
  } catch (e) {
    logger.error(e, 'getServerSideProps error')
    throw e
  }
}
