import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { readContract } from '@wagmi/core'
import { Abi, AbiFunction } from 'abitype'
import { ethers } from 'ethers'

export interface IFormProps {
  method: AbiFunction & { type: 'function' }
  abi: Abi
  address: string
}
const ContractMethodForm: FC<IFormProps> = ({ method, address, abi }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [callResult, setCallResult] = useState<unknown>(undefined)
  const onSubmit = async (args: { [key: string]: string }) => {
    const data = await readContract({
      address: address as `0x${string}`,
      abi,
      functionName: method.name,
      args: Object.values(args),
      chainId: 7700,
    })
    const result = ethers.BigNumber.isBigNumber(data) ? data.toString() : data

    setCallResult(result)
  }
  return (
    <>
      <div>{method.name}</div>
      <form key={method.name} onSubmit={handleSubmit(onSubmit)}>
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
          {/* {callResult &&
            method.outputs?.map((output: JsonFragmentType, index: number) => {
              const name = `input-${index}-${output.name}`
              return (
                <>
                  <label htmlFor={name}>{output.name}</label>
                  <input name={name} readOnly value={callResult} />
                </>
              )
            })} */}
          {callResult}
          <input type="submit" />
        </>
      </form>
    </>
  )
}

export default ContractMethodForm
