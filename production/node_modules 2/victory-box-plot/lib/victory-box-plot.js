"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _victoryCore = require("victory-core");

var _helperMethods = require("./helper-methods");

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

var fallbackProps = {
  width: 450,
  height: 300,
  padding: {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  }
};
var defaultData = [{
  x: 1,
  min: 5,
  q1: 7,
  median: 12,
  q3: 18,
  max: 20
}, {
  x: 2,
  min: 2,
  q1: 5,
  median: 8,
  q3: 12,
  max: 15
}];
var options = {
  components: [{
    name: "min"
  }, {
    name: "minLabels"
  }, {
    name: "max"
  }, {
    name: "maxLabels"
  }, {
    name: "median"
  }, {
    name: "medianLabels"
  }, {
    name: "q1"
  }, {
    name: "q1Labels"
  }, {
    name: "q3"
  }, {
    name: "q3Labels"
  }, {
    name: "parent",
    index: "parent"
  }]
};

var VictoryBoxPlot =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryBoxPlot, _React$Component);

  function VictoryBoxPlot() {
    _classCallCheck(this, VictoryBoxPlot);

    return _possibleConstructorReturn(this, (VictoryBoxPlot.__proto__ || Object.getPrototypeOf(VictoryBoxPlot)).apply(this, arguments));
  }

  _createClass(VictoryBoxPlot, [{
    key: "renderBoxPlot",
    value: function renderBoxPlot(props) {
      var _this = this;

      var types = ["q1", "q3", "max", "min", "median"];
      var dataComponents = (0, _flatten2.default)(types.map(function (type) {
        return _this.dataKeys.reduce(function (validDataComponents, _key, index) {
          var baseComponent = props["".concat(type, "Component")];

          var componentProps = _this.getComponentProps(baseComponent, type, index);

          if (_this.shouldRenderDatum(componentProps.datum)) {
            validDataComponents.push(_react.default.cloneElement(baseComponent, componentProps));
          }

          return validDataComponents;
        }, []);
      }));
      var labelComponents = (0, _flatten2.default)(types.map(function (type) {
        var components = _this.dataKeys.map(function (key, index) {
          var name = "".concat(type, "Labels");
          var baseComponent = props["".concat(type, "LabelComponent")];

          var labelProps = _this.getComponentProps(baseComponent, name, index);

          if (labelProps.text !== undefined && labelProps.text !== null) {
            return _react.default.cloneElement(baseComponent, labelProps);
          }

          return undefined;
        });

        return components.filter(Boolean);
      }));

      var children = _toConsumableArray(dataComponents).concat(_toConsumableArray(labelComponents));

      return this.renderContainer(props.groupComponent, children);
    } // Overridden in native versions

  }, {
    key: "shouldAnimate",
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "shouldRenderDatum",
    value: function shouldRenderDatum(datum) {
      var hasX = !(0, _isNil2.default)(datum._x);
      var hasY = !(0, _isNil2.default)(datum._y);
      var hasSummaryStatistics = !(0, _isNil2.default)(datum._min) && !(0, _isNil2.default)(datum._max) && !(0, _isNil2.default)(datum._median) && !(0, _isNil2.default)(datum._q1) && !(0, _isNil2.default)(datum._q3);
      return hasSummaryStatistics && (this.props.horizontal ? hasY : hasX);
    }
  }, {
    key: "render",
    value: function render() {
      var animationWhitelist = VictoryBoxPlot.animationWhitelist,
          role = VictoryBoxPlot.role;

      var props = _victoryCore.Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var children = this.renderBoxPlot(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryBoxPlot;
}(_react.default.Component);

Object.defineProperty(VictoryBoxPlot, "animationWhitelist", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["data", "domain", "height", "padding", "style", "width"]
});
Object.defineProperty(VictoryBoxPlot, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryBoxPlot"
});
Object.defineProperty(VictoryBoxPlot, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "boxplot"
});
Object.defineProperty(VictoryBoxPlot, "defaultTransitions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _victoryCore.DefaultTransitions.discreteTransitions()
});
Object.defineProperty(VictoryBoxPlot, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, _victoryCore.CommonProps.baseProps, _victoryCore.CommonProps.dataProps, {
    boxWidth: _propTypes.default.number,
    events: _propTypes.default.arrayOf(_propTypes.default.shape({
      target: _propTypes.default.oneOf(["max", "maxLabels", "median", "medianLabels", "min", "minLabels", "q1", "q1Labels", "q3", "q3Labels", "parent"]),
      eventKey: _propTypes.default.oneOfType([_propTypes.default.array, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string]),
      eventHandlers: _propTypes.default.object
    })),
    horizontal: _propTypes.default.bool,
    labelOrientation: _propTypes.default.oneOfType([_propTypes.default.oneOf(["top", "bottom", "left", "right"]), _propTypes.default.shape({
      q1: _propTypes.default.oneOf(["top", "bottom", "left", "right"]),
      q3: _propTypes.default.oneOf(["top", "bottom", "left", "right"]),
      min: _propTypes.default.oneOf(["top", "bottom", "left", "right"]),
      max: _propTypes.default.oneOf(["top", "bottom", "left", "right"]),
      median: _propTypes.default.oneOf(["top", "bottom", "left", "right"])
    })]),
    labels: _propTypes.default.bool,
    max: _propTypes.default.oneOfType([_propTypes.default.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
    maxComponent: _propTypes.default.element,
    maxLabelComponent: _propTypes.default.element,
    maxLabels: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.array, _propTypes.default.bool]),
    median: _propTypes.default.oneOfType([_propTypes.default.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
    medianComponent: _propTypes.default.element,
    medianLabelComponent: _propTypes.default.element,
    medianLabels: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.array, _propTypes.default.bool]),
    min: _propTypes.default.oneOfType([_propTypes.default.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
    minComponent: _propTypes.default.element,
    minLabelComponent: _propTypes.default.element,
    minLabels: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.array, _propTypes.default.bool]),
    q1: _propTypes.default.oneOfType([_propTypes.default.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
    q1Component: _propTypes.default.element,
    q1LabelComponent: _propTypes.default.element,
    q1Labels: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.array, _propTypes.default.bool]),
    q3: _propTypes.default.oneOfType([_propTypes.default.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
    q3Component: _propTypes.default.element,
    q3LabelComponent: _propTypes.default.element,
    q3Labels: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.array, _propTypes.default.bool]),
    style: _propTypes.default.shape({
      boxes: _propTypes.default.object,
      labels: _propTypes.default.object,
      parent: _propTypes.default.object,
      max: _propTypes.default.object,
      maxLabels: _propTypes.default.object,
      median: _propTypes.default.object,
      medianLabels: _propTypes.default.object,
      min: _propTypes.default.object,
      minLabels: _propTypes.default.object,
      q1: _propTypes.default.object,
      q1Labels: _propTypes.default.object,
      q3: _propTypes.default.object,
      q3Labels: _propTypes.default.object,
      whiskers: _propTypes.default.object
    }),
    whiskerWidth: _propTypes.default.number
  })
});
Object.defineProperty(VictoryBoxPlot, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    containerComponent: _react.default.createElement(_victoryCore.VictoryContainer, null),
    data: defaultData,
    dataComponent: _react.default.createElement(_victoryCore.Box, null),
    groupComponent: _react.default.createElement("g", {
      role: "presentation"
    }),
    maxComponent: _react.default.createElement(_victoryCore.Whisker, null),
    maxLabelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    medianComponent: _react.default.createElement(_victoryCore.LineSegment, null),
    medianLabelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    minComponent: _react.default.createElement(_victoryCore.Whisker, null),
    minLabelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    q1Component: _react.default.createElement(_victoryCore.Box, null),
    q1LabelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    q3Component: _react.default.createElement(_victoryCore.Box, null),
    q3LabelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    samples: 50,
    sortKey: "x",
    sortOrder: "ascending",
    standalone: true,
    theme: _victoryCore.VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryBoxPlot, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _helperMethods.getDomain
});
Object.defineProperty(VictoryBoxPlot, "getData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _helperMethods.getData
});
Object.defineProperty(VictoryBoxPlot, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return (0, _helperMethods.getBaseProps)(props, fallbackProps);
  }
});
Object.defineProperty(VictoryBoxPlot, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["maxComponent", "maxLabelComponent", "medianComponent", "medianLabelComponent", "minComponent", "minLabelComponent", "q1Component", "q1LabelComponent", "q3Component", "q3LabelComponent", "groupComponent", "containerComponent"]
});

var _default = (0, _victoryCore.addEvents)(VictoryBoxPlot, options);

exports.default = _default;