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

var _line = _interopRequireDefault(require("./line"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

  var style = _helpers.default.evaluateStyle(props.style, props);

  var tabIndex = _helpers.default.evaluateProp(props.tabIndex, props);

  return (0, _assign2.default)({}, props, {
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

  return _react.default.cloneElement(groupComponent, {}, [_react.default.cloneElement(lineComponent, (0, _assign2.default)({
    key: "major-whisker"
  }, baseProps, majorWhisker)), _react.default.cloneElement(lineComponent, (0, _assign2.default)({
    key: "minor-whisker"
  }, baseProps, minorWhisker))]);
};

Whisker.propTypes = _objectSpread({}, _commonProps.default.primitiveProps, {
  groupComponent: _propTypes.default.element,
  lineComponent: _propTypes.default.element,
  majorWhisker: _propTypes.default.shape({
    x1: _propTypes.default.number,
    x2: _propTypes.default.number,
    y1: _propTypes.default.number,
    y2: _propTypes.default.number
  }),
  minorWhisker: _propTypes.default.shape({
    x1: _propTypes.default.number,
    x2: _propTypes.default.number,
    y1: _propTypes.default.number,
    y2: _propTypes.default.number
  })
});
Whisker.defaultProps = {
  groupComponent: _react.default.createElement("g", null),
  lineComponent: _react.default.createElement(_line.default, null),
  role: "presentation",
  shapeRendering: "auto"
};
var _default = Whisker;
exports.default = _default;