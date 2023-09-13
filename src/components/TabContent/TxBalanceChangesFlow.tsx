import { CSSProperties, FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import BigNumber from 'bignumber.js'
import { BalanceFlow } from './hooks'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { AddressValues } from '@/components/Address/helpers'
import { getNormalizedValue } from '@/lib/utils'

const Graph = dynamic(() => import('@/components/Graph'), { ssr: false })

const TxBalanceChangesFlow: FC<{
  addresses: string[]
  balanceFlows: BalanceFlow[] | null
  chainConfig: ChainConfigModel
}> = ({ addresses, balanceFlows, chainConfig }) => {
  const graphTextLines = ['graph LR']

  const nodeRenderHtml = (address: string) => {
    return renderToStaticMarkup(
      <Link href={AddressValues.account.url(address) || ''}>
        {AddressValues.account.format(address)}
      </Link>
    )
  }

  const labelRenderHtml = (amount: BigNumber, token: string | null) => {
    return renderToStaticMarkup(
      <>
        {getNormalizedValue(amount || 0, 18, {
          highPrecession: true,
        })}{' '}
        {token ? (
          <Link href={AddressValues.token.url(token) || ''}>
            {AddressValues.token.format(token)}
          </Link>
        ) : (
          <i>{chainConfig.nativeCurrency.name}</i>
        )}
      </>
    )
  }

  addresses.forEach((address, idx) => {
    const from = `a${idx}`
    graphTextLines.push(`${from}("${nodeRenderHtml(`${address}`)}")`)
  })

  addresses.forEach((address, idx) => {
    const from = `a${idx}`
    balanceFlows
      ?.filter((row) => row.from === `${address}`)
      .forEach((row) => {
        const addrIdx = addresses.indexOf(row.to)
        const to = addrIdx >= 0 ? `a${addrIdx}` : 'ERROR'
        graphTextLines.push(
          `${from}-->|"${labelRenderHtml(row.amount, row.token)}"|${to}`
        )
      })
  })

  const svgProcess = (svg: string) => {
    return svg.replace(
      /href="\/(token|address)\/(0x[a-f0-9]+)"/gm,
      'data-tooltip-content="$2" data-tooltip-id="app-tooltip" style="--img:url(/api/avatar/$2)" href="/$1/$2"'
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
