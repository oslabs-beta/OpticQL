"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The React context object consumers may use to access the context of the
 * portal.
 */
var PortalContext = _react.default.createContext({});

PortalContext.displayName = "PortalContext";
var _default = PortalContext;
exports.default = _default;