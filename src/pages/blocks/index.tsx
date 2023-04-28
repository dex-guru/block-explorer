import { useCallback, useEffect, useState } from 'react'
import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import { useLazyQuery } from '@apollo/client'
import { BlockModel, ChainStatsModel } from '@/__generated__/resolvers-types'
import { DetailsView, Page, Summary } from '@/components'
import DataTable from '@/components/DataTable'
import { blocksColumns } from '@/components/Table/columns'
import { useIsMount } from '@/hooks'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { CHAIN_STATS, GET_BLOCKS } from '@/lib/apollo/queries'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'
import { PaginationVariables } from '@/types'

const perPage = [5, 10, 25, 50, 100]

interface IBlocksProps {
  blocks: BlockModel[]
  chainStats: ChainStatsModel
}

const Txs: NextPage<IBlocksProps> = (props) => {
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
        <title>Block Explorer</title>
        <meta name="description" content="Block Explorer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Page withSearch>
        <DetailsView title="Blocks">
          <Summary
            stats={[
              {
                title: 'Last Block Number',
                value: financialFormatLowValueHighPrecision(
                  props?.chainStats?.lastBlockNumber
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

export default Txs

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const apolloClient = initializeApollo({ ctx })

  const { data: blocks } = await apolloClient.query({
    query: GET_BLOCKS,
    variables: { first: 10, skip: 0 },
  })

  const { data: chainStats } = await apolloClient.query({
    query: CHAIN_STATS,
  })

  return addApolloState(apolloClient, {
    props: { ...blocks, ...chainStats },
  })
}
