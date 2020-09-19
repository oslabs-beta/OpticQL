import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
import PropTypes from "prop-types";
import Helpers from "../victory-util/helpers";
import CommonProps from "../victory-util/common-props";
import Rect from "./rect";

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

var Border = function (props) {
  props = evaluateProps(props);
  return React.cloneElement(props.rectComponent, _objectSpread({}, props.events, {
    style: props.style,
    desc: props.desc,
    tabIndex: props.tabIndex,
    transform: props.transform,
    className: props.className,
    role: props.role,
    shapeRendering: props.shapeRendering,
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height,
    clipPath: props.clipPath
  }));
};

Border.propTypes = _objectSpread({}, CommonProps.primitiveProps, {
  height: PropTypes.number,
  rectComponent: PropTypes.element,
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
});
Border.defaultProps = {
  rectComponent: React.createElement(Rect, null),
  role: "presentation",
  shapeRendering: "auto"
};
export default Border;