import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { TouchEvent } from 'react'
import { usePersistFn } from './hooks'
import './style.less'

/** @constant DEFAULT_ANIMATION_TIME 当手从屏幕释放后默认的动画时长 ms */
const DEFAULT_ANIMATION_TIME = 150

/** @constant TIME_OVER_STAMP 判定是否是快速滑动的时长（快速滑动时长阈值） ms */
const TIME_OVER_STAMP = 200

/** @constant TIME_OVER_DISTANCE 快速滑动时，需要的滑动距离阈值 */
const TIME_OVER_DISTANCE = 20

/** @constant NOT_TIME_OVER_DISTANCE 非快速滑动时，需要的滑动距离阈值 */
const NOT_TIME_OVER_DISTANCE = 30

/** @constant TRANSFORM_RATE 跟手移动的百分比（以小数呈现），等于1时完全跟手，小于1时更易于滑动，大于1时难以滑动 */
const TRANSFORM_RATE = 1.05

/** @constant TRANSFORM_START_CHECK 判断是否需要跟手移动的阈值 px */
const TRANSFORM_START_CHECK = 30

export interface Props {
  hideWhenNotReady?: boolean
  animationTime?: number
  pages?: (null | number)[]
  children?: (item: number | null, index: number) => React.ReactNode
  onAnimationEnd?(next: number): void
  onReady?(): void
  onChange?(next: number | null): void
}

/**
 * @example
 * import TouchSwiperContainer from '@/components/base/touch-swiper-container'
 * const pageList = [
 *  { id: 1, name: '第一页' },
 *  { id: 2, name: '第二页' },
 *  { id: 3, name: '第三页' }
 * ]
 * const Page = props => {
 *  const [current, setCurrent] = useState(1)
 *  const pages = useMemo(() => {
 *   const currentIndex = pageList.findIndex(p => p.id === current)
 *   return [
 *    pageList[currentIndex - 1],
 *    pageList[currentIndex],
 *    pageList[currentIndex + 1]
 *   ].map(item => !item ? null : item)
 *  }, [current])
 *
 *  const handleChange = (next) => setCurrent(next)
 *  return <TouchSwiperContainer onAnimationEnd={handleChange} pages={pages}>
 *   {(item) => <View>{pageList.find(p => p.id === item)?.name}</View>}
 *  </TouchSwiperContainer>
 * }
 */
const TouchSwiperContainer: React.FC<Props> = (props) => {
  const { 
      animationTime = DEFAULT_ANIMATION_TIME,
      hideWhenNotReady = true,
  } = props
  /** 记录参数的引用 */
  const propsRef = useRef(props)
  propsRef.current = props

  /** 初始化前是否隐藏 */
  const [isHide, setIsHide] = useState(hideWhenNotReady)


  /** 记录上一次有效的偏移量，当手指移开时，如果判断不需要切换页面，则用此值还原transform */
  const lastTransformRef = useRef(0)
  /** 记录页面的横向偏移量 */
  const [transform, setTransform] = useState(0)
  /** 是否应用动画，释放时，需要应用动画 */
  const [isAnimating, setIsAnimating] = useState(false)
  /** 动画性能优化 */
  const [willChange, setWillChange] = useState(false)


  /** 当前展示的三个页面的id或key */
  const page = useMemo(() => props.pages || [0, 1, 2], [props.pages])
  /** 当前的激活页，取 page[1] */
  const [current, setCurrent] = useState(1)


  /** 开始移动后，手指移开前，为true时不会再由其他的规则阻碍移动 */
  const isMovingRef = useRef<boolean>(false)
  /** 如果正在动画中，禁用组件的移动和切换交互 */
  const isSleepingRef = useRef<boolean>(false)


  /** 是否禁用切换到上一页 */
  const isPreDisabledRef = useRef<boolean>(false)
  /** 是否禁用切换到下一页 */
  const isNextDisabledRef = useRef<boolean>(false)
  /** 手指是否移动到了与初始相反的方向，或有这样的趋势 */
  const isReverseDirectionRef = useRef<'pre-reverse' | 'next-reverse' | null>(null)


  if (page[0] === null) isPreDisabledRef.current = true
  else isPreDisabledRef.current = false
  if (page[2] === null) isNextDisabledRef.current = true
  else isNextDisabledRef.current = false


  /** 该组件根节点的引用 */
  const rootRef = useRef<HTMLDivElement>(null)
  /** 该组件根节点的宽高记录 */
  const rootNodeRect = useRef<{
    width: number
    height: number
  }>({
    width: 0,
    height: 0
  })

  /** 记录触摸的时间戳 */
  const startTimeStamp = useRef<number>(0)
  /** 记录触摸的触点位置 */
  const startPositionRef = useRef<{
    x: number
    y: number
  }>({
    x: 0,
    y: 0
  })
  /** 记录touchmove滑动时的触点位置 */
  const lastPositionRef = useRef<{
    x: number
    y: number
  }>({
    x: 0,
    y: 0
  })

  /**
   * 执行切换页面的操作，当页面切换完毕后，将页面重置为中间，同时page更新，达到页面切换的视觉效果
   */
  const change = usePersistFn((type: 'next' | 'pre' | 'center') => {
    setCurrent((pre) => {
      let cur = pre
      const preIndex = page.findIndex((item) => item === pre)
      let nextIndex = (() => {
        switch (type) {
          case 'next':
            return preIndex + 1
          case 'pre':
            return preIndex - 1
          case 'center':
            return 1
        }
      })()
      const n = page[nextIndex]

      if (n !== undefined && n !== null) {
        cur = n
      } else {
        nextIndex = preIndex
      }

      const nextTransform = rootNodeRect.current.width * nextIndex * -1
      actionAfterCurrentChangeRef.current(
        nextTransform,
        type === 'center',
        () => {
          if (type !== 'center') props.onAnimationEnd?.(cur)
          setWillChange(false)
        }
      )
      return type === 'center' ? pre : cur
    })
  })

  const next = useCallback(() => {
    change('next')
  }, [change])

  const pre = useCallback(() => {
    change('pre')
  }, [change])

  const center = useCallback(() => {
    change('center')
  }, [change])

  const actionAfterCurrentChange = useCallback(
    (nextTransform: number, isCenter: boolean, callback: () => void) => {
      lastTransformRef.current = nextTransform
      setTransform(nextTransform)

      if (!isCenter) setIsAnimating(true)
      const backToCenter = () => {
        center()
      }
      if (!isCenter) {
        isSleepingRef.current = true
        setTimeout(() => {
          isSleepingRef.current = false
          setIsAnimating(false)
          backToCenter()
          callback()
        }, animationTime)
      }
    },
    [animationTime, center]
  )

  const actionAfterCurrentChangeRef = useRef<
    (nextTransform: number, isCenter: boolean, callback: () => void) => void
  >(actionAfterCurrentChange)
  actionAfterCurrentChangeRef.current = actionAfterCurrentChange

  const handleTouchEnd = useCallback(
    (e:  TouchEvent<HTMLDivElement>) => {
      if (!['touchend', 'touchcancel'].includes(e.type)) return
      if (isSleepingRef.current) return
      isMovingRef.current = false

      const { x: lastX } = lastPositionRef.current
      const { x: startX } = startPositionRef.current
      const compare = lastX - startX

      const absCompare = Math.abs(compare)
      const now = Date.now()
      // 快速滑动
      const isTimeOver = now - startTimeStamp.current < TIME_OVER_STAMP
      // 距离是否达到阈值
      const isDistanceOver =
        absCompare > (isTimeOver ? TIME_OVER_DISTANCE : NOT_TIME_OVER_DISTANCE)

      const back = () => {
        lastPositionRef.current = { x: 0, y: 0 }
        startPositionRef.current = { x: 0, y: 0 }
        setIsAnimating(true)
        actionAfterCurrentChangeRef.current(
          lastTransformRef.current,
          true,
          () => setWillChange(false)
        )
      }

      if (isReverseDirectionRef.current) {
        return back()
      }

      if (compare > 0 && isDistanceOver) {
        // 从左向右划
        pre()
      } else if (compare < 0 && isDistanceOver) {
        // 从右向左划
        next()
      } else {
        // 不触发
        back()
      }
    },
    [next, pre]
  )

  const handleTouchStart = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (e.type !== 'touchstart') return
      if (isSleepingRef.current) return
      isMovingRef.current = true
      isReverseDirectionRef.current = null

      const touches = e.touches

      /* 不支持多点触控 */
      if (touches.length > 1) {
        return handleTouchEnd(e)
      }
      startTimeStamp.current = Date.now()

      const { pageX: x, pageY: y } = touches[0]
      startPositionRef.current = { x, y }
      lastPositionRef.current = { x, y }

      setWillChange(true)
    },
    [handleTouchEnd]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent<HTMLDivElement>) => {
      if (e.type !== 'touchmove') return
      if (isSleepingRef.current) return
      if (!isMovingRef.current) return

      const touches = e.touches

      /* 不支持多点触控 */
      if (touches.length > 1) {
        return handleTouchEnd(e)
      }

      const { pageX: x, pageY: y } = touches[0]
      const { x: startX } = startPositionRef.current
      const { x: lastX } = lastPositionRef.current

      const compare = startX - x
      const willPre = compare < 0
      const willNext = compare > 0
      // 从右向左，上一个 或 从左向右下一个，禁用时，不做transform 操作
      if (
        (willPre && isPreDisabledRef.current) ||
        (willNext && isNextDisabledRef.current)
      )
        return

      /** 判定移动方向是否与本次移动开始（触摸开始）时相反，或有相反的趋势 */
      const compareLastPosAndCurPosi = lastX - x
      if (
        willPre &&
        (compareLastPosAndCurPosi > 0 ||
          (isReverseDirectionRef.current === 'pre-reverse' &&
            compareLastPosAndCurPosi === 0))
      ) {
        isReverseDirectionRef.current = 'pre-reverse'
      } else if (
        willNext &&
        (compareLastPosAndCurPosi < 0 ||
          (isReverseDirectionRef.current === 'next-reverse' &&
            compareLastPosAndCurPosi === 0))
      ) {
        isReverseDirectionRef.current = 'next-reverse'
      } else {
        isReverseDirectionRef.current = null
      }

      // 第一次移动距离变化绝对值大于阈值时，才做移动操作
      const absCompare = Math.abs(compare)
      if (absCompare < TRANSFORM_START_CHECK && !isMovingRef.current) return

      isMovingRef.current = true

      // 开始移动
      setTransform(lastTransformRef.current + (compare * -1) / TRANSFORM_RATE)
      // 记录本次位置
      lastPositionRef.current = { x, y }
    },
    [handleTouchEnd]
  )

  useLayoutEffect(() => {
    const { current } = rootRef

      if (current) {
        const { width, height } = getComputedStyle(current)
        rootNodeRect.current = {
            width: parseInt(width),
            height: parseInt(height)
        }

        const nextTransform = rootNodeRect.current.width * 1 * -1
        lastTransformRef.current = nextTransform
        setTransform(nextTransform)
        setIsHide(false)
        setImmediate(() => {
            propsRef.current.onReady?.()
        })
    }

  }, [])

  useEffect(() => {
    propsRef.current.onChange?.(current!)
  }, [current])

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className="touch-swiper"
      style={{ visibility: isHide ? 'hidden' : undefined }}
      ref={rootRef}
    >
      <div
        className="touch-swiper-container"
        style={{
          willChange: willChange ? 'transform' : undefined,
          transform: `translateX(${transform}px)`,
          transition: isAnimating ? `transform ${animationTime}ms` : undefined
        }}
      >
        {page.map((item, idx) => {
          return (
            <div key={item === null ? idx : item} className="touch-swiper-page">
              {props.children?.(item, idx)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TouchSwiperContainer
