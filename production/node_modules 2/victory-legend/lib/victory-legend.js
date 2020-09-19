"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _helperMethods = require("./helper-methods");

var _victoryCore = require("victory-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

        return _react.default.cloneElement(dataComponent, dataProps);
      }).filter(Boolean);
      var labelComponents = this.dataKeys.map(function (_dataKey, index) {
        if (_dataKey === "all") {
          return undefined;
        }

        var labelProps = _this.getComponentProps(labelComponent, "labels", index);

        if (labelProps.text !== undefined && labelProps.text !== null) {
          return _react.default.cloneElement(labelComponent, labelProps);
        }

        return undefined;
      }).filter(Boolean);
      var borderProps = this.getComponentProps(props.borderComponent, "border", "all");

      var borderComponent = _react.default.cloneElement(props.borderComponent, borderProps);

      if (title) {
        var titleProps = this.getComponentProps(props.title, "title", "all");

        var titleComponent = _react.default.cloneElement(props.titleComponent, titleProps);

        return [borderComponent].concat(_toConsumableArray(dataComponents), [titleComponent], _toConsumableArray(labelComponents));
      }

      return [borderComponent].concat(_toConsumableArray(dataComponents), _toConsumableArray(labelComponents));
    }
  }, {
    key: "render",
    value: function render() {
      var role = this.constructor.role;

      var props = _victoryCore.Helpers.modifyProps(this.props, fallbackProps, role);

      var children = [this.renderChildren(props)];
      return props.standalone ? this.renderContainer(props.containerComponent, children) : _react.default.cloneElement(props.groupComponent, {}, children);
    }
  }]);

  return VictoryLegend;
}(_react.default.Component);

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
    borderComponent: _propTypes.default.element,
    borderPadding: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
      top: _propTypes.default.number,
      bottom: _propTypes.default.number,
      left: _propTypes.default.number,
      right: _propTypes.default.number
    })]),
    centerTitle: _propTypes.default.bool,
    colorScale: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.string), _propTypes.default.oneOf(["grayscale", "qualitative", "heatmap", "warm", "cool", "red", "green", "blue"])]),
    containerComponent: _propTypes.default.element,
    data: _propTypes.default.arrayOf(_propTypes.default.shape({
      name: _propTypes.default.string.isRequired,
      label: _propTypes.default.object,
      symbol: _propTypes.default.object
    })),
    dataComponent: _propTypes.default.element,
    eventKey: _propTypes.default.oneOfType([_propTypes.default.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string]),
    events: _propTypes.default.arrayOf(_propTypes.default.shape({
      target: _propTypes.default.oneOf(["data", "labels", "parent"]),
      eventKey: _propTypes.default.oneOfType([_propTypes.default.array, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string]),
      eventHandlers: _propTypes.default.object
    })),
    externalEventMutations: _propTypes.default.arrayOf(_propTypes.default.shape({
      callback: _propTypes.default.function,
      childName: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]),
      eventKey: _propTypes.default.oneOfType([_propTypes.default.array, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string]),
      mutation: _propTypes.default.function,
      target: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array])
    })),
    groupComponent: _propTypes.default.element,
    gutter: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
      left: _propTypes.default.number,
      right: _propTypes.default.number
    })]),
    height: _victoryCore.PropTypes.nonNegative,
    itemsPerRow: _victoryCore.PropTypes.nonNegative,
    labelComponent: _propTypes.default.element,
    name: _propTypes.default.string,
    orientation: _propTypes.default.oneOf(["horizontal", "vertical"]),
    padding: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
      top: _propTypes.default.number,
      bottom: _propTypes.default.number,
      left: _propTypes.default.number,
      right: _propTypes.default.number
    })]),
    rowGutter: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
      top: _propTypes.default.number,
      bottom: _propTypes.default.number
    })]),
    sharedEvents: _propTypes.default.shape({
      events: _propTypes.default.array,
      getEventState: _propTypes.default.func
    }),
    standalone: _propTypes.default.bool,
    style: _propTypes.default.shape({
      border: _propTypes.default.object,
      data: _propTypes.default.object,
      labels: _propTypes.default.object,
      parent: _propTypes.default.object,
      title: _propTypes.default.object
    }),
    symbolSpacer: _propTypes.default.number,
    theme: _propTypes.default.object,
    title: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]),
    titleComponent: _propTypes.default.element,
    titleOrientation: _propTypes.default.oneOf(["top", "bottom", "left", "right"]),
    width: _victoryCore.PropTypes.nonNegative,
    x: _victoryCore.PropTypes.nonNegative,
    y: _victoryCore.PropTypes.nonNegative
  }
});
Object.defineProperty(VictoryLegend, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    borderComponent: _react.default.createElement(_victoryCore.Border, null),
    data: defaultLegendData,
    containerComponent: _react.default.createElement(_victoryCore.VictoryContainer, null),
    dataComponent: _react.default.createElement(_victoryCore.Point, null),
    groupComponent: _react.default.createElement("g", null),
    labelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    standalone: true,
    theme: _victoryCore.VictoryTheme.grayscale,
    titleComponent: _react.default.createElement(_victoryCore.VictoryLabel, null)
  }
});
Object.defineProperty(VictoryLegend, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return (0, _helperMethods.getBaseProps)(props, fallbackProps);
  }
});
Object.defineProperty(VictoryLegend, "getDimensions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return (0, _helperMethods.getDimensions)(props, fallbackProps);
  }
});
Object.defineProperty(VictoryLegend, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["borderComponent", "containerComponent", "dataComponent", "groupComponent", "labelComponent", "titleComponent"]
});

var _default = (0, _victoryCore.addEvents)(VictoryLegend);

exports.default = _default;