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
import { getBaseProps, getDimensions } from "./helper-methods";
import { PropTypes as CustomPropTypes, addEvents, Helpers, VictoryLabel, VictoryContainer, VictoryTheme, Point, Border } from "victory-core";
var fallbackProps = {
  orientation: "vertical",
  titleOrientation: "top",
  width: 450,
  height: 300,
  x: 0,
  y: 0
};
var defaultLegendData = [{
  name: "Series 1"
}, {
  name: "Series 2"
}];

var VictoryLegend =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryLegend, _React$Component);

  function VictoryLegend() {
    _classCallCheck(this, VictoryLegend);

    return _possibleConstructorReturn(this, (VictoryLegend.__proto__ || Object.getPrototypeOf(VictoryLegend)).apply(this, arguments));
  }

  _createClass(VictoryLegend, [{
    key: "renderChildren",
    value: function renderChildren(props) {
      var _this = this;

      var dataComponent = props.dataComponent,
          labelComponent = props.labelComponent,
          title = props.title;
      var dataComponents = this.dataKeys.map(function (_dataKey, index) {
        if (_dataKey === "all") {
          return undefined;
        }

        var dataProps = _this.getComponentProps(dataComponent, "data", index);

        return React.cloneElement(dataComponent, dataProps);
      }).filter(Boolean);
      var labelComponents = this.dataKeys.map(function (_dataKey, index) {
        if (_dataKey === "all") {
          return undefined;
        }

        var labelProps = _this.getComponentProps(labelComponent, "labels", index);

        if (labelProps.text !== undefined && labelProps.text !== null) {
          return React.cloneElement(labelComponent, labelProps);
        }

        return undefined;
      }).filter(Boolean);
      var borderProps = this.getComponentProps(props.borderComponent, "border", "all");
      var borderComponent = React.cloneElement(props.borderComponent, borderProps);

      if (title) {
        var titleProps = this.getComponentProps(props.title, "title", "all");
        var titleComponent = React.cloneElement(props.titleComponent, titleProps);
        return [borderComponent].concat(_toConsumableArray(dataComponents), [titleComponent], _toConsumableArray(labelComponents));
      }

      return [borderComponent].concat(_toConsumableArray(dataComponents), _toConsumableArray(labelComponents));
    }
  }, {
    key: "render",
    value: function render() {
      var role = this.constructor.role;
      var props = Helpers.modifyProps(this.props, fallbackProps, role);
      var children = [this.renderChildren(props)];
      return props.standalone ? this.renderContainer(props.containerComponent, children) : React.cloneElement(props.groupComponent, {}, children);
    }
  }]);

  return VictoryLegend;
}(React.Component);

Object.defineProperty(VictoryLegend, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryLegend"
});
Object.defineProperty(VictoryLegend, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "legend"
});
Object.defineProperty(VictoryLegend, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    borderComponent: PropTypes.element,
    borderPadding: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    })]),
    centerTitle: PropTypes.bool,
    colorScale: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.oneOf(["grayscale", "qualitative", "heatmap", "warm", "cool", "red", "green", "blue"])]),
    containerComponent: PropTypes.element,
    data: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.object,
      symbol: PropTypes.object
    })),
    dataComponent: PropTypes.element,
    eventKey: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
    events: PropTypes.arrayOf(PropTypes.shape({
      target: PropTypes.oneOf(["data", "labels", "parent"]),
      eventKey: PropTypes.oneOfType([PropTypes.array, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
      eventHandlers: PropTypes.object
    })),
    externalEventMutations: PropTypes.arrayOf(PropTypes.shape({
      callback: PropTypes.function,
      childName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      eventKey: PropTypes.oneOfType([PropTypes.array, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
      mutation: PropTypes.function,
      target: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    })),
    groupComponent: PropTypes.element,
    gutter: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
      left: PropTypes.number,
      right: PropTypes.number
    })]),
    height: CustomPropTypes.nonNegative,
    itemsPerRow: CustomPropTypes.nonNegative,
    labelComponent: PropTypes.element,
    name: PropTypes.string,
    orientation: PropTypes.oneOf(["horizontal", "vertical"]),
    padding: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
      right: PropTypes.number
    })]),
    rowGutter: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
      top: PropTypes.number,
      bottom: PropTypes.number
    })]),
    sharedEvents: PropTypes.shape({
      events: PropTypes.array,
      getEventState: PropTypes.func
    }),
    standalone: PropTypes.bool,
    style: PropTypes.shape({
      border: PropTypes.object,
      data: PropTypes.object,
      labels: PropTypes.object,
      parent: PropTypes.object,
      title: PropTypes.object
    }),
    symbolSpacer: PropTypes.number,
    theme: PropTypes.object,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    titleComponent: PropTypes.element,
    titleOrientation: PropTypes.oneOf(["top", "bottom", "left", "right"]),
    width: CustomPropTypes.nonNegative,
    x: CustomPropTypes.nonNegative,
    y: CustomPropTypes.nonNegative
  }
});
Object.defineProperty(VictoryLegend, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    borderComponent: React.createElement(Border, null),
    data: defaultLegendData,
    containerComponent: React.createElement(VictoryContainer, null),
    dataComponent: React.createElement(Point, null),
    groupComponent: React.createElement("g", null),
    labelComponent: React.createElement(VictoryLabel, null),
    standalone: true,
    theme: VictoryTheme.grayscale,
    titleComponent: React.createElement(VictoryLabel, null)
  }
});
Object.defineProperty(VictoryLegend, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return getBaseProps(props, fallbackProps);
  }
});
Object.defineProperty(VictoryLegend, "getDimensions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return getDimensions(props, fallbackProps);
  }
});
Object.defineProperty(VictoryLegend, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["borderComponent", "containerComponent", "dataComponent", "groupComponent", "labelComponent", "titleComponent"]
});
export default addEvents(VictoryLegend);