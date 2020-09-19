"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isDate2 = _interopRequireDefault(require("lodash/isDate"));

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _sortedUniq2 = _interopRequireDefault(require("lodash/sortedUniq"));

var _isPlainObject2 = _interopRequireDefault(require("lodash/isPlainObject"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _react = _interopRequireDefault(require("react"));

var _data = _interopRequireDefault(require("./data"));

var _scale = _interopRequireDefault(require("./scale"));

var _helpers = _interopRequireDefault(require("./helpers"));

var _collection = _interopRequireDefault(require("./collection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// Private Methods
function cleanDomain(domain, props, axis) {
  var scaleType = _scale.default.getScaleType(props, axis);

  if (scaleType !== "log") {
    return domain;
  }

  var rules = function (dom) {
    var almostZero = dom[0] < 0 || dom[1] < 0 ? -1 / Number.MAX_SAFE_INTEGER : 1 / Number.MAX_SAFE_INTEGER;
    var domainOne = dom[0] === 0 ? almostZero : dom[0];
    var domainTwo = dom[1] === 0 ? almostZero : dom[1];
    return [domainOne, domainTwo];
  };

  return rules(domain);
}

function getDomainPadding(props, axis) {
  var formatPadding = function (padding) {
    return Array.isArray(padding) ? {
      left: padding[0],
      right: padding[1]
    } : {
      left: padding,
      right: padding
    };
  };

  return (0, _isPlainObject2.default)(props.domainPadding) ? formatPadding(props.domainPadding[axis]) : formatPadding(props.domainPadding);
}

function getFlatData(dataset, axis) {
  return (0, _flatten2.default)(dataset).map(function (datum) {
    return datum["_".concat(axis)] && datum["_".concat(axis)][1] !== undefined ? datum["_".concat(axis)][1] : datum["_".concat(axis)];
  });
}

function getExtremeFromData(dataset, axis) {
  var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "min";

  var getExtreme = function (arr) {
    return type === "max" ? Math.max.apply(Math, _toConsumableArray(arr)) : Math.min.apply(Math, _toConsumableArray(arr));
  };

  var initialValue = type === "max" ? -Infinity : Infinity;
  var containsDate = false;
  var result = (0, _flatten2.default)(dataset).reduce(function (memo, datum) {
    var current0 = datum["_".concat(axis, "0")] !== undefined ? datum["_".concat(axis, "0")] : datum["_".concat(axis)];
    var current1 = datum["_".concat(axis, "1")] !== undefined ? datum["_".concat(axis, "1")] : datum["_".concat(axis)];
    var current = getExtreme([current0, current1]);
    containsDate = containsDate || current0 instanceof Date || current1 instanceof Date;
    return getExtreme([memo, current]);
  }, initialValue);
  return containsDate ? new Date(result) : result;
} //eslint-disable-next-line max-statements


function padDomain(domain, props, axis) {
  if (!props.domainPadding) {
    return domain;
  }

  var minDomain = getMinFromProps(props, axis);
  var maxDomain = getMaxFromProps(props, axis);
  var padding = getDomainPadding(props, axis);

  if (!padding.left && !padding.right) {
    return domain;
  }

  var min = _collection.default.getMinValue(domain);

  var max = _collection.default.getMaxValue(domain);

  var currentAxis = _helpers.default.getCurrentAxis(axis, props.horizontal);

  var range = _helpers.default.getRange(props, currentAxis);

  var rangeExtent = Math.abs(range[0] - range[1]); // Naive initial padding calculation

  var initialPadding = {
    left: Math.abs(max - min) * padding.left / rangeExtent,
    right: Math.abs(max - min) * padding.right / rangeExtent
  };
  var singleQuadrantDomainPadding = (0, _isPlainObject2.default)(props.singleQuadrantDomainPadding) ? props.singleQuadrantDomainPadding[axis] : props.singleQuadrantDomainPadding;

  var adjust = function (val, type) {
    if (singleQuadrantDomainPadding === false) {
      return val;
    }

    var coerce = type === "min" && min >= 0 && val <= 0 || type === "max" && max <= 0 && val >= 0;
    return coerce ? 0 : val;
  }; // Adjust the domain by the initial padding


  var adjustedDomain = {
    min: adjust(min.valueOf() - initialPadding.left, "min"),
    max: adjust(max.valueOf() + initialPadding.right, "max")
  }; // re-calculate padding, taking the adjusted domain into account

  var finalPadding = {
    left: Math.abs(adjustedDomain.max - adjustedDomain.min) * padding.left / rangeExtent,
    right: Math.abs(adjustedDomain.max - adjustedDomain.min) * padding.right / rangeExtent
  }; // Adjust the domain by the final padding

  var paddedDomain = {
    min: adjust(min.valueOf() - finalPadding.left, "min"),
    max: adjust(max.valueOf() + finalPadding.right, "max")
  }; // default to minDomain / maxDomain if they exist

  var finalDomain = {
    min: minDomain !== undefined ? minDomain : paddedDomain.min,
    max: maxDomain !== undefined ? maxDomain : paddedDomain.max
  };
  return min instanceof Date || max instanceof Date ? getDomainFromMinMax(new Date(finalDomain.min), new Date(finalDomain.max)) : getDomainFromMinMax(finalDomain.min, finalDomain.max);
} // Public Methods

/**
 * Returns a getDomain function
 * @param {Function} getDomainFromDataFunction: a function that takes props and axis and
 * returns a domain based on data
 * @param {Function} formatDomainFunction: a function that takes domain, props, and axis and
 * returns a formatted domain
 * @returns {Function} a function that takes props and axis and returns a formatted domain
 */


function createDomainFunction(getDomainFromDataFunction, formatDomainFunction) {
  getDomainFromDataFunction = (0, _isFunction2.default)(getDomainFromDataFunction) ? getDomainFromDataFunction : getDomainFromData;
  formatDomainFunction = (0, _isFunction2.default)(formatDomainFunction) ? formatDomainFunction : formatDomain;
  return function (props, axis) {
    var propsDomain = getDomainFromProps(props, axis);

    if (propsDomain) {
      return formatDomainFunction(propsDomain, props, axis);
    }

    var categories = _data.default.getCategories(props, axis);

    var domain = categories ? getDomainFromCategories(props, axis, categories) : getDomainFromDataFunction(props, axis);
    return domain ? formatDomainFunction(domain, props, axis) : undefined;
  };
}
/**
 * Returns a formatted domain.
 * @param {Array} domain: a domain in the form of a two element array
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @returns {Array} a domain in the form of a two element array
 */


function formatDomain(domain, props, axis) {
  return cleanDomain(padDomain(domain, props, axis), props, axis);
}
/**
 * Returns a domain for a given axis based on props, category, or data
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @returns {Array} the domain for the given axis
 */


function getDomain(props, axis) {
  return createDomainFunction()(props, axis);
}
/**
 * Returns a domain based on categories if they exist
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @param {Array} categories: an array of categories corresponding to a given axis
 * @returns {Array|undefined} returns a domain from categories or undefined
 */


function getDomainFromCategories(props, axis, categories) {
  categories = categories || _data.default.getCategories(props, axis);
  var polar = props.polar,
      _props$startAngle = props.startAngle,
      startAngle = _props$startAngle === void 0 ? 0 : _props$startAngle,
      _props$endAngle = props.endAngle,
      endAngle = _props$endAngle === void 0 ? 360 : _props$endAngle;

  if (!categories) {
    return undefined;
  }

  var minDomain = getMinFromProps(props, axis);
  var maxDomain = getMaxFromProps(props, axis);
  var stringArray = _collection.default.containsStrings(categories) ? _data.default.getStringsFromCategories(props, axis) : [];
  var stringMap = stringArray.length === 0 ? null : stringArray.reduce(function (memo, string, index) {
    memo[string] = index + 1;
    return memo;
  }, {});
  var categoryValues = stringMap ? categories.map(function (value) {
    return stringMap[value];
  }) : categories;
  var min = minDomain !== undefined ? minDomain : _collection.default.getMinValue(categoryValues);
  var max = maxDomain !== undefined ? maxDomain : _collection.default.getMaxValue(categoryValues);
  var categoryDomain = getDomainFromMinMax(min, max);
  return polar && axis === "x" && Math.abs(startAngle - endAngle) === 360 ? getSymmetricDomain(categoryDomain, categoryValues) : categoryDomain;
}
/**
 * Returns a domain from a dataset for a given axis
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @param {Array} dataset: an array of data
 * @returns {Array} the domain based on data
 */


function getDomainFromData(props, axis, dataset) {
  dataset = dataset || _data.default.getData(props);
  var polar = props.polar,
      _props$startAngle2 = props.startAngle,
      startAngle = _props$startAngle2 === void 0 ? 0 : _props$startAngle2,
      _props$endAngle2 = props.endAngle,
      endAngle = _props$endAngle2 === void 0 ? 360 : _props$endAngle2;
  var minDomain = getMinFromProps(props, axis);
  var maxDomain = getMaxFromProps(props, axis);

  if (dataset.length < 1) {
    return minDomain !== undefined && maxDomain !== undefined ? getDomainFromMinMax(minDomain, maxDomain) : undefined;
  }

  var min = minDomain !== undefined ? minDomain : getExtremeFromData(dataset, axis, "min");
  var max = maxDomain !== undefined ? maxDomain : getExtremeFromData(dataset, axis, "max");
  var domain = getDomainFromMinMax(min, max);
  return polar && axis === "x" && Math.abs(startAngle - endAngle) === 360 ? getSymmetricDomain(domain, getFlatData(dataset, axis)) : domain;
}
/**
 * Returns a domain in the form of a two element array given a min and max value.
 * @param {Number|Date} min: the props object
 * @param {Number|Date} max: the current axis
 * @returns {Array} the minDomain based on props
 */


function getDomainFromMinMax(min, max) {
  var getSinglePointDomain = function (val) {
    // d3-scale does not properly resolve very small differences.
    // eslint-disable-next-line no-magic-numbers
    var verySmallNumber = val === 0 ? 2 * Math.pow(10, -10) : Math.pow(10, -10);
    var verySmallDate = 1;
    var minVal = val instanceof Date ? new Date(+val - verySmallDate) : +val - verySmallNumber;
    var maxVal = val instanceof Date ? new Date(+val + verySmallDate) : +val + verySmallNumber;
    return val === 0 ? [0, maxVal] : [minVal, maxVal];
  };

  return +min === +max ? getSinglePointDomain(max) : [min, max];
}
/**
 * Returns a the domain for a given axis if domain is given in props
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @returns {Array|undefined} the domain based on props
 */


function getDomainFromProps(props, axis) {
  var minDomain = getMinFromProps(props, axis);
  var maxDomain = getMaxFromProps(props, axis);

  if ((0, _isPlainObject2.default)(props.domain) && props.domain[axis]) {
    return props.domain[axis];
  } else if (Array.isArray(props.domain)) {
    return props.domain;
  } else if (minDomain !== undefined && maxDomain !== undefined) {
    return getDomainFromMinMax(minDomain, maxDomain);
  }

  return undefined;
}
/**
 * Returns a domain for a given axis. This method forces the domain to include
 * zero unless the domain is explicitly specified in props.
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @returns {Array} the domain for the given axis
 */


function getDomainWithZero(props, axis) {
  var propsDomain = getDomainFromProps(props, axis);

  if (propsDomain) {
    return propsDomain;
  }

  var dataset = _data.default.getData(props);

  var y0Min = dataset.reduce(function (min, datum) {
    return datum._y0 < min ? datum._y0 : min;
  }, Infinity);

  var ensureZero = function (domain) {
    if (axis === "x") {
      return domain;
    }

    var defaultMin = y0Min !== Infinity ? y0Min : 0;
    var maxDomainProp = getMaxFromProps(props, axis);
    var minDomainProp = getMinFromProps(props, axis);
    var max = maxDomainProp !== undefined ? maxDomainProp : _collection.default.getMaxValue(domain, defaultMin);
    var min = minDomainProp !== undefined ? minDomainProp : _collection.default.getMinValue(domain, defaultMin);
    return getDomainFromMinMax(min, max);
  };

  var getDomainFunction = function () {
    return getDomainFromData(props, axis, dataset);
  };

  var formatDomainFunction = function (domain) {
    return formatDomain(ensureZero(domain), props, axis);
  };

  return createDomainFunction(getDomainFunction, formatDomainFunction)(props, axis);
}
/**
 * Returns the maxDomain from props if it exists
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @returns {Number|Date|undefined} the maxDomain based on props
 */


function getMaxFromProps(props, axis) {
  if ((0, _isPlainObject2.default)(props.maxDomain) && props.maxDomain[axis] !== undefined) {
    return props.maxDomain[axis];
  }

  return typeof props.maxDomain === "number" || (0, _isDate2.default)(props.maxDomain) ? props.maxDomain : undefined;
}
/**
 * Returns the minDomain from props if it exists
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @returns {Number|Date|undefined} the minDomain based on props
 */


function getMinFromProps(props, axis) {
  if ((0, _isPlainObject2.default)(props.minDomain) && props.minDomain[axis] !== undefined) {
    return props.minDomain[axis];
  }

  return typeof props.minDomain === "number" || (0, _isDate2.default)(props.minDomain) ? props.minDomain : undefined;
}
/**
 * Returns a symmetrically padded domain for polar charts
 * @param {Array} domain: the original domain
 * @param {Array} values: a flat array of values corresponding to either tickValues, or data values
 * for a given dimension i.e. only x values.
 * @returns {Array} the symmetric domain
 */


function getSymmetricDomain(domain, values) {
  var processedData = (0, _sortedUniq2.default)(values.sort(function (a, b) {
    return a - b;
  }));
  var step = processedData[1] - processedData[0];
  return [domain[0], domain[1] + step];
}
/**
 * Checks whether a given component can be used to calculate domain
 * @param {Component} component: a React component instance
 * @returns {Boolean} Returns true if the given component has a role included in the whitelist
 */


function isDomainComponent(component) {
  var getRole = function (child) {
    return child && child.type ? child.type.role : "";
  };

  var role = getRole(component);

  if (role === "portal") {
    var children = _react.default.Children.toArray(component.props.children);

    role = children.length ? getRole(children[0]) : "";
  }

  var whitelist = ["area", "axis", "bar", "boxplot", "candlestick", "errorbar", "group", "histogram", "line", "pie", "scatter", "stack", "voronoi"];
  return (0, _includes2.default)(whitelist, role);
}

var _default = {
  createDomainFunction: createDomainFunction,
  formatDomain: formatDomain,
  getDomain: getDomain,
  getDomainFromCategories: getDomainFromCategories,
  getDomainFromData: getDomainFromData,
  getDomainFromMinMax: getDomainFromMinMax,
  getDomainFromProps: getDomainFromProps,
  getDomainWithZero: getDomainWithZero,
  getMaxFromProps: getMaxFromProps,
  getMinFromProps: getMinFromProps,
  getSymmetricDomain: getSymmetricDomain,
  isDomainComponent: isDomainComponent
};
exports.default = _default;