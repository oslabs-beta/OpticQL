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

var _rect = _interopRequireDefault(require("./rect"));

var _circle = _interopRequireDefault(require("./circle"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var evaluateProps = function (props) {
  /**
   * Potential evaluated prop is:
   * `id`
   */
  var id = _helpers.default.evaluateProp(props.id, props);

  return (0, _assign2.default)({}, props, {
    id: id
  });
};

var Background = function (props) {
  props = evaluateProps(props);
  return props.polar ? _react.default.cloneElement(props.circleComponent, _objectSpread({}, props.events, {
    style: props.style,
    role: props.role,
    shapeRendering: props.shapeRendering,
    cx: props.x,
    cy: props.y,
    r: props.height
  })) : _react.default.cloneElement(props.rectComponent, _objectSpread({}, props.events, {
    style: props.style,
    role: props.role,
    shapeRendering: props.shapeRendering,
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height
  }));
};

Background.propTypes = _objectSpread({}, _commonProps.default.primitiveProps, {
  circleComponent: _propTypes.default.element,
  height: _propTypes.default.number,
  rectComponent: _propTypes.default.element,
  width: _propTypes.default.number,
  x: _propTypes.default.number,
  y: _propTypes.default.number
});
Background.defaultProps = {
  circleComponent: _react.default.createElement(_circle.default, null),
  rectComponent: _react.default.createElement(_rect.default, null),
  role: "presentation",
  shapeRendering: "auto"
};
var _default = Background;
exports.default = _default;