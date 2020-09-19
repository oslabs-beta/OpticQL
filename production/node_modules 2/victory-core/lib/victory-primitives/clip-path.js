"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClipPath = function (props) {
  return _react.default.createElement("defs", null, _react.default.createElement("clipPath", {
    id: props.clipId
  }, props.children));
};

ClipPath.propTypes = {
  children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.node), _propTypes.default.node]),
  clipId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string])
};
var _default = ClipPath;
exports.default = _default;