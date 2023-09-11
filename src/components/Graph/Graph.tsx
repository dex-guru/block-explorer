import { FC, useRef, useState } from 'react'
import { TransformWrapper } from 'react-zoom-pan-pinch'
import clsx from 'clsx'
import GraphContent from './GraphContent'
import { GraphProps } from './types'
import Message from '@/components/Message'
import styles from './Graph.module.scss'

const DEFAULT_CONFIG = {
  maxTextSize: 99999999,
  theme: 'default',
  themeVariables: {
    fontFamily: 'var(--font-ibm)',
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
    mainBkg: 'var(--color-bg-2, #eee)',
  },
  securityLevel: 'antiscript',
  flowchart: {
    curve: 'monotoneX',
    useMaxWidth: true,
    htmlLabels: true,
  },
}

const Graph: FC<GraphProps> = ({
  data,
  children,
  className,
  config,
  svgManipulationCallback,
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [isAllowedHuge, setIsAllowedHuge] = useState(false)

  const graphData = data || children?.toString() || ''

  if (!graphData) {
    return null
  }

  if (graphData.length > 10000 && !isAllowedHuge) {
    return (
      <Message
        type="danger"
        text="Displaying this diagram might cause performance issues on this page!"
        actions={[
          {
            caption: 'Display chart',
            className: styles.submit,
            onClick: () => {
              setIsAllowedHuge(true)
            },
          },
        ]}
      />
    )
  }

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      ref?.current?.requestFullscreen()
    }
  }

  return (
    <div className={clsx(styles.container, className)} ref={ref} style={style}>
      <TransformWrapper
        initialScale={1}
        initialPositionX={200}
        initialPositionY={100}
        centerOnInit={true}
        centerZoomedOut={true}
        smooth={true}
        limitToBounds={false}
        minScale={0.75}
        maxScale={40}
      >
        <GraphContent
          config={{ ...DEFAULT_CONFIG, ...config }}
          onFullscreen={handleFullScreen}
          data={graphData}
          svgManipulationCallback={svgManipulationCallback}
        />
      </TransformWrapper>
    </div>
  )
}

export default Graph
