import { GetServerSidePropsContext, NextPage } from 'next'
import Head from 'next/head'

import { useCallback, useEffect, useState } from 'react'

import { useLazyQuery } from '@apollo/client'

import {
  BlockModel,
  BlockStatsModel,
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'
import Ad from '@/components/Ad'
import Button from '@/components/Button'
import DataTable from '@/components/DataTable'
import DetailsView from '@/components/DetailsView'
import { IconWarehouse } from '@/components/Icons'
import Page from '@/components/Page'
import { DEFAULT_PER_PAGE } from '@/components/Pagination'
import Summary from '@/components/Summary'
import { blocksColumns } from '@/components/Table/columns'
import Value from '@/components/Value'
import { useIsMount } from '@/hooks'
import { addApolloState, initializeApollo } from '@/lib/apollo/client'
import { GET_BLOCKS } from '@/lib/apollo/queries'
import { getLogger } from '@/lib/logger'
import { financialFormat, financialFormatLowValueHighPrecision } from '@/lib/utils'
import { PaginationVariables } from '@/types'

import styles from './Pages.module.scss'

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

  const pageTitle = `${props.chainConfig.name} Blocks`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
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
                value: financialFormatLowValueHighPrecision(props?.chainStats?.lastBlockNumber),
              },
              {
                title: 'Last Safe Block',
                value: financialFormatLowValueHighPrecision(props?.blockStats?.lastSafeBlock),
              },
              {
                title: 'Burnt Fees',
                value: financialFormatLowValueHighPrecision(props?.blockStats?.burntFees),
              },
              {
                title: 'Network Utilization',
                value: (
                  <Value
                    value={financialFormat(props?.blockStats?.networkUtilization24H)}
                    suffix="%"
                  />
                ),
              },
            ]}
          />

          <Ad chainConfig={props.chainConfig} />

          <DataTable
            header={
              <Button
                icon={<IconWarehouse />}
                caption="SQL query"
                data-tooltip-id="app-tooltip"
                data-tooltip-content={`Open query in Warehouse`}
                className={styles.warehouse}
                target="_blank"
                rel="noreferrer noopener"
                href={`${process.env.NEXT_PUBLIC_REDASH_URL}/queries/73`}
              />
            }
            isLoading={loading}
            columns={blocksColumns(props.chainConfig)}
            data={blocks}
            total={props?.chainStats?.lastBlockNumber || 0}
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
    data: { blocks, blockStats, chainStats, chainConfig },
    error,
  } = await apolloClient.query({
    query: GET_BLOCKS,
    variables: { first: DEFAULT_PER_PAGE, skip: 0 },
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
