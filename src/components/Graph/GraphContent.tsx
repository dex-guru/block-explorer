import { FC, ReactNode, useCallback, useEffect, useRef } from 'react'
import { useControls, TransformComponent } from 'react-zoom-pan-pinch'
import clsx from 'clsx'
import mermaid from 'mermaid'
import Button from '../Button'
import styles from './Graph.module.scss'

const GraphContent: FC<{
  config: Record<string, unknown | Record<string, unknown>>
  children: ReactNode
  onFullscreen?: () => void
}> = ({ config, children, onFullscreen }) => {
  const refContainer = useRef<HTMLDivElement>(null)
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls()

  const handleReset = useCallback(() => {
    setTimeout(() => {
      resetTransform()
      centerView(1)
    }, 50)
  }, [centerView, resetTransform])

  useEffect(() => {
    if (!refContainer.current) {
      return
    }

    mermaid.initialize(config)
    mermaid
      .run({ nodes: [refContainer.current], suppressErrors: true })
      .then(handleReset)
  }, [children, config, handleReset])

  if (!children) {
    return null
  }

  const handleFullScreen = () => {
    onFullscreen?.()

    handleReset()
  }

  const handleDownload = () => {
    const svgEl = refContainer.current?.querySelector('svg')

    if (!svgEl) {
      return
    }

    const svgBlob = new Blob(
      ['<?xml version="1.0" standalone="no"?>\r\n', svgEl.outerHTML],
      {
        type: 'image/svg+xml;charset=utf-8',
      }
    )
    const svgUrl = URL.createObjectURL(svgBlob)
    const downloadLink = document.createElement('a')
    downloadLink.href = svgUrl
    downloadLink.download = document.title
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
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
        <Button
          className={clsx(styles.fullscreen, {
            [styles.fullscreenActive]: document.fullscreenElement,
          })}
          caption="Full Screen"
          onClick={handleFullScreen}
        />
        <Button
          className={styles.download}
          caption="Download"
          onClick={handleDownload}
        />
      </div>
      <div className={styles.body}>
        <TransformComponent
          wrapperClass={styles.canvas}
          contentClass={styles.layer}
        >
          <div className={clsx('mermaid', styles.graph)} ref={refContainer}>
            {children}
          </div>
        </TransformComponent>
      </div>
    </>
  )
}

export default GraphContent
