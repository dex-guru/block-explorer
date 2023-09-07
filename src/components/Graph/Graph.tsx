import { FC, useRef } from 'react'
import { TransformWrapper } from 'react-zoom-pan-pinch'
import clsx from 'clsx'
import GraphContent from './GraphContent'
import { GraphProps } from './types'
import styles from './Graph.module.scss'

const DEFAULT_CONFIG = {
  maxTextSize: 99999999,
  theme: 'default',
  themeVariables: {
    fontSize: '12px',
    edgeLabelBackground: 'transparent',
    // primaryColor: 'var(--color-bg-2)',
    primaryTextColor: 'var(--color-accent, #000)',
    primaryBorderColor: 'var(--color-accent, #000)',
    secondaryColor: 'transparent',
    secondaryBorderColor: 'var(--color-danger)',
    secondaryTextColor: 'var(--color-text)',
    tertiaryColor: 'transparent',
    tertiaryBorderColor: 'var(--color-warn)',
    tertiaryTextColor: 'var(--color-text)',
    textColor: 'var(--color-text)',

    lineColor: 'var(--color-muted, #888)',
    mainBkg: 'var(--color-bg-3, #eee)',
  },
  securityLevel: 'antiscript',
  flowchart: {
    curve: 'monotoneX',
    useMaxWidth: true,
    htmlLabels: true,
  },
}

const Graph: FC<GraphProps> = ({ data, children, className, config }) => {
  const ref = useRef<HTMLDivElement>(null)

  if (!data && !children) {
    return null
  }

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      ref?.current?.requestFullscreen()
    }
  }

  return (
    <div className={clsx(styles.container, className)} ref={ref}>
      <TransformWrapper
        initialScale={1}
        initialPositionX={200}
        initialPositionY={100}
        centerOnInit={true}
        centerZoomedOut={true}
        smooth={true}
        limitToBounds={false}
        maxScale={40}
      >
        <GraphContent
          config={{ ...DEFAULT_CONFIG, ...config }}
          onFullscreen={handleFullScreen}
        >
          {data || children}
        </GraphContent>
      </TransformWrapper>
    </div>
  )
}

export default Graph
