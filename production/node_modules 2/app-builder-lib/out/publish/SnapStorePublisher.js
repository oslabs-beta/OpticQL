"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SnapStorePublisher = void 0;

function _electronPublish() {
  const data = require("electron-publish");

  _electronPublish = function () {
    return data;
  };

  return data;
}

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class SnapStorePublisher extends _electronPublish().Publisher {
  constructor(context, options) {
    super(context);
    this.options = options;
    this.providerName = "snapStore";
  }

  upload(task) {
    this.createProgressBar(path.basename(task.file), -1);
    const args = ["publish-snap", "-f", task.file];
    let channels = this.options.channels;

    if (channels == null) {
      channels = ["edge"];
    } else {
      if (typeof channels === "string") {
        channels = channels.split(",");
      }
    }

    for (const channel of channels) {
      args.push("-c", channel);
    }

    return (0, _builderUtil().executeAppBuilder)(args);
  }

  toString() {
    return "Snap Store";
  }

} exports.SnapStorePublisher = SnapStorePublisher;
// __ts-babel@6.0.4
//# sourceMappingURL=SnapStorePublisher.js.map