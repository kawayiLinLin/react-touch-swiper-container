"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TRANSFORM_START_CHECK = exports.TRANSFORM_RATE = exports.TIME_OVER_STAMP = exports.TIME_OVER_DISTANCE = exports.NOT_TIME_OVER_DISTANCE = exports.DEFAULT_ANIMATION_TIME = void 0;

/** @constant DEFAULT_ANIMATION_TIME 当手从屏幕释放后默认的动画时长 ms */
var DEFAULT_ANIMATION_TIME = 150;
/** @constant TIME_OVER_STAMP 判定是否是快速滑动的时长（快速滑动时长阈值） ms */

exports.DEFAULT_ANIMATION_TIME = DEFAULT_ANIMATION_TIME;
var TIME_OVER_STAMP = 200;
/** @constant TIME_OVER_DISTANCE 快速滑动时，需要的滑动距离阈值 */

exports.TIME_OVER_STAMP = TIME_OVER_STAMP;
var TIME_OVER_DISTANCE = 20;
/** @constant NOT_TIME_OVER_DISTANCE 非快速滑动时，需要的滑动距离阈值 */

exports.TIME_OVER_DISTANCE = TIME_OVER_DISTANCE;
var NOT_TIME_OVER_DISTANCE = 30;
/** @constant TRANSFORM_RATE 跟手移动的百分比（以小数呈现），等于1时完全跟手，小于1时更易于滑动，大于1时难以滑动 */

exports.NOT_TIME_OVER_DISTANCE = NOT_TIME_OVER_DISTANCE;
var TRANSFORM_RATE = 1.05;
/** @constant TRANSFORM_START_CHECK 判断是否需要跟手移动的阈值 px */

exports.TRANSFORM_RATE = TRANSFORM_RATE;
var TRANSFORM_START_CHECK = 30;
exports.TRANSFORM_START_CHECK = TRANSFORM_START_CHECK;