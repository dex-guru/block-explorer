import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'
import {
  BlockModel,
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'
import { Empty, Error, IconSearch, Page } from '@/components'
import DetailsView from '@/components/DetailsView/DetailsView'
import BlockOverview from '@/components/TabContent/BlockOverview'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_BLOCKS_BY_NUMBER } from '@/lib/apollo/queries'
import { isValidBlockNumber } from '@/lib/utils'

export interface IBlockProps {
  block?: string
  data: BlockModel | null
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
}

const Block: NextPage<IBlockProps> = ({
  data,
  chainConfig,
  chainStats,
  block,
}) => {
  const pageTitle = data?.number
    ? `Block #${data?.number}`
    : isValidBlockNumber(block)
    ? `No block ${block}`
    : 'Not a block'

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={`Explore block number ${block} to see included transactions.`}
        />
        <link rel="icon" href={chainConfig.icon} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Page withSearch chainConfig={chainConfig}>
        {!isValidBlockNumber(block) && <Error title="This is not a block" />}

        {!data?.number && isValidBlockNumber(block) && (
          <Empty icon={<IconSearch />} title="No block  was found" />
        )}

        {!!data?.number && (
          <DetailsView title="Block" address={data?.number.toString()}>
            <BlockOverview
              data={data}
              chainConfig={chainConfig}
              chainStats={chainStats}
            />
          </DetailsView>
        )}
      </Page>
    </>
  )
}

export default Block

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const { block } = ctx.query

  if (!isValidBlockNumber(block)) {
    ctx.res.statusCode = 404

    return { props: { block } }
  }

  const apolloClient = initializeApollo({ ctx })

  const { data } = await apolloClient.query<{
    blocks: BlockModel[]
    chainStats: ChainStatsModel
    chainConfig: ChainConfigModel
  }>({
    query: GET_BLOCKS_BY_NUMBER,
    variables: { number: Number(block) },
  })

  const { blocks, chainStats, chainConfig } = data

  if (!blocks?.length) {
    ctx.res.statusCode = 404

    return { props: { block } }
  }

  return addApolloState(apolloClient, {
    props: { block, data: blocks[0], chainStats, chainConfig },
  })
}

export const config = {
  runtime: 'experimental-edge',
}
