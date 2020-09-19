"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _without2 = _interopRequireDefault(require("lodash/without"));

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _values2 = _interopRequireDefault(require("lodash/values"));

var _orderBy2 = _interopRequireDefault(require("lodash/orderBy"));

var _range2 = _interopRequireDefault(require("lodash/range"));

var _uniq2 = _interopRequireDefault(require("lodash/uniq"));

var _invert2 = _interopRequireDefault(require("lodash/invert"));

var _isObject2 = _interopRequireDefault(require("lodash/isObject"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _identity2 = _interopRequireDefault(require("lodash/identity"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _react = _interopRequireDefault(require("react"));

var _collection = _interopRequireDefault(require("./collection"));

var _domain = _interopRequireDefault(require("./domain"));

var _helpers = _interopRequireDefault(require("./helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/**
 * Returns the axis (x or y) of a particular axis component
 * @param {Object} props: the props object.
 * @param {Boolean} horizontal: true for horizontal charts
 * @returns {String} the dimension appropriate for the axis given its props
 */
function getAxis(props) {
  var dependentAxis = props.dependentAxis;
  return dependentAxis ? "y" : "x";
}
/**
 * Returns all axis components that pass a given predicate
 * @param {Array} childComponents: an array of children
 * @param {Function} predicate: a predicate function that will be called with each
 * @returns {Array} all axis components that pass the given predicate or []
 */


function findAxisComponents(childComponents, predicate) {
  predicate = predicate || _identity2.default;

  var findAxes = function (children) {
    return children.reduce(function (memo, child) {
      if (child.type && child.type.role === "axis" && predicate(child)) {
        return memo.concat(child);
      } else if (child.props && child.props.children) {
        return memo.concat(findAxes(_react.default.Children.toArray(child.props.children)));
      }

      return memo;
    }, []);
  };

  return findAxes(childComponents);
}
/**
 * Returns a single axis component of the desired axis type (x or y)
 * @param {Array} childComponents: an array of children
 * @param {String} axis: desired axis either "x" or "y".
 * @returns {ReactComponent} an axis component of the desired axis or undefined
 */


function getAxisComponent(childComponents, axis) {
  var matchesAxis = function (component) {
    var type = component.type.getAxis(component.props);
    return type === axis;
  };

  return findAxisComponents(childComponents, matchesAxis)[0];
}
/**
 * Returns all axis components of the desired axis type (x or y) along with any
 * parent components excluding VictoryChart
 * @param {Array} childComponents: an optional array of children.
 * @param {String} type: desired axis either "dependent" or "independent".
 * @returns {ReactComponent} an axis component of the desired type or undefined
 */


function getAxisComponentsWithParent(childComponents, type) {
  var matchesType = function (child) {
    return type === "dependent" ? child.props.dependentAxis : !child.props.dependentAxis;
  };

  var findComponents = function (children) {
    return children.reduce(function (memo, child) {
      if (child.type && child.type.role === "axis" && matchesType(child)) {
        return memo.concat(child);
      } else if (child.props && child.props.children) {
        var childAxis = findComponents(_react.default.Children.toArray(child.props.children));
        return childAxis.length > 0 ? memo.concat(child) : memo;
      }

      return memo;
    }, []);
  };

  return findComponents(childComponents);
}

function getOrigin(domain) {
  var getSingleOrigin = function (d) {
    var domainMin = Math.min.apply(Math, _toConsumableArray(d));
    var domainMax = Math.max.apply(Math, _toConsumableArray(d));
    return domainMax < 0 ? domainMax : Math.max(0, domainMin);
  };

  return {
    x: _collection.default.containsDates(domain.x) ? new Date(Math.min.apply(Math, _toConsumableArray(domain.x))) : getSingleOrigin(domain.x),
    y: _collection.default.containsDates(domain.y) ? new Date(Math.min.apply(Math, _toConsumableArray(domain.y))) : getSingleOrigin(domain.y)
  };
}

function getOriginSign(origin, domain) {
  var getSign = function () {
    return origin <= 0 && Math.max.apply(Math, _toConsumableArray(domain)) <= 0 ? "negative" : "positive";
  };

  return _collection.default.containsDates(domain) ? "positive" : getSign();
}
/**
 * @param {Object} props: axis component props
 * @returns {Boolean} true when the axis is vertical
 */


function isVertical(props) {
  var orientation = props.orientation || (props.dependentAxis ? "left" : "bottom");
  var vertical = {
    top: false,
    bottom: false,
    left: true,
    right: true
  };
  return vertical[orientation];
}
/**
 * @param {Object} props: axis component props
 * @returns {Boolean} true when tickValues contain strings
 */


function stringTicks(props) {
  return props.tickValues !== undefined && _collection.default.containsStrings(props.tickValues);
}

function getDefaultTickFormat(props) {
  var tickValues = props.tickValues;
  var axis = getAxis(props);
  var stringMap = props.stringMap && props.stringMap[axis];
  var fallbackFormat = tickValues && !_collection.default.containsDates(tickValues) ? function (x) {
    return x;
  } : undefined;

  if (!stringMap) {
    return stringTicks(props) ? function (x, index) {
      return tickValues[index];
    } : fallbackFormat;
  } else {
    var invertedStringMap = stringMap && (0, _invert2.default)(stringMap);
    var tickValueArray = (0, _orderBy2.default)((0, _values2.default)(stringMap), function (n) {
      return n;
    });
    var dataNames = tickValueArray.map(function (tick) {
      return invertedStringMap[tick];
    }); // string ticks should have one tick of padding at the beginning

    var dataTicks = [""].concat(_toConsumableArray(dataNames), [""]);
    return function (x) {
      return dataTicks[x];
    };
  }
}

function getTickFormat(props, scale) {
  var tickFormat = props.tickFormat;
  var axis = getAxis(props);
  var stringMap = props.stringMap && props.stringMap[axis];

  if (!tickFormat) {
    var defaultTickFormat = getDefaultTickFormat(props);
    var scaleTickFormat = scale.tickFormat && (0, _isFunction2.default)(scale.tickFormat) ? scale.tickFormat() : function (x) {
      return x;
    };
    return defaultTickFormat || scaleTickFormat;
  } else if (tickFormat && Array.isArray(tickFormat)) {
    return function (x, index) {
      return tickFormat[index];
    };
  } else if (tickFormat && (0, _isFunction2.default)(tickFormat)) {
    var applyStringTicks = function (tick, index, ticks) {
      var invertedStringMap = (0, _invert2.default)(stringMap);
      var stringTickArray = ticks.map(function (t) {
        return invertedStringMap[t];
      });
      return props.tickFormat(invertedStringMap[tick], index, stringTickArray);
    };

    return stringMap ? applyStringTicks : tickFormat;
  } else {
    return function (x) {
      return x;
    };
  }
}

function getStringTicks(props) {
  var axis = getAxis(props);
  var stringMap = props.stringMap && props.stringMap[axis];
  var categories = Array.isArray(props.categories) ? props.categories : props.categories && props.categories[axis];
  var ticksFromCategories = categories && _collection.default.containsOnlyStrings(categories) ? categories.map(function (tick) {
    return stringMap[tick];
  }) : undefined;
  var ticksFromStringMap = stringMap && (0, _values2.default)(stringMap);
  return ticksFromCategories && ticksFromCategories.length !== 0 ? ticksFromCategories : ticksFromStringMap;
}

function getTickArray(props) {
  var tickValues = props.tickValues,
      tickFormat = props.tickFormat;
  var axis = getAxis(props);
  var stringMap = props.stringMap && props.stringMap[axis];

  var getTicksFromFormat = function () {
    if (!tickFormat || !Array.isArray(tickFormat)) {
      return undefined;
    }

    return _collection.default.containsStrings(tickFormat) ? tickFormat.map(function (t, i) {
      return i;
    }) : tickFormat;
  };

  var ticks = tickValues;

  if (stringMap) {
    ticks = getStringTicks(props);
  }

  if (tickValues && _collection.default.containsStrings(tickValues)) {
    ticks = stringMap ? tickValues.map(function (tick) {
      return stringMap[tick];
    }) : (0, _range2.default)(1, tickValues.length + 1);
  }

  var tickArray = ticks ? (0, _uniq2.default)(ticks) : getTicksFromFormat(props);

  var filterArray = function (arr) {
    var domain = props.domain && props.domain[axis] || props.domain;
    return Array.isArray(domain) ? arr.filter(function (t) {
      return t >= Math.min.apply(Math, _toConsumableArray(domain)) && t <= Math.max.apply(Math, _toConsumableArray(domain));
    }) : arr;
  };

  return Array.isArray(tickArray) && tickArray.length ? filterArray(tickArray) : undefined;
}

function downsampleTicks(ticks, tickCount) {
  if (!tickCount || !Array.isArray(ticks) || ticks.length <= tickCount) {
    return ticks;
  }

  var k = Math.floor(ticks.length / tickCount);
  return ticks.filter(function (d, i) {
    return i % k === 0;
  });
}

function getTicks(props, scale, filterZero) {
  var tickCount = props.tickCount;
  var tickValues = getTickArray(props);

  if (tickValues) {
    return downsampleTicks(tickValues, tickCount);
  } else if (scale.ticks && (0, _isFunction2.default)(scale.ticks)) {
    // eslint-disable-next-line no-magic-numbers
    var defaultTickCount = tickCount || 5;
    var scaleTicks = scale.ticks(defaultTickCount);
    var tickArray = Array.isArray(scaleTicks) && scaleTicks.length ? scaleTicks : scale.domain();
    var ticks = downsampleTicks(tickArray, tickCount);

    if (filterZero) {
      var filteredTicks = (0, _includes2.default)(ticks, 0) ? (0, _without2.default)(ticks, 0) : ticks;
      return filteredTicks.length ? filteredTicks : ticks;
    }

    return ticks;
  }

  return scale.domain();
}
/**
 * Returns a domain based tickValues
 * @param {Object} props: the props object
 * @param {String} axis: either x or y
 * @returns {Array} returns a domain from tickValues
 */
//eslint-disable-next-line max-statements


function getDomainFromData(props, axis) {
  var polar = props.polar,
      _props$startAngle = props.startAngle,
      startAngle = _props$startAngle === void 0 ? 0 : _props$startAngle,
      _props$endAngle = props.endAngle,
      endAngle = _props$endAngle === void 0 ? 360 : _props$endAngle;
  var tickValues = getTickArray(props);

  if (!Array.isArray(tickValues)) {
    return undefined;
  }

  var minDomain = _domain.default.getMinFromProps(props, axis);

  var maxDomain = _domain.default.getMaxFromProps(props, axis);

  var tickStrings = stringTicks(props);
  var ticks = tickValues.map(function (value) {
    return +value;
  });
  var defaultMin = tickStrings ? 1 : _collection.default.getMinValue(ticks);
  var defaultMax = tickStrings ? tickValues.length : _collection.default.getMaxValue(ticks);
  var min = minDomain !== undefined ? minDomain : defaultMin;
  var max = maxDomain !== undefined ? maxDomain : defaultMax;

  var initialDomain = _domain.default.getDomainFromMinMax(min, max);

  var domain = polar && axis === "x" && Math.abs(startAngle - endAngle) === 360 ? _domain.default.getSymmetricDomain(initialDomain, ticks) : initialDomain;

  if (isVertical(props) && !polar) {
    domain.reverse();
  }

  return domain;
} // exposed for use by VictoryChart


function getDomain(props, axis) {
  var inherentAxis = getAxis(props);

  if (axis && axis !== inherentAxis) {
    return undefined;
  }

  return _domain.default.createDomainFunction(getDomainFromData)(props, inherentAxis);
}

function getAxisValue(props, axis) {
  if (!props.axisValue) {
    return undefined;
  }

  var scaleAxis = axis === "x" ? "y" : "x";
  var scale = (0, _isObject2.default)(props.scale) && (0, _isFunction2.default)(props.scale[scaleAxis]) ? props.scale[scaleAxis] : undefined;

  if (!scale) {
    return undefined;
  }

  var stringMapAxis = axis === "x" ? "y" : "x";
  var stringMap = (0, _isObject2.default)(props.stringMap) && props.stringMap[stringMapAxis];
  var axisValue = stringMap && typeof props.axisValue === "string" ? stringMap[props.axisValue] : props.axisValue;
  return scale(axisValue);
}

function modifyProps(props, fallbackProps) {
  if (!(0, _isObject2.default)(props.theme)) {
    return _helpers.default.modifyProps(props, fallbackProps, "axis");
  }

  var role = "axis";

  if (props.dependentAxis && props.theme.dependentAxis) {
    role = "dependentAxis";
  } else if (!props.dependentAxis && props.theme.independentAxis) {
    role = "independentAxis";
  }

  if (role === "axis") {
    return _helpers.default.modifyProps(props, fallbackProps, "axis");
  }

  var axisTheme = (0, _defaults2.default)({}, props.theme[role], props.theme.axis);
  var theme = (0, _assign2.default)({}, props.theme, {
    axis: axisTheme
  });
  return _helpers.default.modifyProps((0, _assign2.default)({}, props, {
    theme: theme
  }), fallbackProps, "axis");
}

var _default = {
  getTicks: getTicks,
  getTickFormat: getTickFormat,
  getAxis: getAxis,
  getAxisComponent: getAxisComponent,
  getAxisComponentsWithParent: getAxisComponentsWithParent,
  getAxisValue: getAxisValue,
  findAxisComponents: findAxisComponents,
  getOrigin: getOrigin,
  getOriginSign: getOriginSign,
  getDomain: getDomain,
  isVertical: isVertical,
  modifyProps: modifyProps,
  stringTicks: stringTicks
};
exports.default = _default;