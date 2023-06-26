import { useCallback, useEffect, useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useLazyQuery } from '@apollo/client'
import {
  BlockModel,
  BlockStatsModel,
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'
import { DetailsView, Page, Summary, Value } from '@/components'
import DataTable from '@/components/DataTable'
import { blocksColumns } from '@/components/Table/columns'
import { useIsMount } from '@/hooks'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_BLOCKS } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'
import { PaginationVariables } from '@/types'

const perPage = [5, 10, 25, 50, 100]

interface IBlocksProps {
  blocks: BlockModel[]
  blockStats: BlockStatsModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
}

const BlockPage: NextPage<IBlocksProps> = (props) => {
  const isMount = useIsMount()
  const [blocks, setBlocks] = useState(props.blocks)
  const [getBlocks, { data, loading }] = useLazyQuery(GET_BLOCKS)

  const onPaginationChange = useCallback(
    (variables: PaginationVariables) => {
      getBlocks({ variables })
    },
    [getBlocks]
  )

  useEffect(() => {
    if (data && isMount) {
      setBlocks(data.blocks)
    }
  }, [data, isMount])

  return (
    <>
      <Head>
        <title>Blocks</title>
        <meta
          name="description"
          content={`Explore recently created blocks on ${props.chainConfig.name} ${props.chainConfig.chain}`}
        />
        <link rel="icon" href={props.chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Page chainConfig={props.chainConfig}>
        <DetailsView title="Blocks">
          <Summary
            stats={[
              {
                title: 'Last Block Number',
                value: financialFormatLowValueHighPrecision(
                  props?.chainStats?.lastBlockNumber
                ),
              },
              {
                title: 'Last Safe Block',
                value: financialFormatLowValueHighPrecision(
                  props?.blockStats?.lastSafeBlock
                ),
              },
              {
                title: 'Burnt Fees',
                value: financialFormatLowValueHighPrecision(
                  props?.blockStats?.burntFees
                ),
              },
              {
                title: 'Network Utilization',
                value: (
                  <Value
                    value={financialFormatLowValueHighPrecision(
                      props?.blockStats?.networkUtilization24H
                    )}
                    suffix="%"
                  />
                ),
              },
            ]}
          />

          <DataTable
            isLoading={loading}
            columns={blocksColumns}
            data={blocks}
            total={props?.chainStats?.lastBlockNumber || 0}
            perPage={perPage[1]}
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
    data: { blocks, blockStats, chainStats, chainConfig },
    error,
  } = await apolloClient.query({
    query: GET_BLOCKS,
    variables: { first: 10, skip: 0 },
  })

  error
    ? logger.error(error, 'Error getting GET_BLOCKS info')
    : logger.info({
        msg: 'Got GET_BLOCKS info',
        obj: { blocks, blockStats, chainStats, chainConfig },
      })

  return addApolloState(apolloClient, {
    props: { blocks, blockStats, chainStats, chainConfig },
  })
}
