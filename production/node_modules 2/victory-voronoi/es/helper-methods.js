import _isNil from "lodash/isNil";
import _without from "lodash/without";
import _assign from "lodash/assign";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import { voronoi as d3Voronoi } from "d3-voronoi";
import { Helpers, LabelHelpers, Scale, Domain, Data } from "victory-core";

var getVoronoi = function (props, range, scale) {
  var minRange = [Math.min.apply(Math, _toConsumableArray(range.x)), Math.min.apply(Math, _toConsumableArray(range.y))];
  var maxRange = [Math.max.apply(Math, _toConsumableArray(range.x)), Math.max.apply(Math, _toConsumableArray(range.y))];

  var angleAccessor = function (d) {
    var x = scale.x(d._x1 !== undefined ? d._x1 : d._x);
    return -1 * x + Math.PI / 2;
  };

  var xAccessor = function (d) {
    return props.horizontal ? scale.y(d._y1 !== undefined ? d._y1 : d._y) : scale.x(d._x1 !== undefined ? d._x1 : d._x);
  };

  var yAccessor = function (d) {
    return props.horizontal ? scale.x(d._x1 !== undefined ? d._x1 : d._x) : scale.y(d._y1 !== undefined ? d._y1 : d._y);
  };

  return d3Voronoi().x(function (d) {
    return props.polar ? angleAccessor(d) : xAccessor(d);
  }).y(function (d) {
    return yAccessor(d);
  }).extent([minRange, maxRange]);
};

var getCalculatedValues = function (props) {
  var defaultStyles = props.theme && props.theme.voronoi && props.theme.voronoi.style ? props.theme.voronoi.style : {};
  var style = Helpers.getStyles(props.style, defaultStyles);
  var data = Data.getData(props);
  var range = {
    x: Helpers.getRange(props, "x"),
    y: Helpers.getRange(props, "y")
  };
  var domain = {
    x: Domain.getDomain(props, "x"),
    y: Domain.getDomain(props, "y")
  };
  var scale = {
    x: Scale.getBaseScale(props, "x").domain(domain.x).range(props.horizontal ? range.y : range.x),
    y: Scale.getBaseScale(props, "y").domain(domain.y).range(props.horizontal ? range.x : range.y)
  };
  var voronoi = getVoronoi(props, range, scale);
  var polygons = voronoi.polygons(data);
  var origin = props.polar ? props.origin || Helpers.getPolarOrigin(props) : undefined;
  return {
    domain: domain,
    data: data,
    scale: scale,
    style: style,
    polygons: polygons,
    origin: origin
  };
};

var getBaseProps = function (props, fallbackProps) {
  var modifiedProps = Helpers.modifyProps(props, fallbackProps, "scatter");
  props = _assign({}, modifiedProps, getCalculatedValues(modifiedProps));
  var _props = props,
      data = _props.data,
      domain = _props.domain,
      events = _props.events,
      height = _props.height,
      origin = _props.origin,
      padding = _props.padding,
      polar = _props.polar,
      polygons = _props.polygons,
      scale = _props.scale,
      sharedEvents = _props.sharedEvents,
      standalone = _props.standalone,
      style = _props.style,
      theme = _props.theme,
      width = _props.width,
      labels = _props.labels,
      name = _props.name;
  var initialChildProps = {
    parent: {
      style: style.parent,
      scale: scale,
      domain: domain,
      data: data,
      standalone: standalone,
      height: height,
      width: width,
      theme: theme,
      origin: origin,
      polar: polar,
      padding: padding,
      name: name
    }
  };
  return data.reduce(function (childProps, datum, index) {
    var polygon = _without(polygons[index], "data");

    var eventKey = !_isNil(datum.eventKey) ? datum.eventKey : index;

    var _Helpers$scalePoint = Helpers.scalePoint(props, datum),
        x = _Helpers$scalePoint.x,
        y = _Helpers$scalePoint.y;

    var dataProps = {
      x: x,
      y: y,
      datum: datum,
      data: data,
      index: index,
      scale: scale,
      polygon: polygon,
      origin: origin,
      size: props.size,
      style: style.data
    };
    childProps[eventKey] = {
      data: dataProps
    };
    var text = LabelHelpers.getText(props, datum, index);

    if (text !== undefined && text !== null || labels && (events || sharedEvents)) {
      childProps[eventKey].labels = LabelHelpers.getProps(props, index);
    }

    return childProps;
  }, initialChildProps);
};

export { getBaseProps };