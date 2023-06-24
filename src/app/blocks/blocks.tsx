'use client'

import { FC, useCallback, useEffect, useState } from 'react'
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
import { GET_BLOCKS } from '@/lib/apollo/queries'
import { financialFormatLowValueHighPrecision } from '@/lib/utils'
import { PaginationVariables } from '@/types'

const perPage = [5, 10, 25, 50, 100]

export interface IBlocksProps {
  blocks: BlockModel[]
  blockStats: BlockStatsModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
}

const BlocksPage: FC<IBlocksProps> = (props) => {
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
  )
}

export default BlocksPage
