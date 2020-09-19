"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _log = _interopRequireDefault(require("../victory-util/log"));

var _helpers = _interopRequireDefault(require("../victory-util/helpers"));

var _portalContext = _interopRequireDefault(require("./portal-context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VictoryPortal =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryPortal, _React$Component);

  function VictoryPortal() {
    _classCallCheck(this, VictoryPortal);

    return _possibleConstructorReturn(this, (VictoryPortal.__proto__ || Object.getPrototypeOf(VictoryPortal)).apply(this, arguments));
  }

  _createClass(VictoryPortal, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.checkedContext) {
        if (typeof this.context.portalUpdate !== "function") {
          var msg = "`renderInPortal` is not supported outside of `VictoryContainer`. " + "Component will be rendered in place";

          _log.default.warn(msg);

          this.renderInPlace = true;
        }

        this.checkedContext = true;
      }

      this.forceUpdate();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (!this.renderInPlace) {
        this.portalKey = this.portalKey || this.context.portalRegister();
        this.context.portalUpdate(this.portalKey, this.element);
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.context && this.context.portalDeregister) {
        this.context.portalDeregister(this.portalKey);
      }
    } // Overridden in victory-core-native

  }, {
    key: "renderPortal",
    value: function renderPortal(child) {
      if (this.renderInPlace) {
        return child;
      }

      this.element = child;
      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var children = Array.isArray(this.props.children) ? this.props.children[0] : this.props.children;
      var groupComponent = this.props.groupComponent;
      var childProps = children && children.props || {};
      var standardProps = childProps.groupComponent ? {
        groupComponent: groupComponent,
        standalone: false
      } : {};
      var newProps = (0, _defaults2.default)(standardProps, childProps, _helpers.default.omit(this.props, ["children", "groupComponent"]));

      var child = children && _react.default.cloneElement(children, newProps);

      return this.renderPortal(child);
    }
  }]);

  return VictoryPortal;
}(_react.default.Component);

exports.default = VictoryPortal;
Object.defineProperty(VictoryPortal, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryPortal"
});
Object.defineProperty(VictoryPortal, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "portal"
});
Object.defineProperty(VictoryPortal, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    children: _propTypes.default.node,
    groupComponent: _propTypes.default.element
  }
});
Object.defineProperty(VictoryPortal, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    groupComponent: _react.default.createElement("g", null)
  }
});
Object.defineProperty(VictoryPortal, "contextType", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _portalContext.default
});