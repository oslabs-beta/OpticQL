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
var yellow200 = "#FFF59D";
var deepOrange600 = "#F4511E";
var lime300 = "#DCE775";
var lightGreen500 = "#8BC34A";
var teal700 = "#00796B";
var cyan900 = "#006064";
var colors = [deepOrange600, yellow200, lime300, lightGreen500, teal700, cyan900];
var blueGrey50 = "#ECEFF1";
var blueGrey300 = "#90A4AE";
var blueGrey700 = "#455A64";
var grey900 = "#212121"; // *
// * Typography
// *

var sansSerif = "'Helvetica Neue', 'Helvetica', sans-serif";
var letterSpacing = "normal";
var fontSize = 12; // *
// * Layout
// *

var padding = 8;
var baseProps = {
  width: 350,
  height: 350,
  padding: 50
}; // *
// * Labels
// *

var baseLabelStyles = {
  fontFamily: sansSerif,
  fontSize: fontSize,
  letterSpacing: letterSpacing,
  padding: padding,
  fill: blueGrey700,
  stroke: "transparent",
  strokeWidth: 0
};
var centeredLabelStyles = (0, _assign2.default)({
  textAnchor: "middle"
}, baseLabelStyles); // *
// * Strokes
// *

var strokeDasharray = "10, 5";
var strokeLinecap = "round";
var strokeLinejoin = "round";
var _default = {
  area: (0, _assign2.default)({
    style: {
      data: {
        fill: grey900
      },
      labels: baseLabelStyles
    }
  }, baseProps),
  axis: (0, _assign2.default)({
    style: {
      axis: {
        fill: "transparent",
        stroke: blueGrey300,
        strokeWidth: 2,
        strokeLinecap: strokeLinecap,
        strokeLinejoin: strokeLinejoin
      },
      axisLabel: (0, _assign2.default)({}, centeredLabelStyles, {
        padding: padding,
        stroke: "transparent"
      }),
      grid: {
        fill: "none",
        stroke: blueGrey50,
        strokeDasharray: strokeDasharray,
        strokeLinecap: strokeLinecap,
        strokeLinejoin: strokeLinejoin,
        pointerEvents: "painted"
      },
      ticks: {
        fill: "transparent",
        size: 5,
        stroke: blueGrey300,
        strokeWidth: 1,
        strokeLinecap: strokeLinecap,
        strokeLinejoin: strokeLinejoin
      },
      tickLabels: (0, _assign2.default)({}, baseLabelStyles, {
        fill: blueGrey700
      })
    }
  }, baseProps),
  polarDependentAxis: (0, _assign2.default)({
    style: {
      ticks: {
        fill: "transparent",
        size: 1,
        stroke: "transparent"
      }
    }
  }),
  bar: (0, _assign2.default)({
    style: {
      data: {
        fill: blueGrey700,
        padding: padding,
        strokeWidth: 0
      },
      labels: baseLabelStyles
    }
  }, baseProps),
  boxplot: (0, _assign2.default)({
    style: {
      max: {
        padding: padding,
        stroke: blueGrey700,
        strokeWidth: 1
      },
      maxLabels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 3
      }),
      median: {
        padding: padding,
        stroke: blueGrey700,
        strokeWidth: 1
      },
      medianLabels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 3
      }),
      min: {
        padding: padding,
        stroke: blueGrey700,
        strokeWidth: 1
      },
      minLabels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 3
      }),
      q1: {
        padding: padding,
        fill: blueGrey700
      },
      q1Labels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 3
      }),
      q3: {
        padding: padding,
        fill: blueGrey700
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
        stroke: blueGrey700
      },
      labels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 5
      })
    },
    candleColors: {
      positive: "#ffffff",
      negative: blueGrey700
    }
  }, baseProps),
  chart: baseProps,
  errorbar: (0, _assign2.default)({
    borderWidth: 8,
    style: {
      data: {
        fill: "transparent",
        opacity: 1,
        stroke: blueGrey700,
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
        fill: blueGrey700,
        stroke: grey900,
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
        opacity: 1,
        stroke: blueGrey700,
        strokeWidth: 2
      },
      labels: baseLabelStyles
    }
  }, baseProps),
  pie: (0, _assign2.default)({
    colorScale: colors,
    style: {
      data: {
        padding: padding,
        stroke: blueGrey50,
        strokeWidth: 1
      },
      labels: (0, _assign2.default)({}, baseLabelStyles, {
        padding: 20
      })
    }
  }, baseProps),
  scatter: (0, _assign2.default)({
    style: {
      data: {
        fill: blueGrey700,
        opacity: 1,
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
      stroke: grey900,
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
        stroke: grey900,
        strokeWidth: 1,
        fill: "#f0f0f0",
        pointerEvents: "none"
      }
    }
  }, baseProps)
};
exports.default = _default;