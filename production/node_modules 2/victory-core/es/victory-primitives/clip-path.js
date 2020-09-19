import React from "react";
import PropTypes from "prop-types";

var ClipPath = function (props) {
  return React.createElement("defs", null, React.createElement("clipPath", {
    id: props.clipId
  }, props.children));
};

ClipPath.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  clipId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};
export default ClipPath;