"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.zoomContainerMixin = void 0;

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _zoomHelpers = _interopRequireDefault(require("./zoom-helpers"));

var _victoryCore = require("victory-core");

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

var DEFAULT_DOWNSAMPLE = 150;

var zoomContainerMixin = function (base) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_base) {
    _inherits(VictoryZoomContainer, _base);

    function VictoryZoomContainer() {
      _classCallCheck(this, VictoryZoomContainer);

      return _possibleConstructorReturn(this, (VictoryZoomContainer.__proto__ || Object.getPrototypeOf(VictoryZoomContainer)).apply(this, arguments));
    }

    _createClass(VictoryZoomContainer, [{
      key: "clipDataComponents",
      value: function clipDataComponents(children, props) {
        var scale = props.scale,
            clipContainerComponent = props.clipContainerComponent,
            polar = props.polar,
            origin = props.origin,
            horizontal = props.horizontal;
        var rangeX = horizontal ? scale.y.range() : scale.x.range();
        var rangeY = horizontal ? scale.x.range() : scale.y.range();
        var plottableWidth = Math.abs(rangeX[0] - rangeX[1]);
        var plottableHeight = Math.abs(rangeY[0] - rangeY[1]);
        var radius = Math.max.apply(Math, _toConsumableArray(rangeY));

        var groupComponent = _react.default.cloneElement(clipContainerComponent, _objectSpread({
          clipWidth: plottableWidth,
          clipHeight: plottableHeight,
          translateX: Math.min.apply(Math, _toConsumableArray(rangeX)),
          translateY: Math.min.apply(Math, _toConsumableArray(rangeY)),
          polar: polar,
          origin: polar ? origin : undefined,
          radius: polar ? radius : undefined
        }, clipContainerComponent.props));

        return _react.default.Children.toArray(children).map(function (child) {
          if (!_victoryCore.Data.isDataComponent(child)) {
            return child;
          } else {
            return _react.default.cloneElement(child, {
              groupComponent: groupComponent
            });
          }
        });
      }
    }, {
      key: "modifyPolarDomain",
      value: function modifyPolarDomain(domain, originalDomain) {
        // Only zoom the radius of polar charts. Zooming angles is very confusing
        return {
          x: originalDomain.x,
          y: [0, domain.y[1]]
        };
      }
    }, {
      key: "downsampleZoomData",
      value: function downsampleZoomData(props, child, domain) {
        var downsample = props.downsample;

        var getData = function (childProps) {
          var data = childProps.data,
              x = childProps.x,
              y = childProps.y;
          var defaultGetData = child.type && (0, _isFunction2.default)(child.type.getData) ? child.type.getData : function () {
            return undefined;
          }; // skip costly data formatting if x and y accessors are not present

          return Array.isArray(data) && !x && !y ? data : defaultGetData(childProps);
        };

        var data = getData(child.props); // return undefined if downsample is not run, then default() will replace with child.props.data

        if (!downsample || !domain || !data) {
          return undefined;
        }

        var maxPoints = downsample === true ? DEFAULT_DOWNSAMPLE : downsample;
        var dimension = props.zoomDimension || "x"; // important: assumes data is ordered by dimension
        // get the start and end of the data that is in the current visible domain

        var startIndex = data.findIndex(function (d) {
          return d[dimension] >= domain[dimension][0];
        });
        var endIndex = data.findIndex(function (d) {
          return d[dimension] > domain[dimension][1];
        }); // pick one more point (if available) at each end so that VictoryLine, VictoryArea connect

        if (startIndex !== 0) {
          startIndex -= 1;
        }

        if (endIndex !== -1) {
          endIndex += 1;
        }

        var visibleData = data.slice(startIndex, endIndex);
        return _victoryCore.Data.downsample(visibleData, maxPoints, startIndex);
      }
    }, {
      key: "modifyChildren",
      value: function modifyChildren(props) {
        var _this = this;

        var childComponents = _react.default.Children.toArray(props.children); // eslint-disable-next-line max-statements


        return childComponents.map(function (child) {
          var role = child.type && child.type.role;

          var isDataComponent = _victoryCore.Data.isDataComponent(child);

          var currentDomain = props.currentDomain,
              zoomActive = props.zoomActive,
              allowZoom = props.allowZoom;
          var originalDomain = (0, _defaults2.default)({}, props.originalDomain, props.domain);
          var zoomDomain = (0, _defaults2.default)({}, props.zoomDomain, props.domain);
          var cachedZoomDomain = (0, _defaults2.default)({}, props.cachedZoomDomain, props.domain);
          var domain;

          if (!_zoomHelpers.default.checkDomainEquality(zoomDomain, cachedZoomDomain)) {
            // if zoomDomain has been changed, use it
            domain = zoomDomain;
          } else if (allowZoom && !zoomActive) {
            // if user has zoomed all the way out, use the child domain
            domain = child.props.domain;
          } else {
            // default: use currentDomain, set by the event handlers
            domain = (0, _defaults2.default)({}, currentDomain, originalDomain);
          }

          var newDomain = props.polar ? _this.modifyPolarDomain(domain, originalDomain) : domain;

          if (newDomain && props.zoomDimension) {
            // if zooming is restricted to a dimension, don't squash changes to zoomDomain in other dim
            newDomain = _objectSpread({}, zoomDomain, _defineProperty({}, props.zoomDimension, newDomain[props.zoomDimension]));
          } // don't downsample stacked data


          var newProps = isDataComponent && role !== "stack" ? {
            domain: newDomain,
            data: _this.downsampleZoomData(props, child, newDomain)
          } : {
            domain: newDomain
          };
          return _react.default.cloneElement(child, (0, _defaults2.default)(newProps, child.props));
        });
      } // Overrides method in VictoryContainer

    }, {
      key: "getChildren",
      value: function getChildren(props) {
        var children = this.modifyChildren(props);
        return this.clipDataComponents(children, props);
      }
    }]);

    return VictoryZoomContainer;
  }(base), Object.defineProperty(_class, "displayName", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: "VictoryZoomContainer"
  }), Object.defineProperty(_class, "propTypes", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: _objectSpread({}, _victoryCore.VictoryContainer.propTypes, {
      allowPan: _propTypes.default.bool,
      allowZoom: _propTypes.default.bool,
      clipContainerComponent: _propTypes.default.element.isRequired,
      disable: _propTypes.default.bool,
      downsample: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.number]),
      minimumZoom: _propTypes.default.shape({
        x: _propTypes.default.number,
        y: _propTypes.default.number
      }),
      onZoomDomainChange: _propTypes.default.func,
      zoomDimension: _propTypes.default.oneOf(["x", "y"]),
      zoomDomain: _propTypes.default.shape({
        x: _victoryCore.PropTypes.domain,
        y: _victoryCore.PropTypes.domain
      })
    })
  }), Object.defineProperty(_class, "defaultProps", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: _objectSpread({}, _victoryCore.VictoryContainer.defaultProps, {
      clipContainerComponent: _react.default.createElement(_victoryCore.VictoryClipContainer, null),
      allowPan: true,
      allowZoom: true,
      zoomActive: false
    })
  }), Object.defineProperty(_class, "defaultEvents", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function (props) {
      return [{
        target: "parent",
        eventHandlers: _objectSpread({
          onMouseDown: function (evt, targetProps) {
            return props.disable ? {} : _zoomHelpers.default.onMouseDown(evt, targetProps);
          },
          onTouchStart: function (evt, targetProps) {
            return props.disable ? {} : _zoomHelpers.default.onMouseDown(evt, targetProps);
          },
          onMouseUp: function (evt, targetProps) {
            return props.disable ? {} : _zoomHelpers.default.onMouseUp(evt, targetProps);
          },
          onTouchEnd: function (evt, targetProps) {
            return props.disable ? {} : _zoomHelpers.default.onMouseUp(evt, targetProps);
          },
          onMouseLeave: function (evt, targetProps) {
            return props.disable ? {} : _zoomHelpers.default.onMouseLeave(evt, targetProps);
          },
          onTouchCancel: function (evt, targetProps) {
            return props.disable ? {} : _zoomHelpers.default.onMouseLeave(evt, targetProps);
          },
          // eslint-disable-next-line max-params
          onMouseMove: function (evt, targetProps, eventKey, ctx) {
            if (props.disable) {
              return {};
            }

            return _zoomHelpers.default.onMouseMove(evt, targetProps, eventKey, ctx);
          },
          // eslint-disable-next-line max-params
          onTouchMove: function (evt, targetProps, eventKey, ctx) {
            if (props.disable) {
              return {};
            }

            evt.preventDefault();
            return _zoomHelpers.default.onMouseMove(evt, targetProps, eventKey, ctx);
          }
        }, props.disable || !props.allowZoom ? {} : {
          onWheel: _zoomHelpers.default.onWheel
        })
      }];
    }
  }), _temp;
};

exports.zoomContainerMixin = zoomContainerMixin;

var _default = zoomContainerMixin(_victoryCore.VictoryContainer);

exports.default = _default;