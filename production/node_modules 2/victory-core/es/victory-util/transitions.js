import _identity from "lodash/identity";
import _defaults from "lodash/defaults";
import _assign from "lodash/assign";
import React from "react";

function getDatumKey(datum, idx) {
  return (datum.key || idx).toString();
}

function getKeyedData(data) {
  return data.reduce(function (keyedData, datum, idx) {
    var key = getDatumKey(datum, idx);
    keyedData[key] = datum;
    return keyedData;
  }, {});
}

function getKeyedDataDifference(a, b) {
  var hasDifference = false;
  var difference = Object.keys(a).reduce(function (_difference, key) {
    if (!(key in b)) {
      hasDifference = true;
      _difference[key] = true;
    }

    return _difference;
  }, {});
  return hasDifference && difference;
}
/**
 * Calculate which data-points exist in oldData and not nextData -
 * these are the `exiting` data-points.  Also calculate which
 * data-points exist in nextData and not oldData - these are the
 * `entering` data-points.
 *
 * @param  {Array} oldData   this.props.data Array
 * @param  {Array} nextData  this.props.data Array
 *
 * @return {Object}          Object with `entering` and `exiting` properties.
 *                           entering[datum.key] will be true if the data is
 *                           entering, and similarly for `exiting`.
 */


function getNodeTransitions(oldData, nextData) {
  var oldDataKeyed = oldData && getKeyedData(oldData);
  var nextDataKeyed = nextData && getKeyedData(nextData);
  return {
    entering: oldDataKeyed && getKeyedDataDifference(nextDataKeyed, oldDataKeyed),
    exiting: nextDataKeyed && getKeyedDataDifference(oldDataKeyed, nextDataKeyed)
  };
}

function getChildData(child) {
  if (child.type && child.type.getData) {
    return child.type.getData(child.props);
  }

  return child.props && child.props.data || false;
}
/**
 * If a parent component has animation enabled, calculate the transitions
 * for any data of any child component that supports data transitions
 * Data transitions are defined as any two datasets where data nodes exist
 * in the first set and not the second, in the second and not the first,
 * or both.
 *
 * @param  {Children}  oldChildren   this.props.children from old props
 * @param  {Children}  nextChildren  this.props.children from next props
 *
 * @return {Object}                  Object with the following properties:
 *                                    - nodesWillExit
 *                                    - nodesWillEnter
 *                                    - childrenTransitions
 *                                    - nodesShouldEnter
 */


function getInitialTransitionState(oldChildren, nextChildren) {
  var nodesWillExit = false;
  var nodesWillEnter = false;

  var getTransition = function (oldChild, newChild) {
    if (!newChild || oldChild.type !== newChild.type) {
      return {};
    }

    var _ref = getNodeTransitions(getChildData(oldChild), getChildData(newChild)) || {},
        entering = _ref.entering,
        exiting = _ref.exiting;

    nodesWillExit = nodesWillExit || !!exiting;
    nodesWillEnter = nodesWillEnter || !!entering;
    return {
      entering: entering || false,
      exiting: exiting || false
    };
  };

  var getTransitionsFromChildren = function (old, next) {
    return old.map(function (child, idx) {
      if (child && child.props && child.props.children && next[idx]) {
        return getTransitionsFromChildren(React.Children.toArray(old[idx].props.children), React.Children.toArray(next[idx].props.children));
      } // get Transition entering and exiting nodes


      return getTransition(child, next[idx]);
    });
  };

  var childrenTransitions = getTransitionsFromChildren(React.Children.toArray(oldChildren), React.Children.toArray(nextChildren));
  return {
    nodesWillExit: nodesWillExit,
    nodesWillEnter: nodesWillEnter,
    childrenTransitions: childrenTransitions,
    // TODO: This may need to be refactored for the following situation.
    //       The component receives new props, and the data provided
    //       is a perfect match for the previous data and domain except
    //       for new nodes. In this case, we wouldn't want a delay before
    //       the new nodes appear.
    nodesShouldEnter: false
  };
}

function getInitialChildProps(animate, data) {
  var after = animate.onEnter && animate.onEnter.after ? animate.onEnter.after : _identity;
  return {
    data: data.map(function (datum, idx) {
      return _assign({}, datum, after(datum, idx, data));
    })
  };
} // eslint-disable-next-line max-params


function getChildBeforeLoad(animate, child, data, cb) {
  animate = _assign({}, animate, {
    onEnd: cb
  });

  if (animate && animate.onLoad && !animate.onLoad.duration) {
    return {
      animate: animate,
      data: data
    };
  }

  var before = animate.onLoad && animate.onLoad.before ? animate.onLoad.before : _identity; // If nodes need to exit, transform them with the provided onLoad.before function.

  data = data.map(function (datum, idx) {
    return _assign({}, datum, before(datum, idx, data));
  });
  return {
    animate: animate,
    data: data,
    clipWidth: 0
  };
} // eslint-disable-next-line max-params


function getChildOnLoad(animate, data, cb) {
  animate = _assign({}, animate, {
    onEnd: cb
  });

  if (animate && animate.onLoad && !animate.onLoad.duration) {
    return {
      animate: animate,
      data: data
    };
  }

  var after = animate.onLoad && animate.onLoad.after ? animate.onLoad.after : _identity; // If nodes need to exit, transform them with the provided onLoad.after function.

  data = data.map(function (datum, idx) {
    return _assign({}, datum, after(datum, idx, data));
  });
  return {
    animate: animate,
    data: data
  };
} // eslint-disable-next-line max-params, max-len


function getChildPropsOnExit(animate, child, data, exitingNodes, cb) {
  // Whether or not _this_ child has exiting nodes, we want the exit-
  // transition for all children to have the same duration, delay, etc.
  var onExit = animate && animate.onExit;
  animate = _assign({}, animate, onExit);

  if (exitingNodes) {
    // After the exit transition occurs, trigger the animations for
    // nodes that are neither exiting or entering.
    animate.onEnd = cb;
    var before = animate.onExit && animate.onExit.before ? animate.onExit.before : _identity; // If nodes need to exit, transform them with the provided onExit.before function.

    data = data.map(function (datum, idx) {
      var key = (datum.key || idx).toString();
      return exitingNodes[key] ? _assign({}, datum, before(datum, idx, data)) : datum;
    });
  }

  return {
    animate: animate,
    data: data
  };
} // eslint-disable-next-line max-params,max-len


function getChildPropsBeforeEnter(animate, child, data, enteringNodes, cb) {
  if (enteringNodes) {
    // Perform a normal animation here, except - when it finishes - trigger
    // the transition for entering nodes.
    animate = _assign({}, animate, {
      onEnd: cb
    });
    var before = animate.onEnter && animate.onEnter.before ? animate.onEnter.before : _identity; // We want the entering nodes to be included in the transition target
    // domain.  However, we may not want these nodes to be displayed initially,
    // so perform the `onEnter.before` transformation on each node.

    data = data.map(function (datum, idx) {
      var key = (datum.key || idx).toString();
      return enteringNodes[key] ? _assign({}, datum, before(datum, idx, data)) : datum;
    });
  }

  return {
    animate: animate,
    data: data
  };
} // eslint-disable-next-line max-params, max-len


function getChildPropsOnEnter(animate, data, enteringNodes, cb) {
  // Whether or not _this_ child has entering nodes, we want the entering-
  // transition for all children to have the same duration, delay, etc.
  var onEnter = animate && animate.onEnter;
  animate = _assign({}, animate, onEnter);

  if (enteringNodes) {
    // Old nodes have been transitioned to their new values, and the
    // domain should encompass the nodes that will now enter. So perform
    // the `onEnter.after` transformation on each node.
    animate.onEnd = cb;
    var after = animate.onEnter && animate.onEnter.after ? animate.onEnter.after : _identity;
    data = data.map(function (datum, idx) {
      var key = getDatumKey(datum, idx);
      return enteringNodes[key] ? _assign({}, datum, after(datum, idx, data)) : datum;
    });
  }

  return {
    animate: animate,
    data: data
  };
}
/**
 * getTransitionPropsFactory - putting the Java in JavaScript.  This will return a
 * function that returns prop transformations for a child, given that child's props
 * and its index in the parent's children array.
 *
 * In particular, this will include an `animate` object that is set appropriately
 * so that each child will be synchoronized for each stage of a transition
 * animation.  It will also include a transformed `data` object, where each datum
 * is transformed by `animate.onExit` and `animate.onEnter` `before` and `after`
 * functions.
 *
 * @param  {Object}  props       `this.props` for the parent component.
 * @param  {Object} state        `this.state` for the parent component.
 * @param  {Function} setState    Function that, when called, will `this.setState` on
 *                                 the parent component with the provided object.
 *
 * @return {Function}              Child-prop transformation function.
 */


function getTransitionPropsFactory(props, state, setState) {
  var nodesWillExit = state && state.nodesWillExit;
  var nodesWillEnter = state && state.nodesWillEnter;
  var nodesShouldEnter = state && state.nodesShouldEnter;
  var nodesShouldLoad = state && state.nodesShouldLoad;
  var nodesDoneLoad = state && state.nodesDoneLoad;
  var childrenTransitions = state && state.childrenTransitions || [];
  var transitionDurations = {
    enter: props.animate && props.animate.onEnter && props.animate.onEnter.duration,
    exit: props.animate && props.animate.onExit && props.animate.onExit.duration,
    load: props.animate && props.animate.onLoad && props.animate.onLoad.duration,
    move: props.animate && props.animate.duration
  };

  var onLoad = function (child, data, animate) {
    if (nodesShouldLoad) {
      return getChildOnLoad(animate, data, function () {
        setState({
          nodesShouldLoad: false,
          nodesDoneLoad: true
        });
      });
    }

    return getChildBeforeLoad(animate, child, data, function () {
      setState({
        nodesDoneLoad: true
      });
    });
  }; // eslint-disable-next-line max-params


  var onExit = function (nodes, child, data, animate) {
    return getChildPropsOnExit(animate, child, data, nodes, function () {
      setState({
        nodesWillExit: false
      });
    });
  }; // eslint-disable-next-line max-params


  var onEnter = function (nodes, child, data, animate) {
    if (nodesShouldEnter) {
      return getChildPropsOnEnter(animate, data, nodes, function () {
        setState({
          nodesWillEnter: false
        });
      });
    }

    return getChildPropsBeforeEnter(animate, child, data, nodes, function () {
      setState({
        nodesShouldEnter: true
      });
    });
  };

  var getChildTransitionDuration = function (child, type) {
    var animate = child.props.animate;

    if (!child.type) {
      return {};
    }

    var defaultTransitions = child.props && child.props.polar ? child.type.defaultPolarTransitions || child.type.defaultTransitions : child.type.defaultTransitions;

    if (defaultTransitions) {
      var animationDuration = animate[type] && animate[type].duration;
      return animationDuration !== undefined ? animationDuration : defaultTransitions[type] && defaultTransitions[type].duration;
    } else {
      return {};
    }
  }; // eslint-disable-next-line max-statements, complexity, max-len


  return function getTransitionProps(child, index) {
    var data = getChildData(child) || [];

    var animate = _defaults({}, props.animate, child.props.animate);

    var defaultTransitions = child.props.polar ? child.type.defaultPolarTransitions || child.type.defaultTransitions : child.type.defaultTransitions;
    animate.onExit = _defaults({}, animate.onExit, defaultTransitions && defaultTransitions.onExit);
    animate.onEnter = _defaults({}, animate.onEnter, defaultTransitions && defaultTransitions.onEnter);
    animate.onLoad = _defaults({}, animate.onLoad, defaultTransitions && defaultTransitions.onLoad);
    var childTransitions = childrenTransitions[index] || childrenTransitions[0];

    if (!nodesDoneLoad) {
      // should do onLoad animation
      var load = transitionDurations.load !== undefined ? transitionDurations.load : getChildTransitionDuration(child, "onLoad");
      var animation = {
        duration: load
      };
      return onLoad(child, data, _assign({}, animate, animation));
    } else if (nodesWillExit) {
      var exitingNodes = childTransitions && childTransitions.exiting;
      var exit = transitionDurations.exit !== undefined ? transitionDurations.exit : getChildTransitionDuration(child, "onExit"); // if nodesWillExit, but this child has no exiting nodes, set a delay instead of a duration

      var _animation = exitingNodes ? {
        duration: exit
      } : {
        delay: exit
      };

      return onExit(exitingNodes, child, data, _assign({}, animate, _animation));
    } else if (nodesWillEnter) {
      var enteringNodes = childTransitions && childTransitions.entering;
      var enter = transitionDurations.enter !== undefined ? transitionDurations.enter : getChildTransitionDuration(child, "onEnter");
      var move = transitionDurations.move !== undefined ? transitionDurations.move : child.props.animate && child.props.animate.duration;
      var _animation2 = {
        duration: nodesShouldEnter && enteringNodes ? enter : move
      };
      return onEnter(enteringNodes, child, data, _assign({}, animate, _animation2));
    } else if (!state && animate && animate.onExit) {
      // This is the initial render, and nodes may enter when props change. Because
      // animation interpolation is determined by old- and next- props, data may need
      // to be augmented with certain properties.
      //
      // For example, it may be desired that exiting nodes go from `opacity: 1` to
      // `opacity: 0`. Without setting this on a per-datum basis, the interpolation
      // might go from `opacity: undefined` to `opacity: 0`, which would result in
      // interpolated `opacity: NaN` values.
      //
      return getInitialChildProps(animate, data);
    }

    return {
      animate: animate,
      data: data
    };
  };
}

export default {
  getInitialTransitionState: getInitialTransitionState,
  getTransitionPropsFactory: getTransitionPropsFactory
};