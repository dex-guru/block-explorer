'use client'

import { Page, Error } from '@/components'
import { useAppContext } from '@/lib/context'

const BlockIndex = () => {
  const { chainConfig } = useAppContext()

  return (
    <Page chainConfig={chainConfig}>
      <Error title="No block number provided" />
    </Page>
  )
}

export default BlockIndex
