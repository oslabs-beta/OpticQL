// From https://github.com/d3/d3-delaunay/blob/master/src/delaunay.js
import Delaunator from "delaunator/delaunator.js";

function pointX(p) {
  return p[0];
}

function pointY(p) {
  return p[1];
}

// A triangulation is collinear if all its triangles have a non-null area
function collinear(d) {
  const { triangles, coords } = d;
  for (let i = 0; i < triangles.length; i += 3) {
    const a = 2 * triangles[i];
    const b = 2 * triangles[i + 1];
    const c = 2 * triangles[i + 2];
    const cross =
      (coords[c] - coords[a]) * (coords[b + 1] - coords[a + 1]) -
      (coords[b] - coords[a]) * (coords[c + 1] - coords[a + 1]);
    // eslint-disable-next-line no-magic-numbers
    if (cross > 1e-10) {
      return false;
    }
  }
  return true;
}

function jitter(x, y, r) {
  return [x + Math.sin(x + y) * r, y + Math.cos(x - y) * r];
}

// eslint-disable-next-line max-params
function flatArray(points, fx, fy, that) {
  const n = points.length;
  const array = new Float64Array(n * 2);
  for (let i = 0; i < n; ++i) {
    const p = points[i];
    array[i * 2] = fx.call(that, p, i, points);
    array[i * 2 + 1] = fy.call(that, p, i, points);
  }
  return array;
}

export default class Delaunay {
  constructor(points) {
    const delaunator = new Delaunator(points);
    this.inedges = new Int32Array(points.length / 2);
    this._hullIndex = new Int32Array(points.length / 2);
    this.points = delaunator.coords;
    this._init(delaunator);
  }

  // eslint-disable-next-line max-statements, complexity
  _init(delaunator) {
    const d = delaunator;
    const points = this.points;

    // check for collinear
    // eslint-disable-next-line no-magic-numbers
    if (d.hull && d.hull.length > 2 && collinear(d)) {
      this.collinear = Int32Array.from(
        { length: points.length / 2 },
        (_, i) => i
      ).sort(
        (i, j) =>
          points[2 * i] - points[2 * j] || points[2 * i + 1] - points[2 * j + 1]
      ); // for exact neighbors
      const e = this.collinear[0];
      const f = this.collinear[this.collinear.length - 1];
      const bounds = [
        points[2 * e],
        points[2 * e + 1],
        points[2 * f],
        points[2 * f + 1]
      ];
      const r =
        1e-8 * // eslint-disable-line no-magic-numbers
        Math.sqrt((bounds[3] - bounds[1]) ** 2 + (bounds[2] - bounds[0]) ** 2);
      for (let i = 0, n = points.length / 2; i < n; ++i) {
        const p = jitter(points[2 * i], points[2 * i + 1], r);
        points[2 * i] = p[0];
        points[2 * i + 1] = p[1];
      }
      delaunator = new Delaunator(points);
    }

    const halfedges = (this.halfedges = delaunator.halfedges);
    const hull = (this.hull = delaunator.hull);
    const triangles = (this.triangles = delaunator.triangles);
    const inedges = this.inedges.fill(-1);
    const hullIndex = this._hullIndex.fill(-1);

    // Compute an index from each point to an (arbitrary) incoming halfedge
    // Used to give the first neighbor of each point; for this reason,
    // on the hull we give priority to exterior halfedges
    for (let e = 0, n = halfedges.length; e < n; ++e) {
      const p = triangles[e % 3 === 2 ? e - 2 : e + 1];
      if (halfedges[e] === -1 || inedges[p] === -1) inedges[p] = e;
    }
    for (let i = 0, n = hull.length; i < n; ++i) {
      hullIndex[hull[i]] = i;
    }

    // degenerate case: 1 or 2 (distinct) points
    if (hull.length <= 2 && hull.length > 0) {
      this.triangles = new Int32Array(3).fill(-1);
      this.halfedges = new Int32Array(3).fill(-1);
      this.triangles[0] = hull[0];
      this.triangles[1] = hull[1];
      this.triangles[2] = hull[1];
      inedges[hull[0]] = 1;
      if (hull.length === 2) inedges[hull[1]] = 0;
    }
  }

  // eslint-disable-next-line max-statements
  neighbors(i) {
    const results = [];

    const { inedges, hull, _hullIndex, halfedges, triangles } = this;

    const e0 = inedges[i];
    if (e0 === -1) return results; // coincident point

    let e = e0;
    let p0 = -1;
    do {
      p0 = triangles[e];
      results.push(p0);
      e = e % 3 === 2 ? e - 2 : e + 1;
      if (triangles[e] !== i) break; // bad triangulation
      e = halfedges[e];
      if (e === -1) {
        const p = hull[(_hullIndex[i] + 1) % hull.length];
        if (p !== p0) results.push(p);
        break;
      }
    } while (e !== e0);

    return results;
  }

  find(x, y, i = 0) {
    // eslint-disable-next-line no-self-compare
    if (((x = +x), x !== x) || ((y = +y), y !== y)) return -1;
    const i0 = i;
    let c;
    while ((c = this._step(i, x, y)) >= 0 && c !== i && c !== i0) i = c;
    return c;
  }

  _step(i, x, y) {
    const { inedges, points } = this;
    if (inedges[i] === -1 || !points.length)
      return (i + 1) % (points.length >> 1);
    let c = i;
    let dc = (x - points[i * 2]) ** 2 + (y - points[i * 2 + 1]) ** 2;
    for (const t of this.neighbors(i)) {
      const dt = (x - points[t * 2]) ** 2 + (y - points[t * 2 + 1]) ** 2;
      if (dt < dc) {
        dc = dt;
        c = t;
      }
    }
    return c;
  }
}

// eslint-disable-next-line max-params
Delaunay.from = function(points, fx = pointX, fy = pointY, that) {
  return new Delaunay(flatArray(points, fx, fy, that));
};

// only public methods will be .from and .find
