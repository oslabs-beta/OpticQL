"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBackgroundWithProps = getBackgroundWithProps;
exports.getChildren = getChildren;
exports.getCalculatedProps = getCalculatedProps;
exports.getChildComponents = void 0;

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _react = _interopRequireDefault(require("react"));

var _victoryCore = require("victory-core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
};

function getAxisProps(child, props, calculatedProps) {
  var domain = calculatedProps.domain,
      scale = calculatedProps.scale,
      stringMap = calculatedProps.stringMap,
      categories = calculatedProps.categories,
      horizontal = calculatedProps.horizontal,
      orientations = calculatedProps.orientations;

  var childProps = _victoryCore.Axis.modifyProps((0, _defaults2.default)({
    horizontal: horizontal,
    theme: props.theme
  }, child.props));

  var axis = child.type.getAxis(childProps);
  var crossAxis = childProps.crossAxis === false ? false : true;
  var orientation = childProps.orientation || orientations[axis];
  var axisOffset = horizontal ? getHorizontalAxisOffset(props, calculatedProps, orientation) : getAxisOffset(props, calculatedProps, orientation);
  return {
    stringMap: stringMap,
    horizontal: horizontal,
    categories: categories,
    startAngle: props.startAngle,
    endAngle: props.endAngle,
    innerRadius: props.innerRadius,
    domain: domain,
    scale: scale,
    offsetY: childProps.offsetY !== undefined ? childProps.offsetY : axisOffset.y,
    offsetX: childProps.offsetX !== undefined ? childProps.offsetX : axisOffset.x,
    crossAxis: crossAxis,
    orientation: orientation
  };
}

function getBackgroundWithProps(props, calculatedProps) {
  var backgroundElement = props.backgroundComponent;
  var height = props.polar ? calculatedProps.range.y[1] : calculatedProps.range.y[0] - calculatedProps.range.y[1];
  var width = calculatedProps.range.x[1] - calculatedProps.range.x[0];
  var xScale = props.horizontal ? calculatedProps.scale.y.range()[0] : calculatedProps.scale.x.range()[0];
  var yScale = props.horizontal ? calculatedProps.scale.x.range()[1] : calculatedProps.scale.y.range()[1];
  var xCoordinate = props.polar ? calculatedProps.origin.x : xScale;
  var yCoordinate = props.polar ? calculatedProps.origin.y : yScale;
  var backgroundProps = {
    height: height,
    polar: props.polar,
    scale: calculatedProps.scale,
    style: props.style.background,
    x: xCoordinate,
    y: yCoordinate,
    width: width
  };
  return _react.default.cloneElement(backgroundElement, (0, _defaults2.default)({}, backgroundElement.props, backgroundProps));
}

function getChildProps(child, props, calculatedProps) {
  var axisChild = _victoryCore.Axis.findAxisComponents([child]);

  if (axisChild.length > 0) {
    return getAxisProps(axisChild[0], props, calculatedProps);
  }

  var categories = calculatedProps.categories,
      domain = calculatedProps.domain,
      range = calculatedProps.range,
      scale = calculatedProps.scale,
      stringMap = calculatedProps.stringMap,
      horizontal = calculatedProps.horizontal;
  return {
    categories: categories,
    domain: domain,
    range: range,
    scale: scale,
    stringMap: stringMap,
    horizontal: horizontal
  };
}

function getStyles(props) {
  var styleProps = props.style && props.style.parent;
  return {
    parent: (0, _defaults2.default)({}, styleProps, {
      height: "100%",
      width: "100%",
      userSelect: "none"
    })
  };
}

function getOrientation(axis, originSign, horizontal) {
  var sign = originSign || "positive";
  var orientations = {
    positive: {
      x: "bottom",
      y: "left"
    },
    negative: {
      x: "top",
      y: "right"
    }
  };
  var horizontalOrientations = {
    positive: {
      x: "left",
      y: "bottom"
    },
    negative: {
      x: "right",
      y: "top"
    }
  };
  return horizontal ? horizontalOrientations[sign][axis] : orientations[sign][axis];
}

function getCalculatedProps(props, childComponents) {
  var style = getStyles(props);
  props = _victoryCore.Helpers.modifyProps(props, fallbackProps, "chart");
  var _props = props,
      horizontal = _props.horizontal,
      polar = _props.polar;

  var allStrings = _victoryCore.Wrapper.getStringsFromChildren(props, childComponents);

  var categories = _victoryCore.Wrapper.getCategories(props, childComponents, allStrings);

  var stringMap = createStringMap(props, childComponents, allStrings);
  var domain = {
    x: getDomain((0, _assign2.default)({}, props, {
      categories: categories
    }), "x", childComponents),
    y: getDomain((0, _assign2.default)({}, props, {
      categories: categories
    }), "y", childComponents)
  };
  var range = {
    x: _victoryCore.Helpers.getRange(props, "x"),
    y: _victoryCore.Helpers.getRange(props, "y")
  };
  var baseScale = {
    x: _victoryCore.Scale.getScaleFromProps(props, "x") || _victoryCore.Wrapper.getScale(props, "x"),
    y: _victoryCore.Scale.getScaleFromProps(props, "y") || _victoryCore.Wrapper.getScale(props, "y")
  };
  var scale = {
    x: baseScale.x.domain(domain.x).range(horizontal ? range.y : range.x),
    y: baseScale.y.domain(domain.y).range(horizontal ? range.x : range.y)
  };
  var origin = polar ? _victoryCore.Helpers.getPolarOrigin(props) : _victoryCore.Axis.getOrigin(domain);
  var originSign = {
    x: _victoryCore.Axis.getOriginSign(origin.x, domain.x),
    y: _victoryCore.Axis.getOriginSign(origin.y, domain.y)
  };
  var orientations = {
    x: getOrientation("x", originSign.y, horizontal),
    y: getOrientation("y", originSign.x, horizontal)
  };

  var padding = _victoryCore.Helpers.getPadding(props);

  return {
    categories: categories,
    domain: domain,
    range: range,
    horizontal: horizontal,
    scale: scale,
    stringMap: stringMap,
    style: style,
    origin: origin,
    padding: padding,
    orientations: orientations
  };
}

function getChildren(props, childComponents, calculatedProps) {
  childComponents = childComponents || getChildComponents(props);
  calculatedProps = calculatedProps || getCalculatedProps(props, childComponents);
  var baseStyle = calculatedProps.style.parent;
  var height = props.height,
      polar = props.polar,
      theme = props.theme,
      width = props.width;
  var _calculatedProps = calculatedProps,
      origin = _calculatedProps.origin,
      horizontal = _calculatedProps.horizontal;
  var parentName = props.name || "chart";
  return childComponents.map(function (child, index) {
    var role = child.type && child.type.role;
    var style = Array.isArray(child.props.style) ? child.props.style : (0, _defaults2.default)({}, child.props.style, {
      parent: baseStyle
    });
    var childProps = getChildProps(child, props, calculatedProps);
    var name = child.props.name || "".concat(parentName, "-").concat(role, "-").concat(index);
    var newProps = (0, _defaults2.default)({
      horizontal: horizontal,
      height: height,
      polar: polar,
      theme: theme,
      width: width,
      style: style,
      name: name,
      origin: polar ? origin : undefined,
      padding: calculatedProps.padding,
      key: "".concat(name, "-key-").concat(index),
      standalone: false
    }, childProps);
    return _react.default.cloneElement(child, newProps);
  });
}

var getChildComponents = function (props, defaultAxes) {
  var childComponents = _react.default.Children.toArray(props.children);

  var newChildComponents = _toConsumableArray(childComponents);

  if (childComponents.length === 0) {
    newChildComponents.push(defaultAxes.independent, defaultAxes.dependent);
  } else {
    var axisComponents = {
      dependent: _victoryCore.Axis.getAxisComponentsWithParent(childComponents, "dependent"),
      independent: _victoryCore.Axis.getAxisComponentsWithParent(childComponents, "independent")
    };

    if (axisComponents.dependent.length === 0 && axisComponents.independent.length === 0) {
      newChildComponents = props.prependDefaultAxes ? [defaultAxes.independent, defaultAxes.dependent].concat(newChildComponents) : newChildComponents.concat([defaultAxes.independent, defaultAxes.dependent]);
    }
  }

  return newChildComponents;
};

exports.getChildComponents = getChildComponents;

var getDomain = function (props, axis, childComponents) {
  childComponents = childComponents || _react.default.Children.toArray(props.children);

  var domain = _victoryCore.Wrapper.getDomain(props, axis, childComponents);

  var axisComponent = _victoryCore.Axis.getAxisComponent(childComponents, axis);

  var invertDomain = axisComponent && axisComponent.props && axisComponent.props.invertAxis;
  return invertDomain ? domain.concat().reverse() : domain;
};

var getAxisOffset = function (props, calculatedProps, orientation) {
  var scale = calculatedProps.scale,
      origin = calculatedProps.origin,
      domain = calculatedProps.domain,
      padding = calculatedProps.padding;
  var top = padding.top,
      bottom = padding.bottom,
      left = padding.left,
      right = padding.right;
  var orientations = {
    x: orientation === "bottom" || orientation === "top" ? orientation : calculatedProps.orientations.x,
    y: orientation === "left" || orientation === "right" ? orientation : calculatedProps.orientations.y
  }; // make the axes line up, and cross when appropriate

  var orientationOffset = {
    y: orientations.x === "bottom" ? bottom : top,
    x: orientations.y === "left" ? left : right
  };
  var originOffset = {
    x: orientations.y === "left" ? 0 : props.width,
    y: orientations.x === "bottom" ? props.height : 0
  };
  var originPosition = {
    x: origin.x === domain.x[0] || origin.x === domain.x[1] ? 0 : scale.x(origin.x),
    y: origin.y === domain.y[0] || origin.y === domain.y[1] ? 0 : scale.y(origin.y)
  };
  return {
    x: originPosition.x ? Math.abs(originOffset.x - originPosition.x) : orientationOffset.x,
    y: originPosition.y ? Math.abs(originOffset.y - originPosition.y) : orientationOffset.y
  };
};

var getHorizontalAxisOffset = function (props, calculatedProps, orientation) {
  var scale = calculatedProps.scale,
      origin = calculatedProps.origin,
      domain = calculatedProps.domain,
      padding = calculatedProps.padding;
  var top = padding.top,
      bottom = padding.bottom,
      left = padding.left,
      right = padding.right;
  var orientations = {
    y: orientation === "bottom" || orientation === "top" ? orientation : calculatedProps.orientations.x,
    x: orientation === "left" || orientation === "right" ? orientation : calculatedProps.orientations.y
  }; // make the axes line up, and cross when appropriate

  var orientationOffset = {
    x: orientations.y === "bottom" ? bottom : top,
    y: orientations.x === "left" ? left : right
  };
  var originOffset = {
    y: orientations.x === "left" ? 0 : props.width,
    x: orientations.y === "bottom" ? props.height : 0
  };
  var originPosition = {
    x: origin.x === domain.x[0] || origin.x === domain.x[1] ? 0 : scale.x(origin.x),
    y: origin.y === domain.y[0] || origin.y === domain.y[1] ? 0 : scale.y(origin.y)
  };
  return {
    y: originPosition.x ? Math.abs(originOffset.x - originPosition.x) : orientationOffset.x,
    x: originPosition.y ? Math.abs(originOffset.y - originPosition.y) : orientationOffset.y
  };
};

var createStringMap = function (props, childComponents, allStrings) {
  var x = !allStrings.x || allStrings.x.length === 0 ? null : allStrings.x.reduce(function (memo, string, index) {
    memo[string] = index + 1;
    return memo;
  }, {});
  var y = !allStrings.y || allStrings.y.length === 0 ? null : allStrings.y.reduce(function (memo, string, index) {
    memo[string] = index + 1;
    return memo;
  }, {});
  return {
    x: x,
    y: y
  };
};