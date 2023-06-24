'use client'

import { FC } from 'react'
import HoldingsPage from './HoldingsPage'
import { useAppContext } from '@/lib/context'

const HoldingsIndex: FC = () => {
  const { chainConfig } = useAppContext()
  return <HoldingsPage address="" chainConfig={chainConfig} />
}

export default HoldingsIndex
