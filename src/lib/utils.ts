import BigNumber from 'bignumber.js'

export const getNormalizedValue = (value: number, decimals = 18): string => {
  const result = new BigNumber(value)

  return financialFormatLowValueHighPrecision(result.shiftedBy(-decimals))
}

export const getShortAddress = (address: string): string => {
  const result = address.replace(
    /(0x)([0-9a-f]{3})(.+)([0-9a-f]{4})/i,
    '$1$2…$4'
  )
  return result
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
