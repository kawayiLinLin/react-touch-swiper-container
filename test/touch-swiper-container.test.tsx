/**
 * @jest-environment jsdom
 */

import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import TouchSwiperContainer from '../src/touch-swiper-container'
import { render, act, fireEvent } from '@testing-library/react'
import type { RenderResult } from '@testing-library/react'

let container: any = null

beforeEach(() => {
    // 创建一个 DOM 元素作为渲染目标
    container = document.createElement('div')
    container.style.height = '667px'
    document.body.appendChild(container)
})

afterEach(() => {
    // 退出时进行清理
    unmountComponentAtNode(container)
    container.remove()
    container = null
})

test('能正常渲染', () => {
    let result: RenderResult
    act(() => {
        result = render(
            <TouchSwiperContainer
                animationTime={1000}
                pages={[0, 1, 2]}
                onAnimationEnd={() => void 0}
            />,
            { container },
        )
    })
    const { baseElement } = result!
    expect(baseElement).toMatchSnapshot()
})

test('能正常触发onReady', () => {
    jest.useFakeTimers()
    const mockOnReadyCallback = jest.fn(() => void 0)

    act(() => {
        render(
            <TouchSwiperContainer
                animationTime={1000}
                pages={[0, 1, 2]}
                onAnimationEnd={() => void 0}
                onReady={mockOnReadyCallback}
            />,
            { container },
        )
    })
    jest.advanceTimersByTime(10)

    expect(mockOnReadyCallback.mock.calls.length).toBe(1)
})

test('能正常响应touch事件', () => {
    let result: RenderResult
    jest.useFakeTimers()
    const mockOnChangeCallback = jest.fn(() => void 0)
    act(() => {
        result = render(
            <TouchSwiperContainer
                animationTime={1000}
                pages={[0, 1, 2]}
                onAnimationEnd={() => void 0}
                onChange={mockOnChangeCallback}
            />,
            { container },
        )
    })
    jest.advanceTimersByTime(10)
    if (result!) {
        const { baseElement } = result
        fireEvent.touchStart(baseElement)
        fireEvent.touchMove(baseElement)
        fireEvent.touchEnd(baseElement)

        expect(mockOnChangeCallback.mock.calls.length).toBe(1)
    } else {
        throw new Error('不能正常渲染')
    }
})