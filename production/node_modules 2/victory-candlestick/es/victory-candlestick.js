import _flatten from "lodash/flatten";
import _isNil from "lodash/isNil";

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
import { PropTypes as CustomPropTypes, Helpers, VictoryLabel, addEvents, VictoryContainer, VictoryTheme, DefaultTransitions, CommonProps } from "victory-core";
import Candle from "./candle";
import { getDomain, getData, getBaseProps } from "./helper-methods";
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
  return !_isNil(datum._x) && !_isNil(datum._y);
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
      return !_isNil(datum._x) && !_isNil(datum._high) && !_isNil(datum._low) && !_isNil(datum._close) && !_isNil(datum._open);
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
          validDataComponents.push(React.cloneElement(dataComponent, dataProps));
        }

        return validDataComponents;
      }, []);

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

      var labelsComponents = this.dataKeys.map(function (_dataKey, index) {
        var labelProps = _this.getComponentProps(labelComponent, "labels", index);

        if (labelProps.text !== undefined && labelProps.text !== null) {
          return React.cloneElement(labelComponent, labelProps);
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
      var props = Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var children = this.renderCandleData(props, this.shouldRenderDatum);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryCandlestick;
}(React.Component);

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
  value: DefaultTransitions.discreteTransitions()
});
Object.defineProperty(VictoryCandlestick, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.baseProps, CommonProps.dataProps, {
    candleColors: PropTypes.shape({
      positive: PropTypes.string,
      negative: PropTypes.string
    }),
    candleRatio: PropTypes.number,
    candleWidth: PropTypes.oneOfType([PropTypes.func, PropTypes.number]),
    close: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    closeLabelComponent: PropTypes.element,
    closeLabels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
    events: PropTypes.arrayOf(PropTypes.shape({
      target: PropTypes.oneOf(["data", "labels", "open", "openLabels", "close", "closeLabels", "low", "lowLabels", "high", "highLabels"]),
      eventKey: PropTypes.oneOfType([PropTypes.array, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
      eventHandlers: PropTypes.object
    })),
    high: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    highLabelComponent: PropTypes.element,
    highLabels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
    labelOrientation: PropTypes.oneOfType([PropTypes.oneOf(["top", "bottom", "left", "right"]), PropTypes.shape({
      open: PropTypes.oneOf(["top", "bottom", "left", "right"]),
      close: PropTypes.oneOf(["top", "bottom", "left", "right"]),
      low: PropTypes.oneOf(["top", "bottom", "left", "right"]),
      high: PropTypes.oneOf(["top", "bottom", "left", "right"])
    })]),
    low: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    lowLabelComponent: PropTypes.element,
    lowLabels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
    open: PropTypes.oneOfType([PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
    openLabelComponent: PropTypes.element,
    openLabels: PropTypes.oneOfType([PropTypes.func, PropTypes.array, PropTypes.bool]),
    style: PropTypes.shape({
      data: PropTypes.object,
      labels: PropTypes.object,
      close: PropTypes.object,
      closeLabels: PropTypes.object,
      open: PropTypes.object,
      openLabels: PropTypes.object,
      high: PropTypes.object,
      highLabels: PropTypes.object,
      low: PropTypes.object,
      lowLabels: PropTypes.object
    }),
    wickStrokeWidth: PropTypes.number
  })
});
Object.defineProperty(VictoryCandlestick, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    defaultCandleWidth: 8,
    containerComponent: React.createElement(VictoryContainer, null),
    data: defaultData,
    dataComponent: React.createElement(Candle, null),
    groupComponent: React.createElement("g", {
      role: "presentation"
    }),
    labelComponent: React.createElement(VictoryLabel, null),
    highLabelComponent: React.createElement(VictoryLabel, null),
    lowLabelComponent: React.createElement(VictoryLabel, null),
    openLabelComponent: React.createElement(VictoryLabel, null),
    closeLabelComponent: React.createElement(VictoryLabel, null),
    samples: 50,
    sortOrder: "ascending",
    standalone: true,
    theme: VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryCandlestick, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: getDomain
});
Object.defineProperty(VictoryCandlestick, "getData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: getData
});
Object.defineProperty(VictoryCandlestick, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return getBaseProps(props, fallbackProps);
  }
});
Object.defineProperty(VictoryCandlestick, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["openLabelComponent", "closeLabelComponent", "highLabelComponent", "lowLabelComponent", "dataComponent", "labelComponent", "groupComponent", "containerComponent"]
});
export default addEvents(VictoryCandlestick, options);