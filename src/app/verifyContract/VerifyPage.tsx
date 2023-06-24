'use client'

import { FC } from 'react'
import { DetailsView, IconVerify, Page } from '@/components'
import Verifier from '@/components/Verifier'
import { useAppContext } from '@/lib/context'

const VerifyPage: FC = () => {
  const { chainConfig } = useAppContext()
  return (
    <Page chainConfig={chainConfig}>
      <DetailsView title="Verify Contract" icon={<IconVerify />}>
        <Verifier />
      </DetailsView>
    </Page>
  )
}

export default VerifyPage
