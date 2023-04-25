import jazzicon from '@metamask/jazzicon'

export const getJazzIcon = (address: string): HTMLElement => {
  const addr = address?.slice(2, 10)
  const seed = parseInt(addr, 16)
  const icon = jazzicon(32, seed)

  return icon
}
