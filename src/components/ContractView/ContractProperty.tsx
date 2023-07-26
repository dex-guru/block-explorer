import { FC } from 'react'
import { Abi, AbiFunction } from 'abitype'
import { useContractRead } from 'wagmi'
import Details from '@/components/Details'
import { CHAIN_ID } from '@/constants'

export interface IContractPropertyProps {
  method: AbiFunction & { type: 'function' }
  abi: Abi
  address: string
}
const ContractProperty: FC<IContractPropertyProps> = ({
  method,
  address,
  abi,
}) => {
  const { data, isLoading } = useContractRead({
    address: address as `0x${string}`,
    abi,
    functionName: method.name || '',
    chainId: CHAIN_ID,
  })
  const result = `${data}`
  return (
    <Details title={method.name}>
      {isLoading ? 'Loading...' : result} ({method.type})
    </Details>
  )
}

export default ContractProperty
