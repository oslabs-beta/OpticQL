function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "../victory-util/prop-types";

var Portal =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Portal, _React$Component);

  function Portal(props) {
    var _this;

    _classCallCheck(this, Portal);

    _this = _possibleConstructorReturn(this, (Portal.__proto__ || Object.getPrototypeOf(Portal)).call(this, props));
    _this.map = {};
    _this.index = 1;
    _this.portalUpdate = _this.portalUpdate.bind(_assertThisInitialized(_this));
    _this.portalRegister = _this.portalRegister.bind(_assertThisInitialized(_this));
    _this.portalDeregister = _this.portalDeregister.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(Portal, [{
    key: "portalRegister",
    value: function portalRegister() {
      return ++this.index;
    }
  }, {
    key: "portalUpdate",
    value: function portalUpdate(key, element) {
      this.map[key] = element;
      this.forceUpdate();
    }
  }, {
    key: "portalDeregister",
    value: function portalDeregister(key) {
      delete this.map[key];
      this.forceUpdate();
    }
  }, {
    key: "getChildren",
    value: function getChildren() {
      var _this2 = this;

      return Object.keys(this.map).map(function (key) {
        var el = _this2.map[key];
        return el ? React.cloneElement(el, {
          key: key
        }) : el;
      });
    } // Overridden in victory-core-native

  }, {
    key: "render",
    value: function render() {
      return React.createElement("svg", this.props, this.getChildren());
    }
  }]);

  return Portal;
}(React.Component);

Object.defineProperty(Portal, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "Portal"
});
Object.defineProperty(Portal, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    className: PropTypes.string,
    height: CustomPropTypes.nonNegative,
    style: PropTypes.object,
    viewBox: PropTypes.string,
    width: CustomPropTypes.nonNegative
  }
});
export { Portal as default };