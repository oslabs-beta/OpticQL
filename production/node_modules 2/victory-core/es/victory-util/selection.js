/* eslint-disable func-style */

/* eslint-disable no-use-before-define */
import Collection from "./collection"; // Private Functions

function transformTarget(target, matrix, dimension) {
  var a = matrix.a,
      d = matrix.d,
      e = matrix.e,
      f = matrix.f;
  return dimension === "y" ? d * target + f : a * target + e;
}

function getTransformationMatrix(svg) {
  return svg.getScreenCTM().inverse();
} // Exported Functions


function getParentSVG(evt) {
  if (evt.nativeEvent && evt.nativeEvent.identifier !== undefined) {
    return undefined;
  }

  var getParent = function (target) {
    if (target.nodeName === "svg") {
      return target;
    } else {
      return target.parentNode ? getParent(target.parentNode) : target;
    }
  };

  return getParent(evt.target);
}

function getSVGEventCoordinates(evt, svg) {
  if (evt.nativeEvent && evt.nativeEvent.identifier !== undefined) {
    // react-native override. relies on the RN.View being the _exact_ same size as its child SVG.
    // this should be fine: the svg is the only child of View and the View shirks to its children
    return {
      x: evt.nativeEvent.locationX,
      y: evt.nativeEvent.locationY
    };
  }

  evt = evt.changedTouches && evt.changedTouches.length ? evt.changedTouches[0] : evt;
  svg = svg || getParentSVG(evt);
  var matrix = getTransformationMatrix(svg);
  return {
    x: transformTarget(evt.clientX, matrix, "x"),
    y: transformTarget(evt.clientY, matrix, "y")
  };
}

function getDomainCoordinates(props, domain) {
  var scale = props.scale,
      horizontal = props.horizontal;
  domain = domain || {
    x: scale.x.domain(),
    y: scale.y.domain()
  };
  return {
    x: horizontal ? [scale.y(domain.y[0]), scale.y(domain.y[1])] : [scale.x(domain.x[0]), scale.x(domain.x[1])],
    y: horizontal ? [scale.x(domain.x[0]), scale.x(domain.x[1])] : [scale.y(domain.y[0]), scale.y(domain.y[1])]
  };
} // eslint-disable-next-line max-params


function getDataCoordinates(props, scale, x, y) {
  var polar = props.polar,
      horizontal = props.horizontal;

  if (!polar) {
    return {
      x: horizontal ? scale.x.invert(y) : scale.x.invert(x),
      y: horizontal ? scale.y.invert(x) : scale.y.invert(y)
    };
  } else {
    var origin = props.origin || {
      x: 0,
      y: 0
    };
    var baseX = x - origin.x;
    var baseY = y - origin.y;
    var radius = Math.abs(baseX * Math.sqrt(1 + Math.pow(-baseY / baseX, 2)));
    var angle = (-Math.atan2(baseY, baseX) + Math.PI * 2) % (Math.PI * 2);
    return {
      x: scale.x.invert(angle),
      y: scale.y.invert(radius)
    };
  }
}

function getBounds(props) {
  var x1 = props.x1,
      x2 = props.x2,
      y1 = props.y1,
      y2 = props.y2,
      scale = props.scale;
  var point1 = getDataCoordinates(props, scale, x1, y1);
  var point2 = getDataCoordinates(props, scale, x2, y2);

  var makeBound = function (a, b) {
    return [Collection.getMinValue([a, b]), Collection.getMaxValue([a, b])];
  };

  return {
    x: makeBound(point1.x, point2.x),
    y: makeBound(point1.y, point2.y)
  };
}

export default {
  getParentSVG: getParentSVG,
  getSVGEventCoordinates: getSVGEventCoordinates,
  getDomainCoordinates: getDomainCoordinates,
  getDataCoordinates: getDataCoordinates,
  getBounds: getBounds
};