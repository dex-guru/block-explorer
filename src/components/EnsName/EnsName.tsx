import { FC, useEffect, useState } from 'react'

import { createWeb3Name } from '@web3-name-sdk/core'

import Label from '@/components/Label'

import { EnsNameProp } from './types'

const EnsName: FC<EnsNameProp> = ({ address, chainConfig, isTag, className }) => {
  const [data, setData] = useState<string | null>(null)

  useEffect(() => {
    const web3Name = createWeb3Name()
    web3Name
      .getDomainName({ address, queryChainIdList: [chainConfig.chainId] })
      .then((ensName) => setData(ensName))
  }, [chainConfig.chainId, address])

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
