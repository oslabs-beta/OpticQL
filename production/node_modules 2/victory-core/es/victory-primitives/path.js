function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

import React from "react";

var Path = function (props) {
  // eslint-disable-next-line react/prop-types
  var desc = props.desc,
      rest = _objectWithoutProperties(props, ["desc"]);

  return desc ? React.createElement("path", rest, React.createElement("desc", null, desc)) : React.createElement("path", rest);
};

export default Path;