import { createContext } from 'react'
import { ChainConfigModel } from '@/__generated__/resolvers-types'

export const ChainConfigContext = createContext<ChainConfigModel | null>(null)
