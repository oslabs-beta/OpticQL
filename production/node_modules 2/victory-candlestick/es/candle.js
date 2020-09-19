import _isFunction from "lodash/isFunction";
import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*eslint no-magic-numbers: ["error", { "ignore": [0, 0.5, 1, 2] }]*/
import React from "react";
import PropTypes from "prop-types";
import { Helpers, CommonProps, Line, Rect } from "victory-core";

var getCandleWidth = function (candleWidth, props) {
  var style = props.style;

  if (candleWidth) {
    return _isFunction(candleWidth) ? Helpers.evaluateProp(candleWidth, props) : candleWidth;
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
    style: Helpers.omit(style, ["width"]),
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
    style: Helpers.omit(style, ["width"]),
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
    style: Helpers.omit(style, ["width"]),
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
  var style = Helpers.evaluateStyle(_assign({
    stroke: "black"
  }, props.style), props);
  var candleWidth = getCandleWidth(props.candleWidth, _assign({}, props, {
    style: style
  }));
  var desc = Helpers.evaluateProp(props.desc, props);
  var id = Helpers.evaluateProp(props.id, props);
  var tabIndex = Helpers.evaluateProp(props.tabIndex, props);
  return _assign({}, props, {
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

  var wickStyle = _defaults({
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

  var candleProps = _assign(getCandleProps(props, style), sharedProps);

  var highWickProps = _assign(getHighWickProps(props, wickStyle), sharedProps);

  var lowWickProps = _assign(getLowWickProps(props, wickStyle), sharedProps);

  return React.cloneElement(groupComponent, {}, [React.cloneElement(rectComponent, candleProps), React.cloneElement(lineComponent, highWickProps), React.cloneElement(lineComponent, lowWickProps)]);
};

Candle.propTypes = _objectSpread({}, CommonProps.primitiveProps, {
  candleRatio: PropTypes.number,
  candleWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  close: PropTypes.number,
  datum: PropTypes.object,
  groupComponent: PropTypes.element,
  high: PropTypes.number,
  lineComponent: PropTypes.element,
  low: PropTypes.number,
  open: PropTypes.number,
  rectComponent: PropTypes.element,
  wickStrokeWidth: PropTypes.number,
  width: PropTypes.number,
  x: PropTypes.number
});
Candle.defaultProps = {
  groupComponent: React.createElement("g", null),
  lineComponent: React.createElement(Line, null),
  rectComponent: React.createElement(Rect, null),
  role: "presentation",
  shapeRendering: "auto"
};
export default Candle;