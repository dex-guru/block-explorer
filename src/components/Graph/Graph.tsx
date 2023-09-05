import { FC, useEffect, useRef } from 'react'
import clsx from 'clsx'
import mermaid from 'mermaid'
import svgPanZoom from 'svg-pan-zoom'
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
  const refContainer = useRef<HTMLPreElement>(null)
  const refSvg = useRef<SVGElement>()
  const panZoom = useRef<typeof svgPanZoom>()

  mermaid.initialize({ ...DEFAULT_CONFIG, ...config })

  const handleZoomIn = () => {
    panZoom.current?.zoomIn()
  }

  const handleZoomOut = () => {
    panZoom.current?.zoomOut()
  }

  const handleZoomFit = () => {
    panZoom.current?.reset()
    panZoom.current?.resize()
    panZoom.current?.center()
    panZoom.current?.fit()
  }

  useEffect(() => {
    if (!refContainer.current || !(data || children)) {
      return
    }

    if (refSvg.current) {
      panZoom?.current?.destroy()
      refSvg.current = undefined
    }

    mermaid
      .run({ nodes: [refContainer.current], suppressErrors: true })
      .then(() => {
        const svgNode = refContainer.current?.querySelector('svg')

        if (!refContainer.current || !svgNode) {
          return
        }

        const dims = svgNode?.querySelector('g>.root')?.getBoundingClientRect()
        const ratio = dims ? dims.width / dims.height : 'auto'

        refContainer.current.style.cssText = `--graph-aspect-ratio: ${ratio}`

        panZoom.current = svgPanZoom(svgNode, {
          zoomEnabled: true,
          center: true,
          controlIconsEnabled: false,
        })

        refSvg.current = svgNode
      })
  }, [data, children, config])

  if (!data && !children) {
    return null
  }

  return (
    <div className={clsx('mermaid', styles.container, className)}>
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
          className={styles.zoomFit}
          caption="Fit"
          onClick={handleZoomFit}
        />
      </div>
    </div>
  )
}

export default Graph
