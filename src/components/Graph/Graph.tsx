import { FC, useEffect, useRef } from 'react'
import clsx from 'clsx'
import mermaid from 'mermaid'
import svgPanZoom from 'svg-pan-zoom'
import { GraphProps } from './types'
import Button from '@/components/Button'
import styles from './Graph.module.scss'

const DEFAULT_CONFIG = {
  theme: '',
  themeCSS: '',
  securityLevel: 'antiscript',
  flowchart: {
    curve: 'monotoneX',
  },
}

const Graph: FC<GraphProps> = ({ data, children, className, config }) => {
  const refContainer = useRef<HTMLPreElement>(null)
  const refSvg = useRef<unknown>()
  const panZoom = useRef<typeof svgPanZoom>()

  mermaid.initialize({ ...DEFAULT_CONFIG, ...config })

  useEffect(() => {
    if (!refContainer.current) {
      return
    }

    if (refSvg.current) {
      svgPanZoom(refSvg.current as HTMLElement).destroy()
    }

    mermaid.run({ nodes: [refContainer.current] }).then(() => {
      refSvg.current = refContainer.current?.querySelector('svg') || null

      panZoom.current = svgPanZoom(refSvg.current as HTMLElement, {
        zoomEnabled: true,
        center: true,
        controlIconsEnabled: false,
      })
    })
  }, [data, children, config])

  if (!data && !children) {
    return null
  }

  const handleZoomIn = () => {
    panZoom.current?.zoomIn()
  }

  const handleZoomOut = () => {
    panZoom.current?.zoomOut()
  }

  const handleZoomReset = () => {
    panZoom.current?.reset()
  }

  return (
    <div className={clsx(styles.container, className)}>
      <pre className={styles.graph} ref={refContainer}>
        {data || children}
      </pre>
      <div className={styles.tools}>
        <Button
          className={styles.zoomIn}
          caption="Zoom In"
          onClick={handleZoomIn}
        />
        <Button
          className={styles.zoomOut}
          caption="Zoom Out"
          onClick={handleZoomOut}
        />
        <Button
          className={styles.zoomReset}
          caption="Reset"
          onClick={handleZoomReset}
        />
      </div>
    </div>
  )
}

export default Graph
