import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
import PropTypes from "prop-types";
import Helpers from "../victory-util/helpers";
import pathHelpers from "./path-helpers";
import CommonProps from "../victory-util/common-props";
import Path from "./path";

var getPath = function (props) {
  var x = props.x,
      y = props.y,
      size = props.size,
      symbol = props.symbol;

  if (props.getPath) {
    return props.getPath(x, y, size);
  }

  var pathFunctions = {
    circle: pathHelpers.circle,
    square: pathHelpers.square,
    diamond: pathHelpers.diamond,
    triangleDown: pathHelpers.triangleDown,
    triangleUp: pathHelpers.triangleUp,
    plus: pathHelpers.plus,
    minus: pathHelpers.minus,
    star: pathHelpers.star
  };
  var symbolFunction = typeof pathFunctions[symbol] === "function" ? pathFunctions[symbol] : pathFunctions.circle;
  return symbolFunction(x, y, size);
};

var evaluateProps = function (props) {
  /**
   * Potential evaluated props are:
   * `desc`
   * `id`
   * `size`
   * `style`
   * `symbol`
   * `tabIndex`
   */
  var desc = Helpers.evaluateProp(props.desc, props);
  var id = Helpers.evaluateProp(props.id, props);
  var size = Helpers.evaluateProp(props.size, props);
  var style = Helpers.evaluateStyle(props.style, props);
  var symbol = Helpers.evaluateProp(props.symbol, props);
  var tabIndex = Helpers.evaluateProp(props.tabIndex, props);
  return _assign({}, props, {
    desc: desc,
    id: id,
    size: size,
    style: style,
    symbol: symbol,
    tabIndex: tabIndex
  });
};

var Point = function (props) {
  props = evaluateProps(props);
  return React.cloneElement(props.pathComponent, _objectSpread({}, props.events, {
    d: getPath(props),
    style: props.style,
    desc: props.desc,
    tabIndex: props.tabIndex,
    role: props.role,
    shapeRendering: props.shapeRendering,
    className: props.className,
    transform: props.transform,
    clipPath: props.clipPath
  }));
};

Point.propTypes = _objectSpread({}, CommonProps.primitiveProps, {
  datum: PropTypes.object,
  getPath: PropTypes.func,
  pathComponent: PropTypes.element,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  symbol: PropTypes.oneOfType([PropTypes.oneOf(["circle", "diamond", "plus", "minus", "square", "star", "triangleDown", "triangleUp"]), PropTypes.func]),
  x: PropTypes.number,
  y: PropTypes.number
});
Point.defaultProps = {
  pathComponent: React.createElement(Path, null),
  role: "presentation",
  shapeRendering: "auto"
};
export default Point;