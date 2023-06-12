import { getLogger } from '../logger'
import { getClient } from './apolloClient'
import { GET_ADDRESS_INFO, GET_CHAIN_CONFIG } from './queries'
import {
  AddressModel,
  ChainConfigModel,
  ChainStatsModel,
  TokenHoldingsStatsModel,
} from '@/__generated__/resolvers-types'

export const getChainConfig = async (): Promise<ChainConfigModel> => {
  const logger = getLogger('common')
  try {
    logger.info('Getting chain config')
    const apolloClient = getClient()
    const {
      data: { chainConfig },
      error,
    } = await apolloClient.query<{ chainConfig: ChainConfigModel }>({
      query: GET_CHAIN_CONFIG,
    })

    error
      ? logger.error(error, 'Error getting chain config')
      : logger.info({ msg: 'Got chain config', chainConfig })

    return chainConfig
  } catch (e) {
    logger.error(e, 'Error getting chain config in catch')
    throw e
  }
}

export const getAddressPageModel = async (
  address: string
): Promise<{
  address: AddressModel
  chainStats: ChainStatsModel
  chainConfig: ChainConfigModel
  tokenHoldingsStats: TokenHoldingsStatsModel
}> => {
  const logger = getLogger('common')
  try {
    const apolloClient = getClient()
    logger.info({
      msg: 'Getting address info',
      address: address.toLowerCase(),
    })

    const { data, error } = await apolloClient.query<{
      address: AddressModel
      chainStats: ChainStatsModel
      chainConfig: ChainConfigModel
      tokenHoldingsStats: TokenHoldingsStatsModel
    }>({
      query: GET_ADDRESS_INFO,
      variables: { address: address.toLowerCase() },
    })

    error
      ? logger.error(error, 'Error getting address info')
      : logger.info({ msg: 'Got address info', data })
    return data
  } catch (e) {
    logger.error(e, 'Error getting chain config in catch')
    throw e
  }
}
