import { useChains } from './useChains'

export const useExplorers = () => {
  const { data, loading } = useChains()

  return { loading, data: data?.filter((chain) => !!chain.guruBlockExplorer) }
}
