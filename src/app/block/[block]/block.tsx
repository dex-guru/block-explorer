'use client'

import { FC } from 'react'
import { useParams } from 'next/navigation'
import {
  BlockModel,
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'
import { Empty, Error, IconSearch, Page } from '@/components'
import DetailsView from '@/components/DetailsView/DetailsView'
import BlockOverview from '@/components/TabContent/BlockOverview'
import { isValidBlockNumber } from '@/lib/utils'

export interface IBlockProps {
  data: BlockModel | null
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
}

const Block: FC<IBlockProps> = ({ data, chainConfig, chainStats }) => {
  const params = useParams()
  if (!params) {
    return null
  }

  const block = params.block

  return (
    <Page chainConfig={chainConfig}>
      {!isValidBlockNumber(block) && <Error title="This is not a block" />}

      {!data?.number && isValidBlockNumber(block) && (
        <Empty icon={<IconSearch />} title="No block  was found" />
      )}

      {!!data?.number && (
        <DetailsView
          title="Block"
          address={data?.number.toString()}
          type="block"
          chainConfig={chainConfig}
        >
          <BlockOverview
            data={data}
            chainConfig={chainConfig}
            chainStats={chainStats}
          />
        </DetailsView>
      )}
    </Page>
  )
}

export default Block
