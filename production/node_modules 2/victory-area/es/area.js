import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*eslint no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2] }]*/
import React from "react";
import PropTypes from "prop-types";
import * as d3Shape from "d3-shape";
import { Helpers, CommonProps, Path } from "victory-core";

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

var getY0Accessor = function (scale) {
  return function (d) {
    return scale.y(d._y0);
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
  var interpolationFunction = typeof props.interpolation === "function" && props.interpolation;
  var interpolationName = typeof props.interpolation === "string" && toNewName(props.interpolation);
  return polar ? d3Shape.lineRadial().defined(defined).curve(interpolationFunction || d3Shape["".concat(interpolationName, "Closed")]).angle(getAngleAccessor(scale)).radius(getYAccessor(scale)) : d3Shape.line().defined(defined).curve(interpolationFunction || d3Shape[interpolationName]).x(horizontal ? getYAccessor(scale) : getXAccessor(scale)).y(horizontal ? getXAccessor(scale) : getYAccessor(scale));
};

var getCartesianArea = function (props, interpolation) {
  var horizontal = props.horizontal,
      scale = props.scale;
  var interpolationFunction = typeof interpolation === "function" && interpolation;
  var interpolationName = typeof interpolation === "string" && interpolation;
  return horizontal ? d3Shape.area().defined(defined).curve(interpolationFunction || d3Shape[interpolationName]).x0(getY0Accessor(scale)).x1(getYAccessor(scale)).y(getXAccessor(scale)) : d3Shape.area().defined(defined).curve(interpolationFunction || d3Shape[interpolationName]).x(getXAccessor(scale)).y1(getYAccessor(scale)).y0(getY0Accessor(scale));
};

var getAreaFunction = function (props) {
  var polar = props.polar,
      scale = props.scale;
  var interpolationFunction = typeof props.interpolation === "function" && props.interpolation;
  var interpolationName = typeof props.interpolation === "string" && toNewName(props.interpolation);
  var interpolation = interpolationFunction || interpolationName;
  return polar ? d3Shape.radialArea().defined(defined).curve(interpolationFunction || d3Shape["".concat(interpolationName, "Closed")]).angle(getAngleAccessor(scale)).outerRadius(getYAccessor(scale)).innerRadius(getY0Accessor(scale)) : getCartesianArea(props, interpolation);
};

var evaluateProps = function (props) {
  /**
   * Potential evaluated props are:
   * `desc`
   * `id`
   * `style`
   * `tabIndex`
   */
  var desc = Helpers.evaluateProp(props.desc, props);
  var id = Helpers.evaluateProp(props.id, props);
  var style = Helpers.evaluateStyle(_assign({
    fill: "black"
  }, props.style), props);
  var tabIndex = Helpers.evaluateProp(props.tabIndex, props);
  return _assign({}, props, {
    desc: desc,
    id: id,
    style: style,
    tabIndex: tabIndex
  });
};

var Area = function (props) {
  props = evaluateProps(props);
  var _props = props,
      role = _props.role,
      shapeRendering = _props.shapeRendering,
      className = _props.className,
      polar = _props.polar,
      origin = _props.origin,
      data = _props.data,
      pathComponent = _props.pathComponent,
      events = _props.events,
      groupComponent = _props.groupComponent,
      clipPath = _props.clipPath,
      id = _props.id,
      style = _props.style,
      desc = _props.desc,
      tabIndex = _props.tabIndex;
  var defaultTransform = polar && origin ? "translate(".concat(origin.x, ", ").concat(origin.y, ")") : undefined;
  var transform = props.transform || defaultTransform;
  var renderLine = style.stroke && style.stroke !== "none" && style.stroke !== "transparent";
  var areaFunction = getAreaFunction(props);
  var lineFunction = renderLine && getLineFunction(props);
  var areaStroke = style.stroke ? "none" : style.fill;

  var sharedProps = _objectSpread({
    className: className,
    role: role,
    shapeRendering: shapeRendering,
    transform: transform
  }, events, {
    clipPath: clipPath
  });

  var area = React.cloneElement(pathComponent, _assign({
    key: "".concat(id, "-area"),
    style: _assign({}, style, {
      stroke: areaStroke
    }),
    d: areaFunction(data),
    desc: desc,
    tabIndex: tabIndex
  }, sharedProps));
  var line = renderLine ? React.cloneElement(pathComponent, _assign({
    key: "".concat(id, "-area-stroke"),
    style: _assign({}, style, {
      fill: "none"
    }),
    d: lineFunction(data)
  }, sharedProps)) : null;
  return renderLine ? React.cloneElement(groupComponent, {}, [area, line]) : area;
};

Area.propTypes = _objectSpread({}, CommonProps.primitiveProps, {
  groupComponent: PropTypes.element,
  interpolation: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  pathComponent: PropTypes.element
});
Area.defaultProps = {
  groupComponent: React.createElement("g", null),
  pathComponent: React.createElement(Path, null),
  role: "presentation",
  shapeRendering: "auto"
};
export default Area;