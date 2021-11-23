import type React from 'react'
export interface TouchSwpierContainerProps {
  hideWhenNotReady?: boolean
  animationTime?: number
  pages?: (null | number)[]
  children?: (item: number | null, index: number) => React.ReactNode
  onAnimationEnd?(next: number): void
  onReady?(): void
  onChange?(next: number | null): void
}
