"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isPlainObject2 = _interopRequireDefault(require("lodash/isPlainObject"));

var _values2 = _interopRequireDefault(require("lodash/values"));

var _uniqBy2 = _interopRequireDefault(require("lodash/uniqBy"));

var _groupBy2 = _interopRequireDefault(require("lodash/groupBy"));

var _some2 = _interopRequireDefault(require("lodash/some"));

var _uniq2 = _interopRequireDefault(require("lodash/uniq"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _flatten2 = _interopRequireDefault(require("lodash/flatten"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _react = _interopRequireDefault(require("react"));

var _axis = _interopRequireDefault(require("./axis"));

var _style = _interopRequireDefault(require("./style"));

var _transitions = _interopRequireDefault(require("./transitions"));

var _data = _interopRequireDefault(require("./data"));

var _domain = _interopRequireDefault(require("./domain"));

var _events = _interopRequireDefault(require("./events"));

var _collection = _interopRequireDefault(require("./collection"));

var _helpers = _interopRequireDefault(require("./helpers"));

var _scale = _interopRequireDefault(require("./scale"));

var _log = _interopRequireDefault(require("./log"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _default = {
  getData: function (props, childComponents) {
    if (props.data) {
      return _data.default.getData(props);
    }

    childComponents = childComponents || _react.default.Children.toArray(props.children);
    return this.getDataFromChildren(childComponents);
  },
  getDefaultDomainPadding: function (props, axis, childComponents) {
    if (props.polar || axis !== "x") {
      return undefined;
    }

    var groupComponent = childComponents.filter(function (child) {
      return child.type && child.type.role && child.type.role === "group";
    });

    if (groupComponent.length < 1) {
      return undefined;
    }

    var _groupComponent$0$pro = groupComponent[0].props,
        offset = _groupComponent$0$pro.offset,
        children = _groupComponent$0$pro.children;
    return {
      x: offset * children.length / 2
    };
  },
  getDomain: function (props, axis, childComponents) {
    childComponents = childComponents || _react.default.Children.toArray(props.children);

    var propsDomain = _domain.default.getDomainFromProps(props, axis);

    var domainPadding = this.getDefaultDomainPadding(props, axis, childComponents);
    var domain;

    if (propsDomain) {
      domain = propsDomain;
    } else {
      var minDomain = _domain.default.getMinFromProps(props, axis);

      var maxDomain = _domain.default.getMaxFromProps(props, axis);

      var dataset = (props.data || props.y) && _data.default.getData(props);

      var dataDomain = dataset ? _domain.default.getDomainFromData(props, axis, dataset) : [];
      var childDomain = this.getDomainFromChildren(props, axis, childComponents);

      var min = minDomain || _collection.default.getMinValue(_toConsumableArray(dataDomain).concat(_toConsumableArray(childDomain)));

      var max = maxDomain || _collection.default.getMaxValue(_toConsumableArray(dataDomain).concat(_toConsumableArray(childDomain)));

      domain = _domain.default.getDomainFromMinMax(min, max);
    }

    return _domain.default.formatDomain(domain, (0, _assign2.default)({
      domainPadding: domainPadding
    }, props), axis);
  },
  getScale: function (props, axis, childComponents) {
    if (props.data) {
      return _scale.default.getBaseScale(props, axis);
    }

    var children = childComponents ? childComponents.slice(0) : _react.default.Children.toArray(props.children);

    var iteratee = function (child) {
      var sharedProps = (0, _assign2.default)({}, child.props, {
        horizontal: props.horizontal
      });
      return _scale.default.getScaleType(sharedProps, axis);
    };

    var childScale = (0, _uniq2.default)(_helpers.default.reduceChildren(children, iteratee, props)); // default to linear scale if more than one uniq scale type is given by children

    return childScale.length > 1 ? _scale.default.getScaleFromName("linear") : _scale.default.getScaleFromName(childScale[0]);
  },
  setAnimationState: function (props, nextProps) {
    if (!props.animate) {
      return;
    }

    if (props.animate.parentState) {
      var nodesWillExit = props.animate.parentState.nodesWillExit;
      var oldProps = nodesWillExit ? props : null;
      this.setState((0, _defaults2.default)({
        oldProps: oldProps,
        nextProps: nextProps
      }, props.animate.parentState));
    } else {
      var oldChildren = _react.default.Children.toArray(props.children);

      var nextChildren = _react.default.Children.toArray(nextProps.children);

      var isContinuous = function (child) {
        var check = function (c) {
          return c.type && c.type.continuous;
        };

        return Array.isArray(child) ? (0, _some2.default)(child, check) : check(child);
      };

      var continuous = !props.polar && (0, _some2.default)(oldChildren, function (child) {
        return isContinuous(child) || child.props.children && isContinuous(child.props.children);
      });

      var _Transitions$getIniti = _transitions.default.getInitialTransitionState(oldChildren, nextChildren),
          _nodesWillExit = _Transitions$getIniti.nodesWillExit,
          nodesWillEnter = _Transitions$getIniti.nodesWillEnter,
          childrenTransitions = _Transitions$getIniti.childrenTransitions,
          nodesShouldEnter = _Transitions$getIniti.nodesShouldEnter;

      this.setState({
        nodesWillExit: _nodesWillExit,
        nodesWillEnter: nodesWillEnter,
        nodesShouldEnter: nodesShouldEnter,
        childrenTransitions: _collection.default.isArrayOfArrays(childrenTransitions) ? childrenTransitions[0] : childrenTransitions,
        oldProps: _nodesWillExit ? props : null,
        nextProps: nextProps,
        continuous: continuous
      });
    }
  },
  getAllEvents: function (props) {
    var components = ["groupComponent", "containerComponent", "labelComponent"];
    this.componentEvents = _events.default.getComponentEvents(props, components);
    var events = props.events;

    if (Array.isArray(this.componentEvents)) {
      var _componentEvents;

      events = Array.isArray(props.events) ? (_componentEvents = this.componentEvents).concat.apply(_componentEvents, _toConsumableArray(props.events)) : this.componentEvents;
    }

    return events || [];
  },
  getAnimationProps: function (props, child, index) {
    var _this = this;

    if (!props.animate) {
      return child.props.animate;
    }

    var getFilteredState = function () {
      var childrenTransitions = _this.state && _this.state.childrenTransitions;
      childrenTransitions = _collection.default.isArrayOfArrays(childrenTransitions) ? childrenTransitions[index] : childrenTransitions;
      return (0, _defaults2.default)({
        childrenTransitions: childrenTransitions
      }, _this.state);
    };

    var getTransitions = props.animate && props.animate.getTransitions;
    var state = getFilteredState();
    var parentState = props.animate && props.animate.parentState || state;

    if (!getTransitions) {
      var getTransitionProps = _transitions.default.getTransitionPropsFactory(props, state, function (newState) {
        return _this.setState(newState);
      });

      getTransitions = function (childComponent) {
        return getTransitionProps(childComponent, index);
      };
    }

    return (0, _defaults2.default)({
      getTransitions: getTransitions,
      parentState: parentState
    }, props.animate, child.props.animate);
  },
  getDomainFromChildren: function (props, axis, childComponents) {
    // eslint-disable-line max-statements, complexity, max-len
    var children = childComponents ? childComponents.slice(0) : _react.default.Children.toArray(props.children);
    var parentData = props.data ? _data.default.getData(props, axis) : undefined;
    var polar = props.polar,
        startAngle = props.startAngle,
        endAngle = props.endAngle,
        categories = props.categories,
        minDomain = props.minDomain,
        maxDomain = props.maxDomain,
        horizontal = props.horizontal;
    var baseParentProps = {
      horizontal: horizontal,
      polar: polar,
      startAngle: startAngle,
      endAngle: endAngle,
      minDomain: minDomain,
      maxDomain: maxDomain,
      categories: categories
    };
    var parentProps = parentData ? (0, _assign2.default)(baseParentProps, {
      data: parentData
    }) : baseParentProps;

    var iteratee = function (child) {
      var sharedProps = (0, _assign2.default)({}, child.props, parentProps);

      if (!_domain.default.isDomainComponent(child)) {
        return null;
      } else if (child.type && (0, _isFunction2.default)(child.type.getDomain)) {
        return child.props && child.type.getDomain(sharedProps, axis);
      } else {
        return _domain.default.getDomain(sharedProps, axis);
      }
    };

    var childDomains = _helpers.default.reduceChildren(children, iteratee, props);

    var min = childDomains.length === 0 ? 0 : _collection.default.getMinValue(childDomains);
    var max = childDomains.length === 0 ? 1 : _collection.default.getMaxValue(childDomains);
    return [min, max];
  },
  addBinsToParentPropsIfHistogram: function (_ref) {
    var children = _ref.children,
        props = _ref.props,
        childComponents = _ref.childComponents,
        parentProps = _ref.parentProps;
    var someChildrenAreHistograms = children.some(function (child) {
      return child.type && child.type.role === "histogram";
    });
    var allChildrenAreHistograms = someChildrenAreHistograms && children.length && children.every(function (child) {
      return child.type && child.type.role === "histogram";
    });

    if (someChildrenAreHistograms && !allChildrenAreHistograms) {
      _log.default.warn("VictoryHistogram only supports being stacked with other VictoryHistogram components. Check to make sure that you are only passing VictoryHistogram components to VictoryStack");
    } // if we are stacking histograms, we need to generate explicit bins
    // or else each histogram may end up having different bins


    if (!allChildrenAreHistograms) {
      return parentProps;
    }

    var childBins = props.bins || childComponents[0].props.bins; // if we have explicit bins then we don't need to calculate them

    if (!Array.isArray(childBins)) {
      var combinedData = children.reduce(function (memo, child) {
        var xAccessor = _helpers.default.createAccessor(child.props.x || "x");

        return memo.concat(child.props.data.map(function (datum) {
          return {
            x: xAccessor(datum)
          };
        }));
      }, []); // use the same function to generate bins as VictoryHistogram but with
      // the combined data from above, then get explicit bins from that

      var getFormattedHistogramData = children[0].type.getFormattedData;
      childBins = getFormattedHistogramData({
        data: combinedData,
        bins: childBins
      }).reduce(function (memo, _ref2, index) {
        var x0 = _ref2.x0,
            x1 = _ref2.x1;
        return index === 0 ? memo.concat([x0, x1]) : memo.concat(x1);
      }, []);
    }

    return _objectSpread({}, parentProps, {
      bins: childBins
    });
  },
  getDataFromChildren: function (props, childComponents) {
    var polar = props.polar,
        startAngle = props.startAngle,
        endAngle = props.endAngle,
        categories = props.categories,
        minDomain = props.minDomain,
        maxDomain = props.maxDomain;
    var parentProps = {
      polar: polar,
      startAngle: startAngle,
      endAngle: endAngle,
      categories: categories,
      minDomain: minDomain,
      maxDomain: maxDomain
    };
    var stack = 0;
    var children = childComponents ? childComponents.slice(0) : _react.default.Children.toArray(props.children);
    parentProps = this.addBinsToParentPropsIfHistogram({
      children: children,
      props: props,
      childComponents: childComponents,
      parentProps: parentProps
    });

    var iteratee = function (child, childName, parent) {
      var childProps = (0, _assign2.default)({}, child.props, parentProps);
      var childData;

      if (!_data.default.isDataComponent(child)) {
        return null;
      } else if (child.type && (0, _isFunction2.default)(child.type.getData)) {
        child = parent ? _react.default.cloneElement(child, parent.props) : child;
        childData = child.type.getData(childProps);
      } else {
        childData = _data.default.getData(childProps);
      }

      stack += 1;
      return childData.map(function (datum, index) {
        return (0, _assign2.default)({
          _stack: stack,
          _group: index
        }, datum);
      });
    };

    var stacked = children.filter(function (c) {
      return c.type && c.type.role === "stack";
    }).length;

    var combine = function (memo, val) {
      return memo.concat((0, _uniqBy2.default)(val, "_group"));
    };

    var datasets = _helpers.default.reduceChildren(children, iteratee, props, [], combine);

    var group = stacked ? "_group" : "_stack";
    return (0, _values2.default)((0, _groupBy2.default)(datasets, group));
  },
  getColor: function (calculatedProps, child, index) {
    // check for styles first
    var style = calculatedProps.style;
    var colorScale = calculatedProps.colorScale,
        color = calculatedProps.color;

    if (style && style.data && style.data.fill) {
      return style.data.fill;
    }

    colorScale = child.props && child.props.colorScale ? child.props.colorScale : colorScale;
    color = child.props && child.props.color ? child.props.color : color;

    if (!colorScale && !color) {
      return undefined;
    }

    var colors = Array.isArray(colorScale) ? colorScale : _style.default.getColorScale(colorScale);
    return color || colors[index % colors.length];
  },
  getWidth: function (props) {
    var datasets = props.datasets,
        scale = props.scale,
        horizontal = props.horizontal;
    var range = horizontal ? scale.y.range() : scale.x.range();
    var extent = Math.abs(range[1] - range[0]);
    var seriesLength = Array.isArray(datasets[0]) ? datasets[0].length : 1;
    var bars = datasets.length * seriesLength + 2;
    var barRatio = 0.5;
    return {
      width: Math.round(barRatio * extent / bars)
    };
  },
  getStyle: function (theme, style, role) {
    var defaultStyle = theme && theme[role] && theme[role].style ? theme[role].style : {};
    return _helpers.default.getStyles(style, defaultStyle);
  },
  getChildStyle: function (child, index, calculatedProps) {
    var style = calculatedProps.style,
        role = calculatedProps.role;
    var childStyle = child.props.style || {};

    if (Array.isArray(childStyle)) {
      return childStyle;
    }

    var childRole = child.type && child.type.role;
    var defaultFill = childRole === "stack" ? undefined : this.getColor(calculatedProps, child, index);
    var defaultColor = childRole === "line" ? {
      fill: "none",
      stroke: defaultFill
    } : {
      fill: defaultFill
    };
    var dataWidth = role === "stack" ? {} : this.getWidth(calculatedProps);
    var dataStyle = (0, _defaults2.default)({}, childStyle.data, (0, _assign2.default)({}, dataWidth, style.data, defaultColor));
    var labelsStyle = (0, _defaults2.default)({}, childStyle.labels, style.labels);
    return {
      parent: style.parent,
      data: dataStyle,
      labels: labelsStyle
    };
  },
  getStringsFromCategories: function (childComponents, axis) {
    var iteratee = function (child) {
      var childProps = child.props || {};

      if (!_domain.default.isDomainComponent(child) || !childProps.categories) {
        return null;
      } else {
        var categories = childProps.categories && !Array.isArray(childProps.categories) ? childProps.categories[axis] : childProps.props.categories;
        var categoryStrings = categories && categories.filter(function (val) {
          return typeof val === "string";
        });
        return categoryStrings ? _collection.default.removeUndefined(categoryStrings) : [];
      }
    };

    return _helpers.default.reduceChildren(childComponents.slice(0), iteratee);
  },
  getStringsFromData: function (childComponents) {
    var iteratee = function (child) {
      var childProps = child.props || {};
      var data;

      if (!_data.default.isDataComponent(child)) {
        return null;
      } else if (child.type && (0, _isFunction2.default)(child.type.getData)) {
        data = child.type.getData(childProps);
      } else {
        data = _data.default.getData(childProps);
      }

      return data.map(function (d) {
        return {
          x: d.xName,
          y: d.yName
        };
      });
    };

    var initialMemo = {
      x: [],
      y: []
    };

    var combine = function (memo, datum) {
      var x = Array.isArray(datum) ? datum.map(function (d) {
        return d.x;
      }).filter(Boolean) : datum.x;
      var y = Array.isArray(datum) ? datum.map(function (d) {
        return d.y;
      }).filter(Boolean) : datum.y;
      return {
        x: x !== undefined ? memo.x.concat(x) : memo.x,
        y: y !== undefined ? memo.y.concat(y) : memo.y
      };
    };

    return _helpers.default.reduceChildren(childComponents.slice(0), iteratee, {}, initialMemo, combine);
  },
  getCategoryAndAxisStringsFromChildren: function (props, axis, childComponents) {
    var categories = (0, _isPlainObject2.default)(props.categories) ? props.categories[axis] : props.categories;

    var axisComponent = _axis.default.getAxisComponent(childComponents, axis);

    var axisStrings = axisComponent ? _data.default.getStringsFromAxes(axisComponent.props, axis) : [];
    var categoryStrings = categories || this.getStringsFromCategories(childComponents, axis);
    return (0, _uniq2.default)((0, _flatten2.default)(_toConsumableArray(categoryStrings).concat(_toConsumableArray(axisStrings))));
  },
  getStringsFromChildren: function (props, childComponents) {
    childComponents = childComponents || _react.default.Children.toArray(props.children);
    var xStrings = this.getCategoryAndAxisStringsFromChildren(props, "x", childComponents);
    var yStrings = this.getCategoryAndAxisStringsFromChildren(props, "y", childComponents);
    var dataStrings = this.getStringsFromData(childComponents);
    return {
      x: (0, _uniq2.default)((0, _flatten2.default)(_toConsumableArray(xStrings).concat(_toConsumableArray(dataStrings.x)))),
      y: (0, _uniq2.default)((0, _flatten2.default)(_toConsumableArray(yStrings).concat(_toConsumableArray(dataStrings.y))))
    };
  },
  getCategories: function (props, childComponents, allStrings) {
    var xPropCategories = props.categories && !Array.isArray(props.categories) ? props.categories.x : props.categories;
    var yPropCategories = props.categories && !Array.isArray(props.categories) ? props.categories.y : props.categories;
    var fallbackRequired = !xPropCategories || !yPropCategories;
    var fallbackProps = fallbackRequired ? allStrings || this.getStringsFromChildren(props, childComponents) : {};
    var xCategories = xPropCategories || fallbackProps.x;
    var yCategories = yPropCategories || fallbackProps.y;
    return {
      x: xCategories.length > 0 ? xCategories : undefined,
      y: yCategories.length > 0 ? yCategories : undefined
    };
  }
};
exports.default = _default;