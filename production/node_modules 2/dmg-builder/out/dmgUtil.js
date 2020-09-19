"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDmgTemplatePath = getDmgTemplatePath;
exports.getDmgVendorPath = getDmgVendorPath;
exports.attachAndExecute = attachAndExecute;
exports.detach = detach;
exports.computeBackground = computeBackground;
exports.serializeString = serializeString;
Object.defineProperty(exports, "DmgTarget", {
  enumerable: true,
  get: function () {
    return _dmg().DmgTarget;
  }
});

function _builderUtil() {
  const data = require("builder-util");

  _builderUtil = function () {
    return data;
  };

  return data;
}

function _promise() {
  const data = require("builder-util/out/promise");

  _promise = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _dmg() {
  const data = require("./dmg");

  _dmg = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const root = path.join(__dirname, "..");

function getDmgTemplatePath() {
  return path.join(root, "templates");
}

function getDmgVendorPath() {
  return path.join(root, "vendor");
}

async function attachAndExecute(dmgPath, readWrite, task) {
  //noinspection SpellCheckingInspection
  const args = ["attach", "-noverify", "-noautoopen"];

  if (readWrite) {
    args.push("-readwrite");
  }

  args.push(dmgPath);
  const attachResult = await (0, _builderUtil().exec)("hdiutil", args);
  const deviceResult = attachResult == null ? null : /^(\/dev\/\w+)/.exec(attachResult);
  const device = deviceResult == null || deviceResult.length !== 2 ? null : deviceResult[1];

  if (device == null) {
    throw new Error(`Cannot mount: ${attachResult}`);
  }

  return await (0, _promise().executeFinally)(task(), () => detach(device));
}

async function detach(name) {
  try {
    await (0, _builderUtil().exec)("hdiutil", ["detach", "-quiet", name]);
  } catch (e) {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        (0, _builderUtil().exec)("hdiutil", ["detach", "-force", name]).then(resolve).catch(reject);
      }, 1000);
    });
  }
}

async function computeBackground(packager) {
  const resourceList = await packager.resourceList;

  if (resourceList.includes("background.tiff")) {
    return path.join(packager.buildResourcesDir, "background.tiff");
  } else if (resourceList.includes("background.png")) {
    return path.join(packager.buildResourcesDir, "background.png");
  } else {
    return path.join(getDmgTemplatePath(), "background.tiff");
  }
}
/** @internal */


function serializeString(data) {
  return '  $"' + data.match(/.{1,32}/g).map(it => it.match(/.{1,4}/g).join(" ")).join('"\n  $"') + '"';
} 
// __ts-babel@6.0.4
//# sourceMappingURL=dmgUtil.js.map