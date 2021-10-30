"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _hooks = require("./hooks");

require("./style.less");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/** @constant DEFAULT_ANIMATION_TIME 当手从屏幕释放后默认的动画时长 ms */
var DEFAULT_ANIMATION_TIME = 150;
/** @constant TIME_OVER_STAMP 判定是否是快速滑动的时长（快速滑动时长阈值） ms */

var TIME_OVER_STAMP = 200;
/** @constant TIME_OVER_DISTANCE 快速滑动时，需要的滑动距离阈值 */

var TIME_OVER_DISTANCE = 20;
/** @constant NOT_TIME_OVER_DISTANCE 非快速滑动时，需要的滑动距离阈值 */

var NOT_TIME_OVER_DISTANCE = 30;
/** @constant TRANSFORM_RATE 跟手移动的百分比（以小数呈现），等于1时完全跟手，小于1时更易于滑动，大于1时难以滑动 */

var TRANSFORM_RATE = 1.05;
/** @constant TRANSFORM_START_CHECK 判断是否需要跟手移动的阈值 px */

var TRANSFORM_START_CHECK = 30;
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

var TouchSwiperContainer = function TouchSwiperContainer(props) {
  var _a = props.animationTime,
      animationTime = _a === void 0 ? DEFAULT_ANIMATION_TIME : _a,
      _b = props.hideWhenNotReady,
      hideWhenNotReady = _b === void 0 ? true : _b;
  /** 记录参数的引用 */

  var propsRef = (0, _react.useRef)(props);
  propsRef.current = props;
  /** 初始化前是否隐藏 */

  var _c = (0, _react.useState)(hideWhenNotReady),
      isHide = _c[0],
      setIsHide = _c[1];
  /** 记录上一次有效的偏移量，当手指移开时，如果判断不需要切换页面，则用此值还原transform */


  var lastTransformRef = (0, _react.useRef)(0);
  /** 记录页面的横向偏移量 */

  var _d = (0, _react.useState)(0),
      transform = _d[0],
      setTransform = _d[1];
  /** 是否应用动画，释放时，需要应用动画 */


  var _e = (0, _react.useState)(false),
      isAnimating = _e[0],
      setIsAnimating = _e[1];
  /** 动画性能优化 */


  var _f = (0, _react.useState)(false),
      willChange = _f[0],
      setWillChange = _f[1];
  /** 当前展示的三个页面的id或key */


  var page = (0, _react.useMemo)(function () {
    return props.pages || [0, 1, 2];
  }, [props.pages]);
  /** 当前的激活页，取 page[1] */

  var _g = (0, _react.useState)(1),
      current = _g[0],
      setCurrent = _g[1];
  /** 开始移动后，手指移开前，为true时不会再由其他的规则阻碍移动 */


  var isMovingRef = (0, _react.useRef)(false);
  /** 如果正在动画中，禁用组件的移动和切换交互 */

  var isSleepingRef = (0, _react.useRef)(false);
  /** 是否禁用切换到上一页 */

  var isPreDisabledRef = (0, _react.useRef)(false);
  /** 是否禁用切换到下一页 */

  var isNextDisabledRef = (0, _react.useRef)(false);
  /** 手指是否移动到了与初始相反的方向，或有这样的趋势 */

  var isReverseDirectionRef = (0, _react.useRef)(null);
  if (page[0] === null) isPreDisabledRef.current = true;else isPreDisabledRef.current = false;
  if (page[2] === null) isNextDisabledRef.current = true;else isNextDisabledRef.current = false;
  /** 该组件根节点的引用 */

  var rootRef = (0, _react.useRef)(null);
  /** 该组件根节点的宽高记录 */

  var rootNodeRect = (0, _react.useRef)({
    width: 0,
    height: 0
  });
  /** 记录触摸的时间戳 */

  var startTimeStamp = (0, _react.useRef)(0);
  /** 记录触摸的触点位置 */

  var startPositionRef = (0, _react.useRef)({
    x: 0,
    y: 0
  });
  /** 记录touchmove滑动时的触点位置 */

  var lastPositionRef = (0, _react.useRef)({
    x: 0,
    y: 0
  });
  /**
   * 执行切换页面的操作，当页面切换完毕后，将页面重置为中间，同时page更新，达到页面切换的视觉效果
   */

  var change = (0, _hooks.usePersistFn)(function (type) {
    setCurrent(function (pre) {
      var cur = pre;
      var preIndex = page.findIndex(function (item) {
        return item === pre;
      });

      var nextIndex = function () {
        switch (type) {
          case 'next':
            return preIndex + 1;

          case 'pre':
            return preIndex - 1;

          case 'center':
            return 1;
        }
      }();

      var n = page[nextIndex];

      if (n !== undefined && n !== null) {
        cur = n;
      } else {
        nextIndex = preIndex;
      }

      var nextTransform = rootNodeRect.current.width * nextIndex * -1;
      actionAfterCurrentChangeRef.current(nextTransform, type === 'center', function () {
        var _a;

        if (type !== 'center') (_a = props.onAnimationEnd) === null || _a === void 0 ? void 0 : _a.call(props, cur);
        setWillChange(false);
      });
      return type === 'center' ? pre : cur;
    });
  });
  var next = (0, _react.useCallback)(function () {
    change('next');
  }, [change]);
  var pre = (0, _react.useCallback)(function () {
    change('pre');
  }, [change]);
  var center = (0, _react.useCallback)(function () {
    change('center');
  }, [change]);
  var actionAfterCurrentChange = (0, _react.useCallback)(function (nextTransform, isCenter, callback) {
    lastTransformRef.current = nextTransform;
    setTransform(nextTransform);
    if (!isCenter) setIsAnimating(true);

    var backToCenter = function backToCenter() {
      center();
    };

    if (!isCenter) {
      isSleepingRef.current = true;
      setTimeout(function () {
        isSleepingRef.current = false;
        setIsAnimating(false);
        backToCenter();
        callback();
      }, animationTime);
    }
  }, [animationTime, center]);
  var actionAfterCurrentChangeRef = (0, _react.useRef)(actionAfterCurrentChange);
  actionAfterCurrentChangeRef.current = actionAfterCurrentChange;
  var handleTouchEnd = (0, _react.useCallback)(function (e) {
    if (!['touchend', 'touchcancel'].includes(e.type)) return;
    if (isSleepingRef.current) return;
    isMovingRef.current = false;
    var lastX = lastPositionRef.current.x;
    var startX = startPositionRef.current.x;
    var compare = lastX - startX;
    var absCompare = Math.abs(compare);
    var now = Date.now(); // 快速滑动

    var isTimeOver = now - startTimeStamp.current < TIME_OVER_STAMP; // 距离是否达到阈值

    var isDistanceOver = absCompare > (isTimeOver ? TIME_OVER_DISTANCE : NOT_TIME_OVER_DISTANCE);

    var back = function back() {
      lastPositionRef.current = {
        x: 0,
        y: 0
      };
      startPositionRef.current = {
        x: 0,
        y: 0
      };
      setIsAnimating(true);
      actionAfterCurrentChangeRef.current(lastTransformRef.current, true, function () {
        return setWillChange(false);
      });
    };

    if (isReverseDirectionRef.current) {
      return back();
    }

    if (compare > 0 && isDistanceOver) {
      // 从左向右划
      pre();
    } else if (compare < 0 && isDistanceOver) {
      // 从右向左划
      next();
    } else {
      // 不触发
      back();
    }
  }, [next, pre]);
  var handleTouchStart = (0, _react.useCallback)(function (e) {
    if (e.type !== 'touchstart') return;
    if (isSleepingRef.current) return;
    isMovingRef.current = true;
    isReverseDirectionRef.current = null;
    var touches = e.touches;
    /* 不支持多点触控 */

    if (touches.length > 1) {
      return handleTouchEnd(e);
    }

    startTimeStamp.current = Date.now();
    var _a = touches[0],
        x = _a.pageX,
        y = _a.pageY;
    startPositionRef.current = {
      x: x,
      y: y
    };
    lastPositionRef.current = {
      x: x,
      y: y
    };
    setWillChange(true);
  }, [handleTouchEnd]);
  var handleTouchMove = (0, _react.useCallback)(function (e) {
    if (e.type !== 'touchmove') return;
    if (isSleepingRef.current) return;
    if (!isMovingRef.current) return;
    var touches = e.touches;
    /* 不支持多点触控 */

    if (touches.length > 1) {
      return handleTouchEnd(e);
    }

    var _a = touches[0],
        x = _a.pageX,
        y = _a.pageY;
    var startX = startPositionRef.current.x;
    var lastX = lastPositionRef.current.x;
    var compare = startX - x;
    var willPre = compare < 0;
    var willNext = compare > 0; // 从右向左，上一个 或 从左向右下一个，禁用时，不做transform 操作

    if (willPre && isPreDisabledRef.current || willNext && isNextDisabledRef.current) return;
    /** 判定移动方向是否与本次移动开始（触摸开始）时相反，或有相反的趋势 */

    var compareLastPosAndCurPosi = lastX - x;

    if (willPre && (compareLastPosAndCurPosi > 0 || isReverseDirectionRef.current === 'pre-reverse' && compareLastPosAndCurPosi === 0)) {
      isReverseDirectionRef.current = 'pre-reverse';
    } else if (willNext && (compareLastPosAndCurPosi < 0 || isReverseDirectionRef.current === 'next-reverse' && compareLastPosAndCurPosi === 0)) {
      isReverseDirectionRef.current = 'next-reverse';
    } else {
      isReverseDirectionRef.current = null;
    } // 第一次移动距离变化绝对值大于阈值时，才做移动操作


    var absCompare = Math.abs(compare);
    if (absCompare < TRANSFORM_START_CHECK && !isMovingRef.current) return;
    isMovingRef.current = true; // 开始移动

    setTransform(lastTransformRef.current + compare * -1 / TRANSFORM_RATE); // 记录本次位置

    lastPositionRef.current = {
      x: x,
      y: y
    };
  }, [handleTouchEnd]);
  (0, _react.useLayoutEffect)(function () {
    var current = rootRef.current;

    if (current) {
      var _a = getComputedStyle(current),
          width = _a.width,
          height = _a.height;

      rootNodeRect.current = {
        width: parseInt(width),
        height: parseInt(height)
      };
      var nextTransform = rootNodeRect.current.width * 1 * -1;
      lastTransformRef.current = nextTransform;
      setTransform(nextTransform);
      setIsHide(false);
      setImmediate(function () {
        var _a, _b;

        (_b = (_a = propsRef.current).onReady) === null || _b === void 0 ? void 0 : _b.call(_a);
      });
    }
  }, []);
  (0, _react.useEffect)(function () {
    var _a, _b;

    (_b = (_a = propsRef.current).onChange) === null || _b === void 0 ? void 0 : _b.call(_a, current);
  }, [current]);
  return _react["default"].createElement("div", {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
    onTouchCancel: handleTouchEnd,
    className: "touch-swiper",
    style: {
      visibility: isHide ? 'hidden' : undefined
    },
    ref: rootRef
  }, _react["default"].createElement("div", {
    className: "touch-swiper-container",
    style: {
      willChange: willChange ? 'transform' : undefined,
      transform: "translateX(" + transform + "px)",
      transition: isAnimating ? "transform " + animationTime + "ms" : undefined
    }
  }, page.map(function (item, idx) {
    var _a;

    return _react["default"].createElement("div", {
      key: item === null ? idx : item,
      className: "touch-swiper-page"
    }, (_a = props.children) === null || _a === void 0 ? void 0 : _a.call(props, item, idx));
  })));
};

var _default = TouchSwiperContainer;
exports["default"] = _default;