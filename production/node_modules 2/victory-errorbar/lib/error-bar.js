"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _victoryCore = require("victory-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var renderBorder = function (props, error, type) {
  var vertical = type === "right" || type === "left";
  return _react.default.cloneElement(props.lineComponent, _objectSpread({}, props.events, {
    role: props.role,
    shapeRendering: props.shapeRendering,
    className: props.className,
    style: props.style,
    transform: props.transform,
    key: "".concat(props.id, "-border-").concat(type),
    x1: vertical ? error[type] : props.x - props.borderWidth,
    x2: vertical ? error[type] : props.x + props.borderWidth,
    y1: vertical ? props.y - props.borderWidth : error[type],
    y2: vertical ? props.y + props.borderWidth : error[type]
  }));
};

var renderCross = function (props, error, type) {
  var vertical = type === "top" || type === "bottom";
  return _react.default.cloneElement(props.lineComponent, _objectSpread({}, props.events, {
    role: props.role,
    shapeRendering: props.shapeRendering,
    className: props.className,
    style: props.style,
    transform: props.transform,
    key: "".concat(props.id, "-cross-").concat(type),
    x1: props.x,
    x2: vertical ? props.x : error[type],
    y1: props.y,
    y2: vertical ? error[type] : props.y
  }));
};

var calculateError = function (props) {
  var errorX = props.errorX,
      errorY = props.errorY;
  var settings = {
    right: {
      error: errorX,
      errorIndex: 0
    },
    left: {
      error: errorX,
      errorIndex: 1
    },
    top: {
      error: errorY,
      errorIndex: 1
    },
    bottom: {
      error: errorY,
      errorIndex: 0
    }
  };

  var getError = function (direction) {
    var _settings$direction = settings[direction],
        error = _settings$direction.error,
        errorIndex = _settings$direction.errorIndex;
    return error ? error[errorIndex] : undefined;
  };

  var result = ["right", "left", "top", "bottom"].reduce(function (memo, dir) {
    memo[dir] = getError(dir);
    return memo;
  }, {});
  return result;
};

var evaluateProps = function (props) {
  /**
   * Potential evaluated props are:
   * `id`
   * `style`
   */
  var id = _victoryCore.Helpers.evaluateProp(props.id, props);

  var style = _victoryCore.Helpers.evaluateStyle((0, _assign2.default)({
    stroke: "black"
  }, props.style), props);

  return (0, _assign2.default)({}, props, {
    id: id,
    style: style
  });
};

var ErrorBar = function (props) {
  props = evaluateProps(props);
  var error = calculateError(props);
  var children = [error.right ? renderBorder(props, error, "right") : null, error.left ? renderBorder(props, error, "left") : null, error.bottom ? renderBorder(props, error, "bottom") : null, error.top ? renderBorder(props, error, "top") : null, error.right ? renderCross(props, error, "right") : null, error.left ? renderCross(props, error, "left") : null, error.bottom ? renderCross(props, error, "bottom") : null, error.top ? renderCross(props, error, "top") : null].filter(Boolean);
  return _react.default.cloneElement(props.groupComponent, {}, children);
};

ErrorBar.propTypes = _objectSpread({}, _victoryCore.CommonProps.primitiveProps, {
  borderWidth: _propTypes.default.number,
  datum: _propTypes.default.object,
  errorX: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.array, _propTypes.default.bool]),
  errorY: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.array, _propTypes.default.bool]),
  groupComponent: _propTypes.default.element,
  lineComponent: _propTypes.default.element,
  x: _propTypes.default.number,
  y: _propTypes.default.number
});
ErrorBar.defaultProps = {
  groupComponent: _react.default.createElement("g", null),
  lineComponent: _react.default.createElement(_victoryCore.Line, null),
  role: "presentation",
  shapeRendering: "auto"
};
var _default = ErrorBar;
exports.default = _default;