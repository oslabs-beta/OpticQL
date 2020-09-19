"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.selectionContainerMixin = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _victoryCore = require("victory-core");

var _selectionHelpers = _interopRequireDefault(require("./selection-helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var selectionContainerMixin = function (base) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_base) {
    _inherits(VictorySelectionContainer, _base);

    function VictorySelectionContainer() {
      _classCallCheck(this, VictorySelectionContainer);

      return _possibleConstructorReturn(this, (VictorySelectionContainer.__proto__ || Object.getPrototypeOf(VictorySelectionContainer)).apply(this, arguments));
    }

    _createClass(VictorySelectionContainer, [{
      key: "getRect",
      value: function getRect(props) {
        var x1 = props.x1,
            x2 = props.x2,
            y1 = props.y1,
            y2 = props.y2,
            selectionStyle = props.selectionStyle,
            selectionComponent = props.selectionComponent,
            name = props.name;
        var width = Math.abs(x2 - x1) || 1;
        var height = Math.abs(y2 - y1) || 1;
        var x = Math.min(x1, x2);
        var y = Math.min(y1, y2);
        return y2 && x2 && x1 && y1 ? _react.default.cloneElement(selectionComponent, {
          key: "".concat(name, "-selection"),
          x: x,
          y: y,
          width: width,
          height: height,
          style: selectionStyle
        }) : null;
      } // Overrides method in VictoryContainer

    }, {
      key: "getChildren",
      value: function getChildren(props) {
        return _toConsumableArray(_react.default.Children.toArray(props.children)).concat([this.getRect(props)]);
      }
    }]);

    return VictorySelectionContainer;
  }(base), Object.defineProperty(_class, "displayName", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: "VictorySelectionContainer"
  }), Object.defineProperty(_class, "propTypes", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: _objectSpread({}, _victoryCore.VictoryContainer.propTypes, {
      activateSelectedData: _propTypes.default.bool,
      allowSelection: _propTypes.default.bool,
      disable: _propTypes.default.bool,
      onSelection: _propTypes.default.func,
      onSelectionCleared: _propTypes.default.func,
      selectionBlacklist: _propTypes.default.arrayOf(_propTypes.default.string),
      selectionComponent: _propTypes.default.element,
      selectionDimension: _propTypes.default.oneOf(["x", "y"]),
      selectionStyle: _propTypes.default.object
    })
  }), Object.defineProperty(_class, "defaultProps", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: _objectSpread({}, _victoryCore.VictoryContainer.defaultProps, {
      activateSelectedData: true,
      allowSelection: true,
      selectionComponent: _react.default.createElement(_victoryCore.Rect, null),
      selectionStyle: {
        stroke: "transparent",
        fill: "black",
        fillOpacity: 0.1
      }
    })
  }), Object.defineProperty(_class, "defaultEvents", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function (props) {
      return [{
        target: "parent",
        eventHandlers: {
          onMouseDown: function (evt, targetProps) {
            return props.disable ? {} : _selectionHelpers.default.onMouseDown(evt, targetProps);
          },
          onTouchStart: function (evt, targetProps) {
            return props.disable ? {} : _selectionHelpers.default.onMouseDown(evt, targetProps);
          },
          onMouseMove: function (evt, targetProps) {
            return props.disable ? {} : _selectionHelpers.default.onMouseMove(evt, targetProps);
          },
          onTouchMove: function (evt, targetProps) {
            return props.disable ? {} : _selectionHelpers.default.onMouseMove(evt, targetProps);
          },
          onMouseUp: function (evt, targetProps) {
            return props.disable ? {} : _selectionHelpers.default.onMouseUp(evt, targetProps);
          },
          onTouchEnd: function (evt, targetProps) {
            return props.disable ? {} : _selectionHelpers.default.onMouseUp(evt, targetProps);
          }
        }
      }];
    }
  }), _temp;
};

exports.selectionContainerMixin = selectionContainerMixin;

var _default = selectionContainerMixin(_victoryCore.VictoryContainer);

exports.default = _default;