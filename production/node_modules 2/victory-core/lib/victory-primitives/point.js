"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _helpers = _interopRequireDefault(require("../victory-util/helpers"));

var _pathHelpers = _interopRequireDefault(require("./path-helpers"));

var _commonProps = _interopRequireDefault(require("../victory-util/common-props"));

var _path = _interopRequireDefault(require("./path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getPath = function (props) {
  var x = props.x,
      y = props.y,
      size = props.size,
      symbol = props.symbol;

  if (props.getPath) {
    return props.getPath(x, y, size);
  }

  var pathFunctions = {
    circle: _pathHelpers.default.circle,
    square: _pathHelpers.default.square,
    diamond: _pathHelpers.default.diamond,
    triangleDown: _pathHelpers.default.triangleDown,
    triangleUp: _pathHelpers.default.triangleUp,
    plus: _pathHelpers.default.plus,
    minus: _pathHelpers.default.minus,
    star: _pathHelpers.default.star
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
  var desc = _helpers.default.evaluateProp(props.desc, props);

  var id = _helpers.default.evaluateProp(props.id, props);

  var size = _helpers.default.evaluateProp(props.size, props);

  var style = _helpers.default.evaluateStyle(props.style, props);

  var symbol = _helpers.default.evaluateProp(props.symbol, props);

  var tabIndex = _helpers.default.evaluateProp(props.tabIndex, props);

  return (0, _assign2.default)({}, props, {
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
  return _react.default.cloneElement(props.pathComponent, _objectSpread({}, props.events, {
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

Point.propTypes = _objectSpread({}, _commonProps.default.primitiveProps, {
  datum: _propTypes.default.object,
  getPath: _propTypes.default.func,
  pathComponent: _propTypes.default.element,
  size: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
  symbol: _propTypes.default.oneOfType([_propTypes.default.oneOf(["circle", "diamond", "plus", "minus", "square", "star", "triangleDown", "triangleUp"]), _propTypes.default.func]),
  x: _propTypes.default.number,
  y: _propTypes.default.number
});
Point.defaultProps = {
  pathComponent: _react.default.createElement(_path.default, null),
  role: "presentation",
  shapeRendering: "auto"
};
var _default = Point;
exports.default = _default;