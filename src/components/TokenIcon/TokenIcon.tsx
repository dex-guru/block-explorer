import { FC, useState } from 'react'
import Image from 'next/image'
import { IconQuestion } from '..'
import clsx from 'clsx'
import { TokenIconProps } from './types'
import styles from './TokenIcon.module.scss'

const TokenIcon: FC<TokenIconProps> = ({
  address,
  network,
  alt,
  className,
  fallback,
}) => {
  const extensions = ['svg', 'png', 'jpg']
  const [extIdx, setExtIdx] = useState(0)

  const getImgSrc = () =>
    `https://assets-stage.dex.guru/icons/${address.toLowerCase()}-${network
      .toLowerCase()
      .replace('ethereum', 'eth')}.${extensions[extIdx]}`

  if (!extensions[extIdx]) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <IconQuestion
        width={20}
        height={20}
        className={clsx(styles.container, className)}
      />
    )
  }

  return (
    <Image
      src={getImgSrc()}
      width={20}
      height={20}
      className={clsx(styles.container, className)}
      alt={alt}
      onError={() => {
        setExtIdx(extIdx + 1)
      }}
    />
  )
}

export default TokenIcon
