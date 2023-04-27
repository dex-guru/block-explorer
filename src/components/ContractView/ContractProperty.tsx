import { FC } from 'react'
import { Abi, AbiFunction } from 'abitype'
import { ethers } from 'ethers'
import { useContractRead } from 'wagmi'
import Details from '../Details'

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
    chainId: 7700,
  })
  const result = ethers.BigNumber.isBigNumber(data) ? data.toString() : data
  return (
    <Details title={method.name}>
      <>
        {isLoading ? 'Loading...' : result} ({method.type})
      </>
    </Details>
  )
}

export default ContractProperty
