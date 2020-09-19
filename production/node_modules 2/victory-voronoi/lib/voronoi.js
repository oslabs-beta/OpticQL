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

var getVoronoiPath = function (props) {
  var polygon = props.polygon;
  return Array.isArray(polygon) && polygon.length ? "M ".concat(props.polygon.join("L"), " Z") : "";
};

var evaluateProps = function (props) {
  /**
   * Potential evaluated props are:
   * `id`
   * `size`
   * `style`
   */
  var id = _victoryCore.Helpers.evaluateProp(props.id, props);

  var size = _victoryCore.Helpers.evaluateProp(props.size, props);

  var style = _victoryCore.Helpers.evaluateStyle(props.style, props);

  return (0, _assign2.default)({}, props, {
    id: id,
    size: size,
    style: style
  });
};

var Voronoi = function (props) {
  props = evaluateProps(props);
  var _props = props,
      role = _props.role,
      shapeRendering = _props.shapeRendering,
      className = _props.className,
      events = _props.events,
      transform = _props.transform,
      style = _props.style,
      size = _props.size;
  var voronoiPath = getVoronoiPath(props);

  var sharedProps = _objectSpread({
    className: className,
    role: role,
    shapeRendering: shapeRendering,
    style: style,
    transform: transform
  }, events);

  if (size) {
    var circle = _react.default.cloneElement(props.circleComponent, _objectSpread({}, sharedProps, {
      key: "".concat(props.id, "-circle-clip"),
      clipPath: "url(#".concat(props.clipId, ")"),
      cx: props.x,
      cy: props.y,
      r: size
    }));

    var voronoiClipPath = _react.default.cloneElement(props.clipPathComponent, {
      key: "".concat(props.id, "-voronoi-clip"),
      clipId: props.clipId
    }, _react.default.cloneElement(props.pathComponent, {
      d: voronoiPath,
      className: className
    }));

    return _react.default.cloneElement(props.groupComponent, {}, [voronoiClipPath, circle]);
  }

  return _react.default.cloneElement(props.pathComponent, _objectSpread({}, sharedProps, {
    d: voronoiPath
  }));
};

Voronoi.propTypes = _objectSpread({}, _victoryCore.CommonProps.primitiveProps, {
  circleComponent: _propTypes.default.element,
  clipId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  clipPathComponent: _propTypes.default.element,
  datum: _propTypes.default.object,
  groupComponent: _propTypes.default.element,
  pathComponent: _propTypes.default.element,
  polygon: _propTypes.default.array,
  size: _propTypes.default.number,
  x: _propTypes.default.number,
  y: _propTypes.default.number
});
Voronoi.defaultProps = {
  pathComponent: _react.default.createElement(_victoryCore.Path, null),
  circleComponent: _react.default.createElement(_victoryCore.Circle, null),
  clipPathComponent: _react.default.createElement(_victoryCore.ClipPath, null),
  groupComponent: _react.default.createElement("g", null),
  role: "presentation",
  shapeRendering: "auto"
};
var _default = Voronoi;
exports.default = _default;