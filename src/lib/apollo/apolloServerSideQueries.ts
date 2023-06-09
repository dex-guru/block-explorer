import { getLogger } from '../logger'
import { getClient } from './apolloClient'
import { GET_CHAIN_CONFIG } from './queries'
import { ChainConfigModel } from '@/__generated__/resolvers-types'

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
