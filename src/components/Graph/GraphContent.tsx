import { FC, ReactNode, useEffect, useRef } from 'react'
import clsx from 'clsx'
import mermaid from 'mermaid'
import styles from './Graph.module.scss'

const GraphContent: FC<{
  config: Record<string, unknown | Record<string, unknown>>
  children: ReactNode
  onReady?: () => void
}> = ({ config, children, onReady }) => {
  const refContainer = useRef<HTMLDivElement>(null)

  mermaid.initialize(config)

  useEffect(() => {
    if (!refContainer.current) {
      return
    }

    mermaid
      .run({ nodes: [refContainer.current], suppressErrors: true })
      .then(() =>
        setTimeout(() => {
          onReady?.()
        })
      )
  }, [children, config, onReady])

  if (!children) {
    return null
  }

  return (
    <div className={clsx('mermaid', styles.graph)} ref={refContainer}>
      {children}
    </div>
  )
}

export default GraphContent
