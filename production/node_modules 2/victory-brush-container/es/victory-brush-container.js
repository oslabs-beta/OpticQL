import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

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

import PropTypes from "prop-types";
import React from "react";
import { VictoryContainer, Selection, Rect } from "victory-core";
import BrushHelpers from "./brush-helpers";
import isEqual from "react-fast-compare";
export var brushContainerMixin = function (base) {
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
        return x[0] !== x[1] && y[0] !== y[1] ? React.cloneElement(brushComponent, {
          key: "".concat(name, "-brush"),
          width: Math.abs(x[1] - x[0]) || 1,
          height: Math.abs(y[1] - y[0]) || 1,
          x: Math.min(x[0], x[1]),
          y: Math.min(y[0], y[1]),
          cursor: cursor,
          style: _defaults({}, brushComponentStyle, brushStyle)
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
        var domainBox = BrushHelpers.getDomainBox(props, domain);
        var x1 = domainBox.x1,
            x2 = domainBox.x2,
            y1 = domainBox.y1,
            y2 = domainBox.y2;

        var _BrushHelpers$getHand = BrushHelpers.getHandles(props, domainBox),
            top = _BrushHelpers$getHand.top,
            bottom = _BrushHelpers$getHand.bottom,
            left = _BrushHelpers$getHand.left,
            right = _BrushHelpers$getHand.right;

        var width = Math.abs(x2 - x1) || 1;
        var height = Math.abs(y2 - y1) || 1;
        var handleComponentStyle = handleComponent.props && handleComponent.props.style || {};

        var style = _defaults({}, handleComponentStyle, handleStyle);

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
          top: top && _assign({
            x: top.x1,
            y: top.y1
          }, yProps),
          bottom: bottom && _assign({
            x: bottom.x1,
            y: bottom.y1
          }, yProps),
          left: left && _assign({
            y: left.y1,
            x: left.x1
          }, xProps),
          right: right && _assign({
            y: right.y1,
            x: right.x1
          }, xProps)
        };
        var handles = ["top", "bottom", "left", "right"].reduce(function (memo, curr) {
          memo = handleProps[curr] ? memo.concat(React.cloneElement(handleComponent, _assign({
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

        var brushDomain = _defaults({}, props.brushDomain, props.domain);

        var domain = isEqual(brushDomain, cachedBrushDomain) ? _defaults({}, currentDomain, brushDomain) : brushDomain;
        var coordinates = Selection.getDomainCoordinates(props, domain);
        var selectBox = this.getSelectBox(props, coordinates);
        return selectBox ? [selectBox, this.getHandles(props, domain)] : [];
      } // Overrides method in VictoryContainer

    }, {
      key: "getChildren",
      value: function getChildren(props) {
        return _toConsumableArray(React.Children.toArray(props.children)).concat(_toConsumableArray(this.getRect(props)));
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
    value: _objectSpread({}, VictoryContainer.propTypes, {
      allowDrag: PropTypes.bool,
      allowDraw: PropTypes.bool,
      allowResize: PropTypes.bool,
      brushComponent: PropTypes.element,
      brushDimension: PropTypes.oneOf(["x", "y"]),
      brushDomain: PropTypes.shape({
        x: PropTypes.array,
        y: PropTypes.array
      }),
      brushStyle: PropTypes.object,
      defaultBrushArea: PropTypes.oneOf(["all", "disable", "none", "move"]),
      disable: PropTypes.bool,
      handleComponent: PropTypes.element,
      handleStyle: PropTypes.object,
      handleWidth: PropTypes.number,
      onBrushCleared: PropTypes.func,
      onBrushDomainChange: PropTypes.func,
      onBrushDomainChangeEnd: PropTypes.func
    })
  }), Object.defineProperty(_class, "defaultProps", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: _objectSpread({}, VictoryContainer.defaultProps, {
      allowDrag: true,
      allowDraw: true,
      allowResize: true,
      brushComponent: React.createElement(Rect, null),
      brushStyle: {
        stroke: "transparent",
        fill: "black",
        fillOpacity: 0.1
      },
      handleComponent: React.createElement(Rect, null),
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
            return props.disable ? {} : BrushHelpers.onMouseDown(evt, targetProps);
          },
          onTouchStart: function (evt, targetProps) {
            return props.disable ? {} : BrushHelpers.onMouseDown(evt, targetProps);
          },
          onMouseMove: function (evt, targetProps) {
            return props.disable ? {} : BrushHelpers.onMouseMove(evt, targetProps);
          },
          onTouchMove: function (evt, targetProps) {
            return props.disable ? {} : BrushHelpers.onMouseMove(evt, targetProps);
          },
          onMouseUp: function (evt, targetProps) {
            return props.disable ? {} : BrushHelpers.onMouseUp(evt, targetProps);
          },
          onTouchEnd: function (evt, targetProps) {
            return props.disable ? {} : BrushHelpers.onMouseUp(evt, targetProps);
          },
          onMouseLeave: function (evt, targetProps) {
            return props.disable ? {} : BrushHelpers.onMouseLeave(evt, targetProps);
          },
          onTouchCancel: function (evt, targetProps) {
            return props.disable ? {} : BrushHelpers.onMouseLeave(evt, targetProps);
          }
        }
      }];
    }
  }), _temp;
};
export default brushContainerMixin(VictoryContainer);