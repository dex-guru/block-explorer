import { FC, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { useLazyQuery } from '@apollo/client'
import clsx from 'clsx'
import { AddressWalletTokensProps } from './types'
import { TokenHoldingsModel } from '@/__generated__/resolvers-types'
import { AddressValues } from '@/components/Address/helpers'
import { IconNoIcon } from '@/components/Icons'
import Loading from '@/components/Loading'
import OutsideClicker from '@/components/OutsideClicker'
import Tile from '@/components/Tile'
import Value from '@/components/Value'
import { GET_ADDRESS_TOKENS } from '@/lib/apollo/queries'
import {
  financialFormat,
  financialFormatLowValueHighPrecision,
  getRootElement,
} from '@/lib/utils'
import styles from './AddressWallet.module.scss'

const ADRESS_WALLET_LIMIT = 100

const AddressWalletTokens: FC<AddressWalletTokensProps> = ({
  address,
  className,
  coord,
  onClose,
}) => {
  const [getTokens, { data, loading }] = useLazyQuery<{
    tokenHoldings: TokenHoldingsModel[]
  }>(GET_ADDRESS_TOKENS)

  useEffect(() => {
    getTokens({
      variables: {
        address: address?.toLowerCase(),
        first: ADRESS_WALLET_LIMIT,
        skip: 0,
      },
    })
  }, [getTokens, address])

  if (loading) {
    return <Loading />
  }

  const renderTokens = () => {
    return data?.tokenHoldings.map((token, idx) => {
      const icon = token.logo[0] ? (
        <Image
          src={token.logo[0]}
          alt={token.symbol.join('/')}
          width="32"
          height="32"
          className={styles.image}
        />
      ) : (
        <IconNoIcon className={styles.noimage} />
      )

      return (
        <li className={styles.item} key={idx}>
          <Link
            href={AddressValues['token'].url(token.contractAddress) || ''}
            className={styles.tokenLink}
          >
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

  return createPortal(
    <OutsideClicker
      onClick={(e) => {
        onClose(e)
      }}
      className={clsx(styles.dropdown, className)}
      style={{ left: coord?.left, top: coord?.top }}
    >
      <ul className={styles.list}>{renderTokens()}</ul>
    </OutsideClicker>,
    getRootElement()
  )
}

export default AddressWalletTokens
