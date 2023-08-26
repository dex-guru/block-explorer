import { useState, useCallback, useLayoutEffect } from 'react'

export interface DimensionObject {
  width?: number
  height?: number
  top?: number
  left?: number
  x?: number
  y?: number
  right?: number
  bottom?: number
}

export type UseDimensionsHook = {
  ref: (node: HTMLElement | null) => void
  dimensions: DimensionObject
  node: HTMLElement | null
}

export interface UseDimensionsArgs {
  target?: HTMLElement | null
  liveMeasure?: boolean
}

function getDimensionObject(node?: HTMLElement | null): DimensionObject {
  const rect = node?.getBoundingClientRect()

  return {
    x: rect?.x,
    y: rect?.y,
    top: rect?.top || rect?.x,
    left: rect?.left || rect?.y,
    width: rect?.width,
    height: rect?.height,
    right: rect?.right,
    bottom: rect?.bottom,
  }
}

function useDimensions({
  target,
  liveMeasure = true,
}: UseDimensionsArgs = {}): UseDimensionsHook {
  const [dimensions, setDimensions] = useState<DimensionObject>(
    getDimensionObject(target)
  )
  const [node, setNode] = useState(target || null)

  const ref = useCallback((node: HTMLElement | null) => {
    setNode(node)
  }, [])

  useLayoutEffect(() => {
    if (node) {
      const measure = () =>
        window.requestAnimationFrame(() =>
          setDimensions(getDimensionObject(node))
        )
      measure()

      if (liveMeasure) {
        window.addEventListener('resize', measure)
        window.addEventListener('scroll', measure)

        return () => {
          window.removeEventListener('resize', measure)
          window.removeEventListener('scroll', measure)
        }
      }
    }
  }, [node, liveMeasure])

  return { dimensions, node, ref }
}

export default useDimensions
