"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WineVmManager = void 0;

function _wine() {
  const data = require("../wine");

  _wine = function () {
    return data;
  };

  return data;
}

function _vm() {
  const data = require("./vm");

  _vm = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class WineVmManager extends _vm().VmManager {
  constructor() {
    super();
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  exec(file, args, options, isLogOutIfDebug = true) {
    return (0, _wine().execWine)(file, null, args, options);
  } // eslint-disable-next-line @typescript-eslint/no-unused-vars


  spawn(file, args, options, extraOptions) {
    throw new Error("Unsupported");
  }

  toVmFile(file) {
    return path.win32.join("Z:", file);
  }

} exports.WineVmManager = WineVmManager;
// __ts-babel@6.0.4
//# sourceMappingURL=WineVm.js.map