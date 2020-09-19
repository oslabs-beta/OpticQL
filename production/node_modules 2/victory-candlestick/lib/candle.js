"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _victoryCore = require("victory-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getCandleWidth = function (candleWidth, props) {
  var style = props.style;

  if (candleWidth) {
    return (0, _isFunction2.default)(candleWidth) ? _victoryCore.Helpers.evaluateProp(candleWidth, props) : candleWidth;
  } else if (style.width) {
    return style.width;
  }

  return candleWidth;
};

var getCandleProps = function (props, style) {
  var id = props.id,
      x = props.x,
      close = props.close,
      open = props.open,
      horizontal = props.horizontal,
      candleWidth = props.candleWidth;
  var candleLength = Math.abs(close - open);
  return {
    key: "".concat(id, "-candle"),
    style: _victoryCore.Helpers.omit(style, ["width"]),
    x: horizontal ? Math.min(open, close) : x - candleWidth / 2,
    y: horizontal ? x - candleWidth / 2 : Math.min(open, close),
    width: horizontal ? candleLength : candleWidth,
    height: horizontal ? candleWidth : candleLength
  };
};

var getHighWickProps = function (props, style) {
  var horizontal = props.horizontal,
      high = props.high,
      open = props.open,
      close = props.close,
      x = props.x,
      id = props.id;
  return {
    key: "".concat(id, "-highWick"),
    style: _victoryCore.Helpers.omit(style, ["width"]),
    x1: horizontal ? high : x,
    x2: horizontal ? Math.max(open, close) : x,
    y1: horizontal ? x : high,
    y2: horizontal ? x : Math.min(open, close)
  };
};

var getLowWickProps = function (props, style) {
  var horizontal = props.horizontal,
      low = props.low,
      open = props.open,
      close = props.close,
      x = props.x,
      id = props.id;
  return {
    key: "".concat(id, "-lowWick"),
    style: _victoryCore.Helpers.omit(style, ["width"]),
    x1: horizontal ? Math.min(open, close) : x,
    x2: horizontal ? low : x,
    y1: horizontal ? x : Math.max(open, close),
    y2: horizontal ? x : low
  };
};

var evaluateProps = function (props) {
  /**
   * Potential evaluated props of following must be evaluated in this order:
   * 1) `style`
   * 2) `cornerRadius`
   *
   * Everything else does not have to be evaluated in a particular order:
   * `desc`
   * `id`
   * `tabIndex`
   */
  var style = _victoryCore.Helpers.evaluateStyle((0, _assign2.default)({
    stroke: "black"
  }, props.style), props);

  var candleWidth = getCandleWidth(props.candleWidth, (0, _assign2.default)({}, props, {
    style: style
  }));

  var desc = _victoryCore.Helpers.evaluateProp(props.desc, props);

  var id = _victoryCore.Helpers.evaluateProp(props.id, props);

  var tabIndex = _victoryCore.Helpers.evaluateProp(props.tabIndex, props);

  return (0, _assign2.default)({}, props, {
    style: style,
    candleWidth: candleWidth,
    desc: desc,
    id: id,
    tabIndex: tabIndex
  });
};

var Candle = function (props) {
  props = evaluateProps(props);
  var _props = props,
      events = _props.events,
      groupComponent = _props.groupComponent,
      clipPath = _props.clipPath,
      rectComponent = _props.rectComponent,
      lineComponent = _props.lineComponent,
      role = _props.role,
      shapeRendering = _props.shapeRendering,
      className = _props.className,
      wickStrokeWidth = _props.wickStrokeWidth,
      transform = _props.transform,
      style = _props.style,
      desc = _props.desc,
      tabIndex = _props.tabIndex;
  var wickStyle = (0, _defaults2.default)({
    strokeWidth: wickStrokeWidth
  }, style);

  var sharedProps = _objectSpread({}, events, {
    role: role,
    shapeRendering: shapeRendering,
    className: className,
    transform: transform,
    clipPath: clipPath,
    desc: desc,
    tabIndex: tabIndex
  });

  var candleProps = (0, _assign2.default)(getCandleProps(props, style), sharedProps);
  var highWickProps = (0, _assign2.default)(getHighWickProps(props, wickStyle), sharedProps);
  var lowWickProps = (0, _assign2.default)(getLowWickProps(props, wickStyle), sharedProps);
  return _react.default.cloneElement(groupComponent, {}, [_react.default.cloneElement(rectComponent, candleProps), _react.default.cloneElement(lineComponent, highWickProps), _react.default.cloneElement(lineComponent, lowWickProps)]);
};

Candle.propTypes = _objectSpread({}, _victoryCore.CommonProps.primitiveProps, {
  candleRatio: _propTypes.default.number,
  candleWidth: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
  close: _propTypes.default.number,
  datum: _propTypes.default.object,
  groupComponent: _propTypes.default.element,
  high: _propTypes.default.number,
  lineComponent: _propTypes.default.element,
  low: _propTypes.default.number,
  open: _propTypes.default.number,
  rectComponent: _propTypes.default.element,
  wickStrokeWidth: _propTypes.default.number,
  width: _propTypes.default.number,
  x: _propTypes.default.number
});
Candle.defaultProps = {
  groupComponent: _react.default.createElement("g", null),
  lineComponent: _react.default.createElement(_victoryCore.Line, null),
  rectComponent: _react.default.createElement(_victoryCore.Rect, null),
  role: "presentation",
  shapeRendering: "auto"
};
var _default = Candle;
exports.default = _default;