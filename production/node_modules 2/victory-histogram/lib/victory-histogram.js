"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.VictoryHistogram = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _victoryBar = require("victory-bar");

var _victoryCore = require("victory-core");

var _helperMethods = require("./helper-methods");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};
var defaultData = [];

var VictoryHistogram =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryHistogram, _React$Component);

  function VictoryHistogram() {
    _classCallCheck(this, VictoryHistogram);

    return _possibleConstructorReturn(this, (VictoryHistogram.__proto__ || Object.getPrototypeOf(VictoryHistogram)).apply(this, arguments));
  }

  _createClass(VictoryHistogram, [{
    key: "shouldAnimate",
    // Overridden in native versions
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "render",
    value: function render() {
      var animationWhitelist = VictoryHistogram.animationWhitelist,
          role = VictoryHistogram.role;

      var props = _victoryCore.Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var children = this.renderData(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryHistogram;
}(_react.default.Component);

exports.VictoryHistogram = VictoryHistogram;
Object.defineProperty(VictoryHistogram, "animationWhitelist", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["data", "domain", "height", "padding", "style", "width"]
});
Object.defineProperty(VictoryHistogram, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryHistogram"
});
Object.defineProperty(VictoryHistogram, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "histogram"
});
Object.defineProperty(VictoryHistogram, "defaultTransitions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    onLoad: {
      duration: 2000,
      before: function () {
        return {
          _y: 0,
          _y1: 0,
          _y0: 0
        };
      },
      after: function (datum) {
        return {
          _y: datum._y,
          _y1: datum._y1,
          _y0: datum._y0
        };
      }
    },
    onExit: {
      duration: 500,
      before: function () {
        return {
          _y: 0,
          yOffset: 0
        };
      }
    },
    onEnter: {
      duration: 500,
      before: function () {
        return {
          _y: 0,
          _y1: 0,
          _y0: 0
        };
      },
      after: function (datum) {
        return {
          _y: datum._y,
          _y1: datum._y1,
          _y0: datum._y0
        };
      }
    }
  }
});
Object.defineProperty(VictoryHistogram, "getFormattedData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _helperMethods.getFormattedData
});
Object.defineProperty(VictoryHistogram, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, _victoryCore.CommonProps.baseProps, _victoryCore.CommonProps.dataProps, {
    binSpacing: _victoryCore.PropTypes.nonNegative,
    bins: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_victoryCore.PropTypes.nonNegative, _propTypes.default.instanceOf(Date)])), _victoryCore.PropTypes.nonNegative]),
    cornerRadius: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func, _propTypes.default.shape({
      top: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
      topLeft: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
      topRight: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
      bottom: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
      bottomLeft: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
      bottomRight: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func])
    })]),
    getPath: _propTypes.default.func,
    horizontal: _propTypes.default.bool
  })
});
Object.defineProperty(VictoryHistogram, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    containerComponent: _react.default.createElement(_victoryCore.VictoryContainer, null),
    data: defaultData,
    dataComponent: _react.default.createElement(_victoryBar.Bar, null),
    groupComponent: _react.default.createElement("g", {
      role: "presentation"
    }),
    labelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    samples: 50,
    sortOrder: "ascending",
    standalone: true,
    theme: _victoryCore.VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryHistogram, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _helperMethods.getDomain
});
Object.defineProperty(VictoryHistogram, "getData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _helperMethods.getData
});
Object.defineProperty(VictoryHistogram, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return (0, _helperMethods.getBaseProps)(props, fallbackProps);
  }
});
Object.defineProperty(VictoryHistogram, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["dataComponent", "labelComponent", "groupComponent", "containerComponent"]
});

var _default = (0, _victoryCore.addEvents)(VictoryHistogram);

exports.default = _default;