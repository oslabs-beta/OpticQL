import _fromPairs from "lodash/fromPairs";
import _isEmpty from "lodash/isEmpty";
import _defaults from "lodash/defaults";
import _isFunction from "lodash/isFunction";
import _assign from "lodash/assign";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

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

import React from "react";
import PropTypes from "prop-types";
import { PropTypes as CustomPropTypes, Events, Helpers, TimerContext } from "victory-core";
import isEqual from "react-fast-compare";

var VictorySharedEvents =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictorySharedEvents, _React$Component);

  function VictorySharedEvents(props) {
    var _this;

    _classCallCheck(this, VictorySharedEvents);

    _this = _possibleConstructorReturn(this, (VictorySharedEvents.__proto__ || Object.getPrototypeOf(VictorySharedEvents)).call(this, props));
    _this.state = _this.state || {};
    _this.getScopedEvents = Events.getScopedEvents.bind(_assertThisInitialized(_this));
    _this.getEventState = Events.getEventState.bind(_assertThisInitialized(_this));
    _this.baseProps = _this.getBaseProps(props);
    _this.sharedEventsCache = {};
    return _this;
  }

  _createClass(VictorySharedEvents, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (!isEqual(this.props, nextProps)) {
        this.baseProps = this.getBaseProps(nextProps);
        var externalMutations = this.getExternalMutations(nextProps, this.baseProps);
        this.applyExternalMutations(nextProps, externalMutations);
      }

      return true;
    }
  }, {
    key: "getAllEvents",
    value: function getAllEvents(props) {
      var components = ["container", "groupComponent"];
      var componentEvents = Events.getComponentEvents(props, components);

      if (Array.isArray(componentEvents)) {
        return Array.isArray(props.events) ? componentEvents.concat.apply(componentEvents, _toConsumableArray(props.events)) : componentEvents;
      }

      return props.events;
    }
  }, {
    key: "applyExternalMutations",
    value: function applyExternalMutations(props, externalMutations) {
      if (!_isEmpty(externalMutations)) {
        var callbacks = props.externalEventMutations.reduce(function (memo, mutation) {
          memo = _isFunction(mutation.callback) ? memo.concat(mutation.callback) : memo;
          return memo;
        }, []);
        var compiledCallbacks = callbacks.length ? function () {
          callbacks.forEach(function (c) {
            return c();
          });
        } : undefined;
        this.setState(externalMutations, compiledCallbacks);
      }
    }
  }, {
    key: "getExternalMutations",
    value: function getExternalMutations(props, baseProps) {
      return !_isEmpty(props.externalEventMutations) ? Events.getExternalMutationsWithChildren(props.externalEventMutations, baseProps, this.state, Object.keys(baseProps)) : undefined;
    }
  }, {
    key: "cacheSharedEvents",
    value: function cacheSharedEvents(name, sharedEvents, cacheValues) {
      this.sharedEventsCache[name] = [sharedEvents, cacheValues];
    }
  }, {
    key: "getCachedSharedEvents",
    value: function getCachedSharedEvents(name, cacheValues) {
      var _ref = this.sharedEventsCache[name] || [],
          _ref2 = _slicedToArray(_ref, 2),
          sharedEvents = _ref2[0],
          prevCacheValues = _ref2[1];

      if (sharedEvents && isEqual(cacheValues, prevCacheValues)) {
        return sharedEvents;
      }

      return undefined;
    }
  }, {
    key: "getBaseProps",
    value: function getBaseProps(props) {
      var container = props.container;
      var children = React.Children.toArray(this.props.children);
      var childBaseProps = this.getBasePropsFromChildren(children);
      var parentBaseProps = container ? container.props : {};
      return _assign({}, childBaseProps, {
        parent: parentBaseProps
      });
    }
  }, {
    key: "getBasePropsFromChildren",
    value: function getBasePropsFromChildren(childComponents) {
      var iteratee = function (child, childName) {
        if (child.type && _isFunction(child.type.getBaseProps)) {
          var _baseProps = child.props && child.type.getBaseProps(child.props);

          return _baseProps ? [[childName, _baseProps]] : null;
        } else {
          return null;
        }
      };

      var baseProps = Helpers.reduceChildren(childComponents, iteratee);
      return _fromPairs(baseProps);
    }
  }, {
    key: "getNewChildren",
    value: function getNewChildren(props, baseProps) {
      var _this2 = this;

      var events = props.events,
          eventKey = props.eventKey;

      var alterChildren = function (children, childNames) {
        return children.reduce(function (memo, child, index) {
          if (child.props.children) {
            var newChildren = React.Children.toArray(child.props.children);
            var names = childNames.slice(index, index + newChildren.length);
            var results = React.cloneElement(child, child.props, alterChildren(newChildren, names));
            return memo.concat(results);
          } else if (child.type && _isFunction(child.type.getBaseProps)) {
            var name = child.props.name || childNames[index];
            var childEvents = Array.isArray(events) && events.filter(function (event) {
              if (event.target === "parent") {
                return false;
              }

              return Array.isArray(event.childName) ? event.childName.indexOf(name) > -1 : event.childName === name || event.childName === "all";
            });
            var sharedEventsCacheValues = [name, baseProps, childEvents, JSON.stringify(_this2.state[name])];
            var sharedEvents = _this2.getCachedSharedEvents(name, sharedEventsCacheValues) || {
              events: childEvents,
              // partially apply child name and baseProps,
              getEvents: function (evts, target) {
                return _this2.getScopedEvents(evts, target, name, baseProps);
              },
              // partially apply child name
              getEventState: function (key, target) {
                return _this2.getEventState(key, target, name);
              }
            };

            _this2.cacheSharedEvents(name, sharedEvents, sharedEventsCacheValues);

            return memo.concat(React.cloneElement(child, _assign({
              key: "events-".concat(name),
              sharedEvents: sharedEvents,
              eventKey: eventKey,
              name: name
            }, child.props)));
          } else {
            return memo.concat(child);
          }
        }, []);
      };

      var childNames = Object.keys(baseProps);
      var childComponents = React.Children.toArray(props.children);
      return alterChildren(childComponents, childNames);
    }
  }, {
    key: "getContainer",
    value: function getContainer(props, baseProps, events) {
      var _this3 = this;

      var children = this.getNewChildren(props, baseProps);
      var parents = Array.isArray(events) && events.filter(function (event) {
        return event.target === "parent";
      });
      var sharedEvents = parents.length > 0 ? {
        events: parents,
        // partially apply childName (null) and baseProps,
        getEvents: function (evts, target) {
          return _this3.getScopedEvents(evts, target, null, baseProps);
        },
        getEventState: this.getEventState
      } : null;
      var container = props.container || props.groupComponent;
      var role = container.type && container.type.role;
      var containerProps = container.props || {};
      var boundGetEvents = Events.getEvents.bind(this);
      var parentEvents = sharedEvents && boundGetEvents({
        sharedEvents: sharedEvents
      }, "parent");

      var parentProps = _defaults({}, this.getEventState("parent", "parent"), containerProps, baseProps.parent, {
        children: children
      });

      var containerEvents = _defaults({}, Events.getPartialEvents(parentEvents, "parent", parentProps), containerProps.events);

      return role === "container" ? React.cloneElement(container, _assign({}, parentProps, {
        events: containerEvents
      })) : React.cloneElement(container, containerEvents, children);
    }
  }, {
    key: "render",
    value: function render() {
      var events = this.getAllEvents(this.props);

      if (events) {
        return this.getContainer(this.props, this.baseProps, events);
      }

      return React.cloneElement(this.props.container, {
        children: this.props.children
      });
    }
  }]);

  return VictorySharedEvents;
}(React.Component);

Object.defineProperty(VictorySharedEvents, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictorySharedEvents"
});
Object.defineProperty(VictorySharedEvents, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "shared-event-wrapper"
});
Object.defineProperty(VictorySharedEvents, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
    container: PropTypes.node,
    eventKey: PropTypes.oneOfType([PropTypes.array, PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
    events: PropTypes.arrayOf(PropTypes.shape({
      childName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      eventHandlers: PropTypes.object,
      eventKey: PropTypes.oneOfType([PropTypes.array, PropTypes.func, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
      target: PropTypes.string
    })),
    externalEventMutations: PropTypes.arrayOf(PropTypes.shape({
      callback: PropTypes.function,
      childName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      eventKey: PropTypes.oneOfType([PropTypes.array, CustomPropTypes.allOfType([CustomPropTypes.integer, CustomPropTypes.nonNegative]), PropTypes.string]),
      mutation: PropTypes.function,
      target: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    })),
    groupComponent: PropTypes.node
  }
});
Object.defineProperty(VictorySharedEvents, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    groupComponent: React.createElement("g", null)
  }
});
Object.defineProperty(VictorySharedEvents, "contextType", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: TimerContext
});
export { VictorySharedEvents as default };