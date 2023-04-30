import React, { FC } from 'react'
import clsx from 'clsx'
import Button from '../Button'
import { CopyProps } from './types'
import IconCopy from '@/images/icons/copy.svg'
import styles from './Copy.module.scss'

const CopyToClipboard: FC<CopyProps> = ({
  className,
  text,
  onCopy,
  caption,
}): React.ReactElement => {
  const handleClickCopy = (): void => {
    navigator.clipboard.writeText(text)
    onCopy && onCopy()
  }

  return (
    <Button
      className={clsx('clipboard-copy', styles.button, className)}
      onClick={handleClickCopy}
      icon={<IconCopy />}
      caption={caption}
    />
  )
}

export default React.memo(CopyToClipboard)
