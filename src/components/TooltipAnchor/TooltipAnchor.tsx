import React, { FC } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TooltipAnchorProps } from './types'
import IconInfo from '@/images/icons/info.svg'
import { getTextWithAnchors } from '@/lib/utils'
import styles from './TooltipAnchor.module.scss'

export const TooltipAnchor: FC<TooltipAnchorProps> = ({
  tooltip,
  className,
  place,
  type,
}) => {
  const tooltipContent =
    typeof tooltip === 'string'
      ? getTextWithAnchors(tooltip)
      : renderToStaticMarkup(<>{tooltip}</>)
  const clickable = tooltipContent.includes('<a')

  return (
    <span
      className={styles.container}
      data-tooltip-class={className}
      data-delay-hide={clickable ? 500 : undefined}
      data-tooltip-html={tooltipContent}
      data-tooltip-id="app-tooltip"
      data-tooltip-place={place}
      data-tooltip-variant={type}
    >
      <span className={styles.icon}>
        <IconInfo />
      </span>
      <span className={styles.caption}>Details</span>
    </span>
  )
}
