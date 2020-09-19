"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assign2 = _interopRequireDefault(require("lodash/assign"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// *
// * Colors
// *
var colors = ["#252525", "#525252", "#737373", "#969696", "#bdbdbd", "#d9d9d9", "#f0f0f0"];
var charcoal = "#252525";
var grey = "#969696"; // *
// * Typography
// *

var sansSerif = "'Gill Sans', 'Seravek', 'Trebuchet MS', sans-serif";
var letterSpacing = "normal";
var fontSize = 14; // *
// * Layout
// *

var baseProps = {
  width: 450,
  height: 300,
  padding: 50,
  colorScale: colors
}; // *
// * Labels
// *

var baseLabelStyles = {
  fontFamily: sansSerif,
  fontSize: fontSize,
  letterSpacing: letterSpacing,
  padding: 10,
  fill: charcoal,
  stroke: "transparent"
};
var centeredLabelStyles = (0, _assign2.default)({
  textAnchor: "middle"
}, baseLabelStyles); // *
// * Strokes
// *

var strokeLinecap = "round";
var strokeLinejoin = "round";
var _default = {
  area: (0, _assign2.default)({
    style: {
      data: {
        fill: charcoal
      },
      labels: baseLabelStyles
    }
  }, baseProps),
  axis: (0, _assign2.default)({
    style: {
      axis: {
        fill: "transparent",
        stroke: charcoal,
        strokeWidth: 1,
        strokeLinecap: strokeLinecap,
        strokeLinejoin: strokeLinejoin
      },
      axisLabel: (0, _assign2.default)({}, centeredLabelStyles, {
        padding: 25
      }),
      grid: {
        fill: "none",
        stroke: "none",
        pointerEvents: "painted"
      },
      ticks: {
        fill: "transparent",
        size: 1,
        stroke: "transparent"
      },
      tickLabels: baseLabelStyles
    }
  }, baseProps),
  bar: (0, _assign2.default)({
    style: {
      data: {
        fill: charcoal,
        padding: 8,
        strokeWidth: 0
      },
      labels: baseLabelStyles
    }
  }, baseProps),
  boxplot: (0, _assign2.default)({
    style: {
      max: {
        padding: 8,
        stroke: charcoal,
        strokeWidth: 1
      },
      maxLabels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 3
      }),
      median: {
        padding: 8,
        stroke: charcoal,
        strokeWidth: 1
      },
      medianLabels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 3
      }),
      min: {
        padding: 8,
        stroke: charcoal,
        strokeWidth: 1
      },
      minLabels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 3
      }),
      q1: {
        padding: 8,
        fill: grey
      },
      q1Labels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 3
      }),
      q3: {
        padding: 8,
        fill: grey
      },
      q3Labels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 3
      })
    },
    boxWidth: 20
  }, baseProps),
  candlestick: (0, _assign2.default)({
    style: {
      data: {
        stroke: charcoal,
        strokeWidth: 1
      },
      labels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 5
      })
    },
    candleColors: {
      positive: "#ffffff",
      negative: charcoal
    }
  }, baseProps),
  chart: baseProps,
  errorbar: (0, _assign2.default)({
    borderWidth: 8,
    style: {
      data: {
        fill: "transparent",
        stroke: charcoal,
        strokeWidth: 2
      },
      labels: baseLabelStyles
    }
  }, baseProps),
  group: (0, _assign2.default)({
    colorScale: colors
  }, baseProps),
  histogram: (0, _assign2.default)({
    style: {
      data: {
        fill: grey,
        stroke: charcoal,
        strokeWidth: 2
      },
      labels: baseLabelStyles
    }
  }, baseProps),
  legend: {
    colorScale: colors,
    gutter: 10,
    orientation: "vertical",
    titleOrientation: "top",
    style: {
      data: {
        type: "circle"
      },
      labels: baseLabelStyles,
      title: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 5
      })
    }
  },
  line: (0, _assign2.default)({
    style: {
      data: {
        fill: "transparent",
        stroke: charcoal,
        strokeWidth: 2
      },
      labels: baseLabelStyles
    }
  }, baseProps),
  pie: {
    style: {
      data: {
        padding: 10,
        stroke: "transparent",
        strokeWidth: 1
      },
      labels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 20
      })
    },
    colorScale: colors,
    width: 400,
    height: 400,
    padding: 50
  },
  scatter: (0, _assign2.default)({
    style: {
      data: {
        fill: charcoal,
        stroke: "transparent",
        strokeWidth: 0
      },
      labels: baseLabelStyles
    }
  }, baseProps),
  stack: (0, _assign2.default)({
    colorScale: colors
  }, baseProps),
  tooltip: {
    style: (0, _assign2.default)({}, baseLabelStyles, {
      padding: 0,
      pointerEvents: "none"
    }),
    flyoutStyle: {
      stroke: charcoal,
      strokeWidth: 1,
      fill: "#f0f0f0",
      pointerEvents: "none"
    },
    flyoutPadding: 5,
    cornerRadius: 5,
    pointerLength: 10
  },
  voronoi: (0, _assign2.default)({
    style: {
      data: {
        fill: "transparent",
        stroke: "transparent",
        strokeWidth: 0
      },
      labels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 5,
        pointerEvents: "none"
      }),
      flyout: {
        stroke: charcoal,
        strokeWidth: 1,
        fill: "#f0f0f0",
        pointerEvents: "none"
      }
    }
  }, baseProps)
};
exports.default = _default;