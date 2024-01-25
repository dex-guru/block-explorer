import Image from 'next/image'
import Link from 'next/link'

import { FC, useEffect, useState } from 'react'

import { useLazyQuery } from '@apollo/client'
import clsx from 'clsx'

import { TokenHoldingsModel } from '@/__generated__/resolvers-types'
import { AddressValues } from '@/components/Address/helpers'
import Button from '@/components/Button'
import { IconNoIcon, IconWallet } from '@/components/Icons'
import Label from '@/components/Label'
import Loading from '@/components/Loading'
import Tile from '@/components/Tile'
import Value from '@/components/Value'
import { GET_ADDRESS_TOKENS } from '@/lib/apollo/queries'
import { financialFormat, financialFormatLowValueHighPrecision } from '@/lib/utils'

import Dropdown from '../Dropdown'
import { AddressWalletProps } from './types'

import styles from './AddressWallet.module.scss'

const ADDRESS_WALLET_LIMIT = 100

const AddressWallet: FC<AddressWalletProps> = ({ address, className, tokenHoldingsStats }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [getTokens, { data, loading }] = useLazyQuery<{
    tokenHoldings: TokenHoldingsModel[]
  }>(GET_ADDRESS_TOKENS)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    getTokens({
      variables: {
        address: address?.toLowerCase(),
        first: ADDRESS_WALLET_LIMIT,
        skip: 0,
      },
    })
  }, [getTokens, address, isOpen])

  if (!tokenHoldingsStats?.tokenCount) {
    return <span className={styles.muted}>–</span>
  }

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const renderTokens = () => {
    const content = data?.tokenHoldings.map((token, idx) => {
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
            className={styles.tokenLink}>
            <Tile
              className={styles.token}
              icon={icon}
              title={
                <Value
                  value={<>{financialFormatLowValueHighPrecision(token.quantity)}</>}
                  suffix={<>&nbsp;{token.symbol.join('/')}</>}
                  delta={token.change24H ? token.change24H * 100 : undefined}
                />
              }
              postfix={
                <>
                  {token.asset} <Value value={financialFormat(token.value || 0)} prefix="~$" />
                </>
              }
            />
          </Link>
        </li>
      )
    })

    return <ul className={styles.list}>{content}</ul>
  }

  const displayCaption = (
    <>
      <Value value={financialFormat(tokenHoldingsStats?.totalStable)} prefix="$" />{' '}
      <Label type="tag" className={styles.label}>
        {tokenHoldingsStats?.tokenCount}
      </Label>
      {isOpen && loading && <Loading />}
    </>
  )

  return (
    <div className={clsx(styles.container, className)}>
      <Dropdown
        className={styles.stats}
        caption={displayCaption}
        onOpen={handleOpen}
        onClose={handleClose}>
        {!loading && renderTokens()}
      </Dropdown>
      <Button
        className={styles.link}
        data-tooltip-content="View all token holdings"
        data-tooltip-id="app-tooltip"
        to={`/holdings/${address}`}
        icon={<IconWallet className={styles.wallet} />}
      />
    </div>
  )
}

export default AddressWallet
