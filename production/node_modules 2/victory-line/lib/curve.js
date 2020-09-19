"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var d3Shape = _interopRequireWildcard(require("d3-shape"));

var _victoryCore = require("victory-core");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  var id = _victoryCore.Helpers.evaluateProp(props.id, props);

  var style = _victoryCore.Helpers.evaluateStyle((0, _assign2.default)({
    fill: "none",
    stroke: "black"
  }, props.style), props);

  return (0, _assign2.default)({}, props, {
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
  return _react.default.cloneElement(props.pathComponent, _objectSpread({}, props.events, {
    d: lineFunction(props.data),
    style: props.style,
    transform: props.transform || defaultTransform,
    className: props.className,
    role: props.role,
    shapeRendering: props.shapeRendering,
    clipPath: props.clipPath
  }));
};

Curve.propTypes = _objectSpread({}, _victoryCore.CommonProps.primitiveProps, {
  interpolation: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]),
  openCurve: _propTypes.default.bool,
  origin: _propTypes.default.object,
  pathComponent: _propTypes.default.element,
  polar: _propTypes.default.bool
});
Curve.defaultProps = {
  pathComponent: _react.default.createElement(_victoryCore.Path, null),
  role: "presentation",
  shapeRendering: "auto"
};
var _default = Curve;
exports.default = _default;