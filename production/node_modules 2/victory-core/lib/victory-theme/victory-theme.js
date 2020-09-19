"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _material = _interopRequireDefault(require("./material"));

var _grayscale = _interopRequireDefault(require("./grayscale"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  material: _material.default,
  grayscale: _grayscale.default
};
exports.default = _default;