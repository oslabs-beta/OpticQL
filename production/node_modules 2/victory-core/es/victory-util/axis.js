import _without from "lodash/without";
import _includes from "lodash/includes";
import _values from "lodash/values";
import _orderBy from "lodash/orderBy";
import _range from "lodash/range";
import _uniq from "lodash/uniq";
import _invert from "lodash/invert";
import _isObject from "lodash/isObject";
import _isFunction from "lodash/isFunction";
import _identity from "lodash/identity";
import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* eslint-disable func-style */
import React from "react";
import Collection from "./collection";
import Domain from "./domain";
import Helpers from "./helpers";
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
  predicate = predicate || _identity;

  var findAxes = function (children) {
    return children.reduce(function (memo, child) {
      if (child.type && child.type.role === "axis" && predicate(child)) {
        return memo.concat(child);
      } else if (child.props && child.props.children) {
        return memo.concat(findAxes(React.Children.toArray(child.props.children)));
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
        var childAxis = findComponents(React.Children.toArray(child.props.children));
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
    x: Collection.containsDates(domain.x) ? new Date(Math.min.apply(Math, _toConsumableArray(domain.x))) : getSingleOrigin(domain.x),
    y: Collection.containsDates(domain.y) ? new Date(Math.min.apply(Math, _toConsumableArray(domain.y))) : getSingleOrigin(domain.y)
  };
}

function getOriginSign(origin, domain) {
  var getSign = function () {
    return origin <= 0 && Math.max.apply(Math, _toConsumableArray(domain)) <= 0 ? "negative" : "positive";
  };

  return Collection.containsDates(domain) ? "positive" : getSign();
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
  return props.tickValues !== undefined && Collection.containsStrings(props.tickValues);
}

function getDefaultTickFormat(props) {
  var tickValues = props.tickValues;
  var axis = getAxis(props);
  var stringMap = props.stringMap && props.stringMap[axis];
  var fallbackFormat = tickValues && !Collection.containsDates(tickValues) ? function (x) {
    return x;
  } : undefined;

  if (!stringMap) {
    return stringTicks(props) ? function (x, index) {
      return tickValues[index];
    } : fallbackFormat;
  } else {
    var invertedStringMap = stringMap && _invert(stringMap);

    var tickValueArray = _orderBy(_values(stringMap), function (n) {
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
    var scaleTickFormat = scale.tickFormat && _isFunction(scale.tickFormat) ? scale.tickFormat() : function (x) {
      return x;
    };
    return defaultTickFormat || scaleTickFormat;
  } else if (tickFormat && Array.isArray(tickFormat)) {
    return function (x, index) {
      return tickFormat[index];
    };
  } else if (tickFormat && _isFunction(tickFormat)) {
    var applyStringTicks = function (tick, index, ticks) {
      var invertedStringMap = _invert(stringMap);

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
  var ticksFromCategories = categories && Collection.containsOnlyStrings(categories) ? categories.map(function (tick) {
    return stringMap[tick];
  }) : undefined;

  var ticksFromStringMap = stringMap && _values(stringMap);

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

    return Collection.containsStrings(tickFormat) ? tickFormat.map(function (t, i) {
      return i;
    }) : tickFormat;
  };

  var ticks = tickValues;

  if (stringMap) {
    ticks = getStringTicks(props);
  }

  if (tickValues && Collection.containsStrings(tickValues)) {
    ticks = stringMap ? tickValues.map(function (tick) {
      return stringMap[tick];
    }) : _range(1, tickValues.length + 1);
  }

  var tickArray = ticks ? _uniq(ticks) : getTicksFromFormat(props);

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
  } else if (scale.ticks && _isFunction(scale.ticks)) {
    // eslint-disable-next-line no-magic-numbers
    var defaultTickCount = tickCount || 5;
    var scaleTicks = scale.ticks(defaultTickCount);
    var tickArray = Array.isArray(scaleTicks) && scaleTicks.length ? scaleTicks : scale.domain();
    var ticks = downsampleTicks(tickArray, tickCount);

    if (filterZero) {
      var filteredTicks = _includes(ticks, 0) ? _without(ticks, 0) : ticks;
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

  var minDomain = Domain.getMinFromProps(props, axis);
  var maxDomain = Domain.getMaxFromProps(props, axis);
  var tickStrings = stringTicks(props);
  var ticks = tickValues.map(function (value) {
    return +value;
  });
  var defaultMin = tickStrings ? 1 : Collection.getMinValue(ticks);
  var defaultMax = tickStrings ? tickValues.length : Collection.getMaxValue(ticks);
  var min = minDomain !== undefined ? minDomain : defaultMin;
  var max = maxDomain !== undefined ? maxDomain : defaultMax;
  var initialDomain = Domain.getDomainFromMinMax(min, max);
  var domain = polar && axis === "x" && Math.abs(startAngle - endAngle) === 360 ? Domain.getSymmetricDomain(initialDomain, ticks) : initialDomain;

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

  return Domain.createDomainFunction(getDomainFromData)(props, inherentAxis);
}

function getAxisValue(props, axis) {
  if (!props.axisValue) {
    return undefined;
  }

  var scaleAxis = axis === "x" ? "y" : "x";
  var scale = _isObject(props.scale) && _isFunction(props.scale[scaleAxis]) ? props.scale[scaleAxis] : undefined;

  if (!scale) {
    return undefined;
  }

  var stringMapAxis = axis === "x" ? "y" : "x";
  var stringMap = _isObject(props.stringMap) && props.stringMap[stringMapAxis];
  var axisValue = stringMap && typeof props.axisValue === "string" ? stringMap[props.axisValue] : props.axisValue;
  return scale(axisValue);
}

function modifyProps(props, fallbackProps) {
  if (!_isObject(props.theme)) {
    return Helpers.modifyProps(props, fallbackProps, "axis");
  }

  var role = "axis";

  if (props.dependentAxis && props.theme.dependentAxis) {
    role = "dependentAxis";
  } else if (!props.dependentAxis && props.theme.independentAxis) {
    role = "independentAxis";
  }

  if (role === "axis") {
    return Helpers.modifyProps(props, fallbackProps, "axis");
  }

  var axisTheme = _defaults({}, props.theme[role], props.theme.axis);

  var theme = _assign({}, props.theme, {
    axis: axisTheme
  });

  return Helpers.modifyProps(_assign({}, props, {
    theme: theme
  }), fallbackProps, "axis");
}

export default {
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