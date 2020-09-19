"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* global console */

/* eslint-disable no-console */
// TODO: Use "warning" npm module like React is switching to.
var _default = {
  warn: function (message) {
    if (process.env.NODE_ENV !== "production") {
      if (console && console.warn) {
        console.warn(message);
      }
    }
  }
};
exports.default = _default;