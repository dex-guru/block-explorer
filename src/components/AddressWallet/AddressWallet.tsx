import { FC, useState } from 'react'
import clsx from 'clsx'
import Label from '../Label'
import Value from '../Value'
import AddressWalletTokens from './AddressWalletTokens'
import { AddressWalletProps } from './types'
import { Button, IconDown, IconWallet, OutsideClicker } from '@/components'
import { financialFormat } from '@/lib/utils'
import styles from './AddressWallet.module.scss'

const AddressWallet: FC<AddressWalletProps> = ({
  address,
  className,
  tokenHoldingsStats,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  if (!tokenHoldingsStats?.tokenCount) {
    return <span className={styles.muted}>–</span>
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <OutsideClicker
      className={clsx(styles.container, className)}
      onClick={handleClose}
    >
      <div className={styles.body}>
        <div
          className={clsx(styles.stats, { [styles.statsOpen]: isOpen })}
          onClick={handleClick}
        >
          <Value
            value={financialFormat(tokenHoldingsStats?.totalStable)}
            prefix="$"
          />{' '}
          <Label type="tag" className={styles.label}>
            {tokenHoldingsStats?.tokenCount}
          </Label>
          {isOpen && <AddressWalletTokens address={address} />}
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
    </OutsideClicker>
  )
}

export default AddressWallet
