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
import Bar from "./bar";
import { Helpers, VictoryLabel, VictoryContainer, VictoryTheme, CommonProps, addEvents, Data, Domain } from "victory-core";
var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};
var defaultData = [{
  x: 1,
  y: 1
}, {
  x: 2,
  y: 2
}, {
  x: 3,
  y: 3
}, {
  x: 4,
  y: 4
}];

var VictoryBar =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryBar, _React$Component);

  function VictoryBar() {
    _classCallCheck(this, VictoryBar);

    return _possibleConstructorReturn(this, (VictoryBar.__proto__ || Object.getPrototypeOf(VictoryBar)).apply(this, arguments));
  }

  _createClass(VictoryBar, [{
    key: "shouldAnimate",
    // Overridden in native versions
    value: function shouldAnimate() {
      return !!this.props.animate;
    }
  }, {
    key: "render",
    value: function render() {
      var animationWhitelist = VictoryBar.animationWhitelist,
          role = VictoryBar.role;
      var props = Helpers.modifyProps(this.props, fallbackProps, role);

      if (this.shouldAnimate()) {
        return this.animateComponent(props, animationWhitelist);
      }

      var children = this.renderData(props);
      return props.standalone ? this.renderContainer(props.containerComponent, children) : children;
    }
  }]);

  return VictoryBar;
}(React.Component);

Object.defineProperty(VictoryBar, "animationWhitelist", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["data", "domain", "height", "padding", "style", "width"]
});
Object.defineProperty(VictoryBar, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryBar"
});
Object.defineProperty(VictoryBar, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "bar"
});
Object.defineProperty(VictoryBar, "defaultTransitions", {
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
Object.defineProperty(VictoryBar, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.baseProps, CommonProps.dataProps, {
    alignment: PropTypes.oneOf(["start", "middle", "end"]),
    barRatio: PropTypes.number,
    barWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
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
Object.defineProperty(VictoryBar, "defaultProps", {
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
Object.defineProperty(VictoryBar, "getDomain", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: Domain.getDomainWithZero
});
Object.defineProperty(VictoryBar, "getData", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: Data.getData
});
Object.defineProperty(VictoryBar, "getBaseProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: function (props) {
    return getBaseProps(props, fallbackProps);
  }
});
Object.defineProperty(VictoryBar, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["dataComponent", "labelComponent", "groupComponent", "containerComponent"]
});
export default addEvents(VictoryBar);