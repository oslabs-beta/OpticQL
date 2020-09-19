"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _victoryCore = require("victory-core");

var _errorBar = _interopRequireDefault(require("./error-bar"));

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
var defaultData = [{
  x: 1,
  y: 1,
  errorX: 0.1,
  errorY: 0.1
}, {
  x: 2,
  y: 2,
  errorX: 0.2,
  errorY: 0.2
}, {
  x: 3,
  y: 3,
  errorX: 0.3,
  errorY: 0.3
}, {
  x: 4,
  y: 4,
  errorX: 0.4,
  errorY: 0.4
}];

var VictoryErrorBar =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryErrorBar, _React$Component);

  function VictoryErrorBar() {
    _classCallCheck(this, VictoryErrorBar);

    return _possibleConstructorReturn(this, (VictoryErrorBar.__proto__ || Object.getPrototypeOf(VictoryErrorBar)).apply(this, arguments));
  }

  _createClass(VictoryErrorBar, [{
    key: "shouldAnimate",
    // Overridden in native versions
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "render",
    value: function render() {
      var animationWhitelist = VictoryErrorBar.animationWhitelist,
          role = VictoryErrorBar.role;

      var props = _victoryCore.Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var children = this.renderData(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryErrorBar;
}(_react.default.Component);

Object.defineProperty(VictoryErrorBar, "animationWhitelist", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["data", "domain", "height", "padding", "samples", "style", "width", "errorX", "errorY", "borderWidth"]
});
Object.defineProperty(VictoryErrorBar, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryErrorBar"
});
Object.defineProperty(VictoryErrorBar, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "errorbar"
});
Object.defineProperty(VictoryErrorBar, "defaultTransitions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _victoryCore.DefaultTransitions.discreteTransitions()
});
Object.defineProperty(VictoryErrorBar, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, _victoryCore.CommonProps.baseProps, _victoryCore.CommonProps.dataProps, {
    borderWidth: _propTypes.default.number,
    errorX: _propTypes.default.oneOfType([_propTypes.default.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
    errorY: _propTypes.default.oneOfType([_propTypes.default.func, _victoryCore.PropTypes.allOfType([_victoryCore.PropTypes.integer, _victoryCore.PropTypes.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
    horizontal: _propTypes.default.bool
  })
});
Object.defineProperty(VictoryErrorBar, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    containerComponent: _react.default.createElement(_victoryCore.VictoryContainer, null),
    data: defaultData,
    dataComponent: _react.default.createElement(_errorBar.default, null),
    labelComponent: _react.default.createElement(_victoryCore.VictoryLabel, null),
    groupComponent: _react.default.createElement("g", {
      role: "presentation"
    }),
    samples: 50,
    sortOrder: "ascending",
    standalone: true,
    theme: _victoryCore.VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryErrorBar, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _helperMethods.getDomain
});
Object.defineProperty(VictoryErrorBar, "getData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _helperMethods.getData
});
Object.defineProperty(VictoryErrorBar, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return (0, _helperMethods.getBaseProps)(props, fallbackProps);
  }
});
Object.defineProperty(VictoryErrorBar, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["dataComponent", "labelComponent", "groupComponent", "containerComponent"]
});

var _default = (0, _victoryCore.addEvents)(VictoryErrorBar);

exports.default = _default;