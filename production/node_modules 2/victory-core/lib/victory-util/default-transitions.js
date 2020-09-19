"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable func-style */
var _default = {
  continuousTransitions: function () {
    return {
      onLoad: {
        duration: 2000
      },
      onExit: {
        duration: 500
      },
      onEnter: {
        duration: 500
      }
    };
  },
  continuousPolarTransitions: function () {
    return {
      onLoad: {
        duration: 2000,
        before: function () {
          return {
            _y: 0,
            _y1: 0,
            _y0: 0
          };
        },
        after: function (datum) {
          return {
            _y: datum._y,
            _y1: datum._y1,
            _y0: datum._y0
          };
        }
      },
      onExit: {
        duration: 500,
        before: function (datum, index, data) {
          var adjacent = function (attr) {
            var adj = index === 0 ? data[index + 1] : data[index - 1];
            return adj[attr];
          };

          return {
            _x: adjacent("_x"),
            _y: adjacent("_y"),
            _y0: adjacent("_y0")
          };
        }
      },
      onEnter: {
        duration: 500,
        before: function (datum, index, data) {
          var adjacent = function (attr) {
            var adj = index === 0 ? data[index + 1] : data[index - 1];
            return adj[attr];
          };

          return {
            _x: adjacent("_x"),
            _y: adjacent("_y"),
            _y0: adjacent("_y0")
          };
        },
        after: function (datum) {
          return {
            _x: datum._x,
            _y: datum._y,
            _y1: datum._y1,
            _y0: datum._y0
          };
        }
      }
    };
  },
  discreteTransitions: function () {
    return {
      onLoad: {
        duration: 2000,
        before: function () {
          return {
            opacity: 0
          };
        },
        after: function (datum) {
          return datum;
        }
      },
      onExit: {
        duration: 600,
        before: function () {
          return {
            opacity: 0
          };
        }
      },
      onEnter: {
        duration: 600,
        before: function () {
          return {
            opacity: 0
          };
        },
        after: function (datum) {
          return datum;
        }
      }
    };
  }
};
exports.default = _default;