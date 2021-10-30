// 示例代码


import React, { useState } from "react";
import ReactDOM from "react-dom";

import TouchSwiperContainer, { useTouchSwiperPage } from "../src";

import "./common.less";

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
          let text: number | string | undefined = getPage(id)?.name
          text === 0 && (text = '在移动端左右滑动此文字进行切换')
          return (
            <div
              style={{
                fontSize: 50,
                fontWeight: 700,
                textAlign: "center",
                lineHeight: "170px",
              }}
            >
              {text}
            </div>
          );
        }}
      </TouchSwiperContainer>
    </div>
  );
};

ReactDOM.render(
  <TouchSwiperContainerDemo />,
  document.getElementById("__react-content")
);
