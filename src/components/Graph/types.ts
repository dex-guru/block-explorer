import { CSSProperties } from 'react'

export type GraphProps = {
  data?: string
  children?: string
  className?: string
  config?: Record<string, unknown | Record<string, unknown>>
  svgManipulationCallback?: (svg: string) => string
  style?: CSSProperties
}
