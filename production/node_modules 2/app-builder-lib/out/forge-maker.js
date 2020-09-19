"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildForge = buildForge;

var path = _interopRequireWildcard(require("path"));

function _index() {
  const data = require("./index");

  _index = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function buildForge(forgeOptions, options) {
  const appDir = forgeOptions.dir;
  return (0, _index().build)({
    prepackaged: appDir,
    config: {
      directories: {
        // https://github.com/electron-userland/electron-forge/blob/master/src/makers/generic/zip.js
        output: path.resolve(appDir, "..", "make")
      }
    },
    ...options
  });
} 
// __ts-babel@6.0.4
//# sourceMappingURL=forge-maker.js.map