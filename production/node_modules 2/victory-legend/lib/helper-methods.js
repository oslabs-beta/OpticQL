"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDimensions = exports.getBaseProps = void 0;

var _isNil2 = _interopRequireDefault(require("lodash/isNil"));

var _range2 = _interopRequireDefault(require("lodash/range"));

var _sum2 = _interopRequireDefault(require("lodash/sum"));

var _keys2 = _interopRequireDefault(require("lodash/keys"));

var _groupBy2 = _interopRequireDefault(require("lodash/groupBy"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _victoryCore = require("victory-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getColorScale = function (props) {
  var colorScale = props.colorScale;
  return typeof colorScale === "string" ? _victoryCore.Style.getColorScale(colorScale) : colorScale || [];
};

var getLabelStyles = function (props) {
  var data = props.data,
      style = props.style;
  return data.map(function (datum, index) {
    var baseLabelStyles = (0, _defaults2.default)({}, datum.labels, style.labels);
    return _victoryCore.Helpers.evaluateStyle(baseLabelStyles, {
      datum: datum,
      index: index,
      data: data
    });
  });
};

var getStyles = function (props, styleObject) {
  var style = props.style || {};
  styleObject = styleObject || {};
  var parentStyleProps = {
    height: "100%",
    width: "100%"
  };
  return {
    parent: (0, _defaults2.default)(style.parent, styleObject.parent, parentStyleProps),
    data: (0, _defaults2.default)({}, style.data, styleObject.data),
    labels: (0, _defaults2.default)({}, style.labels, styleObject.labels),
    border: (0, _defaults2.default)({}, style.border, styleObject.border),
    title: (0, _defaults2.default)({}, style.title, styleObject.title)
  };
};

var getCalculatedValues = function (props) {
  var orientation = props.orientation,
      theme = props.theme;
  var defaultStyles = theme && theme.legend && theme.legend.style ? theme.legend.style : {};
  var style = getStyles(props, defaultStyles);
  var colorScale = getColorScale(props);
  var isHorizontal = orientation === "horizontal";

  var borderPadding = _victoryCore.Helpers.getPadding({
    padding: props.borderPadding
  });

  return (0, _assign2.default)({}, props, {
    style: style,
    isHorizontal: isHorizontal,
    colorScale: colorScale,
    borderPadding: borderPadding
  });
};

var getColumn = function (props, index) {
  var itemsPerRow = props.itemsPerRow,
      isHorizontal = props.isHorizontal;

  if (!itemsPerRow) {
    return isHorizontal ? index : 0;
  }

  return isHorizontal ? index % itemsPerRow : Math.floor(index / itemsPerRow);
};

var getRow = function (props, index) {
  var itemsPerRow = props.itemsPerRow,
      isHorizontal = props.isHorizontal;

  if (!itemsPerRow) {
    return isHorizontal ? 0 : index;
  }

  return isHorizontal ? Math.floor(index / itemsPerRow) : index % itemsPerRow;
};

var groupData = function (props) {
  var data = props.data;
  var style = props.style && props.style.data || {};
  var labelStyles = getLabelStyles(props);
  return data.map(function (datum, index) {
    var symbol = datum.symbol || {};
    var fontSize = labelStyles[index].fontSize; // eslint-disable-next-line no-magic-numbers

    var size = symbol.size || style.size || fontSize / 2.5;
    var symbolSpacer = props.symbolSpacer || Math.max(size, fontSize);
    return _objectSpread({}, datum, {
      size: size,
      symbolSpacer: symbolSpacer,
      fontSize: fontSize,
      textSize: _victoryCore.TextSize.approximateTextSize(datum.name, labelStyles[index]),
      column: getColumn(props, index),
      row: getRow(props, index)
    });
  });
};

var getColumnWidths = function (props, data) {
  var gutter = props.gutter || {};
  var gutterWidth = typeof gutter === "object" ? (gutter.left || 0) + (gutter.right || 0) : gutter || 0;
  var dataByColumn = (0, _groupBy2.default)(data, "column");
  var columns = (0, _keys2.default)(dataByColumn);
  return columns.reduce(function (memo, curr, index) {
    var lengths = dataByColumn[curr].map(function (d) {
      return d.textSize.width + d.size + d.symbolSpacer + gutterWidth;
    });
    memo[index] = Math.max.apply(Math, _toConsumableArray(lengths));
    return memo;
  }, []);
};

var getRowHeights = function (props, data) {
  var gutter = props.rowGutter || {};
  var gutterHeight = typeof gutter === "object" ? (gutter.top || 0) + (gutter.bottom || 0) : gutter || 0;
  var dataByRow = (0, _groupBy2.default)(data, "row");
  return (0, _keys2.default)(dataByRow).reduce(function (memo, curr, index) {
    var rows = dataByRow[curr];
    var lengths = rows.map(function (d) {
      return d.textSize.height + d.symbolSpacer + gutterHeight;
    });
    memo[index] = Math.max.apply(Math, _toConsumableArray(lengths));
    return memo;
  }, []);
};

var getTitleDimensions = function (props) {
  var style = props.style && props.style.title || {};

  var textSize = _victoryCore.TextSize.approximateTextSize(props.title, style);

  var padding = style.padding || 0;
  return {
    height: textSize.height + 2 * padding || 0,
    width: textSize.width + 2 * padding || 0
  };
};

var getOffset = function (datum, rowHeights, columnWidths) {
  var column = datum.column,
      row = datum.row;
  return {
    x: (0, _range2.default)(column).reduce(function (memo, curr) {
      memo += columnWidths[curr];
      return memo;
    }, 0),
    y: (0, _range2.default)(row).reduce(function (memo, curr) {
      memo += rowHeights[curr];
      return memo;
    }, 0)
  };
};

var getAnchors = function (titleOrientation, centerTitle) {
  var standardAnchors = {
    textAnchor: titleOrientation === "right" ? "end" : "start",
    verticalAnchor: titleOrientation === "bottom" ? "end" : "start"
  };

  if (centerTitle) {
    var horizontal = titleOrientation === "top" || titleOrientation === "bottom";
    return {
      textAnchor: horizontal ? "middle" : standardAnchors.textAnchor,
      verticalAnchor: horizontal ? standardAnchors.verticalAnchor : "middle"
    };
  } else {
    return standardAnchors;
  }
};

var getTitleStyle = function (props) {
  var titleOrientation = props.titleOrientation,
      centerTitle = props.centerTitle,
      titleComponent = props.titleComponent;
  var baseStyle = props.style && props.style.title || {};
  var componentStyle = titleComponent.props && titleComponent.props.style || {};
  var anchors = getAnchors(titleOrientation, centerTitle);
  return Array.isArray(componentStyle) ? componentStyle.map(function (obj) {
    return (0, _defaults2.default)({}, obj, baseStyle, anchors);
  }) : (0, _defaults2.default)({}, componentStyle, baseStyle, anchors);
}; // eslint-disable-next-line complexity


var getTitleProps = function (props, borderProps) {
  var title = props.title,
      titleOrientation = props.titleOrientation,
      centerTitle = props.centerTitle,
      borderPadding = props.borderPadding;
  var height = borderProps.height,
      width = borderProps.width;
  var style = getTitleStyle(props);
  var padding = Array.isArray(style) ? style[0].padding : style.padding;
  var horizontal = titleOrientation === "top" || titleOrientation === "bottom";
  var xOrientation = titleOrientation === "bottom" ? "bottom" : "top";
  var yOrientation = titleOrientation === "right" ? "right" : "left";
  var standardPadding = {
    x: centerTitle ? width / 2 : borderPadding[xOrientation] + (padding || 0),
    y: centerTitle ? height / 2 : borderPadding[yOrientation] + (padding || 0)
  };

  var getPadding = function () {
    return borderPadding[titleOrientation] + (padding || 0);
  };

  var xOffset = horizontal ? standardPadding.x : getPadding();
  var yOffset = horizontal ? getPadding() : standardPadding.y;
  return {
    x: titleOrientation === "right" ? props.x + width - xOffset : props.x + xOffset,
    y: titleOrientation === "bottom" ? props.y + height - yOffset : props.y + yOffset,
    style: style,
    text: title
  };
};

var getBorderProps = function (props, contentHeight, contentWidth) {
  var x = props.x,
      y = props.y,
      borderPadding = props.borderPadding,
      style = props.style;
  var height = (contentHeight || 0) + borderPadding.top + borderPadding.bottom;
  var width = (contentWidth || 0) + borderPadding.left + borderPadding.right;
  return {
    x: x,
    y: y,
    height: height,
    width: width,
    style: (0, _assign2.default)({
      fill: "none"
    }, style.border)
  };
};

var getDimensions = function (props, fallbackProps) {
  var modifiedProps = _victoryCore.Helpers.modifyProps(props, fallbackProps, "legend");

  props = (0, _assign2.default)({}, modifiedProps, getCalculatedValues(modifiedProps));
  var _props = props,
      title = _props.title,
      titleOrientation = _props.titleOrientation;
  var groupedData = groupData(props);
  var columnWidths = getColumnWidths(props, groupedData);
  var rowHeights = getRowHeights(props, groupedData);
  var titleDimensions = title ? getTitleDimensions(props) : {
    height: 0,
    width: 0
  };
  return {
    height: titleOrientation === "left" || titleOrientation === "right" ? Math.max((0, _sum2.default)(rowHeights), titleDimensions.height) : (0, _sum2.default)(rowHeights) + titleDimensions.height,
    width: titleOrientation === "left" || titleOrientation === "right" ? (0, _sum2.default)(columnWidths) + titleDimensions.width : Math.max((0, _sum2.default)(columnWidths), titleDimensions.width)
  };
};

exports.getDimensions = getDimensions;

var getBaseProps = function (props, fallbackProps) {
  var modifiedProps = _victoryCore.Helpers.modifyProps(props, fallbackProps, "legend");

  props = (0, _assign2.default)({}, modifiedProps, getCalculatedValues(modifiedProps));
  var _props2 = props,
      data = _props2.data,
      standalone = _props2.standalone,
      theme = _props2.theme,
      padding = _props2.padding,
      style = _props2.style,
      colorScale = _props2.colorScale,
      gutter = _props2.gutter,
      rowGutter = _props2.rowGutter,
      borderPadding = _props2.borderPadding,
      title = _props2.title,
      titleOrientation = _props2.titleOrientation,
      name = _props2.name,
      _props2$x = _props2.x,
      x = _props2$x === void 0 ? 0 : _props2$x,
      _props2$y = _props2.y,
      y = _props2$y === void 0 ? 0 : _props2$y;
  var groupedData = groupData(props);
  var columnWidths = getColumnWidths(props, groupedData);
  var rowHeights = getRowHeights(props, groupedData);
  var labelStyles = getLabelStyles(props);
  var titleDimensions = title ? getTitleDimensions(props) : {
    height: 0,
    width: 0
  };
  var titleOffset = {
    x: titleOrientation === "left" ? titleDimensions.width : 0,
    y: titleOrientation === "top" ? titleDimensions.height : 0
  };
  var gutterOffset = {
    x: gutter && typeof gutter === "object" ? gutter.left || 0 : 0,
    y: rowGutter && typeof rowGutter === "object" ? rowGutter.top || 0 : 0
  };

  var _getDimensions = getDimensions(props, fallbackProps),
      height = _getDimensions.height,
      width = _getDimensions.width;

  var borderProps = getBorderProps(props, height, width);
  var titleProps = getTitleProps(props, borderProps);
  var initialProps = {
    parent: {
      data: data,
      standalone: standalone,
      theme: theme,
      padding: padding,
      name: name,
      height: props.height,
      width: props.width,
      style: style.parent
    },
    all: {
      border: borderProps,
      title: titleProps
    }
  };
  return groupedData.reduce(function (childProps, datum, i) {
    var color = colorScale[i % colorScale.length];
    var dataStyle = (0, _defaults2.default)({}, datum.symbol, style.data, {
      fill: color
    });
    var eventKey = !(0, _isNil2.default)(datum.eventKey) ? datum.eventKey : i;
    var offset = getOffset(datum, rowHeights, columnWidths);
    var originY = y + borderPadding.top + datum.symbolSpacer;
    var originX = x + borderPadding.left + datum.symbolSpacer;
    var dataProps = {
      index: i,
      data: data,
      datum: datum,
      symbol: dataStyle.type || dataStyle.symbol || "circle",
      size: datum.size,
      style: dataStyle,
      y: originY + offset.y + titleOffset.y + gutterOffset.y,
      x: originX + offset.x + titleOffset.x + gutterOffset.x
    };
    var labelProps = {
      datum: datum,
      data: data,
      text: datum.name,
      style: labelStyles[i],
      y: dataProps.y,
      x: dataProps.x + datum.symbolSpacer + datum.size / 2
    };
    childProps[eventKey] = {
      data: dataProps,
      labels: labelProps
    };
    return childProps;
  }, initialProps);
};

exports.getBaseProps = getBaseProps;