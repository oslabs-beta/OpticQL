import _assign from "lodash/assign";
import _isPlainObject from "lodash/isPlainObject";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*eslint no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2] }]*/
import React from "react";
import PropTypes from "prop-types";
import { Helpers, CommonProps, Path } from "victory-core";

var getVerticalPath = function (props) {
  var pointerWidth = props.pointerWidth,
      cornerRadius = props.cornerRadius,
      orientation = props.orientation,
      width = props.width,
      height = props.height,
      center = props.center;
  var sign = orientation === "bottom" ? 1 : -1;
  var x = props.x + (props.dx || 0);
  var y = props.y + (props.dy || 0);
  var centerX = _isPlainObject(center) && center.x;
  var centerY = _isPlainObject(center) && center.y;
  var pointerEdge = centerY + sign * (height / 2);
  var oppositeEdge = centerY - sign * (height / 2);
  var rightEdge = centerX + width / 2;
  var leftEdge = centerX - width / 2;
  var pointerLength = sign * (y - pointerEdge) < 0 ? 0 : props.pointerLength;
  var direction = orientation === "bottom" ? "0 0 0" : "0 0 1";
  var arc = "".concat(cornerRadius, " ").concat(cornerRadius, " ").concat(direction);
  return "M ".concat(centerX - pointerWidth / 2, ", ").concat(pointerEdge, "\n    L ").concat(pointerLength ? x : centerX + pointerWidth / 2, ", ").concat(pointerLength ? y : pointerEdge, "\n    L ").concat(centerX + pointerWidth / 2, ", ").concat(pointerEdge, "\n    L ").concat(rightEdge - cornerRadius, ", ").concat(pointerEdge, "\n    A ").concat(arc, " ").concat(rightEdge, ", ").concat(pointerEdge - sign * cornerRadius, "\n    L ").concat(rightEdge, ", ").concat(oppositeEdge + sign * cornerRadius, "\n    A ").concat(arc, " ").concat(rightEdge - cornerRadius, ", ").concat(oppositeEdge, "\n    L ").concat(leftEdge + cornerRadius, ", ").concat(oppositeEdge, "\n    A ").concat(arc, " ").concat(leftEdge, ", ").concat(oppositeEdge + sign * cornerRadius, "\n    L ").concat(leftEdge, ", ").concat(pointerEdge - sign * cornerRadius, "\n    A ").concat(arc, " ").concat(leftEdge + cornerRadius, ", ").concat(pointerEdge, "\n    z");
};

var getHorizontalPath = function (props) {
  var pointerWidth = props.pointerWidth,
      cornerRadius = props.cornerRadius,
      orientation = props.orientation,
      width = props.width,
      height = props.height,
      center = props.center;
  var sign = orientation === "left" ? 1 : -1;
  var x = props.x + (props.dx || 0);
  var y = props.y + (props.dy || 0);
  var centerX = _isPlainObject(center) && center.x;
  var centerY = _isPlainObject(center) && center.y;
  var pointerEdge = centerX - sign * (width / 2);
  var oppositeEdge = centerX + sign * (width / 2);
  var bottomEdge = centerY + height / 2;
  var topEdge = centerY - height / 2;
  var pointerLength = sign * (x - pointerEdge) > 0 ? 0 : props.pointerLength;
  var direction = orientation === "left" ? "0 0 0" : "0 0 1";
  var arc = "".concat(cornerRadius, " ").concat(cornerRadius, " ").concat(direction);
  return "M ".concat(pointerEdge, ", ").concat(centerY - pointerWidth / 2, "\n    L ").concat(pointerLength ? x : pointerEdge, ", ").concat(pointerLength ? y : centerY + pointerWidth / 2, "\n    L ").concat(pointerEdge, ", ").concat(centerY + pointerWidth / 2, "\n    L ").concat(pointerEdge, ", ").concat(bottomEdge - cornerRadius, "\n    A ").concat(arc, " ").concat(pointerEdge + sign * cornerRadius, ", ").concat(bottomEdge, "\n    L ").concat(oppositeEdge - sign * cornerRadius, ", ").concat(bottomEdge, "\n    A ").concat(arc, " ").concat(oppositeEdge, ", ").concat(bottomEdge - cornerRadius, "\n    L ").concat(oppositeEdge, ", ").concat(topEdge + cornerRadius, "\n    A ").concat(arc, " ").concat(oppositeEdge - sign * cornerRadius, ", ").concat(topEdge, "\n    L ").concat(pointerEdge + sign * cornerRadius, ", ").concat(topEdge, "\n    A ").concat(arc, " ").concat(pointerEdge, ", ").concat(topEdge + cornerRadius, "\n    z");
};

var getFlyoutPath = function (props) {
  var orientation = props.orientation || "top";
  return orientation === "left" || orientation === "right" ? getHorizontalPath(props) : getVerticalPath(props);
};

var evaluateProps = function (props) {
  /**
   * Potential evaluated props are:
   * `id`
   * `style`
   */
  var id = Helpers.evaluateProp(props.id, props);
  var style = Helpers.evaluateStyle(props.style, props);
  return _assign({}, props, {
    id: id,
    style: style
  });
};

var Flyout = function (props) {
  props = evaluateProps(props);
  return React.cloneElement(props.pathComponent, _objectSpread({}, props.events, {
    style: props.style,
    d: getFlyoutPath(props),
    className: props.className,
    shapeRendering: props.shapeRendering,
    role: props.role,
    transform: props.transform,
    clipPath: props.clipPath
  }));
};

Flyout.propTypes = _objectSpread({}, CommonProps.primitiveProps, {
  center: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  cornerRadius: PropTypes.number,
  datum: PropTypes.object,
  dx: PropTypes.number,
  dy: PropTypes.number,
  height: PropTypes.number,
  orientation: PropTypes.oneOf(["top", "bottom", "left", "right"]),
  pathComponent: PropTypes.element,
  pointerLength: PropTypes.number,
  pointerWidth: PropTypes.number,
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
});
Flyout.defaultProps = {
  pathComponent: React.createElement(Path, null),
  role: "presentation",
  shapeRendering: "auto"
};
export default Flyout;