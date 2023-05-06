import { FC, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLazyQuery } from '@apollo/client'
import clsx from 'clsx'
import { AddressValues } from '../Address/helpers'
import Loading from '../Loading'
import Tile from '../Tile'
import Value from '../Value'
import { AddressWalletTokensProps } from './types'
import { TokenHoldingsModel } from '@/__generated__/resolvers-types'
import IconNoImage from '@/images/icons/question.svg'
import { GET_ADDRESS_TOKENS } from '@/lib/apollo/queries'
import {
  financialFormat,
  financialFormatLowValueHighPrecision,
} from '@/lib/utils'
import styles from './AddressWallet.module.scss'

const ADRESS_WALLET_LIMIT = 10

const AddressWalletTokens: FC<AddressWalletTokensProps> = ({
  address,
  className,
}) => {
  const [getTokens, { data, loading }] = useLazyQuery<{
    tokenHoldings: TokenHoldingsModel[]
  }>(GET_ADDRESS_TOKENS)

  useEffect(() => {
    getTokens({ variables: { address, first: ADRESS_WALLET_LIMIT, skip: 0 } })
  }, [getTokens, address])

  if (loading) {
    return <Loading />
  }

  const accountValues = AddressValues['account']

  const renderTokens = () => {
    return data?.tokenHoldings.map((token, idx) => {
      const url = accountValues.url
        ? accountValues.url(token.contractAddress)
        : ''

      const icon = token.logo[0] ? (
        <Image
          src={token.logo[0]}
          alt={token.symbol.join('/')}
          width="32"
          height="32"
          className={styles.image}
        />
      ) : (
        <IconNoImage className={styles.noimage} />
      )

      return (
        <li className={styles.item} key={idx}>
          <Link href={url} className={styles.tokenLink}>
            <Tile
              className={styles.token}
              icon={icon}
              title={
                <Value
                  value={
                    <>{financialFormatLowValueHighPrecision(token.quantity)}</>
                  }
                  suffix={<>&nbsp;{token.symbol.join('/')}</>}
                  delta={token.change24H ? token.change24H * 100 : undefined}
                />
              }
              postfix={
                <>
                  {token.asset}{' '}
                  <Value
                    value={financialFormat(token.value || 0)}
                    prefix="~$"
                  />
                </>
              }
            />
          </Link>
        </li>
      )
    })
  }

  return (
    <div className={clsx(styles.dropdown, className)}>
      <ul className={styles.list}>{renderTokens()}</ul>
    </div>
  )
}

export default AddressWalletTokens
