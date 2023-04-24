import classNames from 'classnames'

export const getPrefixClassName = (
  block: string,
  element?: string,
  modifier?: string | string[],
  prefix?: string
): string => {
  const elementClass = `${block}${element ? `__${element}` : ''}`

  const modifiers = typeof modifier === 'string' ? [modifier] : modifier

  return classNames(
    elementClass,
    modifiers?.map((mod) => ({
      [`${elementClass}--${mod}`]: !!mod,
    })),
    prefix
      ? `${getPrefixClassName(prefix || '', element, modifier)}`
      : undefined
  )
}

export const getShortAddress = (address: string): string => {
  const result = address.replace(
    /(0x)([0-9a-f]{3})(.+)([0-9a-f]{4})/i,
    '$1$2…$4'
  )
  return result
}
