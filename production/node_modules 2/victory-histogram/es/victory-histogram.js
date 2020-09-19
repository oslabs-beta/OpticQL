function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from "react";
import PropTypes from "prop-types";
import { Bar } from "victory-bar";
import { Helpers, VictoryLabel, VictoryContainer, VictoryTheme, CommonProps, addEvents, PropTypes as CustomPropTypes } from "victory-core";
import { getBaseProps, getData, getDomain, getFormattedData } from "./helper-methods";
var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};
var defaultData = [];
export var VictoryHistogram =
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
      var props = Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var children = this.renderData(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryHistogram;
}(React.Component);
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
  value: getFormattedData
});
Object.defineProperty(VictoryHistogram, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.baseProps, CommonProps.dataProps, {
    binSpacing: CustomPropTypes.nonNegative,
    bins: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([CustomPropTypes.nonNegative, PropTypes.instanceOf(Date)])), CustomPropTypes.nonNegative]),
    cornerRadius: PropTypes.oneOfType([PropTypes.number, PropTypes.func, PropTypes.shape({
      top: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      topLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      topRight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      bottom: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      bottomLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
      bottomRight: PropTypes.oneOfType([PropTypes.number, PropTypes.func])
    })]),
    getPath: PropTypes.func,
    horizontal: PropTypes.bool
  })
});
Object.defineProperty(VictoryHistogram, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    containerComponent: React.createElement(VictoryContainer, null),
    data: defaultData,
    dataComponent: React.createElement(Bar, null),
    groupComponent: React.createElement("g", {
      role: "presentation"
    }),
    labelComponent: React.createElement(VictoryLabel, null),
    samples: 50,
    sortOrder: "ascending",
    standalone: true,
    theme: VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryHistogram, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: getDomain
});
Object.defineProperty(VictoryHistogram, "getData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: getData
});
Object.defineProperty(VictoryHistogram, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return getBaseProps(props, fallbackProps);
  }
});
Object.defineProperty(VictoryHistogram, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["dataComponent", "labelComponent", "groupComponent", "containerComponent"]
});
export default addEvents(VictoryHistogram);