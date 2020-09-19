"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTemplatePath = getTemplatePath;
exports.getVendorPath = getVendorPath;

var path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const root = path.join(__dirname, "..", "..");

function getTemplatePath(file) {
  return path.join(root, "templates", file);
}

function getVendorPath(file) {
  return file == null ? path.join(root, "vendor") : path.join(root, "vendor", file);
} 
// __ts-babel@6.0.4
//# sourceMappingURL=pathManager.js.map