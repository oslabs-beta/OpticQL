"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));

var _defaults2 = _interopRequireDefault(require("lodash/defaults"));

var _assign2 = _interopRequireDefault(require("lodash/assign"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _victoryCore = require("victory-core");

var _victorySharedEvents = require("victory-shared-events");

var _helperMethods = require("./helper-methods");

var _reactFastCompare = _interopRequireDefault(require("react-fast-compare"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var fallbackProps = {
  width: 450,
  height: 300,
  padding: 50,
  offset: 0
};

var VictoryGroup =
/*#__PURE__*/
function (_React$Component) {
  _inherits(VictoryGroup, _React$Component);

  function VictoryGroup(props) {
    var _this;

    _classCallCheck(this, VictoryGroup);

    _this = _possibleConstructorReturn(this, (VictoryGroup.__proto__ || Object.getPrototypeOf(VictoryGroup)).call(this, props));

    if (props.animate) {
      _this.state = {
        nodesShouldLoad: false,
        nodesDoneLoad: false,
        animating: true
      };
      _this.setAnimationState = _victoryCore.Wrapper.setAnimationState.bind(_assertThisInitialized(_this));
    }

    return _this;
  }

  _createClass(VictoryGroup, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      if (this.props.animate) {
        if (!(0, _reactFastCompare.default)(this.props, nextProps)) {
          this.setAnimationState(this.props, nextProps);
          return false;
        }
      }

      return true;
    }
  }, {
    key: "getNewChildren",
    value: function getNewChildren(props, childComponents, calculatedProps) {
      var children = (0, _helperMethods.getChildren)(props, childComponents, calculatedProps);

      var getAnimationProps = _victoryCore.Wrapper.getAnimationProps.bind(this);

      return children.map(function (child, index) {
        var childProps = (0, _assign2.default)({
          animate: getAnimationProps(props, child, index)
        }, child.props);
        return _react.default.cloneElement(child, childProps);
      });
    }
  }, {
    key: "renderContainer",
    value: function renderContainer(containerComponent, props) {
      var containerProps = (0, _defaults2.default)({}, containerComponent.props, props);
      return _react.default.cloneElement(containerComponent, containerProps);
    }
  }, {
    key: "getContainerProps",
    value: function getContainerProps(props, calculatedProps) {
      var width = props.width,
          height = props.height,
          standalone = props.standalone,
          theme = props.theme,
          polar = props.polar,
          horizontal = props.horizontal,
          name = props.name;
      var domain = calculatedProps.domain,
          scale = calculatedProps.scale,
          style = calculatedProps.style,
          origin = calculatedProps.origin;
      return {
        domain: domain,
        scale: scale,
        width: width,
        height: height,
        standalone: standalone,
        theme: theme,
        style: style.parent,
        horizontal: horizontal,
        polar: polar,
        origin: origin,
        name: name
      };
    }
  }, {
    key: "render",
    value: function render() {
      var role = this.constructor.role;
      var props = this.state && this.state.nodesWillExit ? this.state.oldProps || this.props : this.props;

      var modifiedProps = _victoryCore.Helpers.modifyProps(props, fallbackProps, role);

      var eventKey = modifiedProps.eventKey,
          containerComponent = modifiedProps.containerComponent,
          standalone = modifiedProps.standalone,
          groupComponent = modifiedProps.groupComponent,
          externalEventMutations = modifiedProps.externalEventMutations;

      var childComponents = _react.default.Children.toArray(modifiedProps.children);

      var calculatedProps = (0, _helperMethods.getCalculatedProps)(modifiedProps, childComponents);
      var newChildren = this.getNewChildren(modifiedProps, childComponents, calculatedProps);
      var containerProps = standalone ? this.getContainerProps(modifiedProps, calculatedProps) : {};
      var container = standalone ? this.renderContainer(containerComponent, containerProps) : groupComponent;

      var events = _victoryCore.Wrapper.getAllEvents(props);

      if (!(0, _isEmpty2.default)(events)) {
        return _react.default.createElement(_victorySharedEvents.VictorySharedEvents, {
          container: container,
          eventKey: eventKey,
          events: events,
          externalEventMutations: externalEventMutations
        }, newChildren);
      }

      return _react.default.cloneElement(container, container.props, newChildren);
    }
  }]);

  return VictoryGroup;
}(_react.default.Component);

exports.default = VictoryGroup;
Object.defineProperty(VictoryGroup, "displayName", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "VictoryGroup"
});
Object.defineProperty(VictoryGroup, "role", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: "group"
});
Object.defineProperty(VictoryGroup, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _objectSpread({}, _victoryCore.CommonProps.baseProps, _victoryCore.CommonProps.dataProps, {
    children: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.node), _propTypes.default.node]),
    color: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.func]),
    colorScale: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.string), _propTypes.default.oneOf(["grayscale", "qualitative", "heatmap", "warm", "cool", "red", "green", "blue"])]),
    horizontal: _propTypes.default.bool,
    offset: _propTypes.default.number
  })
});
Object.defineProperty(VictoryGroup, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: {
    containerComponent: _react.default.createElement(_victoryCore.VictoryContainer, null),
    groupComponent: _react.default.createElement("g", null),
    samples: 50,
    sortOrder: "ascending",
    standalone: true,
    theme: _victoryCore.VictoryTheme.grayscale
  }
});
Object.defineProperty(VictoryGroup, "expectedComponents", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: ["groupComponent", "containerComponent", "labelComponent"]
});
Object.defineProperty(VictoryGroup, "getChildren", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: _helperMethods.getChildren
});