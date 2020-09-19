"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _uniq2 = _interopRequireDefault(require("lodash/uniq"));

var _pickBy2 = _interopRequireDefault(require("lodash/pickBy"));

var _without2 = _interopRequireDefault(require("lodash/without"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _assign6 = _interopRequireDefault(require("lodash/assign"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _default = {
  /* Returns all own and shared events that should be attached to a single target element,
   * i.e. an individual bar specified by target: "data", eventKey: [index].
   * Returned events are scoped to the appropriate state. Either that of the component itself
   * (i.e. VictoryBar) in the case of own events, or that of the parent component
   * (i.e. VictoryChart) in the case of shared events
   */
  // eslint-disable-next-line max-params
  getEvents: function (props, target, eventKey, getScopedEvents) {
    var _this = this;

    // Returns all events that apply to a particular target element
    var getEventsByTarget = function (events) {
      var getSelectedEvents = function () {
        var targetEvents = events.reduce(function (memo, event) {
          if (event.target !== undefined) {
            var matchesTarget = Array.isArray(event.target) ? (0, _includes2.default)(event.target, target) : "".concat(event.target) === "".concat(target);
            return matchesTarget ? memo.concat(event) : memo;
          }

          return memo.concat(event);
        }, []);

        if (eventKey !== undefined && target !== "parent") {
          return targetEvents.filter(function (obj) {
            var targetKeys = obj.eventKey;

            var useKey = function (key) {
              return key ? "".concat(key) === "".concat(eventKey) : true;
            };

            return Array.isArray(targetKeys) ? targetKeys.some(function (k) {
              return useKey(k);
            }) : useKey(targetKeys);
          });
        }

        return targetEvents;
      };

      var selectedEvents = getSelectedEvents();
      return Array.isArray(selectedEvents) && selectedEvents.reduce(function (memo, event) {
        return event ? (0, _assign6.default)(memo, event.eventHandlers) : memo;
      }, {});
    };
    /* Returns all events from props and defaultEvents from components. Events handlers
     * specified in props will override handlers for the same event if they are also
     * specified in defaultEvents of a sub-component
     */


    var getAllEvents = function () {
      if (Array.isArray(_this.componentEvents)) {
        var _this$componentEvents;

        return Array.isArray(props.events) ? (_this$componentEvents = _this.componentEvents).concat.apply(_this$componentEvents, _toConsumableArray(props.events)) : _this.componentEvents;
      }

      return props.events;
    };

    var allEvents = getAllEvents();
    var ownEvents = allEvents && (0, _isFunction2.default)(getScopedEvents) ? getScopedEvents(getEventsByTarget(allEvents), target) : undefined;

    if (!props.sharedEvents) {
      return ownEvents;
    }

    var getSharedEvents = props.sharedEvents.getEvents;
    var sharedEvents = props.sharedEvents.events && getSharedEvents(getEventsByTarget(props.sharedEvents.events), target);
    return (0, _assign6.default)({}, sharedEvents, ownEvents);
  },

  /* Returns a modified events object where each event handler is replaced by a new
   * function that calls the original handler and then calls setState with the return
   * of the original event handler assigned to state property that maps to the target
   * element.
   */
  // eslint-disable-next-line max-params
  getScopedEvents: function (events, namespace, childType, baseProps) {
    var _this2 = this;

    if ((0, _isEmpty2.default)(events)) {
      return {};
    }

    baseProps = baseProps || this.baseProps; // returns the original base props or base state of a given target element

    var getTargetProps = function (identifier, type) {
      var childName = identifier.childName,
          target = identifier.target,
          key = identifier.key;
      var baseType = type === "props" ? baseProps : _this2.state || {};
      var base = childName === undefined || childName === null || !baseType[childName] ? baseType : baseType[childName];
      return key === "parent" ? base.parent : base[key] && base[key][target];
    }; // Returns the state object with the mutation caused by a given eventReturn
    // applied to the appropriate property on the state object


    var parseEvent = function (eventReturn, eventKey) {
      var childNames = namespace === "parent" ? eventReturn.childName : eventReturn.childName || childType;
      var target = eventReturn.target || namespace; // returns all eventKeys to modify for a targeted childName

      var getKeys = function (childName) {
        if (target === "parent") {
          return "parent";
        }

        if (eventReturn.eventKey === "all") {
          return baseProps[childName] ? (0, _without2.default)(Object.keys(baseProps[childName]), "parent") : (0, _without2.default)(Object.keys(baseProps), "parent");
        } else if (eventReturn.eventKey === undefined && eventKey === "parent") {
          return baseProps[childName] ? Object.keys(baseProps[childName]) : Object.keys(baseProps);
        }

        return eventReturn.eventKey !== undefined ? eventReturn.eventKey : eventKey;
      }; // returns the state object with mutated props applied for a single key


      var getMutationObject = function (key, childName) {
        var baseState = _this2.state || {};

        if (!(0, _isFunction2.default)(eventReturn.mutation)) {
          return baseState;
        }

        var mutationTargetProps = getTargetProps({
          childName: childName,
          key: key,
          target: target
        }, "props");
        var mutationTargetState = getTargetProps({
          childName: childName,
          key: key,
          target: target
        }, "state");
        var mutatedProps = eventReturn.mutation((0, _assign6.default)({}, mutationTargetProps, mutationTargetState), baseProps);
        var childState = baseState[childName] || {};

        var filterState = function (state) {
          if (state[key] && state[key][target]) {
            delete state[key][target];
          }

          if (state[key] && !Object.keys(state[key]).length) {
            delete state[key];
          }

          return state;
        };

        var extendState = function (state) {
          return target === "parent" ? (0, _assign6.default)(state, _defineProperty({}, key, (0, _assign6.default)(state[key], mutatedProps))) : (0, _assign6.default)(state, _defineProperty({}, key, (0, _assign6.default)(state[key], _defineProperty({}, target, mutatedProps))));
        };

        var updateState = function (state) {
          return mutatedProps ? extendState(state) : filterState(state);
        };

        return childName !== undefined && childName !== null ? (0, _assign6.default)(baseState, _defineProperty({}, childName, updateState(childState))) : updateState(baseState);
      }; // returns entire mutated state for a given childName


      var getReturnByChild = function (childName) {
        var mutationKeys = getKeys(childName);
        return Array.isArray(mutationKeys) ? mutationKeys.reduce(function (memo, key) {
          return (0, _assign6.default)(memo, getMutationObject(key, childName));
        }, {}) : getMutationObject(mutationKeys, childName);
      }; // returns an entire mutated state for all children


      var allChildNames = childNames === "all" ? (0, _without2.default)(Object.keys(baseProps), "parent") : childNames;
      return Array.isArray(allChildNames) ? allChildNames.reduce(function (memo, childName) {
        return (0, _assign6.default)(memo, getReturnByChild(childName));
      }, {}) : getReturnByChild(allChildNames);
    }; // Parses an array of event returns into a single state mutation


    var parseEventReturn = function (eventReturn, eventKey) {
      return Array.isArray(eventReturn) ? eventReturn.reduce(function (memo, props) {
        memo = (0, _assign6.default)({}, memo, parseEvent(props, eventKey));
        return memo;
      }, {}) : parseEvent(eventReturn, eventKey);
    };

    var compileCallbacks = function (eventReturn) {
      var getCallback = function (obj) {
        return (0, _isFunction2.default)(obj.callback) && obj.callback;
      };

      var callbacks = Array.isArray(eventReturn) ? eventReturn.map(function (evtObj) {
        return getCallback(evtObj);
      }) : [getCallback(eventReturn)];
      var callbackArray = callbacks.filter(function (callback) {
        return callback !== false;
      });
      return callbackArray.length ? function () {
        return callbackArray.forEach(function (callback) {
          return callback();
        });
      } : undefined;
    }; // A function that calls a particular event handler, parses its return
    // into a state mutation, and calls setState
    // eslint-disable-next-line max-params


    var onEvent = function (evt, childProps, eventKey, eventName) {
      var eventReturn = events[eventName](evt, childProps, eventKey, _this2);

      if (eventReturn) {
        var callbacks = compileCallbacks(eventReturn);

        _this2.setState(parseEventReturn(eventReturn, eventKey), callbacks);
      }
    }; // returns a new events object with enhanced event handlers


    return Object.keys(events).reduce(function (memo, event) {
      memo[event] = onEvent;
      return memo;
    }, {});
  },

  /* Returns a partially applied event handler for a specific target element
   * This allows event handlers to have access to props controlling each element
   */
  getPartialEvents: function (events, eventKey, childProps) {
    return events ? Object.keys(events).reduce(function (memo, eventName) {
      var appliedEvent = function (evt) {
        return events[eventName](evt, childProps, eventKey, eventName);
      };

      memo[eventName] = appliedEvent;
      return memo;
    }, {}) : {};
  },

  /* Returns the property of the state object corresponding to event changes for
   * a particular element
   */
  getEventState: function (eventKey, namespace, childType) {
    var state = this.state || {};

    if (!childType) {
      return eventKey === "parent" ? state[eventKey] && state[eventKey][namespace] || state[eventKey] : state[eventKey] && state[eventKey][namespace];
    }

    return state[childType] && state[childType][eventKey] && state[childType][eventKey][namespace];
  },

  /**
   * Returns a set of all mutations for shared events
   *
   * @param  {Array} mutations an array of mutations objects
   * @param  {Object} baseProps an object that describes all props for children of VictorySharedEvents
   * @param  {Object} baseState an object that describes state for children of VictorySharedEvents
   * @param  {Array} childNames an array of childNames
   *
   * @return {Object} a object describing all mutations for VictorySharedEvents
   */
  // eslint-disable-next-line max-params
  getExternalMutationsWithChildren: function (mutations, baseProps, baseState, childNames) {
    var _this3 = this;

    baseProps = baseProps || {};
    baseState = baseState || {};
    return childNames.reduce(function (memo, childName) {
      var childState = baseState[childName];

      var mutation = _this3.getExternalMutations(mutations, baseProps[childName], baseState[childName], childName);

      memo[childName] = mutation ? mutation : childState;
      return (0, _pickBy2.default)(memo, function (v) {
        return !(0, _isEmpty2.default)(v);
      });
    }, {});
  },

  /**
   * Returns a set of all mutations for a component
   *
   * @param  {Array} mutations an array of mutations objects
   * @param  {Object} baseProps a props object (scoped to a childName when used by shared events)
   * @param  {Object} baseState a state object (scoped to a childName when used by shared events)
   * @param  {String} childName an optional childName
   *
   * @return {Object} a object describing mutations for a given component
   */
  // eslint-disable-next-line max-params
  getExternalMutations: function (mutations, baseProps, baseState, childName) {
    var _this4 = this;

    baseProps = baseProps || {};
    baseState = baseState || {};
    var eventKeys = Object.keys(baseProps);
    return eventKeys.reduce(function (memo, eventKey) {
      var keyState = baseState[eventKey] || {};
      var keyProps = baseProps[eventKey] || {};

      if (eventKey === "parent") {
        var identifier = {
          eventKey: eventKey,
          target: "parent"
        };

        var mutation = _this4.getExternalMutation(mutations, keyProps, keyState, identifier);

        memo[eventKey] = mutation !== undefined ? (0, _assign6.default)({}, keyState, mutation) : keyState;
      } else {
        // use keys from both state and props so that elements not intially included in baseProps
        // will be used. (i.e. labels)
        var targets = (0, _uniq2.default)(Object.keys(keyProps).concat(Object.keys(keyState)));
        memo[eventKey] = targets.reduce(function (m, target) {
          var identifier = {
            eventKey: eventKey,
            target: target,
            childName: childName
          };

          var mutation = _this4.getExternalMutation(mutations, keyProps[target], keyState[target], identifier);

          m[target] = mutation !== undefined ? (0, _assign6.default)({}, keyState[target], mutation) : keyState[target];
          return (0, _pickBy2.default)(m, function (v) {
            return !(0, _isEmpty2.default)(v);
          });
        }, {});
      }

      return (0, _pickBy2.default)(memo, function (v) {
        return !(0, _isEmpty2.default)(v);
      });
    }, {});
  },

  /**
   * Returns a set of mutations for a particular element given scoped baseProps and baseState
   *
   * @param  {Array} mutations an array of mutations objects
   * @param  {Object} baseProps a props object (scoped the element specified by the identifier)
   * @param  {Object} baseState a state object (scoped the element specified by the identifier)
   * @param  {Object} identifier { eventKey, target, childName }
   *
   * @return {Object | undefined} a object describing mutations for a given element, or undefined
   */
  // eslint-disable-next-line max-params
  getExternalMutation: function (mutations, baseProps, baseState, identifier) {
    var filterMutations = function (mutation, type) {
      if (typeof mutation[type] === "string") {
        return mutation[type] === "all" || mutation[type] === identifier[type];
      } else if (Array.isArray(mutation[type])) {
        // coerce arrays to strings before matching
        var stringArray = mutation[type].map(function (m) {
          return "".concat(m);
        });
        return (0, _includes2.default)(stringArray, identifier[type]);
      } else {
        return false;
      }
    };

    mutations = Array.isArray(mutations) ? mutations : [mutations];
    var scopedMutations = mutations;

    if (identifier.childName) {
      scopedMutations = mutations.filter(function (m) {
        return filterMutations(m, "childName");
      });
    } // find any mutation objects that match the target


    var targetMutations = scopedMutations.filter(function (m) {
      return filterMutations(m, "target");
    });

    if ((0, _isEmpty2.default)(targetMutations)) {
      return undefined;
    }

    var keyMutations = targetMutations.filter(function (m) {
      return filterMutations(m, "eventKey");
    });

    if ((0, _isEmpty2.default)(keyMutations)) {
      return undefined;
    }

    return keyMutations.reduce(function (memo, curr) {
      var mutationFunction = curr && (0, _isFunction2.default)(curr.mutation) ? curr.mutation : function () {
        return undefined;
      };
      var currentMutation = mutationFunction((0, _assign6.default)({}, baseProps, baseState));
      return (0, _assign6.default)({}, memo, currentMutation);
    }, {});
  },

  /* Returns an array of defaultEvents from sub-components of a given component.
   * i.e. any static `defaultEvents` on `labelComponent` will be returned
   */
  getComponentEvents: function (props, components) {
    var events = Array.isArray(components) && components.reduce(function (memo, componentName) {
      var _memo;

      var component = props[componentName];
      var defaultEvents = component && component.type && component.type.defaultEvents;
      var componentEvents = (0, _isFunction2.default)(defaultEvents) ? defaultEvents(component.props) : defaultEvents;
      memo = Array.isArray(componentEvents) ? (_memo = memo).concat.apply(_memo, _toConsumableArray(componentEvents)) : memo;
      return memo;
    }, []);
    return events && events.length ? events : undefined;
  }
};
exports.default = _default;