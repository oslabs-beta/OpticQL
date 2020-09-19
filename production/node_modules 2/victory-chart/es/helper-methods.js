import _assign from "lodash/assign";
import _defaults from "lodash/defaults";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

/* eslint-disable func-style */

/* eslint-disable no-use-before-define */
import React from "react";
import { Helpers, Scale, Axis, Wrapper } from "victory-core";
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
  var childProps = Axis.modifyProps(_defaults({
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
  return React.cloneElement(backgroundElement, _defaults({}, backgroundElement.props, backgroundProps));
}

function getChildProps(child, props, calculatedProps) {
  var axisChild = Axis.findAxisComponents([child]);

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
    parent: _defaults({}, styleProps, {
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
  props = Helpers.modifyProps(props, fallbackProps, "chart");
  var _props = props,
      horizontal = _props.horizontal,
      polar = _props.polar;
  var allStrings = Wrapper.getStringsFromChildren(props, childComponents);
  var categories = Wrapper.getCategories(props, childComponents, allStrings);
  var stringMap = createStringMap(props, childComponents, allStrings);
  var domain = {
    x: getDomain(_assign({}, props, {
      categories: categories
    }), "x", childComponents),
    y: getDomain(_assign({}, props, {
      categories: categories
    }), "y", childComponents)
  };
  var range = {
    x: Helpers.getRange(props, "x"),
    y: Helpers.getRange(props, "y")
  };
  var baseScale = {
    x: Scale.getScaleFromProps(props, "x") || Wrapper.getScale(props, "x"),
    y: Scale.getScaleFromProps(props, "y") || Wrapper.getScale(props, "y")
  };
  var scale = {
    x: baseScale.x.domain(domain.x).range(horizontal ? range.y : range.x),
    y: baseScale.y.domain(domain.y).range(horizontal ? range.x : range.y)
  };
  var origin = polar ? Helpers.getPolarOrigin(props) : Axis.getOrigin(domain);
  var originSign = {
    x: Axis.getOriginSign(origin.x, domain.x),
    y: Axis.getOriginSign(origin.y, domain.y)
  };
  var orientations = {
    x: getOrientation("x", originSign.y, horizontal),
    y: getOrientation("y", originSign.x, horizontal)
  };
  var padding = Helpers.getPadding(props);
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
    var style = Array.isArray(child.props.style) ? child.props.style : _defaults({}, child.props.style, {
      parent: baseStyle
    });
    var childProps = getChildProps(child, props, calculatedProps);
    var name = child.props.name || "".concat(parentName, "-").concat(role, "-").concat(index);

    var newProps = _defaults({
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

    return React.cloneElement(child, newProps);
  });
}

var getChildComponents = function (props, defaultAxes) {
  var childComponents = React.Children.toArray(props.children);

  var newChildComponents = _toConsumableArray(childComponents);

  if (childComponents.length === 0) {
    newChildComponents.push(defaultAxes.independent, defaultAxes.dependent);
  } else {
    var axisComponents = {
      dependent: Axis.getAxisComponentsWithParent(childComponents, "dependent"),
      independent: Axis.getAxisComponentsWithParent(childComponents, "independent")
    };

    if (axisComponents.dependent.length === 0 && axisComponents.independent.length === 0) {
      newChildComponents = props.prependDefaultAxes ? [defaultAxes.independent, defaultAxes.dependent].concat(newChildComponents) : newChildComponents.concat([defaultAxes.independent, defaultAxes.dependent]);
    }
  }

  return newChildComponents;
};

var getDomain = function (props, axis, childComponents) {
  childComponents = childComponents || React.Children.toArray(props.children);
  var domain = Wrapper.getDomain(props, axis, childComponents);
  var axisComponent = Axis.getAxisComponent(childComponents, axis);
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

export { getBackgroundWithProps, getChildren, getCalculatedProps, getChildComponents };