/** @constant DEFAULT_ANIMATION_TIME 当手从屏幕释放后默认的动画时长 ms */
declare const DEFAULT_ANIMATION_TIME = 150;
/** @constant TIME_OVER_STAMP 判定是否是快速滑动的时长（快速滑动时长阈值） ms */
declare const TIME_OVER_STAMP = 200;
/** @constant TIME_OVER_DISTANCE 快速滑动时，需要的滑动距离阈值 */
declare const TIME_OVER_DISTANCE = 20;
/** @constant NOT_TIME_OVER_DISTANCE 非快速滑动时，需要的滑动距离阈值 */
declare const NOT_TIME_OVER_DISTANCE = 30;
/** @constant TRANSFORM_RATE 跟手移动的百分比（以小数呈现），等于1时完全跟手，小于1时更易于滑动，大于1时难以滑动 */
declare const TRANSFORM_RATE = 1.05;
/** @constant TRANSFORM_START_CHECK 判断是否需要跟手移动的阈值 px */
declare const TRANSFORM_START_CHECK = 30;
export { DEFAULT_ANIMATION_TIME, TIME_OVER_STAMP, TIME_OVER_DISTANCE, NOT_TIME_OVER_DISTANCE, TRANSFORM_RATE, TRANSFORM_START_CHECK, };
