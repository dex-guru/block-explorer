import { FC, Suspense, useState } from 'react'
import { createPortal } from 'react-dom'
import { useResizeDetector } from 'react-resize-detector'
import Image from 'next/image'
import clsx from 'clsx'
import { AddressOnChainSelectProps } from './types'
import Button from '@/components/Button'
import { IconArrowDown } from '@/components/Icons'
import OutsideClicker from '@/components/OutsideClicker'
import { getRootElement } from '@/lib/utils'
import styles from './AddressOnChainSelect.module.scss'

const AddressOnChainSelect: FC<AddressOnChainSelectProps> = ({
  current,
  className,
  variants,
  address,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { height, ref } = useResizeDetector()

  if (!variants.length) {
    return null
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

  const renderDropdown = () =>
    createPortal(
      <OutsideClicker
        className={styles.dropdown}
        onClick={handleClose}
        style={{ left: dropdownCoord?.left, top: dropdownCoord?.top }}
      >
        <ul className={styles.list}>
          {variants.map((variant) => {
            const suspensedIcon = (
              <Suspense fallback={<span className={styles.icon} />}>
                <Image
                  className={styles.icon}
                  src={variant.logo_uri}
                  alt={variant.description}
                  width={16}
                  height={16}
                />
              </Suspense>
            )

            return (
              <li key={variant.id} className={styles.item}>
                <Button
                  icon={suspensedIcon}
                  caption={variant.description}
                  to={`${variant.block_explorer.url}${variant.block_explorer.address_path}/${address}`}
                  className={styles.link}
                  style={{ color: variant.color }}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              </li>
            )
          })}
        </ul>
      </OutsideClicker>,
      getRootElement()
    )

  return (
    <div className={clsx(styles.container, className)} ref={ref}>
      <div
        className={clsx(styles.body, { [styles.open]: isOpen })}
        onClick={handleClick}
      >
        <span className={styles.caption}>{current}</span>
        <IconArrowDown
          className={clsx(styles.arrow, { [styles.arrowOpen]: isOpen })}
        />
      </div>

      {isOpen && <>{renderDropdown()}</>}
    </div>
  )
}

export default AddressOnChainSelect
