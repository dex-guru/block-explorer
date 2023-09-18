import BigNumber from 'bignumber.js'
import { GetFeeHistoryReturnType, isAddress } from 'viem'
import { BlockModel, ChainConfigModel } from '@/__generated__/resolvers-types'
import { BlockModelWithTimeDiff } from '@/components/Table'

export const getRootElement = () =>
  document.getElementById('page') ||
  document.getElementById('__next') ||
  document.body

export const getShortDate = (value: number, isSeconds = true) => {
  const date = new Date(value * (isSeconds ? 1000 : 1))
  return date.toLocaleDateString('en-GB', {
    timeZone: 'UTC',
    month: 'short',
    year: '2-digit',
    day: '2-digit',
  })
}

export const getNormalizedValue = (
  value: number | string | BigNumber,
  decimals = 18,
  options?: FinancialFormatOptions
): string => {
  const result = new BigNumber(value)

  return financialFormatLowValueHighPrecision(
    result.shiftedBy(-decimals),
    options
  )
}

export const getShortAddress = (address: string, count = 4): string => {
  const charCount = Math.max(count, 4)

  const regexp = new RegExp(
    `(0x)([0-9a-f]{${charCount - 1}})(.+)([0-9a-f]{${charCount}})`,
    'i'
  )

  const result = address.replace(regexp, '$1$2…$4')
  return result
}

export const hex2ascii = (hex: string | number): string => {
  if (!hex) {
    return ''
  }

  hex = hex.toString().replace(/\s+/gi, '')
  const stack = []

  for (let i = 0; i < hex.length; i += 2) {
    const code = parseInt(hex.substr(i, 2), 16)
    if (!isNaN(code) && code !== 0) {
      stack.push(String.fromCharCode(code))
    }
  }

  return stack.join('')
}

/**
 * Adds anchor elements to all the links inside a string. https://stackoverflow.com/a/56850320
 * @param {string} text text to be converted
 * @returns {string} converted text
 */
export const getTextWithAnchors = (text: string): string => {
  const regex = /(https?:[/]{0,2}|[w]{3}[.])[^ "'>]{1,}/g
  const escapedText = escape(text)
  return unescape(escapedText.replace(regex, wrapLinkWithAnchor))
}

/**
 * Surrounds string in an anchor tag. https://stackoverflow.com/a/56850320
 * @param {string} link url of link
 * @returns {string}
 */
export const wrapLinkWithAnchor = (link: string): string => {
  let linkResult = link
  const descr = String(link).replace(/^(https?:[/]{0,2})?([w]{3}[.])?/, 'www.')
  if (!/^https?:[/]{2}/.test(linkResult)) {
    linkResult = `http://${linkResult}`
  }
  return `<a href="${linkResult}" target="_blank">${descr}</a>`
}

const _prepareValue = (
  value: string | number | BigNumber
): BigNumber | false => {
  if (!value && value !== 0) {
    return false
  }

  const data =
    value instanceof BigNumber
      ? value
      : new BigNumber(typeof value === 'number' ? value.toFixed(18) : value)

  return data
}

const _appendPrefixSuffix = (data: string, prefix = '', suffix = ''): string =>
  `${prefix}${data}${suffix}`

export interface FinancialFormatOptions {
  decimals?: number
  prefix?: string
  suffix?: string
  roundBigNumbersFrom?: 'K' | 'M' | 'B' | 'T'
  disableRounding?: boolean
  highPrecession?: boolean
}

type RoundingMode = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

/*
  Rounds the number according 
  https://app.clubhouse.io/dexguru/story/6331/rounding-round-3
  0.0000001 => 7 digits after . (dot) if less than 1
  from 1.0001 to 100 => 2 digits after . (dot)
  > 100 => no digits after . (dot) 100.12 => 100
  also inserts , separator in thousand (e.g. 1,234,2324.0156)
  roundBigNumbersFrom rounds a letter for K - thousands, M - millions, B - billions
  highPrecession option renders 4 (for >1) or 18 (for <1) digits after . (dot) and doesn't support letter rounding
  decimals parameter overrides the above ones if passed
  prefix adds a specified string before the price
  @returns {string} Formatted string to display in components
*/
export const financialFormat = (
  value: string | number | BigNumber,
  options?: FinancialFormatOptions
): string => {
  const roundBigNumbersFrom = options?.disableRounding
    ? ''
    : options?.roundBigNumbersFrom || 'B' // by default round M and B

  let decimals = options?.decimals

  let roundingDirections: RoundingMode = BigNumber.ROUND_HALF_UP

  const formatConfig = {
    prefix: '',
    decimalSeparator: '.',
    groupSeparator: ',',
    groupSize: 3,
    secondaryGroupSize: 0,
    fractionGroupSeparator: ' ',
    fractionGroupSize: 0,
    suffix: '',
  }

  // if (!price) is true for 0, so need to compare with undefined explicitly
  let data = _prepareValue(value)

  if (data === false) {
    return ''
  }

  const isNegative = data.lt(0)
  data = data.abs()

  if (decimals === undefined) {
    if (data.lt(1) && data.gt(-1)) {
      decimals = 7
    }
    if ((data.gte(1) && data.lt(100)) || (data.lte(-1) && data.gt(-100))) {
      decimals = 2
    }
    if (data.gte(100) || data.lte(-100)) {
      decimals = 0
    }
  }

  if (options?.highPrecession) {
    roundingDirections = BigNumber.ROUND_DOWN

    if (options?.decimals === 0) {
      decimals = 0
    } else {
      if (data.lt(1) && data.gt(-1)) {
        decimals = options?.decimals || 18
      }
      if (data.gte(1) || data.lte(-1)) {
        decimals = options?.decimals || 4
      }
    }
  }

  if (roundBigNumbersFrom && !options?.highPrecession) {
    if (data.gte(1000) && data.lt(1000000) && roundBigNumbersFrom === 'K') {
      formatConfig.suffix = 'K'
      data = data.shiftedBy(-3)
      decimals = 1
    }
    if (
      data.gte(1000000) &&
      data.lt(1000000000) &&
      (roundBigNumbersFrom === 'M' || roundBigNumbersFrom === 'K')
    ) {
      formatConfig.suffix = 'M'
      data = data.shiftedBy(-6)
      formatConfig.decimalSeparator = '.'
      decimals = 2
    }
    if (
      data.gte(1000000000) &&
      data.lt(1000000000000) &&
      (roundBigNumbersFrom === 'B' ||
        roundBigNumbersFrom === 'M' ||
        roundBigNumbersFrom === 'K')
    ) {
      formatConfig.suffix = 'B'
      data = data.shiftedBy(-9)
      formatConfig.decimalSeparator = '.'
      decimals = 2
    }
    if (
      data.gte(1000000000000) &&
      (roundBigNumbersFrom === 'T' ||
        roundBigNumbersFrom === 'B' ||
        roundBigNumbersFrom === 'M' ||
        roundBigNumbersFrom === 'K')
    ) {
      formatConfig.suffix = 'T'
      data = data.shiftedBy(-12)
      formatConfig.decimalSeparator = '.'
      decimals = 2
    }
  }

  if (isNegative) {
    data = data.multipliedBy(-1)
  }
  const result = data.toFormat(decimals || 0, roundingDirections, formatConfig)

  const clean = result.match(/^0*([0-9,]+(?:\.?(?:(?!0+$)[0-9MBKT])+)?)/) // remove trailing zeroes

  if (clean) {
    return _appendPrefixSuffix(clean[1], options?.prefix, options?.suffix)
  } else {
    return _appendPrefixSuffix(result, options?.prefix, options?.suffix)
  }
}

// Low Value (<1) High Precision shortcut
export const financialFormatLowValueHighPrecision = (
  value: string | number | BigNumber,
  options?: FinancialFormatOptions
): string => {
  let data = _prepareValue(value)

  if (data === false) {
    return ''
  }

  const isNegative = data.lt(0)
  data = data.abs()

  const optionsDiff = data.lt(1) ? { highPrecession: true } : {}

  if (isNegative) {
    data = data.multipliedBy(-1)
  }

  const newOptions = { ...options, ...optionsDiff }

  return financialFormat(data, newOptions)
}

export const isValidBlockNumber = (
  block: string | string[] | undefined
): boolean => {
  if (!block) {
    return false
  }
  return !isNaN(Number(block)) && Number(block) !== 0
}

export const getBlocksWithTimeDiff = (
  blocks: BlockModel[] | undefined,
  perPage: number
): BlockModelWithTimeDiff[] => {
  if (!blocks) {
    return []
  }

  const blocksWithTimeDiff = blocks.map((block, index, array) => {
    if (index < Math.min(perPage, array.length - 1)) {
      const timeDiff = block.timestamp - array[index + 1].timestamp
      return { ...block, timeDiff }
    }
    return { ...block, timeDiff: 0 }
  })

  blocksWithTimeDiff.splice(perPage, 1)

  return blocksWithTimeDiff
}

export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  const r = parseInt(result ? result[1] || '0' : '0', 16)
  const g = parseInt(result ? result[2] || '0' : '0', 16)
  const b = parseInt(result ? result[3] || '0' : '0', 16)

  return [r, g, b]
}

export const rgbToHsl = (rI: number, gI: number, bI: number) => {
  const r = rI / 255
  const g = gI / 255
  const b = bI / 255

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2

  if (max == min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }

    h = (h || 0) / 6
  }

  return [h, s, l]
}

export const hexToHsl = (hex: string) => rgbToHsl(...hexToRgb(hex))

export const checkChainFeature = (
  chainConfig: ChainConfigModel,
  feature: string
) => chainConfig?.features?.some((x) => x.name === feature)

export const getSlug = (value: string) => {
  return value
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')
}

export const formatAutoDetect = (
  value: string | number,
  options?: { number: FinancialFormatOptions }
): string => {
  const valueStr = value?.toString() || ''

  if (valueStr.startsWith('0x')) {
    return valueStr
  }

  if (!isNaN(Number(valueStr))) {
    return financialFormat(value, {
      highPrecession: true,
      ...(options?.number || {}),
    })
  }

  if (!isNaN(new Date(valueStr).getDate())) {
    return getShortDate(new Date(value).getTime(), false)
  }

  return valueStr
}

export const formatFeeHistory = (
  result: GetFeeHistoryReturnType,
  includePending: boolean
) => {
  let blockNum = result.oldestBlock
  let index = 0
  const historicalBlocks = result?.gasUsedRatio?.length || 0
  const blocks = []

  while (blockNum < result.oldestBlock + BigInt(historicalBlocks)) {
    blocks.push({
      number: blockNum,
      baseFeePerGas: Number(result.baseFeePerGas[index]),
      gasUsedRatio: Number(result.gasUsedRatio[index]),
      priorityFeePerGas: result.reward?.[index].map((x) => Number(x)),
    })
    blockNum += 1n
    index += 1
  }

  if (includePending) {
    blocks.push({
      number: 'pending',
      baseFeePerGas: Number(result.baseFeePerGas[historicalBlocks]),
      gasUsedRatio: NaN,
      priorityFeePerGas: [],
    })
  }
  return blocks
}

export const avg = (arr: number[]) => {
  const sum = arr.reduce((a, v) => a + v)
  return Math.round(sum / arr.length)
}
