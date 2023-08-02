import { FC, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { useTimeoutWhen } from 'rooks'
import Button from '../Button'
import { IconShare } from '../Icons'
import { DetailsViewProps } from './types'
import Copy from '@/components/Copy'
import Heading from '@/components/Heading'
import Label from '@/components/Label'
import styles from './DetaisView.module.scss'

const Tooltip = dynamic(() => import('@/components/Tooltip'), { ssr: false })

const DetailsView: FC<DetailsViewProps> = ({
  title,
  address,
  icon,
  tag,
  tagTooltip,
  className,
  children,
  header,
}) => {
  return (
    <div className={clsx(styles.container, className)}>
      <div className={styles.header}>
        {!!icon && <div className={styles.icon}>{icon}</div>}
        <Heading caption={title} size="lg" className={styles.title} />
        {!!address && (
          <>
            <Heading caption={address} size="lg" className={styles.address} />
            <Copy text={address} />
          </>
        )}
        {!!tag && (
          <Label className={styles.tag} tooltip={tagTooltip}>
            {tag}
          </Label>
        )}
        {!!header && (
          <div className={styles.tools}>
            <Share />
            {header}
          </div>
        )}
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  )
}

const Share: FC = () => {
  const router = useRouter()
  const [data, setData] = useState<ShareData | undefined>(undefined)
  const [isShowTooltip, setIsShowTooltip] = useState(false)

  useEffect(() => {
    const url =
      document
        .querySelector('head link[rel="canonical"]')
        ?.getAttribute('href') || router.asPath

    const result = {
      title: document.querySelector('head title')?.innerHTML || undefined,
      text:
        document
          .querySelector('head meta[name="description"]')
          ?.getAttribute('content') || undefined,
      url,
    }

    setData(result)
  }, [router.asPath])

  const handleClick = async () => {
    try {
      await navigator.share(data)
    } catch (err) {
      await navigator.clipboard.writeText(data?.url || '')
      setIsShowTooltip(true)
    }
  }

  useTimeoutWhen(
    () => {
      setIsShowTooltip(false)
    },
    1500,
    isShowTooltip
  )

  return (
    <>
      <Button
        data-tooltip-id="share-tooltip"
        icon={<IconShare />}
        onClick={handleClick}
      />
      <Tooltip
        content="URL copied to clipboard!"
        variant="light"
        place="bottom"
        id="share-tooltip"
        delayHide={1500}
        isOpen={isShowTooltip}
      />
    </>
  )
}

export default DetailsView
