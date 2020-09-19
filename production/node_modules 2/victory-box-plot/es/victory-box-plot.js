import _isNil from "lodash/isNil";
import _flatten from "lodash/flatten";

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

import React from "react";
import PropTypes from "prop-types";
import { Helpers, VictoryLabel, addEvents, LineSegment, PropTypes as CustomPropTypes, VictoryContainer, VictoryTheme, Box, Whisker, DefaultTransitions, CommonProps } from "victory-core";
import { getDomain, getData, getBaseProps } from "./helper-methods";
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

      var dataComponents = _flatten(types.map(function (type) {
        return _this.dataKeys.reduce(function (validDataComponents, _key, index) {
          var baseComponent = props["".concat(type, "Component")];

          var componentProps = _this.getComponentProps(baseComponent, type, index);

          if (_this.shouldRenderDatum(componentProps.datum)) {
            validDataComponents.push(React.cloneElement(baseComponent, componentProps));
          }

          return validDataComponents;
        }, []);
      }));

      var labelComponents = _flatten(types.map(function (type) {
        var components = _this.dataKeys.map(function (key, index) {
          var name = "".concat(type, "Labels");
          var baseComponent = props["".concat(type, "LabelComponent")];

          var labelProps = _this.getComponentProps(baseComponent, name, index);

          if (labelProps.text !== undefined && labelProps.text !== null) {
            return React.cloneElement(baseComponent, labelProps);
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
      var hasX = !_isNil(datum._x);
      var hasY = !_isNil(datum._y);
      var hasSummaryStatistics = !_isNil(datum._min) && !_isNil(datum._max) && !_isNil(datum._median) && !_isNil(datum._q1) && !_isNil(datum._q3);
      return hasSummaryStatistics && (this.props.horizontal ? hasY : hasX);
    }
  }, {
    key: "render",
    value: function render() {
      var animationWhitelist = VictoryBoxPlot.animationWhitelist,
          role = VictoryBoxPlot.role;
      var props = Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var children = this.renderBoxPlot(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryBoxPlot;
}(React.Component);

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
  value: DefaultTransitions.discreteTransitions()
});
Object.defineProperty(VictoryBoxPlot, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.baseProps, CommonProps.dataProps, {
    boxWidth: PropTypes.number,
    events: PropTypes.arrayOf(PropTypes.shape({
      target: PropTypes.oneOf(["max", "maxLabels", "median", "medianLabels", "min", "minLabels", "q1", "q1Labels", "q3", "q3Labels", "parent"]),
      eventKey: PropTypes.oneOfType([PropTypes.array, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
      eventHandlers: PropTypes.object
    })),
    horizontal: PropTypes.bool,
    labelOrientation: PropTypes.oneOfType([PropTypes.oneOf(["top", "bottom", "left", "right"]), PropTypes.shape({
      q1: PropTypes.oneOf(["top", "bottom", "left", "right"]),
      q3: PropTypes.oneOf(["top", "bottom", "left", "right"]),
      min: PropTypes.oneOf(["top", "bottom", "left", "right"]),
      max: PropTypes.oneOf(["top", "bottom", "left", "right"]),
      median: PropTypes.oneOf(["top", "bottom", "left", "right"])
    })]),
    labels: PropTypes.bool,
    max: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    maxComponent: PropTypes.element,
    maxLabelComponent: PropTypes.element,
    maxLabels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
    median: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    medianComponent: PropTypes.element,
    medianLabelComponent: PropTypes.element,
    medianLabels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
    min: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    minComponent: PropTypes.element,
    minLabelComponent: PropTypes.element,
    minLabels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
    q1: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    q1Component: PropTypes.element,
    q1LabelComponent: PropTypes.element,
    q1Labels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
    q3: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    q3Component: PropTypes.element,
    q3LabelComponent: PropTypes.element,
    q3Labels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
    style: PropTypes.shape({
      boxes: PropTypes.object,
      labels: PropTypes.object,
      parent: PropTypes.object,
      max: PropTypes.object,
      maxLabels: PropTypes.object,
      median: PropTypes.object,
      medianLabels: PropTypes.object,
      min: PropTypes.object,
      minLabels: PropTypes.object,
      q1: PropTypes.object,
      q1Labels: PropTypes.object,
      q3: PropTypes.object,
      q3Labels: PropTypes.object,
      whiskers: PropTypes.object
    }),
    whiskerWidth: PropTypes.number
  })
});
Object.defineProperty(VictoryBoxPlot, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    containerComponent: React.createElement(VictoryContainer, null),
    data: defaultData,
    dataComponent: React.createElement(Box, null),
    groupComponent: React.createElement("g", {
      role: "presentation"
    }),
    maxComponent: React.createElement(Whisker, null),
    maxLabelComponent: React.createElement(VictoryLabel, null),
    medianComponent: React.createElement(LineSegment, null),
    medianLabelComponent: React.createElement(VictoryLabel, null),
    minComponent: React.createElement(Whisker, null),
    minLabelComponent: React.createElement(VictoryLabel, null),
    q1Component: React.createElement(Box, null),
    q1LabelComponent: React.createElement(VictoryLabel, null),
    q3Component: React.createElement(Box, null),
    q3LabelComponent: React.createElement(VictoryLabel, null),
    samples: 50,
    sortKey: "x",
    sortOrder: "ascending",
    standalone: true,
    theme: VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryBoxPlot, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: getDomain
});
Object.defineProperty(VictoryBoxPlot, "getData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: getData
});
Object.defineProperty(VictoryBoxPlot, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return getBaseProps(props, fallbackProps);
  }
});
Object.defineProperty(VictoryBoxPlot, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["maxComponent", "maxLabelComponent", "medianComponent", "medianLabelComponent", "minComponent", "minLabelComponent", "q1Component", "q1LabelComponent", "q3Component", "q3LabelComponent", "groupComponent", "containerComponent"]
});
export default addEvents(VictoryBoxPlot, options);