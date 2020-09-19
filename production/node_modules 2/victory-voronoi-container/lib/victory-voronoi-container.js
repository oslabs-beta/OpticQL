"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.voronoiContainerMixin = void 0;

var _pick2 = _interopRequireDefault(require("lodash/pick"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _victoryTooltip = require("victory-tooltip");

var _victoryCore = require("victory-core");

var _voronoiHelpers = _interopRequireDefault(require("./voronoi-helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var voronoiContainerMixin = function (base) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_base) {
    _inherits(VictoryVoronoiContainer, _base);

    function VictoryVoronoiContainer() {
      _classCallCheck(this, VictoryVoronoiContainer);

      return _possibleConstructorReturn(this, (VictoryVoronoiContainer.__proto__ || Object.getPrototypeOf(VictoryVoronoiContainer)).apply(this, arguments));
    }

    _createClass(VictoryVoronoiContainer, [{
      key: "getDimension",
      value: function getDimension(props) {
        var horizontal = props.horizontal,
            voronoiDimension = props.voronoiDimension;

        if (!horizontal || !voronoiDimension) {
          return voronoiDimension;
        }

        return voronoiDimension === "x" ? "y" : "x";
      }
    }, {
      key: "getPoint",
      value: function getPoint(point) {
        var whitelist = ["_x", "_x1", "_x0", "_y", "_y1", "_y0"];
        return (0, _pick2.default)(point, whitelist);
      }
    }, {
      key: "getLabelPosition",
      value: function getLabelPosition(props, labelProps, points) {
        var mousePosition = props.mousePosition,
            mouseFollowTooltips = props.mouseFollowTooltips;
        var voronoiDimension = this.getDimension(props);
        var point = this.getPoint(points[0]);

        var basePosition = _victoryCore.Helpers.scalePoint(props, point);

        var center = mouseFollowTooltips ? mousePosition : undefined;

        if (!voronoiDimension || points.length < 2) {
          return _objectSpread({}, basePosition, {
            center: (0, _defaults2.default)({}, labelProps.center, center)
          });
        }

        var x = voronoiDimension === "y" ? mousePosition.x : basePosition.x;
        var y = voronoiDimension === "x" ? mousePosition.y : basePosition.y;
        center = mouseFollowTooltips ? mousePosition : {
          x: x,
          y: y
        };
        return {
          x: x,
          y: y,
          center: (0, _defaults2.default)({}, labelProps.center, center)
        };
      }
    }, {
      key: "getStyle",
      value: function getStyle(props, points, type) {
        var labels = props.labels,
            labelComponent = props.labelComponent,
            theme = props.theme;
        var componentProps = labelComponent.props || {};
        var themeStyles = theme && theme.voronoi && theme.voronoi.style ? theme.voronoi.style : {};
        var componentStyleArray = type === "flyout" ? componentProps.flyoutStyle : componentProps.style;
        return points.reduce(function (memo, datum, index) {
          var labelProps = (0, _defaults2.default)({}, componentProps, {
            datum: datum,
            active: true
          });
          var text = (0, _isFunction2.default)(labels) ? labels(labelProps) : undefined;
          var textArray = text !== undefined ? "".concat(text).split("\n") : [];
          var baseStyle = datum.style && datum.style[type] || {};
          var componentStyle = Array.isArray(componentStyleArray) ? componentStyleArray[index] : componentStyleArray;

          var style = _victoryCore.Helpers.evaluateStyle((0, _defaults2.default)({}, componentStyle, baseStyle, themeStyles[type]), labelProps);

          var styleArray = textArray.length ? textArray.map(function () {
            return style;
          }) : [style];
          memo = memo.concat(styleArray);
          return memo;
        }, []);
      }
    }, {
      key: "getDefaultLabelProps",
      value: function getDefaultLabelProps(props, points) {
        var voronoiDimension = props.voronoiDimension,
            horizontal = props.horizontal,
            mouseFollowTooltips = props.mouseFollowTooltips;
        var point = this.getPoint(points[0]);
        var multiPoint = voronoiDimension && points.length > 1;
        var y = point._y1 !== undefined ? point._y1 : point._y;
        var defaultHorizontalOrientation = y < 0 ? "left" : "right";
        var defaultOrientation = y < 0 ? "bottom" : "top";
        var labelOrientation = horizontal ? defaultHorizontalOrientation : defaultOrientation;
        var orientation = mouseFollowTooltips ? undefined : labelOrientation;
        return {
          orientation: orientation,
          pointerLength: multiPoint ? 0 : undefined,
          constrainToVisibleArea: multiPoint || mouseFollowTooltips ? true : undefined
        };
      }
    }, {
      key: "getLabelProps",
      value: function getLabelProps(props, points) {
        var labels = props.labels,
            scale = props.scale,
            labelComponent = props.labelComponent,
            theme = props.theme,
            width = props.width,
            height = props.height;
        var componentProps = labelComponent.props || {};
        var text = points.reduce(function (memo, datum) {
          var labelProps = (0, _defaults2.default)({}, componentProps, {
            datum: datum,
            active: true
          });
          var t = (0, _isFunction2.default)(labels) ? labels(labelProps) : null;

          if (t === null || t === undefined) {
            return memo;
          }

          memo = memo.concat("".concat(t).split("\n"));
          return memo;
        }, []); // remove properties from first point to make datum
        // eslint-disable-next-line no-unused-vars

        var _points$ = points[0],
            childName = _points$.childName,
            eventKey = _points$.eventKey,
            style = _points$.style,
            continuous = _points$.continuous,
            datum = _objectWithoutProperties(_points$, ["childName", "eventKey", "style", "continuous"]);

        var name = props.name === childName ? childName : "".concat(props.name, "-").concat(childName);
        var labelProps = (0, _defaults2.default)({
          key: "".concat(name, "-").concat(eventKey, "-voronoi-tooltip"),
          id: "".concat(name, "-").concat(eventKey, "-voronoi-tooltip"),
          active: true,
          flyoutStyle: this.getStyle(props, points, "flyout")[0],
          renderInPortal: false,
          style: this.getStyle(props, points, "labels"),
          activePoints: points,
          datum: datum,
          scale: scale,
          theme: theme,
          text: text,
          width: width,
          height: height
        }, componentProps, this.getDefaultLabelProps(props, points));
        var labelPosition = this.getLabelPosition(props, labelProps, points);
        return (0, _defaults2.default)({}, labelPosition, labelProps);
      }
    }, {
      key: "getTooltip",
      value: function getTooltip(props) {
        var labels = props.labels,
            activePoints = props.activePoints,
            labelComponent = props.labelComponent;

        if (!labels) {
          return null;
        }

        if (Array.isArray(activePoints) && activePoints.length) {
          var labelProps = this.getLabelProps(props, activePoints);
          var text = labelProps.text;
          var showLabel = Array.isArray(text) ? text.filter(Boolean).length : text;
          return showLabel ? _react.default.cloneElement(labelComponent, labelProps) : null;
        } else {
          return null;
        }
      } // Overrides method in VictoryContainer

    }, {
      key: "getChildren",
      value: function getChildren(props) {
        return _toConsumableArray(_react.default.Children.toArray(props.children)).concat([this.getTooltip(props)]);
      }
    }]);

    return VictoryVoronoiContainer;
  }(base), Object.defineProperty(_class, "displayName", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: "VictoryVoronoiContainer"
  }), Object.defineProperty(_class, "propTypes", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: _objectSpread({}, _victoryCore.VictoryContainer.propTypes, {
      activateData: _propTypes.default.bool,
      activateLabels: _propTypes.default.bool,
      disable: _propTypes.default.bool,
      labelComponent: _propTypes.default.element,
      labels: _propTypes.default.func,
      mouseFollowTooltips: _propTypes.default.bool,
      onActivated: _propTypes.default.func,
      onDeactivated: _propTypes.default.func,
      radius: _propTypes.default.number,
      voronoiBlacklist: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.string, _victoryCore.PropTypes.regExp])),
      voronoiDimension: _propTypes.default.oneOf(["x", "y"]),
      voronoiPadding: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
        top: _propTypes.default.number,
        bottom: _propTypes.default.number,
        left: _propTypes.default.number,
        right: _propTypes.default.number
      })])
    })
  }), Object.defineProperty(_class, "defaultProps", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: _objectSpread({}, _victoryCore.VictoryContainer.defaultProps, {
      activateData: true,
      activateLabels: true,
      labelComponent: _react.default.createElement(_victoryTooltip.VictoryTooltip, null),
      voronoiPadding: 5
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
            return props.disable ? {} : _voronoiHelpers.default.onMouseLeave(evt, targetProps);
          },
          onTouchCancel: function (evt, targetProps) {
            return props.disable ? {} : _voronoiHelpers.default.onMouseLeave(evt, targetProps);
          },
          onMouseMove: function (evt, targetProps) {
            return props.disable ? {} : _voronoiHelpers.default.onMouseMove(evt, targetProps);
          },
          onTouchMove: function (evt, targetProps) {
            return props.disable ? {} : _voronoiHelpers.default.onMouseMove(evt, targetProps);
          }
        }
      }, {
        target: "data",
        eventHandlers: props.disable ? {} : {
          onMouseOver: function () {
            return null;
          },
          onMouseOut: function () {
            return null;
          },
          onMouseMove: function () {
            return null;
          }
        }
      }];
    }
  }), _temp;
};

exports.voronoiContainerMixin = voronoiContainerMixin;

var _default = voronoiContainerMixin(_victoryCore.VictoryContainer);

exports.default = _default;