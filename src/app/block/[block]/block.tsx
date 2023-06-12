'use client'

import { FC } from 'react'
import Head from 'next/head'
import { useParams } from 'next/navigation'
import { IBlockProps } from './page'
import { Empty, Error, IconSearch, Page } from '@/components'
import DetailsView from '@/components/DetailsView/DetailsView'
import BlockOverview from '@/components/TabContent/BlockOverview'
import { isValidBlockNumber } from '@/lib/utils'

const Block: FC<IBlockProps> = ({ data, chainConfig, chainStats }) => {
  const params = useParams()
  if (!params) {
    return null
  }

  const block = params.block

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

      <Page chainConfig={chainConfig}>
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
