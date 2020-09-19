"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mapValues5 = _interopRequireDefault(require("lodash/mapValues"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _isFunction2 = _interopRequireDefault(require("lodash/isFunction"));

var _throttle2 = _interopRequireDefault(require("lodash/throttle"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _victoryCore = require("victory-core");

var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var Helpers = {
  getDimension: function (props) {
    var horizontal = props.horizontal,
        brushDimension = props.brushDimension;

    if (!horizontal || !brushDimension) {
      return brushDimension;
    }

    return brushDimension === "x" ? "y" : "x";
  },
  withinBounds: function (point, bounds, padding) {
    var _mapValues2 = (0, _mapValues5.default)(bounds, Number),
        x1 = _mapValues2.x1,
        x2 = _mapValues2.x2,
        y1 = _mapValues2.y1,
        y2 = _mapValues2.y2;

    var _mapValues3 = (0, _mapValues5.default)(point, Number),
        x = _mapValues3.x,
        y = _mapValues3.y;

    padding = padding ? padding / 2 : 0;
    return x + padding >= Math.min(x1, x2) && x - padding <= Math.max(x1, x2) && y + padding >= Math.min(y1, y2) && y - padding <= Math.max(y1, y2);
  },
  getDomainBox: function (props, fullDomain, selectedDomain) {
    var brushDimension = this.getDimension(props);
    fullDomain = (0, _defaults2.default)({}, fullDomain, props.domain);
    selectedDomain = (0, _defaults2.default)({}, selectedDomain, fullDomain);

    var fullCoords = _victoryCore.Selection.getDomainCoordinates(props, fullDomain);

    var selectedCoords = _victoryCore.Selection.getDomainCoordinates(props, selectedDomain);

    return {
      x1: brushDimension !== "y" ? Math.min.apply(Math, _toConsumableArray(selectedCoords.x)) : Math.min.apply(Math, _toConsumableArray(fullCoords.x)),
      x2: brushDimension !== "y" ? Math.max.apply(Math, _toConsumableArray(selectedCoords.x)) : Math.max.apply(Math, _toConsumableArray(fullCoords.x)),
      y1: brushDimension !== "x" ? Math.min.apply(Math, _toConsumableArray(selectedCoords.y)) : Math.min.apply(Math, _toConsumableArray(fullCoords.y)),
      y2: brushDimension !== "x" ? Math.max.apply(Math, _toConsumableArray(selectedCoords.y)) : Math.max.apply(Math, _toConsumableArray(fullCoords.y))
    };
  },
  getHandles: function (props, domainBox) {
    var brushDimension = this.getDimension(props);
    var x1 = domainBox.x1,
        x2 = domainBox.x2,
        y1 = domainBox.y1,
        y2 = domainBox.y2;
    var minX = Math.min(x1, x2);
    var maxX = Math.max(x1, x2);
    var minY = Math.min(y1, y2);
    var maxY = Math.max(y1, y2);
    var handleWidth = props.handleWidth / 2;
    return {
      left: brushDimension !== "y" && {
        x1: minX - handleWidth,
        x2: minX + handleWidth,
        y1: y1,
        y2: y2
      },
      right: brushDimension !== "y" && {
        x1: maxX - handleWidth,
        x2: maxX + handleWidth,
        y1: y1,
        y2: y2
      },
      top: brushDimension !== "x" && {
        x1: x1,
        x2: x2,
        y1: minY - handleWidth,
        y2: minY + handleWidth
      },
      bottom: brushDimension !== "x" && {
        x1: x1,
        x2: x2,
        y1: maxY - handleWidth,
        y2: maxY + handleWidth
      }
    };
  },
  getActiveHandles: function (point, props, domainBox) {
    var _this = this;

    var handles = this.getHandles(props, domainBox);
    var activeHandles = ["top", "bottom", "left", "right"].reduce(function (memo, opt) {
      memo = handles[opt] && _this.withinBounds(point, handles[opt]) ? memo.concat(opt) : memo;
      return memo;
    }, []);
    return activeHandles.length && activeHandles;
  },
  getResizeMutation: function (box, handles) {
    var x1 = box.x1,
        y1 = box.y1,
        x2 = box.x2,
        y2 = box.y2;
    var mutations = {
      left: {
        x1: Math.max(x1, x2),
        x2: Math.min(x1, x2),
        y1: y1,
        y2: y2
      },
      right: {
        x1: Math.min(x1, x2),
        x2: Math.max(x1, x2),
        y1: y1,
        y2: y2
      },
      top: {
        y1: Math.max(y1, y2),
        y2: Math.min(y1, y2),
        x1: x1,
        x2: x2
      },
      bottom: {
        y1: Math.min(y1, y2),
        y2: Math.max(y1, y2),
        x1: x1,
        x2: x2
      }
    };
    return handles.reduce(function (memo, current) {
      return (0, _assign2.default)(memo, mutations[current]);
    }, {});
  },
  getMinimumDomain: function () {
    return {
      x: [0, 1 / Number.MAX_SAFE_INTEGER],
      y: [0, 1 / Number.MAX_SAFE_INTEGER]
    };
  },
  getDefaultBrushArea: function (targetProps, cachedDomain, evt) {
    var defaultBrushArea = targetProps.defaultBrushArea,
        domain = targetProps.domain,
        fullDomain = targetProps.fullDomain,
        scale = targetProps.scale,
        horizontal = targetProps.horizontal;

    if (defaultBrushArea === "none") {
      return this.getMinimumDomain();
    } else if (defaultBrushArea === "disable") {
      return cachedDomain;
    } else if (defaultBrushArea === "move") {
      var brushBox = this.getDomainBox(targetProps, fullDomain, cachedDomain);

      var parentSVG = targetProps.parentSVG || _victoryCore.Selection.getParentSVG(evt);

      var pannedBox = this.panBox(_objectSpread({}, targetProps, brushBox, {
        brushDomain: cachedDomain,
        startX: (brushBox.x1 + brushBox.x2) / 2,
        startY: (brushBox.y1 + brushBox.y2) / 2
      }), _victoryCore.Selection.getSVGEventCoordinates(evt, parentSVG));
      var fullDomainBox = targetProps.fullDomainBox || this.getDomainBox(targetProps, fullDomain);
      var constrainedBox = this.constrainBox(pannedBox, fullDomainBox);
      return _victoryCore.Selection.getBounds(_objectSpread({}, constrainedBox, {
        scale: scale,
        horizontal: horizontal
      }));
    } else {
      return domain;
    }
  },
  getSelectionMutation: function (point, box, brushDimension) {
    var x = point.x,
        y = point.y;
    var x1 = box.x1,
        x2 = box.x2,
        y1 = box.y1,
        y2 = box.y2;
    return {
      x1: brushDimension !== "y" ? x : x1,
      y1: brushDimension !== "x" ? y : y1,
      x2: brushDimension !== "y" ? x : x2,
      y2: brushDimension !== "x" ? y : y2
    };
  },
  panBox: function (props, point) {
    var domain = props.domain,
        startX = props.startX,
        startY = props.startY;
    var brushDimension = this.getDimension(props);
    var brushDomain = (0, _defaults2.default)({}, props.brushDomain, domain);
    var fullDomain = (0, _defaults2.default)({}, props.fullDomain, domain);

    var _ref = props.x1 ? props : this.getDomainBox(props, fullDomain, brushDomain),
        x1 = _ref.x1,
        x2 = _ref.x2,
        y1 = _ref.y1,
        y2 = _ref.y2;

    var x = point.x,
        y = point.y;
    var delta = {
      x: startX ? startX - x : 0,
      y: startY ? startY - y : 0
    };
    return {
      x1: brushDimension !== "y" ? Math.min(x1, x2) - delta.x : Math.min(x1, x2),
      x2: brushDimension !== "y" ? Math.max(x1, x2) - delta.x : Math.max(x1, x2),
      y1: brushDimension !== "x" ? Math.min(y1, y2) - delta.y : Math.min(y1, y2),
      y2: brushDimension !== "x" ? Math.max(y1, y2) - delta.y : Math.max(y1, y2)
    };
  },
  constrainBox: function (box, fullDomainBox) {
    var _mapValues4 = (0, _mapValues5.default)(fullDomainBox, Number),
        x1 = _mapValues4.x1,
        y1 = _mapValues4.y1,
        x2 = _mapValues4.x2,
        y2 = _mapValues4.y2;

    return {
      x1: box.x2 > x2 ? x2 - Math.abs(box.x2 - box.x1) : Math.max(box.x1, x1),
      y1: box.y2 > y2 ? y2 - Math.abs(box.y2 - box.y1) : Math.max(box.y1, y1),
      x2: box.x1 < x1 ? x1 + Math.abs(box.x2 - box.x1) : Math.min(box.x2, x2),
      y2: box.y1 < y1 ? y1 + Math.abs(box.y2 - box.y1) : Math.min(box.y2, y2)
    };
  },
  hasMoved: function (props) {
    var x1 = props.x1,
        x2 = props.x2,
        y1 = props.y1,
        y2 = props.y2,
        mouseMoveThreshold = props.mouseMoveThreshold;
    var brushDimension = this.getDimension(props);
    var xMoved = Math.abs(x1 - x2) >= mouseMoveThreshold;
    var yMoved = Math.abs(y1 - y2) >= mouseMoveThreshold;

    switch (brushDimension) {
      case "x":
        return xMoved;

      case "y":
        return yMoved;

      default:
        return xMoved || yMoved;
    }
  },
  // eslint-disable-next-line max-statements, complexity
  onMouseDown: function (evt, targetProps) {
    var _this2 = this;

    evt.preventDefault();
    var handleWidth = targetProps.handleWidth,
        cachedBrushDomain = targetProps.cachedBrushDomain,
        domain = targetProps.domain,
        allowResize = targetProps.allowResize,
        allowDrag = targetProps.allowDrag,
        allowDraw = targetProps.allowDraw;
    var brushDimension = this.getDimension(targetProps); // Don't trigger events for static brushes

    if (!allowResize && !allowDrag) {
      return {};
    }

    var fullDomainBox = targetProps.fullDomainBox || this.getDomainBox(targetProps, domain);

    var parentSVG = targetProps.parentSVG || _victoryCore.Selection.getParentSVG(evt);

    var _Selection$getSVGEven = _victoryCore.Selection.getSVGEventCoordinates(evt, parentSVG),
        x = _Selection$getSVGEven.x,
        y = _Selection$getSVGEven.y; // Ignore events that occur outside of the maximum domain region


    if (!this.withinBounds({
      x: x,
      y: y
    }, fullDomainBox, handleWidth)) {
      return {};
    }

    var brushDomain = (0, _defaults2.default)({}, targetProps.brushDomain, domain);
    var currentDomain = (0, _reactFastCompare.default)(brushDomain, cachedBrushDomain) ? targetProps.currentDomain || brushDomain || domain : brushDomain || domain;
    var domainBox = this.getDomainBox(targetProps, domain, currentDomain);
    var activeHandles = allowResize && this.getActiveHandles({
      x: x,
      y: y
    }, targetProps, domainBox); // If the event occurs in any of the handle regions, start a resize

    if (activeHandles) {
      return [{
        target: "parent",
        mutation: function () {
          return _objectSpread({
            isSelecting: true,
            domainBox: domainBox,
            fullDomainBox: fullDomainBox,
            cachedBrushDomain: brushDomain,
            currentDomain: currentDomain,
            parentSVG: parentSVG
          }, _this2.getResizeMutation(domainBox, activeHandles));
        }
      }];
    } else if (this.withinBounds({
      x: x,
      y: y
    }, domainBox) && !(0, _reactFastCompare.default)(domain, currentDomain)) {
      // if the event occurs within a selected region start a panning event, unless the whole
      // domain is selected
      return [{
        target: "parent",
        mutation: function () {
          return _objectSpread({
            isPanning: allowDrag,
            startX: x,
            startY: y,
            domainBox: domainBox,
            fullDomainBox: fullDomainBox,
            currentDomain: currentDomain,
            cachedBrushDomain: brushDomain,
            parentSVG: parentSVG
          }, domainBox);
        }
      }];
    } else {
      // if the event occurs outside the region, or if the whole domain is selected,
      // start a new selection
      return allowDraw ? [{
        target: "parent",
        mutation: function () {
          return _objectSpread({
            isSelecting: allowResize,
            domainBox: domainBox,
            fullDomainBox: fullDomainBox,
            parentSVG: parentSVG,
            cachedBrushDomain: brushDomain,
            cachedCurrentDomain: currentDomain,
            currentDomain: _this2.getMinimumDomain()
          }, _this2.getSelectionMutation({
            x: x,
            y: y
          }, domainBox, brushDimension));
        }
      }] : {};
    }
  },
  // eslint-disable-next-line max-statements, complexity
  onMouseMove: function (evt, targetProps) {
    // if a panning or selection has not been started, ignore the event
    if (!targetProps.isPanning && !targetProps.isSelecting) {
      return {};
    }

    var scale = targetProps.scale,
        isPanning = targetProps.isPanning,
        isSelecting = targetProps.isSelecting,
        fullDomainBox = targetProps.fullDomainBox,
        onBrushDomainChange = targetProps.onBrushDomainChange,
        allowResize = targetProps.allowResize,
        allowDrag = targetProps.allowDrag,
        horizontal = targetProps.horizontal,
        mouseMoveThreshold = targetProps.mouseMoveThreshold;
    var brushDimension = this.getDimension(targetProps);

    var parentSVG = targetProps.parentSVG || _victoryCore.Selection.getParentSVG(evt);

    var _Selection$getSVGEven2 = _victoryCore.Selection.getSVGEventCoordinates(evt, parentSVG),
        x = _Selection$getSVGEven2.x,
        y = _Selection$getSVGEven2.y; // Ignore events that occur outside of the maximum domain region


    if (!allowResize && !allowDrag || !this.withinBounds({
      x: x,
      y: y
    }, fullDomainBox) || mouseMoveThreshold > 0 && !this.hasMoved(_objectSpread({}, targetProps, {
      x2: x,
      y2: y
    }))) {
      return {};
    }

    if (allowDrag && isPanning) {
      var startX = targetProps.startX,
          startY = targetProps.startY;
      var pannedBox = this.panBox(targetProps, {
        x: x,
        y: y
      });
      var constrainedBox = this.constrainBox(pannedBox, fullDomainBox);

      var currentDomain = _victoryCore.Selection.getBounds(_objectSpread({}, constrainedBox, {
        scale: scale,
        horizontal: horizontal
      }));

      var mutatedProps = _objectSpread({
        currentDomain: currentDomain,
        parentSVG: parentSVG,
        startX: pannedBox.x2 >= fullDomainBox.x2 || pannedBox.x1 <= fullDomainBox.x1 ? startX : x,
        startY: pannedBox.y2 >= fullDomainBox.y2 || pannedBox.y1 <= fullDomainBox.y1 ? startY : y
      }, constrainedBox);

      if ((0, _isFunction2.default)(onBrushDomainChange)) {
        onBrushDomainChange(currentDomain, (0, _defaults2.default)({}, mutatedProps, targetProps));
      }

      return [{
        target: "parent",
        mutation: function () {
          return mutatedProps;
        }
      }];
    } else if (allowResize && isSelecting) {
      var x2 = brushDimension !== "y" ? x : targetProps.x2;
      var y2 = brushDimension !== "x" ? y : targetProps.y2;

      var _currentDomain = _victoryCore.Selection.getBounds({
        x2: x2,
        y2: y2,
        x1: targetProps.x1,
        y1: targetProps.y1,
        scale: scale,
        horizontal: horizontal
      });

      var _mutatedProps = {
        x2: x2,
        y2: y2,
        currentDomain: _currentDomain,
        parentSVG: parentSVG
      };

      if ((0, _isFunction2.default)(onBrushDomainChange)) {
        onBrushDomainChange(_currentDomain, (0, _defaults2.default)({}, _mutatedProps, targetProps));
      }

      return [{
        target: "parent",
        mutation: function () {
          return _mutatedProps;
        }
      }];
    }

    return {};
  },
  onMouseUp: function (evt, targetProps) {
    // eslint-disable-line max-statements, complexity
    var x1 = targetProps.x1,
        y1 = targetProps.y1,
        x2 = targetProps.x2,
        y2 = targetProps.y2,
        isPanning = targetProps.isPanning,
        isSelecting = targetProps.isSelecting,
        onBrushDomainChange = targetProps.onBrushDomainChange,
        onBrushDomainChangeEnd = targetProps.onBrushDomainChangeEnd,
        onBrushCleared = targetProps.onBrushCleared,
        currentDomain = targetProps.currentDomain,
        allowResize = targetProps.allowResize,
        allowDrag = targetProps.allowDrag,
        defaultBrushArea = targetProps.defaultBrushArea;
    var defaultBrushHasArea = defaultBrushArea !== undefined && defaultBrushArea !== "none";
    var mutatedProps = {
      isPanning: false,
      isSelecting: false
    }; // if the mouse hasn't moved since a mouseDown event, select the default brush area

    if ((allowResize || defaultBrushHasArea) && (x1 === x2 || y1 === y2)) {
      var cachedDomain = targetProps.cachedCurrentDomain || currentDomain;
      var defaultDomain = this.getDefaultBrushArea(targetProps, cachedDomain, evt);
      mutatedProps.currentDomain = defaultDomain;

      if ((0, _isFunction2.default)(onBrushDomainChange)) {
        onBrushDomainChange(defaultDomain, (0, _defaults2.default)({}, mutatedProps, targetProps));
      }

      if ((0, _isFunction2.default)(onBrushDomainChangeEnd)) {
        onBrushDomainChangeEnd(defaultDomain, (0, _defaults2.default)({}, mutatedProps, targetProps));
      }

      if ((0, _isFunction2.default)(onBrushCleared)) {
        onBrushCleared(defaultDomain, (0, _defaults2.default)({}, mutatedProps, targetProps));
      }
    } else if (allowDrag && isPanning || allowResize && isSelecting) {
      if ((0, _isFunction2.default)(onBrushDomainChangeEnd)) {
        onBrushDomainChangeEnd(currentDomain, (0, _defaults2.default)({}, mutatedProps, targetProps));
      }
    }

    return [{
      target: "parent",
      mutation: function () {
        return mutatedProps;
      }
    }];
  },
  onMouseLeave: function () {
    return [{
      target: "parent",
      mutation: function () {
        return {
          isPanning: false,
          isSelecting: false
        };
      }
    }];
  }
};

var _default = _objectSpread({}, Helpers, {
  onMouseDown: Helpers.onMouseDown.bind(Helpers),
  onMouseUp: Helpers.onMouseUp.bind(Helpers),
  onMouseLeave: Helpers.onMouseLeave.bind(Helpers),
  onMouseMove: (0, _throttle2.default)(Helpers.onMouseMove.bind(Helpers), 16, // eslint-disable-line no-magic-numbers
  {
    leading: true,
    trailing: false
  })
});

exports.default = _default;