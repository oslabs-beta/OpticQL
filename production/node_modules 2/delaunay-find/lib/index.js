"use strict";

exports.__esModule = true;
exports["default"] = void 0;

var _delaunator = _interopRequireDefault(require("delaunator/delaunator.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// From https://github.com/d3/d3-delaunay/blob/master/src/delaunay.js
function pointX(p) {
  return p[0];
}

function pointY(p) {
  return p[1];
} // A triangulation is collinear if all its triangles have a non-null area


function collinear(d) {
  var triangles = d.triangles,
      coords = d.coords;

  for (var i = 0; i < triangles.length; i += 3) {
    var a = 2 * triangles[i];
    var b = 2 * triangles[i + 1];
    var c = 2 * triangles[i + 2];
    var cross = (coords[c] - coords[a]) * (coords[b + 1] - coords[a + 1]) - (coords[b] - coords[a]) * (coords[c + 1] - coords[a + 1]); // eslint-disable-next-line no-magic-numbers

    if (cross > 1e-10) {
      return false;
    }
  }

  return true;
}

function jitter(x, y, r) {
  return [x + Math.sin(x + y) * r, y + Math.cos(x - y) * r];
} // eslint-disable-next-line max-params


function flatArray(points, fx, fy, that) {
  var n = points.length;
  var array = new Float64Array(n * 2);

  for (var i = 0; i < n; ++i) {
    var p = points[i];
    array[i * 2] = fx.call(that, p, i, points);
    array[i * 2 + 1] = fy.call(that, p, i, points);
  }

  return array;
}

var Delaunay =
/*#__PURE__*/
function () {
  function Delaunay(points) {
    var delaunator = new _delaunator["default"](points);
    this.inedges = new Int32Array(points.length / 2);
    this._hullIndex = new Int32Array(points.length / 2);
    this.points = delaunator.coords;

    this._init(delaunator);
  } // eslint-disable-next-line max-statements, complexity


  var _proto = Delaunay.prototype;

  _proto._init = function _init(delaunator) {
    var d = delaunator;
    var points = this.points; // check for collinear
    // eslint-disable-next-line no-magic-numbers

    if (d.hull && d.hull.length > 2 && collinear(d)) {
      this.collinear = Int32Array.from({
        length: points.length / 2
      }, function (_, i) {
        return i;
      }).sort(function (i, j) {
        return points[2 * i] - points[2 * j] || points[2 * i + 1] - points[2 * j + 1];
      }); // for exact neighbors

      var e = this.collinear[0];
      var f = this.collinear[this.collinear.length - 1];
      var bounds = [points[2 * e], points[2 * e + 1], points[2 * f], points[2 * f + 1]];
      var r = 1e-8 * // eslint-disable-line no-magic-numbers
      Math.sqrt(Math.pow(bounds[3] - bounds[1], 2) + Math.pow(bounds[2] - bounds[0], 2));

      for (var i = 0, n = points.length / 2; i < n; ++i) {
        var p = jitter(points[2 * i], points[2 * i + 1], r);
        points[2 * i] = p[0];
        points[2 * i + 1] = p[1];
      }

      delaunator = new _delaunator["default"](points);
    }

    var halfedges = this.halfedges = delaunator.halfedges;
    var hull = this.hull = delaunator.hull;
    var triangles = this.triangles = delaunator.triangles;
    var inedges = this.inedges.fill(-1);

    var hullIndex = this._hullIndex.fill(-1); // Compute an index from each point to an (arbitrary) incoming halfedge
    // Used to give the first neighbor of each point; for this reason,
    // on the hull we give priority to exterior halfedges


    for (var _e = 0, _n = halfedges.length; _e < _n; ++_e) {
      var _p = triangles[_e % 3 === 2 ? _e - 2 : _e + 1];
      if (halfedges[_e] === -1 || inedges[_p] === -1) inedges[_p] = _e;
    }

    for (var _i = 0, _n2 = hull.length; _i < _n2; ++_i) {
      hullIndex[hull[_i]] = _i;
    } // degenerate case: 1 or 2 (distinct) points


    if (hull.length <= 2 && hull.length > 0) {
      this.triangles = new Int32Array(3).fill(-1);
      this.halfedges = new Int32Array(3).fill(-1);
      this.triangles[0] = hull[0];
      this.triangles[1] = hull[1];
      this.triangles[2] = hull[1];
      inedges[hull[0]] = 1;
      if (hull.length === 2) inedges[hull[1]] = 0;
    }
  } // eslint-disable-next-line max-statements
  ;

  _proto.neighbors = function neighbors(i) {
    var results = [];
    var inedges = this.inedges,
        hull = this.hull,
        _hullIndex = this._hullIndex,
        halfedges = this.halfedges,
        triangles = this.triangles;
    var e0 = inedges[i];
    if (e0 === -1) return results; // coincident point

    var e = e0;
    var p0 = -1;

    do {
      p0 = triangles[e];
      results.push(p0);
      e = e % 3 === 2 ? e - 2 : e + 1;
      if (triangles[e] !== i) break; // bad triangulation

      e = halfedges[e];

      if (e === -1) {
        var p = hull[(_hullIndex[i] + 1) % hull.length];
        if (p !== p0) results.push(p);
        break;
      }
    } while (e !== e0);

    return results;
  };

  _proto.find = function find(x, y, i) {
    if (i === void 0) {
      i = 0;
    }

    // eslint-disable-next-line no-self-compare
    if ((x = +x, x !== x) || (y = +y, y !== y)) return -1;
    var i0 = i;
    var c;

    while ((c = this._step(i, x, y)) >= 0 && c !== i && c !== i0) {
      i = c;
    }

    return c;
  };

  _proto._step = function _step(i, x, y) {
    var inedges = this.inedges,
        points = this.points;
    if (inedges[i] === -1 || !points.length) return (i + 1) % (points.length >> 1);
    var c = i;
    var dc = Math.pow(x - points[i * 2], 2) + Math.pow(y - points[i * 2 + 1], 2);

    for (var _iterator = this.neighbors(i), _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i2 >= _iterator.length) break;
        _ref = _iterator[_i2++];
      } else {
        _i2 = _iterator.next();
        if (_i2.done) break;
        _ref = _i2.value;
      }

      var t = _ref;
      var dt = Math.pow(x - points[t * 2], 2) + Math.pow(y - points[t * 2 + 1], 2);

      if (dt < dc) {
        dc = dt;
        c = t;
      }
    }

    return c;
  };

  return Delaunay;
}(); // eslint-disable-next-line max-params


exports["default"] = Delaunay;

Delaunay.from = function (points, fx, fy, that) {
  if (fx === void 0) {
    fx = pointX;
  }

  if (fy === void 0) {
    fy = pointY;
  }

  return new Delaunay(flatArray(points, fx, fy, that));
}; // only public methods will be .from and .find