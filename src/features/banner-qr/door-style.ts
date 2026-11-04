import { type CSSProperties } from 'react'

/**
 * The door's place in the load cascade, read by `animate-door-rise`.
 */
export function doorStyle(index: number): CSSProperties {
  return { '--door-index': index } as CSSProperties
}
