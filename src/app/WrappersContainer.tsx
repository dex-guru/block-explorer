import ContextWrapper from './ContextWrapper'
import { getChainConfig } from '@/lib/apollo/apolloServerSideQueries'

const WrappersContainer = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  const chainConfig = await getChainConfig()

  return (
    <ContextWrapper contextValue={{ chainConfig }}>{children}</ContextWrapper>
  )
}

export default WrappersContainer
