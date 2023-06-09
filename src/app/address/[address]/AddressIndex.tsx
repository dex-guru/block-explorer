'use client'

import { Page, Error } from '@/components'
import { useAppContext } from '@/lib/context'

const AddressIndex = () => {
  const { chainConfig } = useAppContext()
  return (
    <>
      <Page chainConfig={chainConfig}>
        <Error title="No address provided" />
      </Page>
    </>
  )
}

export default AddressIndex
