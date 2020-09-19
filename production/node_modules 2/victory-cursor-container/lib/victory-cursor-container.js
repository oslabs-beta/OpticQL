"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.cursorContainerMixin = void 0;

var _isObject2 = _interopRequireDefault(require("lodash/isObject"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _victoryCore = require("victory-core");

var _cursorHelpers = _interopRequireDefault(require("./cursor-helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var cursorContainerMixin = function (base) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_base) {
    _inherits(VictoryCursorContainer, _base);

    function VictoryCursorContainer() {
      _classCallCheck(this, VictoryCursorContainer);

      return _possibleConstructorReturn(this, (VictoryCursorContainer.__proto__ || Object.getPrototypeOf(VictoryCursorContainer)).apply(this, arguments));
    }

    _createClass(VictoryCursorContainer, [{
      key: "getCursorPosition",
      value: function getCursorPosition(props) {
        var cursorValue = props.cursorValue,
            defaultCursorValue = props.defaultCursorValue,
            domain = props.domain,
            cursorDimension = props.cursorDimension;

        if (cursorValue) {
          return cursorValue;
        }

        if (typeof defaultCursorValue === "number") {
          return _defineProperty({
            x: (domain.x[0] + domain.x[1]) / 2,
            y: (domain.y[0] + domain.y[1]) / 2
          }, cursorDimension, defaultCursorValue);
        }

        return defaultCursorValue;
      }
    }, {
      key: "getCursorLabelOffset",
      value: function getCursorLabelOffset(props) {
        var cursorLabelOffset = props.cursorLabelOffset;

        if (typeof cursorLabelOffset === "number") {
          return {
            x: cursorLabelOffset,
            y: cursorLabelOffset
          };
        }

        return cursorLabelOffset;
      }
    }, {
      key: "getPadding",
      value: function getPadding(props) {
        if (props.padding === undefined) {
          var child = props.children.find(function (c) {
            return (0, _isObject2.default)(c.props) && c.props.padding !== undefined;
          });
          return _victoryCore.Helpers.getPadding(child.props);
        } else {
          return _victoryCore.Helpers.getPadding(props);
        }
      }
    }, {
      key: "getCursorElements",
      value: function getCursorElements(props) {
        // eslint-disable-line max-statements
        var scale = props.scale,
            cursorLabelComponent = props.cursorLabelComponent,
            cursorLabel = props.cursorLabel,
            cursorComponent = props.cursorComponent,
            width = props.width,
            height = props.height,
            name = props.name,
            horizontal = props.horizontal,
            theme = props.theme;

        var cursorDimension = _cursorHelpers.default.getDimension(props);

        var cursorValue = this.getCursorPosition(props);
        var cursorLabelOffset = this.getCursorLabelOffset(props);

        if (!cursorValue) {
          return [];
        }

        var newElements = [];
        var padding = this.getPadding(props);
        var cursorCoordinates = {
          x: horizontal ? scale.y(cursorValue.y) : scale.x(cursorValue.x),
          y: horizontal ? scale.x(cursorValue.x) : scale.y(cursorValue.y)
        };

        if (cursorLabel) {
          var labelProps = (0, _defaults2.default)({
            active: true
          }, cursorLabelComponent.props, {
            x: cursorCoordinates.x + cursorLabelOffset.x,
            y: cursorCoordinates.y + cursorLabelOffset.y,
            datum: cursorValue,
            active: true,
            key: "".concat(name, "-cursor-label")
          });

          if (_victoryCore.Helpers.isTooltip(cursorLabelComponent)) {
            var tooltipTheme = theme && theme.tooltip || {};
            labelProps = (0, _defaults2.default)({}, labelProps, tooltipTheme);
          }

          newElements.push(_react.default.cloneElement(cursorLabelComponent, (0, _defaults2.default)({}, labelProps, {
            text: _victoryCore.Helpers.evaluateProp(cursorLabel, labelProps)
          })));
        }

        var cursorStyle = (0, _assign2.default)({
          stroke: "black"
        }, cursorComponent.props.style);

        if (cursorDimension === "x" || cursorDimension === undefined) {
          newElements.push(_react.default.cloneElement(cursorComponent, {
            key: "".concat(name, "-x-cursor"),
            x1: cursorCoordinates.x,
            x2: cursorCoordinates.x,
            y1: padding.top,
            y2: height - padding.bottom,
            style: cursorStyle
          }));
        }

        if (cursorDimension === "y" || cursorDimension === undefined) {
          newElements.push(_react.default.cloneElement(cursorComponent, {
            key: "".concat(name, "-y-cursor"),
            x1: padding.left,
            x2: width - padding.right,
            y1: cursorCoordinates.y,
            y2: cursorCoordinates.y,
            style: cursorStyle
          }));
        }

        return newElements;
      } // Overrides method in VictoryContainer

    }, {
      key: "getChildren",
      value: function getChildren(props) {
        return _toConsumableArray(_react.default.Children.toArray(props.children)).concat(_toConsumableArray(this.getCursorElements(props)));
      }
    }]);

    return VictoryCursorContainer;
  }(base), Object.defineProperty(_class, "displayName", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: "VictoryCursorContainer"
  }), Object.defineProperty(_class, "propTypes", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: _objectSpread({}, _victoryCore.VictoryContainer.propTypes, {
      cursorDimension: _propTypes.default.oneOf(["x", "y"]),
      cursorLabel: _propTypes.default.func,
      cursorLabelComponent: _propTypes.default.element,
      cursorLabelOffset: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
        x: _propTypes.default.number,
        y: _propTypes.default.number
      })]),
      defaultCursorValue: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
        x: _propTypes.default.number,
        y: _propTypes.default.number
      })]),
      disable: _propTypes.default.bool,
      onCursorChange: _propTypes.default.func
    })
  }), Object.defineProperty(_class, "defaultProps", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: _objectSpread({}, _victoryCore.VictoryContainer.defaultProps, {
      cursorLabelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
      cursorLabelOffset: {
        x: 5,
        y: -10
      },
      cursorComponent: _react.default.createElement(_victoryCore.LineSegment, null)
    })
  }), Object.defineProperty(_class, "defaultEvents", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function (props) {
      return [{
        target: "parent",
        eventHandlers: {
          onMouseLeave: function (evt, targetProps) {
            return props.disable ? {} : _cursorHelpers.default.onMouseLeave(evt, targetProps);
          },
          onTouchCancel: function () {
            return [];
          },
          onMouseMove: function (evt, targetProps) {
            return props.disable ? {} : _cursorHelpers.default.onMouseMove(evt, targetProps);
          },
          onTouchMove: function (evt, targetProps) {
            return props.disable ? {} : _cursorHelpers.default.onMouseMove(evt, targetProps);
          }
        }
      }];
    }
  }), _temp;
};

exports.cursorContainerMixin = cursorContainerMixin;

var _default = cursorContainerMixin(_victoryCore.VictoryContainer);

exports.default = _default;