"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mapValues4 = _interopRequireDefault(require("lodash/mapValues"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _throttle2 = _interopRequireDefault(require("lodash/throttle"));

var _victoryCore = require("victory-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CursorHelpers = {
  getDimension: function (props) {
    var horizontal = props.horizontal,
        cursorDimension = props.cursorDimension;

    if (!horizontal || !cursorDimension) {
      return cursorDimension;
    }

    return cursorDimension === "x" ? "y" : "x";
  },
  withinBounds: function (point, bounds) {
    var _mapValues2 = (0, _mapValues4.default)(bounds, Number),
        x1 = _mapValues2.x1,
        x2 = _mapValues2.x2,
        y1 = _mapValues2.y1,
        y2 = _mapValues2.y2;

    var _mapValues3 = (0, _mapValues4.default)(point, Number),
        x = _mapValues3.x,
        y = _mapValues3.y;

    return x >= Math.min(x1, x2) && x <= Math.max(x1, x2) && y >= Math.min(y1, y2) && y <= Math.max(y1, y2);
  },
  onMouseMove: function (evt, targetProps) {
    var onCursorChange = targetProps.onCursorChange,
        domain = targetProps.domain;
    var cursorDimension = this.getDimension(targetProps);

    var parentSVG = targetProps.parentSVG || _victoryCore.Selection.getParentSVG(evt);

    var cursorSVGPosition = _victoryCore.Selection.getSVGEventCoordinates(evt, parentSVG);

    var cursorValue = _victoryCore.Selection.getDataCoordinates(targetProps, targetProps.scale, cursorSVGPosition.x, cursorSVGPosition.y);

    var inBounds = this.withinBounds(cursorValue, {
      x1: domain.x[0],
      x2: domain.x[1],
      y1: domain.y[0],
      y2: domain.y[1]
    });

    if (!inBounds) {
      cursorValue = null;
    }

    if ((0, _isFunction2.default)(onCursorChange)) {
      if (inBounds) {
        var value = cursorDimension ? cursorValue[cursorDimension] : cursorValue;
        onCursorChange(value, targetProps);
      } else if (cursorValue !== targetProps.cursorValue) {
        onCursorChange(targetProps.defaultCursorValue || null, targetProps);
      }
    }

    return [{
      target: "parent",
      eventKey: "parent",
      mutation: function () {
        return {
          cursorValue: cursorValue,
          parentSVG: parentSVG
        };
      }
    }];
  },
  onTouchEnd: function (evt, targetProps) {
    var onCursorChange = targetProps.onCursorChange;

    if ((0, _isFunction2.default)(targetProps.onCursorChange)) {
      onCursorChange(null, targetProps);
    }

    return [{
      target: "parent",
      eventKey: "parent",
      mutation: function () {
        return {
          cursorValue: null
        };
      }
    }];
  }
};

var _default = _objectSpread({}, CursorHelpers, {
  onMouseMove: (0, _throttle2.default)(CursorHelpers.onMouseMove.bind(CursorHelpers), 32, // eslint-disable-line no-magic-numbers
  {
    leading: true,
    trailing: false
  }),
  onMouseLeave: CursorHelpers.onMouseMove.bind(CursorHelpers),
  onTouchEnd: CursorHelpers.onTouchEnd.bind(CursorHelpers)
});

exports.default = _default;