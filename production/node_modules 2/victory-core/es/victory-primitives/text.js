function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import React from "react";
import PropTypes from "prop-types";

var Text = function (props) {
  var children = props.children,
      title = props.title,
      desc = props.desc,
      rest = _objectWithoutProperties(props, ["children", "title", "desc"]);

  return React.createElement("text", rest, title && React.createElement("title", null, title), desc && React.createElement("desc", null, desc), children);
};

Text.propTypes = {
  children: PropTypes.node,
  desc: PropTypes.string,
  title: PropTypes.string
};
export default Text;