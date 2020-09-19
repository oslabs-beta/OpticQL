function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

/*global setTimeout:false */
import React from "react";
import PropTypes from "prop-types";
import * as d3Ease from "d3-ease";
import { victoryInterpolator } from "./util";
import TimerContext from "../victory-util/timer-context";
import isEqual from "react-fast-compare";

var VictoryAnimation =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryAnimation, _React$Component);

  function VictoryAnimation(props, context) {
    var _this;

    _classCallCheck(this, VictoryAnimation);

    _this = _possibleConstructorReturn(this, (VictoryAnimation.__proto__ || Object.getPrototypeOf(VictoryAnimation)).call(this, props, context));
    /* defaults */

    _this.state = {
      data: Array.isArray(_this.props.data) ? _this.props.data[0] : _this.props.data,
      animationInfo: {
        progress: 0,
        animating: false
      }
    };
    _this.interpolator = null;
    _this.queue = Array.isArray(_this.props.data) ? _this.props.data.slice(1) : [];
    /* build easing function */

    _this.ease = d3Ease[_this.toNewName(_this.props.easing)];
    /*
      There is no autobinding of this in ES6 classes
      so we bind functionToBeRunEachFrame to current instance of victory animation class
    */

    _this.functionToBeRunEachFrame = _this.functionToBeRunEachFrame.bind(_assertThisInitialized(_this));
    _this.timer = _this.context.animationTimer;
    return _this;
  }

  _createClass(VictoryAnimation, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Length check prevents us from triggering `onEnd` in `traverseQueue`.
      if (this.queue.length) {
        this.traverseQueue();
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var equalProps = isEqual(this.props, nextProps);

      if (!equalProps) {
        /* cancel existing loop if it exists */
        this.timer.unsubscribe(this.loopID);
        /* If an object was supplied */

        if (!Array.isArray(nextProps.data)) {
          // Replace the tween queue. Could set `this.queue = [nextProps.data]`,
          // but let's reuse the same array.
          this.queue.length = 0;
          this.queue.push(nextProps.data);
          /* If an array was supplied */
        } else {
          var _queue;

          /* Extend the tween queue */
          (_queue = this.queue).push.apply(_queue, _toConsumableArray(nextProps.data));
        }
        /* Start traversing the tween queue */


        this.traverseQueue();
      }

      return nextState.animationInfo.animating || nextState.animationInfo.terminating || !equalProps;
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.loopID) {
        this.timer.unsubscribe(this.loopID);
      } else {
        this.timer.stop();
      }
    }
  }, {
    key: "toNewName",
    value: function toNewName(ease) {
      // d3-ease changed the naming scheme for ease from "linear" -> "easeLinear" etc.
      var capitalize = function (s) {
        return s && s[0].toUpperCase() + s.slice(1);
      };

      return "ease".concat(capitalize(ease));
    }
    /* Traverse the tween queue */

  }, {
    key: "traverseQueue",
    value: function traverseQueue() {
      var _this2 = this;

      if (this.queue.length) {
        /* Get the next index */
        var data = this.queue[0];
        /* compare cached version to next props */

        this.interpolator = victoryInterpolator(this.state.data, data);
        /* reset step to zero */

        if (this.props.delay) {
          setTimeout(function () {
            _this2.loopID = _this2.timer.subscribe(_this2.functionToBeRunEachFrame, _this2.props.duration);
          }, this.props.delay);
        } else {
          this.loopID = this.timer.subscribe(this.functionToBeRunEachFrame, this.props.duration);
        }
      } else if (this.props.onEnd) {
        this.props.onEnd();
      }
    }
    /* every frame we... */

  }, {
    key: "functionToBeRunEachFrame",
    value: function functionToBeRunEachFrame(elapsed, duration) {
      /*
        step can generate imprecise values, sometimes greater than 1
        if this happens set the state to 1 and return, cancelling the timer
      */
      duration = duration !== undefined ? duration : this.props.duration;
      var step = duration ? elapsed / duration : 1;

      if (step >= 1) {
        this.setState({
          data: this.interpolator(1),
          animationInfo: {
            progress: 1,
            animating: false,
            terminating: true
          }
        });

        if (this.loopID) {
          this.timer.unsubscribe(this.loopID);
        }

        this.queue.shift();
        this.traverseQueue();
        return;
      }
      /*
        if we're not at the end of the timer, set the state by passing
        current step value that's transformed by the ease function to the
        interpolator, which is cached for performance whenever props are received
      */


      this.setState({
        data: this.interpolator(this.ease(step)),
        animationInfo: {
          progress: step,
          animating: step < 1
        }
      });
    }
  }, {
    key: "render",
    value: function render() {
      return this.props.children(this.state.data, this.state.animationInfo);
    }
  }]);

  return VictoryAnimation;
}(React.Component);

Object.defineProperty(VictoryAnimation, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryAnimation"
});
Object.defineProperty(VictoryAnimation, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    children: PropTypes.func,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    delay: PropTypes.number,
    duration: PropTypes.number,
    easing: PropTypes.oneOf(["back", "backIn", "backOut", "backInOut", "bounce", "bounceIn", "bounceOut", "bounceInOut", "circle", "circleIn", "circleOut", "circleInOut", "linear", "linearIn", "linearOut", "linearInOut", "cubic", "cubicIn", "cubicOut", "cubicInOut", "elastic", "elasticIn", "elasticOut", "elasticInOut", "exp", "expIn", "expOut", "expInOut", "poly", "polyIn", "polyOut", "polyInOut", "quad", "quadIn", "quadOut", "quadInOut", "sin", "sinIn", "sinOut", "sinInOut"]),
    onEnd: PropTypes.func
  }
});
Object.defineProperty(VictoryAnimation, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    data: {},
    delay: 0,
    duration: 1000,
    easing: "quadInOut"
  }
});
Object.defineProperty(VictoryAnimation, "contextType", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: TimerContext
});
export { VictoryAnimation as default };