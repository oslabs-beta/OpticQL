import _includes from "lodash/includes";
import _isFunction from "lodash/isFunction";
import _throttle from "lodash/throttle";
import _defaults from "lodash/defaults";
import _assign from "lodash/assign";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

import { Selection, Data, Helpers } from "victory-core";
import React from "react";
var SelectionHelpers = {
  getDimension: function (props) {
    var horizontal = props.horizontal,
        selectionDimension = props.selectionDimension;

    if (!horizontal || !selectionDimension) {
      return selectionDimension;
    }

    return selectionDimension === "x" ? "y" : "x";
  },
  getDatasets: function (props) {
    if (props.data) {
      return [{
        data: props.data
      }];
    }

    var getData = function (childProps) {
      var data = Data.getData(childProps);
      return Array.isArray(data) && data.length > 0 ? data : undefined;
    };

    var iteratee = function (child, childName, parent) {
      var blacklist = props.selectionBlacklist || [];

      if (!Data.isDataComponent(child) || _includes(blacklist, childName)) {
        return null;
      } else if (child.type && _isFunction(child.type.getData)) {
        child = parent ? React.cloneElement(child, parent.props) : child;
        var childData = child.props && child.type.getData(child.props);
        return childData ? {
          childName: childName,
          data: childData
        } : null;
      } else {
        var _childData = getData(child.props);

        return _childData ? {
          childName: childName,
          data: _childData
        } : null;
      }
    };

    return Helpers.reduceChildren(React.Children.toArray(props.children), iteratee, props);
  },
  filterDatasets: function (props, datasets, bounds) {
    var _this = this;

    var filtered = datasets.reduce(function (memo, dataset) {
      var selectedData = _this.getSelectedData(props, dataset.data, bounds);

      memo = selectedData ? memo.concat({
        childName: dataset.childName,
        eventKey: selectedData.eventKey,
        data: selectedData.data
      }) : memo;
      return memo;
    }, []);
    return filtered.length ? filtered : null;
  },
  getSelectedData: function (props, dataset) {
    var x1 = props.x1,
        y1 = props.y1,
        x2 = props.x2,
        y2 = props.y2;

    var withinBounds = function (d) {
      var scaledPoint = Helpers.scalePoint(props, d);
      return scaledPoint.x >= Math.min(x1, x2) && scaledPoint.x <= Math.max(x1, x2) && scaledPoint.y >= Math.min(y1, y2) && scaledPoint.y <= Math.max(y1, y2);
    };

    var eventKey = [];
    var data = [];
    var count = 0;

    for (var index = 0, len = dataset.length; index < len; index++) {
      var datum = dataset[index];

      if (withinBounds(datum)) {
        data[count] = datum;
        eventKey[count] = datum.eventKey === undefined ? index : datum.eventKey;
        count++;
      }
    }

    return count > 0 ? {
      eventKey: eventKey,
      data: data
    } : null;
  },
  // eslint-disable-next-line complexity, max-statements
  onMouseDown: function (evt, targetProps) {
    evt.preventDefault();
    var activateSelectedData = targetProps.activateSelectedData,
        allowSelection = targetProps.allowSelection,
        polar = targetProps.polar,
        selectedData = targetProps.selectedData;

    if (!allowSelection) {
      return {};
    }

    var dimension = this.getDimension(targetProps);
    var parentSVG = targetProps.parentSVG || Selection.getParentSVG(evt);

    var _Selection$getSVGEven = Selection.getSVGEventCoordinates(evt, parentSVG),
        x = _Selection$getSVGEven.x,
        y = _Selection$getSVGEven.y;

    var x1 = polar || dimension !== "y" ? x : Selection.getDomainCoordinates(targetProps).x[0];
    var y1 = polar || dimension !== "x" ? y : Selection.getDomainCoordinates(targetProps).y[0];
    var x2 = polar || dimension !== "y" ? x : Selection.getDomainCoordinates(targetProps).x[1];
    var y2 = polar || dimension !== "x" ? y : Selection.getDomainCoordinates(targetProps).y[1];
    var mutatedProps = {
      x1: x1,
      y1: y1,
      select: true,
      x2: x2,
      y2: y2,
      parentSVG: parentSVG
    };

    if (selectedData && _isFunction(targetProps.onSelectionCleared)) {
      targetProps.onSelectionCleared(_defaults({}, mutatedProps, targetProps));
    }

    var parentMutation = [{
      target: "parent",
      mutation: function () {
        return mutatedProps;
      }
    }];
    var dataMutation = selectedData && activateSelectedData ? selectedData.map(function (d) {
      return {
        childName: d.childName,
        eventKey: d.eventKey,
        target: "data",
        mutation: function () {
          return null;
        }
      };
    }) : [];
    return parentMutation.concat.apply(parentMutation, _toConsumableArray(dataMutation));
  },
  onMouseMove: function (evt, targetProps) {
    var allowSelection = targetProps.allowSelection,
        select = targetProps.select,
        polar = targetProps.polar;
    var dimension = this.getDimension(targetProps);

    if (!allowSelection || !select) {
      return null;
    } else {
      var parentSVG = targetProps.parentSVG || Selection.getParentSVG(evt);

      var _Selection$getSVGEven2 = Selection.getSVGEventCoordinates(evt, parentSVG),
          x = _Selection$getSVGEven2.x,
          y = _Selection$getSVGEven2.y;

      var x2 = polar || dimension !== "y" ? x : Selection.getDomainCoordinates(targetProps).x[1];
      var y2 = polar || dimension !== "x" ? y : Selection.getDomainCoordinates(targetProps).y[1];
      return {
        target: "parent",
        mutation: function () {
          return {
            x2: x2,
            y2: y2,
            parentSVG: parentSVG
          };
        }
      };
    }
  },
  onMouseUp: function (evt, targetProps) {
    var activateSelectedData = targetProps.activateSelectedData,
        allowSelection = targetProps.allowSelection,
        x2 = targetProps.x2,
        y2 = targetProps.y2;

    if (!allowSelection) {
      return null;
    }

    if (!x2 || !y2) {
      return [{
        target: "parent",
        mutation: function () {
          return {
            select: false,
            x1: null,
            x2: null,
            y1: null,
            y2: null
          };
        }
      }];
    }

    var datasets = this.getDatasets(targetProps);
    var bounds = Selection.getBounds(targetProps);
    var selectedData = this.filterDatasets(targetProps, datasets, bounds);
    var mutatedProps = {
      selectedData: selectedData,
      datasets: datasets,
      select: false,
      x1: null,
      x2: null,
      y1: null,
      y2: null
    };
    var callbackMutation = selectedData && _isFunction(targetProps.onSelection) ? targetProps.onSelection(selectedData, bounds, _defaults({}, mutatedProps, targetProps)) : {};
    var parentMutation = [{
      target: "parent",
      mutation: function () {
        return mutatedProps;
      }
    }];
    var dataMutation = selectedData && activateSelectedData ? selectedData.map(function (d) {
      return {
        childName: d.childName,
        eventKey: d.eventKey,
        target: "data",
        mutation: function () {
          return _assign({
            active: true
          }, callbackMutation);
        }
      };
    }) : [];
    return parentMutation.concat(dataMutation);
  }
};
export default _objectSpread({}, SelectionHelpers, {
  onMouseDown: SelectionHelpers.onMouseDown.bind(SelectionHelpers),
  onMouseUp: SelectionHelpers.onMouseUp.bind(SelectionHelpers),
  onMouseMove: _throttle(SelectionHelpers.onMouseMove.bind(SelectionHelpers), 16, // eslint-disable-line no-magic-numbers
  {
    leading: true,
    trailing: false
  })
});