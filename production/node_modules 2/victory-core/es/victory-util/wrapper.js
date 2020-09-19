import _isPlainObject from "lodash/isPlainObject";
import _values from "lodash/values";
import _uniqBy from "lodash/uniqBy";
import _groupBy from "lodash/groupBy";
import _some from "lodash/some";
import _uniq from "lodash/uniq";
import _isFunction from "lodash/isFunction";
import _flatten from "lodash/flatten";
import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import React from "react";
import Axis from "./axis";
import Style from "./style";
import Transitions from "./transitions";
import Data from "./data";
import Domain from "./domain";
import Events from "./events";
import Collection from "./collection";
import Helpers from "./helpers";
import Scale from "./scale";
import Log from "./log";
export default {
  getData: function (props, childComponents) {
    if (props.data) {
      return Data.getData(props);
    }

    childComponents = childComponents || React.Children.toArray(props.children);
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
    childComponents = childComponents || React.Children.toArray(props.children);
    var propsDomain = Domain.getDomainFromProps(props, axis);
    var domainPadding = this.getDefaultDomainPadding(props, axis, childComponents);
    var domain;

    if (propsDomain) {
      domain = propsDomain;
    } else {
      var minDomain = Domain.getMinFromProps(props, axis);
      var maxDomain = Domain.getMaxFromProps(props, axis);
      var dataset = (props.data || props.y) && Data.getData(props);
      var dataDomain = dataset ? Domain.getDomainFromData(props, axis, dataset) : [];
      var childDomain = this.getDomainFromChildren(props, axis, childComponents);
      var min = minDomain || Collection.getMinValue(_toConsumableArray(dataDomain).concat(_toConsumableArray(childDomain)));
      var max = maxDomain || Collection.getMaxValue(_toConsumableArray(dataDomain).concat(_toConsumableArray(childDomain)));
      domain = Domain.getDomainFromMinMax(min, max);
    }

    return Domain.formatDomain(domain, _assign({
      domainPadding: domainPadding
    }, props), axis);
  },
  getScale: function (props, axis, childComponents) {
    if (props.data) {
      return Scale.getBaseScale(props, axis);
    }

    var children = childComponents ? childComponents.slice(0) : React.Children.toArray(props.children);

    var iteratee = function (child) {
      var sharedProps = _assign({}, child.props, {
        horizontal: props.horizontal
      });

      return Scale.getScaleType(sharedProps, axis);
    };

    var childScale = _uniq(Helpers.reduceChildren(children, iteratee, props)); // default to linear scale if more than one uniq scale type is given by children


    return childScale.length > 1 ? Scale.getScaleFromName("linear") : Scale.getScaleFromName(childScale[0]);
  },
  setAnimationState: function (props, nextProps) {
    if (!props.animate) {
      return;
    }

    if (props.animate.parentState) {
      var nodesWillExit = props.animate.parentState.nodesWillExit;
      var oldProps = nodesWillExit ? props : null;
      this.setState(_defaults({
        oldProps: oldProps,
        nextProps: nextProps
      }, props.animate.parentState));
    } else {
      var oldChildren = React.Children.toArray(props.children);
      var nextChildren = React.Children.toArray(nextProps.children);

      var isContinuous = function (child) {
        var check = function (c) {
          return c.type && c.type.continuous;
        };

        return Array.isArray(child) ? _some(child, check) : check(child);
      };

      var continuous = !props.polar && _some(oldChildren, function (child) {
        return isContinuous(child) || child.props.children && isContinuous(child.props.children);
      });

      var _Transitions$getIniti = Transitions.getInitialTransitionState(oldChildren, nextChildren),
          _nodesWillExit = _Transitions$getIniti.nodesWillExit,
          nodesWillEnter = _Transitions$getIniti.nodesWillEnter,
          childrenTransitions = _Transitions$getIniti.childrenTransitions,
          nodesShouldEnter = _Transitions$getIniti.nodesShouldEnter;

      this.setState({
        nodesWillExit: _nodesWillExit,
        nodesWillEnter: nodesWillEnter,
        nodesShouldEnter: nodesShouldEnter,
        childrenTransitions: Collection.isArrayOfArrays(childrenTransitions) ? childrenTransitions[0] : childrenTransitions,
        oldProps: _nodesWillExit ? props : null,
        nextProps: nextProps,
        continuous: continuous
      });
    }
  },
  getAllEvents: function (props) {
    var components = ["groupComponent", "containerComponent", "labelComponent"];
    this.componentEvents = Events.getComponentEvents(props, components);
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
      childrenTransitions = Collection.isArrayOfArrays(childrenTransitions) ? childrenTransitions[index] : childrenTransitions;
      return _defaults({
        childrenTransitions: childrenTransitions
      }, _this.state);
    };

    var getTransitions = props.animate && props.animate.getTransitions;
    var state = getFilteredState();
    var parentState = props.animate && props.animate.parentState || state;

    if (!getTransitions) {
      var getTransitionProps = Transitions.getTransitionPropsFactory(props, state, function (newState) {
        return _this.setState(newState);
      });

      getTransitions = function (childComponent) {
        return getTransitionProps(childComponent, index);
      };
    }

    return _defaults({
      getTransitions: getTransitions,
      parentState: parentState
    }, props.animate, child.props.animate);
  },
  getDomainFromChildren: function (props, axis, childComponents) {
    // eslint-disable-line max-statements, complexity, max-len
    var children = childComponents ? childComponents.slice(0) : React.Children.toArray(props.children);
    var parentData = props.data ? Data.getData(props, axis) : undefined;
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
    var parentProps = parentData ? _assign(baseParentProps, {
      data: parentData
    }) : baseParentProps;

    var iteratee = function (child) {
      var sharedProps = _assign({}, child.props, parentProps);

      if (!Domain.isDomainComponent(child)) {
        return null;
      } else if (child.type && _isFunction(child.type.getDomain)) {
        return child.props && child.type.getDomain(sharedProps, axis);
      } else {
        return Domain.getDomain(sharedProps, axis);
      }
    };

    var childDomains = Helpers.reduceChildren(children, iteratee, props);
    var min = childDomains.length === 0 ? 0 : Collection.getMinValue(childDomains);
    var max = childDomains.length === 0 ? 1 : Collection.getMaxValue(childDomains);
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
      Log.warn("VictoryHistogram only supports being stacked with other VictoryHistogram components. Check to make sure that you are only passing VictoryHistogram components to VictoryStack");
    } // if we are stacking histograms, we need to generate explicit bins
    // or else each histogram may end up having different bins


    if (!allChildrenAreHistograms) {
      return parentProps;
    }

    var childBins = props.bins || childComponents[0].props.bins; // if we have explicit bins then we don't need to calculate them

    if (!Array.isArray(childBins)) {
      var combinedData = children.reduce(function (memo, child) {
        var xAccessor = Helpers.createAccessor(child.props.x || "x");
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
    var children = childComponents ? childComponents.slice(0) : React.Children.toArray(props.children);
    parentProps = this.addBinsToParentPropsIfHistogram({
      children: children,
      props: props,
      childComponents: childComponents,
      parentProps: parentProps
    });

    var iteratee = function (child, childName, parent) {
      var childProps = _assign({}, child.props, parentProps);

      var childData;

      if (!Data.isDataComponent(child)) {
        return null;
      } else if (child.type && _isFunction(child.type.getData)) {
        child = parent ? React.cloneElement(child, parent.props) : child;
        childData = child.type.getData(childProps);
      } else {
        childData = Data.getData(childProps);
      }

      stack += 1;
      return childData.map(function (datum, index) {
        return _assign({
          _stack: stack,
          _group: index
        }, datum);
      });
    };

    var stacked = children.filter(function (c) {
      return c.type && c.type.role === "stack";
    }).length;

    var combine = function (memo, val) {
      return memo.concat(_uniqBy(val, "_group"));
    };

    var datasets = Helpers.reduceChildren(children, iteratee, props, [], combine);
    var group = stacked ? "_group" : "_stack";
    return _values(_groupBy(datasets, group));
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

    var colors = Array.isArray(colorScale) ? colorScale : Style.getColorScale(colorScale);
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
    return Helpers.getStyles(style, defaultStyle);
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

    var dataStyle = _defaults({}, childStyle.data, _assign({}, dataWidth, style.data, defaultColor));

    var labelsStyle = _defaults({}, childStyle.labels, style.labels);

    return {
      parent: style.parent,
      data: dataStyle,
      labels: labelsStyle
    };
  },
  getStringsFromCategories: function (childComponents, axis) {
    var iteratee = function (child) {
      var childProps = child.props || {};

      if (!Domain.isDomainComponent(child) || !childProps.categories) {
        return null;
      } else {
        var categories = childProps.categories && !Array.isArray(childProps.categories) ? childProps.categories[axis] : childProps.props.categories;
        var categoryStrings = categories && categories.filter(function (val) {
          return typeof val === "string";
        });
        return categoryStrings ? Collection.removeUndefined(categoryStrings) : [];
      }
    };

    return Helpers.reduceChildren(childComponents.slice(0), iteratee);
  },
  getStringsFromData: function (childComponents) {
    var iteratee = function (child) {
      var childProps = child.props || {};
      var data;

      if (!Data.isDataComponent(child)) {
        return null;
      } else if (child.type && _isFunction(child.type.getData)) {
        data = child.type.getData(childProps);
      } else {
        data = Data.getData(childProps);
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

    return Helpers.reduceChildren(childComponents.slice(0), iteratee, {}, initialMemo, combine);
  },
  getCategoryAndAxisStringsFromChildren: function (props, axis, childComponents) {
    var categories = _isPlainObject(props.categories) ? props.categories[axis] : props.categories;
    var axisComponent = Axis.getAxisComponent(childComponents, axis);
    var axisStrings = axisComponent ? Data.getStringsFromAxes(axisComponent.props, axis) : [];
    var categoryStrings = categories || this.getStringsFromCategories(childComponents, axis);
    return _uniq(_flatten(_toConsumableArray(categoryStrings).concat(_toConsumableArray(axisStrings))));
  },
  getStringsFromChildren: function (props, childComponents) {
    childComponents = childComponents || React.Children.toArray(props.children);
    var xStrings = this.getCategoryAndAxisStringsFromChildren(props, "x", childComponents);
    var yStrings = this.getCategoryAndAxisStringsFromChildren(props, "y", childComponents);
    var dataStrings = this.getStringsFromData(childComponents);
    return {
      x: _uniq(_flatten(_toConsumableArray(xStrings).concat(_toConsumableArray(dataStrings.x)))),
      y: _uniq(_flatten(_toConsumableArray(yStrings).concat(_toConsumableArray(dataStrings.y))))
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