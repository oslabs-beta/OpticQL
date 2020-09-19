"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _uniqueId2 = _interopRequireDefault(require("lodash/uniqueId"));

var _isObject2 = _interopRequireDefault(require("lodash/isObject"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = _interopRequireDefault(require("../victory-util/prop-types"));

var _helpers = _interopRequireDefault(require("../victory-util/helpers"));

var _clipPath = _interopRequireDefault(require("../victory-primitives/clip-path"));

var _circle = _interopRequireDefault(require("../victory-primitives/circle"));

var _rect = _interopRequireDefault(require("../victory-primitives/rect"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VictoryClipContainer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryClipContainer, _React$Component);

  function VictoryClipContainer(props) {
    var _this;

    _classCallCheck(this, VictoryClipContainer);

    _this = _possibleConstructorReturn(this, (VictoryClipContainer.__proto__ || Object.getPrototypeOf(VictoryClipContainer)).call(this, props));
    _this.clipId = !(0, _isObject2.default)(props) || props.clipId === undefined ? (0, _uniqueId2.default)("victory-clip-") : props.clipId;
    return _this;
  }

  _createClass(VictoryClipContainer, [{
    key: "calculateAttributes",
    value: function calculateAttributes(props) {
      var polar = props.polar,
          origin = props.origin,
          _props$clipWidth = props.clipWidth,
          clipWidth = _props$clipWidth === void 0 ? 0 : _props$clipWidth,
          _props$clipHeight = props.clipHeight,
          clipHeight = _props$clipHeight === void 0 ? 0 : _props$clipHeight,
          _props$translateX = props.translateX,
          translateX = _props$translateX === void 0 ? 0 : _props$translateX,
          _props$translateY = props.translateY,
          translateY = _props$translateY === void 0 ? 0 : _props$translateY;

      var clipPadding = _helpers.default.getPadding({
        padding: props.clipPadding
      });

      var radius = props.radius || _helpers.default.getRadius(props);

      return {
        x: (polar ? origin.x : translateX) - clipPadding.left,
        y: (polar ? origin.y : translateY) - clipPadding.top,
        width: Math.max((polar ? radius : clipWidth) + clipPadding.left + clipPadding.right, 0),
        height: Math.max((polar ? radius : clipHeight) + clipPadding.top + clipPadding.bottom, 0)
      };
    }
  }, {
    key: "renderClippedGroup",
    value: function renderClippedGroup(props, clipId) {
      var style = props.style,
          events = props.events,
          transform = props.transform,
          children = props.children,
          className = props.className,
          groupComponent = props.groupComponent;
      var clipComponent = this.renderClipComponent(props, clipId);
      var groupProps = (0, _assign2.default)({
        className: className,
        style: style,
        transform: transform,
        key: "clipped-group-".concat(clipId),
        clipPath: "url(#".concat(clipId, ")")
      }, events);
      return _react.default.cloneElement(groupComponent, groupProps, [clipComponent].concat(_toConsumableArray(_react.default.Children.toArray(children))));
    }
  }, {
    key: "renderGroup",
    value: function renderGroup(props) {
      var style = props.style,
          events = props.events,
          transform = props.transform,
          children = props.children,
          className = props.className,
          groupComponent = props.groupComponent;
      return _react.default.cloneElement(groupComponent, (0, _assign2.default)({
        className: className,
        style: style,
        transform: transform
      }, events), children);
    }
  }, {
    key: "renderClipComponent",
    value: function renderClipComponent(props, clipId) {
      var polar = props.polar,
          origin = props.origin,
          _props$clipWidth2 = props.clipWidth,
          clipWidth = _props$clipWidth2 === void 0 ? 0 : _props$clipWidth2,
          _props$clipHeight2 = props.clipHeight,
          clipHeight = _props$clipHeight2 === void 0 ? 0 : _props$clipHeight2,
          _props$translateX2 = props.translateX,
          translateX = _props$translateX2 === void 0 ? 0 : _props$translateX2,
          _props$translateY2 = props.translateY,
          translateY = _props$translateY2 === void 0 ? 0 : _props$translateY2,
          circleComponent = props.circleComponent,
          rectComponent = props.rectComponent,
          clipPathComponent = props.clipPathComponent;

      var _Helpers$getPadding = _helpers.default.getPadding({
        padding: props.clipPadding
      }),
          top = _Helpers$getPadding.top,
          bottom = _Helpers$getPadding.bottom,
          left = _Helpers$getPadding.left,
          right = _Helpers$getPadding.right;

      var child;

      if (polar) {
        var radius = props.radius || _helpers.default.getRadius(props);

        var circleProps = {
          r: Math.max(radius + left + right, radius + top + bottom, 0),
          cx: origin.x - left,
          cy: origin.y - top
        };
        child = _react.default.cloneElement(circleComponent, circleProps);
      } else {
        var rectProps = {
          x: translateX - left,
          y: translateY - top,
          width: Math.max(clipWidth + left + right, 0),
          height: Math.max(clipHeight + top + bottom, 0)
        };
        child = _react.default.cloneElement(rectComponent, rectProps);
      }

      return _react.default.cloneElement(clipPathComponent, (0, _assign2.default)({
        key: "clip-path-".concat(clipId)
      }, props, {
        clipId: clipId
      }), child);
    }
  }, {
    key: "getClipValue",
    value: function getClipValue(props, axis) {
      var clipValues = {
        x: props.clipWidth,
        y: props.clipHeight
      };

      if (clipValues[axis] !== undefined) {
        return clipValues[axis];
      }

      var range = _helpers.default.getRange(props, axis);

      return range ? Math.abs(range[0] - range[1]) || undefined : undefined;
    }
  }, {
    key: "getTranslateValue",
    value: function getTranslateValue(props, axis) {
      var translateValues = {
        x: props.translateX,
        y: props.translateY
      };

      if (translateValues[axis] !== undefined) {
        return translateValues[axis];
      }

      var range = _helpers.default.getRange(props, axis);

      return range ? Math.min.apply(Math, _toConsumableArray(range)) : undefined;
    }
  }, {
    key: "render",
    value: function render() {
      var clipHeight = this.getClipValue(this.props, "y");
      var clipWidth = this.getClipValue(this.props, "x");

      if (clipWidth === undefined || clipHeight === undefined) {
        return this.renderGroup(this.props);
      }

      var translateX = this.getTranslateValue(this.props, "x");
      var translateY = this.getTranslateValue(this.props, "y");
      var clipProps = (0, _defaults2.default)({}, this.props, {
        clipHeight: clipHeight,
        clipWidth: clipWidth,
        translateX: translateX,
        translateY: translateY
      });
      return this.renderClippedGroup(clipProps, this.clipId);
    }
  }]);

  return VictoryClipContainer;
}(_react.default.Component);

exports.default = VictoryClipContainer;
Object.defineProperty(VictoryClipContainer, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryClipContainer"
});
Object.defineProperty(VictoryClipContainer, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "container"
});
Object.defineProperty(VictoryClipContainer, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.node), _propTypes.default.node]),
    circleComponent: _propTypes.default.element,
    className: _propTypes.default.string,
    clipHeight: _propTypes2.default.nonNegative,
    clipId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
    clipPadding: _propTypes.default.shape({
      top: _propTypes.default.number,
      bottom: _propTypes.default.number,
      left: _propTypes.default.number,
      right: _propTypes.default.number
    }),
    clipPathComponent: _propTypes.default.element,
    clipWidth: _propTypes2.default.nonNegative,
    events: _propTypes.default.object,
    groupComponent: _propTypes.default.element,
    origin: _propTypes.default.shape({
      x: _propTypes2.default.nonNegative,
      y: _propTypes2.default.nonNegative
    }),
    polar: _propTypes.default.bool,
    radius: _propTypes2.default.nonNegative,
    style: _propTypes.default.object,
    transform: _propTypes.default.string,
    translateX: _propTypes.default.number,
    translateY: _propTypes.default.number
  }
});
Object.defineProperty(VictoryClipContainer, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    circleComponent: _react.default.createElement(_circle.default, null),
    rectComponent: _react.default.createElement(_rect.default, null),
    clipPathComponent: _react.default.createElement(_clipPath.default, null),
    groupComponent: _react.default.createElement("g", null)
  }
});