import _assign from "lodash/assign";
import _isFunction from "lodash/isFunction";
import _defaults from "lodash/defaults";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
import PropTypes from "prop-types";
import { Helpers, CommonProps, Path } from "victory-core";
import * as d3Shape from "d3-shape";

var getPath = function (props) {
  var slice = props.slice,
      radius = props.radius,
      innerRadius = props.innerRadius,
      cornerRadius = props.cornerRadius;

  if (_isFunction(props.pathFunction)) {
    return props.pathFunction(slice);
  }

  var padAngle = Helpers.degreesToRadians(props.padAngle);
  var startAngle = Helpers.degreesToRadians(props.sliceStartAngle);
  var endAngle = Helpers.degreesToRadians(props.sliceEndAngle);
  var pathFunction = d3Shape.arc().cornerRadius(cornerRadius).outerRadius(radius).innerRadius(innerRadius || 0);
  return pathFunction(_defaults({
    startAngle: startAngle,
    endAngle: endAngle,
    padAngle: padAngle
  }, slice));
};

var evaluateProps = function (props) {
  /**
   * * Potential evaluated props of following must be evaluated in this order:
   * 1) `style`
   * 2) `radius`
   * 3) `innerRadius`
   *
   * Everything else does not have to be evaluated in a particular order:
   * `id`
   * `cornerRadius`
   * `padAngle`
   * `sliceStartAngle`
   * `sliceEndAngle`
   */
  var style = Helpers.evaluateStyle(props.style, props);
  var radius = Helpers.evaluateProp(props.radius, _assign({}, props, {
    style: style
  }));
  var innerRadius = Helpers.evaluateProp(props.innerRadius, _assign({}, props, {
    style: style,
    radius: radius
  }));
  var id = Helpers.evaluateProp(props.id, props);
  var cornerRadius = Helpers.evaluateProp(props.cornerRadius, props);
  var padAngle = Helpers.evaluateProp(props.padAngle, props);
  var sliceStartAngle = Helpers.evaluateProp(props.sliceStartAngle, props);
  var sliceEndAngle = Helpers.evaluateProp(props.sliceEndAngle, props);
  return _assign({}, props, {
    style: style,
    radius: radius,
    innerRadius: innerRadius,
    id: id,
    cornerRadius: cornerRadius,
    padAngle: padAngle,
    sliceStartAngle: sliceStartAngle,
    sliceEndAngle: sliceEndAngle
  });
};

var Slice = function (props) {
  props = evaluateProps(props);
  var defaultTransform = props.origin ? "translate(".concat(props.origin.x, ", ").concat(props.origin.y, ")") : undefined;
  return React.cloneElement(props.pathComponent, _objectSpread({}, props.events, {
    d: getPath(props),
    style: props.style,
    transform: props.transform || defaultTransform,
    className: props.className,
    role: props.role,
    shapeRendering: props.shapeRendering,
    clipPath: props.clipPath
  }));
};

Slice.propTypes = _objectSpread({}, CommonProps.primitiveProps, {
  cornerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  datum: PropTypes.object,
  innerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  padAngle: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  pathComponent: PropTypes.element,
  pathFunction: PropTypes.func,
  radius: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  slice: PropTypes.object,
  sliceEndAngle: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  sliceStartAngle: PropTypes.oneOfType([PropTypes.number, PropTypes.func])
});
Slice.defaultProps = {
  pathComponent: React.createElement(Path, null),
  role: "presentation",
  shapeRendering: "auto"
};
export default Slice;