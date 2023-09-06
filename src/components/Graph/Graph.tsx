import { FC } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import clsx from 'clsx'
import GraphContent from './GraphContent'
import { GraphProps } from './types'
import Button from '@/components/Button'
import styles from './Graph.module.scss'

const DEFAULT_CONFIG = {
  theme: 'default',
  themeVariables: {
    fontSize: '12px',
    edgeLabelBackground: 'transparent',
    // primaryColor: 'var(--color-bg-2)',
    primaryTextColor: 'var(--color-accent)',
    primaryBorderColor: 'var(--color-accent)',
    secondaryColor: 'transparent',
    secondaryBorderColor: 'var(--color-danger)',
    secondaryTextColor: 'var(--color-text)',
    tertiaryColor: 'transparent',
    tertiaryBorderColor: 'var(--color-warn)',
    tertiaryTextColor: 'var(--color-text)',
    textColor: 'var(--color-text)',

    lineColor: 'var(--color-muted)',
    mainBkg: 'var(--color-bg-3)',
  },
  securityLevel: 'antiscript',
  flowchart: {
    curve: 'monotoneX',
    useMaxWidth: true,
    htmlLabels: true,
  },
}

const Graph: FC<GraphProps> = ({ data, children, className, config }) => {
  if (!data && !children) {
    return null
  }

  return (
    <div className={clsx(styles.container, className)}>
      <TransformWrapper
        initialScale={1}
        initialPositionX={200}
        initialPositionY={100}
        centerOnInit={true}
        centerZoomedOut={true}
        smooth={true}
        limitToBounds={false}
      >
        {({ zoomIn, zoomOut, resetTransform, centerView }) => {
          const handleReset = () => {
            resetTransform()
            centerView(1)
          }

          return (
            <>
              <div className={styles.tools}>
                <Button
                  className={styles.zoomIn}
                  caption="Zoom In"
                  onClick={() => zoomIn()}
                />
                <Button
                  className={styles.zoomOut}
                  caption="Zoom Out"
                  onClick={() => zoomOut()}
                />
                <Button
                  className={styles.zoomFit}
                  caption="Fit"
                  onClick={handleReset}
                />
              </div>
              <div className={styles.body}>
                <TransformComponent
                  wrapperClass={styles.canvas}
                  contentClass={styles.layer}
                >
                  <GraphContent
                    config={{ ...DEFAULT_CONFIG, ...config }}
                    onReady={handleReset}
                  >
                    {data || children}
                  </GraphContent>
                </TransformComponent>
              </div>
            </>
          )
        }}
      </TransformWrapper>
    </div>
  )
}

export default Graph
