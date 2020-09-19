import _isRegExp from "lodash/isRegExp";
import _find from "lodash/find";
import _isFunction from "lodash/isFunction";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import Log from "./log";
import PropTypes from "prop-types";
/**
 * Return a new validator based on `validator` but with the option to chain
 * `isRequired` onto the validation. This is nearly identical to how React
 * does it internally, but they don't expose their helper for us to use.
 * @param {Function} validator Validation function.
 * @returns {Function} Validator with `isRequired` option.
 */

var makeChainable = function (validator) {
  /* eslint-disable max-params */
  var _chainable = function (isRequired, props, propName, componentName) {
    var value = props[propName];

    if (value === undefined || value === null) {
      if (isRequired) {
        return new Error("Required `".concat(propName, "` was not specified in `").concat(componentName, "`."));
      }

      return null;
    }

    for (var _len = arguments.length, rest = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
      rest[_key - 4] = arguments[_key];
    }

    return validator.apply(void 0, [props, propName, componentName].concat(rest));
  };

  var chainable = _chainable.bind(null, false);

  chainable.isRequired = _chainable.bind(null, true);
  return chainable;
};

var nullConstructor = function () {
  return null;
};

var undefinedConstructor = function () {
  return undefined;
};
/**
 * Get the constructor of `value`. If `value` is null or undefined, return the
 * special singletons `nullConstructor` or `undefinedConstructor`, respectively.
 * @param {*} value Instance to return the constructor of.
 * @returns {Function} Constructor of `value`.
 */


var getConstructor = function (value) {
  if (value === undefined) {
    return undefinedConstructor;
  } else if (value === null) {
    return nullConstructor;
  } else {
    return value.constructor;
  }
};
/**
 * Get the name of the constructor used to create `value`, using
 * `Object.protoype.toString`. If the value is null or undefined, return
 * "null" or "undefined", respectively.
 * @param {*} value Instance to return the constructor name of.
 * @returns {String} Name of the constructor.
 */


var getConstructorName = function (value) {
  if (value === undefined) {
    return "undefined";
  } else if (value === null) {
    return "null";
  }

  return Object.prototype.toString.call(value).slice(8, -1); // eslint-disable-line no-magic-numbers
};

export default {
  /**
   * Return a new validator based on `propType` but which logs a `console.error`
   * with `explanation` if used.
   * @param {Function} propType The old, deprecated propType.
   * @param {String} explanation The message to provide the user of the deprecated propType.
   * @returns {Function} Validator which logs usage of this propType
   */
  deprecated: function (propType, explanation) {
    return function (props, propName, componentName) {
      var value = props[propName];

      if (value !== null && value !== undefined) {
        Log.warn("\"".concat(propName, "\" property of \"").concat(componentName, "\" has been deprecated ").concat(explanation));
      }

      return PropTypes.checkPropTypes(_defineProperty({}, propName, propType), props, propName, componentName);
    };
  },

  /**
   * Return a new validator which returns true
   * if and only if all validators passed as arguments return true.
   * Like React.propTypes.oneOfType, except "all" instead of "any"
   * @param {Array} validators Validation functions.
   * @returns {Function} Combined validator function
   */
  allOfType: function (validators) {
    return makeChainable(function (props, propName, componentName) {
      for (var _len2 = arguments.length, rest = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        rest[_key2 - 3] = arguments[_key2];
      }

      return validators.reduce(function (result, validator) {
        return result || validator.apply(void 0, [props, propName, componentName].concat(rest));
      }, undefined);
    });
  },

  /**
   * Check that the value is a non-negative number.
   */
  nonNegative: makeChainable(function (props, propName, componentName) {
    var value = props[propName];

    if (typeof value !== "number" || value < 0) {
      return new Error("`".concat(propName, "` in `").concat(componentName, "` must be a non-negative number."));
    }

    return undefined;
  }),

  /**
   * Check that the value is an integer.
   */
  integer: makeChainable(function (props, propName, componentName) {
    var value = props[propName];

    if (typeof value !== "number" || value % 1 !== 0) {
      return new Error("`".concat(propName, "` in `").concat(componentName, "` must be an integer."));
    }

    return undefined;
  }),

  /**
   * Check that the value is greater than zero.
   */
  greaterThanZero: makeChainable(function (props, propName, componentName) {
    var value = props[propName];

    if (typeof value !== "number" || value <= 0) {
      return new Error("`".concat(propName, "` in `").concat(componentName, "` must be a number greater than zero."));
    }

    return undefined;
  }),

  /**
   * Check that the value is an Array of two unique values.
   */
  domain: makeChainable(function (props, propName, componentName) {
    var value = props[propName];

    if (!Array.isArray(value) || value.length !== 2 || value[1] === value[0]) {
      return new Error("`".concat(propName, "` in `").concat(componentName, "` must be an array of two unique numeric values."));
    }

    return undefined;
  }),

  /**
   * Check that the value looks like a d3 `scale` function.
   */
  scale: makeChainable(function (props, propName, componentName) {
    var supportedScaleStrings = ["linear", "time", "log", "sqrt"];

    var validScale = function (scl) {
      if (_isFunction(scl)) {
        return _isFunction(scl.copy) && _isFunction(scl.domain) && _isFunction(scl.range);
      } else if (typeof scl === "string") {
        return supportedScaleStrings.indexOf(scl) !== -1;
      }

      return false;
    };

    var value = props[propName];

    if (!validScale(value)) {
      return new Error("`".concat(propName, "` in `").concat(componentName, "` must be a d3 scale."));
    }

    return undefined;
  }),

  /**
   * Check that an array contains items of the same type.
   */
  homogeneousArray: makeChainable(function (props, propName, componentName) {
    var values = props[propName];

    if (!Array.isArray(values)) {
      return new Error("`".concat(propName, "` in `").concat(componentName, "` must be an array."));
    }

    if (values.length < 2) {
      return undefined;
    }

    var comparisonConstructor = getConstructor(values[0]);

    var typeMismatchedValue = _find(values, function (value) {
      return comparisonConstructor !== getConstructor(value);
    });

    if (typeMismatchedValue) {
      var constructorName = getConstructorName(values[0]);
      var otherConstructorName = getConstructorName(typeMismatchedValue);
      return new Error("Expected `".concat(propName, "` in `").concat(componentName, "` to be a ") + "homogeneous array, but found types `".concat(constructorName, "` and ") + "`".concat(otherConstructorName, "`."));
    }

    return undefined;
  }),

  /**
   * Check that array prop length matches props.data.length
   */
  matchDataLength: makeChainable(function (props, propName) {
    if (props[propName] && Array.isArray(props[propName]) && props[propName].length !== props.data.length) {
      return new Error("Length of data and ".concat(propName, " arrays must match."));
    }

    return undefined;
  }),

  /**
   * Check that the value is a regular expression
   */
  regExp: makeChainable(function (props, propName, componentName) {
    if (props[propName] && !_isRegExp(props[propName])) {
      return new Error("`".concat(propName, "` in `").concat(componentName, "` must be a regular expression."));
    }

    return undefined;
  })
};