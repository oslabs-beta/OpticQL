"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.brushContainerMixin = void 0;

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _victoryCore = require("victory-core");

var _brushHelpers = _interopRequireDefault(require("./brush-helpers"));

var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));

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

var brushContainerMixin = function (base) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_base) {
    _inherits(VictoryBrushContainer, _base);

    function VictoryBrushContainer() {
      _classCallCheck(this, VictoryBrushContainer);

      return _possibleConstructorReturn(this, (VictoryBrushContainer.__proto__ || Object.getPrototypeOf(VictoryBrushContainer)).apply(this, arguments));
    }

    _createClass(VictoryBrushContainer, [{
      key: "getSelectBox",
      value: function getSelectBox(props, coordinates) {
        var x = coordinates.x,
            y = coordinates.y;
        var brushStyle = props.brushStyle,
            brushComponent = props.brushComponent,
            name = props.name;
        var brushComponentStyle = brushComponent.props && brushComponent.props.style;
        var cursor = !props.allowDrag && !props.allowResize ? "auto" : "move";
        return x[0] !== x[1] && y[0] !== y[1] ? _react.default.cloneElement(brushComponent, {
          key: "".concat(name, "-brush"),
          width: Math.abs(x[1] - x[0]) || 1,
          height: Math.abs(y[1] - y[0]) || 1,
          x: Math.min(x[0], x[1]),
          y: Math.min(y[0], y[1]),
          cursor: cursor,
          style: (0, _defaults2.default)({}, brushComponentStyle, brushStyle)
        }) : null;
      }
    }, {
      key: "getCursorPointers",
      value: function getCursorPointers(props) {
        var cursors = {
          yProps: "ns-resize",
          xProps: "ew-resize"
        };

        if (!props.allowResize && props.allowDrag) {
          cursors.xProps = "move";
          cursors.yProps = "move";
        } else if (!props.allowResize && !props.allowDrag) {
          cursors.xProps = "auto";
          cursors.yProps = "auto";
        }

        return cursors;
      }
    }, {
      key: "getHandles",
      value: function getHandles(props, domain) {
        var handleWidth = props.handleWidth,
            handleStyle = props.handleStyle,
            handleComponent = props.handleComponent,
            name = props.name;

        var domainBox = _brushHelpers.default.getDomainBox(props, domain);

        var x1 = domainBox.x1,
            x2 = domainBox.x2,
            y1 = domainBox.y1,
            y2 = domainBox.y2;

        var _BrushHelpers$getHand = _brushHelpers.default.getHandles(props, domainBox),
            top = _BrushHelpers$getHand.top,
            bottom = _BrushHelpers$getHand.bottom,
            left = _BrushHelpers$getHand.left,
            right = _BrushHelpers$getHand.right;

        var width = Math.abs(x2 - x1) || 1;
        var height = Math.abs(y2 - y1) || 1;
        var handleComponentStyle = handleComponent.props && handleComponent.props.style || {};
        var style = (0, _defaults2.default)({}, handleComponentStyle, handleStyle);
        var cursors = this.getCursorPointers(props);
        var yProps = {
          style: style,
          width: width,
          height: handleWidth,
          cursor: cursors.yProps
        };
        var xProps = {
          style: style,
          width: handleWidth,
          height: height,
          cursor: cursors.xProps
        };
        var handleProps = {
          top: top && (0, _assign2.default)({
            x: top.x1,
            y: top.y1
          }, yProps),
          bottom: bottom && (0, _assign2.default)({
            x: bottom.x1,
            y: bottom.y1
          }, yProps),
          left: left && (0, _assign2.default)({
            y: left.y1,
            x: left.x1
          }, xProps),
          right: right && (0, _assign2.default)({
            y: right.y1,
            x: right.x1
          }, xProps)
        };
        var handles = ["top", "bottom", "left", "right"].reduce(function (memo, curr) {
          memo = handleProps[curr] ? memo.concat(_react.default.cloneElement(handleComponent, (0, _assign2.default)({
            key: "".concat(name, "-handle-").concat(curr)
          }, handleProps[curr]))) : memo;
          return memo;
        }, []);
        return handles.length ? handles : null;
      }
    }, {
      key: "getRect",
      value: function getRect(props) {
        var currentDomain = props.currentDomain,
            cachedBrushDomain = props.cachedBrushDomain;
        var brushDomain = (0, _defaults2.default)({}, props.brushDomain, props.domain);
        var domain = (0, _reactFastCompare.default)(brushDomain, cachedBrushDomain) ? (0, _defaults2.default)({}, currentDomain, brushDomain) : brushDomain;

        var coordinates = _victoryCore.Selection.getDomainCoordinates(props, domain);

        var selectBox = this.getSelectBox(props, coordinates);
        return selectBox ? [selectBox, this.getHandles(props, domain)] : [];
      } // Overrides method in VictoryContainer

    }, {
      key: "getChildren",
      value: function getChildren(props) {
        return _toConsumableArray(_react.default.Children.toArray(props.children)).concat(_toConsumableArray(this.getRect(props)));
      }
    }]);

    return VictoryBrushContainer;
  }(base), Object.defineProperty(_class, "displayName", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: "VictoryBrushContainer"
  }), Object.defineProperty(_class, "propTypes", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: _objectSpread({}, _victoryCore.VictoryContainer.propTypes, {
      allowDrag: _propTypes.default.bool,
      allowDraw: _propTypes.default.bool,
      allowResize: _propTypes.default.bool,
      brushComponent: _propTypes.default.element,
      brushDimension: _propTypes.default.oneOf(["x", "y"]),
      brushDomain: _propTypes.default.shape({
        x: _propTypes.default.array,
        y: _propTypes.default.array
      }),
      brushStyle: _propTypes.default.object,
      defaultBrushArea: _propTypes.default.oneOf(["all", "disable", "none", "move"]),
      disable: _propTypes.default.bool,
      handleComponent: _propTypes.default.element,
      handleStyle: _propTypes.default.object,
      handleWidth: _propTypes.default.number,
      onBrushCleared: _propTypes.default.func,
      onBrushDomainChange: _propTypes.default.func,
      onBrushDomainChangeEnd: _propTypes.default.func
    })
  }), Object.defineProperty(_class, "defaultProps", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: _objectSpread({}, _victoryCore.VictoryContainer.defaultProps, {
      allowDrag: true,
      allowDraw: true,
      allowResize: true,
      brushComponent: _react.default.createElement(_victoryCore.Rect, null),
      brushStyle: {
        stroke: "transparent",
        fill: "black",
        fillOpacity: 0.1
      },
      handleComponent: _react.default.createElement(_victoryCore.Rect, null),
      handleStyle: {
        stroke: "transparent",
        fill: "transparent"
      },
      handleWidth: 8,
      mouseMoveThreshold: 0
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
            return props.disable ? {} : _brushHelpers.default.onMouseDown(evt, targetProps);
          },
          onTouchStart: function (evt, targetProps) {
            return props.disable ? {} : _brushHelpers.default.onMouseDown(evt, targetProps);
          },
          onMouseMove: function (evt, targetProps) {
            return props.disable ? {} : _brushHelpers.default.onMouseMove(evt, targetProps);
          },
          onTouchMove: function (evt, targetProps) {
            return props.disable ? {} : _brushHelpers.default.onMouseMove(evt, targetProps);
          },
          onMouseUp: function (evt, targetProps) {
            return props.disable ? {} : _brushHelpers.default.onMouseUp(evt, targetProps);
          },
          onTouchEnd: function (evt, targetProps) {
            return props.disable ? {} : _brushHelpers.default.onMouseUp(evt, targetProps);
          },
          onMouseLeave: function (evt, targetProps) {
            return props.disable ? {} : _brushHelpers.default.onMouseLeave(evt, targetProps);
          },
          onTouchCancel: function (evt, targetProps) {
            return props.disable ? {} : _brushHelpers.default.onMouseLeave(evt, targetProps);
          }
        }
      }];
    }
  }), _temp;
};

exports.brushContainerMixin = brushContainerMixin;

var _default = brushContainerMixin(_victoryCore.VictoryContainer);

exports.default = _default;