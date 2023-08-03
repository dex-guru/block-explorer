import { FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useResizeDetector } from 'react-resize-detector'
import Image from 'next/image'
import Link from 'next/link'
import { useLazyQuery } from '@apollo/client'
import clsx from 'clsx'
import { AddressValues } from '../Address/helpers'
import Loading from '../Loading'
import OutsideClicker from '../OutsideClicker'
import Tile from '../Tile'
import { AddressWalletProps } from './types'
import { TokenHoldingsModel } from '@/__generated__/resolvers-types'
import Button from '@/components/Button'
import { IconArrowDown, IconNoIcon, IconWallet } from '@/components/Icons'
import Label from '@/components/Label'
import Value from '@/components/Value'
import { GET_ADDRESS_TOKENS } from '@/lib/apollo/queries'
import {
  financialFormat,
  financialFormatLowValueHighPrecision,
  getRootElement,
} from '@/lib/utils'
import styles from './AddressWallet.module.scss'

const ADDRESS_WALLET_LIMIT = 100

const AddressWallet: FC<AddressWalletProps> = ({
  address,
  className,
  tokenHoldingsStats,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [getTokens, { data, loading }] = useLazyQuery<{
    tokenHoldings: TokenHoldingsModel[]
  }>(GET_ADDRESS_TOKENS)

  const { height, ref } = useResizeDetector()

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

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = (e: Event) => {
    if (!isOpen || ref?.current?.contains(e.target as Node)) {
      return
    }

    setIsOpen(false)
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

  const rect = ref.current?.getBoundingClientRect()
  const dropdownCoord = rect
    ? { left: rect?.left, top: rect?.top + height + window.scrollY }
    : undefined

  const renderDropdown = () =>
    createPortal(
      <OutsideClicker
        onClick={(e) => {
          handleClose(e)
        }}
        className={styles.dropdown}
        style={{ left: dropdownCoord?.left, top: dropdownCoord?.top }}
      >
        <ul className={styles.list}>{renderTokens()}</ul>
      </OutsideClicker>,
      getRootElement()
    )

  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.body}>
        <div
          className={clsx(styles.stats, { [styles.statsOpen]: isOpen })}
          onClick={handleClick}
          ref={ref}
        >
          <Value
            value={financialFormat(tokenHoldingsStats?.totalStable)}
            prefix="$"
          />{' '}
          <Label type="tag" className={styles.label}>
            {tokenHoldingsStats?.tokenCount}
          </Label>
          {isOpen && loading && <Loading />}
          {isOpen && !loading && <>{renderDropdown()}</>}
          <IconArrowDown
            className={clsx(styles.arrow, { [styles.arrowOpen]: isOpen })}
          />
        </div>
        <Button
          className={styles.link}
          data-tooltip-content="View all token holdings"
          data-tooltip-id="app-tooltip"
          to={`/holdings/${address}`}
          icon={<IconWallet className={styles.wallet} />}
        />
      </div>
    </div>
  )
}

export default AddressWallet
