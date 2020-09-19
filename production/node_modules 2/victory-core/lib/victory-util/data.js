"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _orderBy2 = _interopRequireDefault(require("lodash/orderBy"));

var _property2 = _interopRequireDefault(require("lodash/property"));

var _isPlainObject2 = _interopRequireDefault(require("lodash/isPlainObject"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _last2 = _interopRequireDefault(require("lodash/last"));

var _range2 = _interopRequireDefault(require("lodash/range"));

var _uniq2 = _interopRequireDefault(require("lodash/uniq"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _react = _interopRequireDefault(require("react"));

var _helpers = _interopRequireDefault(require("./helpers"));

var _collection = _interopRequireDefault(require("./collection"));

var _scale = _interopRequireDefault(require("./scale"));

var _immutable = _interopRequireDefault(require("./immutable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

// Private Functions
function parseDatum(datum) {
  var immutableDatumWhitelist = {
    errorX: true,
    errorY: true
  };
  return _immutable.default.isImmutable(datum) ? _immutable.default.shallowToJS(datum, immutableDatumWhitelist) : datum;
}

function getLength(data) {
  return _immutable.default.isIterable(data) ? data.size : data.length;
} // Returns generated data for a given axis based on domain and sample from props


function generateDataArray(props, axis) {
  var propsDomain = (0, _isPlainObject2.default)(props.domain) ? props.domain[axis] : props.domain;

  var domain = propsDomain || _scale.default.getBaseScale(props, axis).domain();

  var samples = props.samples || 1;
  var domainMax = Math.max.apply(Math, _toConsumableArray(domain));
  var domainMin = Math.min.apply(Math, _toConsumableArray(domain));
  var step = (domainMax - domainMin) / samples;
  var values = (0, _range2.default)(domainMin, domainMax, step);
  return (0, _last2.default)(values) === domainMax ? values : values.concat(domainMax);
} // Returns sorted data. If no sort keys are provided, data is returned unaltered.


function sortData(dataset, sortKey) {
  var sortOrder = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "ascending";

  if (!sortKey) {
    return dataset;
  } // Ensures previous VictoryLine api for sortKey prop stays consistent


  if (sortKey === "x" || sortKey === "y") {
    sortKey = "_".concat(sortKey);
  }

  var order = sortOrder === "ascending" ? "asc" : "desc";
  return (0, _orderBy2.default)(dataset, sortKey, order);
} // This method will remove data points that break certain scales. (log scale only)


function cleanData(dataset, props) {
  var smallNumber = 1 / Number.MAX_SAFE_INTEGER;
  var scaleType = {
    x: _scale.default.getScaleType(props, "x"),
    y: _scale.default.getScaleType(props, "y")
  };

  if (scaleType.x !== "log" && scaleType.y !== "log") {
    return dataset;
  }

  var rules = function (datum, axis) {
    return scaleType[axis] === "log" ? datum["_".concat(axis)] !== 0 : true;
  };

  var sanitize = function (datum) {
    var _x = rules(datum, "x") ? datum._x : smallNumber;

    var _y = rules(datum, "y") ? datum._y : smallNumber;

    var _y0 = rules(datum, "y0") ? datum._y0 : smallNumber;

    return (0, _assign2.default)({}, datum, {
      _x: _x,
      _y: _y,
      _y0: _y0
    });
  };

  return dataset.map(function (datum) {
    if (rules(datum, "x") && rules(datum, "y") && rules(datum, "y0")) {
      return datum;
    }

    return sanitize(datum);
  });
} // Returns a data accessor given an eventKey prop


function getEventKey(key) {
  // creates a data accessor function
  // given a property key, path, array index, or null for identity.
  if ((0, _isFunction2.default)(key)) {
    return key;
  } else if (key === null || key === undefined) {
    return function () {
      return undefined;
    };
  } // otherwise, assume it is an array index, property key or path (_.property handles all three)


  return (0, _property2.default)(key);
} // Returns data with an eventKey prop added to each datum


function addEventKeys(props, data) {
  var hasEventKeyAccessor = !!props.eventKey;
  var eventKeyAccessor = getEventKey(props.eventKey);
  return data.map(function (datum, index) {
    if (datum.eventKey !== undefined) {
      return datum;
    } else if (hasEventKeyAccessor) {
      var eventKey = eventKeyAccessor(datum, index);
      return eventKey !== undefined ? (0, _assign2.default)({
        eventKey: eventKey
      }, datum) : datum;
    } else {
      return datum;
    }
  });
} // Exported Functions

/**
 * Returns an object mapping string data to numeric data
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @returns {Object} an object mapping string data to numeric data
 */


function createStringMap(props, axis) {
  var stringsFromAxes = getStringsFromAxes(props, axis);
  var stringsFromCategories = getStringsFromCategories(props, axis);
  var stringsFromData = getStringsFromData(props, axis);
  var allStrings = (0, _uniq2.default)(_toConsumableArray(stringsFromAxes).concat(_toConsumableArray(stringsFromCategories), _toConsumableArray(stringsFromData)));
  return allStrings.length === 0 ? null : allStrings.reduce(function (memo, string, index) {
    memo[string] = index + 1;
    return memo;
  }, {});
}
/**
 * Reduces the size of a data array, such that it is <= maxPoints.
 * @param {Array} data: an array of data; must be sorted
 * @param {Number} maxPoints: maximum number of data points to return
 * @param {Number} startingIndex: the index of the data[0] *in the entire dataset*; this function
                   assumes `data` param is a subset of larger dataset that has been zoommed
  * @returns {Array} an array of data, a subset of data param
  */


function downsample(data, maxPoints) {
  var startingIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  // ensures that the downampling of data while zooming looks good.
  var dataLength = getLength(data);

  if (dataLength > maxPoints) {
    // limit k to powers of 2, e.g. 64, 128, 256
    // so that the same points will be chosen reliably, reducing flicker on zoom
    var k = Math.pow(2, Math.ceil(Math.log2(dataLength / maxPoints)));
    return data.filter( // ensure modulo is always calculated from same reference: i + startingIndex
    function (d, i) {
      return (i + startingIndex) % k === 0;
    });
  }

  return data;
}
/**
 * Returns formatted data. Data accessors are applied, and string values are replaced.
 * @param {Array} dataset: the original domain
 * @param {Object} props: the props object
 * @param {Array} expectedKeys: an array of expected data keys
 * @returns {Array} the formatted data
 */


function formatData(dataset, props, expectedKeys) {
  var isArrayOrIterable = Array.isArray(dataset) || _immutable.default.isIterable(dataset);

  if (!isArrayOrIterable || getLength(dataset) < 1) {
    return [];
  }

  var defaultKeys = ["x", "y", "y0"];
  expectedKeys = Array.isArray(expectedKeys) ? expectedKeys : defaultKeys;

  var createAccessor = function (name) {
    return _helpers.default.createAccessor(props[name] !== undefined ? props[name] : name);
  };

  var accessor = expectedKeys.reduce(function (memo, type) {
    memo[type] = createAccessor(type);
    return memo;
  }, {});
  var preformattedData = (0, _isEqual2.default)(expectedKeys, defaultKeys) && props.x === "_x" && props.y === "_y" && props.y0 === "_y0";
  var stringMap;

  if (preformattedData === false) {
    // stringMap is not required if the data is preformatted
    stringMap = {
      x: expectedKeys.indexOf("x") !== -1 ? createStringMap(props, "x") : undefined,
      y: expectedKeys.indexOf("y") !== -1 ? createStringMap(props, "y") : undefined,
      y0: expectedKeys.indexOf("y0") !== -1 ? createStringMap(props, "y") : undefined
    };
  }

  var data = preformattedData ? dataset : dataset.reduce(function (dataArr, datum, index) {
    // eslint-disable-line complexity
    datum = parseDatum(datum);
    var fallbackValues = {
      x: index,
      y: datum
    };
    var processedValues = expectedKeys.reduce(function (memo, type) {
      var processedValue = accessor[type](datum);
      var value = processedValue !== undefined ? processedValue : fallbackValues[type];

      if (value !== undefined) {
        if (typeof value === "string" && stringMap[type]) {
          memo["".concat(type, "Name")] = value;
          memo["_".concat(type)] = stringMap[type][value];
        } else {
          memo["_".concat(type)] = value;
        }
      }

      return memo;
    }, {});
    var formattedDatum = (0, _assign2.default)({}, processedValues, datum);

    if (!(0, _isEmpty2.default)(formattedDatum)) {
      dataArr.push(formattedDatum);
    }

    return dataArr;
  }, []);
  var sortedData = sortData(data, props.sortKey, props.sortOrder);
  var cleanedData = cleanData(sortedData, props);
  return addEventKeys(props, cleanedData);
}
/**
 * Returns generated x and y data based on domain and sample from props
 * @param {Object} props: the props object
 * @returns {Array} an array of data
 */


function generateData(props) {
  var xValues = generateDataArray(props, "x");
  var yValues = generateDataArray(props, "y");
  var values = xValues.map(function (x, i) {
    return {
      x: x,
      y: yValues[i]
    };
  });
  return values;
}
/**
 * Returns an array of categories for a given axis
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @returns {Array} an array of categories
 */


function getCategories(props, axis) {
  return props.categories && !Array.isArray(props.categories) ? props.categories[axis] : props.categories;
}
/**
 * Returns an array of formatted data
 * @param {Object} props: the props object
 * @returns {Array} an array of data
 */


function getData(props) {
  return props.data ? formatData(props.data, props) : formatData(generateData(props), props);
}
/**
 * Returns an array of strings from axis tickValues for a given axis
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @returns {Array} an array of strings
 */


function getStringsFromAxes(props, axis) {
  var tickValues = props.tickValues,
      tickFormat = props.tickFormat;
  var tickValueArray;

  if (!tickValues || !Array.isArray(tickValues) && !tickValues[axis]) {
    tickValueArray = tickFormat && Array.isArray(tickFormat) ? tickFormat : [];
  } else {
    tickValueArray = tickValues[axis] || tickValues;
  }

  return tickValueArray.filter(function (val) {
    return typeof val === "string";
  });
}
/**
 * Returns an array of strings from categories for a given axis
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @returns {Array} an array of strings
 */


function getStringsFromCategories(props, axis) {
  if (!props.categories) {
    return [];
  }

  var categories = getCategories(props, axis);
  var categoryStrings = categories && categories.filter(function (val) {
    return typeof val === "string";
  });
  return categoryStrings ? _collection.default.removeUndefined(categoryStrings) : [];
}
/**
 * Returns an array of strings from data
 * @param {Object} props: the props object
 * @param {String} axis: the current axis
 * @returns {Array} an array of strings
 */


function getStringsFromData(props, axis) {
  var isArrayOrIterable = Array.isArray(props.data) || _immutable.default.isIterable(props.data);

  if (!isArrayOrIterable) {
    return [];
  }

  var key = props[axis] === undefined ? axis : props[axis];

  var accessor = _helpers.default.createAccessor(key); // support immutable data


  var data = props.data.reduce(function (memo, d) {
    memo.push(parseDatum(d));
    return memo;
  }, []);
  var sortedData = sortData(data, props.sortKey, props.sortOrder);
  var dataStrings = sortedData.reduce(function (dataArr, datum) {
    datum = parseDatum(datum);
    dataArr.push(accessor(datum));
    return dataArr;
  }, []).filter(function (datum) {
    return typeof datum === "string";
  }); // return a unique set of strings

  return dataStrings.reduce(function (prev, curr) {
    if (curr !== undefined && curr !== null && prev.indexOf(curr) === -1) {
      prev.push(curr);
    }

    return prev;
  }, []);
}
/**
 * Checks whether a given component can be used to calculate data
 * @param {Component} component: a React component instance
 * @returns {Boolean} Returns true if the given component has a role included in the whitelist
 */


function isDataComponent(component) {
  var getRole = function (child) {
    return child && child.type ? child.type.role : "";
  };

  var role = getRole(component);

  if (role === "portal") {
    var children = _react.default.Children.toArray(component.props.children);

    role = children.length ? getRole(children[0]) : "";
  }

  var whitelist = ["area", "bar", "boxplot", "candlestick", "errorbar", "group", "histogram", "line", "pie", "scatter", "stack", "voronoi"];
  return (0, _includes2.default)(whitelist, role);
}

var _default = {
  createStringMap: createStringMap,
  downsample: downsample,
  formatData: formatData,
  generateData: generateData,
  getCategories: getCategories,
  getData: getData,
  getStringsFromAxes: getStringsFromAxes,
  getStringsFromCategories: getStringsFromCategories,
  getStringsFromData: getStringsFromData,
  isDataComponent: isDataComponent
};
exports.default = _default;