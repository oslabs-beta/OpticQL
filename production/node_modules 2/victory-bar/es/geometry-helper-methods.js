/**
 * A point in the 2d plane
 * @param {number} x - x coordinate
 * @param {number} y - y coordinate
 * @returns {object} - point object
 */
var point = function (x, y) {
  return {
    x: x,
    y: y,
    distance: function (p1) {
      return Math.sqrt(Math.pow(this.x - p1.x, 2) + Math.pow(this.y - p1.y, 2));
    },
    // vector addition in 2d plane
    add: function (p1) {
      return point(this.x + p1.x, this.y + p1.y);
    },
    // vector subtraction in 2d
    // returns p0 - p1
    subtract: function (p1) {
      return point(this.x - p1.x, this.y - p1.y);
    },
    // multiply a 2d point by a scalar
    scalarMult: function (n) {
      return point(this.x * n, this.y * n);
    },
    scalarDivide: function (n) {
      if (n === 0) {
        throw new Error("Division by 0 error");
      }

      return point(this.x / n, this.y / n);
    },
    equals: function (p1) {
      return this.x === p1.x && this.y === p1.y;
    }
  };
};
/**
 * A circle in the 2d plane
 * @param {point} center - center of circle
 * @param {number} radius - radius of circle
 * @returns {object} - point object
 */


var circle = function (center, radius) {
  return {
    center: center,
    radius: radius,
    hasIntersection: function (circle1) {
      var P0 = this.center;
      var P1 = circle1.center;
      var r0 = this.radius;
      var r1 = circle1.radius;
      var d = P0.distance(P1);

      if (d > r0 + r1) {
        return false; // separate circles
      }

      if (d < Math.abs(r0 - r1)) {
        return false; // one circle contains another
      }

      return true;
    },
    equals: function (circle1) {
      var P0 = this.center;
      var P1 = circle1.center;
      var r0 = this.radius;
      var r1 = circle1.radius;
      return r0 === r1 && P0.equals(P1);
    },
    // Source: http://paulbourke.net/geometry/circlesphere/
    // "Intersection of two circles" by Paul Bourke
    // Left-most point is returned as 0th element of array
    // Right-most point is returned as 1st elemennt of array
    intersection: function (circle1) {
      // eslint-disable-line max-statements
      var P0 = this.center;
      var P1 = circle1.center;
      var r0 = this.radius;
      var r1 = circle1.radius;
      var d = P0.distance(P1);

      if (!this.hasIntersection(circle1) || this.equals(circle1)) {
        return [];
      }

      var a = (Math.pow(r0, 2) - Math.pow(r1, 2) + Math.pow(d, 2)) / (2 * d);
      var h = Math.sqrt(Math.pow(r0, 2) - Math.pow(a, 2));
      var P2 = P0.add(P1.subtract(P0).scalarMult(a).scalarDivide(d));
      var x0 = P0.x,
          y0 = P0.y;
      var x1 = P1.x,
          y1 = P1.y;
      var x2 = P2.x,
          y2 = P2.y;
      var P3s = [point(x2 - h * (y1 - y0) / d, y2 + h * (x1 - x0) / d), point(x2 + h * (y1 - y0) / d, y2 - h * (x1 - x0) / d)];
      P3s.sort(function (Point1, Point2) {
        return Point1.x - Point2.x;
      });
      return P3s;
    },
    solveX: function (y) {
      var sqrt = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(y - this.center.y, 2));
      return [this.center.x - sqrt, this.center.x + sqrt];
    },
    solveY: function (x) {
      var sqrt = Math.sqrt(Math.pow(this.radius, 2) - Math.pow(x - this.center.x, 2));
      return [this.center.y - sqrt, this.center.y + sqrt];
    }
  };
};

export { circle, point };