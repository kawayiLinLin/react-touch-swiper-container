# React-Touch-Swiper-Container

一个用于react的滑动切换库

## 示例 Example

+ 安装

```shell
npm install react-touch-swiper-container -S
```

+ 使用

```tsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

import TouchSwiperContainer, { useTouchSwiperPage } from "react-touch-swiper-container";

const createPage = () => {
  const start = -100000;
  const end = start * -1;

  const result = [];
  for (let i = start; i < end; i++) {
    result.push({
      id: i,
      name: i,
    });
  }
  return result;
};

const TouchSwiperContainerDemo: React.FC = () => {
  const [myPage] = useState(createPage);
  const { pages, handleAnimationEndChange, getPage } = useTouchSwiperPage(
    myPage,
    "id"
  );

  const [isShowBackground, setIsShow] = useState(false)

  return (
    <div className={isShowBackground ? 'show-background' : undefined} style={{ width: "100%", height: "100%" }}>
      <button onClick={() => setIsShow(!isShowBackground)}>切换展示背景颜色</button>
      <TouchSwiperContainer
        onAnimationEnd={handleAnimationEndChange}
        pages={pages}
      >
        {(id) => {
          return (
            <div
              style={{
                fontSize: 50,
                fontWeight: 700,
                textAlign: "center",
                lineHeight: "170px",
              }}
            >
              {getPage(id)?.name}
            </div>
          );
        }}
      </TouchSwiperContainer>
    </div>
  );
};

ReactDOM.render(
  <TouchSwiperContainerDemo />,
  document.getElementById("app")
);

```

## 参数 Props

| 参数名 prop name | 类型 type                                 | 默认值 default | 说明 description                                             |
| ---------------- | ----------------------------------------- | -------------- | ------------------------------------------------------------ |
| hideWhenNotReady | boolean                                   | true           | 组件在自动计算容器宽度后，才可使用，在这之前，你可以设置它为隐藏 |
| animationTime    | number                                    | 100            | 当手指释放后，组件由当前页面过渡到下（上）一个页面所需要的时间 |
| pages            | number[]                                  | [0, 1, 2]      | 组件需要你提供一个长度的3的数组，用于渲染页面，组件一次最多只会在视图中渲染3个页面，即使你有很多个页面 |
| onAnimationEnd   | (next: number) => void                    |                | 切换页面的动画结束后触发，你应该在这个回调中设置下一个需要展示的页面 |
| onReady          | () => void                                |                | 组件计算完容器宽高后，在下一个宏任务中触发                   |
| onChange         | (next: number) => void                    |                | 手指释放后，检测到将要切换到上一页或下一页就会立即触发       |
| children         | (item: number \| null) => React.ReactNode |                | 需要给组件提供一个函数，并返回需要渲染在视图中的内容         |

## 工具 tools

+ **useTouchSwiperPage**

  组件仅接受三个页面的id，但你可能有很多页面，因此，你可以