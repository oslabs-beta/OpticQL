"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _helpers = _interopRequireDefault(require("../victory-util/helpers"));

var _commonProps = _interopRequireDefault(require("../victory-util/common-props"));

var _line = _interopRequireDefault(require("./line"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var evaluateProps = function (props) {
  /**
   * Potential evaluated props are:
   * `desc`
   * `id`
   * `style`
   * `tabIndex`
   */
  var desc = _helpers.default.evaluateProp(props.desc, props);

  var id = _helpers.default.evaluateProp(props.id, props);

  var style = _helpers.default.evaluateStyle((0, _assign2.default)({
    stroke: "black"
  }, props.style), props);

  var tabIndex = _helpers.default.evaluateProp(props.tabIndex, props);

  return (0, _assign2.default)({}, props, {
    desc: desc,
    id: id,
    style: style,
    tabIndex: tabIndex
  });
};

var LineSegment = function (props) {
  props = evaluateProps(props);
  return _react.default.cloneElement(props.lineComponent, _objectSpread({}, props.events, {
    style: props.style,
    desc: props.desc,
    tabIndex: props.tabIndex,
    className: props.className,
    role: props.role,
    shapeRendering: props.shapeRendering,
    x1: props.x1,
    x2: props.x2,
    y1: props.y1,
    y2: props.y2,
    transform: props.transform,
    clipPath: props.clipPath
  }));
};

LineSegment.propTypes = _objectSpread({}, _commonProps.default.primitiveProps, {
  datum: _propTypes.default.any,
  lineComponent: _propTypes.default.element,
  x1: _propTypes.default.number,
  x2: _propTypes.default.number,
  y1: _propTypes.default.number,
  y2: _propTypes.default.number
});
LineSegment.defaultProps = {
  lineComponent: _react.default.createElement(_line.default, null),
  role: "presentation",
  shapeRendering: "auto"
};
var _default = LineSegment;
exports.default = _default;