function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import { PropTypes as CustomPropTypes, Helpers, VictoryLabel, addEvents, VictoryContainer, VictoryTheme, DefaultTransitions, Data, Domain, CommonProps } from "victory-core";
import Voronoi from "./voronoi";
import { getBaseProps } from "./helper-methods";
var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};

var VictoryVoronoi =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryVoronoi, _React$Component);

  function VictoryVoronoi() {
    _classCallCheck(this, VictoryVoronoi);

    return _possibleConstructorReturn(this, (VictoryVoronoi.__proto__ || Object.getPrototypeOf(VictoryVoronoi)).apply(this, arguments));
  }

  _createClass(VictoryVoronoi, [{
    key: "shouldAnimate",
    // Overridden in native versions
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "render",
    value: function render() {
      var animationWhitelist = VictoryVoronoi.animationWhitelist,
          role = VictoryVoronoi.role;
      var props = Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var children = this.renderData(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryVoronoi;
}(React.Component);

Object.defineProperty(VictoryVoronoi, "animationWhitelist", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["data", "domain", "height", "padding", "samples", "size", "style", "width"]
});
Object.defineProperty(VictoryVoronoi, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryVoronoi"
});
Object.defineProperty(VictoryVoronoi, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "voronoi"
});
Object.defineProperty(VictoryVoronoi, "defaultTransitions", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: DefaultTransitions.discreteTransitions()
});
Object.defineProperty(VictoryVoronoi, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.baseProps, CommonProps.dataProps, {
    size: CustomPropTypes.nonNegative
  })
});
Object.defineProperty(VictoryVoronoi, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    containerComponent: React.createElement(VictoryContainer, null),
    dataComponent: React.createElement(Voronoi, null),
    labelComponent: React.createElement(VictoryLabel, null),
    groupComponent: React.createElement("g", {
      role: "presentation"
    }),
    samples: 50,
    sortOrder: "ascending",
    standalone: true,
    theme: VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryVoronoi, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: Domain.getDomain
});
Object.defineProperty(VictoryVoronoi, "getData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: Data.getData
});
Object.defineProperty(VictoryVoronoi, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return getBaseProps(props, fallbackProps);
  }
});
Object.defineProperty(VictoryVoronoi, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["dataComponent", "labelComponent", "groupComponent", "containerComponent"]
});
export default addEvents(VictoryVoronoi);