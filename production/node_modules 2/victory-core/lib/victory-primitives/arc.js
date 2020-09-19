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

var _path = _interopRequireDefault(require("./path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getArcPath = function (props) {
  var cx = props.cx,
      cy = props.cy,
      r = props.r,
      startAngle = props.startAngle,
      endAngle = props.endAngle,
      closedPath = props.closedPath; // Always draw the path as two arcs so that complete circles may be rendered.

  var halfAngle = Math.abs(endAngle - startAngle) / 2 + startAngle;
  var x1 = cx + r * Math.cos(_helpers.default.degreesToRadians(startAngle));
  var y1 = cy - r * Math.sin(_helpers.default.degreesToRadians(startAngle));
  var x2 = cx + r * Math.cos(_helpers.default.degreesToRadians(halfAngle));
  var y2 = cy - r * Math.sin(_helpers.default.degreesToRadians(halfAngle));
  var x3 = cx + r * Math.cos(_helpers.default.degreesToRadians(endAngle));
  var y3 = cy - r * Math.sin(_helpers.default.degreesToRadians(endAngle));
  var largerArcFlag1 = halfAngle - startAngle <= 180 ? 0 : 1;
  var largerArcFlag2 = endAngle - halfAngle <= 180 ? 0 : 1;
  var arcStart = closedPath ? " M ".concat(cx, ", ").concat(cy, " L ").concat(x1, ", ").concat(y1) : "M ".concat(x1, ", ").concat(y1);
  var arc1 = "A ".concat(r, ", ").concat(r, ", 0, ").concat(largerArcFlag1, ", 0, ").concat(x2, ", ").concat(y2);
  var arc2 = "A ".concat(r, ", ").concat(r, ", 0, ").concat(largerArcFlag2, ", 0, ").concat(x3, ", ").concat(y3);
  var arcEnd = closedPath ? "Z" : "";
  return "".concat(arcStart, " ").concat(arc1, " ").concat(arc2, " ").concat(arcEnd);
};

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
    stroke: "black",
    fill: "none"
  }, props.style), props);

  var tabIndex = _helpers.default.evaluateProp(props.tabIndex, props);

  return (0, _assign2.default)({}, props, {
    desc: desc,
    id: id,
    style: style,
    tabIndex: tabIndex
  });
};

var Arc = function (props) {
  props = evaluateProps(props);
  return _react.default.cloneElement(props.pathComponent, _objectSpread({}, props.events, {
    d: getArcPath(props),
    style: props.style,
    desc: props.desc,
    tabIndex: props.tabIndex,
    className: props.className,
    role: props.role,
    shapeRendering: props.shapeRendering,
    transform: props.transform,
    clipPath: props.clipPath
  }));
};

Arc.propTypes = _objectSpread({}, _commonProps.default.primitiveProps, {
  closedPath: _propTypes.default.bool,
  cx: _propTypes.default.number,
  cy: _propTypes.default.number,
  datum: _propTypes.default.any,
  endAngle: _propTypes.default.number,
  pathComponent: _propTypes.default.element,
  r: _propTypes.default.number,
  startAngle: _propTypes.default.number
});
Arc.defaultProps = {
  pathComponent: _react.default.createElement(_path.default, null),
  role: "presentation",
  shapeRendering: "auto"
};
var _default = Arc;
exports.default = _default;