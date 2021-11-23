"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
exports.usePersistFn = usePersistFn;
exports.useTouchSwiperPage = useTouchSwiperPage;

var _react = require("react");

function usePersistFn(fn) {
  var fnRef = (0, _react.useRef)(fn);
  (0, _react.useEffect)(function () {
    fnRef.current = fn;
  }, [fn]);
  var persistFn = (0, _react.useRef)();

  if (!persistFn.current) {
    persistFn.current = function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      return fnRef.current.apply(this, args);
    };
  }

  return persistFn.current;
}

function useTouchSwiperPage(pages, key) {
  key = key !== null && key !== void 0 ? key : "id";

  var _a = (0, _react.useState)(0),
      current = _a[0],
      setCurrent = _a[1];

  var pageCache = (0, _react.useState)(function () {
    return new Map();
  })[0];
  var pageCacheRef = (0, _react.useRef)(pageCache);
  var handleChange = usePersistFn(function (next) {
    setCurrent(next);
  });
  var hooksResult = (0, _react.useMemo)(function () {
    var currentIndex = pages.findIndex(function (p) {
      return p[key] === current;
    });
    var renderedPage = [pages[currentIndex - 1], pages[currentIndex], pages[currentIndex + 1]].map(function (item) {
      if (item) pageCacheRef.current.set(item[key], item);
      return !item ? null : item[key];
    });

    var getPage = function getPage(id) {
      return pageCacheRef.current.get(id);
    };

    return {
      current: current,
      pages: renderedPage,
      getPage: getPage,
      handleAnimationEndChange: handleChange
    };
  }, [handleChange, pages, key, current]);
  return hooksResult;
}

var _default = {
  usePersistFn: usePersistFn,
  useTouchSwiperPage: useTouchSwiperPage
};
exports["default"] = _default;