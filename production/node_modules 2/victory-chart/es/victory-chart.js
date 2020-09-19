import _isEmpty from "lodash/isEmpty";
import _assign from "lodash/assign";
import _defaults from "lodash/defaults";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

import PropTypes from "prop-types";
import React from "react";
import { Background, Helpers, VictoryContainer, VictoryTheme, CommonProps, PropTypes as CustomPropTypes, Wrapper } from "victory-core";
import { VictorySharedEvents } from "victory-shared-events";
import { VictoryAxis } from "victory-axis";
import { VictoryPolarAxis } from "victory-polar-axis";
import { getBackgroundWithProps, getChildComponents, getCalculatedProps, getChildren } from "./helper-methods";
import isEqual from "react-fast-compare";
var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};

var VictoryChart =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryChart, _React$Component);

  function VictoryChart(props) {
    var _this;

    _classCallCheck(this, VictoryChart);

    _this = _possibleConstructorReturn(this, (VictoryChart.__proto__ || Object.getPrototypeOf(VictoryChart)).call(this, props));
    _this.state = {};

    if (props.animate) {
      _this.state = {
        nodesShouldLoad: false,
        nodesDoneLoad: false,
        animating: true
      };
      _this.setAnimationState = Wrapper.setAnimationState.bind(_assertThisInitialized(_this));
    }

    return _this;
  }

  _createClass(VictoryChart, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (this.props.animate) {
        if (!isEqual(this.props, nextProps)) {
          this.setAnimationState(this.props, nextProps);
          return false;
        }
      }

      return true;
    }
  }, {
    key: "getNewChildren",
    value: function getNewChildren(props, childComponents, calculatedProps) {
      var children = getChildren(props, childComponents, calculatedProps);
      var getAnimationProps = Wrapper.getAnimationProps.bind(this);
      var newChildren = children.map(function (child, index) {
        var childProps = _assign({
          animate: getAnimationProps(props, child, index)
        }, child.props);

        return React.cloneElement(child, childProps);
      });

      if (props.style && props.style.background) {
        var backgroundComponent = getBackgroundWithProps(props, calculatedProps);
        newChildren.unshift(backgroundComponent);
      }

      return newChildren;
    }
  }, {
    key: "renderContainer",
    value: function renderContainer(containerComponent, props) {
      var containerProps = _defaults({}, containerComponent.props, props);

      return React.cloneElement(containerComponent, containerProps);
    }
  }, {
    key: "getContainerProps",
    value: function getContainerProps(props, calculatedProps) {
      var width = props.width,
          height = props.height,
          standalone = props.standalone,
          theme = props.theme,
          polar = props.polar,
          name = props.name;
      var domain = calculatedProps.domain,
          scale = calculatedProps.scale,
          style = calculatedProps.style,
          origin = calculatedProps.origin,
          radius = calculatedProps.radius,
          horizontal = calculatedProps.horizontal;
      return {
        domain: domain,
        scale: scale,
        width: width,
        height: height,
        standalone: standalone,
        theme: theme,
        style: style.parent,
        horizontal: horizontal,
        name: name,
        polar: polar,
        radius: radius,
        origin: polar ? origin : undefined
      };
    }
  }, {
    key: "render",
    value: function render() {
      var props = this.state && this.state.nodesWillExit ? this.state.oldProps || this.props : this.props;
      var modifiedProps = Helpers.modifyProps(props, fallbackProps, "chart");
      var eventKey = modifiedProps.eventKey,
          containerComponent = modifiedProps.containerComponent,
          groupComponent = modifiedProps.groupComponent,
          standalone = modifiedProps.standalone,
          externalEventMutations = modifiedProps.externalEventMutations;
      var axes = props.polar ? modifiedProps.defaultPolarAxes : modifiedProps.defaultAxes;
      var childComponents = getChildComponents(modifiedProps, axes);
      var calculatedProps = getCalculatedProps(modifiedProps, childComponents);
      var newChildren = this.getNewChildren(modifiedProps, childComponents, calculatedProps);
      var containerProps = standalone ? this.getContainerProps(modifiedProps, calculatedProps) : {};
      var container = standalone ? this.renderContainer(containerComponent, containerProps) : groupComponent;
      var events = Wrapper.getAllEvents(props);

      if (!_isEmpty(events)) {
        return React.createElement(VictorySharedEvents, {
          container: container,
          eventKey: eventKey,
          events: events,
          externalEventMutations: externalEventMutations
        }, newChildren);
      }

      return React.cloneElement(container, container.props, newChildren);
    }
  }]);

  return VictoryChart;
}(React.Component);

Object.defineProperty(VictoryChart, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryChart"
});
Object.defineProperty(VictoryChart, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, CommonProps.baseProps, {
    backgroundComponent: PropTypes.element,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    defaultAxes: PropTypes.shape({
      independent: PropTypes.element,
      dependent: PropTypes.element
    }),
    defaultPolarAxes: PropTypes.shape({
      independent: PropTypes.element,
      dependent: PropTypes.element
    }),
    endAngle: PropTypes.number,
    innerRadius: CustomPropTypes.nonNegative,
    prependDefaultAxes: PropTypes.bool,
    startAngle: PropTypes.number
  })
});
Object.defineProperty(VictoryChart, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    backgroundComponent: React.createElement(Background, null),
    containerComponent: React.createElement(VictoryContainer, null),
    defaultAxes: {
      independent: React.createElement(VictoryAxis, null),
      dependent: React.createElement(VictoryAxis, {
        dependentAxis: true
      })
    },
    defaultPolarAxes: {
      independent: React.createElement(VictoryPolarAxis, null),
      dependent: React.createElement(VictoryPolarAxis, {
        dependentAxis: true
      })
    },
    groupComponent: React.createElement("g", null),
    standalone: true,
    theme: VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryChart, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["groupComponent", "containerComponent"]
});
export { VictoryChart as default };