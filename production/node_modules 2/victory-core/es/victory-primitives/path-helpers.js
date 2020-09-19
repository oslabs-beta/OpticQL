import _range from "lodash/range";
export default {
  circle: function (x, y, size) {
    return "M ".concat(x, ", ").concat(y, "\n      m ").concat(-size, ", 0\n      a ").concat(size, ", ").concat(size, " 0 1,0 ").concat(size * 2, ",0\n      a ").concat(size, ", ").concat(size, " 0 1,0 ").concat(-size * 2, ",0");
  },
  square: function (x, y, size) {
    var baseSize = 0.87 * size; // eslint-disable-line no-magic-numbers

    var x0 = x - baseSize;
    var y1 = y + baseSize;
    var distance = x + baseSize - x0;
    return "M ".concat(x0, ", ").concat(y1, "\n      h").concat(distance, "\n      v-").concat(distance, "\n      h-").concat(distance, "\n      z");
  },
  diamond: function (x, y, size) {
    var baseSize = 0.87 * size; // eslint-disable-line no-magic-numbers

    var length = Math.sqrt(2 * (baseSize * baseSize));
    return "M ".concat(x, ", ").concat(y + length, "\n      l ").concat(length, ", -").concat(length, "\n      l -").concat(length, ", -").concat(length, "\n      l -").concat(length, ", ").concat(length, "\n      l ").concat(length, ", ").concat(length, "\n      z");
  },
  triangleDown: function (x, y, size) {
    var height = size / 2 * Math.sqrt(3);
    var x0 = x - size;
    var x1 = x + size;
    var y0 = y - size;
    var y1 = y + height;
    return "M ".concat(x0, ", ").concat(y0, "\n      L ").concat(x1, ", ").concat(y0, "\n      L ").concat(x, ", ").concat(y1, "\n      z");
  },
  triangleUp: function (x, y, size) {
    var height = size / 2 * Math.sqrt(3);
    var x0 = x - size;
    var x1 = x + size;
    var y0 = y - height;
    var y1 = y + size;
    return "M ".concat(x0, ", ").concat(y1, "\n      L ").concat(x1, ", ").concat(y1, "\n      L ").concat(x, ", ").concat(y0, "\n      z");
  },
  plus: function (x, y, size) {
    var baseSize = 1.1 * size; // eslint-disable-line no-magic-numbers

    var distance = baseSize / 1.5; // eslint-disable-line no-magic-numbers

    return "\n      M ".concat(x - distance / 2, ", ").concat(y + baseSize, "\n      v-").concat(distance, "\n      h-").concat(distance, "\n      v-").concat(distance, "\n      h").concat(distance, "\n      v-").concat(distance, "\n      h").concat(distance, "\n      v").concat(distance, "\n      h").concat(distance, "\n      v").concat(distance, "\n      h-").concat(distance, "\n      v").concat(distance, "\n      z");
  },
  minus: function (x, y, size) {
    var baseSize = 1.1 * size; // eslint-disable-line no-magic-numbers

    var lineHeight = baseSize - baseSize * 0.3; // eslint-disable-line no-magic-numbers

    var x0 = x - baseSize;
    var y1 = y + lineHeight / 2;
    var distance = x + baseSize - x0;
    return "M ".concat(x0, ", ").concat(y1, "\n      h").concat(distance, "\n      v-").concat(lineHeight, "\n      h-").concat(distance, "\n      z");
  },
  star: function (x, y, size) {
    var baseSize = 1.35 * size; // eslint-disable-line no-magic-numbers

    var angle = Math.PI / 5; // eslint-disable-line no-magic-numbers
    // eslint-disable-next-line no-magic-numbers

    var starCoords = _range(10).map(function (index) {
      var length = index % 2 === 0 ? baseSize : baseSize / 2;
      return "".concat(length * Math.sin(angle * (index + 1)) + x, ",\n        ").concat(length * Math.cos(angle * (index + 1)) + y);
    });

    return "M ".concat(starCoords.join("L"), " z");
  }
};