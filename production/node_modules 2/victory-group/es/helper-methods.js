import _assign from "lodash/assign";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import React from "react";
import { Helpers, Scale, Data, Wrapper } from "victory-core";
var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50,
  offset: 0
}; // eslint-disable-next-line max-statements

function getCalculatedProps(props, childComponents) {
  var role = "group";
  props = Helpers.modifyProps(props, fallbackProps, role);
  var style = Wrapper.getStyle(props.theme, props.style, role);
  var _props = props,
      offset = _props.offset,
      colorScale = _props.colorScale,
      color = _props.color,
      polar = _props.polar,
      horizontal = _props.horizontal;
  var categories = props.categories || Wrapper.getCategories(props, childComponents);
  var datasets = props.datasets || Wrapper.getDataFromChildren(props);
  var domain = {
    x: Wrapper.getDomain(_assign({}, props, {
      categories: categories
    }), "x", childComponents),
    y: Wrapper.getDomain(_assign({}, props, {
      categories: categories
    }), "y", childComponents)
  };
  var range = props.range || {
    x: Helpers.getRange(props, "x"),
    y: Helpers.getRange(props, "y")
  };
  var baseScale = {
    x: Scale.getScaleFromProps(props, "x") || Wrapper.getScale(props, "x"),
    y: Scale.getScaleFromProps(props, "y") || Wrapper.getScale(props, "y")
  };
  var scale = {
    x: baseScale.x.domain(domain.x).range(props.horizontal ? range.y : range.x),
    y: baseScale.y.domain(domain.y).range(props.horizontal ? range.x : range.y)
  };
  var origin = polar ? props.origin : Helpers.getPolarOrigin(props);
  var padding = Helpers.getPadding(props);
  return {
    datasets: datasets,
    categories: categories,
    range: range,
    domain: domain,
    horizontal: horizontal,
    scale: scale,
    style: style,
    colorScale: colorScale,
    color: color,
    offset: offset,
    origin: origin,
    padding: padding
  };
}

function pixelsToValue(props, axis, calculatedProps) {
  if (!props.offset) {
    return 0;
  }

  var currentAxis = Helpers.getCurrentAxis(axis, props.horizontal);
  var domain = calculatedProps.domain[axis];
  var range = calculatedProps.range[currentAxis];
  var domainExtent = Math.max.apply(Math, _toConsumableArray(domain)) - Math.min.apply(Math, _toConsumableArray(domain));
  var rangeExtent = Math.max.apply(Math, _toConsumableArray(range)) - Math.min.apply(Math, _toConsumableArray(range));
  return domainExtent / rangeExtent * props.offset;
} // eslint-disable-next-line max-params


function getX0(props, calculatedProps, index, role) {
  var groupLength = role === "stack" ? calculatedProps.datasets[0].length : calculatedProps.datasets.length;
  var center = (groupLength - 1) / 2;
  var totalWidth = pixelsToValue(props, "x", calculatedProps);
  return (index - center) * totalWidth;
} // eslint-disable-next-line max-params


function getPolarX0(props, calculatedProps, index, role) {
  var groupLength = role === "stack" ? calculatedProps.datasets[0].length : calculatedProps.datasets.length;
  var center = (groupLength - 1) / 2;
  var width = getAngularWidth(props, calculatedProps);
  return (index - center) * width;
}

function getAngularWidth(props, calculatedProps) {
  var range = calculatedProps.range;
  var angularRange = Math.abs(range.x[1] - range.x[0]);
  var r = Math.max.apply(Math, _toConsumableArray(range.y));
  return props.offset / (2 * Math.PI * r) * angularRange;
}

function getLabels(props, datasets, index) {
  if (!props.labels) {
    return undefined;
  }

  return Math.floor(datasets.length / 2) === index ? props.labels : undefined;
}

function getChildProps(props, calculatedProps) {
  var categories = calculatedProps.categories,
      domain = calculatedProps.domain,
      range = calculatedProps.range,
      scale = calculatedProps.scale,
      horizontal = calculatedProps.horizontal,
      origin = calculatedProps.origin,
      padding = calculatedProps.padding;
  var width = props.width,
      height = props.height,
      theme = props.theme,
      polar = props.polar;
  return {
    height: height,
    width: width,
    theme: theme,
    polar: polar,
    origin: origin,
    categories: categories,
    domain: domain,
    range: range,
    scale: scale,
    horizontal: horizontal,
    padding: padding,
    standalone: false
  };
}

function getColorScale(props, child) {
  var role = child.type && child.type.role;
  var colorScaleOptions = child.props.colorScale || props.colorScale;

  if (role !== "group" && role !== "stack") {
    return undefined;
  }

  return props.theme && props.theme.group ? colorScaleOptions || props.theme.group.colorScale : colorScaleOptions;
}

function getDataWithOffset(props) {
  var defaultDataset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var offset = arguments.length > 2 ? arguments[2] : undefined;
  var dataset = props.data || props.y ? Data.getData(props) : defaultDataset;
  var xOffset = offset || 0;
  return dataset.map(function (datum) {
    var _x1 = datum._x instanceof Date ? new Date(datum._x.getTime() + xOffset) : datum._x + xOffset;

    return _assign({}, datum, {
      _x1: _x1
    });
  });
}

function getChildren(props, childComponents, calculatedProps) {
  props = Helpers.modifyProps(props, fallbackProps, "stack");
  childComponents = childComponents || React.Children.toArray(props.children);
  calculatedProps = calculatedProps || getCalculatedProps(props, childComponents);
  var _calculatedProps = calculatedProps,
      datasets = _calculatedProps.datasets;
  var _props2 = props,
      labelComponent = _props2.labelComponent,
      polar = _props2.polar;
  var childProps = getChildProps(props, calculatedProps);
  var parentName = props.name || "group";
  return childComponents.map(function (child, index) {
    var role = child.type && child.type.role;
    var xOffset = polar ? getPolarX0(props, calculatedProps, index, role) : getX0(props, calculatedProps, index, role);
    var style = role === "voronoi" || role === "tooltip" || role === "label" ? child.props.style : Wrapper.getChildStyle(child, index, calculatedProps);
    var labels = props.labels ? getLabels(props, datasets, index) : child.props.labels;
    var name = child.props.name || "".concat(parentName, "-").concat(role, "-").concat(index);
    return React.cloneElement(child, _assign({
      labels: labels,
      style: style,
      key: "".concat(name, "-key-").concat(index),
      name: name,
      data: getDataWithOffset(props, datasets[index], xOffset),
      colorScale: getColorScale(props, child),
      labelComponent: labelComponent || child.props.labelComponent,
      xOffset: xOffset
    }, childProps));
  });
}

export { getChildren, getCalculatedProps };