import clsx from 'clsx'

export const getPrefixClassName = (
  block: string,
  element?: string,
  modifier?: string | string[],
  prefix?: string
): string => {
  const elementClass = `${block}${element ? `__${element}` : ''}`

  const modifiers = typeof modifier === 'string' ? [modifier] : modifier

  return clsx(
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
