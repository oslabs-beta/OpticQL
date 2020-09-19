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
  var desc = _victoryCore.Helpers.evaluateProp(props.desc, props);

  var id = _victoryCore.Helpers.evaluateProp(props.id, props);

  var style = _victoryCore.Helpers.evaluateStyle((0, _assign2.default)({
    fill: "black"
  }, props.style), props);

  var tabIndex = _victoryCore.Helpers.evaluateProp(props.tabIndex, props);

  return (0, _assign2.default)({}, props, {
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

  var area = _react.default.cloneElement(pathComponent, (0, _assign2.default)({
    key: "".concat(id, "-area"),
    style: (0, _assign2.default)({}, style, {
      stroke: areaStroke
    }),
    d: areaFunction(data),
    desc: desc,
    tabIndex: tabIndex
  }, sharedProps));

  var line = renderLine ? _react.default.cloneElement(pathComponent, (0, _assign2.default)({
    key: "".concat(id, "-area-stroke"),
    style: (0, _assign2.default)({}, style, {
      fill: "none"
    }),
    d: lineFunction(data)
  }, sharedProps)) : null;
  return renderLine ? _react.default.cloneElement(groupComponent, {}, [area, line]) : area;
};

Area.propTypes = _objectSpread({}, _victoryCore.CommonProps.primitiveProps, {
  groupComponent: _propTypes.default.element,
  interpolation: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]),
  pathComponent: _propTypes.default.element
});
Area.defaultProps = {
  groupComponent: _react.default.createElement("g", null),
  pathComponent: _react.default.createElement(_victoryCore.Path, null),
  role: "presentation",
  shapeRendering: "auto"
};
var _default = Area;
exports.default = _default;