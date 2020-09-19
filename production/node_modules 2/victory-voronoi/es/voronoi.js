import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*eslint no-magic-numbers: ["error", { "ignore": [2] }]*/
import React from "react";
import PropTypes from "prop-types";
import { Helpers, CommonProps, ClipPath, Path, Circle } from "victory-core";

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
  var id = Helpers.evaluateProp(props.id, props);
  var size = Helpers.evaluateProp(props.size, props);
  var style = Helpers.evaluateStyle(props.style, props);
  return _assign({}, props, {
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
    var circle = React.cloneElement(props.circleComponent, _objectSpread({}, sharedProps, {
      key: "".concat(props.id, "-circle-clip"),
      clipPath: "url(#".concat(props.clipId, ")"),
      cx: props.x,
      cy: props.y,
      r: size
    }));
    var voronoiClipPath = React.cloneElement(props.clipPathComponent, {
      key: "".concat(props.id, "-voronoi-clip"),
      clipId: props.clipId
    }, React.cloneElement(props.pathComponent, {
      d: voronoiPath,
      className: className
    }));
    return React.cloneElement(props.groupComponent, {}, [voronoiClipPath, circle]);
  }

  return React.cloneElement(props.pathComponent, _objectSpread({}, sharedProps, {
    d: voronoiPath
  }));
};

Voronoi.propTypes = _objectSpread({}, CommonProps.primitiveProps, {
  circleComponent: PropTypes.element,
  clipId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  clipPathComponent: PropTypes.element,
  datum: PropTypes.object,
  groupComponent: PropTypes.element,
  pathComponent: PropTypes.element,
  polygon: PropTypes.array,
  size: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
});
Voronoi.defaultProps = {
  pathComponent: React.createElement(Path, null),
  circleComponent: React.createElement(Circle, null),
  clipPathComponent: React.createElement(ClipPath, null),
  groupComponent: React.createElement("g", null),
  role: "presentation",
  shapeRendering: "auto"
};
export default Voronoi;