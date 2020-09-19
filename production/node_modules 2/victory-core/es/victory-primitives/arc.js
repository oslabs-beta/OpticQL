import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*eslint no-magic-numbers: ["error", { "ignore": [0, 1, 2, 180] }]*/
import React from "react";
import PropTypes from "prop-types";
import Helpers from "../victory-util/helpers";
import CommonProps from "../victory-util/common-props";
import Path from "./path";

var getArcPath = function (props) {
  var cx = props.cx,
      cy = props.cy,
      r = props.r,
      startAngle = props.startAngle,
      endAngle = props.endAngle,
      closedPath = props.closedPath; // Always draw the path as two arcs so that complete circles may be rendered.

  var halfAngle = Math.abs(endAngle - startAngle) / 2 + startAngle;
  var x1 = cx + r * Math.cos(Helpers.degreesToRadians(startAngle));
  var y1 = cy - r * Math.sin(Helpers.degreesToRadians(startAngle));
  var x2 = cx + r * Math.cos(Helpers.degreesToRadians(halfAngle));
  var y2 = cy - r * Math.sin(Helpers.degreesToRadians(halfAngle));
  var x3 = cx + r * Math.cos(Helpers.degreesToRadians(endAngle));
  var y3 = cy - r * Math.sin(Helpers.degreesToRadians(endAngle));
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
  var desc = Helpers.evaluateProp(props.desc, props);
  var id = Helpers.evaluateProp(props.id, props);
  var style = Helpers.evaluateStyle(_assign({
    stroke: "black",
    fill: "none"
  }, props.style), props);
  var tabIndex = Helpers.evaluateProp(props.tabIndex, props);
  return _assign({}, props, {
    desc: desc,
    id: id,
    style: style,
    tabIndex: tabIndex
  });
};

var Arc = function (props) {
  props = evaluateProps(props);
  return React.cloneElement(props.pathComponent, _objectSpread({}, props.events, {
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

Arc.propTypes = _objectSpread({}, CommonProps.primitiveProps, {
  closedPath: PropTypes.bool,
  cx: PropTypes.number,
  cy: PropTypes.number,
  datum: PropTypes.any,
  endAngle: PropTypes.number,
  pathComponent: PropTypes.element,
  r: PropTypes.number,
  startAngle: PropTypes.number
});
Arc.defaultProps = {
  pathComponent: React.createElement(Path, null),
  role: "presentation",
  shapeRendering: "auto"
};
export default Arc;