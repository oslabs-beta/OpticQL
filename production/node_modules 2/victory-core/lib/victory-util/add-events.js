"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _without2 = _interopRequireDefault(require("lodash/without"));

var _pick2 = _interopRequireDefault(require("lodash/pick"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _keys2 = _interopRequireDefault(require("lodash/keys"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _react = _interopRequireDefault(require("react"));

var _events = _interopRequireDefault(require("./events"));

var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));

var _victoryTransition = _interopRequireDefault(require("../victory-transition/victory-transition"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var datumHasXandY = function (datum) {
  return !(0, _isNil2.default)(datum._x) && !(0, _isNil2.default)(datum._y);
}; //  used for checking state changes. Expected components can be passed in via options


var defaultComponents = [{
  name: "parent",
  index: "parent"
}, {
  name: "data"
}, {
  name: "labels"
}];

var _default = function _default(WrappedComponent, options) {
  return (
    /*#__PURE__*/
    function (_WrappedComponent) {
      _inherits(addEvents, _WrappedComponent);

      function addEvents(props) {
        var _this;

        _classCallCheck(this, addEvents);

        _this = _possibleConstructorReturn(this, (addEvents.__proto__ || Object.getPrototypeOf(addEvents)).call(this, props));

        var getScopedEvents = _events.default.getScopedEvents.bind(_assertThisInitialized(_this));

        var boundGetEvents = _events.default.getEvents.bind(_assertThisInitialized(_this));

        _this.state = {};

        _this.getEvents = function (p, target, eventKey) {
          return boundGetEvents(p, target, eventKey, getScopedEvents);
        };

        _this.getEventState = _events.default.getEventState.bind(_assertThisInitialized(_this));

        var calculatedValues = _this.getCalculatedValues(props);

        _this.cacheValues(calculatedValues);

        _this.externalMutations = _this.getExternalMutations(props);
        _this.calculatedState = _this.getStateChanges(props, calculatedValues);
        return _this;
      }

      _createClass(addEvents, [{
        key: "shouldComponentUpdate",
        value: function shouldComponentUpdate(nextProps) {
          var calculatedValues = this.getCalculatedValues(nextProps);
          var externalMutations = this.getExternalMutations(nextProps);
          var animating = this.props.animating || this.props.animate;
          var newMutation = !(0, _reactFastCompare.default)(externalMutations, this.externalMutations);

          if (animating || newMutation) {
            this.cacheValues(calculatedValues);
            this.externalMutations = externalMutations;
            this.applyExternalMutations(nextProps, externalMutations);
            return true;
          }

          var calculatedState = this.getStateChanges(nextProps, calculatedValues);

          if (!(0, _reactFastCompare.default)(this.calculatedState, calculatedState)) {
            this.calculatedState = calculatedState;
            this.cacheValues(calculatedValues);
            return true;
          }

          if (!(0, _reactFastCompare.default)(this.props, nextProps)) {
            this.cacheValues(calculatedValues);
            return true;
          }

          return false;
        } // compile all state changes from own and parent state. Order doesn't matter, as any state
        // state change should trigger a re-render

      }, {
        key: "getStateChanges",
        value: function getStateChanges(props, calculatedValues) {
          var _this2 = this;

          var hasEvents = calculatedValues.hasEvents,
              getSharedEventState = calculatedValues.getSharedEventState;

          if (!hasEvents) {
            return {};
          }

          var getState = function (key, type) {
            var result = (0, _defaults2.default)({}, _this2.getEventState(key, type), getSharedEventState(key, type));
            return (0, _isEmpty2.default)(result) ? undefined : result;
          };

          options = options || {};
          var components = options.components || defaultComponents;
          var stateChanges = components.map(function (component) {
            if (!props.standalone && component.name === "parent") {
              // don't check for changes on parent props for non-standalone components
              return undefined;
            } else {
              return component.index !== undefined ? getState(component.index, component.name) : calculatedValues.dataKeys.map(function (key) {
                return getState(key, component.name);
              }).filter(Boolean);
            }
          }).filter(Boolean);
          return stateChanges;
        }
      }, {
        key: "applyExternalMutations",
        value: function applyExternalMutations(props, externalMutations) {
          if (!(0, _isEmpty2.default)(externalMutations)) {
            var callbacks = props.externalEventMutations.reduce(function (memo, mutation) {
              memo = (0, _isFunction2.default)(mutation.callback) ? memo.concat(mutation.callback) : memo;
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
        key: "getCalculatedValues",
        value: function getCalculatedValues(props) {
          var sharedEvents = props.sharedEvents;
          var components = WrappedComponent.expectedComponents;

          var componentEvents = _events.default.getComponentEvents(props, components);

          var getSharedEventState = sharedEvents && (0, _isFunction2.default)(sharedEvents.getEventState) ? sharedEvents.getEventState : function () {
            return undefined;
          };
          var baseProps = this.getBaseProps(props, getSharedEventState);
          var dataKeys = (0, _keys2.default)(baseProps).filter(function (key) {
            return key !== "parent";
          });
          var hasEvents = props.events || props.sharedEvents || componentEvents;
          var events = this.getAllEvents(props);
          return {
            componentEvents: componentEvents,
            getSharedEventState: getSharedEventState,
            baseProps: baseProps,
            dataKeys: dataKeys,
            hasEvents: hasEvents,
            events: events
          };
        }
      }, {
        key: "getExternalMutations",
        value: function getExternalMutations(props) {
          var sharedEvents = props.sharedEvents,
              externalEventMutations = props.externalEventMutations;
          return (0, _isEmpty2.default)(externalEventMutations) || sharedEvents ? undefined : _events.default.getExternalMutations(externalEventMutations, this.baseProps, this.state);
        }
      }, {
        key: "cacheValues",
        value: function cacheValues(obj) {
          var _this3 = this;

          (0, _keys2.default)(obj).forEach(function (key) {
            _this3[key] = obj[key];
          });
        }
      }, {
        key: "getBaseProps",
        value: function getBaseProps(props, getSharedEventState) {
          getSharedEventState = getSharedEventState || this.getSharedEventState;
          var sharedParentState = getSharedEventState("parent", "parent");
          var parentState = this.getEventState("parent", "parent");
          var baseParentProps = (0, _defaults2.default)({}, parentState, sharedParentState);
          var parentPropsList = baseParentProps.parentControlledProps;
          var parentProps = parentPropsList ? (0, _pick2.default)(baseParentProps, parentPropsList) : {};
          var modifiedProps = (0, _defaults2.default)({}, parentProps, props);
          return (0, _isFunction2.default)(WrappedComponent.getBaseProps) ? WrappedComponent.getBaseProps(modifiedProps) : {};
        }
      }, {
        key: "getAllEvents",
        value: function getAllEvents(props) {
          if (Array.isArray(this.componentEvents)) {
            var _componentEvents;

            return Array.isArray(props.events) ? (_componentEvents = this.componentEvents).concat.apply(_componentEvents, _toConsumableArray(props.events)) : this.componentEvents;
          }

          return props.events;
        }
      }, {
        key: "getComponentProps",
        value: function getComponentProps(component, type, index) {
          var name = this.props.name || WrappedComponent.role;
          var key = this.dataKeys && this.dataKeys[index] || index;
          var id = "".concat(name, "-").concat(type, "-").concat(key);
          var baseProps = this.baseProps[key] && this.baseProps[key][type] || this.baseProps[key];

          if (!baseProps && !this.hasEvents) {
            return undefined;
          }

          if (this.hasEvents) {
            var baseEvents = this.getEvents(this.props, type, key);
            var componentProps = (0, _defaults2.default)({
              index: index,
              key: id
            }, this.getEventState(key, type), this.getSharedEventState(key, type), component.props, baseProps, {
              id: id
            });
            var events = (0, _defaults2.default)({}, _events.default.getPartialEvents(baseEvents, key, componentProps), componentProps.events);
            return (0, _assign2.default)({}, componentProps, {
              events: events
            });
          }

          return (0, _defaults2.default)({
            index: index,
            key: id
          }, component.props, baseProps, {
            id: id
          });
        }
      }, {
        key: "renderContainer",
        value: function renderContainer(component, children) {
          var isContainer = component.type && component.type.role === "container";
          var parentProps = isContainer ? this.getComponentProps(component, "parent", "parent") : {};
          return _react.default.cloneElement(component, parentProps, children);
        }
      }, {
        key: "animateComponent",
        value: function animateComponent(props, defaultAnimationWhitelist) {
          var animationWhitelist = props.animate && props.animate.animationWhitelist ? props.animate.animationWhitelist : defaultAnimationWhitelist;
          return _react.default.createElement(_victoryTransition.default, {
            animate: props.animate,
            animationWhitelist: animationWhitelist
          }, _react.default.createElement(this.constructor, props));
        } // Used by `VictoryLine` and `VictoryArea`

      }, {
        key: "renderContinuousData",
        value: function renderContinuousData(props) {
          var _this4 = this;

          var dataComponent = props.dataComponent,
              labelComponent = props.labelComponent,
              groupComponent = props.groupComponent;
          var dataKeys = (0, _without2.default)(this.dataKeys, "all");
          var labelComponents = dataKeys.reduce(function (memo, key) {
            var labelProps = _this4.getComponentProps(labelComponent, "labels", key);

            if (labelProps && labelProps.text !== undefined && labelProps.text !== null) {
              memo = memo.concat(_react.default.cloneElement(labelComponent, labelProps));
            }

            return memo;
          }, []);
          var dataProps = this.getComponentProps(dataComponent, "data", "all");
          var children = [_react.default.cloneElement(dataComponent, dataProps)].concat(_toConsumableArray(labelComponents));
          return this.renderContainer(groupComponent, children);
        }
      }, {
        key: "renderData",
        value: function renderData(props) {
          var _this5 = this;

          var shouldRenderDatum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : datumHasXandY;
          var dataComponent = props.dataComponent,
              labelComponent = props.labelComponent,
              groupComponent = props.groupComponent;
          var dataComponents = this.dataKeys.reduce(function (validDataComponents, _dataKey, index) {
            var dataProps = _this5.getComponentProps(dataComponent, "data", index);

            if (shouldRenderDatum(dataProps.datum)) {
              validDataComponents.push(_react.default.cloneElement(dataComponent, dataProps));
            }

            return validDataComponents;
          }, []);
          var labelComponents = this.dataKeys.map(function (_dataKey, index) {
            var labelProps = _this5.getComponentProps(labelComponent, "labels", index);

            if (labelProps.text !== undefined && labelProps.text !== null) {
              return _react.default.cloneElement(labelComponent, labelProps);
            }

            return undefined;
          }).filter(Boolean);

          var children = _toConsumableArray(dataComponents).concat(_toConsumableArray(labelComponents));

          return this.renderContainer(groupComponent, children);
        }
      }]);

      return addEvents;
    }(WrappedComponent)
  );
};

exports.default = _default;