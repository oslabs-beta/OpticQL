import _isNil from "lodash/isNil";
import _isPlainObject from "lodash/isPlainObject";
import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
import PropTypes from "prop-types";
import { Helpers, CommonProps, Path } from "victory-core";
import { getVerticalBarPath, getHorizontalBarPath, getVerticalPolarBarPath, getCustomBarPath } from "./path-helper-methods";

var getBarPath = function (props, width, cornerRadius) {
  if (props.getPath) {
    return getCustomBarPath(props, width);
  }

  return props.horizontal ? getHorizontalBarPath(props, width, cornerRadius) : getVerticalBarPath(props, width, cornerRadius);
};

var getPolarBarPath = function (props, cornerRadius) {
  // TODO Radial bars
  return getVerticalPolarBarPath(props, cornerRadius);
};

var getBarWidth = function (barWidth, props) {
  var scale = props.scale,
      data = props.data,
      defaultBarWidth = props.defaultBarWidth,
      style = props.style;

  if (barWidth) {
    return Helpers.evaluateProp(barWidth, props);
  } else if (style.width) {
    return style.width;
  }

  var range = scale.x.range();
  var extent = Math.abs(range[1] - range[0]);
  var bars = data.length + 2;
  var barRatio = props.barRatio || 0.5;
  var defaultWidth = barRatio * (data.length < 2 ? defaultBarWidth : extent / bars);
  return Math.max(1, defaultWidth);
};

var getCornerRadiusFromObject = function (cornerRadius, props) {
  var realCornerRadius = {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0
  };

  var updateCornerRadius = function (corner, fallback) {
    if (!_isNil(cornerRadius[corner])) {
      realCornerRadius[corner] = Helpers.evaluateProp(cornerRadius[corner], props);
    } else if (!_isNil(cornerRadius[fallback])) {
      realCornerRadius[corner] = Helpers.evaluateProp(cornerRadius[fallback], props);
    }
  };

  updateCornerRadius("topLeft", "top");
  updateCornerRadius("topRight", "top");
  updateCornerRadius("bottomLeft", "bottom");
  updateCornerRadius("bottomRight", "bottom");
  return realCornerRadius;
};

var getCornerRadius = function (cornerRadius, props) {
  var realCornerRadius = {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0
  };

  if (!cornerRadius) {
    return realCornerRadius;
  }

  if (_isPlainObject(cornerRadius)) {
    return getCornerRadiusFromObject(cornerRadius, props);
  } else {
    realCornerRadius.topLeft = Helpers.evaluateProp(cornerRadius, props);
    realCornerRadius.topRight = Helpers.evaluateProp(cornerRadius, props);
    return realCornerRadius;
  }
};

var getStyle = function () {
  var style = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var props = arguments.length > 1 ? arguments[1] : undefined;
  var stroke = style.fill || "black";
  var baseStyle = {
    fill: "black",
    stroke: stroke
  };
  return Helpers.evaluateStyle(_assign(baseStyle, style), props);
};

var evaluateProps = function (props) {
  /**
   * Potential evaluated props of following must be evaluated in this order:
   * 1) `style`
   * 2) `barWidth`
   * 3) `cornerRadius`
   *
   * Everything else does not have to be evaluated in a particular order:
   * `desc`
   * `id`
   * `tabIndex`
   */
  var style = getStyle(props.style, props);
  var barWidth = getBarWidth(props.barWidth, _assign({}, props, {
    style: style
  }));
  var cornerRadius = getCornerRadius(props.cornerRadius, _assign({}, props, {
    style: style,
    barWidth: barWidth
  }));
  var desc = Helpers.evaluateProp(props.desc, props);
  var id = Helpers.evaluateProp(props.id, props);
  var tabIndex = Helpers.evaluateProp(props.tabIndex, props);
  return _assign({}, props, {
    style: style,
    barWidth: barWidth,
    cornerRadius: cornerRadius,
    desc: desc,
    id: id,
    tabIndex: tabIndex
  });
};

var Bar = function (props) {
  props = evaluateProps(props);
  var _props = props,
      polar = _props.polar,
      origin = _props.origin,
      style = _props.style,
      barWidth = _props.barWidth,
      cornerRadius = _props.cornerRadius;
  var path = polar ? getPolarBarPath(props, cornerRadius) : getBarPath(props, barWidth, cornerRadius);
  var defaultTransform = polar && origin ? "translate(".concat(origin.x, ", ").concat(origin.y, ")") : undefined;
  return React.cloneElement(props.pathComponent, _objectSpread({}, props.events, {
    style: style,
    d: path,
    transform: props.transform || defaultTransform,
    className: props.className,
    role: props.role,
    shapeRendering: props.shapeRendering,
    clipPath: props.clipPath,
    desc: props.desc,
    tabIndex: props.tabIndex
  }));
};

Bar.propTypes = _objectSpread({}, CommonProps.primitiveProps, {
  alignment: PropTypes.oneOf(["start", "middle", "end"]),
  barRatio: PropTypes.number,
  barWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  cornerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.func, PropTypes.shape({
    top: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    topLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    topRight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    bottom: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    bottomLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    bottomRight: PropTypes.oneOfType([PropTypes.number, PropTypes.func])
  })]),
  datum: PropTypes.object,
  getPath: PropTypes.func,
  horizontal: PropTypes.bool,
  pathComponent: PropTypes.element,
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  y0: PropTypes.number
});
Bar.defaultProps = {
  defaultBarWidth: 8,
  pathComponent: React.createElement(Path, null),
  role: "presentation",
  shapeRendering: "auto"
};
export default Bar;