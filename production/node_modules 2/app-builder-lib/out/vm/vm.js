"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getWindowsVm = getWindowsVm;
exports.VmManager = void 0;

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _ParallelsVm() {
  const data = require("./ParallelsVm");

  _ParallelsVm = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class VmManager {
  get pathSep() {
    return path.sep;
  }

  exec(file, args, options, isLogOutIfDebug = true) {
    return (0, _builderUtil().exec)(file, args, options, isLogOutIfDebug);
  }

  spawn(file, args, options, extraOptions) {
    return (0, _builderUtil().spawn)(file, args, options, extraOptions);
  }

  toVmFile(file) {
    return file;
  }

}

exports.VmManager = VmManager;

async function getWindowsVm(debugLogger) {
  const vmList = (await (0, _ParallelsVm().parseVmList)(debugLogger)).filter(it => it.os === "win-10");

  if (vmList.length === 0) {
    throw new (_builderUtil().InvalidConfigurationError)("Cannot find suitable Parallels Desktop virtual machine (Windows 10 is required)");
  } // prefer running or suspended vm


  return new (_ParallelsVm().ParallelsVmManager)(vmList.find(it => it.state === "running") || vmList.find(it => it.state === "suspended") || vmList[0]);
} 
// __ts-babel@6.0.4
//# sourceMappingURL=vm.js.map