import { ChainData } from '@/constants/chains'

export type AddressOnChainSelectProps = {
  current: string
  className?: string
  variants: ChainData[]
  address: string
}
