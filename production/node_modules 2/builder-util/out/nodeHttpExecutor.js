"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.httpExecutor = exports.NodeHttpExecutor = void 0;

function _builderUtilRuntime() {
  const data = require("builder-util-runtime");

  _builderUtilRuntime = function () {
    return data;
  };

  return data;
}

function _http() {
  const data = require("http");

  _http = function () {
    return data;
  };

  return data;
}

function https() {
  const data = _interopRequireWildcard(require("https"));

  https = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class NodeHttpExecutor extends _builderUtilRuntime().HttpExecutor {
  // noinspection JSMethodCanBeStatic
  // noinspection JSUnusedGlobalSymbols
  createRequest(options, callback) {
    return (options.protocol === "http:" ? _http().request : https().request)(options, callback);
  }

}

exports.NodeHttpExecutor = NodeHttpExecutor;
const httpExecutor = new NodeHttpExecutor(); exports.httpExecutor = httpExecutor;
// __ts-babel@6.0.4
//# sourceMappingURL=nodeHttpExecutor.js.map