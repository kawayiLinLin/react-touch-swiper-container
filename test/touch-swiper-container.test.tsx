/**
 * @jest-environment jsdom
 */

import React from 'react'
import { unmountComponentAtNode } from 'react-dom'
import TouchSwiperContainer from '../src/touch-swiper-container'
import { render, act } from '@testing-library/react'

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
    let result: any
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
    const { baseElement } = result
    console.log(result)
    expect(baseElement).toMatchSnapshot()
})