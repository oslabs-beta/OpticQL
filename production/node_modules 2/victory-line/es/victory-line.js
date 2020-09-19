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
import Curve from "./curve";
import { PropTypes as CustomPropTypes, Helpers, VictoryLabel, addEvents, VictoryContainer, VictoryTheme, DefaultTransitions, VictoryClipContainer, Data, Domain, CommonProps } from "victory-core";
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

var VictoryLine =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryLine, _React$Component);

  function VictoryLine() {
    _classCallCheck(this, VictoryLine);

    return _possibleConstructorReturn(this, (VictoryLine.__proto__ || Object.getPrototypeOf(VictoryLine)).apply(this, arguments));
  }

  _createClass(VictoryLine, [{
    key: "shouldAnimate",
    // Overridden in native versions
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "render",
    value: function render() {
      var animationWhitelist = VictoryLine.animationWhitelist,
          role = VictoryLine.role;
      var props = Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var children = this.renderContinuousData(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryLine;
}(React.Component);

Object.defineProperty(VictoryLine, "animationWhitelist", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["data", "domain", "height", "padding", "samples", "style", "width"]
});
Object.defineProperty(VictoryLine, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryLine"
});
Object.defineProperty(VictoryLine, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "line"
});
Object.defineProperty(VictoryLine, "defaultTransitions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: DefaultTransitions.continuousTransitions()
});
Object.defineProperty(VictoryLine, "defaultPolarTransitions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: DefaultTransitions.continuousPolarTransitions()
});
Object.defineProperty(VictoryLine, "continuous", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: true
});
Object.defineProperty(VictoryLine, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.baseProps, CommonProps.dataProps, {
    interpolation: PropTypes.oneOfType([PropTypes.oneOf(["basis", "bundle", "cardinal", "catmullRom", "linear", "monotoneX", "monotoneY", "natural", "step", "stepAfter", "stepBefore"]), PropTypes.func]),
    label: CustomPropTypes.deprecated(PropTypes.string, "Use `labels` instead for individual data labels")
  })
});
Object.defineProperty(VictoryLine, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    containerComponent: React.createElement(VictoryContainer, null),
    dataComponent: React.createElement(Curve, null),
    labelComponent: React.createElement(VictoryLabel, {
      renderInPortal: true
    }),
    groupComponent: React.createElement(VictoryClipContainer, null),
    samples: 50,
    sortKey: "x",
    sortOrder: "ascending",
    standalone: true,
    theme: VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryLine, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: Domain.getDomain
});
Object.defineProperty(VictoryLine, "getData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: Data.getData
});
Object.defineProperty(VictoryLine, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return getBaseProps(props, fallbackProps);
  }
});
Object.defineProperty(VictoryLine, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["dataComponent", "labelComponent", "groupComponent", "containerComponent"]
});
export default addEvents(VictoryLine, options);