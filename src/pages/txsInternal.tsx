import { useCallback, useEffect, useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useLazyQuery } from '@apollo/client'
import {
  ChainConfigModel,
  ChainStatsModel,
  InternalTransactionModel,
} from '@/__generated__/resolvers-types'
import DataTable from '@/components/DataTable'
import DetailsView from '@/components/DetailsView'
import Page from '@/components/Page'
import { DEFAULT_PER_PAGE } from '@/components/Pagination'
import { internalTxsColumns } from '@/components/Table/columns/internalTxsColumns'
import { useIsMount } from '@/hooks'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import {
  GET_INTERNAL_TXS,
  GET_INTERNAL_TXS_WITH_TOTAL_AND_CHAIN,
} from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { PaginationVariables } from '@/types'

interface IBlocksProps {
  internalTxs: { data: InternalTransactionModel[]; total: number }
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
}

const BlockPage: NextPage<IBlocksProps> = (props) => {
  const isMount = useIsMount()
  const [internalTxs, setInternalTxs] = useState(props.internalTxs.data)
  const [getBlocks, { data, loading }] = useLazyQuery(GET_INTERNAL_TXS)

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getBlocks({ variables })
    },
    [getBlocks]
  )

  useEffect(() => {
    if (data && isMount) {
      setInternalTxs(data.internalTransactions.data)
    }
  }, [data, isMount])

  return (
    <>
      <Head>
        <title>Contract Internal Transactions</title>
        <meta
          name="description"
          content={`Explore contract internal transactions on ${props.chainConfig.name} ${props.chainConfig.chain}`}
        />
        <link rel="icon" href={props.chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Page chainConfig={props.chainConfig}>
        <DetailsView title="Contract Internal Transactions">
          <DataTable
            isLoading={loading}
            columns={internalTxsColumns(props.chainConfig, props.chainStats)}
            data={internalTxs || []}
            total={props.internalTxs.total}
            perPage={DEFAULT_PER_PAGE}
            onPageChange={onPaginationChange}
          />
        </DetailsView>
      </Page>
    </>
  )
}

export default BlockPage

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const logger = getLogger('blocks')

  const apolloClient = initializeApollo({ ctx })

  const {
    data: { internalTransactions, chainConfig, chainStats },
    error,
  } = await apolloClient.query({
    query: GET_INTERNAL_TXS_WITH_TOTAL_AND_CHAIN,
    variables: { first: DEFAULT_PER_PAGE, skip: 0 },
  })

  error
    ? logger.error(error, 'Error getting GET_INTERNAL_TXS info')
    : logger.info({
        msg: 'Got GET_INTERNAL_TXS info',
        obj: { internalTxs: internalTransactions, chainConfig, chainStats },
      })

  return addApolloState(apolloClient, {
    props: { internalTxs: internalTransactions, chainConfig, chainStats },
  })
}
