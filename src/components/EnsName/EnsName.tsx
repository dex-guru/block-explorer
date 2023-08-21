import { FC } from 'react'
import { useEnsName, Address as WagmiAddress } from 'wagmi'
import { EnsNameProp } from './types'
import Label from '@/components/Label'

const EnsName: FC<EnsNameProp> = ({
  address,
  chainConfig,
  isTag,
  className,
}) => {
  const { data } = useEnsName({
    chainId: chainConfig.chainId,
    address: address as WagmiAddress,
  })

  if (!data) {
    return null
  }

  if (isTag) {
    return (
      <Label type="tag" className={className}>
        {data}
      </Label>
    )
  }

  return <>{data}</>
}

export default EnsName
