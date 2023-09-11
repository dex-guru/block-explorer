import { CSSProperties, FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import BigNumber from 'bignumber.js'
import { BalanceFlow } from './hooks'
import { ChainConfigModel } from '@/__generated__/resolvers-types'
import { AddressValues } from '@/components/Address/helpers'
import { getNormalizedValue } from '@/lib/utils'
import styles from './TxBalanceChanges.module.scss'

const Graph = dynamic(() => import('@/components/Graph'), { ssr: false })

const TxBalanceChangesFlow: FC<{
  addresses: string[]
  balanceFlows: BalanceFlow[] | null
  chainConfig: ChainConfigModel
}> = ({ addresses, balanceFlows, chainConfig }) => {
  const graphTextLines = ['graph LR']

  const nodeRenderHtml = (address: string) => {
    return renderToStaticMarkup(
      <Link
        href={AddressValues.account.url(address) || ''}
        data-tooltip-id="app-tooltip"
        data-tooltip-content={address}
        className={styles.graphLink}
        style={{ '--img': `url(/api/avatar/${address})` } as CSSProperties}
      >
        {AddressValues.account.format(address)}
      </Link>
    )
  }

  const labelRenderHtml = (amount: BigNumber, token: string | null) => {
    const isNativeOrWrappedNative =
      !token || token === chainConfig.nativeCurrency.wrappedAddress
    const tokenLogo = isNativeOrWrappedNative
      ? `url(${chainConfig.icon})`
      : `url(/api/avatar/${token})`

    return renderToStaticMarkup(
      <span className={styles.graphLabel}>
        {getNormalizedValue(amount || 0, 18, {
          highPrecession: true,
        })}{' '}
        {token ? (
          <Link
            href={AddressValues.token.url(token) || ''}
            data-tooltip-id="app-tooltip"
            data-tooltip-content={token}
            className={styles.graphLink}
            style={{ '--img': tokenLogo } as CSSProperties}
          >
            {AddressValues.token.format(token)}
          </Link>
        ) : (
          <span
            className={styles.graphLink}
            style={{ '--img': tokenLogo } as CSSProperties}
          >
            {chainConfig.nativeCurrency.name}
          </span>
        )}
      </span>
    )
  }

  addresses.forEach((address) => {
    const from = `a${address}`
    graphTextLines.push(`${from}("${nodeRenderHtml(`${address}`)}")`)
  })

  addresses.forEach((address) => {
    const from = `a${address}`
    balanceFlows
      ?.filter((row) => row.from === `${address}`)
      .forEach((row) => {
        const to = `a${row.to}`
        graphTextLines.push(
          `${from} --> |"${labelRenderHtml(row.amount, row.token)}"| ${to}`
        )
      })
  })

  return <Graph data={graphTextLines.join('\r\n\t')} />
}

export default TxBalanceChangesFlow
