import { FC, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import Dropdown from '../Dropdown'
import { ChainSelectProps } from './types'
import { useChainsWhen } from '@/hooks/useChains'
import styles from './ChainSelect.module.scss'

const ChainSelect: FC<ChainSelectProps> = ({
  className,
  chainConfig,
  urlGenerator,
  titleFormatter,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const { loading, data } = useChainsWhen(isOpen)

  const handleOpen = () => {
    setIsOpen(true)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleClick = () => {
    setIsOpen(false)
  }

  const renderContent = () => (
    <nav className={styles.container}>
      <ul className={styles.list}>
        {data
          ?.filter((chain) => !!chain.guruBlockExplorer)
          .map((chain) => {
            const explorer = chain?.guruBlockExplorer

            return (
              <li key={chain.chainId} className={styles.item}>
                <Link
                  href={
                    urlGenerator ? urlGenerator(chain) : explorer?.url || ''
                  }
                  className={styles.link}
                  style={{ color: chain?.chainColor }}
                  onClick={handleClick}
                >
                  <Image
                    src={chain.icon || ''}
                    alt={chain.name}
                    className={styles.icon}
                    width={32}
                    height={32}
                  />
                  <span className={styles.caption}>
                    {titleFormatter?.(chain) || chain.name}
                  </span>
                </Link>
              </li>
            )
          })}
      </ul>
    </nav>
  )

  return (
    <Dropdown
      className={clsx(styles.button, className)}
      icon={
        <Image
          src={chainConfig.icon}
          alt={chainConfig.name}
          width={32}
          height={32}
        />
      }
      caption={titleFormatter?.(chainConfig) || chainConfig.name}
      onOpen={handleOpen}
      onClose={handleClose}
      isOpen={isOpen}
    >
      {!loading && renderContent()}
    </Dropdown>
  )
}

export default ChainSelect
