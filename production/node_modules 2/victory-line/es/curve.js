import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*eslint no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2] }]*/
import React from "react";
import PropTypes from "prop-types";
import * as d3Shape from "d3-shape";
import { Helpers, CommonProps, Path } from "victory-core";

var defined = function (d) {
  var y = d._y1 !== undefined ? d._y1 : d._y;
  return y !== null && y !== undefined && d._y0 !== null;
};

var getXAccessor = function (scale) {
  return function (d) {
    return scale.x(d._x1 !== undefined ? d._x1 : d._x);
  };
};

var getYAccessor = function (scale) {
  return function (d) {
    return scale.y(d._y1 !== undefined ? d._y1 : d._y);
  };
};

var getAngleAccessor = function (scale) {
  return function (d) {
    var x = scale.x(d._x1 !== undefined ? d._x1 : d._x);
    return -1 * x + Math.PI / 2;
  };
};

var toNewName = function (interpolation) {
  // d3 shape changed the naming scheme for interpolators from "basis" -> "curveBasis" etc.
  var capitalize = function (s) {
    return s && s[0].toUpperCase() + s.slice(1);
  };

  return "curve".concat(capitalize(interpolation));
};

var getLineFunction = function (props) {
  var polar = props.polar,
      scale = props.scale,
      horizontal = props.horizontal;
  var defaultOpenCurve = polar ? false : true;
  var openCurve = props.openCurve === undefined ? defaultOpenCurve : props.openCurve;
  var interpolationFunction = typeof props.interpolation === "function" && props.interpolation;
  var interpolationName = typeof props.interpolation === "string" && (!openCurve ? "".concat(toNewName(props.interpolation), "Closed") : toNewName(props.interpolation));
  return polar ? d3Shape.lineRadial().defined(defined).curve(interpolationFunction || d3Shape[interpolationName]).angle(getAngleAccessor(scale)).radius(getYAccessor(scale)) : d3Shape.line().defined(defined).curve(interpolationFunction || d3Shape[interpolationName]).x(horizontal ? getYAccessor(scale) : getXAccessor(scale)).y(horizontal ? getXAccessor(scale) : getYAccessor(scale));
};

var evaluateProps = function (props) {
  /**
   * Potential evaluated props are:
   * `id`
   * `style`
   */
  var id = Helpers.evaluateProp(props.id, props);
  var style = Helpers.evaluateStyle(_assign({
    fill: "none",
    stroke: "black"
  }, props.style), props);
  return _assign({}, props, {
    id: id,
    style: style
  });
};

var Curve = function (props) {
  props = evaluateProps(props);
  var _props = props,
      polar = _props.polar,
      origin = _props.origin;
  var lineFunction = getLineFunction(props);
  var defaultTransform = polar && origin ? "translate(".concat(origin.x, ", ").concat(origin.y, ")") : undefined;
  return React.cloneElement(props.pathComponent, _objectSpread({}, props.events, {
    d: lineFunction(props.data),
    style: props.style,
    transform: props.transform || defaultTransform,
    className: props.className,
    role: props.role,
    shapeRendering: props.shapeRendering,
    clipPath: props.clipPath
  }));
};

Curve.propTypes = _objectSpread({}, CommonProps.primitiveProps, {
  interpolation: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  openCurve: PropTypes.bool,
  origin: PropTypes.object,
  pathComponent: PropTypes.element,
  polar: PropTypes.bool
});
Curve.defaultProps = {
  pathComponent: React.createElement(Path, null),
  role: "presentation",
  shapeRendering: "auto"
};
export default Curve;