"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UninstallerReader = exports.CopyElevateHelper = exports.AppPackageHelper = exports.NSIS_PATH = exports.nsisTemplatesDir = void 0;

function _bluebirdLst() {
  const data = _interopRequireDefault(require("bluebird-lst"));

  _bluebirdLst = function () {
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

function _binDownload() {
  const data = require("../../binDownload");

  _binDownload = function () {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("builder-util/out/fs");

  _fs = function () {
    return data;
  };

  return data;
}

function _fsExtra() {
  const data = require("fs-extra");

  _fsExtra = function () {
    return data;
  };

  return data;
}

var path = _interopRequireWildcard(require("path"));

function _pathManager() {
  const data = require("../../util/pathManager");

  _pathManager = function () {
    return data;
  };

  return data;
}

var _fs2 = _interopRequireDefault(require("fs"));

function _zlib() {
  const data = _interopRequireDefault(require("zlib"));

  _zlib = function () {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nsisTemplatesDir = (0, _pathManager().getTemplatePath)("nsis");
exports.nsisTemplatesDir = nsisTemplatesDir;

const NSIS_PATH = () => {
  const custom = process.env.ELECTRON_BUILDER_NSIS_DIR;

  if (custom != null && custom.length > 0) {
    return Promise.resolve(custom.trim());
  } // noinspection SpellCheckingInspection


  return (0, _binDownload().getBinFromUrl)("nsis", "3.0.4.1", "VKMiizYdmNdJOWpRGz4trl4lD++BvYP2irAXpMilheUP0pc93iKlWAoP843Vlraj8YG19CVn0j+dCo/hURz9+Q==");
};

exports.NSIS_PATH = NSIS_PATH;

class AppPackageHelper {
  constructor(elevateHelper) {
    this.elevateHelper = elevateHelper;
    this.archToFileInfo = new Map();
    this.infoToIsDelete = new Map();
    /** @private */

    this.refCount = 0;
  }

  async packArch(arch, target) {
    let infoPromise = this.archToFileInfo.get(arch);

    if (infoPromise == null) {
      const appOutDir = target.archs.get(arch);
      infoPromise = this.elevateHelper.copy(appOutDir, target).then(() => target.buildAppPackage(appOutDir, arch));
      this.archToFileInfo.set(arch, infoPromise);
    }

    const info = await infoPromise;

    if (target.isWebInstaller) {
      this.infoToIsDelete.set(info, false);
    } else if (!this.infoToIsDelete.has(info)) {
      this.infoToIsDelete.set(info, true);
    }

    return info;
  }

  async finishBuild() {
    if (--this.refCount > 0) {
      return;
    }

    const filesToDelete = [];

    for (const [info, isDelete] of this.infoToIsDelete.entries()) {
      if (isDelete) {
        filesToDelete.push(info.path);
      }
    }

    await _bluebirdLst().default.map(filesToDelete, it => (0, _fsExtra().unlink)(it));
  }

}

exports.AppPackageHelper = AppPackageHelper;

class CopyElevateHelper {
  constructor() {
    this.copied = new Map();
  }

  copy(appOutDir, target) {
    if (!target.packager.info.framework.isCopyElevateHelper) {
      return Promise.resolve();
    }

    let isPackElevateHelper = target.options.packElevateHelper;

    if (isPackElevateHelper === false && target.options.perMachine === true) {
      isPackElevateHelper = true;

      _builderUtil().log.warn("`packElevateHelper = false` is ignored, because `perMachine` is set to `true`");
    }

    if (isPackElevateHelper === false) {
      return Promise.resolve();
    }

    let promise = this.copied.get(appOutDir);

    if (promise != null) {
      return promise;
    }

    promise = NSIS_PATH().then(it => {
      const outFile = path.join(appOutDir, "resources", "elevate.exe");
      const promise = (0, _fs().copyFile)(path.join(it, "elevate.exe"), outFile, false);

      if (target.packager.platformSpecificBuildOptions.signAndEditExecutable !== false) {
        return promise.then(() => target.packager.sign(outFile));
      }

      return promise;
    });
    this.copied.set(appOutDir, promise);
    return promise;
  }

}

exports.CopyElevateHelper = CopyElevateHelper;

class BinaryReader {
  constructor(buffer) {
    this._buffer = buffer;
    this._position = 0;
  }

  get length() {
    return this._buffer.length;
  }

  get position() {
    return this._position;
  }

  match(signature) {
    if (signature.every((v, i) => this._buffer[this._position + i] === v)) {
      this._position += signature.length;
      return true;
    }

    return false;
  }

  skip(offset) {
    this._position += offset;
  }

  bytes(size) {
    const value = this._buffer.subarray(this._position, this._position + size);

    this._position += size;
    return value;
  }

  uint16() {
    const value = this._buffer[this._position] | this._buffer[this._position + 1] << 8;
    this._position += 2;
    return value;
  }

  uint32() {
    return this.uint16() | this.uint16() << 16;
  }

  string(length) {
    let value = "";

    for (let i = 0; i < length; i++) {
      const c = this._buffer[this._position + i];

      if (c === 0x00) {
        break;
      }

      value += String.fromCharCode(c);
    }

    this._position += length;
    return value;
  }

}

class UninstallerReader {
  // noinspection SpellCheckingInspection
  static exec(installerPath, uninstallerPath) {
    const buffer = _fs2.default.readFileSync(installerPath);

    const reader = new BinaryReader(buffer); // IMAGE_DOS_HEADER

    if (!reader.match([0x4D, 0x5A])) {
      throw new Error("Invalid 'MZ' signature.");
    }

    reader.skip(58); // e_lfanew

    reader.skip(reader.uint32() - reader.position); // IMAGE_FILE_HEADER

    if (!reader.match([0x50, 0x45, 0x00, 0x00])) {
      throw new Error("Invalid 'PE' signature.");
    }

    reader.skip(2);
    const numberOfSections = reader.uint16();
    reader.skip(12);
    const sizeOfOptionalHeader = reader.uint16();
    reader.skip(2);
    reader.skip(sizeOfOptionalHeader); // IMAGE_SECTION_HEADER

    let nsisOffset = 0;

    for (let i = 0; i < numberOfSections; i++) {
      const name = reader.string(8);
      reader.skip(8);
      const rawSize = reader.uint32();
      const rawPointer = reader.uint32();
      reader.skip(16);

      switch (name) {
        case ".text":
        case ".rdata":
        case ".data":
        case ".rsrc":
          {
            nsisOffset = Math.max(rawPointer + rawSize, nsisOffset);
            break;
          }

        default:
          {
            if (rawPointer !== 0 && rawSize !== 0) {
              throw new Error("Unsupported section '" + name + "'.");
            }

            break;
          }
      }
    }

    const executable = buffer.subarray(0, nsisOffset);
    const nsisSize = buffer.length - nsisOffset;
    const nsisReader = new BinaryReader(buffer.subarray(nsisOffset, nsisOffset + nsisSize));
    const nsisSignature = [0xEF, 0xBE, 0xAD, 0xDE, 0x4E, 0x75, 0x6C, 0x6C, 0x73, 0x6F, 0x66, 0x74, 0x49, 0x6E, 0x73, 0x74];
    nsisReader.uint32(); // ?

    if (!nsisReader.match(nsisSignature)) {
      throw new Error("Invalid signature.");
    }

    nsisReader.uint32(); // ?

    if (nsisSize !== nsisReader.uint32()) {
      throw new Error("Size mismatch.");
    }

    let innerBuffer = null;

    while (true) {
      let size = nsisReader.uint32();
      const compressed = (size & 0x80000000) !== 0;
      size = size & 0x7FFFFFFF;

      if (size === 0 || nsisReader.position + size > nsisReader.length || nsisReader.position >= nsisReader.length) {
        break;
      }

      let buffer = nsisReader.bytes(size);

      if (compressed) {
        buffer = _zlib().default.inflateRawSync(buffer);
      }

      const innerReader = new BinaryReader(buffer);
      innerReader.uint32(); // ?

      if (innerReader.match(nsisSignature)) {
        if (innerBuffer) {
          throw new Error("Multiple inner blocks.");
        }

        innerBuffer = buffer;
      }
    }

    if (!innerBuffer) {
      throw new Error("Inner block not found.");
    }

    _fs2.default.writeFileSync(uninstallerPath, executable);

    _fs2.default.appendFileSync(uninstallerPath, innerBuffer);
  }

} exports.UninstallerReader = UninstallerReader;
// __ts-babel@6.0.4
//# sourceMappingURL=nsisUtil.js.map