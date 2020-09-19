function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import PropTypes from "prop-types";
import React from "react";
import { getBaseProps } from "./helper-methods";
import Area from "./area";
import { PropTypes as CustomPropTypes, Helpers, VictoryLabel, VictoryContainer, CommonProps, DefaultTransitions, VictoryClipContainer, addEvents, VictoryTheme, Data, Domain } from "victory-core";
var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50,
  interpolation: "linear"
};
var options = {
  components: [{
    name: "parent",
    index: "parent"
  }, {
    name: "data",
    index: "all"
  }, {
    name: "labels"
  }]
};

var VictoryArea =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryArea, _React$Component);

  function VictoryArea() {
    _classCallCheck(this, VictoryArea);

    return _possibleConstructorReturn(this, (VictoryArea.__proto__ || Object.getPrototypeOf(VictoryArea)).apply(this, arguments));
  }

  _createClass(VictoryArea, [{
    key: "shouldAnimate",
    // Overridden in native versions
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "render",
    value: function render() {
      var animationWhitelist = VictoryArea.animationWhitelist,
          role = VictoryArea.role;
      var props = Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var children = this.renderContinuousData(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryArea;
}(React.Component);

Object.defineProperty(VictoryArea, "animationWhitelist", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["data", "domain", "height", "padding", "style", "width"]
});
Object.defineProperty(VictoryArea, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.baseProps, CommonProps.dataProps, {
    interpolation: PropTypes.oneOfType([PropTypes.oneOf(["basis", "cardinal", "catmullRom", "linear", "monotoneX", "monotoneY", "natural", "step", "stepAfter", "stepBefore"]), PropTypes.func]),
    label: CustomPropTypes.deprecated(PropTypes.string, "Use `labels` instead for individual data labels")
  })
});
Object.defineProperty(VictoryArea, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    containerComponent: React.createElement(VictoryContainer, null),
    dataComponent: React.createElement(Area, null),
    groupComponent: React.createElement(VictoryClipContainer, null),
    labelComponent: React.createElement(VictoryLabel, {
      renderInPortal: true
    }),
    samples: 50,
    sortKey: "x",
    sortOrder: "ascending",
    standalone: true,
    theme: VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryArea, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryArea"
});
Object.defineProperty(VictoryArea, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "area"
});
Object.defineProperty(VictoryArea, "continuous", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: true
});
Object.defineProperty(VictoryArea, "defaultTransitions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: DefaultTransitions.continuousTransitions()
});
Object.defineProperty(VictoryArea, "defaultPolarTransitions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: DefaultTransitions.continuousPolarTransitions()
});
Object.defineProperty(VictoryArea, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: Domain.getDomainWithZero
});
Object.defineProperty(VictoryArea, "getData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: Data.getData
});
Object.defineProperty(VictoryArea, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return getBaseProps(props, fallbackProps);
  }
});
Object.defineProperty(VictoryArea, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["dataComponent", "labelComponent", "groupComponent", "containerComponent"]
});
export default addEvents(VictoryArea, options);