"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _victoryCore = require("victory-core");

var d3Shape = _interopRequireWildcard(require("d3-shape"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getPath = function (props) {
  var slice = props.slice,
      radius = props.radius,
      innerRadius = props.innerRadius,
      cornerRadius = props.cornerRadius;

  if ((0, _isFunction2.default)(props.pathFunction)) {
    return props.pathFunction(slice);
  }

  var padAngle = _victoryCore.Helpers.degreesToRadians(props.padAngle);

  var startAngle = _victoryCore.Helpers.degreesToRadians(props.sliceStartAngle);

  var endAngle = _victoryCore.Helpers.degreesToRadians(props.sliceEndAngle);

  var pathFunction = d3Shape.arc().cornerRadius(cornerRadius).outerRadius(radius).innerRadius(innerRadius || 0);
  return pathFunction((0, _defaults2.default)({
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
  var style = _victoryCore.Helpers.evaluateStyle(props.style, props);

  var radius = _victoryCore.Helpers.evaluateProp(props.radius, (0, _assign2.default)({}, props, {
    style: style
  }));

  var innerRadius = _victoryCore.Helpers.evaluateProp(props.innerRadius, (0, _assign2.default)({}, props, {
    style: style,
    radius: radius
  }));

  var id = _victoryCore.Helpers.evaluateProp(props.id, props);

  var cornerRadius = _victoryCore.Helpers.evaluateProp(props.cornerRadius, props);

  var padAngle = _victoryCore.Helpers.evaluateProp(props.padAngle, props);

  var sliceStartAngle = _victoryCore.Helpers.evaluateProp(props.sliceStartAngle, props);

  var sliceEndAngle = _victoryCore.Helpers.evaluateProp(props.sliceEndAngle, props);

  return (0, _assign2.default)({}, props, {
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
  return _react.default.cloneElement(props.pathComponent, _objectSpread({}, props.events, {
    d: getPath(props),
    style: props.style,
    transform: props.transform || defaultTransform,
    className: props.className,
    role: props.role,
    shapeRendering: props.shapeRendering,
    clipPath: props.clipPath
  }));
};

Slice.propTypes = _objectSpread({}, _victoryCore.CommonProps.primitiveProps, {
  cornerRadius: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
  datum: _propTypes.default.object,
  innerRadius: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
  padAngle: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
  pathComponent: _propTypes.default.element,
  pathFunction: _propTypes.default.func,
  radius: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
  slice: _propTypes.default.object,
  sliceEndAngle: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
  sliceStartAngle: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func])
});
Slice.defaultProps = {
  pathComponent: _react.default.createElement(_victoryCore.Path, null),
  role: "presentation",
  shapeRendering: "auto"
};
var _default = Slice;
exports.default = _default;