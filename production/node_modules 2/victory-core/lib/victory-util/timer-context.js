"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _timer = _interopRequireDefault(require("./timer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The React context object consumers may use to access or override the global
 * timer.
 */
var TimerContext = _react.default.createContext({
  transitionTimer: new _timer.default(),
  animationTimer: new _timer.default()
});

TimerContext.displayName = "TimerContext";
var _default = TimerContext;
exports.default = _default;