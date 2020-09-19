"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

var Text = function (props) {
  var children = props.children,
      title = props.title,
      desc = props.desc,
      rest = _objectWithoutProperties(props, ["children", "title", "desc"]);

  return _react.default.createElement("text", rest, title && _react.default.createElement("title", null, title), desc && _react.default.createElement("desc", null, desc), children);
};

Text.propTypes = {
  children: _propTypes.default.node,
  desc: _propTypes.default.string,
  title: _propTypes.default.string
};
var _default = Text;
exports.default = _default;