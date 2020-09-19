import _delay from "lodash/delay";
import _defaults from "lodash/defaults";
import _isFunction from "lodash/isFunction";
import _throttle from "lodash/throttle";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

/*eslint no-magic-numbers: ["error", { "ignore": [-1, 0, 1, 2, 1000] }]*/
import { Children } from "react";
import { Selection, Collection, Wrapper } from "victory-core";
var RawZoomHelpers = {
  checkDomainEquality: function (a, b) {
    var checkDimension = function (dim) {
      var val1 = a && a[dim];
      var val2 = b && b[dim];

      if (!val1 && !val2) {
        return true;
      } else if (!val1 || !val2) {
        return false;
      }

      return +val1[0] === +val2[0] && +val1[1] === +val2[1];
    };

    return checkDimension("x") && checkDimension("y");
  },

  /**
   * Generates a new domain scaled by factor and constrained by the original domain.
   * @param  {[Number, Number]} currentDomain  The domain to be scaled.
   * @param  {Object} evt the event object
   * @param  {Object} props the props of the targeted component
   * @param  {String} axis the desired dimension (either x or y)
   * @return {[Number, Number]}                The scale domain
   */
  // eslint-disable-next-line max-params
  scale: function (currentDomain, evt, props, axis) {
    var _currentDomain = _slicedToArray(currentDomain, 2),
        from = _currentDomain[0],
        to = _currentDomain[1];

    var range = Math.abs(to - from);
    var minimumZoom = props.minimumZoom && props.minimumZoom[axis];
    var factor = this.getScaleFactor(evt);

    if (minimumZoom && range <= minimumZoom && factor < 1) {
      return currentDomain;
    }

    var _getDomain$axis = _slicedToArray(this.getDomain(props)[axis], 2),
        fromBound = _getDomain$axis[0],
        toBound = _getDomain$axis[1];

    var percent = this.getScalePercent(evt, props, axis);
    var point = factor * from + percent * (factor * range);
    var minDomain = this.getMinimumDomain(point, props, axis);

    var _getScaledDomain = this.getScaledDomain(currentDomain, factor, percent),
        _getScaledDomain2 = _slicedToArray(_getScaledDomain, 2),
        newMin = _getScaledDomain2[0],
        newMax = _getScaledDomain2[1];

    var newDomain = [newMin > fromBound && newMin < toBound ? newMin : fromBound, newMax < toBound && newMax > fromBound ? newMax : toBound];
    var domain = Math.abs(minDomain[1] - minDomain[0]) > Math.abs(newDomain[1] - newDomain[0]) ? minDomain : newDomain;
    return Collection.containsDates([fromBound, toBound]) ? [new Date(domain[0]), new Date(domain[1])] : domain;
  },
  getScaledDomain: function (currentDomain, factor, percent) {
    var _currentDomain2 = _slicedToArray(currentDomain, 2),
        from = _currentDomain2[0],
        to = _currentDomain2[1];

    var range = Math.abs(to - from);
    var diff = range - range * factor;
    var newMin = +from + diff * percent;
    var newMax = +to - diff * (1 - percent);
    return [Math.min(newMin, newMax), Math.max(newMin, newMax)];
  },
  getMinimumDomain: function (point, props, axis) {
    var minimumZoom = props.minimumZoom;
    var originalDomain = this.getDomain(props)[axis];

    var _originalDomain = _slicedToArray(originalDomain, 2),
        from = _originalDomain[0],
        to = _originalDomain[1];

    var defaultMin = Math.abs(from - to) / 1000;
    var extent = minimumZoom ? minimumZoom[axis] || defaultMin : defaultMin;
    var minExtent = point - extent / 2;
    var maxExtent = point + extent / 2;
    return [minExtent > from && minExtent < to ? minExtent : from, maxExtent < to && maxExtent > from ? maxExtent : +from + extent / 2];
  },
  zoommingOut: function (evt) {
    return evt.deltaY > 0;
  },
  getScaleFactor: function (evt) {
    var sign = this.zoommingOut(evt) ? 1 : -1; // eslint-disable-next-line no-magic-numbers

    var delta = Math.min(Math.abs(evt.deltaY / 300), 0.5); // TODO: Check scale factor

    return Math.abs(1 + sign * delta);
  },
  getScalePercent: function (evt, props, axis) {
    var originalDomain = this.getDomain(props);

    var _originalDomain$axis = _slicedToArray(originalDomain[axis], 2),
        from = _originalDomain$axis[0],
        to = _originalDomain$axis[1];

    var position = this.getPosition(evt, props, originalDomain);
    return (position[axis] - from) / Math.abs(to - from);
  },
  getPosition: function (evt, props, originalDomain) {
    var _Selection$getSVGEven = Selection.getSVGEventCoordinates(evt),
        x = _Selection$getSVGEven.x,
        y = _Selection$getSVGEven.y;

    var originalScale = {
      x: props.scale.x.domain(originalDomain.x),
      y: props.scale.y.domain(originalDomain.y)
    };
    return Selection.getDataCoordinates(props, originalScale, x, y);
  },

  /**
   * Generate a new domain translated by the delta and constrained by the original domain.
   * @param  {[Number, Number]} currentDomain  The domain to be translated.
   * @param  {[Number, Number]} originalDomain The original domain for the data set.
   * @param  {Number}           delta          The delta to translate by
   * @return {[Number, Number]}                The translated domain
   */
  pan: function (currentDomain, originalDomain, delta) {
    var _currentDomain$map = currentDomain.map(function (val) {
      return +val;
    }),
        _currentDomain$map2 = _slicedToArray(_currentDomain$map, 2),
        fromCurrent = _currentDomain$map2[0],
        toCurrent = _currentDomain$map2[1];

    var _originalDomain$map = originalDomain.map(function (val) {
      return +val;
    }),
        _originalDomain$map2 = _slicedToArray(_originalDomain$map, 2),
        fromOriginal = _originalDomain$map2[0],
        toOriginal = _originalDomain$map2[1];

    var lowerBound = fromCurrent + delta;
    var upperBound = toCurrent + delta;
    var newDomain;

    if (lowerBound > fromOriginal && upperBound < toOriginal) {
      newDomain = [lowerBound, upperBound];
    } else if (lowerBound < fromOriginal) {
      // Clamp to lower limit
      var dx = toCurrent - fromCurrent;
      newDomain = [fromOriginal, fromOriginal + dx];
    } else if (upperBound > toOriginal) {
      // Clamp to upper limit
      var _dx = toCurrent - fromCurrent;

      newDomain = [toOriginal - _dx, toOriginal];
    } else {
      newDomain = currentDomain;
    }

    return Collection.containsDates(currentDomain) || Collection.containsDates(originalDomain) ? newDomain.map(function (val) {
      return new Date(val);
    }) : newDomain;
  },
  // eslint-disable-next-line max-params
  getDomainScale: function (domain, scale, axis, horizontal) {
    var axisDomain = Array.isArray(domain) ? domain : domain[axis];

    var _axisDomain = _slicedToArray(axisDomain, 2),
        from = _axisDomain[0],
        to = _axisDomain[1];

    var otherAxis = axis === "x" ? "y" : "x";
    var range = horizontal ? scale[otherAxis].range() : scale[axis].range();
    var plottableWidth = Math.abs(range[0] - range[1]);
    return plottableWidth / (to - from);
  },
  handleAnimation: function (ctx) {
    var animationTimer = ctx.context.animationTimer;
    var transitionTimer = ctx.context.transitionTimer;
    transitionTimer.bypassAnimation();
    animationTimer.bypassAnimation();

    var resumeAnimation = function () {
      animationTimer.resumeAnimation();
      transitionTimer.resumeAnimation();
    }; // delay the callback that resumes animation by ~1 frame so that animation does not interfere with wheel events


    return _delay(resumeAnimation, 16); // eslint-disable-line no-magic-numbers
  },
  getLastDomain: function (targetProps, originalDomain) {
    var zoomDomain = targetProps.zoomDomain,
        cachedZoomDomain = targetProps.cachedZoomDomain,
        currentDomain = targetProps.currentDomain,
        domain = targetProps.domain;

    if (zoomDomain && !this.checkDomainEquality(zoomDomain, cachedZoomDomain)) {
      return _defaults({}, zoomDomain, domain);
    }

    return _defaults({}, currentDomain || zoomDomain || originalDomain, domain);
  },
  getDomain: function (props) {
    var originalDomain = props.originalDomain,
        domain = props.domain,
        children = props.children,
        zoomDimension = props.zoomDimension;
    var childComponents = Children.toArray(children);
    var childrenDomain = {};

    if (childComponents.length) {
      childrenDomain = zoomDimension ? _defineProperty({}, zoomDimension, Wrapper.getDomainFromChildren(props, zoomDimension, childComponents)) : {
        x: Wrapper.getDomainFromChildren(props, "x", childComponents),
        y: Wrapper.getDomainFromChildren(props, "y", childComponents)
      };
    }

    return _defaults({}, childrenDomain, originalDomain, domain);
  },
  onMouseDown: function (evt, targetProps) {
    evt.preventDefault();

    if (!targetProps.allowPan) {
      return undefined;
    }

    var parentSVG = targetProps.parentSVG || Selection.getParentSVG(evt);

    var _Selection$getSVGEven2 = Selection.getSVGEventCoordinates(evt, parentSVG),
        x = _Selection$getSVGEven2.x,
        y = _Selection$getSVGEven2.y;

    return [{
      target: "parent",
      mutation: function () {
        return {
          startX: x,
          startY: y,
          panning: true,
          parentSVG: parentSVG,
          parentControlledProps: ["domain"]
        };
      }
    }];
  },
  onMouseUp: function (evt, targetProps) {
    if (!targetProps.allowPan) {
      return undefined;
    }

    return [{
      target: "parent",
      mutation: function () {
        return {
          panning: false
        };
      }
    }];
  },
  onMouseLeave: function (evt, targetProps) {
    if (!targetProps.allowPan) {
      return undefined;
    }

    return [{
      target: "parent",
      mutation: function () {
        return {
          panning: false
        };
      }
    }];
  },
  // eslint-disable-next-line max-params, max-statements
  onMouseMove: function (evt, targetProps, eventKey, ctx) {
    if (targetProps.panning && targetProps.allowPan) {
      var scale = targetProps.scale,
          startX = targetProps.startX,
          startY = targetProps.startY,
          onZoomDomainChange = targetProps.onZoomDomainChange,
          zoomDomain = targetProps.zoomDomain,
          zoomDimension = targetProps.zoomDimension,
          horizontal = targetProps.horizontal;
      var parentSVG = targetProps.parentSVG || Selection.getParentSVG(evt);

      var _Selection$getSVGEven3 = Selection.getSVGEventCoordinates(evt, parentSVG),
          x = _Selection$getSVGEven3.x,
          y = _Selection$getSVGEven3.y;

      var originalDomain = this.getDomain(targetProps);
      var lastDomain = this.getLastDomain(targetProps, originalDomain);
      var deltaX = horizontal ? y - startY : startX - x;
      var deltaY = horizontal ? startX - x : y - startY;
      var dx = deltaX / this.getDomainScale(lastDomain, scale, "x", horizontal);
      var dy = deltaY / this.getDomainScale(lastDomain, scale, "y", horizontal);
      var currentDomain = {
        x: zoomDimension === "y" ? originalDomain.x : this.pan(lastDomain.x, originalDomain.x, dx),
        y: zoomDimension === "x" ? originalDomain.y : this.pan(lastDomain.y, originalDomain.y, dy)
      };
      var resumeAnimation = this.handleAnimation(ctx);
      var zoomActive = !this.checkDomainEquality(originalDomain, lastDomain);
      var mutatedProps = {
        parentControlledProps: ["domain"],
        startX: x,
        startY: y,
        parentSVG: parentSVG,
        domain: currentDomain,
        currentDomain: currentDomain,
        originalDomain: originalDomain,
        cachedZoomDomain: zoomDomain,
        zoomActive: zoomActive
      };

      if (_isFunction(onZoomDomainChange)) {
        onZoomDomainChange(currentDomain, _defaults({}, mutatedProps, targetProps));
      }

      return [{
        target: "parent",
        callback: resumeAnimation,
        mutation: function () {
          return mutatedProps;
        }
      }];
    }

    return undefined;
  },
  // eslint-disable-next-line max-params
  onWheel: function (evt, targetProps, eventKey, ctx) {
    if (!targetProps.allowZoom) {
      return undefined;
    }

    var onZoomDomainChange = targetProps.onZoomDomainChange,
        zoomDimension = targetProps.zoomDimension,
        zoomDomain = targetProps.zoomDomain;
    var originalDomain = this.getDomain(targetProps);
    var lastDomain = this.getLastDomain(targetProps, originalDomain);
    var x = lastDomain.x,
        y = lastDomain.y;
    var currentDomain = {
      x: zoomDimension === "y" ? lastDomain.x : this.scale(x, evt, targetProps, "x"),
      y: zoomDimension === "x" ? lastDomain.y : this.scale(y, evt, targetProps, "y")
    };
    var resumeAnimation = this.handleAnimation(ctx);
    var zoomActive = !this.zoommingOut(evt) || // if zoomming in or
    //   if zoomActive is already set AND user hasn't zoommed out all the way
    targetProps.zoomActive && !this.checkDomainEquality(originalDomain, lastDomain);
    var mutatedProps = {
      domain: currentDomain,
      currentDomain: currentDomain,
      originalDomain: originalDomain,
      cachedZoomDomain: zoomDomain,
      parentControlledProps: ["domain"],
      panning: false,
      zoomActive: zoomActive
    };

    if (_isFunction(onZoomDomainChange)) {
      onZoomDomainChange(currentDomain, _defaults({}, mutatedProps, targetProps));
    }

    return [{
      target: "parent",
      callback: resumeAnimation,
      mutation: function () {
        return mutatedProps;
      }
    }];
  }
};
export { RawZoomHelpers }; // allow victory-native to extend these helpers

export default {
  checkDomainEquality: RawZoomHelpers.checkDomainEquality.bind(RawZoomHelpers),
  onMouseDown: RawZoomHelpers.onMouseDown.bind(RawZoomHelpers),
  onMouseUp: RawZoomHelpers.onMouseUp.bind(RawZoomHelpers),
  onMouseLeave: RawZoomHelpers.onMouseLeave.bind(RawZoomHelpers),
  onMouseMove: _throttle(RawZoomHelpers.onMouseMove.bind(RawZoomHelpers), 16, // eslint-disable-line no-magic-numbers
  {
    leading: true,
    trailing: false
  }),
  onWheel: _throttle(RawZoomHelpers.onWheel.bind(RawZoomHelpers), 16, // eslint-disable-line no-magic-numbers
  {
    leading: true,
    trailing: false
  })
};