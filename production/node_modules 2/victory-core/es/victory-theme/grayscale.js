import _assign from "lodash/assign";
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

var centeredLabelStyles = _assign({
  textAnchor: "middle"
}, baseLabelStyles); // *
// * Strokes
// *


var strokeLinecap = "round";
var strokeLinejoin = "round";
export default {
  area: _assign({
    style: {
      data: {
        fill: charcoal
      },
      labels: baseLabelStyles
    }
  }, baseProps),
  axis: _assign({
    style: {
      axis: {
        fill: "transparent",
        stroke: charcoal,
        strokeWidth: 1,
        strokeLinecap: strokeLinecap,
        strokeLinejoin: strokeLinejoin
      },
      axisLabel: _assign({}, centeredLabelStyles, {
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
  bar: _assign({
    style: {
      data: {
        fill: charcoal,
        padding: 8,
        strokeWidth: 0
      },
      labels: baseLabelStyles
    }
  }, baseProps),
  boxplot: _assign({
    style: {
      max: {
        padding: 8,
        stroke: charcoal,
        strokeWidth: 1
      },
      maxLabels: _assign({}, baseLabelStyles, {
        padding: 3
      }),
      median: {
        padding: 8,
        stroke: charcoal,
        strokeWidth: 1
      },
      medianLabels: _assign({}, baseLabelStyles, {
        padding: 3
      }),
      min: {
        padding: 8,
        stroke: charcoal,
        strokeWidth: 1
      },
      minLabels: _assign({}, baseLabelStyles, {
        padding: 3
      }),
      q1: {
        padding: 8,
        fill: grey
      },
      q1Labels: _assign({}, baseLabelStyles, {
        padding: 3
      }),
      q3: {
        padding: 8,
        fill: grey
      },
      q3Labels: _assign({}, baseLabelStyles, {
        padding: 3
      })
    },
    boxWidth: 20
  }, baseProps),
  candlestick: _assign({
    style: {
      data: {
        stroke: charcoal,
        strokeWidth: 1
      },
      labels: _assign({}, baseLabelStyles, {
        padding: 5
      })
    },
    candleColors: {
      positive: "#ffffff",
      negative: charcoal
    }
  }, baseProps),
  chart: baseProps,
  errorbar: _assign({
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
  group: _assign({
    colorScale: colors
  }, baseProps),
  histogram: _assign({
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
      title: _assign({}, baseLabelStyles, {
        padding: 5
      })
    }
  },
  line: _assign({
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
      labels: _assign({}, baseLabelStyles, {
        padding: 20
      })
    },
    colorScale: colors,
    width: 400,
    height: 400,
    padding: 50
  },
  scatter: _assign({
    style: {
      data: {
        fill: charcoal,
        stroke: "transparent",
        strokeWidth: 0
      },
      labels: baseLabelStyles
    }
  }, baseProps),
  stack: _assign({
    colorScale: colors
  }, baseProps),
  tooltip: {
    style: _assign({}, baseLabelStyles, {
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
  voronoi: _assign({
    style: {
      data: {
        fill: "transparent",
        stroke: "transparent",
        strokeWidth: 0
      },
      labels: _assign({}, baseLabelStyles, {
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