import _isEmpty from "lodash/isEmpty";
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
import { PropTypes as CustomPropTypes, VictoryLabel, CommonProps, VictoryContainer, VictoryTheme, LineSegment, TextSize, addEvents, Axis } from "victory-core";
import { getBaseProps, getStyles } from "./helper-methods";
var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};
var options = {
  components: [{
    name: "axis",
    index: 0
  }, {
    name: "axisLabel",
    index: 0
  }, {
    name: "grid"
  }, {
    name: "parent",
    index: "parent"
  }, {
    name: "ticks"
  }, {
    name: "tickLabels"
  }]
};

var VictoryAxis =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryAxis, _React$Component);

  function VictoryAxis() {
    _classCallCheck(this, VictoryAxis);

    return _possibleConstructorReturn(this, (VictoryAxis.__proto__ || Object.getPrototypeOf(VictoryAxis)).apply(this, arguments));
  }

  _createClass(VictoryAxis, [{
    key: "renderLine",
    value: function renderLine(props) {
      var axisComponent = props.axisComponent;
      var axisProps = this.getComponentProps(axisComponent, "axis", 0);
      return React.cloneElement(axisComponent, axisProps);
    }
  }, {
    key: "renderLabel",
    value: function renderLabel(props) {
      var axisLabelComponent = props.axisLabelComponent,
          label = props.label;

      if (!label) {
        return null;
      }

      var axisLabelProps = this.getComponentProps(axisLabelComponent, "axisLabel", 0);
      return React.cloneElement(axisLabelComponent, axisLabelProps);
    }
  }, {
    key: "renderGridAndTicks",
    value: function renderGridAndTicks(props) {
      var _this = this;

      var tickComponent = props.tickComponent,
          tickLabelComponent = props.tickLabelComponent,
          gridComponent = props.gridComponent,
          name = props.name;

      var shouldRender = function (componentProps) {
        var _componentProps$style = componentProps.style,
            style = _componentProps$style === void 0 ? {} : _componentProps$style,
            _componentProps$event = componentProps.events,
            events = _componentProps$event === void 0 ? {} : _componentProps$event;
        var visible = style.stroke !== "transparent" && style.stroke !== "none" && style.strokeWidth !== 0;
        return visible || !_isEmpty(events);
      };

      return this.dataKeys.map(function (key, index) {
        var tickProps = _this.getComponentProps(tickComponent, "ticks", index);

        var BaseTickComponent = React.cloneElement(tickComponent, tickProps);
        var TickComponent = shouldRender(BaseTickComponent.props) ? BaseTickComponent : undefined;

        var gridProps = _this.getComponentProps(gridComponent, "grid", index);

        var BaseGridComponent = React.cloneElement(gridComponent, gridProps);
        var GridComponent = shouldRender(BaseGridComponent.props) ? BaseGridComponent : undefined;

        var tickLabelProps = _this.getComponentProps(tickLabelComponent, "tickLabels", index);

        var TickLabel = React.cloneElement(tickLabelComponent, tickLabelProps);
        var children = [GridComponent, TickComponent, TickLabel].filter(Boolean);
        return React.cloneElement(props.groupComponent, {
          key: "".concat(name, "-tick-group-").concat(key)
        }, children);
      });
    }
  }, {
    key: "fixLabelOverlap",
    value: function fixLabelOverlap(gridAndTicks, props) {
      var isVertical = Axis.isVertical(props);
      var size = isVertical ? props.height : props.width;

      var isVictoryLabel = function (child) {
        return child.type && child.type.role === "label";
      };

      var labels = gridAndTicks.map(function (gridAndTick) {
        return gridAndTick.props.children;
      }).reduce(function (accumulator, childArr) {
        return accumulator.concat(childArr);
      }, []).filter(isVictoryLabel).map(function (child) {
        return child.props;
      });

      var paddingToObject = function (padding) {
        return typeof padding === "object" ? _assign({}, {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0
        }, padding) : {
          top: padding,
          right: padding,
          bottom: padding,
          left: padding
        };
      };

      var labelsSumSize = labels.reduce(function (sum, label) {
        var padding = paddingToObject(label.style.padding);
        var labelSize = TextSize.approximateTextSize(label.text, {
          angle: label.angle,
          fontSize: label.style.fontSize,
          letterSpacing: label.style.letterSpacing,
          fontFamily: label.style.fontFamily
        });
        return sum + (isVertical ? labelSize.height + padding.top + padding.bottom : labelSize.width + padding.right + padding.left);
      }, 0);
      var availiableLabelCount = Math.floor(size * gridAndTicks.length / labelsSumSize);
      var divider = Math.ceil(gridAndTicks.length / availiableLabelCount) || 1;

      var getLabelCoord = function (gridAndTick) {
        return gridAndTick.props.children.filter(isVictoryLabel).reduce(function (prev, child) {
          return (isVertical ? child.props.y : child.props.x) || 0;
        }, 0);
      };

      var sorted = gridAndTicks.sort(function (a, b) {
        return isVertical ? getLabelCoord(b) - getLabelCoord(a) //ordinary axis has top-bottom orientation
        : getLabelCoord(a) - getLabelCoord(b);
      } //ordinary axis has left-right orientation
      );
      return sorted.filter(function (gridAndTick, index) {
        return index % divider === 0;
      });
    } // Overridden in native versions

  }, {
    key: "shouldAnimate",
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "render",
    value: function render() {
      var animationWhitelist = VictoryAxis.animationWhitelist;
      var props = Axis.modifyProps(this.props, fallbackProps);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var gridAndTicks = this.renderGridAndTicks(props);
      var modifiedGridAndTicks = props.fixLabelOverlap ? this.fixLabelOverlap(gridAndTicks, props) : gridAndTicks;
      var children = [this.renderLine(props), this.renderLabel(props)].concat(_toConsumableArray(modifiedGridAndTicks));
      return props.standalone ? this.renderContainer(props.containerComponent, children) : React.cloneElement(props.groupComponent, {}, children);
    }
  }]);

  return VictoryAxis;
}(React.Component);

Object.defineProperty(VictoryAxis, "animationWhitelist", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["style", "domain", "range", "tickCount", "tickValues", "offsetX", "offsetY", "padding", "width", "height"]
});
Object.defineProperty(VictoryAxis, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryAxis"
});
Object.defineProperty(VictoryAxis, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "axis"
});
Object.defineProperty(VictoryAxis, "defaultTransitions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    onExit: {
      duration: 500
    },
    onEnter: {
      duration: 500
    }
  }
});
Object.defineProperty(VictoryAxis, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.baseProps, {
    axisComponent: PropTypes.element,
    axisLabelComponent: PropTypes.element,
    axisValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
    categories: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.shape({
      x: PropTypes.arrayOf(PropTypes.string),
      y: PropTypes.arrayOf(PropTypes.string)
    })]),
    crossAxis: PropTypes.bool,
    dependentAxis: PropTypes.bool,
    events: PropTypes.arrayOf(PropTypes.shape({
      target: PropTypes.oneOf(["axis", "axisLabel", "grid", "ticks", "tickLabels"]),
      eventKey: PropTypes.oneOfType([PropTypes.array, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
      eventHandlers: PropTypes.object
    })),
    fixLabelOverlap: PropTypes.bool,
    gridComponent: PropTypes.element,
    groupComponent: PropTypes.element,
    invertAxis: PropTypes.bool,
    label: PropTypes.any,
    offsetX: PropTypes.number,
    offsetY: PropTypes.number,
    orientation: PropTypes.oneOf(["top", "bottom", "left", "right"]),
    origin: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    stringMap: PropTypes.object,
    style: PropTypes.shape({
      parent: PropTypes.object,
      axis: PropTypes.object,
      axisLabel: PropTypes.object,
      grid: PropTypes.object,
      ticks: PropTypes.object,
      tickLabels: PropTypes.object
    }),
    tickComponent: PropTypes.element,
    tickCount: CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.greaterThanZero]),
    tickFormat: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.homogeneousArray]),
    tickLabelComponent: PropTypes.element,
    tickValues: CustomPropTypes.homogeneousArray
  })
});
Object.defineProperty(VictoryAxis, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    axisComponent: React.createElement(LineSegment, {
      type: "axis"
    }),
    axisLabelComponent: React.createElement(VictoryLabel, null),
    tickLabelComponent: React.createElement(VictoryLabel, null),
    tickComponent: React.createElement(LineSegment, {
      type: "tick"
    }),
    gridComponent: React.createElement(LineSegment, {
      type: "grid"
    }),
    standalone: true,
    theme: VictoryTheme.grayscale,
    containerComponent: React.createElement(VictoryContainer, null),
    groupComponent: React.createElement("g", {
      role: "presentation"
    }),
    fixLabelOverlap: false
  }
});
Object.defineProperty(VictoryAxis, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: Axis.getDomain
});
Object.defineProperty(VictoryAxis, "getAxis", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: Axis.getAxis
});
Object.defineProperty(VictoryAxis, "getStyles", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return getStyles(props, fallbackProps.style);
  }
});
Object.defineProperty(VictoryAxis, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return getBaseProps(props, fallbackProps);
  }
});
Object.defineProperty(VictoryAxis, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["axisComponent", "axisLabelComponent", "groupComponent", "containerComponent", "tickComponent", "tickLabelComponent", "gridComponent"]
});
export default addEvents(VictoryAxis, options);