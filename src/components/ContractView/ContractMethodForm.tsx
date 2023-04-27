import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { readContract, writeContract, prepareWriteContract } from '@wagmi/core'
import { Abi, AbiFunction } from 'abitype'
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'

export interface IFormProps {
  method: AbiFunction & { type: 'function' }
  abi: Abi
  address: string
  isWrite?: boolean
}
const ContractMethodForm: FC<IFormProps> = ({
  method,
  address,
  abi,
  isWrite,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const { address: account } = useAccount()

  const [callResult, setCallResult] = useState<unknown>(undefined)

  const onRead = useCallback(
    async (
      args: { [key: string]: string },
      event?: React.BaseSyntheticEvent
    ) => {
      event?.preventDefault()

      const methodArgs = Object.values(args)
      const data = await readContract({
        address: address as `0x${string}`,
        abi,
        functionName: method.name,
        args: methodArgs,
        chainId: 7700,
      })
      const result = ethers.BigNumber.isBigNumber(data) ? data.toString() : data

      setCallResult(result)
    },
    [abi, address, method.name]
  )

  const onWrite = useCallback(
    async (
      args: { [key: string]: string },
      event?: React.BaseSyntheticEvent
    ) => {
      event?.preventDefault()
      let value = '0'
      const methodArgs = Object.values(args)
      if (method.stateMutability === 'payable' && methodArgs.length > 0) {
        value = methodArgs.pop() as string // methodArgs isn't empty so it will be never undefined
      }
      const config = await prepareWriteContract({
        address: address as `0x${string}`,
        abi,
        functionName: method.name,
        args: methodArgs,
        chainId: 7700,
        overrides: {
          from: account,
          value: ethers.BigNumber.from(value),
        },
      })
      const data = await writeContract<Abi, string, ethers.Signer>(config)

      const result = ethers.BigNumber.isBigNumber(data) ? data.toString() : data

      setCallResult(result)
    },
    [abi, account, address, method.name, method.stateMutability]
  )

  return (
    <>
      <div>{method.name}</div>
      <form
        key={method.name}
        onSubmit={handleSubmit(isWrite ? onWrite : onRead)}
      >
        <>
          {method.inputs?.map((input, index: number) => {
            const name = `input-${index}-${input.name}`
            return (
              <>
                <label htmlFor={name}>{input.name}</label>
                <input {...register(name)} />
                {/* errors will return when field validation fails  */}
                {errors.exampleRequired && <span>This field is required</span>}
              </>
            )
          })}
          {method.stateMutability === 'payable' && (
            <>
              <label htmlFor="payable">native token amount (payable)</label>
              <input {...register('payable')} />
              {/* errors will return when field validation fails  */}
              {errors.exampleRequired && <span>This field is required</span>}
            </>
          )}
          {callResult}
          <input type="submit" />
          <div> ==================</div>
        </>
      </form>
    </>
  )
}

export default ContractMethodForm
