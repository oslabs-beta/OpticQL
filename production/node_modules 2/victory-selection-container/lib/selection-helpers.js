"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _includes2 = _interopRequireDefault(require("lodash/includes"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _throttle2 = _interopRequireDefault(require("lodash/throttle"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _victoryCore = require("victory-core");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

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
      var data = _victoryCore.Data.getData(childProps);

      return Array.isArray(data) && data.length > 0 ? data : undefined;
    };

    var iteratee = function (child, childName, parent) {
      var blacklist = props.selectionBlacklist || [];

      if (!_victoryCore.Data.isDataComponent(child) || (0, _includes2.default)(blacklist, childName)) {
        return null;
      } else if (child.type && (0, _isFunction2.default)(child.type.getData)) {
        child = parent ? _react.default.cloneElement(child, parent.props) : child;
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

    return _victoryCore.Helpers.reduceChildren(_react.default.Children.toArray(props.children), iteratee, props);
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
      var scaledPoint = _victoryCore.Helpers.scalePoint(props, d);

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

    var parentSVG = targetProps.parentSVG || _victoryCore.Selection.getParentSVG(evt);

    var _Selection$getSVGEven = _victoryCore.Selection.getSVGEventCoordinates(evt, parentSVG),
        x = _Selection$getSVGEven.x,
        y = _Selection$getSVGEven.y;

    var x1 = polar || dimension !== "y" ? x : _victoryCore.Selection.getDomainCoordinates(targetProps).x[0];
    var y1 = polar || dimension !== "x" ? y : _victoryCore.Selection.getDomainCoordinates(targetProps).y[0];
    var x2 = polar || dimension !== "y" ? x : _victoryCore.Selection.getDomainCoordinates(targetProps).x[1];
    var y2 = polar || dimension !== "x" ? y : _victoryCore.Selection.getDomainCoordinates(targetProps).y[1];
    var mutatedProps = {
      x1: x1,
      y1: y1,
      select: true,
      x2: x2,
      y2: y2,
      parentSVG: parentSVG
    };

    if (selectedData && (0, _isFunction2.default)(targetProps.onSelectionCleared)) {
      targetProps.onSelectionCleared((0, _defaults2.default)({}, mutatedProps, targetProps));
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
      var parentSVG = targetProps.parentSVG || _victoryCore.Selection.getParentSVG(evt);

      var _Selection$getSVGEven2 = _victoryCore.Selection.getSVGEventCoordinates(evt, parentSVG),
          x = _Selection$getSVGEven2.x,
          y = _Selection$getSVGEven2.y;

      var x2 = polar || dimension !== "y" ? x : _victoryCore.Selection.getDomainCoordinates(targetProps).x[1];
      var y2 = polar || dimension !== "x" ? y : _victoryCore.Selection.getDomainCoordinates(targetProps).y[1];
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

    var bounds = _victoryCore.Selection.getBounds(targetProps);

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
    var callbackMutation = selectedData && (0, _isFunction2.default)(targetProps.onSelection) ? targetProps.onSelection(selectedData, bounds, (0, _defaults2.default)({}, mutatedProps, targetProps)) : {};
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
          return (0, _assign2.default)({
            active: true
          }, callbackMutation);
        }
      };
    }) : [];
    return parentMutation.concat(dataMutation);
  }
};

var _default = _objectSpread({}, SelectionHelpers, {
  onMouseDown: SelectionHelpers.onMouseDown.bind(SelectionHelpers),
  onMouseUp: SelectionHelpers.onMouseUp.bind(SelectionHelpers),
  onMouseMove: (0, _throttle2.default)(SelectionHelpers.onMouseMove.bind(SelectionHelpers), 16, // eslint-disable-line no-magic-numbers
  {
    leading: true,
    trailing: false
  })
});

exports.default = _default;