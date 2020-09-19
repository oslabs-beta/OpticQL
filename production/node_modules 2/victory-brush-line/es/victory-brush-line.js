import _pick from "lodash/pick";
import _isFunction from "lodash/isFunction";
import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import React from "react";
import PropTypes from "prop-types";
import { Selection, Helpers, Collection, LineSegment, Scale, Domain, Box } from "victory-core";
import isEqual from "react-fast-compare";
var SMALL_NUMBER = 1 / Number.MAX_SAFE_INTEGER;

var getScale = function (props) {
  var _props$scale = props.scale,
      scale = _props$scale === void 0 ? {} : _props$scale,
      _props$dimension = props.dimension,
      dimension = _props$dimension === void 0 ? "x" : _props$dimension;

  if (scale[dimension]) {
    return scale[dimension];
  }

  var fallbackScale = Scale.getBaseScale(props, dimension);
  var range = Helpers.getRange(props, dimension);
  var domain = Domain.getDomainFromProps(props, dimension) || [0, 1];
  fallbackScale.range(range).domain(domain);
  return fallbackScale;
};

var getDimension = function (props) {
  var horizontal = props.horizontal,
      _props$dimension2 = props.dimension,
      dimension = _props$dimension2 === void 0 ? "x" : _props$dimension2;

  if (!horizontal) {
    return dimension;
  }

  return dimension === "x" ? "y" : "x";
};

var toRange = function (props, domain) {
  var scale = getScale(props);
  return [scale(Math.min.apply(Math, _toConsumableArray(domain))), scale(Math.max.apply(Math, _toConsumableArray(domain)))];
};

var toDomain = function (props, range) {
  var scale = getScale(props);
  return [scale.invert(Math.min.apply(Math, _toConsumableArray(range))), scale.invert(Math.max.apply(Math, _toConsumableArray(range)))];
};

var getFullRange = function (props) {
  var scale = getScale(props);
  return scale.range();
};

var getFullDomain = function (props) {
  var scale = getScale(props);
  return scale.domain();
};

var withinBound = function (value, bound) {
  return value >= Collection.getMinValue(bound) && value <= Collection.getMaxValue(bound);
};

var getBrushDomain = function (brushDomain, fullDomain) {
  if (brushDomain) {
    var brushMin = Collection.getMinValue(brushDomain);
    var brushMax = Collection.getMaxValue(brushDomain);
    var domainMin = Collection.getMinValue(fullDomain);
    var domainMax = Collection.getMaxValue(fullDomain);
    var defaultMin = brushMin < domainMin ? domainMin : domainMax - SMALL_NUMBER;
    var defaultMax = brushMax > domainMax ? domainMax : domainMin + SMALL_NUMBER;
    var min = withinBound(brushMin, fullDomain) ? brushMin : defaultMin;
    var max = withinBound(brushMax, fullDomain) ? brushMax : defaultMax;
    return [min, max];
  }

  return fullDomain;
};

var getActiveHandle = function (props, position, range) {
  var width = props.handleWidth / 2;
  var dimension = getDimension(props);

  var getHandle = function (type) {
    var base = {
      min: dimension === "x" ? Math.min.apply(Math, _toConsumableArray(range)) : Math.max.apply(Math, _toConsumableArray(range)),
      max: dimension === "x" ? Math.max.apply(Math, _toConsumableArray(range)) : Math.min.apply(Math, _toConsumableArray(range))
    };
    return [base[type] - width, base[type] + width];
  };

  var active = ["min", "max"].reduce(function (memo, type) {
    memo[type] = withinBound(position, getHandle(type)) ? type : undefined;
    return memo;
  }, {});
  return active.min && active.max ? "both" : active.min || active.max;
};

var getMinimumDomain = function () {
  return [0, SMALL_NUMBER];
};

var panBox = function (props, position) {
  var brushDomain = props.brushDomain,
      startPosition = props.startPosition;
  var range = toRange(props, brushDomain);
  var fullRange = getFullRange(props);
  var size = Math.abs(range[1] - range[0]);
  var globalMin = Math.min.apply(Math, _toConsumableArray(fullRange));
  var globalMax = Math.max.apply(Math, _toConsumableArray(fullRange));
  var delta = startPosition ? startPosition - position : 0;
  var min = Math.min.apply(Math, _toConsumableArray(range)) - delta;
  var max = Math.max.apply(Math, _toConsumableArray(range)) - delta;
  var constrainedMin = min > globalMax - size ? globalMax - size : Math.max(min, globalMin);
  var constrainedMax = max < globalMin + size ? globalMin + size : Math.min(max, globalMax);
  return [constrainedMin, constrainedMax];
};

var fallbackProps = {
  brushAreaStyle: {
    stroke: "none",
    fill: "black",
    opacity: function (_ref) {
      var active = _ref.active;
      return active ? 0.2 : 0.1;
    } // eslint-disable-line no-magic-numbers

  },
  brushStyle: {
    pointerEvents: "none",
    stroke: "none",
    fill: "black",
    opacity: function (_ref2) {
      var active = _ref2.active;
      return active ? 0.4 : 0.3;
    } // eslint-disable-line no-magic-numbers

  },
  handleStyle: {
    pointerEvents: "none",
    stroke: "none",
    fill: "none"
  }
};

var VictoryBrushLine =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryBrushLine, _React$Component);

  function VictoryBrushLine() {
    _classCallCheck(this, VictoryBrushLine);

    return _possibleConstructorReturn(this, (VictoryBrushLine.__proto__ || Object.getPrototypeOf(VictoryBrushLine)).apply(this, arguments));
  }

  _createClass(VictoryBrushLine, [{
    key: "getRectDimensions",
    value: function getRectDimensions(props, brushWidth, domain) {
      var brushDomain = props.brushDomain;
      var dimension = getDimension(props);
      domain = domain || getBrushDomain(brushDomain, getFullDomain(props));
      var range = toRange(props, domain);
      var coordinates = dimension === "x" ? {
        y1: props.y1,
        y2: props.y2,
        x1: Math.min.apply(Math, _toConsumableArray(range)),
        x2: Math.max.apply(Math, _toConsumableArray(range))
      } : {
        x1: props.x1,
        x2: props.x2,
        y1: Math.min.apply(Math, _toConsumableArray(range)),
        y2: Math.max.apply(Math, _toConsumableArray(range))
      };
      var x1 = coordinates.x1,
          x2 = coordinates.x2,
          y1 = coordinates.y1,
          y2 = coordinates.y2;
      var offset = {
        x: dimension === "x" ? 0 : brushWidth / 2,
        y: dimension === "y" ? 0 : brushWidth / 2
      };
      var x = Math.min(x1, x2) - offset.x;
      var y = Math.min(y1, y2) - offset.y;
      var width = Math.max(x1, x2) + offset.x - x;
      var height = Math.max(y1, y2) + offset.y - y;
      return {
        x: x,
        y: y,
        width: width,
        height: height
      };
    }
  }, {
    key: "getHandleDimensions",
    value: function getHandleDimensions(props) {
      var handleWidth = props.handleWidth,
          x1 = props.x1,
          x2 = props.x2,
          y1 = props.y1,
          y2 = props.y2,
          brushDomain = props.brushDomain;
      var dimension = getDimension(props);
      var brushWidth = props.brushWidth || props.width;
      var domain = getBrushDomain(brushDomain, getFullDomain(props));
      var range = toRange(props, domain);
      var defaultX = Math.min(x1, x2) - brushWidth / 2;
      var defaultY = Math.min(y1, y2) - brushWidth / 2;
      var x = {
        min: dimension === "x" ? Math.min.apply(Math, _toConsumableArray(range)) - handleWidth / 2 : defaultX,
        max: dimension === "x" ? Math.max.apply(Math, _toConsumableArray(range)) - handleWidth / 2 : defaultX
      };
      var y = {
        min: dimension === "y" ? Math.max.apply(Math, _toConsumableArray(range)) - handleWidth / 2 : defaultY,
        max: dimension === "y" ? Math.min.apply(Math, _toConsumableArray(range)) - handleWidth / 2 : defaultY
      };
      var width = dimension === "x" ? handleWidth : brushWidth;
      var height = dimension === "x" ? brushWidth : handleWidth;
      return {
        min: {
          x: x.min,
          y: y.min,
          width: width,
          height: height
        },
        max: {
          x: x.max,
          y: y.max,
          width: width,
          height: height
        }
      };
    }
  }, {
    key: "getCursor",
    value: function getCursor(props) {
      var _props$activeBrushes = props.activeBrushes,
          activeBrushes = _props$activeBrushes === void 0 ? {} : _props$activeBrushes;
      var dimension = getDimension(props);

      if (activeBrushes.minHandle || activeBrushes.maxHandle) {
        return dimension === "x" ? "ew-resize" : "ns-resize";
      } else if (activeBrushes.brush) {
        return "move";
      }

      return "crosshair";
    }
  }, {
    key: "renderHandles",
    value: function renderHandles(props) {
      var handleComponent = props.handleComponent,
          handleStyle = props.handleStyle,
          id = props.id,
          brushDomain = props.brushDomain,
          _props$datum = props.datum,
          datum = _props$datum === void 0 ? {} : _props$datum,
          _props$activeBrushes2 = props.activeBrushes,
          activeBrushes = _props$activeBrushes2 === void 0 ? {} : _props$activeBrushes2;

      if (!brushDomain) {
        return null;
      }

      var handleDimensions = this.getHandleDimensions(props);

      var style = _assign({}, fallbackProps.handleStyle, handleStyle);

      var minDatum = _assign({
        handleValue: Collection.getMinValue(brushDomain)
      }, datum);

      var maxDatum = _assign({
        handleValue: Collection.getMaxValue(brushDomain)
      }, datum);

      var minHandleProps = _assign({
        key: "".concat(id, "-min"),
        style: Helpers.evaluateStyle(style, {
          datum: minDatum,
          active: activeBrushes.minHandle
        })
      }, handleDimensions.min);

      var maxHandleProps = _assign({
        key: "".concat(id, "-max"),
        style: Helpers.evaluateStyle(style, {
          datum: maxDatum,
          active: activeBrushes.maxHandle
        })
      }, handleDimensions.max);

      return [React.cloneElement(handleComponent, minHandleProps), React.cloneElement(handleComponent, maxHandleProps)];
    }
  }, {
    key: "renderBrush",
    value: function renderBrush(props) {
      var brushComponent = props.brushComponent,
          brushStyle = props.brushStyle,
          _props$activeBrushes3 = props.activeBrushes,
          activeBrushes = _props$activeBrushes3 === void 0 ? {} : _props$activeBrushes3,
          _props$datum2 = props.datum,
          datum = _props$datum2 === void 0 ? {} : _props$datum2,
          brushDomain = props.brushDomain;

      if (!brushDomain) {
        return null;
      }

      var brushWidth = props.brushWidth || props.width;
      var rectDimensions = this.getRectDimensions(props, brushWidth);

      var baseStyle = _assign({}, fallbackProps.brushStyle, brushStyle);

      var style = Helpers.evaluateStyle(baseStyle, {
        datum: datum,
        active: activeBrushes.brush
      });

      var brushProps = _assign({
        style: style
      }, rectDimensions);

      return React.cloneElement(brushComponent, brushProps);
    }
  }, {
    key: "renderBrushArea",
    value: function renderBrushArea(props) {
      var brushAreaComponent = props.brushAreaComponent,
          brushAreaStyle = props.brushAreaStyle,
          _props$activeBrushes4 = props.activeBrushes,
          activeBrushes = _props$activeBrushes4 === void 0 ? {} : _props$activeBrushes4,
          _props$datum3 = props.datum,
          datum = _props$datum3 === void 0 ? {} : _props$datum3;
      var brushAreaWidth = props.brushAreaWidth || props.width;
      var cursor = this.getCursor(props);
      var rectDimensions = this.getRectDimensions(props, brushAreaWidth, getFullDomain(props));

      var baseStyle = _assign({
        cursor: cursor
      }, fallbackProps.brushAreaStyle, brushAreaStyle);

      var style = Helpers.evaluateStyle(baseStyle, {
        datum: datum,
        active: activeBrushes.brushArea
      });

      var brushAreaProps = _assign({
        style: style
      }, rectDimensions);

      return React.cloneElement(brushAreaComponent, brushAreaProps);
    }
  }, {
    key: "renderLine",
    value: function renderLine(props) {
      var filteredProps = _pick(props, ["x1", "x2", "y1", "y2", "datum", "scale", "active", "style"]);

      return React.cloneElement(props.lineComponent, filteredProps);
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("g", this.props.events, this.renderLine(this.props), this.renderBrushArea(this.props), this.renderBrush(this.props), this.renderHandles(this.props));
    }
  }]);

  return VictoryBrushLine;
}(React.Component);

Object.defineProperty(VictoryBrushLine, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    allowDrag: PropTypes.bool,
    allowDraw: PropTypes.bool,
    allowResize: PropTypes.bool,
    brushAreaComponent: PropTypes.element,
    brushAreaStyle: PropTypes.object,
    brushAreaWidth: PropTypes.number,
    brushComponent: PropTypes.element,
    brushDimension: PropTypes.oneOf(["x", "y"]),
    brushDomain: PropTypes.array,
    brushStyle: PropTypes.object,
    brushWidth: PropTypes.number,
    className: PropTypes.string,
    dimension: PropTypes.oneOf(["x", "y"]),
    disable: PropTypes.bool,
    events: PropTypes.object,
    groupComponent: PropTypes.element,
    handleComponent: PropTypes.element,
    handleStyle: PropTypes.object,
    handleWidth: PropTypes.number,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    lineComponent: PropTypes.element,
    name: PropTypes.string,
    onBrushDomainChange: PropTypes.func,
    scale: PropTypes.object,
    style: PropTypes.object,
    type: PropTypes.string,
    width: PropTypes.number
  }
});
Object.defineProperty(VictoryBrushLine, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    allowDrag: true,
    allowDraw: true,
    allowResize: true,
    brushAreaComponent: React.createElement(Box, null),
    brushComponent: React.createElement(Box, null),
    groupComponent: React.createElement("g", null),
    handleComponent: React.createElement(Box, null),
    handleWidth: 10,
    lineComponent: React.createElement(LineSegment, null),
    width: 10
  }
});
Object.defineProperty(VictoryBrushLine, "defaultEvents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return props.disable ? undefined : [{
      target: props.type,
      eventHandlers: {
        onMouseEnter: function (evt, targetProps) {
          evt.preventDefault();
          var allowResize = targetProps.allowResize,
              brushDomain = targetProps.brushDomain;
          var dimension = getDimension(targetProps);
          var parentSVG = targetProps.parentSVG || Selection.getParentSVG(evt);
          var position = Selection.getSVGEventCoordinates(evt, parentSVG)[dimension];
          var fullDomain = getFullDomain(targetProps);
          var currentDomain = getBrushDomain(brushDomain, fullDomain);
          var range = toRange(targetProps, currentDomain);
          var activeHandle = allowResize && getActiveHandle(targetProps, position, range);
          var activeBrushes = {
            brushArea: !targetProps.brushDomain,
            brush: withinBound(position, range) && !isEqual(fullDomain, currentDomain),
            minHandle: activeHandle === "min" || activeHandle === "both",
            maxHandle: activeHandle === "min" || activeHandle === "both"
          };
          return [{
            mutation: function () {
              return {
                activeBrushes: activeBrushes,
                brushDomain: targetProps.brushDomain,
                parentSVG: parentSVG
              };
            }
          }];
        },
        onMouseDown: function (evt, targetProps) {
          evt.preventDefault();
          var allowResize = targetProps.allowResize,
              allowDrag = targetProps.allowDrag,
              allowDraw = targetProps.allowDraw,
              activeBrushes = targetProps.activeBrushes,
              brushDomain = targetProps.brushDomain;
          var dimension = getDimension(targetProps); // Don't trigger events for static brushes

          if (!allowResize && !allowDrag) {
            return [];
          }

          var fullDomain = getFullDomain(targetProps);
          var currentDomain = getBrushDomain(brushDomain, fullDomain);
          var parentSVG = targetProps.parentSVG || Selection.getParentSVG(evt);
          var position = Selection.getSVGEventCoordinates(evt, parentSVG)[dimension];
          var range = toRange(targetProps, currentDomain);
          var activeHandle = allowResize && getActiveHandle(targetProps, position, range); // If the event occurs in any of the handle regions, start a resize

          if (activeHandle) {
            return [{
              mutation: function () {
                return {
                  parentSVG: parentSVG,
                  isSelecting: true,
                  activeHandle: activeHandle,
                  brushDomain: currentDomain,
                  startPosition: position,
                  activeBrushes: activeBrushes
                };
              }
            }];
          } else if (withinBound(position, range) && !isEqual(fullDomain, currentDomain)) {
            // if the event occurs within a selected region start a panning event, unless the whole
            // domain is selected
            return [{
              mutation: function () {
                return {
                  isPanning: allowDrag,
                  startPosition: position,
                  brushDomain: currentDomain,
                  activeBrushes: activeBrushes,
                  parentSVG: parentSVG
                };
              }
            }];
          } else {
            // if the event occurs outside the region, or if the whole domain is selected,
            // start a new selection
            return allowDraw ? [{
              mutation: function () {
                return {
                  isSelecting: allowResize,
                  brushDomain: null,
                  startPosition: position,
                  activeBrushes: activeBrushes,
                  parentSVG: parentSVG
                };
              }
            }] : [];
          }
        },
        // eslint-disable-next-line max-statements, complexity
        onMouseMove: function (evt, targetProps) {
          var isPanning = targetProps.isPanning,
              isSelecting = targetProps.isSelecting,
              allowResize = targetProps.allowResize,
              allowDrag = targetProps.allowDrag,
              onBrushDomainChange = targetProps.onBrushDomainChange,
              brushDomain = targetProps.brushDomain;
          var dimension = getDimension(targetProps);

          if (isPanning || isSelecting) {
            evt.preventDefault();
            evt.stopPropagation();
          }

          var parentSVG = targetProps.parentSVG || Selection.getParentSVG(evt);
          var position = Selection.getSVGEventCoordinates(evt, parentSVG)[dimension];
          var fullDomain = getFullDomain(targetProps);
          var domain = getBrushDomain(brushDomain, fullDomain);
          var initialRange = toRange(targetProps, domain);
          var activeHandle = getActiveHandle(targetProps, position, initialRange);
          var activeBrushes = {
            brushArea: !targetProps.brushDomain,
            brush: withinBound(position, initialRange) && !isEqual(fullDomain, domain),
            minHandle: activeHandle === "min" || activeHandle === "both",
            maxHandle: activeHandle === "max" || activeHandle === "both"
          };

          if (!targetProps.isPanning && !targetProps.isSelecting) {
            return [{
              mutation: function () {
                return {
                  activeBrushes: activeBrushes,
                  brushDomain: targetProps.brushDomain,
                  parentSVG: parentSVG
                };
              }
            }];
          }

          if (allowDrag && isPanning) {
            var fullRange = getFullRange(targetProps);
            var range = panBox(targetProps, position);
            var currentDomain = toDomain(targetProps, range);
            var startPosition = Math.max.apply(Math, _toConsumableArray(range)) >= Math.max.apply(Math, _toConsumableArray(fullRange)) || Math.min.apply(Math, _toConsumableArray(range)) <= Math.min.apply(Math, _toConsumableArray(fullRange)) ? targetProps.startPosition : position;
            var mutatedProps = {
              startPosition: startPosition,
              isPanning: true,
              brushDomain: currentDomain,
              activeBrushes: {
                brush: true
              },
              parentSVG: parentSVG
            };

            if (_isFunction(onBrushDomainChange)) {
              onBrushDomainChange(currentDomain, _defaults({}, mutatedProps, targetProps));
            }

            return [{
              mutation: function () {
                return mutatedProps;
              }
            }];
          } else if (allowResize && isSelecting) {
            var _currentDomain = brushDomain || getMinimumDomain();

            var _range = toRange(targetProps, _currentDomain);

            var oppositeHandle = targetProps.activeHandle === "min" ? "max" : "min";
            var handle = targetProps.activeHandle && getActiveHandle(targetProps, position, _range) === "both" ? oppositeHandle : targetProps.activeHandle;

            if (!handle) {
              _currentDomain = toDomain(targetProps, [targetProps.startPosition, position]);
            } else {
              var rangeMax = dimension === "x" ? Math.max.apply(Math, _toConsumableArray(_range)) : Math.min.apply(Math, _toConsumableArray(_range));
              var rangeMin = dimension === "x" ? Math.min.apply(Math, _toConsumableArray(_range)) : Math.max.apply(Math, _toConsumableArray(_range));
              var min = handle === "max" ? rangeMin : position;
              var max = handle === "min" ? rangeMax : position;
              _currentDomain = toDomain(targetProps, [min, max]);
            }

            var _mutatedProps = {
              brushDomain: _currentDomain,
              startPosition: targetProps.startPosition,
              isSelecting: isSelecting,
              activeHandle: handle,
              parentSVG: parentSVG,
              activeBrushes: {
                brush: true,
                minHandle: activeHandle === "min",
                maxHandle: activeHandle === "max"
              }
            };

            if (_isFunction(onBrushDomainChange)) {
              onBrushDomainChange(_currentDomain, _defaults({}, _mutatedProps, targetProps));
            }

            return [{
              mutation: function () {
                return _mutatedProps;
              }
            }];
          }

          return [];
        },
        onMouseUp: function (evt, targetProps) {
          var onBrushDomainChange = targetProps.onBrushDomainChange,
              brushDomain = targetProps.brushDomain,
              allowResize = targetProps.allowResize,
              activeBrushes = targetProps.activeBrushes; // if the mouse hasn't moved since a mouseDown event, select the whole domain region

          var mutatedProps = {
            isPanning: false,
            isSelecting: false,
            activeHandle: null,
            startPosition: null,
            brushDomain: brushDomain,
            activeBrushes: activeBrushes
          };

          if (allowResize && _isFunction(onBrushDomainChange)) {
            onBrushDomainChange(brushDomain, _defaults({}, mutatedProps, targetProps));
          }

          return [{
            mutation: function () {
              return mutatedProps;
            }
          }];
        },
        onMouseLeave: function (evt, targetProps) {
          var brushDomain = targetProps.brushDomain;
          return [{
            mutation: function () {
              return {
                isPanning: false,
                isSelecting: false,
                activeHandle: null,
                startPosition: null,
                brushDomain: brushDomain,
                activeBrushes: {}
              };
            }
          }];
        }
      }
    }];
  }
});
export { VictoryBrushLine as default };