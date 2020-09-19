import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
import PropTypes from "prop-types";
import Helpers from "../victory-util/helpers";
import CommonProps from "../victory-util/common-props";
import Line from "./line";

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
    stroke: "black"
  }, props.style), props);
  var tabIndex = Helpers.evaluateProp(props.tabIndex, props);
  return _assign({}, props, {
    desc: desc,
    id: id,
    style: style,
    tabIndex: tabIndex
  });
};

var LineSegment = function (props) {
  props = evaluateProps(props);
  return React.cloneElement(props.lineComponent, _objectSpread({}, props.events, {
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

LineSegment.propTypes = _objectSpread({}, CommonProps.primitiveProps, {
  datum: PropTypes.any,
  lineComponent: PropTypes.element,
  x1: PropTypes.number,
  x2: PropTypes.number,
  y1: PropTypes.number,
  y2: PropTypes.number
});
LineSegment.defaultProps = {
  lineComponent: React.createElement(Line, null),
  role: "presentation",
  shapeRendering: "auto"
};
export default LineSegment;