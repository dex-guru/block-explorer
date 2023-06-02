'use client'

import { createContext, useContext } from 'react'
import {
  ChainConfigModel,
  ChainStatsModel,
} from '@/__generated__/resolvers-types'

export type AppContextType = {
  chainConfig: ChainConfigModel
  chainStats: ChainStatsModel
}

export const AppContext = createContext<AppContextType | null>(null)

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("AppContext wasn't populated")
  }
  return context
}
