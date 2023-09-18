import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { useControls, TransformComponent } from 'react-zoom-pan-pinch'
import clsx from 'clsx'
import mermaid from 'mermaid'
import uniqid from 'uniqid'
import {
  IconDownload,
  IconExpand,
  IconShrink,
  IconZoomFit,
  IconZoomIn,
  IconZoomOut,
} from '../Icons'
import Button from '@/components/Button'
import styles from './Graph.module.scss'

const GraphContent: FC<{
  config: Record<string, unknown | Record<string, unknown>>
  data: string
  onFullscreen?: () => void
  svgManipulationCallback?: (svg: string) => string
}> = ({ config, data, onFullscreen, svgManipulationCallback }) => {
  const refContainer = useRef<HTMLDivElement>(null)
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls()
  const [isLoading, setIsLoading] = useState(true)

  const handleReset = useCallback(() => {
    setTimeout(() => {
      resetTransform()
      centerView(1)
    }, 50)
  }, [centerView, resetTransform])

  const generate = useCallback(async () => {
    if (refContainer.current) {
      const id = uniqid()
      mermaid.render(id, data).then(({ svg }) => {
        if (refContainer.current) {
          refContainer.current.innerHTML = svgManipulationCallback?.(svg) ?? svg
          setIsLoading(false)
          handleReset()
        }
      })
    }
  }, [data, handleReset, svgManipulationCallback])

  useEffect(() => {
    if (!refContainer.current) {
      return
    }

    setIsLoading(true)
    mermaid.initialize(config)

    generate()
  }, [data, config, handleReset, generate])

  const handleFullScreen = () => {
    onFullscreen?.()
    handleReset()
  }

  const handleDownload = () => {
    const svgEl = refContainer.current?.querySelector('svg')

    if (!svgEl) {
      return
    }

    const hostname =
      typeof window !== 'undefined' && window.location.hostname
        ? window.location.hostname
        : ''

    const svgBlob = new Blob(
      [
        '<?xml version="1.0" standalone="no"?>\r\n',
        svgEl.outerHTML
          .replace(/href\=\"\//gm, `href="//${hostname}/`)
          .replace(/url\(\//gm, `url(//${hostname}/`),
      ],
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

  const FullscreenIcon = !!document.fullscreenElement ? IconShrink : IconExpand

  return (
    <>
      {!isLoading && (
        <div className={styles.tools}>
          <Button
            className={clsx(styles.action, styles.zoomIn)}
            // caption="Zoom In"
            data-tooltip-id="app-tooltip"
            data-tooltip-content="Zoom In"
            onClick={() => zoomIn()}
            icon={<IconZoomIn className={styles.icon} />}
          />
          <Button
            className={clsx(styles.action, styles.zoomOut)}
            // caption="Zoom Out"
            data-tooltip-id="app-tooltip"
            data-tooltip-content="Zoom Out"
            onClick={() => zoomOut()}
            icon={<IconZoomOut className={styles.icon} />}
          />
          <Button
            className={clsx(styles.action, styles.zoomFit)}
            // caption="Fit"
            data-tooltip-id="app-tooltip"
            data-tooltip-content="Zoom Fit"
            onClick={handleReset}
            icon={<IconZoomFit className={styles.icon} />}
          />
          <Button
            className={clsx(styles.action, styles.fullscreen, {
              [styles.fullscreenActive]: document.fullscreenElement,
            })}
            // caption="Full Screen"
            data-tooltip-id="app-tooltip"
            data-tooltip-content={`${
              document.fullscreenElement ? 'Exit' : 'Enter'
            } Fullscreen`}
            onClick={handleFullScreen}
            icon={<FullscreenIcon className={styles.icon} />}
          />
          <Button
            className={clsx(styles.action, styles.download)}
            // caption="Download"
            data-tooltip-id="app-tooltip"
            data-tooltip-content="Download"
            onClick={handleDownload}
            icon={<IconDownload className={styles.icon} />}
          />
        </div>
      )}
      <div className={styles.body}>
        <TransformComponent
          wrapperClass={styles.canvas}
          contentClass={styles.layer}
        >
          <div className={styles.graph} ref={refContainer} />
        </TransformComponent>
      </div>
    </>
  )
}

export default GraphContent
