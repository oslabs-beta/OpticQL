import _orderBy from "lodash/orderBy";
import _keys from "lodash/keys";
import _assign from "lodash/assign";
import React from "react";
import { Helpers, Scale, Wrapper } from "victory-core";
var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50
}; // Assumes data in `datasets` is sorted by `Data.getData`.

function fillData(props, datasets) {
  var fillInMissingData = props.fillInMissingData;
  var xMap = datasets.reduce(function (prev, dataset) {
    dataset.forEach(function (datum) {
      prev[datum._x instanceof Date ? datum._x.getTime() : datum._x] = true;
    });
    return prev;
  }, {});

  var xKeys = _keys(xMap).map(function (k) {
    return +k;
  });

  var xArr = _orderBy(xKeys);

  return datasets.map(function (dataset) {
    var indexOffset = 0;
    var isDate = dataset[0] && dataset[0]._x instanceof Date;
    var filledInData = xArr.map(function (x, index) {
      x = +x;
      var datum = dataset[index - indexOffset];

      if (datum) {
        var x1 = isDate ? datum._x.getTime() : datum._x;

        if (x1 === x) {
          return datum;
        } else {
          indexOffset++;
          var y = fillInMissingData ? 0 : null;
          x = isDate ? new Date(x) : x;
          return {
            x: x,
            y: y,
            _x: x,
            _y: y
          };
        }
      } else {
        var _y = fillInMissingData ? 0 : null;

        x = isDate ? new Date(x) : x;
        return {
          x: x,
          y: _y,
          _x: x,
          _y: _y
        };
      }
    });
    return filledInData;
  });
}

function getY0(datum, index, datasets) {
  if (datum.y0) {
    return datum.y0;
  }

  var y = datum._y;
  var previousDatasets = datasets.slice(0, index);
  var previousPoints = previousDatasets.reduce(function (prev, dataset) {
    return prev.concat(dataset.filter(function (previousDatum) {
      return datum._x instanceof Date ? previousDatum._x.getTime() === datum._x.getTime() : previousDatum._x === datum._x;
    }).map(function (previousDatum) {
      return previousDatum._y || 0;
    }));
  }, []);
  var y0 = previousPoints.length && previousPoints.reduce(function (memo, value) {
    var sameSign = y < 0 && value < 0 || y >= 0 && value >= 0;
    return sameSign ? +value + memo : memo;
  }, 0);
  return previousPoints.some(function (point) {
    return point instanceof Date;
  }) ? new Date(y0) : y0;
}
/* eslint-disable no-nested-ternary */


function addLayoutData(props, datasets, index) {
  var xOffset = props.xOffset || 0;
  return datasets[index].map(function (datum) {
    var yOffset = getY0(datum, index, datasets) || 0;
    return _assign({}, datum, {
      _y0: !(datum._y instanceof Date) ? yOffset : yOffset ? new Date(yOffset) : datum._y,
      _y1: datum._y === null ? null : datum._y instanceof Date ? new Date(+datum._y + +yOffset) : datum._y + yOffset,
      _x1: datum._x === null ? null : datum._x instanceof Date ? new Date(+datum._x + +xOffset) : datum._x + xOffset
    });
  });
}
/* eslint-enable no-nested-ternary */


function stackData(props, childComponents) {
  var dataFromChildren = Wrapper.getDataFromChildren(props, childComponents);
  var datasets = fillData(props, dataFromChildren);
  return datasets.map(function (d, i) {
    return addLayoutData(props, datasets, i);
  });
}

function getCalculatedProps(props, childComponents) {
  childComponents = childComponents || React.Children.toArray(props.children);
  var role = "stack";
  props = Helpers.modifyProps(props, fallbackProps, role);
  var style = Wrapper.getStyle(props.theme, props.style, role);
  var categories = props.categories || Wrapper.getCategories(props, childComponents);
  var datasets = props.datasets || stackData(props, childComponents);
  var children = childComponents.map(function (c, i) {
    return React.cloneElement(c, {
      data: datasets[i]
    });
  });
  var domain = {
    x: Wrapper.getDomain(_assign({}, props, {
      categories: categories
    }), "x", children),
    y: Wrapper.getDomain(_assign({}, props, {
      categories: categories
    }), "y", children)
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
  var _props = props,
      colorScale = _props.colorScale,
      horizontal = _props.horizontal;
  return {
    datasets: datasets,
    categories: categories,
    range: range,
    domain: domain,
    horizontal: horizontal,
    scale: scale,
    style: style,
    colorScale: colorScale,
    role: role
  };
}

function getLabels(props, datasets, index) {
  if (!props.labels) {
    return undefined;
  }

  return datasets.length === index + 1 ? props.labels : undefined;
}

function getChildProps(props, calculatedProps) {
  var categories = calculatedProps.categories,
      domain = calculatedProps.domain,
      range = calculatedProps.range,
      scale = calculatedProps.scale,
      horizontal = calculatedProps.horizontal;
  return {
    height: props.height,
    width: props.width,
    padding: Helpers.getPadding(props),
    standalone: false,
    theme: props.theme,
    categories: categories,
    domain: domain,
    range: range,
    scale: scale,
    horizontal: horizontal
  };
}

function getColorScale(props, child) {
  var role = child.type && child.type.role;
  var colorScaleOptions = child.props.colorScale || props.colorScale;

  if (role !== "group" && role !== "stack") {
    return undefined;
  }

  return props.theme ? colorScaleOptions || props.theme.props.colorScale : colorScaleOptions;
}

function getChildren(props, childComponents, calculatedProps) {
  props = Helpers.modifyProps(props, fallbackProps, "stack");
  childComponents = childComponents || React.Children.toArray(props.children);
  calculatedProps = calculatedProps || getCalculatedProps(props, childComponents);
  var _calculatedProps = calculatedProps,
      datasets = _calculatedProps.datasets;
  var childProps = getChildProps(props, calculatedProps);
  var parentName = props.name || "stack";
  return childComponents.map(function (child, index) {
    var role = child.type && child.type.role;
    var data = datasets[index];
    var style = Wrapper.getChildStyle(child, index, calculatedProps);
    var labels = props.labels ? getLabels(props, datasets, index) : child.props.labels;
    var name = child.props.name || "".concat(parentName, "-").concat(role, "-").concat(index);
    return React.cloneElement(child, _assign({
      key: "".concat(name, "-key-").concat(index),
      labels: labels,
      name: name,
      domainPadding: child.props.domainPadding || props.domainPadding,
      theme: props.theme,
      labelComponent: props.labelComponent || child.props.labelComponent,
      style: style,
      colorScale: getColorScale(props, child),
      data: data,
      polar: props.polar
    }, childProps));
  });
}

export { getChildren, getCalculatedProps };