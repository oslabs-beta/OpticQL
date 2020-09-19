"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isPlainObject2 = _interopRequireDefault(require("lodash/isPlainObject"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _helpers = _interopRequireDefault(require("./helpers"));

var _collection = _interopRequireDefault(require("./collection"));

var d3Scale = _interopRequireWildcard(require("d3-scale"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var supportedScaleStrings = ["linear", "time", "log", "sqrt"]; // Private Functions

function toNewName(scale) {
  // d3 scale changed the naming scheme for scale from "linear" -> "scaleLinear" etc.
  var capitalize = function (s) {
    return s && s[0].toUpperCase() + s.slice(1);
  };

  return "scale".concat(capitalize(scale));
}

function validScale(scale) {
  if (typeof scale === "function") {
    return (0, _isFunction2.default)(scale.copy) && (0, _isFunction2.default)(scale.domain) && (0, _isFunction2.default)(scale.range);
  } else if (typeof scale === "string") {
    return (0, _includes2.default)(supportedScaleStrings, scale);
  }

  return false;
}

function isScaleDefined(props, axis) {
  if (!props.scale) {
    return false;
  } else if (props.scale.x || props.scale.y) {
    return props.scale[axis] ? true : false;
  }

  return true;
}

function getScaleTypeFromProps(props, axis) {
  if (!isScaleDefined(props, axis)) {
    return undefined;
  }

  var scale = props.scale[axis] || props.scale;
  return typeof scale === "string" ? scale : getType(scale);
}

function getScaleFromDomain(props, axis) {
  var domain;

  if (props.domain && props.domain[axis]) {
    domain = props.domain[axis];
  } else if (props.domain && Array.isArray(props.domain)) {
    domain = props.domain;
  }

  if (!domain) {
    return undefined;
  }

  return _collection.default.containsDates(domain) ? "time" : "linear";
}

function getScaleTypeFromData(props, axis) {
  if (!props.data) {
    return "linear";
  }

  var accessor = _helpers.default.createAccessor(props[axis]);

  var axisData = props.data.map(function (datum) {
    var processedData = (0, _isPlainObject2.default)(accessor(datum)) ? accessor(datum)[axis] : accessor(datum);
    return processedData !== undefined ? processedData : datum[axis];
  });
  return _collection.default.containsDates(axisData) ? "time" : "linear";
} // Exported Functions


function getScaleFromName(name) {
  return validScale(name) ? d3Scale[toNewName(name)]() : d3Scale.scaleLinear();
}

function getBaseScale(props, axis) {
  var scale = getScaleFromProps(props, axis);

  if (scale) {
    return typeof scale === "string" ? getScaleFromName(scale) : scale;
  }

  var defaultScale = getScaleFromDomain(props, axis) || getScaleTypeFromData(props, axis);
  return d3Scale[toNewName(defaultScale)]();
}

function getDefaultScale() {
  return d3Scale.scaleLinear();
}

function getScaleFromProps(props, axis) {
  if (!isScaleDefined(props, axis)) {
    return undefined;
  }

  var scale = props.scale[axis] || props.scale;

  if (validScale(scale)) {
    return (0, _isFunction2.default)(scale) ? scale : d3Scale[toNewName(scale)]();
  }

  return undefined;
}

function getScaleType(props, axis) {
  // if the scale was not given in props, it will be set to linear or time depending on data
  return getScaleTypeFromProps(props, axis) || getScaleTypeFromData(props, axis);
}

function getType(scale) {
  if (typeof scale === "string") {
    return scale;
  }

  var duckTypes = [{
    name: "log",
    method: "base"
  }, {
    name: "ordinal",
    method: "unknown"
  }, {
    name: "pow-sqrt",
    method: "exponent"
  }, {
    name: "quantile",
    method: "quantiles"
  }, {
    name: "quantize-threshold",
    method: "invertExtent"
  }];
  var scaleType = duckTypes.filter(function (type) {
    return scale[type.method] !== undefined;
  })[0];
  return scaleType ? scaleType.name : undefined;
}

var _default = {
  getBaseScale: getBaseScale,
  getDefaultScale: getDefaultScale,
  getScaleFromProps: getScaleFromProps,
  getScaleType: getScaleType,
  getType: getType,
  getScaleFromName: getScaleFromName
};
exports.default = _default;