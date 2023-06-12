'use client'

import { FC } from 'react'
import { Error, Page } from '@/components'
import { useAppContext } from '@/lib/context'

const TxIndex: FC = () => {
  const { chainConfig } = useAppContext()
  return (
    <Page chainConfig={chainConfig}>
      <Error title="No TX hash was provided" />
    </Page>
  )
}

export default TxIndex
