import { isAddress } from 'viem'

const addressValidator = (address: string) => {
  if (!isAddress(address)) {
    return 'Invalid address'
  }
  return true
}

const boolValidator = (bool: string) => {
  if (bool === '0' || bool === '1') {
    return true
  }
  return 'Invalid boolean. Should be 0 or 1'
}

const numberValidator = (number: string) => {
  if (/\D/.test(number)) {
    return 'Invalid number'
  }
  return true
}

export const getValidator = (inputType: string) => {
  let validator = undefined
  if (inputType === 'bool') {
    validator = boolValidator
  }
  if (inputType === 'address') {
    validator = addressValidator
  }
  if (inputType.includes('int')) {
    validator = numberValidator
  }
  return validator
}
