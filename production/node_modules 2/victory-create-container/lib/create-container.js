"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineContainerMixins = exports.makeCreateContainerFunction = exports.createContainer = void 0;

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _flow2 = _interopRequireDefault(require("lodash/flow"));

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _forOwn2 = _interopRequireDefault(require("lodash/forOwn"));

var _groupBy2 = _interopRequireDefault(require("lodash/groupBy"));

var _toPairs2 = _interopRequireDefault(require("lodash/toPairs"));

var _victoryCore = require("victory-core");

var _victoryVoronoiContainer = require("victory-voronoi-container");

var _victoryZoomContainer = require("victory-zoom-container");

var _victorySelectionContainer = require("victory-selection-container");

var _victoryBrushContainer = require("victory-brush-container");

var _victoryCursorContainer = require("victory-cursor-container");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var ensureArray = function (thing) {
  if (!thing) {
    return [];
  } else if (!Array.isArray(thing)) {
    return [thing];
  } else {
    return thing;
  }
};

var combineEventHandlers = function (eventHandlersArray) {
  // takes an array of event handler objects and produces one eventHandlers object
  // creates a custom combinedHandler() for events with multiple conflicting handlers
  return eventHandlersArray.reduce(function (localHandlers, finalHandlers) {
    (0, _forOwn2.default)(localHandlers, function (localHandler, eventName) {
      var existingHandler = finalHandlers[eventName];

      if (existingHandler) {
        // create new handler for event that concats the existing handler's mutations with new ones
        finalHandlers[eventName] = function combinedHandler() {
          // named for debug clarity
          // sometimes handlers return undefined; use empty array instead, for concat()
          var existingMutations = ensureArray(existingHandler.apply(void 0, arguments));
          var localMutations = ensureArray(localHandler.apply(void 0, arguments));
          return existingMutations.concat(localMutations);
        };
      } else {
        finalHandlers[eventName] = localHandler;
      }
    });
    return finalHandlers;
  });
};

var combineDefaultEvents = function (defaultEvents) {
  // takes a defaultEvents array and returns one equal or lesser length,
  // by combining any events that have the same target
  var eventsByTarget = (0, _groupBy2.default)(defaultEvents, "target");
  var events = (0, _toPairs2.default)(eventsByTarget).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        target = _ref2[0],
        eventsArray = _ref2[1];

    eventsArray = eventsArray.filter(Boolean);
    return (0, _isEmpty2.default)(eventsArray) ? null : {
      target: target,
      eventHandlers: combineEventHandlers(eventsArray.map(function (event) {
        return event.eventHandlers;
      })) // note: does not currently handle eventKey or childName

    };
  });
  return events.filter(Boolean);
};

var combineContainerMixins = function (mixins, Container) {
  var _class, _temp;

  // similar to Object.assign(A, B), this function will decide conflicts in favor mixinB.
  // this applies to propTypes and defaultProps.
  // getChildren will call A's getChildren() and pass the resulting children to B's.
  // defaultEvents attempts to resolve any conflicts between A and B's defaultEvents.
  var Classes = mixins.map(function (mixin) {
    return mixin(Container);
  });
  var instances = Classes.map(function (Class) {
    return new Class();
  });
  var NaiveCombinedContainer = (0, _flow2.default)(mixins)(Container);
  var displayType = Classes.map(function (Class) {
    var match = Class.displayName.match(/Victory(.*)Container/);
    return match[1] || "";
  }).join("");
  return _temp = _class =
  /*#__PURE__*/
  function (_NaiveCombinedContain) {
    _inherits(VictoryCombinedContainer, _NaiveCombinedContain);

    function VictoryCombinedContainer() {
      _classCallCheck(this, VictoryCombinedContainer);

      return _possibleConstructorReturn(this, (VictoryCombinedContainer.__proto__ || Object.getPrototypeOf(VictoryCombinedContainer)).apply(this, arguments));
    }

    _createClass(VictoryCombinedContainer, [{
      key: "getChildren",
      value: function getChildren(props) {
        return instances.reduce(function (children, instance) {
          return instance.getChildren(_objectSpread({}, props, {
            children: children
          }));
        }, props.children);
      }
    }]);

    return VictoryCombinedContainer;
  }(NaiveCombinedContainer), Object.defineProperty(_class, "displayName", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: "Victory".concat(displayType, "Container")
  }), Object.defineProperty(_class, "propTypes", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: Classes.reduce(function (propTypes, Class) {
      return _objectSpread({}, propTypes, Class.propTypes);
    }, {})
  }), Object.defineProperty(_class, "defaultProps", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: Classes.reduce(function (defaultProps, Class) {
      return _objectSpread({}, defaultProps, Class.defaultProps);
    }, {})
  }), Object.defineProperty(_class, "defaultEvents", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: function (props) {
      return combineDefaultEvents(Classes.reduce(function (defaultEvents, Class) {
        var events = (0, _isFunction2.default)(Class.defaultEvents) ? Class.defaultEvents(props) : Class.defaultEvents;
        return _toConsumableArray(defaultEvents).concat(_toConsumableArray(events));
      }, []));
    }
  }), _temp;
};

exports.combineContainerMixins = combineContainerMixins;

var checkBehaviorName = function (behavior, behaviors) {
  if (behavior && !(0, _includes2.default)(behaviors, behavior)) {
    _victoryCore.Log.warn("\"".concat(behavior, "\" is not a valid behavior. Choose from [").concat(behaviors.join(", "), "]."));
  }
};

var makeCreateContainerFunction = function (mixinMap, Container) {
  return function (behaviorA, behaviorB) {
    // eslint-disable-line
    var behaviors = Object.keys(mixinMap);
    checkBehaviorName(behaviorA, behaviors);
    checkBehaviorName(behaviorB, behaviors);

    if (arguments.length <= 2 ? 0 : arguments.length - 2) {
      _victoryCore.Log.warn("too many arguments given to createContainer (maximum accepted: 2).");
    }

    var firstMixins = mixinMap[behaviorA];
    var secondMixins = mixinMap[behaviorB] || [];

    if (!firstMixins) {
      return Container;
    }

    return combineContainerMixins(_toConsumableArray(firstMixins).concat(_toConsumableArray(secondMixins)), Container);
  };
};

exports.makeCreateContainerFunction = makeCreateContainerFunction;
var createContainer = makeCreateContainerFunction({
  zoom: [_victoryZoomContainer.zoomContainerMixin],
  voronoi: [_victoryVoronoiContainer.voronoiContainerMixin],
  selection: [_victorySelectionContainer.selectionContainerMixin],
  cursor: [_victoryCursorContainer.cursorContainerMixin],
  brush: [_victoryBrushContainer.brushContainerMixin]
}, _victoryCore.VictoryContainer);
exports.createContainer = createContainer;