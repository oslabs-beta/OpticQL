export default {
  IMMUTABLE_ITERABLE: "@@__IMMUTABLE_ITERABLE__@@",
  IMMUTABLE_RECORD: "@@__IMMUTABLE_RECORD__@@",
  IMMUTABLE_LIST: "@@__IMMUTABLE_LIST__@@",
  IMMUTABLE_MAP: "@@__IMMUTABLE_MAP__@@",
  isImmutable: function (x) {
    return this.isIterable(x) || this.isRecord(x);
  },
  isIterable: function (x) {
    return !!(x && x[this.IMMUTABLE_ITERABLE]);
  },
  isRecord: function (x) {
    return !!(x && x[this.IMMUTABLE_RECORD]);
  },
  isList: function (x) {
    return !!(x && x[this.IMMUTABLE_LIST]);
  },
  isMap: function (x) {
    return !!(x && x[this.IMMUTABLE_MAP]);
  },
  shallowToJS: function (x, whitelist) {
    var _this = this;

    return this.isIterable(x) ? x.reduce(function (prev, curr, key) {
      if (whitelist && whitelist[key]) {
        curr = _this.shallowToJS(curr);
      }

      prev[key] = curr;
      return prev;
    }, this.isList(x) ? [] : {}) : x;
  }
};