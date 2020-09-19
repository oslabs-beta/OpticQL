import _isObject from "lodash/isObject";
import _pick from "lodash/pick";
import _isFunction from "lodash/isFunction";
import _defaults from "lodash/defaults";

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

import React from "react";
import PropTypes from "prop-types";
import VictoryAnimation from "../victory-animation/victory-animation";
import Collection from "../victory-util/collection";
import Helpers from "../victory-util/helpers";
import TimerContext from "../victory-util/timer-context";
import Transitions from "../victory-util/transitions";
import isEqual from "react-fast-compare";

var VictoryTransition =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryTransition, _React$Component);

  function VictoryTransition(props, context) {
    var _this;

    _classCallCheck(this, VictoryTransition);

    _this = _possibleConstructorReturn(this, (VictoryTransition.__proto__ || Object.getPrototypeOf(VictoryTransition)).call(this, props, context));
    _this.state = {
      nodesShouldLoad: false,
      nodesDoneLoad: false
    };
    var child = _this.props.children;
    var polar = child.props.polar;
    _this.continuous = !polar && child.type && child.type.continuous === true;
    _this.getTransitionState = _this.getTransitionState.bind(_assertThisInitialized(_this));
    _this.timer = _this.context.transitionTimer;
    return _this;
  }

  _createClass(VictoryTransition, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        nodesShouldLoad: true
      }); //eslint-disable-line react/no-did-mount-set-state
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var _this2 = this;

      if (!isEqual(this.props, nextProps)) {
        this.timer.bypassAnimation();
        this.setState(this.getTransitionState(this.props, nextProps), function () {
          return _this2.timer.resumeAnimation();
        });
      }

      return true;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.timer.stop();
    }
  }, {
    key: "getTransitionState",
    value: function getTransitionState(props, nextProps) {
      var animate = props.animate;

      if (!animate) {
        return {};
      } else if (animate.parentState) {
        var state = animate.parentState;
        var oldProps = state.nodesWillExit ? props : null;
        return {
          oldProps: oldProps,
          nextProps: nextProps
        };
      } else {
        var oldChildren = React.Children.toArray(props.children);
        var nextChildren = React.Children.toArray(nextProps.children);

        var _Transitions$getIniti = Transitions.getInitialTransitionState(oldChildren, nextChildren),
            nodesWillExit = _Transitions$getIniti.nodesWillExit,
            nodesWillEnter = _Transitions$getIniti.nodesWillEnter,
            childrenTransitions = _Transitions$getIniti.childrenTransitions,
            nodesShouldEnter = _Transitions$getIniti.nodesShouldEnter;

        return {
          nodesWillExit: nodesWillExit,
          nodesWillEnter: nodesWillEnter,
          childrenTransitions: childrenTransitions,
          nodesShouldEnter: nodesShouldEnter,
          oldProps: nodesWillExit ? props : null,
          nextProps: nextProps
        };
      }
    }
  }, {
    key: "getDomainFromChildren",
    value: function getDomainFromChildren(props, axis) {
      var getChildDomains = function (children) {
        return children.reduce(function (memo, child) {
          if (child.type && _isFunction(child.type.getDomain)) {
            var childDomain = child.props && child.type.getDomain(child.props, axis);
            return childDomain ? memo.concat(childDomain) : memo;
          } else if (child.props && child.props.children) {
            return memo.concat(getChildDomains(React.Children.toArray(child.props.children)));
          }

          return memo;
        }, []);
      };

      var child = React.Children.toArray(props.children)[0];
      var childProps = child.props || {};
      var domain = Array.isArray(childProps.domain) ? childProps.domain : childProps.domain && childProps.domain[axis];

      if (!childProps.children && domain) {
        return domain;
      } else {
        var childDomains = getChildDomains([child]);
        return childDomains.length === 0 ? [0, 1] : [Collection.getMinValue(childDomains), Collection.getMaxValue(childDomains)];
      }
    }
  }, {
    key: "pickProps",
    value: function pickProps() {
      if (!this.state) {
        return this.props;
      }

      return this.state.nodesWillExit ? this.state.oldProps || this.props : this.props;
    }
  }, {
    key: "pickDomainProps",
    value: function pickDomainProps(props) {
      var parentState = _isObject(props.animate) && props.animate.parentState;

      if (parentState && parentState.nodesWillExit) {
        return this.continous || parentState.continuous ? parentState.nextProps || this.state.nextProps || props : props;
      }

      return this.continuous && this.state.nodesWillExit ? this.state.nextProps || props : props;
    }
  }, {
    key: "getClipWidth",
    value: function getClipWidth(props, child) {
      var getDefaultClipWidth = function () {
        var range = Helpers.getRange(child.props, "x");
        return range ? Math.abs(range[1] - range[0]) : props.width;
      };

      var clipWidth = this.transitionProps ? this.transitionProps.clipWidth : undefined;
      return clipWidth !== undefined ? clipWidth : getDefaultClipWidth();
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var props = this.pickProps();
      var getTransitionProps = _isObject(this.props.animate) && this.props.animate.getTransitions ? this.props.animate.getTransitions : Transitions.getTransitionPropsFactory(props, this.state, function (newState) {
        return _this3.setState(newState);
      });
      var child = React.Children.toArray(props.children)[0];
      var transitionProps = getTransitionProps(child);
      this.transitionProps = transitionProps;
      var domain = {
        x: this.getDomainFromChildren(this.pickDomainProps(props), "x"),
        y: this.getDomainFromChildren(props, "y")
      };
      var clipWidth = this.getClipWidth(props, child);

      var combinedProps = _defaults({
        domain: domain,
        clipWidth: clipWidth
      }, transitionProps, child.props);

      var animationWhitelist = props.animationWhitelist || [];
      var whitelist = animationWhitelist.concat(["clipWidth"]);
      var propsToAnimate = whitelist.length ? _pick(combinedProps, whitelist) : combinedProps;
      return React.createElement(VictoryAnimation, _extends({}, combinedProps.animate, {
        data: propsToAnimate
      }), function (newProps) {
        if (child.props.groupComponent) {
          var groupComponent = _this3.continuous ? React.cloneElement(child.props.groupComponent, {
            clipWidth: newProps.clipWidth || 0
          }) : child.props.groupComponent;
          return React.cloneElement(child, _defaults({
            animate: null,
            animating: true,
            groupComponent: groupComponent
          }, newProps, combinedProps));
        }

        return React.cloneElement(child, _defaults({
          animate: null,
          animating: true
        }, newProps, combinedProps));
      });
    }
  }]);

  return VictoryTransition;
}(React.Component);

Object.defineProperty(VictoryTransition, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryTransition"
});
Object.defineProperty(VictoryTransition, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    animate: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
    animationWhitelist: PropTypes.array,
    children: PropTypes.node
  }
});
Object.defineProperty(VictoryTransition, "contextType", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: TimerContext
});
export { VictoryTransition as default };