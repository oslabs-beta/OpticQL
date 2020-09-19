"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.computeData = computeData;

function _bluebirdLst() {
  const data = _interopRequireDefault(require("bluebird-lst"));

  _bluebirdLst = function () {
    return data;
  };

  return data;
}

function _crypto() {
  const data = require("crypto");

  _crypto = function () {
    return data;
  };

  return data;
}

var _fs = require("fs");

function _fsExtra() {
  const data = require("fs-extra");

  _fsExtra = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function computeData(resourcesPath, options) {
  // sort to produce constant result
  const names = (await (0, _fsExtra().readdir)(resourcesPath)).filter(it => it.endsWith(".asar")).sort();
  const checksums = await _bluebirdLst().default.map(names, it => hashFile(path.join(resourcesPath, it)));
  const result = {};

  for (let i = 0; i < names.length; i++) {
    result[names[i]] = checksums[i];
  }

  return {
    checksums: result,
    ...options
  };
}

function hashFile(file, algorithm = "sha512", encoding = "base64") {
  return new Promise((resolve, reject) => {
    const hash = (0, _crypto().createHash)(algorithm);
    hash.on("error", reject).setEncoding(encoding);
    (0, _fs.createReadStream)(file).on("error", reject).on("end", () => {
      hash.end();
      resolve(hash.read());
    }).pipe(hash, {
      end: false
    });
  });
} 
// __ts-babel@6.0.4
//# sourceMappingURL=integrity.js.map