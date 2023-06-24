'use client'

import React from 'react'
import { AppContext, AppContextType } from '@/lib/context'

const ContextWrapper = ({
  contextValue,
  children,
}: {
  contextValue: AppContextType
  children: React.ReactNode
}) => {
  // TODO: useQuery for GET_CHAIN_CONFIG and STATS with polling interval and update context provider
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  )
}

export default ContextWrapper
