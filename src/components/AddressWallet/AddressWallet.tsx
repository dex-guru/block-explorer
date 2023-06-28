import { FC, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import clsx from 'clsx'
import Label from '../Label'
import Value from '../Value'
import AddressWalletTokens from './AddressWalletTokens'
import { AddressWalletProps } from './types'
import { Button, IconDown, IconWallet } from '@/components'
import { financialFormat } from '@/lib/utils'
import styles from './AddressWallet.module.scss'

const AddressWallet: FC<AddressWalletProps> = ({
  address,
  className,
  tokenHoldingsStats,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const { height, ref } = useResizeDetector()

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

  const rect = ref.current?.getBoundingClientRect()
  const dropdownCoord = rect
    ? { left: rect?.left, top: rect?.top + height + window.scrollY }
    : undefined

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
          {isOpen && (
            <AddressWalletTokens
              address={address}
              coord={dropdownCoord}
              onClose={handleClose}
            />
          )}
          <IconDown
            className={clsx(styles.arrow, { [styles.arrowOpen]: isOpen })}
          />
        </div>
        <Button
          className={styles.link}
          to={`/holdings/${address}`}
          icon={<IconWallet className={styles.wallet} />}
        />
      </div>
    </div>
  )
}

export default AddressWallet
