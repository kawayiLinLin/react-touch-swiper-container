"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  useTouchSwiperPage: true
};
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function get() {
    return _touchSwiperContainer["default"];
  }
});
Object.defineProperty(exports, "useTouchSwiperPage", {
  enumerable: true,
  get: function get() {
    return _hooks.useTouchSwiperPage;
  }
});

var _touchSwiperContainer = _interopRequireDefault(require("./touch-swiper-container"));

var _hooks = require("./hooks");

var _typings = require("./typings");

Object.keys(_typings).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _typings[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _typings[key];
    }
  });
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }