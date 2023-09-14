import { CSSProperties, FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import BigNumber from 'bignumber.js'
import { BalanceFlow } from './hooks'
import { ChainConfigModel, TokenModel } from '@/__generated__/resolvers-types'
import { AddressValues } from '@/components/Address/helpers'
import { getNormalizedValue } from '@/lib/utils'

const Graph = dynamic(() => import('@/components/Graph'), { ssr: false })

const TxBalanceChangesFlow: FC<{
  addresses: string[]
  tokens?: TokenModel[]
  balanceFlows: BalanceFlow[] | null
  chainConfig: ChainConfigModel
}> = ({ addresses, tokens, balanceFlows, chainConfig }) => {
  const graphTextLines = ['graph LR']

  const nodeRenderHtml = (address: string) => {
    const token = tokens?.find((token) => token.address === address)
    return renderToStaticMarkup(
      <Link href={AddressValues.account.url(address) || ''}>
        {token?.name || AddressValues.account.format(address)}
      </Link>
    )
  }

  const labelRenderHtml = (amount: BigNumber, address: string | null) => {
    const token = tokens?.find((token) => token.address === address)

    return renderToStaticMarkup(
      <>
        {getNormalizedValue(amount || 0, token?.decimals, {
          highPrecession: true,
        })}{' '}
        {address ? (
          <Link href={AddressValues.token.url(address) || ''}>
            {token?.symbol || AddressValues.token.format(address)}
          </Link>
        ) : (
          <i>{chainConfig.nativeCurrency.name}</i>
        )}
      </>
    )
  }

  addresses.forEach((address, idx) => {
    const from = `a${idx}`
    graphTextLines.push(`${from}("${nodeRenderHtml(address)}")`)
  })

  addresses.forEach((address, idx) => {
    const from = `a${idx}`

    balanceFlows
      ?.filter((row) => row.from === address)
      .forEach((row) => {
        const addrIdx = addresses.findIndex((address) => address === row.to)
        const to = addrIdx >= 0 ? `a${addrIdx}` : 'Incorrect Data'
        graphTextLines.push(
          `${from}-->|"${labelRenderHtml(row.amount, row.token)}"|${to}`
        )
      })
  })

  const svgProcess = (svg: string) => {
    return svg.replace(
      /href="\/(token|address)\/(0x[a-f0-9]+)"/gm,
      (hrefAttr, type, addr) => {
        const imgUrl =
          tokens?.find((token) => token.address === addr)?.logoURI ||
          `/api/avatar/${addr}`
        return `data-tooltip-content="${addr}" data-tooltip-id="app-tooltip" style="--img:url(${imgUrl})" ${hrefAttr}"`
      }
    )
  }

  return (
    <Graph
      style={{ '--img': `url(${chainConfig.icon})` } as CSSProperties}
      data={graphTextLines.join('\r\n\t')}
      svgManipulationCallback={svgProcess}
    />
  )
}

export default TxBalanceChangesFlow
