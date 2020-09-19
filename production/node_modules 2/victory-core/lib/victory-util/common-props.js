"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = _interopRequireDefault(require("./prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dataProps = {
  categories: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.string), _propTypes.default.shape({
    x: _propTypes.default.arrayOf(_propTypes.default.string),
    y: _propTypes.default.arrayOf(_propTypes.default.string)
  })]),
  data: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.object]),
  dataComponent: _propTypes.default.element,
  labelComponent: _propTypes.default.element,
  labels: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.array]),
  samples: _propTypes2.default.nonNegative,
  sortKey: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes2.default.allOfType([_propTypes2.default.integer, _propTypes2.default.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
  sortOrder: _propTypes.default.oneOf(["ascending", "descending"]),
  style: _propTypes.default.shape({
    parent: _propTypes.default.object,
    data: _propTypes.default.object,
    labels: _propTypes.default.object
  }),
  x: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes2.default.allOfType([_propTypes2.default.integer, _propTypes2.default.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
  y: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes2.default.allOfType([_propTypes2.default.integer, _propTypes2.default.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)]),
  y0: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes2.default.allOfType([_propTypes2.default.integer, _propTypes2.default.nonNegative]), _propTypes.default.string, _propTypes.default.arrayOf(_propTypes.default.string)])
};
var baseProps = {
  animate: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.object]),
  containerComponent: _propTypes.default.element,
  domain: _propTypes.default.oneOfType([_propTypes2.default.domain, _propTypes.default.shape({
    x: _propTypes2.default.domain,
    y: _propTypes2.default.domain
  })]),
  maxDomain: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.instanceOf(Date), _propTypes.default.shape({
    x: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.instanceOf(Date)]),
    y: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.instanceOf(Date)])
  })]),
  minDomain: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.instanceOf(Date), _propTypes.default.shape({
    x: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.instanceOf(Date)]),
    y: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.instanceOf(Date)])
  })]),
  domainPadding: _propTypes.default.oneOfType([_propTypes.default.shape({
    x: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.arrayOf(_propTypes.default.number)]),
    y: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.arrayOf(_propTypes.default.number)])
  }), _propTypes.default.number, _propTypes.default.arrayOf(_propTypes.default.number)]),
  eventKey: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes2.default.allOfType([_propTypes2.default.integer, _propTypes2.default.nonNegative]), _propTypes.default.string]),
  events: _propTypes.default.arrayOf(_propTypes.default.shape({
    target: _propTypes.default.oneOf(["data", "labels", "parent"]),
    eventKey: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes2.default.allOfType([_propTypes2.default.integer, _propTypes2.default.nonNegative]), _propTypes.default.string]),
    eventHandlers: _propTypes.default.object
  })),
  externalEventMutations: _propTypes.default.arrayOf(_propTypes.default.shape({
    callback: _propTypes.default.function,
    childName: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]),
    eventKey: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes2.default.allOfType([_propTypes2.default.integer, _propTypes2.default.nonNegative]), _propTypes.default.string]),
    mutation: _propTypes.default.function,
    target: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array])
  })),
  groupComponent: _propTypes.default.element,
  height: _propTypes2.default.nonNegative,
  name: _propTypes.default.string,
  origin: _propTypes.default.shape({
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),
  padding: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.shape({
    top: _propTypes.default.number,
    bottom: _propTypes.default.number,
    left: _propTypes.default.number,
    right: _propTypes.default.number
  })]),
  polar: _propTypes.default.bool,
  range: _propTypes.default.oneOfType([_propTypes2.default.domain, _propTypes.default.shape({
    x: _propTypes2.default.domain,
    y: _propTypes2.default.domain
  })]),
  scale: _propTypes.default.oneOfType([_propTypes2.default.scale, _propTypes.default.shape({
    x: _propTypes2.default.scale,
    y: _propTypes2.default.scale
  })]),
  sharedEvents: _propTypes.default.shape({
    events: _propTypes.default.array,
    getEventState: _propTypes.default.func
  }),
  singleQuadrantDomainPadding: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.shape({
    x: _propTypes.default.oneOfType([_propTypes.default.bool]),
    y: _propTypes.default.oneOfType([_propTypes.default.bool])
  })]),
  standalone: _propTypes.default.bool,
  theme: _propTypes.default.object,
  width: _propTypes2.default.nonNegative
};
var primitiveProps = {
  active: _propTypes.default.bool,
  className: _propTypes.default.string,
  clipPath: _propTypes.default.string,
  data: _propTypes.default.oneOfType([_propTypes.default.array, _propTypes.default.object]),
  desc: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]),
  events: _propTypes.default.object,
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string, _propTypes.default.func]),
  index: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]),
  origin: _propTypes.default.shape({
    x: _propTypes.default.number,
    y: _propTypes.default.number
  }),
  polar: _propTypes.default.bool,
  role: _propTypes.default.string,
  scale: _propTypes.default.oneOfType([_propTypes2.default.scale, _propTypes.default.shape({
    x: _propTypes2.default.scale,
    y: _propTypes2.default.scale
  })]),
  shapeRendering: _propTypes.default.string,
  style: _propTypes.default.object,
  tabIndex: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.func]),
  transform: _propTypes.default.string
};
var _default = {
  baseProps: baseProps,
  dataProps: dataProps,
  primitiveProps: primitiveProps
};
exports.default = _default;