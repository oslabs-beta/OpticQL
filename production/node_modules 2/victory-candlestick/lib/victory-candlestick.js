"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _victoryCore = require("victory-core");

var _candle = _interopRequireDefault(require("./candle"));

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

/*eslint-disable no-magic-numbers */
var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50,
  candleColors: {
    positive: "#ffffff",
    negative: "#252525"
  }
};
var options = {
  components: [{
    name: "lowLabels"
  }, {
    name: "highLabels"
  }, {
    name: "openLabels"
  }, {
    name: "closeLabels"
  }, {
    name: "labels"
  }, {
    name: "data"
  }, {
    name: "parent",
    index: "parent"
  }]
};
var defaultData = [{
  x: new Date(2016, 6, 1),
  open: 5,
  close: 10,
  high: 15,
  low: 0
}, {
  x: new Date(2016, 6, 2),
  open: 10,
  close: 15,
  high: 20,
  low: 5
}, {
  x: new Date(2016, 6, 3),
  open: 15,
  close: 20,
  high: 25,
  low: 10
}, {
  x: new Date(2016, 6, 4),
  open: 20,
  close: 25,
  high: 30,
  low: 15
}, {
  x: new Date(2016, 6, 5),
  open: 25,
  close: 30,
  high: 35,
  low: 20
}, {
  x: new Date(2016, 6, 6),
  open: 30,
  close: 35,
  high: 40,
  low: 25
}, {
  x: new Date(2016, 6, 7),
  open: 35,
  close: 40,
  high: 45,
  low: 30
}, {
  x: new Date(2016, 6, 8),
  open: 40,
  close: 45,
  high: 50,
  low: 35
}];
/*eslint-enable no-magic-numbers */

var datumHasXandY = function (datum) {
  return !(0, _isNil2.default)(datum._x) && !(0, _isNil2.default)(datum._y);
};

var VictoryCandlestick =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryCandlestick, _React$Component);

  function VictoryCandlestick() {
    _classCallCheck(this, VictoryCandlestick);

    return _possibleConstructorReturn(this, (VictoryCandlestick.__proto__ || Object.getPrototypeOf(VictoryCandlestick)).apply(this, arguments));
  }

  _createClass(VictoryCandlestick, [{
    key: "shouldAnimate",
    // Overridden in native versions
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "shouldRenderDatum",
    value: function shouldRenderDatum(datum) {
      return !(0, _isNil2.default)(datum._x) && !(0, _isNil2.default)(datum._high) && !(0, _isNil2.default)(datum._low) && !(0, _isNil2.default)(datum._close) && !(0, _isNil2.default)(datum._open);
    }
  }, {
    key: "renderCandleData",
    value: function renderCandleData(props) {
      var _this = this;

      var shouldRenderDatum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : datumHasXandY;
      var dataComponent = props.dataComponent,
          labelComponent = props.labelComponent,
          groupComponent = props.groupComponent;
      var types = ["close", "open", "low", "high"];
      var dataComponents = this.dataKeys.reduce(function (validDataComponents, _dataKey, index) {
        var dataProps = _this.getComponentProps(dataComponent, "data", index);

        if (shouldRenderDatum(dataProps.datum)) {
          validDataComponents.push(_react.default.cloneElement(dataComponent, dataProps));
        }

        return validDataComponents;
      }, []);
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
      var labelsComponents = this.dataKeys.map(function (_dataKey, index) {
        var labelProps = _this.getComponentProps(labelComponent, "labels", index);

        if (labelProps.text !== undefined && labelProps.text !== null) {
          return _react.default.cloneElement(labelComponent, labelProps);
        }

        return undefined;
      }).filter(Boolean);

      var children = _toConsumableArray(dataComponents).concat(_toConsumableArray(labelComponents), _toConsumableArray(labelsComponents));

      return this.renderContainer(groupComponent, children);
    }
  }, {
    key: "render",
    value: function render() {
      var animationWhitelist = VictoryCandlestick.animationWhitelist,
          role = VictoryCandlestick.role;

      var props = _victoryCore.Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var children = this.renderCandleData(props, this.shouldRenderDatum);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryCandlestick;
}(_react.default.Component);

Object.defineProperty(VictoryCandlestick, "animationWhitelist", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["data", "domain", "height", "padding", "samples", "size", "style", "width"]
});
Object.defineProperty(VictoryCandlestick, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryCandlestick"
});
Object.defineProperty(VictoryCandlestick, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "candlestick"
});
Object.defineProperty(VictoryCandlestick, "defaultTransitions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _victoryCore.DefaultTransitions.discreteTransitions()
});
Object.defineProperty(VictoryCandlestick, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, _victoryCore.CommonProps.baseProps, _victoryCore.CommonProps.dataProps, {
    candleColors: _propTypes.default.shape({
      positive: _propTypes.default.string,
      negative: _propTypes.default.string
    }),
    candleRatio: _propTypes.default.number,
    candleWidth: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.number]),
    close: _propTypes.default.oneOfType([_propTypes.default.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
    closeLabelComponent: _propTypes.default.element,
    closeLabels: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.array, _propTypes.default.bool]),
    events: _propTypes.default.arrayOf(_propTypes.default.shape({
      target: _propTypes.default.oneOf(["data", "labels", "open", "openLabels", "close", "closeLabels", "low", "lowLabels", "high", "highLabels"]),
      eventKey: _propTypes.default.oneOfType([_propTypes.default.array, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string]),
      eventHandlers: _propTypes.default.object
    })),
    high: _propTypes.default.oneOfType([_propTypes.default.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
    highLabelComponent: _propTypes.default.element,
    highLabels: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.array, _propTypes.default.bool]),
    labelOrientation: _propTypes.default.oneOfType([_propTypes.default.oneOf(["top", "bottom", "left", "right"]), _propTypes.default.shape({
      open: _propTypes.default.oneOf(["top", "bottom", "left", "right"]),
      close: _propTypes.default.oneOf(["top", "bottom", "left", "right"]),
      low: _propTypes.default.oneOf(["top", "bottom", "left", "right"]),
      high: _propTypes.default.oneOf(["top", "bottom", "left", "right"])
    })]),
    low: _propTypes.default.oneOfType([_propTypes.default.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
    lowLabelComponent: _propTypes.default.element,
    lowLabels: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.array, _propTypes.default.bool]),
    open: _propTypes.default.oneOfType([_propTypes.default.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
    openLabelComponent: _propTypes.default.element,
    openLabels: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.array, _propTypes.default.bool]),
    style: _propTypes.default.shape({
      data: _propTypes.default.object,
      labels: _propTypes.default.object,
      close: _propTypes.default.object,
      closeLabels: _propTypes.default.object,
      open: _propTypes.default.object,
      openLabels: _propTypes.default.object,
      high: _propTypes.default.object,
      highLabels: _propTypes.default.object,
      low: _propTypes.default.object,
      lowLabels: _propTypes.default.object
    }),
    wickStrokeWidth: _propTypes.default.number
  })
});
Object.defineProperty(VictoryCandlestick, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    defaultCandleWidth: 8,
    containerComponent: _react.default.createElement(_victoryCore.VictoryContainer, null),
    data: defaultData,
    dataComponent: _react.default.createElement(_candle.default, null),
    groupComponent: _react.default.createElement("g", {
      role: "presentation"
    }),
    labelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    highLabelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    lowLabelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    openLabelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    closeLabelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    samples: 50,
    sortOrder: "ascending",
    standalone: true,
    theme: _victoryCore.VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryCandlestick, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _helperMethods.getDomain
});
Object.defineProperty(VictoryCandlestick, "getData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _helperMethods.getData
});
Object.defineProperty(VictoryCandlestick, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return (0, _helperMethods.getBaseProps)(props, fallbackProps);
  }
});
Object.defineProperty(VictoryCandlestick, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["openLabelComponent", "closeLabelComponent", "highLabelComponent", "lowLabelComponent", "dataComponent", "labelComponent", "groupComponent", "containerComponent"]
});

var _default = (0, _victoryCore.addEvents)(VictoryCandlestick, options);

exports.default = _default;