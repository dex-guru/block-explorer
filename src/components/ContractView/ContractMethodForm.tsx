import { FC, useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { readContract, writeContract, prepareWriteContract } from '@wagmi/core'
import { Abi, AbiFunction } from 'abitype'
import { ethers } from 'ethers'
import { useAccount, useChainId } from 'wagmi'
import Loading from '../Loading'
import { getValidator } from './validators'
import { Details, Heading, Button } from '@/components'
import styles from './ContractView.module.scss'

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
  const [isLoading, setIsLoading] = useState(false)
  const chainId = useChainId()

  const [callResult, setCallResult] = useState<unknown>(undefined)

  const onRead = useCallback(
    async (
      args: { [key: string]: string },
      event?: React.BaseSyntheticEvent
    ) => {
      event?.preventDefault()
      setCallResult(undefined)
      setIsLoading(true)
      const methodArgs = Object.values(args)
      try {
        const data = await readContract({
          address: address as `0x${string}`,
          abi,
          functionName: method.name,
          args: methodArgs,
          chainId: chainId,
        })
        const result = ethers.BigNumber.isBigNumber(data)
          ? data.toString()
          : data

        setCallResult(result)
        setIsLoading(false)
      } catch (e) {
        console.error(e)
        setIsLoading(false)
      }
    },
    [abi, address, method.name, chainId]
  )

  const onWrite = useCallback(
    async (
      args: { [key: string]: string },
      event?: React.BaseSyntheticEvent
    ) => {
      event?.preventDefault()
      setCallResult(undefined)
      setIsLoading(true)

      let value = '0'
      const methodArgs = Object.values(args)
      if (method.stateMutability === 'payable' && methodArgs.length > 0) {
        value = methodArgs.pop() as string // methodArgs isn't empty so it will be never undefined
      }
      try {
        const config = await prepareWriteContract({
          address: address as `0x${string}`,
          abi,
          functionName: method.name,
          args: methodArgs,
          chainId: chainId,
          overrides: {
            from: account,
            value: ethers.BigNumber.from(value),
          },
        })
        const data = await writeContract<Abi, string, ethers.Signer>(config)

        const result = ethers.BigNumber.isBigNumber(data)
          ? data.toString()
          : data

        setCallResult(result.toString())
        setIsLoading(false)
      } catch (e) {
        console.error(e)
        setIsLoading(false)
      }
    },
    [abi, account, address, method.name, method.stateMutability, chainId]
  )

  return (
    <Details title={method.name}>
      <form
        key={method.name}
        onSubmit={handleSubmit(isWrite ? onWrite : onRead)}
        className={styles.form}
      >
        <>
          {method.inputs?.map((input, index: number) => {
            const name = `input-${index}-${input.name}`
            const errorMessage = errors[name]?.message as string
            const validator = getValidator(input.type)

            return (
              <label key={index} className={styles.field}>
                <Heading
                  caption={input.name}
                  size="xs"
                  className={styles.label}
                />
                <input
                  {...register(name, {
                    required: true,
                    validate: validator,
                  })}
                  className={styles.input}
                  placeholder={`${input.name} (${
                    input.internalType || input.type
                  })`}
                />
                {errorMessage && <span>{errorMessage}</span>}
              </label>
            )
          })}
          {method.stateMutability === 'payable' && (
            <label>
              <Heading caption="native token amount (payable)" size="xs" />
              <input
                {...register('payable')}
                className={styles.input}
                placeholder="payable"
              />
              {errors.payable && (
                <span>{errors.payable.message?.toString()}</span>
              )}
            </label>
          )}
          {isLoading && <Loading />}
          {callResult}
          <Button
            type="submit"
            caption={isWrite ? 'Write' : 'Query'}
            className={styles.submit}
            disabled={!account}
          />
        </>
      </form>
    </Details>
  )
}

export default ContractMethodForm
