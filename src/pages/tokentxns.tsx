import { lazy } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  ChainConfigModel,
  ChainStatsModel,
  TransactionStatsModel,
} from '@/__generated__/resolvers-types'
import { DetailsView, Page } from '@/components'
import { Erc20DataTable } from '@/components/Tables'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_TRANSACTIONS_STATS } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'

interface ITxsProps {
  transactionStats: TransactionStatsModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
  block?: number
}

const Txs: NextPage<ITxsProps> = ({ block, ...props }) => {
  const router = useRouter()

  const pathname = router.asPath.split('?')[0]

  const pageTitle = block
    ? `Transactions in a single block ${block?.toString()}`
    : 'Transactions'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Explore recently created transactions on ${props.chainConfig.name} ${props.chainConfig.chain}`}
        />
        <link rel="icon" href={props.chainConfig.icon} />
        <link rel="canonical" href={pathname} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Page chainConfig={props.chainConfig}>
        <DetailsView title="Token Transfers (ERC-20)">
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
      query: GET_TRANSACTIONS_STATS,
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
