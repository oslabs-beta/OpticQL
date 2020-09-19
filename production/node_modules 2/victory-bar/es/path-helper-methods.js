function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import * as d3Shape from "d3-shape";
import { circle, point } from "./geometry-helper-methods";

var getPosition = function (props, width) {
  var x = props.x,
      x0 = props.x0,
      y = props.y,
      y0 = props.y0,
      horizontal = props.horizontal;
  var alignment = props.alignment || "middle";
  var size = alignment === "middle" ? width / 2 : width;
  var sign = horizontal ? -1 : 1;

  if (horizontal) {
    return {
      x0: x0,
      x1: x,
      y0: alignment === "start" ? y : y - sign * size,
      y1: alignment === "end" ? y : y + sign * size
    };
  }

  return {
    x0: alignment === "start" ? x : x - sign * size,
    x1: alignment === "end" ? x : x + sign * size,
    y0: y0,
    y1: y
  };
};

var getAngle = function (props, index) {
  var data = props.data,
      scale = props.scale;
  var x = data[index]._x1 === undefined ? "_x" : "_x1";
  return scale.x(data[index][x]);
};

var getAngularWidth = function (props, width) {
  var scale = props.scale;
  var range = scale.y.range();
  var r = Math.max.apply(Math, _toConsumableArray(range));
  var angularRange = Math.abs(scale.x.range()[1] - scale.x.range()[0]);
  return width / (2 * Math.PI * r) * angularRange;
};

var transformAngle = function (angle) {
  return -1 * angle + Math.PI / 2;
};

export var getCustomBarPath = function (props, width) {
  var getPath = props.getPath;

  var propsWithCalculatedValues = _objectSpread({}, props, getPosition(props, width));

  return getPath(propsWithCalculatedValues);
};

var getStartAngle = function (props, index) {
  var data = props.data,
      scale = props.scale,
      alignment = props.alignment;
  var currentAngle = getAngle(props, index);
  var angularRange = Math.abs(scale.x.range()[1] - scale.x.range()[0]);
  var previousAngle = index === 0 ? getAngle(props, data.length - 1) - Math.PI * 2 : getAngle(props, index - 1);

  if (index === 0 && angularRange < 2 * Math.PI) {
    return scale.x.range()[0];
  } else if (alignment === "start" || alignment === "end") {
    return alignment === "start" ? previousAngle : currentAngle;
  } else {
    return (currentAngle + previousAngle) / 2;
  }
};

var getEndAngle = function (props, index) {
  var data = props.data,
      scale = props.scale,
      alignment = props.alignment;
  var currentAngle = getAngle(props, index);
  var angularRange = Math.abs(scale.x.range()[1] - scale.x.range()[0]);
  var lastAngle = scale.x.range()[1] === 2 * Math.PI ? getAngle(props, 0) + Math.PI * 2 : scale.x.range()[1];
  var nextAngle = index === data.length - 1 ? getAngle(props, 0) + Math.PI * 2 : getAngle(props, index + 1);

  if (index === data.length - 1 && angularRange < 2 * Math.PI) {
    return lastAngle;
  } else if (alignment === "start" || alignment === "end") {
    return alignment === "start" ? currentAngle : nextAngle;
  } else {
    return (currentAngle + nextAngle) / 2;
  }
};

var mapPointsToPath = function (coords, cornerRadius, direction) {
  var topLeftPath = "".concat(cornerRadius.topLeft, " ").concat(cornerRadius.topLeft, " ").concat(direction);
  var topRightPath = "".concat(cornerRadius.topRight, " ").concat(cornerRadius.topRight, " ").concat(direction);
  var bottomLeftPath = "".concat(cornerRadius.bottomLeft, " ").concat(cornerRadius.bottomLeft, " ").concat(direction);
  var bottomRightPath = "".concat(cornerRadius.bottomRight, " ").concat(cornerRadius.bottomRight, " ").concat(direction);
  var commands = ["M", "A ".concat(bottomLeftPath, ","), "L", "A ".concat(topLeftPath, ","), "L", "A ".concat(topRightPath, ","), "L", "A ".concat(bottomRightPath, ",")];
  var path = commands.reduce(function (acc, command, i) {
    acc += "".concat(command, " ").concat(coords[i].x, ", ").concat(coords[i].y, " \n");
    return acc;
  }, "");
  return "".concat(path, " z");
};

var getVerticalBarPoints = function (position, sign, cr) {
  var x0 = position.x0,
      x1 = position.x1,
      y0 = position.y0,
      y1 = position.y1; // eslint-disable-next-line max-statements, max-len

  var getHalfPoints = function (side) {
    var isLeft = side === "Left";
    var signL = isLeft ? 1 : -1;
    var x = isLeft ? x0 : x1;
    var bottomPoint = {
      x: x + signL * cr["bottom".concat(side)],
      y: y0
    };
    var bottomMiddlePoint = {
      x: x,
      y: y0 - sign * cr["bottom".concat(side)]
    };
    var topMiddlePoint = {
      x: x,
      y: y1 + sign * cr["top".concat(side)]
    };
    var topPoint = {
      x: x + signL * cr["top".concat(side)],
      y: y1
    };
    var hasIntersection = sign === 1 ? y0 - cr["bottom".concat(side)] < y1 + cr["top".concat(side)] : y0 + cr["bottom".concat(side)] > y1 - cr["top".concat(side)];

    if (hasIntersection) {
      var topCenter = point(x + signL * cr["top".concat(side)], y1 + sign * cr["top".concat(side)]);
      var topCircle = circle(topCenter, cr["top".concat(side)]);
      var bottomCenter = point(x + signL * cr["bottom".concat(side)], y0 - sign * cr["bottom".concat(side)]);
      var bottomCircle = circle(bottomCenter, cr["bottom".concat(side)]);
      var circleIntersection = topCircle.intersection(bottomCircle);
      var hasArcIntersection = circleIntersection.length > 0;

      if (hasArcIntersection) {
        var arcIntersection = circleIntersection[isLeft ? 0 : 1];
        bottomMiddlePoint = {
          x: arcIntersection.x,
          y: arcIntersection.y
        };
        topMiddlePoint = {
          x: arcIntersection.x,
          y: arcIntersection.y
        };
      } else {
        var hasBottomLineTopArcIntersection = cr["top".concat(side)] > cr["bottom".concat(side)];

        if (hasBottomLineTopArcIntersection) {
          var newX = topCircle.solveX(y0)[isLeft ? 0 : 1];
          bottomPoint = {
            x: newX,
            y: y0
          };
          bottomMiddlePoint = {
            x: newX,
            y: y0
          };
          topMiddlePoint = {
            x: newX,
            y: y0
          };
        } else {
          var _newX = bottomCircle.solveX(y1)[isLeft ? 0 : 1];
          bottomMiddlePoint = {
            x: _newX,
            y: y1
          };
          topMiddlePoint = {
            x: _newX,
            y: y1
          };
          topPoint = {
            x: _newX,
            y: y1
          };
        }
      }
    }

    var points = [bottomPoint, bottomMiddlePoint, topMiddlePoint, topPoint];
    return isLeft ? points : points.reverse();
  };

  return getHalfPoints("Left").concat(getHalfPoints("Right"));
};

var getHorizontalBarPoints = function (position, sign, cr) {
  var y0 = position.y0,
      y1 = position.y1;
  var x0 = position.x0 < position.x1 ? position.x0 : position.x1;
  var x1 = position.x0 < position.x1 ? position.x1 : position.x0; // eslint-disable-next-line max-statements, max-len

  var getHalfPoints = function (side) {
    var isTop = side === "top";
    var signL = isTop ? -1 : 1;
    var y = isTop ? y1 : y0;
    var leftPoint = {
      x: x0,
      y: y - signL * cr["".concat(side, "Left")]
    };
    var leftMiddlePoint = {
      x: x0 + cr["".concat(side, "Left")],
      y: y
    };
    var rightMiddlePoint = {
      x: x1 - cr["".concat(side, "Right")],
      y: y
    };
    var rightPoint = {
      x: x1,
      y: y - signL * cr["".concat(side, "Right")]
    };
    var hasIntersection = leftMiddlePoint.x > rightMiddlePoint.x;

    if (hasIntersection) {
      var leftCenter = point(x0 + cr["".concat(side, "Left")], y - signL * cr["".concat(side, "Left")]);
      var leftCircle = circle(leftCenter, cr["".concat(side, "Left")]);
      var rightCenter = point(x1 - cr["".concat(side, "Right")], y - signL * cr["".concat(side, "Right")]);
      var rightCircle = circle(rightCenter, cr["".concat(side, "Right")]);
      var circleIntersection = leftCircle.intersection(rightCircle);
      var hasArcIntersection = circleIntersection.length > 0;

      if (hasArcIntersection) {
        var arcIntersection = circleIntersection[sign > 0 ? 1 : 0];
        leftMiddlePoint = {
          x: arcIntersection.x,
          y: arcIntersection.y
        };
        rightMiddlePoint = {
          x: arcIntersection.x,
          y: arcIntersection.y
        };
      } else {
        var hasLeftLineRightArcIntersection = cr["".concat(side, "Right")] > cr["".concat(side, "Left")];

        if (hasLeftLineRightArcIntersection) {
          var newY = rightCircle.solveY(x0)[isTop ? 0 : 1];
          leftPoint = {
            x: x0,
            y: newY
          };
          leftMiddlePoint = {
            x: x0,
            y: newY
          };
          rightMiddlePoint = {
            x: x0,
            y: newY
          };
        } else {
          var _newY = leftCircle.solveY(x1)[isTop ? 0 : 1];
          rightPoint = {
            x: x1,
            y: _newY
          };
          rightMiddlePoint = {
            x: x1,
            y: _newY
          };
          leftMiddlePoint = {
            x: x1,
            y: _newY
          };
        }
      }
    }

    return [leftPoint, leftMiddlePoint, rightMiddlePoint, rightPoint];
  };

  var topPoints = getHalfPoints("top");
  var bottomPoints = getHalfPoints("bottom"); // eslint-disable-next-line no-magic-numbers

  return [bottomPoints[1], bottomPoints[0]].concat(_toConsumableArray(topPoints), [bottomPoints[3], bottomPoints[2]]);
}; // eslint-disable-next-line max-params


export var getVerticalBarPath = function (props, width, cornerRadius) {
  var position = getPosition(props, width);
  var sign = position.y0 > position.y1 ? 1 : -1;
  var direction = sign > 0 ? "0 0 1" : "0 0 0";
  var points = getVerticalBarPoints(position, sign, cornerRadius);
  return mapPointsToPath(points, cornerRadius, direction);
}; // eslint-disable-next-line max-params

export var getHorizontalBarPath = function (props, width, cornerRadius) {
  var position = getPosition(props, width);
  var sign = position.x0 < position.x1 ? 1 : -1;
  var direction = "0 0 1";
  var cr = {
    topRight: sign > 0 ? cornerRadius.topLeft : cornerRadius.bottomLeft,
    bottomRight: sign > 0 ? cornerRadius.topRight : cornerRadius.bottomRight,
    bottomLeft: sign > 0 ? cornerRadius.bottomRight : cornerRadius.topRight,
    topLeft: sign > 0 ? cornerRadius.bottomLeft : cornerRadius.topLeft
  };
  var points = getHorizontalBarPoints(position, sign, cr);
  return mapPointsToPath(points, cr, direction);
};
export var getVerticalPolarBarPath = function (props, cornerRadius) {
  var datum = props.datum,
      scale = props.scale,
      index = props.index,
      alignment = props.alignment,
      style = props.style;
  var r1 = scale.y(datum._y0 || 0);
  var r2 = scale.y(datum._y1 !== undefined ? datum._y1 : datum._y);
  var currentAngle = scale.x(datum._x1 !== undefined ? datum._x1 : datum._x);
  var start;
  var end;

  if (style.width) {
    var width = getAngularWidth(props, style.width);
    var size = alignment === "middle" ? width / 2 : width;
    start = alignment === "start" ? currentAngle : currentAngle - size;
    end = alignment === "end" ? currentAngle : currentAngle + size;
  } else {
    start = getStartAngle(props, index);
    end = getEndAngle(props, index);
  }

  var getPath = function (edge) {
    var pathFunction = d3Shape.arc().innerRadius(r1).outerRadius(r2).startAngle(transformAngle(start)).endAngle(transformAngle(end)).cornerRadius(cornerRadius[edge]);
    return pathFunction();
  };

  var getPathData = function (edge) {
    var rightPath = getPath("".concat(edge, "Right"));
    var rightMoves = rightPath.match(/[A-Z]/g);
    var rightCoords = rightPath.split(/[A-Z]/).slice(1);
    var rightMiddle = rightMoves.indexOf("L");
    var leftPath = getPath("".concat(edge, "Left"));
    var leftMoves = leftPath.match(/[A-Z]/g);
    var leftCoords = leftPath.split(/[A-Z]/).slice(1);
    var leftMiddle = leftMoves.indexOf("L");
    return {
      rightMoves: rightMoves,
      rightCoords: rightCoords,
      rightMiddle: rightMiddle,
      leftMoves: leftMoves,
      leftCoords: leftCoords,
      leftMiddle: leftMiddle
    };
  }; // eslint-disable-next-line max-statements


  var getTopPath = function () {
    var topRight = cornerRadius.topRight,
        topLeft = cornerRadius.topLeft;
    var arcLength = r2 * Math.abs(end - start);

    var _getPathData = getPathData("top"),
        rightMoves = _getPathData.rightMoves,
        rightCoords = _getPathData.rightCoords,
        rightMiddle = _getPathData.rightMiddle,
        leftMoves = _getPathData.leftMoves,
        leftCoords = _getPathData.leftCoords,
        leftMiddle = _getPathData.leftMiddle;

    var moves;
    var coords;

    if (topRight === topLeft || arcLength < 2 * topRight + 2 * topLeft) {
      moves = topRight > topLeft ? rightMoves : leftMoves;
      coords = topRight > topLeft ? rightCoords : leftCoords;
    } else {
      // eslint-disable-next-line no-magic-numbers
      var isShort = function (middle) {
        return middle < 3;
      };

      var rightOffset = topLeft > topRight && isShort(rightMiddle) ? 1 : 2;
      var leftOffset;

      if (topRight > topLeft) {
        var defaultOffset = isShort(rightMiddle) ? leftMiddle : leftMiddle - 2;
        leftOffset = isShort(leftMiddle) ? leftMiddle - 1 : defaultOffset;
      } else {
        var _defaultOffset = isShort(leftMiddle) ? 1 : 2;

        leftOffset = isShort(rightMiddle) ? _defaultOffset : leftMiddle - 2;
      }

      moves = _toConsumableArray(rightMoves.slice(0, rightOffset)).concat(_toConsumableArray(leftMoves.slice(leftOffset)));
      coords = _toConsumableArray(rightCoords.slice(0, rightOffset)).concat(_toConsumableArray(leftCoords.slice(leftOffset)));
    }

    var middle = moves.indexOf("L");
    var subMoves = moves.slice(0, middle);
    var subCoords = coords.slice(0, middle);
    return subMoves.map(function (m, i) {
      return {
        command: m,
        coords: subCoords[i].split(",")
      };
    });
  }; // eslint-disable-next-line max-statements


  var getBottomPath = function () {
    var bottomRight = cornerRadius.bottomRight,
        bottomLeft = cornerRadius.bottomLeft;
    var arcLength = r1 * Math.abs(end - start);

    var _getPathData2 = getPathData("bottom"),
        rightMoves = _getPathData2.rightMoves,
        rightCoords = _getPathData2.rightCoords,
        rightMiddle = _getPathData2.rightMiddle,
        leftMoves = _getPathData2.leftMoves,
        leftCoords = _getPathData2.leftCoords,
        leftMiddle = _getPathData2.leftMiddle;

    var moves;
    var coords;

    if (bottomRight === bottomLeft || arcLength < 2 * bottomRight + 2 * bottomLeft) {
      moves = bottomRight > bottomLeft ? rightMoves : leftMoves;
      coords = bottomRight > bottomLeft ? rightCoords : leftCoords;
    } else {
      // eslint-disable-next-line no-magic-numbers
      var isShort = function (m, middle) {
        return m.length - middle < 4;
      };

      var shortPath = bottomRight > bottomLeft ? isShort(rightMoves, rightMiddle) : isShort(leftMoves, leftMiddle); // eslint-disable-next-line no-magic-numbers

      var rightOffset = shortPath ? -1 : -3;
      moves = _toConsumableArray(leftMoves.slice(0, leftMiddle + 2)).concat(_toConsumableArray(rightMoves.slice(rightOffset)));
      coords = _toConsumableArray(leftCoords.slice(0, leftMiddle + 2)).concat(_toConsumableArray(rightCoords.slice(rightOffset)));
    }

    var middle = moves.indexOf("L");
    var subMoves = moves.slice(middle, -1);
    var subCoords = coords.slice(middle, -1);
    return subMoves.map(function (m, i) {
      return {
        command: m,
        coords: subCoords[i].split(",")
      };
    });
  };

  var topPath = getTopPath();
  var bottomPath = getBottomPath();

  var moves = _toConsumableArray(topPath).concat(_toConsumableArray(bottomPath));

  var path = moves.reduce(function (memo, move) {
    memo += "".concat(move.command, " ").concat(move.coords.join());
    return memo;
  }, "");
  return "".concat(path, " z");
};