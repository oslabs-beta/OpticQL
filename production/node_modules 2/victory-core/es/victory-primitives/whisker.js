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
  var style = Helpers.evaluateStyle(props.style, props);
  var tabIndex = Helpers.evaluateProp(props.tabIndex, props);
  return _assign({}, props, {
    desc: desc,
    id: id,
    style: style,
    tabIndex: tabIndex
  });
};

var Whisker = function (props) {
  props = evaluateProps(props);
  var _props = props,
      groupComponent = _props.groupComponent,
      lineComponent = _props.lineComponent,
      events = _props.events,
      className = _props.className,
      majorWhisker = _props.majorWhisker,
      minorWhisker = _props.minorWhisker,
      transform = _props.transform,
      clipPath = _props.clipPath,
      role = _props.role,
      shapeRendering = _props.shapeRendering,
      style = _props.style,
      desc = _props.desc,
      tabIndex = _props.tabIndex;

  var baseProps = _objectSpread({}, events, {
    style: style,
    desc: desc,
    tabIndex: tabIndex,
    className: className,
    transform: transform,
    clipPath: clipPath,
    role: role,
    shapeRendering: shapeRendering
  });

  return React.cloneElement(groupComponent, {}, [React.cloneElement(lineComponent, _assign({
    key: "major-whisker"
  }, baseProps, majorWhisker)), React.cloneElement(lineComponent, _assign({
    key: "minor-whisker"
  }, baseProps, minorWhisker))]);
};

Whisker.propTypes = _objectSpread({}, CommonProps.primitiveProps, {
  groupComponent: PropTypes.element,
  lineComponent: PropTypes.element,
  majorWhisker: PropTypes.shape({
    x1: PropTypes.number,
    x2: PropTypes.number,
    y1: PropTypes.number,
    y2: PropTypes.number
  }),
  minorWhisker: PropTypes.shape({
    x1: PropTypes.number,
    x2: PropTypes.number,
    y1: PropTypes.number,
    y2: PropTypes.number
  })
});
Whisker.defaultProps = {
  groupComponent: React.createElement("g", null),
  lineComponent: React.createElement(Line, null),
  role: "presentation",
  shapeRendering: "auto"
};
export default Whisker;