import {
  require_prop_types
} from "./chunk-J2IKH2O7.js";
import {
  require_react_dom
} from "./chunk-V2X5ZORR.js";
import {
  require_react
} from "./chunk-32E4H3EV.js";
import {
  __commonJS,
  __toESM
} from "./chunk-G3PMV62Z.js";

// node_modules/classnames/index.js
var require_classnames = __commonJS({
  "node_modules/classnames/index.js"(exports, module) {
    (function() {
      "use strict";
      var hasOwn = {}.hasOwnProperty;
      function classNames() {
        var classes = "";
        for (var i2 = 0; i2 < arguments.length; i2++) {
          var arg = arguments[i2];
          if (arg) {
            classes = appendClass(classes, parseValue(arg));
          }
        }
        return classes;
      }
      function parseValue(arg) {
        if (typeof arg === "string" || typeof arg === "number") {
          return arg;
        }
        if (typeof arg !== "object") {
          return "";
        }
        if (Array.isArray(arg)) {
          return classNames.apply(null, arg);
        }
        if (arg.toString !== Object.prototype.toString && !arg.toString.toString().includes("[native code]")) {
          return arg.toString();
        }
        var classes = "";
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes = appendClass(classes, key);
          }
        }
        return classes;
      }
      function appendClass(value, newClass) {
        if (!newClass) {
          return value;
        }
        if (value) {
          return value + " " + newClass;
        }
        return value + newClass;
      }
      if (typeof module !== "undefined" && module.exports) {
        classNames.default = classNames;
        module.exports = classNames;
      } else if (typeof define === "function" && typeof define.amd === "object" && define.amd) {
        define("classnames", [], function() {
          return classNames;
        });
      } else {
        window.classNames = classNames;
      }
    })();
  }
});

// node_modules/react-fast-compare/index.js
var require_react_fast_compare = __commonJS({
  "node_modules/react-fast-compare/index.js"(exports, module) {
    var hasElementType = typeof Element !== "undefined";
    var hasMap = typeof Map === "function";
    var hasSet = typeof Set === "function";
    var hasArrayBuffer = typeof ArrayBuffer === "function" && !!ArrayBuffer.isView;
    function equal(a3, b2) {
      if (a3 === b2) return true;
      if (a3 && b2 && typeof a3 == "object" && typeof b2 == "object") {
        if (a3.constructor !== b2.constructor) return false;
        var length, i2, keys;
        if (Array.isArray(a3)) {
          length = a3.length;
          if (length != b2.length) return false;
          for (i2 = length; i2-- !== 0; )
            if (!equal(a3[i2], b2[i2])) return false;
          return true;
        }
        var it2;
        if (hasMap && a3 instanceof Map && b2 instanceof Map) {
          if (a3.size !== b2.size) return false;
          it2 = a3.entries();
          while (!(i2 = it2.next()).done)
            if (!b2.has(i2.value[0])) return false;
          it2 = a3.entries();
          while (!(i2 = it2.next()).done)
            if (!equal(i2.value[1], b2.get(i2.value[0]))) return false;
          return true;
        }
        if (hasSet && a3 instanceof Set && b2 instanceof Set) {
          if (a3.size !== b2.size) return false;
          it2 = a3.entries();
          while (!(i2 = it2.next()).done)
            if (!b2.has(i2.value[0])) return false;
          return true;
        }
        if (hasArrayBuffer && ArrayBuffer.isView(a3) && ArrayBuffer.isView(b2)) {
          length = a3.length;
          if (length != b2.length) return false;
          for (i2 = length; i2-- !== 0; )
            if (a3[i2] !== b2[i2]) return false;
          return true;
        }
        if (a3.constructor === RegExp) return a3.source === b2.source && a3.flags === b2.flags;
        if (a3.valueOf !== Object.prototype.valueOf && typeof a3.valueOf === "function" && typeof b2.valueOf === "function") return a3.valueOf() === b2.valueOf();
        if (a3.toString !== Object.prototype.toString && typeof a3.toString === "function" && typeof b2.toString === "function") return a3.toString() === b2.toString();
        keys = Object.keys(a3);
        length = keys.length;
        if (length !== Object.keys(b2).length) return false;
        for (i2 = length; i2-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b2, keys[i2])) return false;
        if (hasElementType && a3 instanceof Element) return false;
        for (i2 = length; i2-- !== 0; ) {
          if ((keys[i2] === "_owner" || keys[i2] === "__v" || keys[i2] === "__o") && a3.$$typeof) {
            continue;
          }
          if (!equal(a3[keys[i2]], b2[keys[i2]])) return false;
        }
        return true;
      }
      return a3 !== a3 && b2 !== b2;
    }
    module.exports = function isEqual3(a3, b2) {
      try {
        return equal(a3, b2);
      } catch (error) {
        if ((error.message || "").match(/stack|recursion/i)) {
          console.warn("react-fast-compare cannot handle circular refs");
          return false;
        }
        throw error;
      }
    };
  }
});

// node_modules/warning/warning.js
var require_warning = __commonJS({
  "node_modules/warning/warning.js"(exports, module) {
    "use strict";
    var __DEV__ = true;
    var warning2 = function() {
    };
    if (__DEV__) {
      printWarning = function printWarning2(format2, args) {
        var len = arguments.length;
        args = new Array(len > 1 ? len - 1 : 0);
        for (var key = 1; key < len; key++) {
          args[key - 1] = arguments[key];
        }
        var argIndex = 0;
        var message = "Warning: " + format2.replace(/%s/g, function() {
          return args[argIndex++];
        });
        if (typeof console !== "undefined") {
          console.error(message);
        }
        try {
          throw new Error(message);
        } catch (x2) {
        }
      };
      warning2 = function(condition, format2, args) {
        var len = arguments.length;
        args = new Array(len > 2 ? len - 2 : 0);
        for (var key = 2; key < len; key++) {
          args[key - 2] = arguments[key];
        }
        if (format2 === void 0) {
          throw new Error(
            "`warning(condition, format, ...args)` requires a warning message argument"
          );
        }
        if (!condition) {
          printWarning.apply(null, [format2].concat(args));
        }
      };
    }
    var printWarning;
    module.exports = warning2;
  }
});

// node_modules/react-datepicker/dist/es/index.js
var import_react2 = __toESM(require_react());
var import_prop_types = __toESM(require_prop_types());
var import_classnames = __toESM(require_classnames());

// node_modules/@babel/runtime/helpers/esm/typeof.js
function _typeof(o) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o2) {
    return typeof o2;
  } : function(o2) {
    return o2 && "function" == typeof Symbol && o2.constructor === Symbol && o2 !== Symbol.prototype ? "symbol" : typeof o2;
  }, _typeof(o);
}

// node_modules/date-fns/esm/_lib/requiredArgs/index.js
function requiredArgs(required, args) {
  if (args.length < required) {
    throw new TypeError(required + " argument" + (required > 1 ? "s" : "") + " required, but only " + args.length + " present");
  }
}

// node_modules/date-fns/esm/isDate/index.js
function isDate(value) {
  requiredArgs(1, arguments);
  return value instanceof Date || _typeof(value) === "object" && Object.prototype.toString.call(value) === "[object Date]";
}

// node_modules/date-fns/esm/toDate/index.js
function toDate(argument) {
  requiredArgs(1, arguments);
  var argStr = Object.prototype.toString.call(argument);
  if (argument instanceof Date || _typeof(argument) === "object" && argStr === "[object Date]") {
    return new Date(argument.getTime());
  } else if (typeof argument === "number" || argStr === "[object Number]") {
    return new Date(argument);
  } else {
    if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
      console.warn("Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://github.com/date-fns/date-fns/blob/master/docs/upgradeGuide.md#string-arguments");
      console.warn(new Error().stack);
    }
    return /* @__PURE__ */ new Date(NaN);
  }
}

// node_modules/date-fns/esm/isValid/index.js
function isValid(dirtyDate) {
  requiredArgs(1, arguments);
  if (!isDate(dirtyDate) && typeof dirtyDate !== "number") {
    return false;
  }
  var date = toDate(dirtyDate);
  return !isNaN(Number(date));
}

// node_modules/date-fns/esm/_lib/toInteger/index.js
function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }
  var number = Number(dirtyNumber);
  if (isNaN(number)) {
    return number;
  }
  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

// node_modules/date-fns/esm/addMilliseconds/index.js
function addMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var timestamp = toDate(dirtyDate).getTime();
  var amount = toInteger(dirtyAmount);
  return new Date(timestamp + amount);
}

// node_modules/date-fns/esm/subMilliseconds/index.js
function subMilliseconds(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, -amount);
}

// node_modules/date-fns/esm/_lib/getUTCDayOfYear/index.js
var MILLISECONDS_IN_DAY = 864e5;
function getUTCDayOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var timestamp = date.getTime();
  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);
  var startOfYearTimestamp = date.getTime();
  var difference = timestamp - startOfYearTimestamp;
  return Math.floor(difference / MILLISECONDS_IN_DAY) + 1;
}

// node_modules/date-fns/esm/_lib/startOfUTCISOWeek/index.js
function startOfUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var weekStartsOn = 1;
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/_lib/getUTCISOWeekYear/index.js
function getUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var fourthOfJanuaryOfNextYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfNextYear.setUTCFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCISOWeek(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfThisYear.setUTCFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCISOWeek(fourthOfJanuaryOfThisYear);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/esm/_lib/startOfUTCISOWeekYear/index.js
function startOfUTCISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getUTCISOWeekYear(dirtyDate);
  var fourthOfJanuary = /* @__PURE__ */ new Date(0);
  fourthOfJanuary.setUTCFullYear(year, 0, 4);
  fourthOfJanuary.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCISOWeek(fourthOfJanuary);
  return date;
}

// node_modules/date-fns/esm/_lib/getUTCISOWeek/index.js
var MILLISECONDS_IN_WEEK = 6048e5;
function getUTCISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCISOWeek(date).getTime() - startOfUTCISOWeekYear(date).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK) + 1;
}

// node_modules/date-fns/esm/_lib/defaultOptions/index.js
var defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}

// node_modules/date-fns/esm/_lib/startOfUTCWeek/index.js
function startOfUTCWeek(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions2 = getDefaultOptions();
  var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = date.getUTCDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setUTCDate(date.getUTCDate() - diff);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/_lib/getUTCWeekYear/index.js
function getUTCWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getUTCFullYear();
  var defaultOptions2 = getDefaultOptions();
  var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var firstWeekOfNextYear = /* @__PURE__ */ new Date(0);
  firstWeekOfNextYear.setUTCFullYear(year + 1, 0, firstWeekContainsDate);
  firstWeekOfNextYear.setUTCHours(0, 0, 0, 0);
  var startOfNextYear = startOfUTCWeek(firstWeekOfNextYear, options);
  var firstWeekOfThisYear = /* @__PURE__ */ new Date(0);
  firstWeekOfThisYear.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeekOfThisYear.setUTCHours(0, 0, 0, 0);
  var startOfThisYear = startOfUTCWeek(firstWeekOfThisYear, options);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/esm/_lib/startOfUTCWeekYear/index.js
function startOfUTCWeekYear(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$firstWeekCon, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions2 = getDefaultOptions();
  var firstWeekContainsDate = toInteger((_ref = (_ref2 = (_ref3 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref !== void 0 ? _ref : 1);
  var year = getUTCWeekYear(dirtyDate, options);
  var firstWeek = /* @__PURE__ */ new Date(0);
  firstWeek.setUTCFullYear(year, 0, firstWeekContainsDate);
  firstWeek.setUTCHours(0, 0, 0, 0);
  var date = startOfUTCWeek(firstWeek, options);
  return date;
}

// node_modules/date-fns/esm/_lib/getUTCWeek/index.js
var MILLISECONDS_IN_WEEK2 = 6048e5;
function getUTCWeek(dirtyDate, options) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfUTCWeek(date, options).getTime() - startOfUTCWeekYear(date, options).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK2) + 1;
}

// node_modules/date-fns/esm/_lib/addLeadingZeros/index.js
function addLeadingZeros(number, targetLength) {
  var sign = number < 0 ? "-" : "";
  var output = Math.abs(number).toString();
  while (output.length < targetLength) {
    output = "0" + output;
  }
  return sign + output;
}

// node_modules/date-fns/esm/_lib/format/lightFormatters/index.js
var formatters = {
  // Year
  y: function y(date, token) {
    var signedYear = date.getUTCFullYear();
    var year = signedYear > 0 ? signedYear : 1 - signedYear;
    return addLeadingZeros(token === "yy" ? year % 100 : year, token.length);
  },
  // Month
  M: function M(date, token) {
    var month = date.getUTCMonth();
    return token === "M" ? String(month + 1) : addLeadingZeros(month + 1, 2);
  },
  // Day of the month
  d: function d(date, token) {
    return addLeadingZeros(date.getUTCDate(), token.length);
  },
  // AM or PM
  a: function a(date, token) {
    var dayPeriodEnumValue = date.getUTCHours() / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return dayPeriodEnumValue.toUpperCase();
      case "aaa":
        return dayPeriodEnumValue;
      case "aaaaa":
        return dayPeriodEnumValue[0];
      case "aaaa":
      default:
        return dayPeriodEnumValue === "am" ? "a.m." : "p.m.";
    }
  },
  // Hour [1-12]
  h: function h(date, token) {
    return addLeadingZeros(date.getUTCHours() % 12 || 12, token.length);
  },
  // Hour [0-23]
  H: function H(date, token) {
    return addLeadingZeros(date.getUTCHours(), token.length);
  },
  // Minute
  m: function m(date, token) {
    return addLeadingZeros(date.getUTCMinutes(), token.length);
  },
  // Second
  s: function s(date, token) {
    return addLeadingZeros(date.getUTCSeconds(), token.length);
  },
  // Fraction of second
  S: function S(date, token) {
    var numberOfDigits = token.length;
    var milliseconds = date.getUTCMilliseconds();
    var fractionalSeconds = Math.floor(milliseconds * Math.pow(10, numberOfDigits - 3));
    return addLeadingZeros(fractionalSeconds, token.length);
  }
};
var lightFormatters_default = formatters;

// node_modules/date-fns/esm/_lib/format/formatters/index.js
var dayPeriodEnum = {
  am: "am",
  pm: "pm",
  midnight: "midnight",
  noon: "noon",
  morning: "morning",
  afternoon: "afternoon",
  evening: "evening",
  night: "night"
};
var formatters2 = {
  // Era
  G: function G(date, token, localize2) {
    var era = date.getUTCFullYear() > 0 ? 1 : 0;
    switch (token) {
      // AD, BC
      case "G":
      case "GG":
      case "GGG":
        return localize2.era(era, {
          width: "abbreviated"
        });
      // A, B
      case "GGGGG":
        return localize2.era(era, {
          width: "narrow"
        });
      // Anno Domini, Before Christ
      case "GGGG":
      default:
        return localize2.era(era, {
          width: "wide"
        });
    }
  },
  // Year
  y: function y2(date, token, localize2) {
    if (token === "yo") {
      var signedYear = date.getUTCFullYear();
      var year = signedYear > 0 ? signedYear : 1 - signedYear;
      return localize2.ordinalNumber(year, {
        unit: "year"
      });
    }
    return lightFormatters_default.y(date, token);
  },
  // Local week-numbering year
  Y: function Y(date, token, localize2, options) {
    var signedWeekYear = getUTCWeekYear(date, options);
    var weekYear = signedWeekYear > 0 ? signedWeekYear : 1 - signedWeekYear;
    if (token === "YY") {
      var twoDigitYear = weekYear % 100;
      return addLeadingZeros(twoDigitYear, 2);
    }
    if (token === "Yo") {
      return localize2.ordinalNumber(weekYear, {
        unit: "year"
      });
    }
    return addLeadingZeros(weekYear, token.length);
  },
  // ISO week-numbering year
  R: function R(date, token) {
    var isoWeekYear = getUTCISOWeekYear(date);
    return addLeadingZeros(isoWeekYear, token.length);
  },
  // Extended year. This is a single number designating the year of this calendar system.
  // The main difference between `y` and `u` localizers are B.C. years:
  // | Year | `y` | `u` |
  // |------|-----|-----|
  // | AC 1 |   1 |   1 |
  // | BC 1 |   1 |   0 |
  // | BC 2 |   2 |  -1 |
  // Also `yy` always returns the last two digits of a year,
  // while `uu` pads single digit years to 2 characters and returns other years unchanged.
  u: function u(date, token) {
    var year = date.getUTCFullYear();
    return addLeadingZeros(year, token.length);
  },
  // Quarter
  Q: function Q(date, token, localize2) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "Q":
        return String(quarter);
      // 01, 02, 03, 04
      case "QQ":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "Qo":
        return localize2.ordinalNumber(quarter, {
          unit: "quarter"
        });
      // Q1, Q2, Q3, Q4
      case "QQQ":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "formatting"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "QQQQQ":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "formatting"
        });
      // 1st quarter, 2nd quarter, ...
      case "QQQQ":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone quarter
  q: function q(date, token, localize2) {
    var quarter = Math.ceil((date.getUTCMonth() + 1) / 3);
    switch (token) {
      // 1, 2, 3, 4
      case "q":
        return String(quarter);
      // 01, 02, 03, 04
      case "qq":
        return addLeadingZeros(quarter, 2);
      // 1st, 2nd, 3rd, 4th
      case "qo":
        return localize2.ordinalNumber(quarter, {
          unit: "quarter"
        });
      // Q1, Q2, Q3, Q4
      case "qqq":
        return localize2.quarter(quarter, {
          width: "abbreviated",
          context: "standalone"
        });
      // 1, 2, 3, 4 (narrow quarter; could be not numerical)
      case "qqqqq":
        return localize2.quarter(quarter, {
          width: "narrow",
          context: "standalone"
        });
      // 1st quarter, 2nd quarter, ...
      case "qqqq":
      default:
        return localize2.quarter(quarter, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Month
  M: function M2(date, token, localize2) {
    var month = date.getUTCMonth();
    switch (token) {
      case "M":
      case "MM":
        return lightFormatters_default.M(date, token);
      // 1st, 2nd, ..., 12th
      case "Mo":
        return localize2.ordinalNumber(month + 1, {
          unit: "month"
        });
      // Jan, Feb, ..., Dec
      case "MMM":
        return localize2.month(month, {
          width: "abbreviated",
          context: "formatting"
        });
      // J, F, ..., D
      case "MMMMM":
        return localize2.month(month, {
          width: "narrow",
          context: "formatting"
        });
      // January, February, ..., December
      case "MMMM":
      default:
        return localize2.month(month, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone month
  L: function L(date, token, localize2) {
    var month = date.getUTCMonth();
    switch (token) {
      // 1, 2, ..., 12
      case "L":
        return String(month + 1);
      // 01, 02, ..., 12
      case "LL":
        return addLeadingZeros(month + 1, 2);
      // 1st, 2nd, ..., 12th
      case "Lo":
        return localize2.ordinalNumber(month + 1, {
          unit: "month"
        });
      // Jan, Feb, ..., Dec
      case "LLL":
        return localize2.month(month, {
          width: "abbreviated",
          context: "standalone"
        });
      // J, F, ..., D
      case "LLLLL":
        return localize2.month(month, {
          width: "narrow",
          context: "standalone"
        });
      // January, February, ..., December
      case "LLLL":
      default:
        return localize2.month(month, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // Local week of year
  w: function w(date, token, localize2, options) {
    var week = getUTCWeek(date, options);
    if (token === "wo") {
      return localize2.ordinalNumber(week, {
        unit: "week"
      });
    }
    return addLeadingZeros(week, token.length);
  },
  // ISO week of year
  I: function I(date, token, localize2) {
    var isoWeek = getUTCISOWeek(date);
    if (token === "Io") {
      return localize2.ordinalNumber(isoWeek, {
        unit: "week"
      });
    }
    return addLeadingZeros(isoWeek, token.length);
  },
  // Day of the month
  d: function d2(date, token, localize2) {
    if (token === "do") {
      return localize2.ordinalNumber(date.getUTCDate(), {
        unit: "date"
      });
    }
    return lightFormatters_default.d(date, token);
  },
  // Day of year
  D: function D(date, token, localize2) {
    var dayOfYear = getUTCDayOfYear(date);
    if (token === "Do") {
      return localize2.ordinalNumber(dayOfYear, {
        unit: "dayOfYear"
      });
    }
    return addLeadingZeros(dayOfYear, token.length);
  },
  // Day of week
  E: function E(date, token, localize2) {
    var dayOfWeek = date.getUTCDay();
    switch (token) {
      // Tue
      case "E":
      case "EE":
      case "EEE":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "EEEEE":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "EEEEEE":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "EEEE":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Local day of week
  e: function e(date, token, localize2, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (Nth day of week with current locale or weekStartsOn)
      case "e":
        return String(localDayOfWeek);
      // Padded numerical value
      case "ee":
        return addLeadingZeros(localDayOfWeek, 2);
      // 1st, 2nd, ..., 7th
      case "eo":
        return localize2.ordinalNumber(localDayOfWeek, {
          unit: "day"
        });
      case "eee":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "eeeee":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "eeeeee":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "eeee":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Stand-alone local day of week
  c: function c(date, token, localize2, options) {
    var dayOfWeek = date.getUTCDay();
    var localDayOfWeek = (dayOfWeek - options.weekStartsOn + 8) % 7 || 7;
    switch (token) {
      // Numerical value (same as in `e`)
      case "c":
        return String(localDayOfWeek);
      // Padded numerical value
      case "cc":
        return addLeadingZeros(localDayOfWeek, token.length);
      // 1st, 2nd, ..., 7th
      case "co":
        return localize2.ordinalNumber(localDayOfWeek, {
          unit: "day"
        });
      case "ccc":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "standalone"
        });
      // T
      case "ccccc":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "standalone"
        });
      // Tu
      case "cccccc":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "standalone"
        });
      // Tuesday
      case "cccc":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "standalone"
        });
    }
  },
  // ISO day of week
  i: function i(date, token, localize2) {
    var dayOfWeek = date.getUTCDay();
    var isoDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek;
    switch (token) {
      // 2
      case "i":
        return String(isoDayOfWeek);
      // 02
      case "ii":
        return addLeadingZeros(isoDayOfWeek, token.length);
      // 2nd
      case "io":
        return localize2.ordinalNumber(isoDayOfWeek, {
          unit: "day"
        });
      // Tue
      case "iii":
        return localize2.day(dayOfWeek, {
          width: "abbreviated",
          context: "formatting"
        });
      // T
      case "iiiii":
        return localize2.day(dayOfWeek, {
          width: "narrow",
          context: "formatting"
        });
      // Tu
      case "iiiiii":
        return localize2.day(dayOfWeek, {
          width: "short",
          context: "formatting"
        });
      // Tuesday
      case "iiii":
      default:
        return localize2.day(dayOfWeek, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM or PM
  a: function a2(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    switch (token) {
      case "a":
      case "aa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "aaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "aaaaa":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "aaaa":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // AM, PM, midnight, noon
  b: function b(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours === 12) {
      dayPeriodEnumValue = dayPeriodEnum.noon;
    } else if (hours === 0) {
      dayPeriodEnumValue = dayPeriodEnum.midnight;
    } else {
      dayPeriodEnumValue = hours / 12 >= 1 ? "pm" : "am";
    }
    switch (token) {
      case "b":
      case "bb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "bbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        }).toLowerCase();
      case "bbbbb":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "bbbb":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // in the morning, in the afternoon, in the evening, at night
  B: function B(date, token, localize2) {
    var hours = date.getUTCHours();
    var dayPeriodEnumValue;
    if (hours >= 17) {
      dayPeriodEnumValue = dayPeriodEnum.evening;
    } else if (hours >= 12) {
      dayPeriodEnumValue = dayPeriodEnum.afternoon;
    } else if (hours >= 4) {
      dayPeriodEnumValue = dayPeriodEnum.morning;
    } else {
      dayPeriodEnumValue = dayPeriodEnum.night;
    }
    switch (token) {
      case "B":
      case "BB":
      case "BBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "abbreviated",
          context: "formatting"
        });
      case "BBBBB":
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "narrow",
          context: "formatting"
        });
      case "BBBB":
      default:
        return localize2.dayPeriod(dayPeriodEnumValue, {
          width: "wide",
          context: "formatting"
        });
    }
  },
  // Hour [1-12]
  h: function h2(date, token, localize2) {
    if (token === "ho") {
      var hours = date.getUTCHours() % 12;
      if (hours === 0) hours = 12;
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return lightFormatters_default.h(date, token);
  },
  // Hour [0-23]
  H: function H2(date, token, localize2) {
    if (token === "Ho") {
      return localize2.ordinalNumber(date.getUTCHours(), {
        unit: "hour"
      });
    }
    return lightFormatters_default.H(date, token);
  },
  // Hour [0-11]
  K: function K(date, token, localize2) {
    var hours = date.getUTCHours() % 12;
    if (token === "Ko") {
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Hour [1-24]
  k: function k(date, token, localize2) {
    var hours = date.getUTCHours();
    if (hours === 0) hours = 24;
    if (token === "ko") {
      return localize2.ordinalNumber(hours, {
        unit: "hour"
      });
    }
    return addLeadingZeros(hours, token.length);
  },
  // Minute
  m: function m2(date, token, localize2) {
    if (token === "mo") {
      return localize2.ordinalNumber(date.getUTCMinutes(), {
        unit: "minute"
      });
    }
    return lightFormatters_default.m(date, token);
  },
  // Second
  s: function s2(date, token, localize2) {
    if (token === "so") {
      return localize2.ordinalNumber(date.getUTCSeconds(), {
        unit: "second"
      });
    }
    return lightFormatters_default.s(date, token);
  },
  // Fraction of second
  S: function S2(date, token) {
    return lightFormatters_default.S(date, token);
  },
  // Timezone (ISO-8601. If offset is 0, output is always `'Z'`)
  X: function X(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    if (timezoneOffset === 0) {
      return "Z";
    }
    switch (token) {
      // Hours and optional minutes
      case "X":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XX`
      case "XXXX":
      case "XX":
        return formatTimezone(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `XXX`
      case "XXXXX":
      case "XXX":
      // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (ISO-8601. If offset is 0, output is `'+00:00'` or equivalent)
  x: function x(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      // Hours and optional minutes
      case "x":
        return formatTimezoneWithOptionalMinutes(timezoneOffset);
      // Hours, minutes and optional seconds without `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xx`
      case "xxxx":
      case "xx":
        return formatTimezone(timezoneOffset);
      // Hours, minutes and optional seconds with `:` delimiter
      // Note: neither ISO-8601 nor JavaScript supports seconds in timezone offsets
      // so this token always has the same output as `xxx`
      case "xxxxx":
      case "xxx":
      // Hours and minutes with `:` delimiter
      default:
        return formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (GMT)
  O: function O(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      // Short
      case "O":
      case "OO":
      case "OOO":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "OOOO":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Timezone (specific non-location)
  z: function z(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timezoneOffset = originalDate.getTimezoneOffset();
    switch (token) {
      // Short
      case "z":
      case "zz":
      case "zzz":
        return "GMT" + formatTimezoneShort(timezoneOffset, ":");
      // Long
      case "zzzz":
      default:
        return "GMT" + formatTimezone(timezoneOffset, ":");
    }
  },
  // Seconds timestamp
  t: function t(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = Math.floor(originalDate.getTime() / 1e3);
    return addLeadingZeros(timestamp, token.length);
  },
  // Milliseconds timestamp
  T: function T(date, token, _localize, options) {
    var originalDate = options._originalDate || date;
    var timestamp = originalDate.getTime();
    return addLeadingZeros(timestamp, token.length);
  }
};
function formatTimezoneShort(offset2, dirtyDelimiter) {
  var sign = offset2 > 0 ? "-" : "+";
  var absOffset = Math.abs(offset2);
  var hours = Math.floor(absOffset / 60);
  var minutes = absOffset % 60;
  if (minutes === 0) {
    return sign + String(hours);
  }
  var delimiter = dirtyDelimiter || "";
  return sign + String(hours) + delimiter + addLeadingZeros(minutes, 2);
}
function formatTimezoneWithOptionalMinutes(offset2, dirtyDelimiter) {
  if (offset2 % 60 === 0) {
    var sign = offset2 > 0 ? "-" : "+";
    return sign + addLeadingZeros(Math.abs(offset2) / 60, 2);
  }
  return formatTimezone(offset2, dirtyDelimiter);
}
function formatTimezone(offset2, dirtyDelimiter) {
  var delimiter = dirtyDelimiter || "";
  var sign = offset2 > 0 ? "-" : "+";
  var absOffset = Math.abs(offset2);
  var hours = addLeadingZeros(Math.floor(absOffset / 60), 2);
  var minutes = addLeadingZeros(absOffset % 60, 2);
  return sign + hours + delimiter + minutes;
}
var formatters_default = formatters2;

// node_modules/date-fns/esm/_lib/format/longFormatters/index.js
var dateLongFormatter = function dateLongFormatter2(pattern, formatLong2) {
  switch (pattern) {
    case "P":
      return formatLong2.date({
        width: "short"
      });
    case "PP":
      return formatLong2.date({
        width: "medium"
      });
    case "PPP":
      return formatLong2.date({
        width: "long"
      });
    case "PPPP":
    default:
      return formatLong2.date({
        width: "full"
      });
  }
};
var timeLongFormatter = function timeLongFormatter2(pattern, formatLong2) {
  switch (pattern) {
    case "p":
      return formatLong2.time({
        width: "short"
      });
    case "pp":
      return formatLong2.time({
        width: "medium"
      });
    case "ppp":
      return formatLong2.time({
        width: "long"
      });
    case "pppp":
    default:
      return formatLong2.time({
        width: "full"
      });
  }
};
var dateTimeLongFormatter = function dateTimeLongFormatter2(pattern, formatLong2) {
  var matchResult = pattern.match(/(P+)(p+)?/) || [];
  var datePattern = matchResult[1];
  var timePattern = matchResult[2];
  if (!timePattern) {
    return dateLongFormatter(pattern, formatLong2);
  }
  var dateTimeFormat;
  switch (datePattern) {
    case "P":
      dateTimeFormat = formatLong2.dateTime({
        width: "short"
      });
      break;
    case "PP":
      dateTimeFormat = formatLong2.dateTime({
        width: "medium"
      });
      break;
    case "PPP":
      dateTimeFormat = formatLong2.dateTime({
        width: "long"
      });
      break;
    case "PPPP":
    default:
      dateTimeFormat = formatLong2.dateTime({
        width: "full"
      });
      break;
  }
  return dateTimeFormat.replace("{{date}}", dateLongFormatter(datePattern, formatLong2)).replace("{{time}}", timeLongFormatter(timePattern, formatLong2));
};
var longFormatters = {
  p: timeLongFormatter,
  P: dateTimeLongFormatter
};
var longFormatters_default = longFormatters;

// node_modules/date-fns/esm/_lib/getTimezoneOffsetInMilliseconds/index.js
function getTimezoneOffsetInMilliseconds(date) {
  var utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
  utcDate.setUTCFullYear(date.getFullYear());
  return date.getTime() - utcDate.getTime();
}

// node_modules/date-fns/esm/_lib/protectedTokens/index.js
var protectedDayOfYearTokens = ["D", "DD"];
var protectedWeekYearTokens = ["YY", "YYYY"];
function isProtectedDayOfYearToken(token) {
  return protectedDayOfYearTokens.indexOf(token) !== -1;
}
function isProtectedWeekYearToken(token) {
  return protectedWeekYearTokens.indexOf(token) !== -1;
}
function throwProtectedError(token, format2, input) {
  if (token === "YYYY") {
    throw new RangeError("Use `yyyy` instead of `YYYY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === "YY") {
    throw new RangeError("Use `yy` instead of `YY` (in `".concat(format2, "`) for formatting years to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === "D") {
    throw new RangeError("Use `d` instead of `D` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  } else if (token === "DD") {
    throw new RangeError("Use `dd` instead of `DD` (in `".concat(format2, "`) for formatting days of the month to the input `").concat(input, "`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md"));
  }
}

// node_modules/date-fns/esm/locale/en-US/_lib/formatDistance/index.js
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: "less than a second",
    other: "less than {{count}} seconds"
  },
  xSeconds: {
    one: "1 second",
    other: "{{count}} seconds"
  },
  halfAMinute: "half a minute",
  lessThanXMinutes: {
    one: "less than a minute",
    other: "less than {{count}} minutes"
  },
  xMinutes: {
    one: "1 minute",
    other: "{{count}} minutes"
  },
  aboutXHours: {
    one: "about 1 hour",
    other: "about {{count}} hours"
  },
  xHours: {
    one: "1 hour",
    other: "{{count}} hours"
  },
  xDays: {
    one: "1 day",
    other: "{{count}} days"
  },
  aboutXWeeks: {
    one: "about 1 week",
    other: "about {{count}} weeks"
  },
  xWeeks: {
    one: "1 week",
    other: "{{count}} weeks"
  },
  aboutXMonths: {
    one: "about 1 month",
    other: "about {{count}} months"
  },
  xMonths: {
    one: "1 month",
    other: "{{count}} months"
  },
  aboutXYears: {
    one: "about 1 year",
    other: "about {{count}} years"
  },
  xYears: {
    one: "1 year",
    other: "{{count}} years"
  },
  overXYears: {
    one: "over 1 year",
    other: "over {{count}} years"
  },
  almostXYears: {
    one: "almost 1 year",
    other: "almost {{count}} years"
  }
};
var formatDistance = function formatDistance2(token, count, options) {
  var result;
  var tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", count.toString());
  }
  if (options !== null && options !== void 0 && options.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return "in " + result;
    } else {
      return result + " ago";
    }
  }
  return result;
};
var formatDistance_default = formatDistance;

// node_modules/date-fns/esm/locale/_lib/buildFormatLongFn/index.js
function buildFormatLongFn(args) {
  return function() {
    var options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    var width = options.width ? String(options.width) : args.defaultWidth;
    var format2 = args.formats[width] || args.formats[args.defaultWidth];
    return format2;
  };
}

// node_modules/date-fns/esm/locale/en-US/_lib/formatLong/index.js
var dateFormats = {
  full: "EEEE, MMMM do, y",
  long: "MMMM do, y",
  medium: "MMM d, y",
  short: "MM/dd/yyyy"
};
var timeFormats = {
  full: "h:mm:ss a zzzz",
  long: "h:mm:ss a z",
  medium: "h:mm:ss a",
  short: "h:mm a"
};
var dateTimeFormats = {
  full: "{{date}} 'at' {{time}}",
  long: "{{date}} 'at' {{time}}",
  medium: "{{date}}, {{time}}",
  short: "{{date}}, {{time}}"
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};
var formatLong_default = formatLong;

// node_modules/date-fns/esm/locale/en-US/_lib/formatRelative/index.js
var formatRelativeLocale = {
  lastWeek: "'last' eeee 'at' p",
  yesterday: "'yesterday at' p",
  today: "'today at' p",
  tomorrow: "'tomorrow at' p",
  nextWeek: "eeee 'at' p",
  other: "P"
};
var formatRelative = function formatRelative2(token, _date, _baseDate, _options) {
  return formatRelativeLocale[token];
};
var formatRelative_default = formatRelative;

// node_modules/date-fns/esm/locale/_lib/buildLocalizeFn/index.js
function buildLocalizeFn(args) {
  return function(dirtyIndex, options) {
    var context = options !== null && options !== void 0 && options.context ? String(options.context) : "standalone";
    var valuesArray;
    if (context === "formatting" && args.formattingValues) {
      var defaultWidth = args.defaultFormattingWidth || args.defaultWidth;
      var width = options !== null && options !== void 0 && options.width ? String(options.width) : defaultWidth;
      valuesArray = args.formattingValues[width] || args.formattingValues[defaultWidth];
    } else {
      var _defaultWidth = args.defaultWidth;
      var _width = options !== null && options !== void 0 && options.width ? String(options.width) : args.defaultWidth;
      valuesArray = args.values[_width] || args.values[_defaultWidth];
    }
    var index = args.argumentCallback ? args.argumentCallback(dirtyIndex) : dirtyIndex;
    return valuesArray[index];
  };
}

// node_modules/date-fns/esm/locale/en-US/_lib/localize/index.js
var eraValues = {
  narrow: ["B", "A"],
  abbreviated: ["BC", "AD"],
  wide: ["Before Christ", "Anno Domini"]
};
var quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["Q1", "Q2", "Q3", "Q4"],
  wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
};
var monthValues = {
  narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};
var dayValues = {
  narrow: ["S", "M", "T", "W", "T", "F", "S"],
  short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
  abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};
var dayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "morning",
    afternoon: "afternoon",
    evening: "evening",
    night: "night"
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: "a",
    pm: "p",
    midnight: "mi",
    noon: "n",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  abbreviated: {
    am: "AM",
    pm: "PM",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  },
  wide: {
    am: "a.m.",
    pm: "p.m.",
    midnight: "midnight",
    noon: "noon",
    morning: "in the morning",
    afternoon: "in the afternoon",
    evening: "in the evening",
    night: "at night"
  }
};
var ordinalNumber = function ordinalNumber2(dirtyNumber, _options) {
  var number = Number(dirtyNumber);
  var rem100 = number % 100;
  if (rem100 > 20 || rem100 < 10) {
    switch (rem100 % 10) {
      case 1:
        return number + "st";
      case 2:
        return number + "nd";
      case 3:
        return number + "rd";
    }
  }
  return number + "th";
};
var localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: function argumentCallback(quarter) {
      return quarter - 1;
    }
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};
var localize_default = localize;

// node_modules/date-fns/esm/locale/_lib/buildMatchFn/index.js
function buildMatchFn(args) {
  return function(string) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var width = options.width;
    var matchPattern = width && args.matchPatterns[width] || args.matchPatterns[args.defaultMatchWidth];
    var matchResult = string.match(matchPattern);
    if (!matchResult) {
      return null;
    }
    var matchedString = matchResult[0];
    var parsePatterns = width && args.parsePatterns[width] || args.parsePatterns[args.defaultParseWidth];
    var key = Array.isArray(parsePatterns) ? findIndex(parsePatterns, function(pattern) {
      return pattern.test(matchedString);
    }) : findKey(parsePatterns, function(pattern) {
      return pattern.test(matchedString);
    });
    var value;
    value = args.valueCallback ? args.valueCallback(key) : key;
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value,
      rest
    };
  };
}
function findKey(object, predicate) {
  for (var key in object) {
    if (object.hasOwnProperty(key) && predicate(object[key])) {
      return key;
    }
  }
  return void 0;
}
function findIndex(array, predicate) {
  for (var key = 0; key < array.length; key++) {
    if (predicate(array[key])) {
      return key;
    }
  }
  return void 0;
}

// node_modules/date-fns/esm/locale/_lib/buildMatchPatternFn/index.js
function buildMatchPatternFn(args) {
  return function(string) {
    var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var matchResult = string.match(args.matchPattern);
    if (!matchResult) return null;
    var matchedString = matchResult[0];
    var parseResult = string.match(args.parsePattern);
    if (!parseResult) return null;
    var value = args.valueCallback ? args.valueCallback(parseResult[0]) : parseResult[0];
    value = options.valueCallback ? options.valueCallback(value) : value;
    var rest = string.slice(matchedString.length);
    return {
      value,
      rest
    };
  };
}

// node_modules/date-fns/esm/locale/en-US/_lib/match/index.js
var matchOrdinalNumberPattern = /^(\d+)(th|st|nd|rd)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(b|a)/i,
  abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
  wide: /^(before christ|before common era|anno domini|common era)/i
};
var parseEraPatterns = {
  any: [/^b/i, /^(a|c)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^q[1234]/i,
  wide: /^[1234](th|st|nd|rd)? quarter/i
};
var parseQuarterPatterns = {
  any: [/1/i, /2/i, /3/i, /4/i]
};
var matchMonthPatterns = {
  narrow: /^[jfmasond]/i,
  abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
  wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
};
var parseMonthPatterns = {
  narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
  any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
};
var matchDayPatterns = {
  narrow: /^[smtwf]/i,
  short: /^(su|mo|tu|we|th|fr|sa)/i,
  abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
  wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
};
var parseDayPatterns = {
  narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
  any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
};
var matchDayPeriodPatterns = {
  narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
  any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^a/i,
    pm: /^p/i,
    midnight: /^mi/i,
    noon: /^no/i,
    morning: /morning/i,
    afternoon: /afternoon/i,
    evening: /evening/i,
    night: /night/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: function valueCallback(value) {
      return parseInt(value, 10);
    }
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: function valueCallback2(index) {
      return index + 1;
    }
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};
var match_default = match;

// node_modules/date-fns/esm/locale/en-US/index.js
var locale = {
  code: "en-US",
  formatDistance: formatDistance_default,
  formatLong: formatLong_default,
  formatRelative: formatRelative_default,
  localize: localize_default,
  match: match_default,
  options: {
    weekStartsOn: 0,
    firstWeekContainsDate: 1
  }
};
var en_US_default = locale;

// node_modules/date-fns/esm/_lib/defaultLocale/index.js
var defaultLocale_default = en_US_default;

// node_modules/date-fns/esm/format/index.js
var formattingTokensRegExp = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp = /^'([^]*?)'?$/;
var doubleQuoteRegExp = /''/g;
var unescapedLatinCharacterRegExp = /[a-zA-Z]/;
function format(dirtyDate, dirtyFormatStr, options) {
  var _ref, _options$locale, _ref2, _ref3, _ref4, _options$firstWeekCon, _options$locale2, _options$locale2$opti, _defaultOptions$local, _defaultOptions$local2, _ref5, _ref6, _ref7, _options$weekStartsOn, _options$locale3, _options$locale3$opti, _defaultOptions$local3, _defaultOptions$local4;
  requiredArgs(2, arguments);
  var formatStr = String(dirtyFormatStr);
  var defaultOptions2 = getDefaultOptions();
  var locale2 = (_ref = (_options$locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions2.locale) !== null && _ref !== void 0 ? _ref : defaultLocale_default;
  var firstWeekContainsDate = toInteger((_ref2 = (_ref3 = (_ref4 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale2 = options.locale) === null || _options$locale2 === void 0 ? void 0 : (_options$locale2$opti = _options$locale2.options) === null || _options$locale2$opti === void 0 ? void 0 : _options$locale2$opti.firstWeekContainsDate) !== null && _ref4 !== void 0 ? _ref4 : defaultOptions2.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : 1);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var weekStartsOn = toInteger((_ref5 = (_ref6 = (_ref7 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale3 = options.locale) === null || _options$locale3 === void 0 ? void 0 : (_options$locale3$opti = _options$locale3.options) === null || _options$locale3$opti === void 0 ? void 0 : _options$locale3$opti.weekStartsOn) !== null && _ref7 !== void 0 ? _ref7 : defaultOptions2.weekStartsOn) !== null && _ref6 !== void 0 ? _ref6 : (_defaultOptions$local3 = defaultOptions2.locale) === null || _defaultOptions$local3 === void 0 ? void 0 : (_defaultOptions$local4 = _defaultOptions$local3.options) === null || _defaultOptions$local4 === void 0 ? void 0 : _defaultOptions$local4.weekStartsOn) !== null && _ref5 !== void 0 ? _ref5 : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  if (!locale2.localize) {
    throw new RangeError("locale must contain localize property");
  }
  if (!locale2.formatLong) {
    throw new RangeError("locale must contain formatLong property");
  }
  var originalDate = toDate(dirtyDate);
  if (!isValid(originalDate)) {
    throw new RangeError("Invalid time value");
  }
  var timezoneOffset = getTimezoneOffsetInMilliseconds(originalDate);
  var utcDate = subMilliseconds(originalDate, timezoneOffset);
  var formatterOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale: locale2,
    _originalDate: originalDate
  };
  var result = formatStr.match(longFormattingTokensRegExp).map(function(substring) {
    var firstCharacter = substring[0];
    if (firstCharacter === "p" || firstCharacter === "P") {
      var longFormatter = longFormatters_default[firstCharacter];
      return longFormatter(substring, locale2.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp).map(function(substring) {
    if (substring === "''") {
      return "'";
    }
    var firstCharacter = substring[0];
    if (firstCharacter === "'") {
      return cleanEscapedString(substring);
    }
    var formatter = formatters_default[firstCharacter];
    if (formatter) {
      if (!(options !== null && options !== void 0 && options.useAdditionalWeekYearTokens) && isProtectedWeekYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
      }
      if (!(options !== null && options !== void 0 && options.useAdditionalDayOfYearTokens) && isProtectedDayOfYearToken(substring)) {
        throwProtectedError(substring, dirtyFormatStr, String(dirtyDate));
      }
      return formatter(utcDate, substring, locale2.localize, formatterOptions);
    }
    if (firstCharacter.match(unescapedLatinCharacterRegExp)) {
      throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
    }
    return substring;
  }).join("");
  return result;
}
function cleanEscapedString(input) {
  var matched = input.match(escapedStringRegExp);
  if (!matched) {
    return input;
  }
  return matched[1].replace(doubleQuoteRegExp, "'");
}

// node_modules/date-fns/esm/addMinutes/index.js
var MILLISECONDS_IN_MINUTE = 6e4;
function addMinutes(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_MINUTE);
}

// node_modules/date-fns/esm/addHours/index.js
var MILLISECONDS_IN_HOUR = 36e5;
function addHours(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMilliseconds(dirtyDate, amount * MILLISECONDS_IN_HOUR);
}

// node_modules/date-fns/esm/addDays/index.js
function addDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);
  if (isNaN(amount)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  if (!amount) {
    return date;
  }
  date.setDate(date.getDate() + amount);
  return date;
}

// node_modules/date-fns/esm/addWeeks/index.js
function addWeeks(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  var days = amount * 7;
  return addDays(dirtyDate, days);
}

// node_modules/date-fns/esm/addMonths/index.js
function addMonths(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);
  if (isNaN(amount)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  if (!amount) {
    return date;
  }
  var dayOfMonth = date.getDate();
  var endOfDesiredMonth = new Date(date.getTime());
  endOfDesiredMonth.setMonth(date.getMonth() + amount + 1, 0);
  var daysInMonth = endOfDesiredMonth.getDate();
  if (dayOfMonth >= daysInMonth) {
    return endOfDesiredMonth;
  } else {
    date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
    return date;
  }
}

// node_modules/date-fns/esm/addQuarters/index.js
function addQuarters(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  var months = amount * 3;
  return addMonths(dirtyDate, months);
}

// node_modules/date-fns/esm/addYears/index.js
function addYears(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMonths(dirtyDate, amount * 12);
}

// node_modules/date-fns/esm/subDays/index.js
function subDays(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addDays(dirtyDate, -amount);
}

// node_modules/date-fns/esm/subWeeks/index.js
function subWeeks(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addWeeks(dirtyDate, -amount);
}

// node_modules/date-fns/esm/subMonths/index.js
function subMonths(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addMonths(dirtyDate, -amount);
}

// node_modules/date-fns/esm/subQuarters/index.js
function subQuarters(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addQuarters(dirtyDate, -amount);
}

// node_modules/date-fns/esm/subYears/index.js
function subYears(dirtyDate, dirtyAmount) {
  requiredArgs(2, arguments);
  var amount = toInteger(dirtyAmount);
  return addYears(dirtyDate, -amount);
}

// node_modules/date-fns/esm/getSeconds/index.js
function getSeconds(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var seconds = date.getSeconds();
  return seconds;
}

// node_modules/date-fns/esm/getMinutes/index.js
function getMinutes(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var minutes = date.getMinutes();
  return minutes;
}

// node_modules/date-fns/esm/getHours/index.js
function getHours(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var hours = date.getHours();
  return hours;
}

// node_modules/date-fns/esm/getDay/index.js
function getDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var day = date.getDay();
  return day;
}

// node_modules/date-fns/esm/getDate/index.js
function getDate(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var dayOfMonth = date.getDate();
  return dayOfMonth;
}

// node_modules/date-fns/esm/startOfWeek/index.js
function startOfWeek(dirtyDate, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(1, arguments);
  var defaultOptions2 = getDefaultOptions();
  var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = date.getDay();
  var diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/startOfISOWeek/index.js
function startOfISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  return startOfWeek(dirtyDate, {
    weekStartsOn: 1
  });
}

// node_modules/date-fns/esm/getISOWeekYear/index.js
function getISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var fourthOfJanuaryOfNextYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  var startOfNextYear = startOfISOWeek(fourthOfJanuaryOfNextYear);
  var fourthOfJanuaryOfThisYear = /* @__PURE__ */ new Date(0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  var startOfThisYear = startOfISOWeek(fourthOfJanuaryOfThisYear);
  if (date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// node_modules/date-fns/esm/startOfISOWeekYear/index.js
function startOfISOWeekYear(dirtyDate) {
  requiredArgs(1, arguments);
  var year = getISOWeekYear(dirtyDate);
  var fourthOfJanuary = /* @__PURE__ */ new Date(0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  var date = startOfISOWeek(fourthOfJanuary);
  return date;
}

// node_modules/date-fns/esm/getISOWeek/index.js
var MILLISECONDS_IN_WEEK3 = 6048e5;
function getISOWeek(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var diff = startOfISOWeek(date).getTime() - startOfISOWeekYear(date).getTime();
  return Math.round(diff / MILLISECONDS_IN_WEEK3) + 1;
}

// node_modules/date-fns/esm/getMonth/index.js
function getMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var month = date.getMonth();
  return month;
}

// node_modules/date-fns/esm/getQuarter/index.js
function getQuarter(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var quarter = Math.floor(date.getMonth() / 3) + 1;
  return quarter;
}

// node_modules/date-fns/esm/getYear/index.js
function getYear(dirtyDate) {
  requiredArgs(1, arguments);
  return toDate(dirtyDate).getFullYear();
}

// node_modules/date-fns/esm/getTime/index.js
function getTime(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var timestamp = date.getTime();
  return timestamp;
}

// node_modules/date-fns/esm/setSeconds/index.js
function setSeconds(dirtyDate, dirtySeconds) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var seconds = toInteger(dirtySeconds);
  date.setSeconds(seconds);
  return date;
}

// node_modules/date-fns/esm/setMinutes/index.js
function setMinutes(dirtyDate, dirtyMinutes) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var minutes = toInteger(dirtyMinutes);
  date.setMinutes(minutes);
  return date;
}

// node_modules/date-fns/esm/setHours/index.js
function setHours(dirtyDate, dirtyHours) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var hours = toInteger(dirtyHours);
  date.setHours(hours);
  return date;
}

// node_modules/date-fns/esm/getDaysInMonth/index.js
function getDaysInMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  var monthIndex = date.getMonth();
  var lastDayOfMonth = /* @__PURE__ */ new Date(0);
  lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return lastDayOfMonth.getDate();
}

// node_modules/date-fns/esm/setMonth/index.js
function setMonth(dirtyDate, dirtyMonth) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var month = toInteger(dirtyMonth);
  var year = date.getFullYear();
  var day = date.getDate();
  var dateWithDesiredMonth = /* @__PURE__ */ new Date(0);
  dateWithDesiredMonth.setFullYear(year, month, 15);
  dateWithDesiredMonth.setHours(0, 0, 0, 0);
  var daysInMonth = getDaysInMonth(dateWithDesiredMonth);
  date.setMonth(month, Math.min(day, daysInMonth));
  return date;
}

// node_modules/date-fns/esm/setQuarter/index.js
function setQuarter(dirtyDate, dirtyQuarter) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var quarter = toInteger(dirtyQuarter);
  var oldQuarter = Math.floor(date.getMonth() / 3) + 1;
  var diff = quarter - oldQuarter;
  return setMonth(date, date.getMonth() + diff * 3);
}

// node_modules/date-fns/esm/setYear/index.js
function setYear(dirtyDate, dirtyYear) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var year = toInteger(dirtyYear);
  if (isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date(NaN);
  }
  date.setFullYear(year);
  return date;
}

// node_modules/date-fns/esm/min/index.js
function min(dirtyDatesArray) {
  requiredArgs(1, arguments);
  var datesArray;
  if (dirtyDatesArray && typeof dirtyDatesArray.forEach === "function") {
    datesArray = dirtyDatesArray;
  } else if (_typeof(dirtyDatesArray) === "object" && dirtyDatesArray !== null) {
    datesArray = Array.prototype.slice.call(dirtyDatesArray);
  } else {
    return /* @__PURE__ */ new Date(NaN);
  }
  var result;
  datesArray.forEach(function(dirtyDate) {
    var currentDate = toDate(dirtyDate);
    if (result === void 0 || result > currentDate || isNaN(currentDate.getDate())) {
      result = currentDate;
    }
  });
  return result || /* @__PURE__ */ new Date(NaN);
}

// node_modules/date-fns/esm/max/index.js
function max(dirtyDatesArray) {
  requiredArgs(1, arguments);
  var datesArray;
  if (dirtyDatesArray && typeof dirtyDatesArray.forEach === "function") {
    datesArray = dirtyDatesArray;
  } else if (_typeof(dirtyDatesArray) === "object" && dirtyDatesArray !== null) {
    datesArray = Array.prototype.slice.call(dirtyDatesArray);
  } else {
    return /* @__PURE__ */ new Date(NaN);
  }
  var result;
  datesArray.forEach(function(dirtyDate) {
    var currentDate = toDate(dirtyDate);
    if (result === void 0 || result < currentDate || isNaN(Number(currentDate))) {
      result = currentDate;
    }
  });
  return result || /* @__PURE__ */ new Date(NaN);
}

// node_modules/date-fns/esm/startOfDay/index.js
function startOfDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/differenceInCalendarDays/index.js
var MILLISECONDS_IN_DAY2 = 864e5;
function differenceInCalendarDays(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var startOfDayLeft = startOfDay(dirtyDateLeft);
  var startOfDayRight = startOfDay(dirtyDateRight);
  var timestampLeft = startOfDayLeft.getTime() - getTimezoneOffsetInMilliseconds(startOfDayLeft);
  var timestampRight = startOfDayRight.getTime() - getTimezoneOffsetInMilliseconds(startOfDayRight);
  return Math.round((timestampLeft - timestampRight) / MILLISECONDS_IN_DAY2);
}

// node_modules/date-fns/esm/differenceInCalendarMonths/index.js
function differenceInCalendarMonths(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  var yearDiff = dateLeft.getFullYear() - dateRight.getFullYear();
  var monthDiff = dateLeft.getMonth() - dateRight.getMonth();
  return yearDiff * 12 + monthDiff;
}

// node_modules/date-fns/esm/differenceInCalendarYears/index.js
function differenceInCalendarYears(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  return dateLeft.getFullYear() - dateRight.getFullYear();
}

// node_modules/date-fns/esm/startOfMonth/index.js
function startOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/startOfQuarter/index.js
function startOfQuarter(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var currentMonth = date.getMonth();
  var month = currentMonth - currentMonth % 3;
  date.setMonth(month, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/startOfYear/index.js
function startOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var cleanDate = toDate(dirtyDate);
  var date = /* @__PURE__ */ new Date(0);
  date.setFullYear(cleanDate.getFullYear(), 0, 1);
  date.setHours(0, 0, 0, 0);
  return date;
}

// node_modules/date-fns/esm/endOfDay/index.js
function endOfDay(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  date.setHours(23, 59, 59, 999);
  return date;
}

// node_modules/date-fns/esm/endOfMonth/index.js
function endOfMonth(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var month = date.getMonth();
  date.setFullYear(date.getFullYear(), month + 1, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

// node_modules/date-fns/esm/endOfYear/index.js
function endOfYear(dirtyDate) {
  requiredArgs(1, arguments);
  var date = toDate(dirtyDate);
  var year = date.getFullYear();
  date.setFullYear(year + 1, 0, 0);
  date.setHours(23, 59, 59, 999);
  return date;
}

// node_modules/date-fns/esm/isEqual/index.js
function isEqual(dirtyLeftDate, dirtyRightDate) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyLeftDate);
  var dateRight = toDate(dirtyRightDate);
  return dateLeft.getTime() === dateRight.getTime();
}

// node_modules/date-fns/esm/isSameDay/index.js
function isSameDay(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeftStartOfDay = startOfDay(dirtyDateLeft);
  var dateRightStartOfDay = startOfDay(dirtyDateRight);
  return dateLeftStartOfDay.getTime() === dateRightStartOfDay.getTime();
}

// node_modules/date-fns/esm/isSameMonth/index.js
function isSameMonth(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  return dateLeft.getFullYear() === dateRight.getFullYear() && dateLeft.getMonth() === dateRight.getMonth();
}

// node_modules/date-fns/esm/isSameYear/index.js
function isSameYear(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeft = toDate(dirtyDateLeft);
  var dateRight = toDate(dirtyDateRight);
  return dateLeft.getFullYear() === dateRight.getFullYear();
}

// node_modules/date-fns/esm/isSameQuarter/index.js
function isSameQuarter(dirtyDateLeft, dirtyDateRight) {
  requiredArgs(2, arguments);
  var dateLeftStartOfQuarter = startOfQuarter(dirtyDateLeft);
  var dateRightStartOfQuarter = startOfQuarter(dirtyDateRight);
  return dateLeftStartOfQuarter.getTime() === dateRightStartOfQuarter.getTime();
}

// node_modules/date-fns/esm/isAfter/index.js
function isAfter(dirtyDate, dirtyDateToCompare) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var dateToCompare = toDate(dirtyDateToCompare);
  return date.getTime() > dateToCompare.getTime();
}

// node_modules/date-fns/esm/isBefore/index.js
function isBefore(dirtyDate, dirtyDateToCompare) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var dateToCompare = toDate(dirtyDateToCompare);
  return date.getTime() < dateToCompare.getTime();
}

// node_modules/date-fns/esm/isWithinInterval/index.js
function isWithinInterval(dirtyDate, interval) {
  requiredArgs(2, arguments);
  var time = toDate(dirtyDate).getTime();
  var startTime = toDate(interval.start).getTime();
  var endTime = toDate(interval.end).getTime();
  if (!(startTime <= endTime)) {
    throw new RangeError("Invalid interval");
  }
  return time >= startTime && time <= endTime;
}

// node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
function _arrayLikeToArray(r2, a3) {
  (null == a3 || a3 > r2.length) && (a3 = r2.length);
  for (var e3 = 0, n = Array(a3); e3 < a3; e3++) n[e3] = r2[e3];
  return n;
}

// node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
function _unsupportedIterableToArray(r2, a3) {
  if (r2) {
    if ("string" == typeof r2) return _arrayLikeToArray(r2, a3);
    var t3 = {}.toString.call(r2).slice(8, -1);
    return "Object" === t3 && r2.constructor && (t3 = r2.constructor.name), "Map" === t3 || "Set" === t3 ? Array.from(r2) : "Arguments" === t3 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t3) ? _arrayLikeToArray(r2, a3) : void 0;
  }
}

// node_modules/@babel/runtime/helpers/esm/createForOfIteratorHelper.js
function _createForOfIteratorHelper(r2, e3) {
  var t3 = "undefined" != typeof Symbol && r2[Symbol.iterator] || r2["@@iterator"];
  if (!t3) {
    if (Array.isArray(r2) || (t3 = _unsupportedIterableToArray(r2)) || e3 && r2 && "number" == typeof r2.length) {
      t3 && (r2 = t3);
      var _n = 0, F = function F2() {
      };
      return {
        s: F,
        n: function n() {
          return _n >= r2.length ? {
            done: true
          } : {
            done: false,
            value: r2[_n++]
          };
        },
        e: function e4(r3) {
          throw r3;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o, a3 = true, u2 = false;
  return {
    s: function s3() {
      t3 = t3.call(r2);
    },
    n: function n() {
      var r3 = t3.next();
      return a3 = r3.done, r3;
    },
    e: function e4(r3) {
      u2 = true, o = r3;
    },
    f: function f() {
      try {
        a3 || null == t3["return"] || t3["return"]();
      } finally {
        if (u2) throw o;
      }
    }
  };
}

// node_modules/date-fns/esm/_lib/assign/index.js
function assign(target, object) {
  if (target == null) {
    throw new TypeError("assign requires that input parameter not be null or undefined");
  }
  for (var property in object) {
    if (Object.prototype.hasOwnProperty.call(object, property)) {
      ;
      target[property] = object[property];
    }
  }
  return target;
}

// node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(e3) {
  if (void 0 === e3) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e3;
}

// node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(t3, e3) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t4, e4) {
    return t4.__proto__ = e4, t4;
  }, _setPrototypeOf(t3, e3);
}

// node_modules/@babel/runtime/helpers/esm/inherits.js
function _inherits(t3, e3) {
  if ("function" != typeof e3 && null !== e3) throw new TypeError("Super expression must either be null or a function");
  t3.prototype = Object.create(e3 && e3.prototype, {
    constructor: {
      value: t3,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t3, "prototype", {
    writable: false
  }), e3 && _setPrototypeOf(t3, e3);
}

// node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
function _getPrototypeOf(t3) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t4) {
    return t4.__proto__ || Object.getPrototypeOf(t4);
  }, _getPrototypeOf(t3);
}

// node_modules/@babel/runtime/helpers/esm/isNativeReflectConstruct.js
function _isNativeReflectConstruct() {
  try {
    var t3 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    }));
  } catch (t4) {
  }
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct2() {
    return !!t3;
  })();
}

// node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
function _possibleConstructorReturn(t3, e3) {
  if (e3 && ("object" == _typeof(e3) || "function" == typeof e3)) return e3;
  if (void 0 !== e3) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t3);
}

// node_modules/@babel/runtime/helpers/esm/createSuper.js
function _createSuper(t3) {
  var r2 = _isNativeReflectConstruct();
  return function() {
    var e3, o = _getPrototypeOf(t3);
    if (r2) {
      var s3 = _getPrototypeOf(this).constructor;
      e3 = Reflect.construct(o, arguments, s3);
    } else e3 = o.apply(this, arguments);
    return _possibleConstructorReturn(this, e3);
  };
}

// node_modules/@babel/runtime/helpers/esm/classCallCheck.js
function _classCallCheck(a3, n) {
  if (!(a3 instanceof n)) throw new TypeError("Cannot call a class as a function");
}

// node_modules/@babel/runtime/helpers/esm/toPrimitive.js
function toPrimitive(t3, r2) {
  if ("object" != _typeof(t3) || !t3) return t3;
  var e3 = t3[Symbol.toPrimitive];
  if (void 0 !== e3) {
    var i2 = e3.call(t3, r2 || "default");
    if ("object" != _typeof(i2)) return i2;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r2 ? String : Number)(t3);
}

// node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
function toPropertyKey(t3) {
  var i2 = toPrimitive(t3, "string");
  return "symbol" == _typeof(i2) ? i2 : i2 + "";
}

// node_modules/@babel/runtime/helpers/esm/createClass.js
function _defineProperties(e3, r2) {
  for (var t3 = 0; t3 < r2.length; t3++) {
    var o = r2[t3];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e3, toPropertyKey(o.key), o);
  }
}
function _createClass(e3, r2, t3) {
  return r2 && _defineProperties(e3.prototype, r2), t3 && _defineProperties(e3, t3), Object.defineProperty(e3, "prototype", {
    writable: false
  }), e3;
}

// node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(e3, r2, t3) {
  return (r2 = toPropertyKey(r2)) in e3 ? Object.defineProperty(e3, r2, {
    value: t3,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e3[r2] = t3, e3;
}

// node_modules/date-fns/esm/parse/_lib/Setter.js
var TIMEZONE_UNIT_PRIORITY = 10;
var Setter = function() {
  function Setter2() {
    _classCallCheck(this, Setter2);
    _defineProperty(this, "priority", void 0);
    _defineProperty(this, "subPriority", 0);
  }
  _createClass(Setter2, [{
    key: "validate",
    value: function validate(_utcDate, _options) {
      return true;
    }
  }]);
  return Setter2;
}();
var ValueSetter = function(_Setter) {
  _inherits(ValueSetter2, _Setter);
  var _super = _createSuper(ValueSetter2);
  function ValueSetter2(value, validateValue, setValue, priority, subPriority) {
    var _this;
    _classCallCheck(this, ValueSetter2);
    _this = _super.call(this);
    _this.value = value;
    _this.validateValue = validateValue;
    _this.setValue = setValue;
    _this.priority = priority;
    if (subPriority) {
      _this.subPriority = subPriority;
    }
    return _this;
  }
  _createClass(ValueSetter2, [{
    key: "validate",
    value: function validate(utcDate, options) {
      return this.validateValue(utcDate, this.value, options);
    }
  }, {
    key: "set",
    value: function set2(utcDate, flags, options) {
      return this.setValue(utcDate, flags, this.value, options);
    }
  }]);
  return ValueSetter2;
}(Setter);
var DateToSystemTimezoneSetter = function(_Setter2) {
  _inherits(DateToSystemTimezoneSetter2, _Setter2);
  var _super2 = _createSuper(DateToSystemTimezoneSetter2);
  function DateToSystemTimezoneSetter2() {
    var _this2;
    _classCallCheck(this, DateToSystemTimezoneSetter2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this2 = _super2.call.apply(_super2, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this2), "priority", TIMEZONE_UNIT_PRIORITY);
    _defineProperty(_assertThisInitialized(_this2), "subPriority", -1);
    return _this2;
  }
  _createClass(DateToSystemTimezoneSetter2, [{
    key: "set",
    value: function set2(date, flags) {
      if (flags.timestampIsSet) {
        return date;
      }
      var convertedDate = /* @__PURE__ */ new Date(0);
      convertedDate.setFullYear(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
      convertedDate.setHours(date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());
      return convertedDate;
    }
  }]);
  return DateToSystemTimezoneSetter2;
}(Setter);

// node_modules/date-fns/esm/parse/_lib/Parser.js
var Parser = function() {
  function Parser2() {
    _classCallCheck(this, Parser2);
    _defineProperty(this, "incompatibleTokens", void 0);
    _defineProperty(this, "priority", void 0);
    _defineProperty(this, "subPriority", void 0);
  }
  _createClass(Parser2, [{
    key: "run",
    value: function run(dateString, token, match2, options) {
      var result = this.parse(dateString, token, match2, options);
      if (!result) {
        return null;
      }
      return {
        setter: new ValueSetter(result.value, this.validate, this.set, this.priority, this.subPriority),
        rest: result.rest
      };
    }
  }, {
    key: "validate",
    value: function validate(_utcDate, _value, _options) {
      return true;
    }
  }]);
  return Parser2;
}();

// node_modules/date-fns/esm/parse/_lib/parsers/EraParser.js
var EraParser = function(_Parser) {
  _inherits(EraParser2, _Parser);
  var _super = _createSuper(EraParser2);
  function EraParser2() {
    var _this;
    _classCallCheck(this, EraParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 140);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["R", "u", "t", "T"]);
    return _this;
  }
  _createClass(EraParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        // AD, BC
        case "G":
        case "GG":
        case "GGG":
          return match2.era(dateString, {
            width: "abbreviated"
          }) || match2.era(dateString, {
            width: "narrow"
          });
        // A, B
        case "GGGGG":
          return match2.era(dateString, {
            width: "narrow"
          });
        // Anno Domini, Before Christ
        case "GGGG":
        default:
          return match2.era(dateString, {
            width: "wide"
          }) || match2.era(dateString, {
            width: "abbreviated"
          }) || match2.era(dateString, {
            width: "narrow"
          });
      }
    }
  }, {
    key: "set",
    value: function set2(date, flags, value) {
      flags.era = value;
      date.setUTCFullYear(value, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return EraParser2;
}(Parser);

// node_modules/date-fns/esm/constants/index.js
var daysInYear = 365.2425;
var maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1e3;
var millisecondsInMinute = 6e4;
var millisecondsInHour = 36e5;
var millisecondsInSecond = 1e3;
var minTime = -maxTime;
var secondsInHour = 3600;
var secondsInDay = secondsInHour * 24;
var secondsInWeek = secondsInDay * 7;
var secondsInYear = secondsInDay * daysInYear;
var secondsInMonth = secondsInYear / 12;
var secondsInQuarter = secondsInMonth * 3;

// node_modules/date-fns/esm/parse/_lib/constants.js
var numericPatterns = {
  month: /^(1[0-2]|0?\d)/,
  // 0 to 12
  date: /^(3[0-1]|[0-2]?\d)/,
  // 0 to 31
  dayOfYear: /^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,
  // 0 to 366
  week: /^(5[0-3]|[0-4]?\d)/,
  // 0 to 53
  hour23h: /^(2[0-3]|[0-1]?\d)/,
  // 0 to 23
  hour24h: /^(2[0-4]|[0-1]?\d)/,
  // 0 to 24
  hour11h: /^(1[0-1]|0?\d)/,
  // 0 to 11
  hour12h: /^(1[0-2]|0?\d)/,
  // 0 to 12
  minute: /^[0-5]?\d/,
  // 0 to 59
  second: /^[0-5]?\d/,
  // 0 to 59
  singleDigit: /^\d/,
  // 0 to 9
  twoDigits: /^\d{1,2}/,
  // 0 to 99
  threeDigits: /^\d{1,3}/,
  // 0 to 999
  fourDigits: /^\d{1,4}/,
  // 0 to 9999
  anyDigitsSigned: /^-?\d+/,
  singleDigitSigned: /^-?\d/,
  // 0 to 9, -0 to -9
  twoDigitsSigned: /^-?\d{1,2}/,
  // 0 to 99, -0 to -99
  threeDigitsSigned: /^-?\d{1,3}/,
  // 0 to 999, -0 to -999
  fourDigitsSigned: /^-?\d{1,4}/
  // 0 to 9999, -0 to -9999
};
var timezonePatterns = {
  basicOptionalMinutes: /^([+-])(\d{2})(\d{2})?|Z/,
  basic: /^([+-])(\d{2})(\d{2})|Z/,
  basicOptionalSeconds: /^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,
  extended: /^([+-])(\d{2}):(\d{2})|Z/,
  extendedOptionalSeconds: /^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/
};

// node_modules/date-fns/esm/parse/_lib/utils.js
function mapValue(parseFnResult, mapFn) {
  if (!parseFnResult) {
    return parseFnResult;
  }
  return {
    value: mapFn(parseFnResult.value),
    rest: parseFnResult.rest
  };
}
function parseNumericPattern(pattern, dateString) {
  var matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  return {
    value: parseInt(matchResult[0], 10),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseTimezonePattern(pattern, dateString) {
  var matchResult = dateString.match(pattern);
  if (!matchResult) {
    return null;
  }
  if (matchResult[0] === "Z") {
    return {
      value: 0,
      rest: dateString.slice(1)
    };
  }
  var sign = matchResult[1] === "+" ? 1 : -1;
  var hours = matchResult[2] ? parseInt(matchResult[2], 10) : 0;
  var minutes = matchResult[3] ? parseInt(matchResult[3], 10) : 0;
  var seconds = matchResult[5] ? parseInt(matchResult[5], 10) : 0;
  return {
    value: sign * (hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * millisecondsInSecond),
    rest: dateString.slice(matchResult[0].length)
  };
}
function parseAnyDigitsSigned(dateString) {
  return parseNumericPattern(numericPatterns.anyDigitsSigned, dateString);
}
function parseNDigits(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigit, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigits, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigits, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigits, dateString);
    default:
      return parseNumericPattern(new RegExp("^\\d{1," + n + "}"), dateString);
  }
}
function parseNDigitsSigned(n, dateString) {
  switch (n) {
    case 1:
      return parseNumericPattern(numericPatterns.singleDigitSigned, dateString);
    case 2:
      return parseNumericPattern(numericPatterns.twoDigitsSigned, dateString);
    case 3:
      return parseNumericPattern(numericPatterns.threeDigitsSigned, dateString);
    case 4:
      return parseNumericPattern(numericPatterns.fourDigitsSigned, dateString);
    default:
      return parseNumericPattern(new RegExp("^-?\\d{1," + n + "}"), dateString);
  }
}
function dayPeriodEnumToHours(dayPeriod) {
  switch (dayPeriod) {
    case "morning":
      return 4;
    case "evening":
      return 17;
    case "pm":
    case "noon":
    case "afternoon":
      return 12;
    case "am":
    case "midnight":
    case "night":
    default:
      return 0;
  }
}
function normalizeTwoDigitYear(twoDigitYear, currentYear) {
  var isCommonEra = currentYear > 0;
  var absCurrentYear = isCommonEra ? currentYear : 1 - currentYear;
  var result;
  if (absCurrentYear <= 50) {
    result = twoDigitYear || 100;
  } else {
    var rangeEnd = absCurrentYear + 50;
    var rangeEndCentury = Math.floor(rangeEnd / 100) * 100;
    var isPreviousCentury = twoDigitYear >= rangeEnd % 100;
    result = twoDigitYear + rangeEndCentury - (isPreviousCentury ? 100 : 0);
  }
  return isCommonEra ? result : 1 - result;
}
function isLeapYearIndex(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}

// node_modules/date-fns/esm/parse/_lib/parsers/YearParser.js
var YearParser = function(_Parser) {
  _inherits(YearParser2, _Parser);
  var _super = _createSuper(YearParser2);
  function YearParser2() {
    var _this;
    _classCallCheck(this, YearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 130);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "u", "w", "I", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(YearParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(year) {
        return {
          year,
          isTwoDigitYear: token === "yy"
        };
      };
      switch (token) {
        case "y":
          return mapValue(parseNDigits(4, dateString), valueCallback3);
        case "yo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "year"
          }), valueCallback3);
        default:
          return mapValue(parseNDigits(token.length, dateString), valueCallback3);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value.isTwoDigitYear || value.year > 0;
    }
  }, {
    key: "set",
    value: function set2(date, flags, value) {
      var currentYear = date.getUTCFullYear();
      if (value.isTwoDigitYear) {
        var normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
        date.setUTCFullYear(normalizedTwoDigitYear, 0, 1);
        date.setUTCHours(0, 0, 0, 0);
        return date;
      }
      var year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
      date.setUTCFullYear(year, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return YearParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/LocalWeekYearParser.js
var LocalWeekYearParser = function(_Parser) {
  _inherits(LocalWeekYearParser2, _Parser);
  var _super = _createSuper(LocalWeekYearParser2);
  function LocalWeekYearParser2() {
    var _this;
    _classCallCheck(this, LocalWeekYearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 130);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "R", "u", "Q", "q", "M", "L", "I", "d", "D", "i", "t", "T"]);
    return _this;
  }
  _createClass(LocalWeekYearParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(year) {
        return {
          year,
          isTwoDigitYear: token === "YY"
        };
      };
      switch (token) {
        case "Y":
          return mapValue(parseNDigits(4, dateString), valueCallback3);
        case "Yo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "year"
          }), valueCallback3);
        default:
          return mapValue(parseNDigits(token.length, dateString), valueCallback3);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value.isTwoDigitYear || value.year > 0;
    }
  }, {
    key: "set",
    value: function set2(date, flags, value, options) {
      var currentYear = getUTCWeekYear(date, options);
      if (value.isTwoDigitYear) {
        var normalizedTwoDigitYear = normalizeTwoDigitYear(value.year, currentYear);
        date.setUTCFullYear(normalizedTwoDigitYear, 0, options.firstWeekContainsDate);
        date.setUTCHours(0, 0, 0, 0);
        return startOfUTCWeek(date, options);
      }
      var year = !("era" in flags) || flags.era === 1 ? value.year : 1 - value.year;
      date.setUTCFullYear(year, 0, options.firstWeekContainsDate);
      date.setUTCHours(0, 0, 0, 0);
      return startOfUTCWeek(date, options);
    }
  }]);
  return LocalWeekYearParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/ISOWeekYearParser.js
var ISOWeekYearParser = function(_Parser) {
  _inherits(ISOWeekYearParser2, _Parser);
  var _super = _createSuper(ISOWeekYearParser2);
  function ISOWeekYearParser2() {
    var _this;
    _classCallCheck(this, ISOWeekYearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 130);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["G", "y", "Y", "u", "Q", "q", "M", "L", "w", "d", "D", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(ISOWeekYearParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      if (token === "R") {
        return parseNDigitsSigned(4, dateString);
      }
      return parseNDigitsSigned(token.length, dateString);
    }
  }, {
    key: "set",
    value: function set2(_date, _flags, value) {
      var firstWeekOfYear = /* @__PURE__ */ new Date(0);
      firstWeekOfYear.setUTCFullYear(value, 0, 4);
      firstWeekOfYear.setUTCHours(0, 0, 0, 0);
      return startOfUTCISOWeek(firstWeekOfYear);
    }
  }]);
  return ISOWeekYearParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/ExtendedYearParser.js
var ExtendedYearParser = function(_Parser) {
  _inherits(ExtendedYearParser2, _Parser);
  var _super = _createSuper(ExtendedYearParser2);
  function ExtendedYearParser2() {
    var _this;
    _classCallCheck(this, ExtendedYearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 130);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["G", "y", "Y", "R", "w", "I", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(ExtendedYearParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      if (token === "u") {
        return parseNDigitsSigned(4, dateString);
      }
      return parseNDigitsSigned(token.length, dateString);
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCFullYear(value, 0, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return ExtendedYearParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/QuarterParser.js
var QuarterParser = function(_Parser) {
  _inherits(QuarterParser2, _Parser);
  var _super = _createSuper(QuarterParser2);
  function QuarterParser2() {
    var _this;
    _classCallCheck(this, QuarterParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 120);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(QuarterParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        // 1, 2, 3, 4
        case "Q":
        case "QQ":
          return parseNDigits(token.length, dateString);
        // 1st, 2nd, 3rd, 4th
        case "Qo":
          return match2.ordinalNumber(dateString, {
            unit: "quarter"
          });
        // Q1, Q2, Q3, Q4
        case "QQQ":
          return match2.quarter(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "formatting"
          });
        // 1, 2, 3, 4 (narrow quarter; could be not numerical)
        case "QQQQQ":
          return match2.quarter(dateString, {
            width: "narrow",
            context: "formatting"
          });
        // 1st quarter, 2nd quarter, ...
        case "QQQQ":
        default:
          return match2.quarter(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.quarter(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 4;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMonth((value - 1) * 3, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return QuarterParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/StandAloneQuarterParser.js
var StandAloneQuarterParser = function(_Parser) {
  _inherits(StandAloneQuarterParser2, _Parser);
  var _super = _createSuper(StandAloneQuarterParser2);
  function StandAloneQuarterParser2() {
    var _this;
    _classCallCheck(this, StandAloneQuarterParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 120);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "Q", "M", "L", "w", "I", "d", "D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(StandAloneQuarterParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        // 1, 2, 3, 4
        case "q":
        case "qq":
          return parseNDigits(token.length, dateString);
        // 1st, 2nd, 3rd, 4th
        case "qo":
          return match2.ordinalNumber(dateString, {
            unit: "quarter"
          });
        // Q1, Q2, Q3, Q4
        case "qqq":
          return match2.quarter(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "standalone"
          });
        // 1, 2, 3, 4 (narrow quarter; could be not numerical)
        case "qqqqq":
          return match2.quarter(dateString, {
            width: "narrow",
            context: "standalone"
          });
        // 1st quarter, 2nd quarter, ...
        case "qqqq":
        default:
          return match2.quarter(dateString, {
            width: "wide",
            context: "standalone"
          }) || match2.quarter(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.quarter(dateString, {
            width: "narrow",
            context: "standalone"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 4;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMonth((value - 1) * 3, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return StandAloneQuarterParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/MonthParser.js
var MonthParser = function(_Parser) {
  _inherits(MonthParser2, _Parser);
  var _super = _createSuper(MonthParser2);
  function MonthParser2() {
    var _this;
    _classCallCheck(this, MonthParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "Q", "L", "w", "I", "D", "i", "e", "c", "t", "T"]);
    _defineProperty(_assertThisInitialized(_this), "priority", 110);
    return _this;
  }
  _createClass(MonthParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(value) {
        return value - 1;
      };
      switch (token) {
        // 1, 2, ..., 12
        case "M":
          return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback3);
        // 01, 02, ..., 12
        case "MM":
          return mapValue(parseNDigits(2, dateString), valueCallback3);
        // 1st, 2nd, ..., 12th
        case "Mo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "month"
          }), valueCallback3);
        // Jan, Feb, ..., Dec
        case "MMM":
          return match2.month(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.month(dateString, {
            width: "narrow",
            context: "formatting"
          });
        // J, F, ..., D
        case "MMMMM":
          return match2.month(dateString, {
            width: "narrow",
            context: "formatting"
          });
        // January, February, ..., December
        case "MMMM":
        default:
          return match2.month(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.month(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.month(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 11;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMonth(value, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return MonthParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/StandAloneMonthParser.js
var StandAloneMonthParser = function(_Parser) {
  _inherits(StandAloneMonthParser2, _Parser);
  var _super = _createSuper(StandAloneMonthParser2);
  function StandAloneMonthParser2() {
    var _this;
    _classCallCheck(this, StandAloneMonthParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 110);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "Q", "M", "w", "I", "D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(StandAloneMonthParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(value) {
        return value - 1;
      };
      switch (token) {
        // 1, 2, ..., 12
        case "L":
          return mapValue(parseNumericPattern(numericPatterns.month, dateString), valueCallback3);
        // 01, 02, ..., 12
        case "LL":
          return mapValue(parseNDigits(2, dateString), valueCallback3);
        // 1st, 2nd, ..., 12th
        case "Lo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "month"
          }), valueCallback3);
        // Jan, Feb, ..., Dec
        case "LLL":
          return match2.month(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.month(dateString, {
            width: "narrow",
            context: "standalone"
          });
        // J, F, ..., D
        case "LLLLL":
          return match2.month(dateString, {
            width: "narrow",
            context: "standalone"
          });
        // January, February, ..., December
        case "LLLL":
        default:
          return match2.month(dateString, {
            width: "wide",
            context: "standalone"
          }) || match2.month(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.month(dateString, {
            width: "narrow",
            context: "standalone"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 11;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMonth(value, 1);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return StandAloneMonthParser2;
}(Parser);

// node_modules/date-fns/esm/_lib/setUTCWeek/index.js
function setUTCWeek(dirtyDate, dirtyWeek, options) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var week = toInteger(dirtyWeek);
  var diff = getUTCWeek(date, options) - week;
  date.setUTCDate(date.getUTCDate() - diff * 7);
  return date;
}

// node_modules/date-fns/esm/parse/_lib/parsers/LocalWeekParser.js
var LocalWeekParser = function(_Parser) {
  _inherits(LocalWeekParser2, _Parser);
  var _super = _createSuper(LocalWeekParser2);
  function LocalWeekParser2() {
    var _this;
    _classCallCheck(this, LocalWeekParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 100);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "i", "t", "T"]);
    return _this;
  }
  _createClass(LocalWeekParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "w":
          return parseNumericPattern(numericPatterns.week, dateString);
        case "wo":
          return match2.ordinalNumber(dateString, {
            unit: "week"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 53;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value, options) {
      return startOfUTCWeek(setUTCWeek(date, value, options), options);
    }
  }]);
  return LocalWeekParser2;
}(Parser);

// node_modules/date-fns/esm/_lib/setUTCISOWeek/index.js
function setUTCISOWeek(dirtyDate, dirtyISOWeek) {
  requiredArgs(2, arguments);
  var date = toDate(dirtyDate);
  var isoWeek = toInteger(dirtyISOWeek);
  var diff = getUTCISOWeek(date) - isoWeek;
  date.setUTCDate(date.getUTCDate() - diff * 7);
  return date;
}

// node_modules/date-fns/esm/parse/_lib/parsers/ISOWeekParser.js
var ISOWeekParser = function(_Parser) {
  _inherits(ISOWeekParser2, _Parser);
  var _super = _createSuper(ISOWeekParser2);
  function ISOWeekParser2() {
    var _this;
    _classCallCheck(this, ISOWeekParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 100);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(ISOWeekParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "I":
          return parseNumericPattern(numericPatterns.week, dateString);
        case "Io":
          return match2.ordinalNumber(dateString, {
            unit: "week"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 53;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      return startOfUTCISOWeek(setUTCISOWeek(date, value));
    }
  }]);
  return ISOWeekParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/DateParser.js
var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DAYS_IN_MONTH_LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var DateParser = function(_Parser) {
  _inherits(DateParser2, _Parser);
  var _super = _createSuper(DateParser2);
  function DateParser2() {
    var _this;
    _classCallCheck(this, DateParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "subPriority", 1);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "Q", "w", "I", "D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(DateParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "d":
          return parseNumericPattern(numericPatterns.date, dateString);
        case "do":
          return match2.ordinalNumber(dateString, {
            unit: "date"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(date, value) {
      var year = date.getUTCFullYear();
      var isLeapYear = isLeapYearIndex(year);
      var month = date.getUTCMonth();
      if (isLeapYear) {
        return value >= 1 && value <= DAYS_IN_MONTH_LEAP_YEAR[month];
      } else {
        return value >= 1 && value <= DAYS_IN_MONTH[month];
      }
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCDate(value);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return DateParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/DayOfYearParser.js
var DayOfYearParser = function(_Parser) {
  _inherits(DayOfYearParser2, _Parser);
  var _super = _createSuper(DayOfYearParser2);
  function DayOfYearParser2() {
    var _this;
    _classCallCheck(this, DayOfYearParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "subpriority", 1);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["Y", "R", "q", "Q", "M", "L", "w", "I", "d", "E", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(DayOfYearParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "D":
        case "DD":
          return parseNumericPattern(numericPatterns.dayOfYear, dateString);
        case "Do":
          return match2.ordinalNumber(dateString, {
            unit: "date"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(date, value) {
      var year = date.getUTCFullYear();
      var isLeapYear = isLeapYearIndex(year);
      if (isLeapYear) {
        return value >= 1 && value <= 366;
      } else {
        return value >= 1 && value <= 365;
      }
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMonth(0, value);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return DayOfYearParser2;
}(Parser);

// node_modules/date-fns/esm/_lib/setUTCDay/index.js
function setUTCDay(dirtyDate, dirtyDay, options) {
  var _ref, _ref2, _ref3, _options$weekStartsOn, _options$locale, _options$locale$optio, _defaultOptions$local, _defaultOptions$local2;
  requiredArgs(2, arguments);
  var defaultOptions2 = getDefaultOptions();
  var weekStartsOn = toInteger((_ref = (_ref2 = (_ref3 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale = options.locale) === null || _options$locale === void 0 ? void 0 : (_options$locale$optio = _options$locale.options) === null || _options$locale$optio === void 0 ? void 0 : _options$locale$optio.weekStartsOn) !== null && _ref3 !== void 0 ? _ref3 : defaultOptions2.weekStartsOn) !== null && _ref2 !== void 0 ? _ref2 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.weekStartsOn) !== null && _ref !== void 0 ? _ref : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  var date = toDate(dirtyDate);
  var day = toInteger(dirtyDay);
  var currentDay = date.getUTCDay();
  var remainder = day % 7;
  var dayIndex = (remainder + 7) % 7;
  var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

// node_modules/date-fns/esm/parse/_lib/parsers/DayParser.js
var DayParser = function(_Parser) {
  _inherits(DayParser2, _Parser);
  var _super = _createSuper(DayParser2);
  function DayParser2() {
    var _this;
    _classCallCheck(this, DayParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["D", "i", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(DayParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        // Tue
        case "E":
        case "EE":
        case "EEE":
          return match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        // T
        case "EEEEE":
          return match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        // Tu
        case "EEEEEE":
          return match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        // Tuesday
        case "EEEE":
        default:
          return match2.day(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 6;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value, options) {
      date = setUTCDay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return DayParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/LocalDayParser.js
var LocalDayParser = function(_Parser) {
  _inherits(LocalDayParser2, _Parser);
  var _super = _createSuper(LocalDayParser2);
  function LocalDayParser2() {
    var _this;
    _classCallCheck(this, LocalDayParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "c", "t", "T"]);
    return _this;
  }
  _createClass(LocalDayParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2, options) {
      var valueCallback3 = function valueCallback4(value) {
        var wholeWeekDays = Math.floor((value - 1) / 7) * 7;
        return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
      };
      switch (token) {
        // 3
        case "e":
        case "ee":
          return mapValue(parseNDigits(token.length, dateString), valueCallback3);
        // 3rd
        case "eo":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "day"
          }), valueCallback3);
        // Tue
        case "eee":
          return match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        // T
        case "eeeee":
          return match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        // Tu
        case "eeeeee":
          return match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
        // Tuesday
        case "eeee":
        default:
          return match2.day(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 6;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value, options) {
      date = setUTCDay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return LocalDayParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/StandAloneLocalDayParser.js
var StandAloneLocalDayParser = function(_Parser) {
  _inherits(StandAloneLocalDayParser2, _Parser);
  var _super = _createSuper(StandAloneLocalDayParser2);
  function StandAloneLocalDayParser2() {
    var _this;
    _classCallCheck(this, StandAloneLocalDayParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "R", "u", "q", "Q", "M", "L", "I", "d", "D", "E", "i", "e", "t", "T"]);
    return _this;
  }
  _createClass(StandAloneLocalDayParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2, options) {
      var valueCallback3 = function valueCallback4(value) {
        var wholeWeekDays = Math.floor((value - 1) / 7) * 7;
        return (value + options.weekStartsOn + 6) % 7 + wholeWeekDays;
      };
      switch (token) {
        // 3
        case "c":
        case "cc":
          return mapValue(parseNDigits(token.length, dateString), valueCallback3);
        // 3rd
        case "co":
          return mapValue(match2.ordinalNumber(dateString, {
            unit: "day"
          }), valueCallback3);
        // Tue
        case "ccc":
          return match2.day(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "short",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
        // T
        case "ccccc":
          return match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
        // Tu
        case "cccccc":
          return match2.day(dateString, {
            width: "short",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
        // Tuesday
        case "cccc":
        default:
          return match2.day(dateString, {
            width: "wide",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "short",
            context: "standalone"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "standalone"
          });
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 6;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value, options) {
      date = setUTCDay(date, value, options);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return StandAloneLocalDayParser2;
}(Parser);

// node_modules/date-fns/esm/_lib/setUTCISODay/index.js
function setUTCISODay(dirtyDate, dirtyDay) {
  requiredArgs(2, arguments);
  var day = toInteger(dirtyDay);
  if (day % 7 === 0) {
    day = day - 7;
  }
  var weekStartsOn = 1;
  var date = toDate(dirtyDate);
  var currentDay = date.getUTCDay();
  var remainder = day % 7;
  var dayIndex = (remainder + 7) % 7;
  var diff = (dayIndex < weekStartsOn ? 7 : 0) + day - currentDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}

// node_modules/date-fns/esm/parse/_lib/parsers/ISODayParser.js
var ISODayParser = function(_Parser) {
  _inherits(ISODayParser2, _Parser);
  var _super = _createSuper(ISODayParser2);
  function ISODayParser2() {
    var _this;
    _classCallCheck(this, ISODayParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 90);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["y", "Y", "u", "q", "Q", "M", "L", "w", "d", "D", "E", "e", "c", "t", "T"]);
    return _this;
  }
  _createClass(ISODayParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      var valueCallback3 = function valueCallback4(value) {
        if (value === 0) {
          return 7;
        }
        return value;
      };
      switch (token) {
        // 2
        case "i":
        case "ii":
          return parseNDigits(token.length, dateString);
        // 2nd
        case "io":
          return match2.ordinalNumber(dateString, {
            unit: "day"
          });
        // Tue
        case "iii":
          return mapValue(match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }), valueCallback3);
        // T
        case "iiiii":
          return mapValue(match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }), valueCallback3);
        // Tu
        case "iiiiii":
          return mapValue(match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }), valueCallback3);
        // Tuesday
        case "iiii":
        default:
          return mapValue(match2.day(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "short",
            context: "formatting"
          }) || match2.day(dateString, {
            width: "narrow",
            context: "formatting"
          }), valueCallback3);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 7;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date = setUTCISODay(date, value);
      date.setUTCHours(0, 0, 0, 0);
      return date;
    }
  }]);
  return ISODayParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/AMPMParser.js
var AMPMParser = function(_Parser) {
  _inherits(AMPMParser2, _Parser);
  var _super = _createSuper(AMPMParser2);
  function AMPMParser2() {
    var _this;
    _classCallCheck(this, AMPMParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 80);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["b", "B", "H", "k", "t", "T"]);
    return _this;
  }
  _createClass(AMPMParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "a":
        case "aa":
        case "aaa":
          return match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaaa":
          return match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "aaaa":
        default:
          return match2.dayPeriod(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
  }]);
  return AMPMParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/AMPMMidnightParser.js
var AMPMMidnightParser = function(_Parser) {
  _inherits(AMPMMidnightParser2, _Parser);
  var _super = _createSuper(AMPMMidnightParser2);
  function AMPMMidnightParser2() {
    var _this;
    _classCallCheck(this, AMPMMidnightParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 80);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["a", "B", "H", "k", "t", "T"]);
    return _this;
  }
  _createClass(AMPMMidnightParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "b":
        case "bb":
        case "bbb":
          return match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbbb":
          return match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "bbbb":
        default:
          return match2.dayPeriod(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
  }]);
  return AMPMMidnightParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/DayPeriodParser.js
var DayPeriodParser = function(_Parser) {
  _inherits(DayPeriodParser2, _Parser);
  var _super = _createSuper(DayPeriodParser2);
  function DayPeriodParser2() {
    var _this;
    _classCallCheck(this, DayPeriodParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 80);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["a", "b", "t", "T"]);
    return _this;
  }
  _createClass(DayPeriodParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "B":
        case "BB":
        case "BBB":
          return match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBBB":
          return match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
        case "BBBB":
        default:
          return match2.dayPeriod(dateString, {
            width: "wide",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "abbreviated",
            context: "formatting"
          }) || match2.dayPeriod(dateString, {
            width: "narrow",
            context: "formatting"
          });
      }
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCHours(dayPeriodEnumToHours(value), 0, 0, 0);
      return date;
    }
  }]);
  return DayPeriodParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/Hour1to12Parser.js
var Hour1to12Parser = function(_Parser) {
  _inherits(Hour1to12Parser2, _Parser);
  var _super = _createSuper(Hour1to12Parser2);
  function Hour1to12Parser2() {
    var _this;
    _classCallCheck(this, Hour1to12Parser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 70);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["H", "K", "k", "t", "T"]);
    return _this;
  }
  _createClass(Hour1to12Parser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "h":
          return parseNumericPattern(numericPatterns.hour12h, dateString);
        case "ho":
          return match2.ordinalNumber(dateString, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 12;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      var isPM = date.getUTCHours() >= 12;
      if (isPM && value < 12) {
        date.setUTCHours(value + 12, 0, 0, 0);
      } else if (!isPM && value === 12) {
        date.setUTCHours(0, 0, 0, 0);
      } else {
        date.setUTCHours(value, 0, 0, 0);
      }
      return date;
    }
  }]);
  return Hour1to12Parser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/Hour0to23Parser.js
var Hour0to23Parser = function(_Parser) {
  _inherits(Hour0to23Parser2, _Parser);
  var _super = _createSuper(Hour0to23Parser2);
  function Hour0to23Parser2() {
    var _this;
    _classCallCheck(this, Hour0to23Parser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 70);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["a", "b", "h", "K", "k", "t", "T"]);
    return _this;
  }
  _createClass(Hour0to23Parser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "H":
          return parseNumericPattern(numericPatterns.hour23h, dateString);
        case "Ho":
          return match2.ordinalNumber(dateString, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 23;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCHours(value, 0, 0, 0);
      return date;
    }
  }]);
  return Hour0to23Parser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/Hour0To11Parser.js
var Hour0To11Parser = function(_Parser) {
  _inherits(Hour0To11Parser2, _Parser);
  var _super = _createSuper(Hour0To11Parser2);
  function Hour0To11Parser2() {
    var _this;
    _classCallCheck(this, Hour0To11Parser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 70);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["h", "H", "k", "t", "T"]);
    return _this;
  }
  _createClass(Hour0To11Parser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "K":
          return parseNumericPattern(numericPatterns.hour11h, dateString);
        case "Ko":
          return match2.ordinalNumber(dateString, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 11;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      var isPM = date.getUTCHours() >= 12;
      if (isPM && value < 12) {
        date.setUTCHours(value + 12, 0, 0, 0);
      } else {
        date.setUTCHours(value, 0, 0, 0);
      }
      return date;
    }
  }]);
  return Hour0To11Parser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/Hour1To24Parser.js
var Hour1To24Parser = function(_Parser) {
  _inherits(Hour1To24Parser2, _Parser);
  var _super = _createSuper(Hour1To24Parser2);
  function Hour1To24Parser2() {
    var _this;
    _classCallCheck(this, Hour1To24Parser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 70);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["a", "b", "h", "H", "K", "t", "T"]);
    return _this;
  }
  _createClass(Hour1To24Parser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "k":
          return parseNumericPattern(numericPatterns.hour24h, dateString);
        case "ko":
          return match2.ordinalNumber(dateString, {
            unit: "hour"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 1 && value <= 24;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      var hours = value <= 24 ? value % 24 : value;
      date.setUTCHours(hours, 0, 0, 0);
      return date;
    }
  }]);
  return Hour1To24Parser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/MinuteParser.js
var MinuteParser = function(_Parser) {
  _inherits(MinuteParser2, _Parser);
  var _super = _createSuper(MinuteParser2);
  function MinuteParser2() {
    var _this;
    _classCallCheck(this, MinuteParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 60);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T"]);
    return _this;
  }
  _createClass(MinuteParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "m":
          return parseNumericPattern(numericPatterns.minute, dateString);
        case "mo":
          return match2.ordinalNumber(dateString, {
            unit: "minute"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 59;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMinutes(value, 0, 0);
      return date;
    }
  }]);
  return MinuteParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/SecondParser.js
var SecondParser = function(_Parser) {
  _inherits(SecondParser2, _Parser);
  var _super = _createSuper(SecondParser2);
  function SecondParser2() {
    var _this;
    _classCallCheck(this, SecondParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 50);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T"]);
    return _this;
  }
  _createClass(SecondParser2, [{
    key: "parse",
    value: function parse2(dateString, token, match2) {
      switch (token) {
        case "s":
          return parseNumericPattern(numericPatterns.second, dateString);
        case "so":
          return match2.ordinalNumber(dateString, {
            unit: "second"
          });
        default:
          return parseNDigits(token.length, dateString);
      }
    }
  }, {
    key: "validate",
    value: function validate(_date, value) {
      return value >= 0 && value <= 59;
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCSeconds(value, 0);
      return date;
    }
  }]);
  return SecondParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/FractionOfSecondParser.js
var FractionOfSecondParser = function(_Parser) {
  _inherits(FractionOfSecondParser2, _Parser);
  var _super = _createSuper(FractionOfSecondParser2);
  function FractionOfSecondParser2() {
    var _this;
    _classCallCheck(this, FractionOfSecondParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 30);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T"]);
    return _this;
  }
  _createClass(FractionOfSecondParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      var valueCallback3 = function valueCallback4(value) {
        return Math.floor(value * Math.pow(10, -token.length + 3));
      };
      return mapValue(parseNDigits(token.length, dateString), valueCallback3);
    }
  }, {
    key: "set",
    value: function set2(date, _flags, value) {
      date.setUTCMilliseconds(value);
      return date;
    }
  }]);
  return FractionOfSecondParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/ISOTimezoneWithZParser.js
var ISOTimezoneWithZParser = function(_Parser) {
  _inherits(ISOTimezoneWithZParser2, _Parser);
  var _super = _createSuper(ISOTimezoneWithZParser2);
  function ISOTimezoneWithZParser2() {
    var _this;
    _classCallCheck(this, ISOTimezoneWithZParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 10);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T", "x"]);
    return _this;
  }
  _createClass(ISOTimezoneWithZParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      switch (token) {
        case "X":
          return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);
        case "XX":
          return parseTimezonePattern(timezonePatterns.basic, dateString);
        case "XXXX":
          return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);
        case "XXXXX":
          return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);
        case "XXX":
        default:
          return parseTimezonePattern(timezonePatterns.extended, dateString);
      }
    }
  }, {
    key: "set",
    value: function set2(date, flags, value) {
      if (flags.timestampIsSet) {
        return date;
      }
      return new Date(date.getTime() - value);
    }
  }]);
  return ISOTimezoneWithZParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/ISOTimezoneParser.js
var ISOTimezoneParser = function(_Parser) {
  _inherits(ISOTimezoneParser2, _Parser);
  var _super = _createSuper(ISOTimezoneParser2);
  function ISOTimezoneParser2() {
    var _this;
    _classCallCheck(this, ISOTimezoneParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 10);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", ["t", "T", "X"]);
    return _this;
  }
  _createClass(ISOTimezoneParser2, [{
    key: "parse",
    value: function parse2(dateString, token) {
      switch (token) {
        case "x":
          return parseTimezonePattern(timezonePatterns.basicOptionalMinutes, dateString);
        case "xx":
          return parseTimezonePattern(timezonePatterns.basic, dateString);
        case "xxxx":
          return parseTimezonePattern(timezonePatterns.basicOptionalSeconds, dateString);
        case "xxxxx":
          return parseTimezonePattern(timezonePatterns.extendedOptionalSeconds, dateString);
        case "xxx":
        default:
          return parseTimezonePattern(timezonePatterns.extended, dateString);
      }
    }
  }, {
    key: "set",
    value: function set2(date, flags, value) {
      if (flags.timestampIsSet) {
        return date;
      }
      return new Date(date.getTime() - value);
    }
  }]);
  return ISOTimezoneParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/TimestampSecondsParser.js
var TimestampSecondsParser = function(_Parser) {
  _inherits(TimestampSecondsParser2, _Parser);
  var _super = _createSuper(TimestampSecondsParser2);
  function TimestampSecondsParser2() {
    var _this;
    _classCallCheck(this, TimestampSecondsParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 40);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", "*");
    return _this;
  }
  _createClass(TimestampSecondsParser2, [{
    key: "parse",
    value: function parse2(dateString) {
      return parseAnyDigitsSigned(dateString);
    }
  }, {
    key: "set",
    value: function set2(_date, _flags, value) {
      return [new Date(value * 1e3), {
        timestampIsSet: true
      }];
    }
  }]);
  return TimestampSecondsParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/TimestampMillisecondsParser.js
var TimestampMillisecondsParser = function(_Parser) {
  _inherits(TimestampMillisecondsParser2, _Parser);
  var _super = _createSuper(TimestampMillisecondsParser2);
  function TimestampMillisecondsParser2() {
    var _this;
    _classCallCheck(this, TimestampMillisecondsParser2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    _defineProperty(_assertThisInitialized(_this), "priority", 20);
    _defineProperty(_assertThisInitialized(_this), "incompatibleTokens", "*");
    return _this;
  }
  _createClass(TimestampMillisecondsParser2, [{
    key: "parse",
    value: function parse2(dateString) {
      return parseAnyDigitsSigned(dateString);
    }
  }, {
    key: "set",
    value: function set2(_date, _flags, value) {
      return [new Date(value), {
        timestampIsSet: true
      }];
    }
  }]);
  return TimestampMillisecondsParser2;
}(Parser);

// node_modules/date-fns/esm/parse/_lib/parsers/index.js
var parsers = {
  G: new EraParser(),
  y: new YearParser(),
  Y: new LocalWeekYearParser(),
  R: new ISOWeekYearParser(),
  u: new ExtendedYearParser(),
  Q: new QuarterParser(),
  q: new StandAloneQuarterParser(),
  M: new MonthParser(),
  L: new StandAloneMonthParser(),
  w: new LocalWeekParser(),
  I: new ISOWeekParser(),
  d: new DateParser(),
  D: new DayOfYearParser(),
  E: new DayParser(),
  e: new LocalDayParser(),
  c: new StandAloneLocalDayParser(),
  i: new ISODayParser(),
  a: new AMPMParser(),
  b: new AMPMMidnightParser(),
  B: new DayPeriodParser(),
  h: new Hour1to12Parser(),
  H: new Hour0to23Parser(),
  K: new Hour0To11Parser(),
  k: new Hour1To24Parser(),
  m: new MinuteParser(),
  s: new SecondParser(),
  S: new FractionOfSecondParser(),
  X: new ISOTimezoneWithZParser(),
  x: new ISOTimezoneParser(),
  t: new TimestampSecondsParser(),
  T: new TimestampMillisecondsParser()
};

// node_modules/date-fns/esm/parse/index.js
var formattingTokensRegExp2 = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g;
var longFormattingTokensRegExp2 = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
var escapedStringRegExp2 = /^'([^]*?)'?$/;
var doubleQuoteRegExp2 = /''/g;
var notWhitespaceRegExp = /\S/;
var unescapedLatinCharacterRegExp2 = /[a-zA-Z]/;
function parse(dirtyDateString, dirtyFormatString, dirtyReferenceDate, options) {
  var _ref, _options$locale, _ref2, _ref3, _ref4, _options$firstWeekCon, _options$locale2, _options$locale2$opti, _defaultOptions$local, _defaultOptions$local2, _ref5, _ref6, _ref7, _options$weekStartsOn, _options$locale3, _options$locale3$opti, _defaultOptions$local3, _defaultOptions$local4;
  requiredArgs(3, arguments);
  var dateString = String(dirtyDateString);
  var formatString = String(dirtyFormatString);
  var defaultOptions2 = getDefaultOptions();
  var locale2 = (_ref = (_options$locale = options === null || options === void 0 ? void 0 : options.locale) !== null && _options$locale !== void 0 ? _options$locale : defaultOptions2.locale) !== null && _ref !== void 0 ? _ref : defaultLocale_default;
  if (!locale2.match) {
    throw new RangeError("locale must contain match property");
  }
  var firstWeekContainsDate = toInteger((_ref2 = (_ref3 = (_ref4 = (_options$firstWeekCon = options === null || options === void 0 ? void 0 : options.firstWeekContainsDate) !== null && _options$firstWeekCon !== void 0 ? _options$firstWeekCon : options === null || options === void 0 ? void 0 : (_options$locale2 = options.locale) === null || _options$locale2 === void 0 ? void 0 : (_options$locale2$opti = _options$locale2.options) === null || _options$locale2$opti === void 0 ? void 0 : _options$locale2$opti.firstWeekContainsDate) !== null && _ref4 !== void 0 ? _ref4 : defaultOptions2.firstWeekContainsDate) !== null && _ref3 !== void 0 ? _ref3 : (_defaultOptions$local = defaultOptions2.locale) === null || _defaultOptions$local === void 0 ? void 0 : (_defaultOptions$local2 = _defaultOptions$local.options) === null || _defaultOptions$local2 === void 0 ? void 0 : _defaultOptions$local2.firstWeekContainsDate) !== null && _ref2 !== void 0 ? _ref2 : 1);
  if (!(firstWeekContainsDate >= 1 && firstWeekContainsDate <= 7)) {
    throw new RangeError("firstWeekContainsDate must be between 1 and 7 inclusively");
  }
  var weekStartsOn = toInteger((_ref5 = (_ref6 = (_ref7 = (_options$weekStartsOn = options === null || options === void 0 ? void 0 : options.weekStartsOn) !== null && _options$weekStartsOn !== void 0 ? _options$weekStartsOn : options === null || options === void 0 ? void 0 : (_options$locale3 = options.locale) === null || _options$locale3 === void 0 ? void 0 : (_options$locale3$opti = _options$locale3.options) === null || _options$locale3$opti === void 0 ? void 0 : _options$locale3$opti.weekStartsOn) !== null && _ref7 !== void 0 ? _ref7 : defaultOptions2.weekStartsOn) !== null && _ref6 !== void 0 ? _ref6 : (_defaultOptions$local3 = defaultOptions2.locale) === null || _defaultOptions$local3 === void 0 ? void 0 : (_defaultOptions$local4 = _defaultOptions$local3.options) === null || _defaultOptions$local4 === void 0 ? void 0 : _defaultOptions$local4.weekStartsOn) !== null && _ref5 !== void 0 ? _ref5 : 0);
  if (!(weekStartsOn >= 0 && weekStartsOn <= 6)) {
    throw new RangeError("weekStartsOn must be between 0 and 6 inclusively");
  }
  if (formatString === "") {
    if (dateString === "") {
      return toDate(dirtyReferenceDate);
    } else {
      return /* @__PURE__ */ new Date(NaN);
    }
  }
  var subFnOptions = {
    firstWeekContainsDate,
    weekStartsOn,
    locale: locale2
  };
  var setters = [new DateToSystemTimezoneSetter()];
  var tokens = formatString.match(longFormattingTokensRegExp2).map(function(substring) {
    var firstCharacter = substring[0];
    if (firstCharacter in longFormatters_default) {
      var longFormatter = longFormatters_default[firstCharacter];
      return longFormatter(substring, locale2.formatLong);
    }
    return substring;
  }).join("").match(formattingTokensRegExp2);
  var usedTokens = [];
  var _iterator = _createForOfIteratorHelper(tokens), _step;
  try {
    var _loop = function _loop2() {
      var token = _step.value;
      if (!(options !== null && options !== void 0 && options.useAdditionalWeekYearTokens) && isProtectedWeekYearToken(token)) {
        throwProtectedError(token, formatString, dirtyDateString);
      }
      if (!(options !== null && options !== void 0 && options.useAdditionalDayOfYearTokens) && isProtectedDayOfYearToken(token)) {
        throwProtectedError(token, formatString, dirtyDateString);
      }
      var firstCharacter = token[0];
      var parser = parsers[firstCharacter];
      if (parser) {
        var incompatibleTokens = parser.incompatibleTokens;
        if (Array.isArray(incompatibleTokens)) {
          var incompatibleToken = usedTokens.find(function(usedToken) {
            return incompatibleTokens.includes(usedToken.token) || usedToken.token === firstCharacter;
          });
          if (incompatibleToken) {
            throw new RangeError("The format string mustn't contain `".concat(incompatibleToken.fullToken, "` and `").concat(token, "` at the same time"));
          }
        } else if (parser.incompatibleTokens === "*" && usedTokens.length > 0) {
          throw new RangeError("The format string mustn't contain `".concat(token, "` and any other token at the same time"));
        }
        usedTokens.push({
          token: firstCharacter,
          fullToken: token
        });
        var parseResult = parser.run(dateString, token, locale2.match, subFnOptions);
        if (!parseResult) {
          return {
            v: /* @__PURE__ */ new Date(NaN)
          };
        }
        setters.push(parseResult.setter);
        dateString = parseResult.rest;
      } else {
        if (firstCharacter.match(unescapedLatinCharacterRegExp2)) {
          throw new RangeError("Format string contains an unescaped latin alphabet character `" + firstCharacter + "`");
        }
        if (token === "''") {
          token = "'";
        } else if (firstCharacter === "'") {
          token = cleanEscapedString2(token);
        }
        if (dateString.indexOf(token) === 0) {
          dateString = dateString.slice(token.length);
        } else {
          return {
            v: /* @__PURE__ */ new Date(NaN)
          };
        }
      }
    };
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var _ret = _loop();
      if (_typeof(_ret) === "object") return _ret.v;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (dateString.length > 0 && notWhitespaceRegExp.test(dateString)) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var uniquePrioritySetters = setters.map(function(setter2) {
    return setter2.priority;
  }).sort(function(a3, b2) {
    return b2 - a3;
  }).filter(function(priority, index, array) {
    return array.indexOf(priority) === index;
  }).map(function(priority) {
    return setters.filter(function(setter2) {
      return setter2.priority === priority;
    }).sort(function(a3, b2) {
      return b2.subPriority - a3.subPriority;
    });
  }).map(function(setterArray) {
    return setterArray[0];
  });
  var date = toDate(dirtyReferenceDate);
  if (isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var utcDate = subMilliseconds(date, getTimezoneOffsetInMilliseconds(date));
  var flags = {};
  var _iterator2 = _createForOfIteratorHelper(uniquePrioritySetters), _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
      var setter = _step2.value;
      if (!setter.validate(utcDate, subFnOptions)) {
        return /* @__PURE__ */ new Date(NaN);
      }
      var result = setter.set(utcDate, flags, subFnOptions);
      if (Array.isArray(result)) {
        utcDate = result[0];
        assign(flags, result[1]);
      } else {
        utcDate = result;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return utcDate;
}
function cleanEscapedString2(input) {
  return input.match(escapedStringRegExp2)[1].replace(doubleQuoteRegExp2, "'");
}

// node_modules/date-fns/esm/parseISO/index.js
function parseISO(argument, options) {
  var _options$additionalDi;
  requiredArgs(1, arguments);
  var additionalDigits = toInteger((_options$additionalDi = options === null || options === void 0 ? void 0 : options.additionalDigits) !== null && _options$additionalDi !== void 0 ? _options$additionalDi : 2);
  if (additionalDigits !== 2 && additionalDigits !== 1 && additionalDigits !== 0) {
    throw new RangeError("additionalDigits must be 0, 1 or 2");
  }
  if (!(typeof argument === "string" || Object.prototype.toString.call(argument) === "[object String]")) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var dateStrings = splitDateString(argument);
  var date;
  if (dateStrings.date) {
    var parseYearResult = parseYear(dateStrings.date, additionalDigits);
    date = parseDate(parseYearResult.restDateString, parseYearResult.year);
  }
  if (!date || isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date(NaN);
  }
  var timestamp = date.getTime();
  var time = 0;
  var offset2;
  if (dateStrings.time) {
    time = parseTime(dateStrings.time);
    if (isNaN(time)) {
      return /* @__PURE__ */ new Date(NaN);
    }
  }
  if (dateStrings.timezone) {
    offset2 = parseTimezone(dateStrings.timezone);
    if (isNaN(offset2)) {
      return /* @__PURE__ */ new Date(NaN);
    }
  } else {
    var dirtyDate = new Date(timestamp + time);
    var result = /* @__PURE__ */ new Date(0);
    result.setFullYear(dirtyDate.getUTCFullYear(), dirtyDate.getUTCMonth(), dirtyDate.getUTCDate());
    result.setHours(dirtyDate.getUTCHours(), dirtyDate.getUTCMinutes(), dirtyDate.getUTCSeconds(), dirtyDate.getUTCMilliseconds());
    return result;
  }
  return new Date(timestamp + time + offset2);
}
var patterns = {
  dateTimeDelimiter: /[T ]/,
  timeZoneDelimiter: /[Z ]/i,
  timezone: /([Z+-].*)$/
};
var dateRegex = /^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/;
var timeRegex = /^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/;
var timezoneRegex = /^([+-])(\d{2})(?::?(\d{2}))?$/;
function splitDateString(dateString) {
  var dateStrings = {};
  var array = dateString.split(patterns.dateTimeDelimiter);
  var timeString;
  if (array.length > 2) {
    return dateStrings;
  }
  if (/:/.test(array[0])) {
    timeString = array[0];
  } else {
    dateStrings.date = array[0];
    timeString = array[1];
    if (patterns.timeZoneDelimiter.test(dateStrings.date)) {
      dateStrings.date = dateString.split(patterns.timeZoneDelimiter)[0];
      timeString = dateString.substr(dateStrings.date.length, dateString.length);
    }
  }
  if (timeString) {
    var token = patterns.timezone.exec(timeString);
    if (token) {
      dateStrings.time = timeString.replace(token[1], "");
      dateStrings.timezone = token[1];
    } else {
      dateStrings.time = timeString;
    }
  }
  return dateStrings;
}
function parseYear(dateString, additionalDigits) {
  var regex = new RegExp("^(?:(\\d{4}|[+-]\\d{" + (4 + additionalDigits) + "})|(\\d{2}|[+-]\\d{" + (2 + additionalDigits) + "})$)");
  var captures = dateString.match(regex);
  if (!captures) return {
    year: NaN,
    restDateString: ""
  };
  var year = captures[1] ? parseInt(captures[1]) : null;
  var century = captures[2] ? parseInt(captures[2]) : null;
  return {
    year: century === null ? year : century * 100,
    restDateString: dateString.slice((captures[1] || captures[2]).length)
  };
}
function parseDate(dateString, year) {
  if (year === null) return /* @__PURE__ */ new Date(NaN);
  var captures = dateString.match(dateRegex);
  if (!captures) return /* @__PURE__ */ new Date(NaN);
  var isWeekDate = !!captures[4];
  var dayOfYear = parseDateUnit(captures[1]);
  var month = parseDateUnit(captures[2]) - 1;
  var day = parseDateUnit(captures[3]);
  var week = parseDateUnit(captures[4]);
  var dayOfWeek = parseDateUnit(captures[5]) - 1;
  if (isWeekDate) {
    if (!validateWeekDate(year, week, dayOfWeek)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    return dayOfISOWeekYear(year, week, dayOfWeek);
  } else {
    var date = /* @__PURE__ */ new Date(0);
    if (!validateDate(year, month, day) || !validateDayOfYearDate(year, dayOfYear)) {
      return /* @__PURE__ */ new Date(NaN);
    }
    date.setUTCFullYear(year, month, Math.max(dayOfYear, day));
    return date;
  }
}
function parseDateUnit(value) {
  return value ? parseInt(value) : 1;
}
function parseTime(timeString) {
  var captures = timeString.match(timeRegex);
  if (!captures) return NaN;
  var hours = parseTimeUnit(captures[1]);
  var minutes = parseTimeUnit(captures[2]);
  var seconds = parseTimeUnit(captures[3]);
  if (!validateTime(hours, minutes, seconds)) {
    return NaN;
  }
  return hours * millisecondsInHour + minutes * millisecondsInMinute + seconds * 1e3;
}
function parseTimeUnit(value) {
  return value && parseFloat(value.replace(",", ".")) || 0;
}
function parseTimezone(timezoneString) {
  if (timezoneString === "Z") return 0;
  var captures = timezoneString.match(timezoneRegex);
  if (!captures) return 0;
  var sign = captures[1] === "+" ? -1 : 1;
  var hours = parseInt(captures[2]);
  var minutes = captures[3] && parseInt(captures[3]) || 0;
  if (!validateTimezone(hours, minutes)) {
    return NaN;
  }
  return sign * (hours * millisecondsInHour + minutes * millisecondsInMinute);
}
function dayOfISOWeekYear(isoWeekYear, week, day) {
  var date = /* @__PURE__ */ new Date(0);
  date.setUTCFullYear(isoWeekYear, 0, 4);
  var fourthOfJanuaryDay = date.getUTCDay() || 7;
  var diff = (week - 1) * 7 + day + 1 - fourthOfJanuaryDay;
  date.setUTCDate(date.getUTCDate() + diff);
  return date;
}
var daysInMonths = [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
function isLeapYearIndex2(year) {
  return year % 400 === 0 || year % 4 === 0 && year % 100 !== 0;
}
function validateDate(year, month, date) {
  return month >= 0 && month <= 11 && date >= 1 && date <= (daysInMonths[month] || (isLeapYearIndex2(year) ? 29 : 28));
}
function validateDayOfYearDate(year, dayOfYear) {
  return dayOfYear >= 1 && dayOfYear <= (isLeapYearIndex2(year) ? 366 : 365);
}
function validateWeekDate(_year, week, day) {
  return week >= 1 && week <= 53 && day >= 0 && day <= 6;
}
function validateTime(hours, minutes, seconds) {
  if (hours === 24) {
    return minutes === 0 && seconds === 0;
  }
  return seconds >= 0 && seconds < 60 && minutes >= 0 && minutes < 60 && hours >= 0 && hours < 25;
}
function validateTimezone(_hours, minutes) {
  return minutes >= 0 && minutes <= 59;
}

// node_modules/react-onclickoutside/dist/react-onclickoutside.es.js
var import_react = __toESM(require_react());
var import_react_dom = __toESM(require_react_dom());
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  _setPrototypeOf2(subClass, superClass);
}
function _setPrototypeOf2(o, p) {
  _setPrototypeOf2 = Object.setPrototypeOf || function _setPrototypeOf3(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf2(o, p);
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i2;
  for (i2 = 0; i2 < sourceKeys.length; i2++) {
    key = sourceKeys[i2];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
function _assertThisInitialized2(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function isNodeFound(current, componentNode, ignoreClass) {
  if (current === componentNode) {
    return true;
  }
  if (current.correspondingElement) {
    return current.correspondingElement.classList.contains(ignoreClass);
  }
  return current.classList.contains(ignoreClass);
}
function findHighest(current, componentNode, ignoreClass) {
  if (current === componentNode) {
    return true;
  }
  while (current.parentNode || current.host) {
    if (current.parentNode && isNodeFound(current, componentNode, ignoreClass)) {
      return true;
    }
    current = current.parentNode || current.host;
  }
  return current;
}
function clickedScrollbar(evt) {
  return document.documentElement.clientWidth <= evt.clientX || document.documentElement.clientHeight <= evt.clientY;
}
var testPassiveEventSupport = function testPassiveEventSupport2() {
  if (typeof window === "undefined" || typeof window.addEventListener !== "function") {
    return;
  }
  var passive2 = false;
  var options = Object.defineProperty({}, "passive", {
    get: function get() {
      passive2 = true;
    }
  });
  var noop = function noop2() {
  };
  window.addEventListener("testPassiveEventSupport", noop, options);
  window.removeEventListener("testPassiveEventSupport", noop, options);
  return passive2;
};
function autoInc(seed) {
  if (seed === void 0) {
    seed = 0;
  }
  return function() {
    return ++seed;
  };
}
var uid = autoInc();
var passiveEventSupport;
var handlersMap = {};
var enabledInstances = {};
var touchEvents = ["touchstart", "touchmove"];
var IGNORE_CLASS_NAME = "ignore-react-onclickoutside";
function getEventHandlerOptions(instance, eventName) {
  var handlerOptions = {};
  var isTouchEvent = touchEvents.indexOf(eventName) !== -1;
  if (isTouchEvent && passiveEventSupport) {
    handlerOptions.passive = !instance.props.preventDefault;
  }
  return handlerOptions;
}
function onClickOutsideHOC(WrappedComponent, config) {
  var _class, _temp;
  var componentName = WrappedComponent.displayName || WrappedComponent.name || "Component";
  return _temp = _class = function(_Component) {
    _inheritsLoose(onClickOutside, _Component);
    function onClickOutside(props) {
      var _this;
      _this = _Component.call(this, props) || this;
      _this.__outsideClickHandler = function(event) {
        if (typeof _this.__clickOutsideHandlerProp === "function") {
          _this.__clickOutsideHandlerProp(event);
          return;
        }
        var instance = _this.getInstance();
        if (typeof instance.props.handleClickOutside === "function") {
          instance.props.handleClickOutside(event);
          return;
        }
        if (typeof instance.handleClickOutside === "function") {
          instance.handleClickOutside(event);
          return;
        }
        throw new Error("WrappedComponent: " + componentName + " lacks a handleClickOutside(event) function for processing outside click events.");
      };
      _this.__getComponentNode = function() {
        var instance = _this.getInstance();
        if (config && typeof config.setClickOutsideRef === "function") {
          return config.setClickOutsideRef()(instance);
        }
        if (typeof instance.setClickOutsideRef === "function") {
          return instance.setClickOutsideRef();
        }
        return (0, import_react_dom.findDOMNode)(instance);
      };
      _this.enableOnClickOutside = function() {
        if (typeof document === "undefined" || enabledInstances[_this._uid]) {
          return;
        }
        if (typeof passiveEventSupport === "undefined") {
          passiveEventSupport = testPassiveEventSupport();
        }
        enabledInstances[_this._uid] = true;
        var events = _this.props.eventTypes;
        if (!events.forEach) {
          events = [events];
        }
        handlersMap[_this._uid] = function(event) {
          if (_this.componentNode === null) return;
          if (_this.initTimeStamp > event.timeStamp) return;
          if (_this.props.preventDefault) {
            event.preventDefault();
          }
          if (_this.props.stopPropagation) {
            event.stopPropagation();
          }
          if (_this.props.excludeScrollbar && clickedScrollbar(event)) return;
          var current = event.composed && event.composedPath && event.composedPath().shift() || event.target;
          if (findHighest(current, _this.componentNode, _this.props.outsideClickIgnoreClass) !== document) {
            return;
          }
          _this.__outsideClickHandler(event);
        };
        events.forEach(function(eventName) {
          document.addEventListener(eventName, handlersMap[_this._uid], getEventHandlerOptions(_assertThisInitialized2(_this), eventName));
        });
      };
      _this.disableOnClickOutside = function() {
        delete enabledInstances[_this._uid];
        var fn2 = handlersMap[_this._uid];
        if (fn2 && typeof document !== "undefined") {
          var events = _this.props.eventTypes;
          if (!events.forEach) {
            events = [events];
          }
          events.forEach(function(eventName) {
            return document.removeEventListener(eventName, fn2, getEventHandlerOptions(_assertThisInitialized2(_this), eventName));
          });
          delete handlersMap[_this._uid];
        }
      };
      _this.getRef = function(ref) {
        return _this.instanceRef = ref;
      };
      _this._uid = uid();
      _this.initTimeStamp = performance.now();
      return _this;
    }
    var _proto = onClickOutside.prototype;
    _proto.getInstance = function getInstance() {
      if (WrappedComponent.prototype && !WrappedComponent.prototype.isReactComponent) {
        return this;
      }
      var ref = this.instanceRef;
      return ref.getInstance ? ref.getInstance() : ref;
    };
    _proto.componentDidMount = function componentDidMount() {
      if (typeof document === "undefined" || !document.createElement) {
        return;
      }
      var instance = this.getInstance();
      if (config && typeof config.handleClickOutside === "function") {
        this.__clickOutsideHandlerProp = config.handleClickOutside(instance);
        if (typeof this.__clickOutsideHandlerProp !== "function") {
          throw new Error("WrappedComponent: " + componentName + " lacks a function for processing outside click events specified by the handleClickOutside config option.");
        }
      }
      this.componentNode = this.__getComponentNode();
      if (this.props.disableOnClickOutside) return;
      this.enableOnClickOutside();
    };
    _proto.componentDidUpdate = function componentDidUpdate() {
      this.componentNode = this.__getComponentNode();
    };
    _proto.componentWillUnmount = function componentWillUnmount() {
      this.disableOnClickOutside();
    };
    _proto.render = function render() {
      var _this$props = this.props;
      _this$props.excludeScrollbar;
      var props = _objectWithoutPropertiesLoose(_this$props, ["excludeScrollbar"]);
      if (WrappedComponent.prototype && WrappedComponent.prototype.isReactComponent) {
        props.ref = this.getRef;
      } else {
        props.wrappedRef = this.getRef;
      }
      props.disableOnClickOutside = this.disableOnClickOutside;
      props.enableOnClickOutside = this.enableOnClickOutside;
      return (0, import_react.createElement)(WrappedComponent, props);
    };
    return onClickOutside;
  }(import_react.Component), _class.displayName = "OnClickOutside(" + componentName + ")", _class.defaultProps = {
    eventTypes: ["mousedown", "touchstart"],
    excludeScrollbar: config && config.excludeScrollbar || false,
    outsideClickIgnoreClass: IGNORE_CLASS_NAME,
    preventDefault: false,
    stopPropagation: false
  }, _class.getClass = function() {
    return WrappedComponent.getClass ? WrappedComponent.getClass() : WrappedComponent;
  }, _temp;
}
var react_onclickoutside_es_default = onClickOutsideHOC;

// node_modules/react-datepicker/dist/es/index.js
var import_react_dom2 = __toESM(require_react_dom());

// node_modules/react-popper/lib/esm/Popper.js
var React4 = __toESM(require_react());

// node_modules/react-popper/lib/esm/Manager.js
var React = __toESM(require_react());
var ManagerReferenceNodeContext = React.createContext();
var ManagerReferenceNodeSetterContext = React.createContext();
function Manager(_ref) {
  var children = _ref.children;
  var _React$useState = React.useState(null), referenceNode = _React$useState[0], setReferenceNode = _React$useState[1];
  var hasUnmounted = React.useRef(false);
  React.useEffect(function() {
    return function() {
      hasUnmounted.current = true;
    };
  }, []);
  var handleSetReferenceNode = React.useCallback(function(node) {
    if (!hasUnmounted.current) {
      setReferenceNode(node);
    }
  }, []);
  return React.createElement(ManagerReferenceNodeContext.Provider, {
    value: referenceNode
  }, React.createElement(ManagerReferenceNodeSetterContext.Provider, {
    value: handleSetReferenceNode
  }, children));
}

// node_modules/react-popper/lib/esm/utils.js
var React2 = __toESM(require_react());
var unwrapArray = function unwrapArray2(arg) {
  return Array.isArray(arg) ? arg[0] : arg;
};
var safeInvoke = function safeInvoke2(fn2) {
  if (typeof fn2 === "function") {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    return fn2.apply(void 0, args);
  }
};
var setRef = function setRef2(ref, node) {
  if (typeof ref === "function") {
    return safeInvoke(ref, node);
  } else if (ref != null) {
    ref.current = node;
  }
};
var fromEntries = function fromEntries2(entries) {
  return entries.reduce(function(acc, _ref) {
    var key = _ref[0], value = _ref[1];
    acc[key] = value;
    return acc;
  }, {});
};
var useIsomorphicLayoutEffect = typeof window !== "undefined" && window.document && window.document.createElement ? React2.useLayoutEffect : React2.useEffect;

// node_modules/react-popper/lib/esm/usePopper.js
var React3 = __toESM(require_react());
var ReactDOM = __toESM(require_react_dom());

// node_modules/@popperjs/core/lib/enums.js
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

// node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}

// node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}

// node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// node_modules/@popperjs/core/lib/modifiers/applyStyles.js
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles_default = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect,
  requires: ["computeStyles"]
};

// node_modules/@popperjs/core/lib/utils/getBasePlacement.js
function getBasePlacement(placement) {
  return placement.split("-")[0];
}

// node_modules/@popperjs/core/lib/utils/math.js
var max2 = Math.max;
var min2 = Math.min;
var round = Math.round;

// node_modules/@popperjs/core/lib/utils/userAgent.js
function getUAString() {
  var uaData = navigator.userAgentData;
  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function(item) {
      return item.brand + "/" + item.version;
    }).join(" ");
  }
  return navigator.userAgent;
}

// node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js
function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

// node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }
  var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x2 = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y3 = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width,
    height,
    top: y3,
    right: x2 + width,
    bottom: y3 + height,
    left: x2,
    x: x2,
    y: y3
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}

// node_modules/@popperjs/core/lib/dom-utils/contains.js
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}

// node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
function getComputedStyle(element) {
  return getWindow(element).getComputedStyle(element);
}

// node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}

// node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : (
    // $FlowFixMe[prop-missing]
    element.document
  )) || window.document).documentElement;
}

// node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || // DOM Element detected
    (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element)
  );
}

// node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}

// node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}

// node_modules/@popperjs/core/lib/utils/within.js
function within(min3, value, max3) {
  return max2(min3, min2(value, max3));
}
function withinMaxClamp(min3, value, max3) {
  var v = within(min3, value, max3);
  return v > max3 ? max3 : v;
}

// node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

// node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

// node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

// node_modules/@popperjs/core/lib/modifiers/arrow.js
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min3 = paddingObject[minProp];
  var max3 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min3, center, max3);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect2(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow_default = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect2,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};

// node_modules/@popperjs/core/lib/utils/getVariation.js
function getVariation(placement) {
  return placement.split("-")[1];
}

// node_modules/@popperjs/core/lib/modifiers/computeStyles.js
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref, win) {
  var x2 = _ref.x, y3 = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x2 * dpr) / dpr || 0,
    y: round(y3 * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x2 = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y3 = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x: x2,
    y: y3
  }) : {
    x: x2,
    y: y3
  };
  x2 = _ref3.x;
  y3 = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        offsetParent[heightProp]
      );
      y3 -= offsetY - popperRect.height;
      y3 *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        offsetParent[widthProp]
      );
      x2 -= offsetX - popperRect.width;
      x2 *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x: x2,
    y: y3
  }, getWindow(popper2)) : {
    x: x2,
    y: y3
  };
  x2 = _ref4.x;
  y3 = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x2 + "px, " + y3 + "px)" : "translate3d(" + x2 + "px, " + y3 + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y3 + "px" : "", _Object$assign2[sideX] = hasX ? x2 + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles_default = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};

// node_modules/@popperjs/core/lib/modifiers/eventListeners.js
var passive = {
  passive: true
};
function effect3(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners_default = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect: effect3,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
var hash = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash[matched];
  });
}

// node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
var hash2 = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash2[matched];
  });
}

// node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

// node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x2 = 0;
  var y3 = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === "fixed") {
      x2 = visualViewport.offsetLeft;
      y3 = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x2 + getWindowScrollBarX(element),
    y: y3
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max2(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max2(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x2 = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y3 = -winScroll.scrollTop;
  if (getComputedStyle(body || html).direction === "rtl") {
    x2 += max2(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x: x2,
    y: y3
  };
}

// node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

// node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}

// node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)))
  );
}

// node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

// node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === "fixed");
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max2(rect.top, accRect.top);
    accRect.right = min2(rect.right, accRect.right);
    accRect.bottom = min2(rect.bottom, accRect.bottom);
    accRect.left = max2(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

// node_modules/@popperjs/core/lib/utils/computeOffsets.js
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
      default:
    }
  }
  return offsets;
}

// node_modules/@popperjs/core/lib/utils/detectOverflow.js
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}

// node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements2 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements2.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements2;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a3, b2) {
    return overflows[a3] - overflows[b2];
  });
}

// node_modules/@popperjs/core/lib/modifiers/flip.js
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i2 = 0; i2 < placements2.length; i2++) {
    var placement = placements2[i2];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break") break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip_default = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};

// node_modules/@popperjs/core/lib/modifiers/hide.js
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide_default = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};

// node_modules/@popperjs/core/lib/modifiers/offset.js
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x2 = _data$state$placement.x, y3 = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x2;
    state.modifiersData.popperOffsets.y += y3;
  }
  state.modifiersData[name] = data;
}
var offset_default = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};

// node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets_default = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getAltAxis.js
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}

// node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min3 = offset2 + overflow[mainSide];
    var max3 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min2(min3, tetherMin) : min3, offset2, tether ? max2(max3, tetherMax) : max3);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
}
var preventOverflow_default = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};

// node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

// node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

// node_modules/@popperjs/core/lib/utils/orderModifiers.js
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

// node_modules/@popperjs/core/lib/utils/debounce.js
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn2());
        });
      });
    }
    return pending;
  };
}

// node_modules/@popperjs/core/lib/utils/mergeByName.js
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}

// node_modules/@popperjs/core/lib/createPopper.js
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers3 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions2 = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper4(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions2;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions2),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions2, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers3, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m3) {
          return m3.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function() {
        return new Promise(function(resolve) {
          instance.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref) {
        var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect4 = _ref.effect;
        if (typeof effect4 === "function") {
          var cleanupFn = effect4({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var createPopper = popperGenerator();

// node_modules/@popperjs/core/lib/popper-lite.js
var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default];
var createPopper2 = popperGenerator({
  defaultModifiers
});

// node_modules/@popperjs/core/lib/popper.js
var defaultModifiers2 = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default, offset_default, flip_default, preventOverflow_default, arrow_default, hide_default];
var createPopper3 = popperGenerator({
  defaultModifiers: defaultModifiers2
});

// node_modules/react-popper/lib/esm/usePopper.js
var import_react_fast_compare = __toESM(require_react_fast_compare());
var EMPTY_MODIFIERS = [];
var usePopper = function usePopper2(referenceElement, popperElement, options) {
  if (options === void 0) {
    options = {};
  }
  var prevOptions = React3.useRef(null);
  var optionsWithDefaults = {
    onFirstUpdate: options.onFirstUpdate,
    placement: options.placement || "bottom",
    strategy: options.strategy || "absolute",
    modifiers: options.modifiers || EMPTY_MODIFIERS
  };
  var _React$useState = React3.useState({
    styles: {
      popper: {
        position: optionsWithDefaults.strategy,
        left: "0",
        top: "0"
      },
      arrow: {
        position: "absolute"
      }
    },
    attributes: {}
  }), state = _React$useState[0], setState = _React$useState[1];
  var updateStateModifier = React3.useMemo(function() {
    return {
      name: "updateState",
      enabled: true,
      phase: "write",
      fn: function fn2(_ref) {
        var state2 = _ref.state;
        var elements = Object.keys(state2.elements);
        ReactDOM.flushSync(function() {
          setState({
            styles: fromEntries(elements.map(function(element) {
              return [element, state2.styles[element] || {}];
            })),
            attributes: fromEntries(elements.map(function(element) {
              return [element, state2.attributes[element]];
            }))
          });
        });
      },
      requires: ["computeStyles"]
    };
  }, []);
  var popperOptions = React3.useMemo(function() {
    var newOptions = {
      onFirstUpdate: optionsWithDefaults.onFirstUpdate,
      placement: optionsWithDefaults.placement,
      strategy: optionsWithDefaults.strategy,
      modifiers: [].concat(optionsWithDefaults.modifiers, [updateStateModifier, {
        name: "applyStyles",
        enabled: false
      }])
    };
    if ((0, import_react_fast_compare.default)(prevOptions.current, newOptions)) {
      return prevOptions.current || newOptions;
    } else {
      prevOptions.current = newOptions;
      return newOptions;
    }
  }, [optionsWithDefaults.onFirstUpdate, optionsWithDefaults.placement, optionsWithDefaults.strategy, optionsWithDefaults.modifiers, updateStateModifier]);
  var popperInstanceRef = React3.useRef();
  useIsomorphicLayoutEffect(function() {
    if (popperInstanceRef.current) {
      popperInstanceRef.current.setOptions(popperOptions);
    }
  }, [popperOptions]);
  useIsomorphicLayoutEffect(function() {
    if (referenceElement == null || popperElement == null) {
      return;
    }
    var createPopper4 = options.createPopper || createPopper3;
    var popperInstance = createPopper4(referenceElement, popperElement, popperOptions);
    popperInstanceRef.current = popperInstance;
    return function() {
      popperInstance.destroy();
      popperInstanceRef.current = null;
    };
  }, [referenceElement, popperElement, options.createPopper]);
  return {
    state: popperInstanceRef.current ? popperInstanceRef.current.state : null,
    styles: state.styles,
    attributes: state.attributes,
    update: popperInstanceRef.current ? popperInstanceRef.current.update : null,
    forceUpdate: popperInstanceRef.current ? popperInstanceRef.current.forceUpdate : null
  };
};

// node_modules/react-popper/lib/esm/Popper.js
var NOOP = function NOOP2() {
  return void 0;
};
var NOOP_PROMISE = function NOOP_PROMISE2() {
  return Promise.resolve(null);
};
var EMPTY_MODIFIERS2 = [];
function Popper(_ref) {
  var _ref$placement = _ref.placement, placement = _ref$placement === void 0 ? "bottom" : _ref$placement, _ref$strategy = _ref.strategy, strategy = _ref$strategy === void 0 ? "absolute" : _ref$strategy, _ref$modifiers = _ref.modifiers, modifiers = _ref$modifiers === void 0 ? EMPTY_MODIFIERS2 : _ref$modifiers, referenceElement = _ref.referenceElement, onFirstUpdate = _ref.onFirstUpdate, innerRef = _ref.innerRef, children = _ref.children;
  var referenceNode = React4.useContext(ManagerReferenceNodeContext);
  var _React$useState = React4.useState(null), popperElement = _React$useState[0], setPopperElement = _React$useState[1];
  var _React$useState2 = React4.useState(null), arrowElement = _React$useState2[0], setArrowElement = _React$useState2[1];
  React4.useEffect(function() {
    setRef(innerRef, popperElement);
  }, [innerRef, popperElement]);
  var options = React4.useMemo(function() {
    return {
      placement,
      strategy,
      onFirstUpdate,
      modifiers: [].concat(modifiers, [{
        name: "arrow",
        enabled: arrowElement != null,
        options: {
          element: arrowElement
        }
      }])
    };
  }, [placement, strategy, onFirstUpdate, modifiers, arrowElement]);
  var _usePopper = usePopper(referenceElement || referenceNode, popperElement, options), state = _usePopper.state, styles = _usePopper.styles, forceUpdate = _usePopper.forceUpdate, update = _usePopper.update;
  var childrenProps = React4.useMemo(function() {
    return {
      ref: setPopperElement,
      style: styles.popper,
      placement: state ? state.placement : placement,
      hasPopperEscaped: state && state.modifiersData.hide ? state.modifiersData.hide.hasPopperEscaped : null,
      isReferenceHidden: state && state.modifiersData.hide ? state.modifiersData.hide.isReferenceHidden : null,
      arrowProps: {
        style: styles.arrow,
        ref: setArrowElement
      },
      forceUpdate: forceUpdate || NOOP,
      update: update || NOOP_PROMISE
    };
  }, [setPopperElement, setArrowElement, placement, state, styles, update, forceUpdate]);
  return unwrapArray(children)(childrenProps);
}

// node_modules/react-popper/lib/esm/Reference.js
var React5 = __toESM(require_react());
var import_warning = __toESM(require_warning());
function Reference(_ref) {
  var children = _ref.children, innerRef = _ref.innerRef;
  var setReferenceNode = React5.useContext(ManagerReferenceNodeSetterContext);
  var refHandler = React5.useCallback(function(node) {
    setRef(innerRef, node);
    safeInvoke(setReferenceNode, node);
  }, [innerRef, setReferenceNode]);
  React5.useEffect(function() {
    return function() {
      return setRef(innerRef, null);
    };
  }, []);
  React5.useEffect(function() {
    (0, import_warning.default)(Boolean(setReferenceNode), "`Reference` should not be used outside of a `Manager` component.");
  }, [setReferenceNode]);
  return unwrapArray(children)({
    ref: refHandler
  });
}

// node_modules/date-fns/esm/set/index.js
function set(dirtyDate, values) {
  requiredArgs(2, arguments);
  if (_typeof(values) !== "object" || values === null) {
    throw new RangeError("values parameter must be an object");
  }
  var date = toDate(dirtyDate);
  if (isNaN(date.getTime())) {
    return /* @__PURE__ */ new Date(NaN);
  }
  if (values.year != null) {
    date.setFullYear(values.year);
  }
  if (values.month != null) {
    date = setMonth(date, values.month);
  }
  if (values.date != null) {
    date.setDate(toInteger(values.date));
  }
  if (values.hours != null) {
    date.setHours(toInteger(values.hours));
  }
  if (values.minutes != null) {
    date.setMinutes(toInteger(values.minutes));
  }
  if (values.seconds != null) {
    date.setSeconds(toInteger(values.seconds));
  }
  if (values.milliseconds != null) {
    date.setMilliseconds(toInteger(values.milliseconds));
  }
  return date;
}

// node_modules/react-datepicker/dist/es/index.js
function le(e3, t3) {
  var r2 = Object.keys(e3);
  if (Object.getOwnPropertySymbols) {
    var n = Object.getOwnPropertySymbols(e3);
    t3 && (n = n.filter(function(t4) {
      return Object.getOwnPropertyDescriptor(e3, t4).enumerable;
    })), r2.push.apply(r2, n);
  }
  return r2;
}
function de(e3) {
  for (var t3 = 1; t3 < arguments.length; t3++) {
    var r2 = null != arguments[t3] ? arguments[t3] : {};
    t3 % 2 ? le(Object(r2), true).forEach(function(t4) {
      ye(e3, t4, r2[t4]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e3, Object.getOwnPropertyDescriptors(r2)) : le(Object(r2)).forEach(function(t4) {
      Object.defineProperty(e3, t4, Object.getOwnPropertyDescriptor(r2, t4));
    });
  }
  return e3;
}
function ue(e3) {
  return ue = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
    return typeof e4;
  } : function(e4) {
    return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
  }, ue(e3);
}
function he(e3, t3) {
  if (!(e3 instanceof t3)) throw new TypeError("Cannot call a class as a function");
}
function me(e3, t3) {
  for (var r2 = 0; r2 < t3.length; r2++) {
    var n = t3[r2];
    n.enumerable = n.enumerable || false, n.configurable = true, "value" in n && (n.writable = true), Object.defineProperty(e3, _e(n.key), n);
  }
}
function fe(e3, t3, r2) {
  return t3 && me(e3.prototype, t3), r2 && me(e3, r2), Object.defineProperty(e3, "prototype", { writable: false }), e3;
}
function ye(e3, t3, r2) {
  return (t3 = _e(t3)) in e3 ? Object.defineProperty(e3, t3, { value: r2, enumerable: true, configurable: true, writable: true }) : e3[t3] = r2, e3;
}
function ve() {
  return ve = Object.assign ? Object.assign.bind() : function(e3) {
    for (var t3 = 1; t3 < arguments.length; t3++) {
      var r2 = arguments[t3];
      for (var n in r2) Object.prototype.hasOwnProperty.call(r2, n) && (e3[n] = r2[n]);
    }
    return e3;
  }, ve.apply(this, arguments);
}
function De(e3, t3) {
  if ("function" != typeof t3 && null !== t3) throw new TypeError("Super expression must either be null or a function");
  e3.prototype = Object.create(t3 && t3.prototype, { constructor: { value: e3, writable: true, configurable: true } }), Object.defineProperty(e3, "prototype", { writable: false }), t3 && ke(e3, t3);
}
function ge(e3) {
  return ge = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(e4) {
    return e4.__proto__ || Object.getPrototypeOf(e4);
  }, ge(e3);
}
function ke(e3, t3) {
  return ke = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(e4, t4) {
    return e4.__proto__ = t4, e4;
  }, ke(e3, t3);
}
function we(e3) {
  if (void 0 === e3) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e3;
}
function be(e3) {
  var t3 = function() {
    if ("undefined" == typeof Reflect || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if ("function" == typeof Proxy) return true;
    try {
      return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      })), true;
    } catch (e4) {
      return false;
    }
  }();
  return function() {
    var r2, n = ge(e3);
    if (t3) {
      var o = ge(this).constructor;
      r2 = Reflect.construct(n, arguments, o);
    } else r2 = n.apply(this, arguments);
    return function(e4, t4) {
      if (t4 && ("object" == typeof t4 || "function" == typeof t4)) return t4;
      if (void 0 !== t4) throw new TypeError("Derived constructors may only return object or undefined");
      return we(e4);
    }(this, r2);
  };
}
function Se(e3) {
  return function(e4) {
    if (Array.isArray(e4)) return Ce(e4);
  }(e3) || function(e4) {
    if ("undefined" != typeof Symbol && null != e4[Symbol.iterator] || null != e4["@@iterator"]) return Array.from(e4);
  }(e3) || function(e4, t3) {
    if (!e4) return;
    if ("string" == typeof e4) return Ce(e4, t3);
    var r2 = Object.prototype.toString.call(e4).slice(8, -1);
    "Object" === r2 && e4.constructor && (r2 = e4.constructor.name);
    if ("Map" === r2 || "Set" === r2) return Array.from(e4);
    if ("Arguments" === r2 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r2)) return Ce(e4, t3);
  }(e3) || function() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }();
}
function Ce(e3, t3) {
  (null == t3 || t3 > e3.length) && (t3 = e3.length);
  for (var r2 = 0, n = new Array(t3); r2 < t3; r2++) n[r2] = e3[r2];
  return n;
}
function _e(e3) {
  var t3 = function(e4, t4) {
    if ("object" != typeof e4 || null === e4) return e4;
    var r2 = e4[Symbol.toPrimitive];
    if (void 0 !== r2) {
      var n = r2.call(e4, t4 || "default");
      if ("object" != typeof n) return n;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === t4 ? String : Number)(e4);
  }(e3, "string");
  return "symbol" == typeof t3 ? t3 : String(t3);
}
var Me = function(e3, t3) {
  switch (e3) {
    case "P":
      return t3.date({ width: "short" });
    case "PP":
      return t3.date({ width: "medium" });
    case "PPP":
      return t3.date({ width: "long" });
    default:
      return t3.date({ width: "full" });
  }
};
var Pe = function(e3, t3) {
  switch (e3) {
    case "p":
      return t3.time({ width: "short" });
    case "pp":
      return t3.time({ width: "medium" });
    case "ppp":
      return t3.time({ width: "long" });
    default:
      return t3.time({ width: "full" });
  }
};
var Ee = { p: Pe, P: function(e3, t3) {
  var r2, n = e3.match(/(P+)(p+)?/) || [], o = n[1], a3 = n[2];
  if (!a3) return Me(e3, t3);
  switch (o) {
    case "P":
      r2 = t3.dateTime({ width: "short" });
      break;
    case "PP":
      r2 = t3.dateTime({ width: "medium" });
      break;
    case "PPP":
      r2 = t3.dateTime({ width: "long" });
      break;
    default:
      r2 = t3.dateTime({ width: "full" });
  }
  return r2.replace("{{date}}", Me(o, t3)).replace("{{time}}", Pe(a3, t3));
} };
var Ne = 12;
var xe = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g;
function Ye(e3) {
  var t3 = e3 ? "string" == typeof e3 || e3 instanceof String ? parseISO(e3) : toDate(e3) : /* @__PURE__ */ new Date();
  return Te(t3) ? t3 : null;
}
function Te(e3, t3) {
  return t3 = t3 || /* @__PURE__ */ new Date("1/1/1000"), isValid(e3) && !isBefore(e3, t3);
}
function Ie(e3, t3, r2) {
  if ("en" === r2) return format(e3, t3, { awareOfUnicodeTokens: true });
  var n = Ge(r2);
  return r2 && !n && console.warn('A locale object was not found for the provided string ["'.concat(r2, '"].')), !n && $e() && Ge($e()) && (n = Ge($e())), format(e3, t3, { locale: n || null, awareOfUnicodeTokens: true });
}
function Oe(e3, t3) {
  var r2 = t3.dateFormat, n = t3.locale;
  return e3 && Ie(e3, Array.isArray(r2) ? r2[0] : r2, n) || "";
}
function Re(e3, t3) {
  var r2 = t3.hour, n = void 0 === r2 ? 0 : r2, o = t3.minute, a3 = void 0 === o ? 0 : o, s3 = t3.second;
  return setHours(setMinutes(setSeconds(e3, void 0 === s3 ? 0 : s3), a3), n);
}
function Le(e3, t3, r2) {
  var n = Ge(t3 || $e());
  return startOfWeek(e3, { locale: n, weekStartsOn: r2 });
}
function Fe(e3) {
  return startOfMonth(e3);
}
function Ae(e3) {
  return startOfYear(e3);
}
function We(e3) {
  return startOfQuarter(e3);
}
function Ke() {
  return startOfDay(Ye());
}
function Be(e3, t3) {
  return e3 && t3 ? isSameYear(e3, t3) : !e3 && !t3;
}
function Qe(e3, t3) {
  return e3 && t3 ? isSameMonth(e3, t3) : !e3 && !t3;
}
function He(e3, t3) {
  return e3 && t3 ? isSameQuarter(e3, t3) : !e3 && !t3;
}
function je(e3, t3) {
  return e3 && t3 ? isSameDay(e3, t3) : !e3 && !t3;
}
function Ve(e3, t3) {
  return e3 && t3 ? isEqual(e3, t3) : !e3 && !t3;
}
function qe(e3, t3, r2) {
  var n, o = startOfDay(t3), a3 = endOfDay(r2);
  try {
    n = isWithinInterval(e3, { start: o, end: a3 });
  } catch (e4) {
    n = false;
  }
  return n;
}
function Ue(e3, t3) {
  var r2 = "undefined" != typeof window ? window : globalThis;
  r2.__localeData__ || (r2.__localeData__ = {}), r2.__localeData__[e3] = t3;
}
function ze(e3) {
  ("undefined" != typeof window ? window : globalThis).__localeId__ = e3;
}
function $e() {
  return ("undefined" != typeof window ? window : globalThis).__localeId__;
}
function Ge(e3) {
  if ("string" == typeof e3) {
    var t3 = "undefined" != typeof window ? window : globalThis;
    return t3.__localeData__ ? t3.__localeData__[e3] : null;
  }
  return e3;
}
function Je(e3, t3) {
  return Ie(setMonth(Ye(), e3), "LLLL", t3);
}
function Xe(e3, t3) {
  return Ie(setMonth(Ye(), e3), "LLL", t3);
}
function Ze(e3) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r2 = t3.minDate, n = t3.maxDate, o = t3.excludeDates, a3 = t3.excludeDateIntervals, s3 = t3.includeDates, i2 = t3.includeDateIntervals, p = t3.filterDate;
  return it(e3, { minDate: r2, maxDate: n }) || o && o.some(function(t4) {
    return je(e3, t4);
  }) || a3 && a3.some(function(t4) {
    var r3 = t4.start, n2 = t4.end;
    return isWithinInterval(e3, { start: r3, end: n2 });
  }) || s3 && !s3.some(function(t4) {
    return je(e3, t4);
  }) || i2 && !i2.some(function(t4) {
    var r3 = t4.start, n2 = t4.end;
    return isWithinInterval(e3, { start: r3, end: n2 });
  }) || p && !p(Ye(e3)) || false;
}
function et(e3) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r2 = t3.excludeDates, n = t3.excludeDateIntervals;
  return n && n.length > 0 ? n.some(function(t4) {
    var r3 = t4.start, n2 = t4.end;
    return isWithinInterval(e3, { start: r3, end: n2 });
  }) : r2 && r2.some(function(t4) {
    return je(e3, t4);
  }) || false;
}
function tt(e3) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r2 = t3.minDate, n = t3.maxDate, o = t3.excludeDates, a3 = t3.includeDates, s3 = t3.filterDate;
  return it(e3, { minDate: startOfMonth(r2), maxDate: endOfMonth(n) }) || o && o.some(function(t4) {
    return Qe(e3, t4);
  }) || a3 && !a3.some(function(t4) {
    return Qe(e3, t4);
  }) || s3 && !s3(Ye(e3)) || false;
}
function rt(e3, t3, r2, n) {
  var o = getYear(e3), a3 = getMonth(e3), s3 = getYear(t3), i2 = getMonth(t3), p = getYear(n);
  return o === s3 && o === p ? a3 <= r2 && r2 <= i2 : o < s3 ? p === o && a3 <= r2 || p === s3 && i2 >= r2 || p < s3 && p > o : void 0;
}
function nt(e3) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r2 = t3.minDate, n = t3.maxDate, o = t3.excludeDates, a3 = t3.includeDates, s3 = t3.filterDate;
  return it(e3, { minDate: r2, maxDate: n }) || o && o.some(function(t4) {
    return He(e3, t4);
  }) || a3 && !a3.some(function(t4) {
    return He(e3, t4);
  }) || s3 && !s3(Ye(e3)) || false;
}
function ot(e3, t3, r2) {
  if (!isValid(t3) || !isValid(r2)) return false;
  var n = getYear(t3), a3 = getYear(r2);
  return n <= e3 && a3 >= e3;
}
function at(e3) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r2 = t3.minDate, n = t3.maxDate, o = t3.excludeDates, a3 = t3.includeDates, s3 = t3.filterDate, i2 = new Date(e3, 0, 1);
  return it(i2, { minDate: startOfYear(r2), maxDate: endOfYear(n) }) || o && o.some(function(e4) {
    return Be(i2, e4);
  }) || a3 && !a3.some(function(e4) {
    return Be(i2, e4);
  }) || s3 && !s3(Ye(i2)) || false;
}
function st(e3, t3, r2, n) {
  var o = getYear(e3), a3 = getQuarter(e3), s3 = getYear(t3), i2 = getQuarter(t3), p = getYear(n);
  return o === s3 && o === p ? a3 <= r2 && r2 <= i2 : o < s3 ? p === o && a3 <= r2 || p === s3 && i2 >= r2 || p < s3 && p > o : void 0;
}
function it(e3) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r2 = t3.minDate, n = t3.maxDate;
  return r2 && differenceInCalendarDays(e3, r2) < 0 || n && differenceInCalendarDays(e3, n) > 0;
}
function pt(e3, t3) {
  return t3.some(function(t4) {
    return getHours(t4) === getHours(e3) && getMinutes(t4) === getMinutes(e3);
  });
}
function ct(e3) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r2 = t3.excludeTimes, n = t3.includeTimes, o = t3.filterTime;
  return r2 && pt(e3, r2) || n && !pt(e3, n) || o && !o(e3) || false;
}
function lt(e3, t3) {
  var r2 = t3.minTime, n = t3.maxTime;
  if (!r2 || !n) throw new Error("Both minTime and maxTime props required");
  var o, a3 = Ye(), s3 = setHours(setMinutes(a3, getMinutes(e3)), getHours(e3)), i2 = setHours(setMinutes(a3, getMinutes(r2)), getHours(r2)), p = setHours(setMinutes(a3, getMinutes(n)), getHours(n));
  try {
    o = !isWithinInterval(s3, { start: i2, end: p });
  } catch (e4) {
    o = false;
  }
  return o;
}
function dt(e3) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r2 = t3.minDate, n = t3.includeDates, o = subMonths(e3, 1);
  return r2 && differenceInCalendarMonths(r2, o) > 0 || n && n.every(function(e4) {
    return differenceInCalendarMonths(e4, o) > 0;
  }) || false;
}
function ut(e3) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r2 = t3.maxDate, n = t3.includeDates, o = addMonths(e3, 1);
  return r2 && differenceInCalendarMonths(o, r2) > 0 || n && n.every(function(e4) {
    return differenceInCalendarMonths(o, e4) > 0;
  }) || false;
}
function ht(e3) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r2 = t3.minDate, n = t3.includeDates, o = subYears(e3, 1);
  return r2 && differenceInCalendarYears(r2, o) > 0 || n && n.every(function(e4) {
    return differenceInCalendarYears(e4, o) > 0;
  }) || false;
}
function mt(e3) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r2 = t3.maxDate, n = t3.includeDates, o = addYears(e3, 1);
  return r2 && differenceInCalendarYears(o, r2) > 0 || n && n.every(function(e4) {
    return differenceInCalendarYears(o, e4) > 0;
  }) || false;
}
function ft(e3) {
  var t3 = e3.minDate, r2 = e3.includeDates;
  if (r2 && t3) {
    var n = r2.filter(function(e4) {
      return differenceInCalendarDays(e4, t3) >= 0;
    });
    return min(n);
  }
  return r2 ? min(r2) : t3;
}
function yt(e3) {
  var t3 = e3.maxDate, r2 = e3.includeDates;
  if (r2 && t3) {
    var n = r2.filter(function(e4) {
      return differenceInCalendarDays(e4, t3) <= 0;
    });
    return max(n);
  }
  return r2 ? max(r2) : t3;
}
function vt() {
  for (var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "react-datepicker__day--highlighted", r2 = /* @__PURE__ */ new Map(), o = 0, a3 = e3.length; o < a3; o++) {
    var s3 = e3[o];
    if (isDate(s3)) {
      var i2 = Ie(s3, "MM.dd.yyyy"), p = r2.get(i2) || [];
      p.includes(t3) || (p.push(t3), r2.set(i2, p));
    } else if ("object" === ue(s3)) {
      var c2 = Object.keys(s3), l = c2[0], d3 = s3[c2[0]];
      if ("string" == typeof l && d3.constructor === Array) for (var u2 = 0, h3 = d3.length; u2 < h3; u2++) {
        var m3 = Ie(d3[u2], "MM.dd.yyyy"), f = r2.get(m3) || [];
        f.includes(l) || (f.push(l), r2.set(m3, f));
      }
    }
  }
  return r2;
}
function Dt() {
  var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "react-datepicker__day--holidays", r2 = /* @__PURE__ */ new Map();
  return e3.forEach(function(e4) {
    var o = e4.date, a3 = e4.holidayName;
    if (isDate(o)) {
      var s3 = Ie(o, "MM.dd.yyyy"), i2 = r2.get(s3) || {};
      if (!("className" in i2) || i2.className !== t3 || (p = i2.holidayNames, c2 = [a3], p.length !== c2.length || !p.every(function(e5, t4) {
        return e5 === c2[t4];
      }))) {
        var p, c2;
        i2.className = t3;
        var l = i2.holidayNames;
        i2.holidayNames = l ? [].concat(Se(l), [a3]) : [a3], r2.set(s3, i2);
      }
    }
  }), r2;
}
function gt(e3, t3, r2, n, o) {
  for (var a3 = o.length, p = [], c2 = 0; c2 < a3; c2++) {
    var l = addMinutes(addHours(e3, getHours(o[c2])), getMinutes(o[c2])), d3 = addMinutes(e3, (r2 + 1) * n);
    isAfter(l, t3) && isBefore(l, d3) && p.push(o[c2]);
  }
  return p;
}
function kt(e3) {
  return e3 < 10 ? "0".concat(e3) : "".concat(e3);
}
function wt(e3) {
  var t3 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : Ne, r2 = Math.ceil(getYear(e3) / t3) * t3;
  return { startPeriod: r2 - (t3 - 1), endPeriod: r2 };
}
function bt(e3) {
  var t3 = e3.getSeconds(), r2 = e3.getMilliseconds();
  return toDate(e3.getTime() - 1e3 * t3 - r2);
}
function St(e3, t3, r2, n) {
  for (var o = [], a3 = 0; a3 < 2 * t3 + 1; a3++) {
    var s3 = e3 + t3 - a3, i2 = true;
    r2 && (i2 = getYear(r2) <= s3), n && i2 && (i2 = getYear(n) >= s3), i2 && o.push(s3);
  }
  return o;
}
var Ct = react_onclickoutside_es_default(function(n) {
  De(a3, import_react2.default.Component);
  var o = be(a3);
  function a3(r2) {
    var n2;
    he(this, a3), ye(we(n2 = o.call(this, r2)), "renderOptions", function() {
      var t3 = n2.props.year, r3 = n2.state.yearsList.map(function(r4) {
        return import_react2.default.createElement("div", { className: t3 === r4 ? "react-datepicker__year-option react-datepicker__year-option--selected_year" : "react-datepicker__year-option", key: r4, onClick: n2.onChange.bind(we(n2), r4), "aria-selected": t3 === r4 ? "true" : void 0 }, t3 === r4 ? import_react2.default.createElement("span", { className: "react-datepicker__year-option--selected" }, "✓") : "", r4);
      }), o2 = n2.props.minDate ? getYear(n2.props.minDate) : null, a4 = n2.props.maxDate ? getYear(n2.props.maxDate) : null;
      return a4 && n2.state.yearsList.find(function(e3) {
        return e3 === a4;
      }) || r3.unshift(import_react2.default.createElement("div", { className: "react-datepicker__year-option", key: "upcoming", onClick: n2.incrementYears }, import_react2.default.createElement("a", { className: "react-datepicker__navigation react-datepicker__navigation--years react-datepicker__navigation--years-upcoming" }))), o2 && n2.state.yearsList.find(function(e3) {
        return e3 === o2;
      }) || r3.push(import_react2.default.createElement("div", { className: "react-datepicker__year-option", key: "previous", onClick: n2.decrementYears }, import_react2.default.createElement("a", { className: "react-datepicker__navigation react-datepicker__navigation--years react-datepicker__navigation--years-previous" }))), r3;
    }), ye(we(n2), "onChange", function(e3) {
      n2.props.onChange(e3);
    }), ye(we(n2), "handleClickOutside", function() {
      n2.props.onCancel();
    }), ye(we(n2), "shiftYears", function(e3) {
      var t3 = n2.state.yearsList.map(function(t4) {
        return t4 + e3;
      });
      n2.setState({ yearsList: t3 });
    }), ye(we(n2), "incrementYears", function() {
      return n2.shiftYears(1);
    }), ye(we(n2), "decrementYears", function() {
      return n2.shiftYears(-1);
    });
    var s3 = r2.yearDropdownItemNumber, i2 = r2.scrollableYearDropdown, p = s3 || (i2 ? 10 : 5);
    return n2.state = { yearsList: St(n2.props.year, p, n2.props.minDate, n2.props.maxDate) }, n2.dropdownRef = (0, import_react2.createRef)(), n2;
  }
  return fe(a3, [{ key: "componentDidMount", value: function() {
    var e3 = this.dropdownRef.current;
    if (e3) {
      var t3 = e3.children ? Array.from(e3.children) : null, r2 = t3 ? t3.find(function(e4) {
        return e4.ariaSelected;
      }) : null;
      e3.scrollTop = r2 ? r2.offsetTop + (r2.clientHeight - e3.clientHeight) / 2 : (e3.scrollHeight - e3.clientHeight) / 2;
    }
  } }, { key: "render", value: function() {
    var t3 = (0, import_classnames.default)({ "react-datepicker__year-dropdown": true, "react-datepicker__year-dropdown--scrollable": this.props.scrollableYearDropdown });
    return import_react2.default.createElement("div", { className: t3, ref: this.dropdownRef }, this.renderOptions());
  } }]), a3;
}());
var _t = function(t3) {
  De(n, import_react2.default.Component);
  var r2 = be(n);
  function n() {
    var t4;
    he(this, n);
    for (var o = arguments.length, a3 = new Array(o), s3 = 0; s3 < o; s3++) a3[s3] = arguments[s3];
    return ye(we(t4 = r2.call.apply(r2, [this].concat(a3))), "state", { dropdownVisible: false }), ye(we(t4), "renderSelectOptions", function() {
      for (var r3 = t4.props.minDate ? getYear(t4.props.minDate) : 1900, n2 = t4.props.maxDate ? getYear(t4.props.maxDate) : 2100, o2 = [], a4 = r3; a4 <= n2; a4++) o2.push(import_react2.default.createElement("option", { key: a4, value: a4 }, a4));
      return o2;
    }), ye(we(t4), "onSelectChange", function(e3) {
      t4.onChange(e3.target.value);
    }), ye(we(t4), "renderSelectMode", function() {
      return import_react2.default.createElement("select", { value: t4.props.year, className: "react-datepicker__year-select", onChange: t4.onSelectChange }, t4.renderSelectOptions());
    }), ye(we(t4), "renderReadView", function(r3) {
      return import_react2.default.createElement("div", { key: "read", style: { visibility: r3 ? "visible" : "hidden" }, className: "react-datepicker__year-read-view", onClick: function(e3) {
        return t4.toggleDropdown(e3);
      } }, import_react2.default.createElement("span", { className: "react-datepicker__year-read-view--down-arrow" }), import_react2.default.createElement("span", { className: "react-datepicker__year-read-view--selected-year" }, t4.props.year));
    }), ye(we(t4), "renderDropdown", function() {
      return import_react2.default.createElement(Ct, { key: "dropdown", year: t4.props.year, onChange: t4.onChange, onCancel: t4.toggleDropdown, minDate: t4.props.minDate, maxDate: t4.props.maxDate, scrollableYearDropdown: t4.props.scrollableYearDropdown, yearDropdownItemNumber: t4.props.yearDropdownItemNumber });
    }), ye(we(t4), "renderScrollMode", function() {
      var e3 = t4.state.dropdownVisible, r3 = [t4.renderReadView(!e3)];
      return e3 && r3.unshift(t4.renderDropdown()), r3;
    }), ye(we(t4), "onChange", function(e3) {
      t4.toggleDropdown(), e3 !== t4.props.year && t4.props.onChange(e3);
    }), ye(we(t4), "toggleDropdown", function(e3) {
      t4.setState({ dropdownVisible: !t4.state.dropdownVisible }, function() {
        t4.props.adjustDateOnChange && t4.handleYearChange(t4.props.date, e3);
      });
    }), ye(we(t4), "handleYearChange", function(e3, r3) {
      t4.onSelect(e3, r3), t4.setOpen();
    }), ye(we(t4), "onSelect", function(e3, r3) {
      t4.props.onSelect && t4.props.onSelect(e3, r3);
    }), ye(we(t4), "setOpen", function() {
      t4.props.setOpen && t4.props.setOpen(true);
    }), t4;
  }
  return fe(n, [{ key: "render", value: function() {
    var t4;
    switch (this.props.dropdownMode) {
      case "scroll":
        t4 = this.renderScrollMode();
        break;
      case "select":
        t4 = this.renderSelectMode();
    }
    return import_react2.default.createElement("div", { className: "react-datepicker__year-dropdown-container react-datepicker__year-dropdown-container--".concat(this.props.dropdownMode) }, t4);
  } }]), n;
}();
var Mt = react_onclickoutside_es_default(function(t3) {
  De(n, import_react2.default.Component);
  var r2 = be(n);
  function n() {
    var t4;
    he(this, n);
    for (var o = arguments.length, a3 = new Array(o), s3 = 0; s3 < o; s3++) a3[s3] = arguments[s3];
    return ye(we(t4 = r2.call.apply(r2, [this].concat(a3))), "isSelectedMonth", function(e3) {
      return t4.props.month === e3;
    }), ye(we(t4), "renderOptions", function() {
      return t4.props.monthNames.map(function(r3, n2) {
        return import_react2.default.createElement("div", { className: t4.isSelectedMonth(n2) ? "react-datepicker__month-option react-datepicker__month-option--selected_month" : "react-datepicker__month-option", key: r3, onClick: t4.onChange.bind(we(t4), n2), "aria-selected": t4.isSelectedMonth(n2) ? "true" : void 0 }, t4.isSelectedMonth(n2) ? import_react2.default.createElement("span", { className: "react-datepicker__month-option--selected" }, "✓") : "", r3);
      });
    }), ye(we(t4), "onChange", function(e3) {
      return t4.props.onChange(e3);
    }), ye(we(t4), "handleClickOutside", function() {
      return t4.props.onCancel();
    }), t4;
  }
  return fe(n, [{ key: "render", value: function() {
    return import_react2.default.createElement("div", { className: "react-datepicker__month-dropdown" }, this.renderOptions());
  } }]), n;
}());
var Pt = function(t3) {
  De(n, import_react2.default.Component);
  var r2 = be(n);
  function n() {
    var t4;
    he(this, n);
    for (var o = arguments.length, a3 = new Array(o), s3 = 0; s3 < o; s3++) a3[s3] = arguments[s3];
    return ye(we(t4 = r2.call.apply(r2, [this].concat(a3))), "state", { dropdownVisible: false }), ye(we(t4), "renderSelectOptions", function(t5) {
      return t5.map(function(t6, r3) {
        return import_react2.default.createElement("option", { key: r3, value: r3 }, t6);
      });
    }), ye(we(t4), "renderSelectMode", function(r3) {
      return import_react2.default.createElement("select", { value: t4.props.month, className: "react-datepicker__month-select", onChange: function(e3) {
        return t4.onChange(e3.target.value);
      } }, t4.renderSelectOptions(r3));
    }), ye(we(t4), "renderReadView", function(r3, n2) {
      return import_react2.default.createElement("div", { key: "read", style: { visibility: r3 ? "visible" : "hidden" }, className: "react-datepicker__month-read-view", onClick: t4.toggleDropdown }, import_react2.default.createElement("span", { className: "react-datepicker__month-read-view--down-arrow" }), import_react2.default.createElement("span", { className: "react-datepicker__month-read-view--selected-month" }, n2[t4.props.month]));
    }), ye(we(t4), "renderDropdown", function(r3) {
      return import_react2.default.createElement(Mt, { key: "dropdown", month: t4.props.month, monthNames: r3, onChange: t4.onChange, onCancel: t4.toggleDropdown });
    }), ye(we(t4), "renderScrollMode", function(e3) {
      var r3 = t4.state.dropdownVisible, n2 = [t4.renderReadView(!r3, e3)];
      return r3 && n2.unshift(t4.renderDropdown(e3)), n2;
    }), ye(we(t4), "onChange", function(e3) {
      t4.toggleDropdown(), e3 !== t4.props.month && t4.props.onChange(e3);
    }), ye(we(t4), "toggleDropdown", function() {
      return t4.setState({ dropdownVisible: !t4.state.dropdownVisible });
    }), t4;
  }
  return fe(n, [{ key: "render", value: function() {
    var t4, r3 = this, n2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(this.props.useShortMonthInDropdown ? function(e3) {
      return Xe(e3, r3.props.locale);
    } : function(e3) {
      return Je(e3, r3.props.locale);
    });
    switch (this.props.dropdownMode) {
      case "scroll":
        t4 = this.renderScrollMode(n2);
        break;
      case "select":
        t4 = this.renderSelectMode(n2);
    }
    return import_react2.default.createElement("div", { className: "react-datepicker__month-dropdown-container react-datepicker__month-dropdown-container--".concat(this.props.dropdownMode) }, t4);
  } }]), n;
}();
function Et(e3, t3) {
  for (var r2 = [], n = Fe(e3), o = Fe(t3); !isAfter(n, o); ) r2.push(Ye(n)), n = addMonths(n, 1);
  return r2;
}
var Nt = react_onclickoutside_es_default(function(t3) {
  De(o, import_react2.default.Component);
  var n = be(o);
  function o(t4) {
    var r2;
    return he(this, o), ye(we(r2 = n.call(this, t4)), "renderOptions", function() {
      return r2.state.monthYearsList.map(function(t5) {
        var n2 = getTime(t5), o2 = Be(r2.props.date, t5) && Qe(r2.props.date, t5);
        return import_react2.default.createElement("div", { className: o2 ? "react-datepicker__month-year-option--selected_month-year" : "react-datepicker__month-year-option", key: n2, onClick: r2.onChange.bind(we(r2), n2), "aria-selected": o2 ? "true" : void 0 }, o2 ? import_react2.default.createElement("span", { className: "react-datepicker__month-year-option--selected" }, "✓") : "", Ie(t5, r2.props.dateFormat, r2.props.locale));
      });
    }), ye(we(r2), "onChange", function(e3) {
      return r2.props.onChange(e3);
    }), ye(we(r2), "handleClickOutside", function() {
      r2.props.onCancel();
    }), r2.state = { monthYearsList: Et(r2.props.minDate, r2.props.maxDate) }, r2;
  }
  return fe(o, [{ key: "render", value: function() {
    var t4 = (0, import_classnames.default)({ "react-datepicker__month-year-dropdown": true, "react-datepicker__month-year-dropdown--scrollable": this.props.scrollableMonthYearDropdown });
    return import_react2.default.createElement("div", { className: t4 }, this.renderOptions());
  } }]), o;
}());
var xt = function(t3) {
  De(n, import_react2.default.Component);
  var r2 = be(n);
  function n() {
    var t4;
    he(this, n);
    for (var o = arguments.length, a3 = new Array(o), s3 = 0; s3 < o; s3++) a3[s3] = arguments[s3];
    return ye(we(t4 = r2.call.apply(r2, [this].concat(a3))), "state", { dropdownVisible: false }), ye(we(t4), "renderSelectOptions", function() {
      for (var r3 = Fe(t4.props.minDate), n2 = Fe(t4.props.maxDate), o2 = []; !isAfter(r3, n2); ) {
        var a4 = getTime(r3);
        o2.push(import_react2.default.createElement("option", { key: a4, value: a4 }, Ie(r3, t4.props.dateFormat, t4.props.locale))), r3 = addMonths(r3, 1);
      }
      return o2;
    }), ye(we(t4), "onSelectChange", function(e3) {
      t4.onChange(e3.target.value);
    }), ye(we(t4), "renderSelectMode", function() {
      return import_react2.default.createElement("select", { value: getTime(Fe(t4.props.date)), className: "react-datepicker__month-year-select", onChange: t4.onSelectChange }, t4.renderSelectOptions());
    }), ye(we(t4), "renderReadView", function(r3) {
      var n2 = Ie(t4.props.date, t4.props.dateFormat, t4.props.locale);
      return import_react2.default.createElement("div", { key: "read", style: { visibility: r3 ? "visible" : "hidden" }, className: "react-datepicker__month-year-read-view", onClick: function(e3) {
        return t4.toggleDropdown(e3);
      } }, import_react2.default.createElement("span", { className: "react-datepicker__month-year-read-view--down-arrow" }), import_react2.default.createElement("span", { className: "react-datepicker__month-year-read-view--selected-month-year" }, n2));
    }), ye(we(t4), "renderDropdown", function() {
      return import_react2.default.createElement(Nt, { key: "dropdown", date: t4.props.date, dateFormat: t4.props.dateFormat, onChange: t4.onChange, onCancel: t4.toggleDropdown, minDate: t4.props.minDate, maxDate: t4.props.maxDate, scrollableMonthYearDropdown: t4.props.scrollableMonthYearDropdown, locale: t4.props.locale });
    }), ye(we(t4), "renderScrollMode", function() {
      var e3 = t4.state.dropdownVisible, r3 = [t4.renderReadView(!e3)];
      return e3 && r3.unshift(t4.renderDropdown()), r3;
    }), ye(we(t4), "onChange", function(e3) {
      t4.toggleDropdown();
      var r3 = Ye(parseInt(e3));
      Be(t4.props.date, r3) && Qe(t4.props.date, r3) || t4.props.onChange(r3);
    }), ye(we(t4), "toggleDropdown", function() {
      return t4.setState({ dropdownVisible: !t4.state.dropdownVisible });
    }), t4;
  }
  return fe(n, [{ key: "render", value: function() {
    var t4;
    switch (this.props.dropdownMode) {
      case "scroll":
        t4 = this.renderScrollMode();
        break;
      case "select":
        t4 = this.renderSelectMode();
    }
    return import_react2.default.createElement("div", { className: "react-datepicker__month-year-dropdown-container react-datepicker__month-year-dropdown-container--".concat(this.props.dropdownMode) }, t4);
  } }]), n;
}();
var Yt = function(t3) {
  De(o, import_react2.default.Component);
  var n = be(o);
  function o() {
    var t4;
    he(this, o);
    for (var a3 = arguments.length, s3 = new Array(a3), i2 = 0; i2 < a3; i2++) s3[i2] = arguments[i2];
    return ye(we(t4 = n.call.apply(n, [this].concat(s3))), "dayEl", import_react2.default.createRef()), ye(we(t4), "handleClick", function(e3) {
      !t4.isDisabled() && t4.props.onClick && t4.props.onClick(e3);
    }), ye(we(t4), "handleMouseEnter", function(e3) {
      !t4.isDisabled() && t4.props.onMouseEnter && t4.props.onMouseEnter(e3);
    }), ye(we(t4), "handleOnKeyDown", function(e3) {
      " " === e3.key && (e3.preventDefault(), e3.key = "Enter"), t4.props.handleOnKeyDown(e3);
    }), ye(we(t4), "isSameDay", function(e3) {
      return je(t4.props.day, e3);
    }), ye(we(t4), "isKeyboardSelected", function() {
      return !t4.props.disabledKeyboardNavigation && !(t4.isSameDay(t4.props.selected) || t4.isSameWeek(t4.props.selected)) && (t4.isSameDay(t4.props.preSelection) || t4.isSameWeek(t4.props.preSelection));
    }), ye(we(t4), "isDisabled", function() {
      return Ze(t4.props.day, t4.props);
    }), ye(we(t4), "isExcluded", function() {
      return et(t4.props.day, t4.props);
    }), ye(we(t4), "isStartOfWeek", function() {
      return je(t4.props.day, Le(t4.props.day, t4.props.locale, t4.props.calendarStartDay));
    }), ye(we(t4), "isSameWeek", function(e3) {
      return t4.props.showWeekPicker && je(e3, Le(t4.props.day, t4.props.locale, t4.props.calendarStartDay));
    }), ye(we(t4), "getHighLightedClass", function() {
      var e3 = t4.props, r2 = e3.day, n2 = e3.highlightDates;
      if (!n2) return false;
      var o2 = Ie(r2, "MM.dd.yyyy");
      return n2.get(o2);
    }), ye(we(t4), "getHolidaysClass", function() {
      var e3 = t4.props, r2 = e3.day, n2 = e3.holidays;
      if (!n2) return false;
      var o2 = Ie(r2, "MM.dd.yyyy");
      return n2.has(o2) ? [n2.get(o2).className] : void 0;
    }), ye(we(t4), "isInRange", function() {
      var e3 = t4.props, r2 = e3.day, n2 = e3.startDate, o2 = e3.endDate;
      return !(!n2 || !o2) && qe(r2, n2, o2);
    }), ye(we(t4), "isInSelectingRange", function() {
      var e3, r2 = t4.props, n2 = r2.day, o2 = r2.selectsStart, a4 = r2.selectsEnd, s4 = r2.selectsRange, i3 = r2.selectsDisabledDaysInRange, p = r2.startDate, c2 = r2.endDate, l = null !== (e3 = t4.props.selectingDate) && void 0 !== e3 ? e3 : t4.props.preSelection;
      return !(!(o2 || a4 || s4) || !l || !i3 && t4.isDisabled()) && (o2 && c2 && (isBefore(l, c2) || Ve(l, c2)) ? qe(n2, l, c2) : (a4 && p && (isAfter(l, p) || Ve(l, p)) || !(!s4 || !p || c2 || !isAfter(l, p) && !Ve(l, p))) && qe(n2, p, l));
    }), ye(we(t4), "isSelectingRangeStart", function() {
      var e3;
      if (!t4.isInSelectingRange()) return false;
      var r2 = t4.props, n2 = r2.day, o2 = r2.startDate, a4 = r2.selectsStart, s4 = null !== (e3 = t4.props.selectingDate) && void 0 !== e3 ? e3 : t4.props.preSelection;
      return je(n2, a4 ? s4 : o2);
    }), ye(we(t4), "isSelectingRangeEnd", function() {
      var e3;
      if (!t4.isInSelectingRange()) return false;
      var r2 = t4.props, n2 = r2.day, o2 = r2.endDate, a4 = r2.selectsEnd, s4 = r2.selectsRange, i3 = null !== (e3 = t4.props.selectingDate) && void 0 !== e3 ? e3 : t4.props.preSelection;
      return je(n2, a4 || s4 ? i3 : o2);
    }), ye(we(t4), "isRangeStart", function() {
      var e3 = t4.props, r2 = e3.day, n2 = e3.startDate, o2 = e3.endDate;
      return !(!n2 || !o2) && je(n2, r2);
    }), ye(we(t4), "isRangeEnd", function() {
      var e3 = t4.props, r2 = e3.day, n2 = e3.startDate, o2 = e3.endDate;
      return !(!n2 || !o2) && je(o2, r2);
    }), ye(we(t4), "isWeekend", function() {
      var e3 = getDay(t4.props.day);
      return 0 === e3 || 6 === e3;
    }), ye(we(t4), "isAfterMonth", function() {
      return void 0 !== t4.props.month && (t4.props.month + 1) % 12 === getMonth(t4.props.day);
    }), ye(we(t4), "isBeforeMonth", function() {
      return void 0 !== t4.props.month && (getMonth(t4.props.day) + 1) % 12 === t4.props.month;
    }), ye(we(t4), "isCurrentDay", function() {
      return t4.isSameDay(Ye());
    }), ye(we(t4), "isSelected", function() {
      return t4.isSameDay(t4.props.selected) || t4.isSameWeek(t4.props.selected);
    }), ye(we(t4), "getClassNames", function(e3) {
      var n2, o2 = t4.props.dayClassName ? t4.props.dayClassName(e3) : void 0;
      return (0, import_classnames.default)("react-datepicker__day", o2, "react-datepicker__day--" + Ie(t4.props.day, "ddd", n2), { "react-datepicker__day--disabled": t4.isDisabled(), "react-datepicker__day--excluded": t4.isExcluded(), "react-datepicker__day--selected": t4.isSelected(), "react-datepicker__day--keyboard-selected": t4.isKeyboardSelected(), "react-datepicker__day--range-start": t4.isRangeStart(), "react-datepicker__day--range-end": t4.isRangeEnd(), "react-datepicker__day--in-range": t4.isInRange(), "react-datepicker__day--in-selecting-range": t4.isInSelectingRange(), "react-datepicker__day--selecting-range-start": t4.isSelectingRangeStart(), "react-datepicker__day--selecting-range-end": t4.isSelectingRangeEnd(), "react-datepicker__day--today": t4.isCurrentDay(), "react-datepicker__day--weekend": t4.isWeekend(), "react-datepicker__day--outside-month": t4.isAfterMonth() || t4.isBeforeMonth() }, t4.getHighLightedClass("react-datepicker__day--highlighted"), t4.getHolidaysClass());
    }), ye(we(t4), "getAriaLabel", function() {
      var e3 = t4.props, r2 = e3.day, n2 = e3.ariaLabelPrefixWhenEnabled, o2 = void 0 === n2 ? "Choose" : n2, a4 = e3.ariaLabelPrefixWhenDisabled, s4 = void 0 === a4 ? "Not available" : a4, i3 = t4.isDisabled() || t4.isExcluded() ? s4 : o2;
      return "".concat(i3, " ").concat(Ie(r2, "PPPP", t4.props.locale));
    }), ye(we(t4), "getTitle", function() {
      var e3 = t4.props, r2 = e3.day, n2 = e3.holidays, o2 = void 0 === n2 ? /* @__PURE__ */ new Map() : n2, a4 = Ie(r2, "MM.dd.yyyy");
      return o2.has(a4) && o2.get(a4).holidayNames.length > 0 ? o2.get(a4).holidayNames.join(", ") : "";
    }), ye(we(t4), "getTabIndex", function(e3, r2) {
      var n2 = e3 || t4.props.selected, o2 = r2 || t4.props.preSelection;
      return (!t4.props.showWeekPicker || !t4.props.showWeekNumber && t4.isStartOfWeek()) && (t4.isKeyboardSelected() || t4.isSameDay(n2) && je(o2, n2)) ? 0 : -1;
    }), ye(we(t4), "handleFocusDay", function() {
      var e3, r2 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, n2 = false;
      0 === t4.getTabIndex() && !r2.isInputFocused && t4.isSameDay(t4.props.preSelection) && (document.activeElement && document.activeElement !== document.body || (n2 = true), t4.props.inline && !t4.props.shouldFocusDayInline && (n2 = false), t4.props.containerRef && t4.props.containerRef.current && t4.props.containerRef.current.contains(document.activeElement) && document.activeElement.classList.contains("react-datepicker__day") && (n2 = true), t4.props.monthShowsDuplicateDaysEnd && t4.isAfterMonth() && (n2 = false), t4.props.monthShowsDuplicateDaysStart && t4.isBeforeMonth() && (n2 = false)), n2 && (null === (e3 = t4.dayEl.current) || void 0 === e3 || e3.focus({ preventScroll: true }));
    }), ye(we(t4), "renderDayContents", function() {
      return t4.props.monthShowsDuplicateDaysEnd && t4.isAfterMonth() || t4.props.monthShowsDuplicateDaysStart && t4.isBeforeMonth() ? null : t4.props.renderDayContents ? t4.props.renderDayContents(getDate(t4.props.day), t4.props.day) : getDate(t4.props.day);
    }), ye(we(t4), "render", function() {
      return import_react2.default.createElement("div", { ref: t4.dayEl, className: t4.getClassNames(t4.props.day), onKeyDown: t4.handleOnKeyDown, onClick: t4.handleClick, onMouseEnter: t4.handleMouseEnter, tabIndex: t4.getTabIndex(), "aria-label": t4.getAriaLabel(), role: "option", title: t4.getTitle(), "aria-disabled": t4.isDisabled(), "aria-current": t4.isCurrentDay() ? "date" : void 0, "aria-selected": t4.isSelected() || t4.isInRange() }, t4.renderDayContents(), "" !== t4.getTitle() && import_react2.default.createElement("span", { className: "holiday-overlay" }, t4.getTitle()));
    }), t4;
  }
  return fe(o, [{ key: "componentDidMount", value: function() {
    this.handleFocusDay();
  } }, { key: "componentDidUpdate", value: function(e3) {
    this.handleFocusDay(e3);
  } }]), o;
}();
var Tt = function(t3) {
  De(o, import_react2.default.Component);
  var n = be(o);
  function o() {
    var t4;
    he(this, o);
    for (var r2 = arguments.length, a3 = new Array(r2), s3 = 0; s3 < r2; s3++) a3[s3] = arguments[s3];
    return ye(we(t4 = n.call.apply(n, [this].concat(a3))), "weekNumberEl", import_react2.default.createRef()), ye(we(t4), "handleClick", function(e3) {
      t4.props.onClick && t4.props.onClick(e3);
    }), ye(we(t4), "handleOnKeyDown", function(e3) {
      " " === e3.key && (e3.preventDefault(), e3.key = "Enter"), t4.props.handleOnKeyDown(e3);
    }), ye(we(t4), "isKeyboardSelected", function() {
      return !t4.props.disabledKeyboardNavigation && !je(t4.props.date, t4.props.selected) && je(t4.props.date, t4.props.preSelection);
    }), ye(we(t4), "getTabIndex", function() {
      return t4.props.showWeekPicker && t4.props.showWeekNumber && (t4.isKeyboardSelected() || je(t4.props.date, t4.props.selected) && je(t4.props.preSelection, t4.props.selected)) ? 0 : -1;
    }), ye(we(t4), "handleFocusWeekNumber", function() {
      var e3 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r3 = false;
      0 === t4.getTabIndex() && !e3.isInputFocused && je(t4.props.date, t4.props.preSelection) && (document.activeElement && document.activeElement !== document.body || (r3 = true), t4.props.inline && !t4.props.shouldFocusDayInline && (r3 = false), t4.props.containerRef && t4.props.containerRef.current && t4.props.containerRef.current.contains(document.activeElement) && document.activeElement && document.activeElement.classList.contains("react-datepicker__week-number") && (r3 = true)), r3 && t4.weekNumberEl.current && t4.weekNumberEl.current.focus({ preventScroll: true });
    }), t4;
  }
  return fe(o, [{ key: "componentDidMount", value: function() {
    this.handleFocusWeekNumber();
  } }, { key: "componentDidUpdate", value: function(e3) {
    this.handleFocusWeekNumber(e3);
  } }, { key: "render", value: function() {
    var t4 = this.props, n2 = t4.weekNumber, o2 = t4.ariaLabelPrefix, a3 = void 0 === o2 ? "week " : o2, s3 = { "react-datepicker__week-number": true, "react-datepicker__week-number--clickable": !!t4.onClick, "react-datepicker__week-number--selected": je(this.props.date, this.props.selected), "react-datepicker__week-number--keyboard-selected": this.isKeyboardSelected() };
    return import_react2.default.createElement("div", { ref: this.weekNumberEl, className: (0, import_classnames.default)(s3), "aria-label": "".concat(a3, " ").concat(this.props.weekNumber), onClick: this.handleClick, onKeyDown: this.handleOnKeyDown, tabIndex: this.getTabIndex() }, n2);
  } }], [{ key: "defaultProps", get: function() {
    return { ariaLabelPrefix: "week " };
  } }]), o;
}();
var It = function(t3) {
  De(o, import_react2.default.Component);
  var n = be(o);
  function o() {
    var t4;
    he(this, o);
    for (var r2 = arguments.length, a3 = new Array(r2), s3 = 0; s3 < r2; s3++) a3[s3] = arguments[s3];
    return ye(we(t4 = n.call.apply(n, [this].concat(a3))), "handleDayClick", function(e3, r3) {
      t4.props.onDayClick && t4.props.onDayClick(e3, r3);
    }), ye(we(t4), "handleDayMouseEnter", function(e3) {
      t4.props.onDayMouseEnter && t4.props.onDayMouseEnter(e3);
    }), ye(we(t4), "handleWeekClick", function(e3, r3, n2) {
      if ("function" == typeof t4.props.onWeekSelect && t4.props.onWeekSelect(e3, r3, n2), t4.props.showWeekPicker) {
        var o2 = Le(e3, t4.props.locale, t4.props.calendarStartDay);
        t4.handleDayClick(o2, n2);
      }
      t4.props.shouldCloseOnSelect && t4.props.setOpen(false);
    }), ye(we(t4), "formatWeekNumber", function(e3) {
      return t4.props.formatWeekNumber ? t4.props.formatWeekNumber(e3) : function(e4, t5) {
        var r3 = t5 && Ge(t5) || $e() && Ge($e());
        return getISOWeek(e4, r3 ? { locale: r3 } : null);
      }(e3);
    }), ye(we(t4), "renderDays", function() {
      var r3 = Le(t4.props.day, t4.props.locale, t4.props.calendarStartDay), n2 = [], o2 = t4.formatWeekNumber(r3);
      if (t4.props.showWeekNumber) {
        var a4 = t4.props.onWeekSelect || t4.props.showWeekPicker ? t4.handleWeekClick.bind(we(t4), r3, o2) : void 0;
        n2.push(import_react2.default.createElement(Tt, { key: "W", weekNumber: o2, date: r3, onClick: a4, selected: t4.props.selected, preSelection: t4.props.preSelection, ariaLabelPrefix: t4.props.ariaLabelPrefix, showWeekPicker: t4.props.showWeekPicker, showWeekNumber: t4.props.showWeekNumber, disabledKeyboardNavigation: t4.props.disabledKeyboardNavigation, handleOnKeyDown: t4.props.handleOnKeyDown, isInputFocused: t4.props.isInputFocused, containerRef: t4.props.containerRef }));
      }
      return n2.concat([0, 1, 2, 3, 4, 5, 6].map(function(n3) {
        var o3 = addDays(r3, n3);
        return import_react2.default.createElement(Yt, { ariaLabelPrefixWhenEnabled: t4.props.chooseDayAriaLabelPrefix, ariaLabelPrefixWhenDisabled: t4.props.disabledDayAriaLabelPrefix, key: o3.valueOf(), day: o3, month: t4.props.month, onClick: t4.handleDayClick.bind(we(t4), o3), onMouseEnter: t4.handleDayMouseEnter.bind(we(t4), o3), minDate: t4.props.minDate, maxDate: t4.props.maxDate, excludeDates: t4.props.excludeDates, excludeDateIntervals: t4.props.excludeDateIntervals, includeDates: t4.props.includeDates, includeDateIntervals: t4.props.includeDateIntervals, highlightDates: t4.props.highlightDates, holidays: t4.props.holidays, selectingDate: t4.props.selectingDate, filterDate: t4.props.filterDate, preSelection: t4.props.preSelection, selected: t4.props.selected, selectsStart: t4.props.selectsStart, selectsEnd: t4.props.selectsEnd, selectsRange: t4.props.selectsRange, showWeekPicker: t4.props.showWeekPicker, showWeekNumber: t4.props.showWeekNumber, selectsDisabledDaysInRange: t4.props.selectsDisabledDaysInRange, startDate: t4.props.startDate, endDate: t4.props.endDate, dayClassName: t4.props.dayClassName, renderDayContents: t4.props.renderDayContents, disabledKeyboardNavigation: t4.props.disabledKeyboardNavigation, handleOnKeyDown: t4.props.handleOnKeyDown, isInputFocused: t4.props.isInputFocused, containerRef: t4.props.containerRef, inline: t4.props.inline, shouldFocusDayInline: t4.props.shouldFocusDayInline, monthShowsDuplicateDaysEnd: t4.props.monthShowsDuplicateDaysEnd, monthShowsDuplicateDaysStart: t4.props.monthShowsDuplicateDaysStart, locale: t4.props.locale });
      }));
    }), ye(we(t4), "startOfWeek", function() {
      return Le(t4.props.day, t4.props.locale, t4.props.calendarStartDay);
    }), ye(we(t4), "isKeyboardSelected", function() {
      return !t4.props.disabledKeyboardNavigation && !je(t4.startOfWeek(), t4.props.selected) && je(t4.startOfWeek(), t4.props.preSelection);
    }), t4;
  }
  return fe(o, [{ key: "render", value: function() {
    var t4 = { "react-datepicker__week": true, "react-datepicker__week--selected": je(this.startOfWeek(), this.props.selected), "react-datepicker__week--keyboard-selected": this.isKeyboardSelected() };
    return import_react2.default.createElement("div", { className: (0, import_classnames.default)(t4) }, this.renderDays());
  } }], [{ key: "defaultProps", get: function() {
    return { shouldCloseOnSelect: true };
  } }]), o;
}();
var Ot = "two_columns";
var Rt = "three_columns";
var Lt = "four_columns";
var Ft = ye(ye(ye({}, Ot, { grid: [[0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11]], verticalNavigationOffset: 2 }), Rt, { grid: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9, 10, 11]], verticalNavigationOffset: 3 }), Lt, { grid: [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]], verticalNavigationOffset: 4 });
function At(e3, t3) {
  return e3 ? Lt : t3 ? Ot : Rt;
}
var Wt = function(t3) {
  De(o, import_react2.default.Component);
  var n = be(o);
  function o() {
    var t4;
    he(this, o);
    for (var a3 = arguments.length, s3 = new Array(a3), i2 = 0; i2 < a3; i2++) s3[i2] = arguments[i2];
    return ye(we(t4 = n.call.apply(n, [this].concat(s3))), "MONTH_REFS", Se(Array(12)).map(function() {
      return import_react2.default.createRef();
    })), ye(we(t4), "QUARTER_REFS", Se(Array(4)).map(function() {
      return import_react2.default.createRef();
    })), ye(we(t4), "isDisabled", function(e3) {
      return Ze(e3, t4.props);
    }), ye(we(t4), "isExcluded", function(e3) {
      return et(e3, t4.props);
    }), ye(we(t4), "handleDayClick", function(e3, r2) {
      t4.props.onDayClick && t4.props.onDayClick(e3, r2, t4.props.orderInDisplay);
    }), ye(we(t4), "handleDayMouseEnter", function(e3) {
      t4.props.onDayMouseEnter && t4.props.onDayMouseEnter(e3);
    }), ye(we(t4), "handleMouseLeave", function() {
      t4.props.onMouseLeave && t4.props.onMouseLeave();
    }), ye(we(t4), "isRangeStartMonth", function(e3) {
      var r2 = t4.props, n2 = r2.day, o2 = r2.startDate, a4 = r2.endDate;
      return !(!o2 || !a4) && Qe(setMonth(n2, e3), o2);
    }), ye(we(t4), "isRangeStartQuarter", function(e3) {
      var r2 = t4.props, n2 = r2.day, o2 = r2.startDate, a4 = r2.endDate;
      return !(!o2 || !a4) && He(setQuarter(n2, e3), o2);
    }), ye(we(t4), "isRangeEndMonth", function(e3) {
      var r2 = t4.props, n2 = r2.day, o2 = r2.startDate, a4 = r2.endDate;
      return !(!o2 || !a4) && Qe(setMonth(n2, e3), a4);
    }), ye(we(t4), "isRangeEndQuarter", function(e3) {
      var r2 = t4.props, n2 = r2.day, o2 = r2.startDate, a4 = r2.endDate;
      return !(!o2 || !a4) && He(setQuarter(n2, e3), a4);
    }), ye(we(t4), "isInSelectingRangeMonth", function(e3) {
      var r2, n2 = t4.props, o2 = n2.day, a4 = n2.selectsStart, s4 = n2.selectsEnd, i3 = n2.selectsRange, p = n2.startDate, c2 = n2.endDate, l = null !== (r2 = t4.props.selectingDate) && void 0 !== r2 ? r2 : t4.props.preSelection;
      return !(!(a4 || s4 || i3) || !l) && (a4 && c2 ? rt(l, c2, e3, o2) : (s4 && p || !(!i3 || !p || c2)) && rt(p, l, e3, o2));
    }), ye(we(t4), "isSelectingMonthRangeStart", function(e3) {
      var r2;
      if (!t4.isInSelectingRangeMonth(e3)) return false;
      var n2 = t4.props, o2 = n2.day, a4 = n2.startDate, s4 = n2.selectsStart, i3 = setMonth(o2, e3), p = null !== (r2 = t4.props.selectingDate) && void 0 !== r2 ? r2 : t4.props.preSelection;
      return Qe(i3, s4 ? p : a4);
    }), ye(we(t4), "isSelectingMonthRangeEnd", function(e3) {
      var r2;
      if (!t4.isInSelectingRangeMonth(e3)) return false;
      var n2 = t4.props, o2 = n2.day, a4 = n2.endDate, s4 = n2.selectsEnd, i3 = n2.selectsRange, p = setMonth(o2, e3), c2 = null !== (r2 = t4.props.selectingDate) && void 0 !== r2 ? r2 : t4.props.preSelection;
      return Qe(p, s4 || i3 ? c2 : a4);
    }), ye(we(t4), "isInSelectingRangeQuarter", function(e3) {
      var r2, n2 = t4.props, o2 = n2.day, a4 = n2.selectsStart, s4 = n2.selectsEnd, i3 = n2.selectsRange, p = n2.startDate, c2 = n2.endDate, l = null !== (r2 = t4.props.selectingDate) && void 0 !== r2 ? r2 : t4.props.preSelection;
      return !(!(a4 || s4 || i3) || !l) && (a4 && c2 ? st(l, c2, e3, o2) : (s4 && p || !(!i3 || !p || c2)) && st(p, l, e3, o2));
    }), ye(we(t4), "isWeekInMonth", function(e3) {
      var r2 = t4.props.day, n2 = addDays(e3, 6);
      return Qe(e3, r2) || Qe(n2, r2);
    }), ye(we(t4), "isCurrentMonth", function(e3, t5) {
      return getYear(e3) === getYear(Ye()) && t5 === getMonth(Ye());
    }), ye(we(t4), "isCurrentQuarter", function(e3, t5) {
      return getYear(e3) === getYear(Ye()) && t5 === getQuarter(Ye());
    }), ye(we(t4), "isSelectedMonth", function(e3, t5, r2) {
      return getMonth(r2) === t5 && getYear(e3) === getYear(r2);
    }), ye(we(t4), "isSelectedQuarter", function(e3, t5, r2) {
      return getQuarter(e3) === t5 && getYear(e3) === getYear(r2);
    }), ye(we(t4), "renderWeeks", function() {
      for (var r2 = [], n2 = t4.props.fixedHeight, o2 = 0, a4 = false, s4 = Le(Fe(t4.props.day), t4.props.locale, t4.props.calendarStartDay); r2.push(import_react2.default.createElement(It, { ariaLabelPrefix: t4.props.weekAriaLabelPrefix, chooseDayAriaLabelPrefix: t4.props.chooseDayAriaLabelPrefix, disabledDayAriaLabelPrefix: t4.props.disabledDayAriaLabelPrefix, key: o2, day: s4, month: getMonth(t4.props.day), onDayClick: t4.handleDayClick, onDayMouseEnter: t4.handleDayMouseEnter, onWeekSelect: t4.props.onWeekSelect, formatWeekNumber: t4.props.formatWeekNumber, locale: t4.props.locale, minDate: t4.props.minDate, maxDate: t4.props.maxDate, excludeDates: t4.props.excludeDates, excludeDateIntervals: t4.props.excludeDateIntervals, includeDates: t4.props.includeDates, includeDateIntervals: t4.props.includeDateIntervals, inline: t4.props.inline, shouldFocusDayInline: t4.props.shouldFocusDayInline, highlightDates: t4.props.highlightDates, holidays: t4.props.holidays, selectingDate: t4.props.selectingDate, filterDate: t4.props.filterDate, preSelection: t4.props.preSelection, selected: t4.props.selected, selectsStart: t4.props.selectsStart, selectsEnd: t4.props.selectsEnd, selectsRange: t4.props.selectsRange, selectsDisabledDaysInRange: t4.props.selectsDisabledDaysInRange, showWeekNumber: t4.props.showWeekNumbers, showWeekPicker: t4.props.showWeekPicker, startDate: t4.props.startDate, endDate: t4.props.endDate, dayClassName: t4.props.dayClassName, setOpen: t4.props.setOpen, shouldCloseOnSelect: t4.props.shouldCloseOnSelect, disabledKeyboardNavigation: t4.props.disabledKeyboardNavigation, renderDayContents: t4.props.renderDayContents, handleOnKeyDown: t4.props.handleOnKeyDown, isInputFocused: t4.props.isInputFocused, containerRef: t4.props.containerRef, calendarStartDay: t4.props.calendarStartDay, monthShowsDuplicateDaysEnd: t4.props.monthShowsDuplicateDaysEnd, monthShowsDuplicateDaysStart: t4.props.monthShowsDuplicateDaysStart })), !a4; ) {
        o2++, s4 = addWeeks(s4, 1);
        var i3 = n2 && o2 >= 6, p = !n2 && !t4.isWeekInMonth(s4);
        if (i3 || p) {
          if (!t4.props.peekNextMonth) break;
          a4 = true;
        }
      }
      return r2;
    }), ye(we(t4), "onMonthClick", function(e3, r2) {
      t4.handleDayClick(Fe(setMonth(t4.props.day, r2)), e3);
    }), ye(we(t4), "onMonthMouseEnter", function(e3) {
      t4.handleDayMouseEnter(Fe(setMonth(t4.props.day, e3)));
    }), ye(we(t4), "handleMonthNavigation", function(e3, r2) {
      t4.isDisabled(r2) || t4.isExcluded(r2) || (t4.props.setPreSelection(r2), t4.MONTH_REFS[e3].current && t4.MONTH_REFS[e3].current.focus());
    }), ye(we(t4), "onMonthKeyDown", function(e3, r2) {
      var n2 = t4.props, o2 = n2.selected, a4 = n2.preSelection, s4 = n2.disabledKeyboardNavigation, i3 = n2.showTwoColumnMonthYearPicker, p = n2.showFourColumnMonthYearPicker, c2 = n2.setPreSelection, d3 = e3.key;
      if ("Tab" !== d3 && e3.preventDefault(), !s4) {
        var u2 = At(p, i3), h3 = Ft[u2].verticalNavigationOffset, m3 = Ft[u2].grid;
        switch (d3) {
          case "Enter":
            t4.onMonthClick(e3, r2), c2(o2);
            break;
          case "ArrowRight":
            t4.handleMonthNavigation(11 === r2 ? 0 : r2 + 1, addMonths(a4, 1));
            break;
          case "ArrowLeft":
            t4.handleMonthNavigation(0 === r2 ? 11 : r2 - 1, subMonths(a4, 1));
            break;
          case "ArrowUp":
            t4.handleMonthNavigation(m3[0].includes(r2) ? r2 + 12 - h3 : r2 - h3, subMonths(a4, h3));
            break;
          case "ArrowDown":
            t4.handleMonthNavigation(m3[m3.length - 1].includes(r2) ? r2 - 12 + h3 : r2 + h3, addMonths(a4, h3));
        }
      }
    }), ye(we(t4), "onQuarterClick", function(e3, r2) {
      t4.handleDayClick(We(setQuarter(t4.props.day, r2)), e3);
    }), ye(we(t4), "onQuarterMouseEnter", function(e3) {
      t4.handleDayMouseEnter(We(setQuarter(t4.props.day, e3)));
    }), ye(we(t4), "handleQuarterNavigation", function(e3, r2) {
      t4.isDisabled(r2) || t4.isExcluded(r2) || (t4.props.setPreSelection(r2), t4.QUARTER_REFS[e3 - 1].current && t4.QUARTER_REFS[e3 - 1].current.focus());
    }), ye(we(t4), "onQuarterKeyDown", function(e3, r2) {
      var n2 = e3.key;
      if (!t4.props.disabledKeyboardNavigation) switch (n2) {
        case "Enter":
          t4.onQuarterClick(e3, r2), t4.props.setPreSelection(t4.props.selected);
          break;
        case "ArrowRight":
          t4.handleQuarterNavigation(4 === r2 ? 1 : r2 + 1, addQuarters(t4.props.preSelection, 1));
          break;
        case "ArrowLeft":
          t4.handleQuarterNavigation(1 === r2 ? 4 : r2 - 1, subQuarters(t4.props.preSelection, 1));
      }
    }), ye(we(t4), "getMonthClassNames", function(e3) {
      var n2 = t4.props, o2 = n2.day, a4 = n2.startDate, s4 = n2.endDate, i3 = n2.selected, p = n2.minDate, c2 = n2.maxDate, l = n2.preSelection, d3 = n2.monthClassName, u2 = n2.excludeDates, h3 = n2.includeDates, m3 = d3 ? d3(setMonth(o2, e3)) : void 0, f = setMonth(o2, e3);
      return (0, import_classnames.default)("react-datepicker__month-text", "react-datepicker__month-".concat(e3), m3, { "react-datepicker__month-text--disabled": (p || c2 || u2 || h3) && tt(f, t4.props), "react-datepicker__month-text--selected": t4.isSelectedMonth(o2, e3, i3), "react-datepicker__month-text--keyboard-selected": !t4.props.disabledKeyboardNavigation && getMonth(l) === e3, "react-datepicker__month-text--in-selecting-range": t4.isInSelectingRangeMonth(e3), "react-datepicker__month-text--in-range": rt(a4, s4, e3, o2), "react-datepicker__month-text--range-start": t4.isRangeStartMonth(e3), "react-datepicker__month-text--range-end": t4.isRangeEndMonth(e3), "react-datepicker__month-text--selecting-range-start": t4.isSelectingMonthRangeStart(e3), "react-datepicker__month-text--selecting-range-end": t4.isSelectingMonthRangeEnd(e3), "react-datepicker__month-text--today": t4.isCurrentMonth(o2, e3) });
    }), ye(we(t4), "getTabIndex", function(e3) {
      var r2 = getMonth(t4.props.preSelection);
      return t4.props.disabledKeyboardNavigation || e3 !== r2 ? "-1" : "0";
    }), ye(we(t4), "getQuarterTabIndex", function(e3) {
      var r2 = getQuarter(t4.props.preSelection);
      return t4.props.disabledKeyboardNavigation || e3 !== r2 ? "-1" : "0";
    }), ye(we(t4), "getAriaLabel", function(e3) {
      var r2 = t4.props, n2 = r2.chooseDayAriaLabelPrefix, o2 = void 0 === n2 ? "Choose" : n2, a4 = r2.disabledDayAriaLabelPrefix, s4 = void 0 === a4 ? "Not available" : a4, i3 = r2.day, p = setMonth(i3, e3), c2 = t4.isDisabled(p) || t4.isExcluded(p) ? s4 : o2;
      return "".concat(c2, " ").concat(Ie(p, "MMMM yyyy"));
    }), ye(we(t4), "getQuarterClassNames", function(e3) {
      var n2 = t4.props, o2 = n2.day, a4 = n2.startDate, s4 = n2.endDate, i3 = n2.selected, p = n2.minDate, c2 = n2.maxDate, l = n2.preSelection, d3 = n2.disabledKeyboardNavigation;
      return (0, import_classnames.default)("react-datepicker__quarter-text", "react-datepicker__quarter-".concat(e3), { "react-datepicker__quarter-text--disabled": (p || c2) && nt(setQuarter(o2, e3), t4.props), "react-datepicker__quarter-text--selected": t4.isSelectedQuarter(o2, e3, i3), "react-datepicker__quarter-text--keyboard-selected": !d3 && getQuarter(l) === e3, "react-datepicker__quarter-text--in-selecting-range": t4.isInSelectingRangeQuarter(e3), "react-datepicker__quarter-text--in-range": st(a4, s4, e3, o2), "react-datepicker__quarter-text--range-start": t4.isRangeStartQuarter(e3), "react-datepicker__quarter-text--range-end": t4.isRangeEndQuarter(e3) });
    }), ye(we(t4), "getMonthContent", function(e3) {
      var r2 = t4.props, n2 = r2.showFullMonthYearPicker, o2 = r2.renderMonthContent, a4 = r2.locale, s4 = r2.day, i3 = Xe(e3, a4), p = Je(e3, a4);
      return o2 ? o2(e3, i3, p, s4) : n2 ? p : i3;
    }), ye(we(t4), "getQuarterContent", function(e3) {
      var r2 = t4.props, n2 = r2.renderQuarterContent, o2 = function(e4, t5) {
        return Ie(setQuarter(Ye(), e4), "QQQ", t5);
      }(e3, r2.locale);
      return n2 ? n2(e3, o2) : o2;
    }), ye(we(t4), "renderMonths", function() {
      var r2 = t4.props, n2 = r2.showTwoColumnMonthYearPicker, o2 = r2.showFourColumnMonthYearPicker, a4 = r2.day, s4 = r2.selected;
      return Ft[At(o2, n2)].grid.map(function(r3, n3) {
        return import_react2.default.createElement("div", { className: "react-datepicker__month-wrapper", key: n3 }, r3.map(function(r4, n4) {
          return import_react2.default.createElement("div", { ref: t4.MONTH_REFS[r4], key: n4, onClick: function(e3) {
            t4.onMonthClick(e3, r4);
          }, onKeyDown: function(e3) {
            t4.onMonthKeyDown(e3, r4);
          }, onMouseEnter: function() {
            return t4.onMonthMouseEnter(r4);
          }, tabIndex: t4.getTabIndex(r4), className: t4.getMonthClassNames(r4), role: "option", "aria-label": t4.getAriaLabel(r4), "aria-current": t4.isCurrentMonth(a4, r4) ? "date" : void 0, "aria-selected": t4.isSelectedMonth(a4, r4, s4) }, t4.getMonthContent(r4));
        }));
      });
    }), ye(we(t4), "renderQuarters", function() {
      var r2 = t4.props, n2 = r2.day, o2 = r2.selected;
      return import_react2.default.createElement("div", { className: "react-datepicker__quarter-wrapper" }, [1, 2, 3, 4].map(function(r3, a4) {
        return import_react2.default.createElement("div", { key: a4, ref: t4.QUARTER_REFS[a4], role: "option", onClick: function(e3) {
          t4.onQuarterClick(e3, r3);
        }, onKeyDown: function(e3) {
          t4.onQuarterKeyDown(e3, r3);
        }, onMouseEnter: function() {
          return t4.onQuarterMouseEnter(r3);
        }, className: t4.getQuarterClassNames(r3), "aria-selected": t4.isSelectedQuarter(n2, r3, o2), tabIndex: t4.getQuarterTabIndex(r3), "aria-current": t4.isCurrentQuarter(n2, r3) ? "date" : void 0 }, t4.getQuarterContent(r3));
      }));
    }), ye(we(t4), "getClassNames", function() {
      var e3 = t4.props, n2 = e3.selectingDate, o2 = e3.selectsStart, a4 = e3.selectsEnd, s4 = e3.showMonthYearPicker, i3 = e3.showQuarterYearPicker, p = e3.showWeekPicker;
      return (0, import_classnames.default)("react-datepicker__month", { "react-datepicker__month--selecting-range": n2 && (o2 || a4) }, { "react-datepicker__monthPicker": s4 }, { "react-datepicker__quarterPicker": i3 }, { "react-datepicker__weekPicker": p });
    }), t4;
  }
  return fe(o, [{ key: "render", value: function() {
    var t4 = this.props, r2 = t4.showMonthYearPicker, n2 = t4.showQuarterYearPicker, o2 = t4.day, a3 = t4.ariaLabelPrefix, s3 = void 0 === a3 ? "month " : a3;
    return import_react2.default.createElement("div", { className: this.getClassNames(), onMouseLeave: this.handleMouseLeave, "aria-label": "".concat(s3, " ").concat(Ie(o2, "yyyy-MM")), role: "listbox" }, r2 ? this.renderMonths() : n2 ? this.renderQuarters() : this.renderWeeks());
  } }]), o;
}();
var Kt = function(t3) {
  De(n, import_react2.default.Component);
  var r2 = be(n);
  function n() {
    var t4;
    he(this, n);
    for (var o = arguments.length, a3 = new Array(o), i2 = 0; i2 < o; i2++) a3[i2] = arguments[i2];
    return ye(we(t4 = r2.call.apply(r2, [this].concat(a3))), "state", { height: null }), ye(we(t4), "scrollToTheSelectedTime", function() {
      requestAnimationFrame(function() {
        t4.list && (t4.list.scrollTop = t4.centerLi && n.calcCenterPosition(t4.props.monthRef ? t4.props.monthRef.clientHeight - t4.header.clientHeight : t4.list.clientHeight, t4.centerLi));
      });
    }), ye(we(t4), "handleClick", function(e3) {
      (t4.props.minTime || t4.props.maxTime) && lt(e3, t4.props) || (t4.props.excludeTimes || t4.props.includeTimes || t4.props.filterTime) && ct(e3, t4.props) || t4.props.onChange(e3);
    }), ye(we(t4), "isSelectedTime", function(e3) {
      return t4.props.selected && (r3 = t4.props.selected, n2 = e3, bt(r3).getTime() === bt(n2).getTime());
      var r3, n2;
    }), ye(we(t4), "isDisabledTime", function(e3) {
      return (t4.props.minTime || t4.props.maxTime) && lt(e3, t4.props) || (t4.props.excludeTimes || t4.props.includeTimes || t4.props.filterTime) && ct(e3, t4.props);
    }), ye(we(t4), "liClasses", function(e3) {
      var r3 = ["react-datepicker__time-list-item", t4.props.timeClassName ? t4.props.timeClassName(e3) : void 0];
      return t4.isSelectedTime(e3) && r3.push("react-datepicker__time-list-item--selected"), t4.isDisabledTime(e3) && r3.push("react-datepicker__time-list-item--disabled"), t4.props.injectTimes && (60 * getHours(e3) + getMinutes(e3)) % t4.props.intervals != 0 && r3.push("react-datepicker__time-list-item--injected"), r3.join(" ");
    }), ye(we(t4), "handleOnKeyDown", function(e3, r3) {
      " " === e3.key && (e3.preventDefault(), e3.key = "Enter"), "ArrowUp" !== e3.key && "ArrowLeft" !== e3.key || !e3.target.previousSibling || (e3.preventDefault(), e3.target.previousSibling.focus()), "ArrowDown" !== e3.key && "ArrowRight" !== e3.key || !e3.target.nextSibling || (e3.preventDefault(), e3.target.nextSibling.focus()), "Enter" === e3.key && t4.handleClick(r3), t4.props.handleOnKeyDown(e3);
    }), ye(we(t4), "renderTimes", function() {
      for (var r3 = [], n2 = t4.props.format ? t4.props.format : "p", o2 = t4.props.intervals, a4 = t4.props.selected || t4.props.openToDate || Ye(), i3 = startOfDay(a4), p = t4.props.injectTimes && t4.props.injectTimes.sort(function(e3, t5) {
        return e3 - t5;
      }), c2 = 60 * function(e3) {
        var t5 = new Date(e3.getFullYear(), e3.getMonth(), e3.getDate()), r4 = new Date(e3.getFullYear(), e3.getMonth(), e3.getDate(), 24);
        return Math.round((+r4 - +t5) / 36e5);
      }(a4), l = c2 / o2, d3 = 0; d3 < l; d3++) {
        var u2 = addMinutes(i3, d3 * o2);
        if (r3.push(u2), p) {
          var h3 = gt(i3, u2, d3, o2, p);
          r3 = r3.concat(h3);
        }
      }
      var m3 = r3.reduce(function(e3, t5) {
        return t5.getTime() <= a4.getTime() ? t5 : e3;
      }, r3[0]);
      return r3.map(function(r4, o3) {
        return import_react2.default.createElement("li", { key: o3, onClick: t4.handleClick.bind(we(t4), r4), className: t4.liClasses(r4), ref: function(e3) {
          r4 === m3 && (t4.centerLi = e3);
        }, onKeyDown: function(e3) {
          t4.handleOnKeyDown(e3, r4);
        }, tabIndex: r4 === m3 ? 0 : -1, role: "option", "aria-selected": t4.isSelectedTime(r4) ? "true" : void 0, "aria-disabled": t4.isDisabledTime(r4) ? "true" : void 0 }, Ie(r4, n2, t4.props.locale));
      });
    }), t4;
  }
  return fe(n, [{ key: "componentDidMount", value: function() {
    this.scrollToTheSelectedTime(), this.props.monthRef && this.header && this.setState({ height: this.props.monthRef.clientHeight - this.header.clientHeight });
  } }, { key: "render", value: function() {
    var t4 = this, r3 = this.state.height;
    return import_react2.default.createElement("div", { className: "react-datepicker__time-container ".concat(this.props.todayButton ? "react-datepicker__time-container--with-today-button" : "") }, import_react2.default.createElement("div", { className: "react-datepicker__header react-datepicker__header--time ".concat(this.props.showTimeSelectOnly ? "react-datepicker__header--time--only" : ""), ref: function(e3) {
      t4.header = e3;
    } }, import_react2.default.createElement("div", { className: "react-datepicker-time__header" }, this.props.timeCaption)), import_react2.default.createElement("div", { className: "react-datepicker__time" }, import_react2.default.createElement("div", { className: "react-datepicker__time-box" }, import_react2.default.createElement("ul", { className: "react-datepicker__time-list", ref: function(e3) {
      t4.list = e3;
    }, style: r3 ? { height: r3 } : {}, role: "listbox", "aria-label": this.props.timeCaption }, this.renderTimes()))));
  } }], [{ key: "defaultProps", get: function() {
    return { intervals: 30, onTimeChange: function() {
    }, todayButton: null, timeCaption: "Time" };
  } }]), n;
}();
ye(Kt, "calcCenterPosition", function(e3, t3) {
  return t3.offsetTop - (e3 / 2 - t3.clientHeight / 2);
});
var Bt = function(t3) {
  De(o, import_react2.default.Component);
  var n = be(o);
  function o(t4) {
    var a3;
    return he(this, o), ye(we(a3 = n.call(this, t4)), "YEAR_REFS", Se(Array(a3.props.yearItemNumber)).map(function() {
      return import_react2.default.createRef();
    })), ye(we(a3), "isDisabled", function(e3) {
      return Ze(e3, a3.props);
    }), ye(we(a3), "isExcluded", function(e3) {
      return et(e3, a3.props);
    }), ye(we(a3), "selectingDate", function() {
      var e3;
      return null !== (e3 = a3.props.selectingDate) && void 0 !== e3 ? e3 : a3.props.preSelection;
    }), ye(we(a3), "updateFocusOnPaginate", function(e3) {
      var t5 = (function() {
        this.YEAR_REFS[e3].current.focus();
      }).bind(we(a3));
      window.requestAnimationFrame(t5);
    }), ye(we(a3), "handleYearClick", function(e3, t5) {
      a3.props.onDayClick && a3.props.onDayClick(e3, t5);
    }), ye(we(a3), "handleYearNavigation", function(e3, t5) {
      var r2 = a3.props, n2 = r2.date, o2 = r2.yearItemNumber, s3 = wt(n2, o2).startPeriod;
      a3.isDisabled(t5) || a3.isExcluded(t5) || (a3.props.setPreSelection(t5), e3 - s3 == -1 ? a3.updateFocusOnPaginate(o2 - 1) : e3 - s3 === o2 ? a3.updateFocusOnPaginate(0) : a3.YEAR_REFS[e3 - s3].current.focus());
    }), ye(we(a3), "isSameDay", function(e3, t5) {
      return je(e3, t5);
    }), ye(we(a3), "isCurrentYear", function(e3) {
      return e3 === getYear(Ye());
    }), ye(we(a3), "isRangeStart", function(e3) {
      return a3.props.startDate && a3.props.endDate && Be(setYear(Ye(), e3), a3.props.startDate);
    }), ye(we(a3), "isRangeEnd", function(e3) {
      return a3.props.startDate && a3.props.endDate && Be(setYear(Ye(), e3), a3.props.endDate);
    }), ye(we(a3), "isInRange", function(e3) {
      return ot(e3, a3.props.startDate, a3.props.endDate);
    }), ye(we(a3), "isInSelectingRange", function(e3) {
      var t5 = a3.props, r2 = t5.selectsStart, n2 = t5.selectsEnd, o2 = t5.selectsRange, s3 = t5.startDate, i2 = t5.endDate;
      return !(!(r2 || n2 || o2) || !a3.selectingDate()) && (r2 && i2 ? ot(e3, a3.selectingDate(), i2) : (n2 && s3 || !(!o2 || !s3 || i2)) && ot(e3, s3, a3.selectingDate()));
    }), ye(we(a3), "isSelectingRangeStart", function(e3) {
      if (!a3.isInSelectingRange(e3)) return false;
      var t5 = a3.props, r2 = t5.startDate, n2 = t5.selectsStart, o2 = setYear(Ye(), e3);
      return Be(o2, n2 ? a3.selectingDate() : r2);
    }), ye(we(a3), "isSelectingRangeEnd", function(e3) {
      if (!a3.isInSelectingRange(e3)) return false;
      var t5 = a3.props, r2 = t5.endDate, n2 = t5.selectsEnd, o2 = t5.selectsRange, s3 = setYear(Ye(), e3);
      return Be(s3, n2 || o2 ? a3.selectingDate() : r2);
    }), ye(we(a3), "isKeyboardSelected", function(e3) {
      var t5 = Ae(setYear(a3.props.date, e3));
      return !a3.props.disabledKeyboardNavigation && !a3.props.inline && !je(t5, Ae(a3.props.selected)) && je(t5, Ae(a3.props.preSelection));
    }), ye(we(a3), "onYearClick", function(e3, t5) {
      var r2 = a3.props.date;
      a3.handleYearClick(Ae(setYear(r2, t5)), e3);
    }), ye(we(a3), "onYearKeyDown", function(e3, t5) {
      var r2 = e3.key;
      if (!a3.props.disabledKeyboardNavigation) switch (r2) {
        case "Enter":
          a3.onYearClick(e3, t5), a3.props.setPreSelection(a3.props.selected);
          break;
        case "ArrowRight":
          a3.handleYearNavigation(t5 + 1, addYears(a3.props.preSelection, 1));
          break;
        case "ArrowLeft":
          a3.handleYearNavigation(t5 - 1, subYears(a3.props.preSelection, 1));
      }
    }), ye(we(a3), "getYearClassNames", function(e3) {
      var t5 = a3.props, n2 = t5.minDate, o2 = t5.maxDate, s3 = t5.selected, i2 = t5.excludeDates, p = t5.includeDates, c2 = t5.filterDate;
      return (0, import_classnames.default)("react-datepicker__year-text", { "react-datepicker__year-text--selected": e3 === getYear(s3), "react-datepicker__year-text--disabled": (n2 || o2 || i2 || p || c2) && at(e3, a3.props), "react-datepicker__year-text--keyboard-selected": a3.isKeyboardSelected(e3), "react-datepicker__year-text--range-start": a3.isRangeStart(e3), "react-datepicker__year-text--range-end": a3.isRangeEnd(e3), "react-datepicker__year-text--in-range": a3.isInRange(e3), "react-datepicker__year-text--in-selecting-range": a3.isInSelectingRange(e3), "react-datepicker__year-text--selecting-range-start": a3.isSelectingRangeStart(e3), "react-datepicker__year-text--selecting-range-end": a3.isSelectingRangeEnd(e3), "react-datepicker__year-text--today": a3.isCurrentYear(e3) });
    }), ye(we(a3), "getYearTabIndex", function(e3) {
      return a3.props.disabledKeyboardNavigation ? "-1" : e3 === getYear(a3.props.preSelection) ? "0" : "-1";
    }), ye(we(a3), "getYearContainerClassNames", function() {
      var e3 = a3.props, t5 = e3.selectingDate, n2 = e3.selectsStart, o2 = e3.selectsEnd, s3 = e3.selectsRange;
      return (0, import_classnames.default)("react-datepicker__year", { "react-datepicker__year--selecting-range": t5 && (n2 || o2 || s3) });
    }), ye(we(a3), "getYearContent", function(e3) {
      return a3.props.renderYearContent ? a3.props.renderYearContent(e3) : e3;
    }), a3;
  }
  return fe(o, [{ key: "render", value: function() {
    for (var t4 = this, r2 = [], n2 = this.props, o2 = n2.date, a3 = n2.yearItemNumber, s3 = n2.onYearMouseEnter, i2 = n2.onYearMouseLeave, p = wt(o2, a3), c2 = p.startPeriod, l = p.endPeriod, d3 = function(n3) {
      r2.push(import_react2.default.createElement("div", { ref: t4.YEAR_REFS[n3 - c2], onClick: function(e3) {
        t4.onYearClick(e3, n3);
      }, onKeyDown: function(e3) {
        t4.onYearKeyDown(e3, n3);
      }, tabIndex: t4.getYearTabIndex(n3), className: t4.getYearClassNames(n3), onMouseEnter: function(e3) {
        return s3(e3, n3);
      }, onMouseLeave: function(e3) {
        return i2(e3, n3);
      }, key: n3, "aria-current": t4.isCurrentYear(n3) ? "date" : void 0 }, t4.getYearContent(n3)));
    }, u2 = c2; u2 <= l; u2++) d3(u2);
    return import_react2.default.createElement("div", { className: this.getYearContainerClassNames() }, import_react2.default.createElement("div", { className: "react-datepicker__year-wrapper", onMouseLeave: this.props.clearSelectingDate }, r2));
  } }]), o;
}();
var Qt = function(t3) {
  De(n, import_react2.default.Component);
  var r2 = be(n);
  function n(t4) {
    var o;
    return he(this, n), ye(we(o = r2.call(this, t4)), "onTimeChange", function(e3) {
      o.setState({ time: e3 });
      var t5 = o.props.date, r3 = t5 instanceof Date && !isNaN(t5) ? t5 : /* @__PURE__ */ new Date();
      r3.setHours(e3.split(":")[0]), r3.setMinutes(e3.split(":")[1]), o.props.onChange(r3);
    }), ye(we(o), "renderTimeInput", function() {
      var t5 = o.state.time, r3 = o.props, n2 = r3.date, a3 = r3.timeString, s3 = r3.customTimeInput;
      return s3 ? import_react2.default.cloneElement(s3, { date: n2, value: t5, onChange: o.onTimeChange }) : import_react2.default.createElement("input", { type: "time", className: "react-datepicker-time__input", placeholder: "Time", name: "time-input", required: true, value: t5, onChange: function(e3) {
        o.onTimeChange(e3.target.value || a3);
      } });
    }), o.state = { time: o.props.timeString }, o;
  }
  return fe(n, [{ key: "render", value: function() {
    return import_react2.default.createElement("div", { className: "react-datepicker__input-time-container" }, import_react2.default.createElement("div", { className: "react-datepicker-time__caption" }, this.props.timeInputLabel), import_react2.default.createElement("div", { className: "react-datepicker-time__input-container" }, import_react2.default.createElement("div", { className: "react-datepicker-time__input" }, this.renderTimeInput())));
  } }], [{ key: "getDerivedStateFromProps", value: function(e3, t4) {
    return e3.timeString !== t4.time ? { time: e3.timeString } : null;
  } }]), n;
}();
function Ht(t3) {
  var r2 = t3.className, n = t3.children, o = t3.showPopperArrow, a3 = t3.arrowProps, s3 = void 0 === a3 ? {} : a3;
  return import_react2.default.createElement("div", { className: r2 }, o && import_react2.default.createElement("div", ve({ className: "react-datepicker__triangle" }, s3)), n);
}
var jt = ["react-datepicker__year-select", "react-datepicker__month-select", "react-datepicker__month-year-select"];
var Vt = function(t3) {
  De(o, import_react2.default.Component);
  var n = be(o);
  function o(t4) {
    var a3;
    return he(this, o), ye(we(a3 = n.call(this, t4)), "handleClickOutside", function(e3) {
      a3.props.onClickOutside(e3);
    }), ye(we(a3), "setClickOutsideRef", function() {
      return a3.containerRef.current;
    }), ye(we(a3), "handleDropdownFocus", function(e3) {
      (function() {
        var e4 = ((arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}).className || "").split(/\s+/);
        return jt.some(function(t5) {
          return e4.indexOf(t5) >= 0;
        });
      })(e3.target) && a3.props.onDropdownFocus();
    }), ye(we(a3), "getDateInView", function() {
      var e3 = a3.props, t5 = e3.preSelection, r2 = e3.selected, n2 = e3.openToDate, o2 = ft(a3.props), s3 = yt(a3.props), i2 = Ye(), p = n2 || r2 || t5;
      return p || (o2 && isBefore(i2, o2) ? o2 : s3 && isAfter(i2, s3) ? s3 : i2);
    }), ye(we(a3), "increaseMonth", function() {
      a3.setState(function(e3) {
        var t5 = e3.date;
        return { date: addMonths(t5, 1) };
      }, function() {
        return a3.handleMonthChange(a3.state.date);
      });
    }), ye(we(a3), "decreaseMonth", function() {
      a3.setState(function(e3) {
        var t5 = e3.date;
        return { date: subMonths(t5, 1) };
      }, function() {
        return a3.handleMonthChange(a3.state.date);
      });
    }), ye(we(a3), "handleDayClick", function(e3, t5, r2) {
      a3.props.onSelect(e3, t5, r2), a3.props.setPreSelection && a3.props.setPreSelection(e3);
    }), ye(we(a3), "handleDayMouseEnter", function(e3) {
      a3.setState({ selectingDate: e3 }), a3.props.onDayMouseEnter && a3.props.onDayMouseEnter(e3);
    }), ye(we(a3), "handleMonthMouseLeave", function() {
      a3.setState({ selectingDate: null }), a3.props.onMonthMouseLeave && a3.props.onMonthMouseLeave();
    }), ye(we(a3), "handleYearMouseEnter", function(e3, t5) {
      a3.setState({ selectingDate: setYear(Ye(), t5) }), a3.props.onYearMouseEnter && a3.props.onYearMouseEnter(e3, t5);
    }), ye(we(a3), "handleYearMouseLeave", function(e3, t5) {
      a3.props.onYearMouseLeave && a3.props.onYearMouseLeave(e3, t5);
    }), ye(we(a3), "handleYearChange", function(e3) {
      a3.props.onYearChange && (a3.props.onYearChange(e3), a3.setState({ isRenderAriaLiveMessage: true })), a3.props.adjustDateOnChange && (a3.props.onSelect && a3.props.onSelect(e3), a3.props.setOpen && a3.props.setOpen(true)), a3.props.setPreSelection && a3.props.setPreSelection(e3);
    }), ye(we(a3), "handleMonthChange", function(e3) {
      a3.handleCustomMonthChange(e3), a3.props.adjustDateOnChange && (a3.props.onSelect && a3.props.onSelect(e3), a3.props.setOpen && a3.props.setOpen(true)), a3.props.setPreSelection && a3.props.setPreSelection(e3);
    }), ye(we(a3), "handleCustomMonthChange", function(e3) {
      a3.props.onMonthChange && (a3.props.onMonthChange(e3), a3.setState({ isRenderAriaLiveMessage: true }));
    }), ye(we(a3), "handleMonthYearChange", function(e3) {
      a3.handleYearChange(e3), a3.handleMonthChange(e3);
    }), ye(we(a3), "changeYear", function(e3) {
      a3.setState(function(t5) {
        var r2 = t5.date;
        return { date: setYear(r2, e3) };
      }, function() {
        return a3.handleYearChange(a3.state.date);
      });
    }), ye(we(a3), "changeMonth", function(e3) {
      a3.setState(function(t5) {
        var r2 = t5.date;
        return { date: setMonth(r2, e3) };
      }, function() {
        return a3.handleMonthChange(a3.state.date);
      });
    }), ye(we(a3), "changeMonthYear", function(e3) {
      a3.setState(function(t5) {
        var r2 = t5.date;
        return { date: setYear(setMonth(r2, getMonth(e3)), getYear(e3)) };
      }, function() {
        return a3.handleMonthYearChange(a3.state.date);
      });
    }), ye(we(a3), "header", function() {
      var t5 = Le(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a3.state.date, a3.props.locale, a3.props.calendarStartDay), n2 = [];
      return a3.props.showWeekNumbers && n2.push(import_react2.default.createElement("div", { key: "W", className: "react-datepicker__day-name" }, a3.props.weekLabel || "#")), n2.concat([0, 1, 2, 3, 4, 5, 6].map(function(n3) {
        var o2 = addDays(t5, n3), s3 = a3.formatWeekday(o2, a3.props.locale), i2 = a3.props.weekDayClassName ? a3.props.weekDayClassName(o2) : void 0;
        return import_react2.default.createElement("div", { key: n3, className: (0, import_classnames.default)("react-datepicker__day-name", i2) }, s3);
      }));
    }), ye(we(a3), "formatWeekday", function(e3, t5) {
      return a3.props.formatWeekDay ? function(e4, t6, r2) {
        return t6(Ie(e4, "EEEE", r2));
      }(e3, a3.props.formatWeekDay, t5) : a3.props.useWeekdaysShort ? function(e4, t6) {
        return Ie(e4, "EEE", t6);
      }(e3, t5) : function(e4, t6) {
        return Ie(e4, "EEEEEE", t6);
      }(e3, t5);
    }), ye(we(a3), "decreaseYear", function() {
      a3.setState(function(e3) {
        var t5 = e3.date;
        return { date: subYears(t5, a3.props.showYearPicker ? a3.props.yearItemNumber : 1) };
      }, function() {
        return a3.handleYearChange(a3.state.date);
      });
    }), ye(we(a3), "clearSelectingDate", function() {
      a3.setState({ selectingDate: null });
    }), ye(we(a3), "renderPreviousButton", function() {
      if (!a3.props.renderCustomHeader) {
        var t5;
        switch (true) {
          case a3.props.showMonthYearPicker:
            t5 = ht(a3.state.date, a3.props);
            break;
          case a3.props.showYearPicker:
            t5 = function(e3) {
              var t6 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r3 = t6.minDate, n3 = t6.yearItemNumber, o3 = void 0 === n3 ? Ne : n3, a4 = wt(Ae(subYears(e3, o3)), o3).endPeriod, s4 = r3 && getYear(r3);
              return s4 && s4 > a4 || false;
            }(a3.state.date, a3.props);
            break;
          default:
            t5 = dt(a3.state.date, a3.props);
        }
        if ((a3.props.forceShowMonthNavigation || a3.props.showDisabledMonthNavigation || !t5) && !a3.props.showTimeSelectOnly) {
          var r2 = ["react-datepicker__navigation", "react-datepicker__navigation--previous"], n2 = a3.decreaseMonth;
          (a3.props.showMonthYearPicker || a3.props.showQuarterYearPicker || a3.props.showYearPicker) && (n2 = a3.decreaseYear), t5 && a3.props.showDisabledMonthNavigation && (r2.push("react-datepicker__navigation--previous--disabled"), n2 = null);
          var o2 = a3.props.showMonthYearPicker || a3.props.showQuarterYearPicker || a3.props.showYearPicker, s3 = a3.props, i2 = s3.previousMonthButtonLabel, p = s3.previousYearButtonLabel, c2 = a3.props, l = c2.previousMonthAriaLabel, d3 = void 0 === l ? "string" == typeof i2 ? i2 : "Previous Month" : l, u2 = c2.previousYearAriaLabel, h3 = void 0 === u2 ? "string" == typeof p ? p : "Previous Year" : u2;
          return import_react2.default.createElement("button", { type: "button", className: r2.join(" "), onClick: n2, onKeyDown: a3.props.handleOnKeyDown, "aria-label": o2 ? h3 : d3 }, import_react2.default.createElement("span", { className: ["react-datepicker__navigation-icon", "react-datepicker__navigation-icon--previous"].join(" ") }, o2 ? a3.props.previousYearButtonLabel : a3.props.previousMonthButtonLabel));
        }
      }
    }), ye(we(a3), "increaseYear", function() {
      a3.setState(function(e3) {
        var t5 = e3.date;
        return { date: addYears(t5, a3.props.showYearPicker ? a3.props.yearItemNumber : 1) };
      }, function() {
        return a3.handleYearChange(a3.state.date);
      });
    }), ye(we(a3), "renderNextButton", function() {
      if (!a3.props.renderCustomHeader) {
        var t5;
        switch (true) {
          case a3.props.showMonthYearPicker:
            t5 = mt(a3.state.date, a3.props);
            break;
          case a3.props.showYearPicker:
            t5 = function(e3) {
              var t6 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, r3 = t6.maxDate, n3 = t6.yearItemNumber, o3 = void 0 === n3 ? Ne : n3, a4 = wt(addYears(e3, o3), o3).startPeriod, s4 = r3 && getYear(r3);
              return s4 && s4 < a4 || false;
            }(a3.state.date, a3.props);
            break;
          default:
            t5 = ut(a3.state.date, a3.props);
        }
        if ((a3.props.forceShowMonthNavigation || a3.props.showDisabledMonthNavigation || !t5) && !a3.props.showTimeSelectOnly) {
          var r2 = ["react-datepicker__navigation", "react-datepicker__navigation--next"];
          a3.props.showTimeSelect && r2.push("react-datepicker__navigation--next--with-time"), a3.props.todayButton && r2.push("react-datepicker__navigation--next--with-today-button");
          var n2 = a3.increaseMonth;
          (a3.props.showMonthYearPicker || a3.props.showQuarterYearPicker || a3.props.showYearPicker) && (n2 = a3.increaseYear), t5 && a3.props.showDisabledMonthNavigation && (r2.push("react-datepicker__navigation--next--disabled"), n2 = null);
          var o2 = a3.props.showMonthYearPicker || a3.props.showQuarterYearPicker || a3.props.showYearPicker, s3 = a3.props, i2 = s3.nextMonthButtonLabel, p = s3.nextYearButtonLabel, c2 = a3.props, l = c2.nextMonthAriaLabel, d3 = void 0 === l ? "string" == typeof i2 ? i2 : "Next Month" : l, h3 = c2.nextYearAriaLabel, m3 = void 0 === h3 ? "string" == typeof p ? p : "Next Year" : h3;
          return import_react2.default.createElement("button", { type: "button", className: r2.join(" "), onClick: n2, onKeyDown: a3.props.handleOnKeyDown, "aria-label": o2 ? m3 : d3 }, import_react2.default.createElement("span", { className: ["react-datepicker__navigation-icon", "react-datepicker__navigation-icon--next"].join(" ") }, o2 ? a3.props.nextYearButtonLabel : a3.props.nextMonthButtonLabel));
        }
      }
    }), ye(we(a3), "renderCurrentMonth", function() {
      var t5 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : a3.state.date, r2 = ["react-datepicker__current-month"];
      return a3.props.showYearDropdown && r2.push("react-datepicker__current-month--hasYearDropdown"), a3.props.showMonthDropdown && r2.push("react-datepicker__current-month--hasMonthDropdown"), a3.props.showMonthYearDropdown && r2.push("react-datepicker__current-month--hasMonthYearDropdown"), import_react2.default.createElement("div", { className: r2.join(" ") }, Ie(t5, a3.props.dateFormat, a3.props.locale));
    }), ye(we(a3), "renderYearDropdown", function() {
      var t5 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      if (a3.props.showYearDropdown && !t5) return import_react2.default.createElement(_t, { adjustDateOnChange: a3.props.adjustDateOnChange, date: a3.state.date, onSelect: a3.props.onSelect, setOpen: a3.props.setOpen, dropdownMode: a3.props.dropdownMode, onChange: a3.changeYear, minDate: a3.props.minDate, maxDate: a3.props.maxDate, year: getYear(a3.state.date), scrollableYearDropdown: a3.props.scrollableYearDropdown, yearDropdownItemNumber: a3.props.yearDropdownItemNumber });
    }), ye(we(a3), "renderMonthDropdown", function() {
      var t5 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      if (a3.props.showMonthDropdown && !t5) return import_react2.default.createElement(Pt, { dropdownMode: a3.props.dropdownMode, locale: a3.props.locale, onChange: a3.changeMonth, month: getMonth(a3.state.date), useShortMonthInDropdown: a3.props.useShortMonthInDropdown });
    }), ye(we(a3), "renderMonthYearDropdown", function() {
      var t5 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
      if (a3.props.showMonthYearDropdown && !t5) return import_react2.default.createElement(xt, { dropdownMode: a3.props.dropdownMode, locale: a3.props.locale, dateFormat: a3.props.dateFormat, onChange: a3.changeMonthYear, minDate: a3.props.minDate, maxDate: a3.props.maxDate, date: a3.state.date, scrollableMonthYearDropdown: a3.props.scrollableMonthYearDropdown });
    }), ye(we(a3), "handleTodayButtonClick", function(e3) {
      a3.props.onSelect(Ke(), e3), a3.props.setPreSelection && a3.props.setPreSelection(Ke());
    }), ye(we(a3), "renderTodayButton", function() {
      if (a3.props.todayButton && !a3.props.showTimeSelectOnly) return import_react2.default.createElement("div", { className: "react-datepicker__today-button", onClick: function(e3) {
        return a3.handleTodayButtonClick(e3);
      } }, a3.props.todayButton);
    }), ye(we(a3), "renderDefaultHeader", function(t5) {
      var r2 = t5.monthDate, n2 = t5.i;
      return import_react2.default.createElement("div", { className: "react-datepicker__header ".concat(a3.props.showTimeSelect ? "react-datepicker__header--has-time-select" : "") }, a3.renderCurrentMonth(r2), import_react2.default.createElement("div", { className: "react-datepicker__header__dropdown react-datepicker__header__dropdown--".concat(a3.props.dropdownMode), onFocus: a3.handleDropdownFocus }, a3.renderMonthDropdown(0 !== n2), a3.renderMonthYearDropdown(0 !== n2), a3.renderYearDropdown(0 !== n2)), import_react2.default.createElement("div", { className: "react-datepicker__day-names" }, a3.header(r2)));
    }), ye(we(a3), "renderCustomHeader", function() {
      var t5 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, r2 = t5.monthDate, n2 = t5.i;
      if (a3.props.showTimeSelect && !a3.state.monthContainer || a3.props.showTimeSelectOnly) return null;
      var o2 = dt(a3.state.date, a3.props), s3 = ut(a3.state.date, a3.props), i2 = ht(a3.state.date, a3.props), p = mt(a3.state.date, a3.props), c2 = !a3.props.showMonthYearPicker && !a3.props.showQuarterYearPicker && !a3.props.showYearPicker;
      return import_react2.default.createElement("div", { className: "react-datepicker__header react-datepicker__header--custom", onFocus: a3.props.onDropdownFocus }, a3.props.renderCustomHeader(de(de({}, a3.state), {}, { customHeaderCount: n2, monthDate: r2, changeMonth: a3.changeMonth, changeYear: a3.changeYear, decreaseMonth: a3.decreaseMonth, increaseMonth: a3.increaseMonth, decreaseYear: a3.decreaseYear, increaseYear: a3.increaseYear, prevMonthButtonDisabled: o2, nextMonthButtonDisabled: s3, prevYearButtonDisabled: i2, nextYearButtonDisabled: p })), c2 && import_react2.default.createElement("div", { className: "react-datepicker__day-names" }, a3.header(r2)));
    }), ye(we(a3), "renderYearHeader", function() {
      var t5 = a3.state.date, r2 = a3.props, n2 = r2.showYearPicker, o2 = wt(t5, r2.yearItemNumber), s3 = o2.startPeriod, i2 = o2.endPeriod;
      return import_react2.default.createElement("div", { className: "react-datepicker__header react-datepicker-year-header" }, n2 ? "".concat(s3, " - ").concat(i2) : getYear(t5));
    }), ye(we(a3), "renderHeader", function(e3) {
      switch (true) {
        case void 0 !== a3.props.renderCustomHeader:
          return a3.renderCustomHeader(e3);
        case (a3.props.showMonthYearPicker || a3.props.showQuarterYearPicker || a3.props.showYearPicker):
          return a3.renderYearHeader(e3);
        default:
          return a3.renderDefaultHeader(e3);
      }
    }), ye(we(a3), "renderMonths", function() {
      var t5;
      if (!a3.props.showTimeSelectOnly && !a3.props.showYearPicker) {
        for (var r2 = [], n2 = a3.props.showPreviousMonths ? a3.props.monthsShown - 1 : 0, o2 = subMonths(a3.state.date, n2), s3 = null !== (t5 = a3.props.monthSelectedIn) && void 0 !== t5 ? t5 : n2, i2 = 0; i2 < a3.props.monthsShown; ++i2) {
          var p = addMonths(o2, i2 - s3 + n2), c2 = "month-".concat(i2), d3 = i2 < a3.props.monthsShown - 1, u2 = i2 > 0;
          r2.push(import_react2.default.createElement("div", { key: c2, ref: function(e3) {
            a3.monthContainer = e3;
          }, className: "react-datepicker__month-container" }, a3.renderHeader({ monthDate: p, i: i2 }), import_react2.default.createElement(Wt, { chooseDayAriaLabelPrefix: a3.props.chooseDayAriaLabelPrefix, disabledDayAriaLabelPrefix: a3.props.disabledDayAriaLabelPrefix, weekAriaLabelPrefix: a3.props.weekAriaLabelPrefix, ariaLabelPrefix: a3.props.monthAriaLabelPrefix, onChange: a3.changeMonthYear, day: p, dayClassName: a3.props.dayClassName, calendarStartDay: a3.props.calendarStartDay, monthClassName: a3.props.monthClassName, onDayClick: a3.handleDayClick, handleOnKeyDown: a3.props.handleOnDayKeyDown, onDayMouseEnter: a3.handleDayMouseEnter, onMouseLeave: a3.handleMonthMouseLeave, onWeekSelect: a3.props.onWeekSelect, orderInDisplay: i2, formatWeekNumber: a3.props.formatWeekNumber, locale: a3.props.locale, minDate: a3.props.minDate, maxDate: a3.props.maxDate, excludeDates: a3.props.excludeDates, excludeDateIntervals: a3.props.excludeDateIntervals, highlightDates: a3.props.highlightDates, holidays: a3.props.holidays, selectingDate: a3.state.selectingDate, includeDates: a3.props.includeDates, includeDateIntervals: a3.props.includeDateIntervals, inline: a3.props.inline, shouldFocusDayInline: a3.props.shouldFocusDayInline, fixedHeight: a3.props.fixedHeight, filterDate: a3.props.filterDate, preSelection: a3.props.preSelection, setPreSelection: a3.props.setPreSelection, selected: a3.props.selected, selectsStart: a3.props.selectsStart, selectsEnd: a3.props.selectsEnd, selectsRange: a3.props.selectsRange, selectsDisabledDaysInRange: a3.props.selectsDisabledDaysInRange, showWeekNumbers: a3.props.showWeekNumbers, startDate: a3.props.startDate, endDate: a3.props.endDate, peekNextMonth: a3.props.peekNextMonth, setOpen: a3.props.setOpen, shouldCloseOnSelect: a3.props.shouldCloseOnSelect, renderDayContents: a3.props.renderDayContents, renderMonthContent: a3.props.renderMonthContent, renderQuarterContent: a3.props.renderQuarterContent, renderYearContent: a3.props.renderYearContent, disabledKeyboardNavigation: a3.props.disabledKeyboardNavigation, showMonthYearPicker: a3.props.showMonthYearPicker, showFullMonthYearPicker: a3.props.showFullMonthYearPicker, showTwoColumnMonthYearPicker: a3.props.showTwoColumnMonthYearPicker, showFourColumnMonthYearPicker: a3.props.showFourColumnMonthYearPicker, showYearPicker: a3.props.showYearPicker, showQuarterYearPicker: a3.props.showQuarterYearPicker, showWeekPicker: a3.props.showWeekPicker, isInputFocused: a3.props.isInputFocused, containerRef: a3.containerRef, monthShowsDuplicateDaysEnd: d3, monthShowsDuplicateDaysStart: u2 })));
        }
        return r2;
      }
    }), ye(we(a3), "renderYears", function() {
      if (!a3.props.showTimeSelectOnly) return a3.props.showYearPicker ? import_react2.default.createElement("div", { className: "react-datepicker__year--container" }, a3.renderHeader(), import_react2.default.createElement(Bt, ve({ onDayClick: a3.handleDayClick, selectingDate: a3.state.selectingDate, clearSelectingDate: a3.clearSelectingDate, date: a3.state.date }, a3.props, { onYearMouseEnter: a3.handleYearMouseEnter, onYearMouseLeave: a3.handleYearMouseLeave }))) : void 0;
    }), ye(we(a3), "renderTimeSection", function() {
      if (a3.props.showTimeSelect && (a3.state.monthContainer || a3.props.showTimeSelectOnly)) return import_react2.default.createElement(Kt, { selected: a3.props.selected, openToDate: a3.props.openToDate, onChange: a3.props.onTimeChange, timeClassName: a3.props.timeClassName, format: a3.props.timeFormat, includeTimes: a3.props.includeTimes, intervals: a3.props.timeIntervals, minTime: a3.props.minTime, maxTime: a3.props.maxTime, excludeTimes: a3.props.excludeTimes, filterTime: a3.props.filterTime, timeCaption: a3.props.timeCaption, todayButton: a3.props.todayButton, showMonthDropdown: a3.props.showMonthDropdown, showMonthYearDropdown: a3.props.showMonthYearDropdown, showYearDropdown: a3.props.showYearDropdown, withPortal: a3.props.withPortal, monthRef: a3.state.monthContainer, injectTimes: a3.props.injectTimes, locale: a3.props.locale, handleOnKeyDown: a3.props.handleOnKeyDown, showTimeSelectOnly: a3.props.showTimeSelectOnly });
    }), ye(we(a3), "renderInputTimeSection", function() {
      var t5 = new Date(a3.props.selected), r2 = Te(t5) && Boolean(a3.props.selected) ? "".concat(kt(t5.getHours()), ":").concat(kt(t5.getMinutes())) : "";
      if (a3.props.showTimeInput) return import_react2.default.createElement(Qt, { date: t5, timeString: r2, timeInputLabel: a3.props.timeInputLabel, onChange: a3.props.onTimeChange, customTimeInput: a3.props.customTimeInput });
    }), ye(we(a3), "renderAriaLiveRegion", function() {
      var t5, r2 = wt(a3.state.date, a3.props.yearItemNumber), n2 = r2.startPeriod, o2 = r2.endPeriod;
      return t5 = a3.props.showYearPicker ? "".concat(n2, " - ").concat(o2) : a3.props.showMonthYearPicker || a3.props.showQuarterYearPicker ? getYear(a3.state.date) : "".concat(Je(getMonth(a3.state.date), a3.props.locale), " ").concat(getYear(a3.state.date)), import_react2.default.createElement("span", { role: "alert", "aria-live": "polite", className: "react-datepicker__aria-live" }, a3.state.isRenderAriaLiveMessage && t5);
    }), ye(we(a3), "renderChildren", function() {
      if (a3.props.children) return import_react2.default.createElement("div", { className: "react-datepicker__children-container" }, a3.props.children);
    }), a3.containerRef = import_react2.default.createRef(), a3.state = { date: a3.getDateInView(), selectingDate: null, monthContainer: null, isRenderAriaLiveMessage: false }, a3;
  }
  return fe(o, [{ key: "componentDidMount", value: function() {
    var e3 = this;
    this.props.showTimeSelect && (this.assignMonthContainer = void e3.setState({ monthContainer: e3.monthContainer }));
  } }, { key: "componentDidUpdate", value: function(e3) {
    var t4 = this;
    if (!this.props.preSelection || je(this.props.preSelection, e3.preSelection) && this.props.monthSelectedIn === e3.monthSelectedIn) this.props.openToDate && !je(this.props.openToDate, e3.openToDate) && this.setState({ date: this.props.openToDate });
    else {
      var r2 = !Qe(this.state.date, this.props.preSelection);
      this.setState({ date: this.props.preSelection }, function() {
        return r2 && t4.handleCustomMonthChange(t4.state.date);
      });
    }
  } }, { key: "render", value: function() {
    var t4 = this.props.container || Ht;
    return import_react2.default.createElement("div", { style: { display: "contents" }, ref: this.containerRef }, import_react2.default.createElement(t4, { className: (0, import_classnames.default)("react-datepicker", this.props.className, { "react-datepicker--time-only": this.props.showTimeSelectOnly }), showPopperArrow: this.props.showPopperArrow, arrowProps: this.props.arrowProps }, this.renderAriaLiveRegion(), this.renderPreviousButton(), this.renderNextButton(), this.renderMonths(), this.renderYears(), this.renderTodayButton(), this.renderTimeSection(), this.renderInputTimeSection(), this.renderChildren()));
  } }], [{ key: "defaultProps", get: function() {
    return { onDropdownFocus: function() {
    }, monthsShown: 1, forceShowMonthNavigation: false, timeCaption: "Time", previousYearButtonLabel: "Previous Year", nextYearButtonLabel: "Next Year", previousMonthButtonLabel: "Previous Month", nextMonthButtonLabel: "Next Month", customTimeInput: null, yearItemNumber: Ne };
  } }]), o;
}();
var qt = function(t3) {
  var r2 = t3.icon, n = t3.className, o = void 0 === n ? "" : n, a3 = t3.onClick, s3 = "react-datepicker__calendar-icon";
  return import_react2.default.isValidElement(r2) ? import_react2.default.cloneElement(r2, { className: "".concat(r2.props.className || "", " ").concat(s3, " ").concat(o), onClick: function(e3) {
    "function" == typeof r2.props.onClick && r2.props.onClick(e3), "function" == typeof a3 && a3(e3);
  } }) : "string" == typeof r2 ? import_react2.default.createElement("i", { className: "".concat(s3, " ").concat(r2, " ").concat(o), "aria-hidden": "true", onClick: a3 }) : import_react2.default.createElement("svg", { className: "".concat(s3, " ").concat(o), xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 448 512", onClick: a3 }, import_react2.default.createElement("path", { d: "M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" }));
};
var Ut = function(t3) {
  De(n, import_react2.default.Component);
  var r2 = be(n);
  function n(e3) {
    var t4;
    return he(this, n), (t4 = r2.call(this, e3)).el = document.createElement("div"), t4;
  }
  return fe(n, [{ key: "componentDidMount", value: function() {
    this.portalRoot = (this.props.portalHost || document).getElementById(this.props.portalId), this.portalRoot || (this.portalRoot = document.createElement("div"), this.portalRoot.setAttribute("id", this.props.portalId), (this.props.portalHost || document.body).appendChild(this.portalRoot)), this.portalRoot.appendChild(this.el);
  } }, { key: "componentWillUnmount", value: function() {
    this.portalRoot.removeChild(this.el);
  } }, { key: "render", value: function() {
    return import_react_dom2.default.createPortal(this.props.children, this.el);
  } }]), n;
}();
var zt = function(e3) {
  return !e3.disabled && -1 !== e3.tabIndex;
};
var $t = function(t3) {
  De(n, import_react2.default.Component);
  var r2 = be(n);
  function n(t4) {
    var o;
    return he(this, n), ye(we(o = r2.call(this, t4)), "getTabChildren", function() {
      return Array.prototype.slice.call(o.tabLoopRef.current.querySelectorAll("[tabindex], a, button, input, select, textarea"), 1, -1).filter(zt);
    }), ye(we(o), "handleFocusStart", function() {
      var e3 = o.getTabChildren();
      e3 && e3.length > 1 && e3[e3.length - 1].focus();
    }), ye(we(o), "handleFocusEnd", function() {
      var e3 = o.getTabChildren();
      e3 && e3.length > 1 && e3[0].focus();
    }), o.tabLoopRef = import_react2.default.createRef(), o;
  }
  return fe(n, [{ key: "render", value: function() {
    return this.props.enableTabLoop ? import_react2.default.createElement("div", { className: "react-datepicker__tab-loop", ref: this.tabLoopRef }, import_react2.default.createElement("div", { className: "react-datepicker__tab-loop__start", tabIndex: "0", onFocus: this.handleFocusStart }), this.props.children, import_react2.default.createElement("div", { className: "react-datepicker__tab-loop__end", tabIndex: "0", onFocus: this.handleFocusEnd })) : this.props.children;
  } }], [{ key: "defaultProps", get: function() {
    return { enableTabLoop: true };
  } }]), n;
}();
var Gt = function(t3) {
  De(o, import_react2.default.Component);
  var n = be(o);
  function o() {
    return he(this, o), n.apply(this, arguments);
  }
  return fe(o, [{ key: "render", value: function() {
    var t4, n2 = this.props, o2 = n2.className, a3 = n2.wrapperClassName, s3 = n2.hidePopper, i2 = n2.popperComponent, p = n2.popperModifiers, c2 = n2.popperPlacement, l = n2.popperProps, d3 = n2.targetComponent, u2 = n2.enableTabLoop, h3 = n2.popperOnKeyDown, m3 = n2.portalId, f = n2.portalHost;
    if (!s3) {
      var y3 = (0, import_classnames.default)("react-datepicker-popper", o2);
      t4 = import_react2.default.createElement(Popper, ve({ modifiers: p, placement: c2 }, l), function(t5) {
        var r2 = t5.ref, n3 = t5.style, o3 = t5.placement, a4 = t5.arrowProps;
        return import_react2.default.createElement($t, { enableTabLoop: u2 }, import_react2.default.createElement("div", { ref: r2, style: n3, className: y3, "data-placement": o3, onKeyDown: h3 }, import_react2.default.cloneElement(i2, { arrowProps: a4 })));
      });
    }
    this.props.popperContainer && (t4 = import_react2.default.createElement(this.props.popperContainer, {}, t4)), m3 && !s3 && (t4 = import_react2.default.createElement(Ut, { portalId: m3, portalHost: f }, t4));
    var v = (0, import_classnames.default)("react-datepicker-wrapper", a3);
    return import_react2.default.createElement(Manager, { className: "react-datepicker-manager" }, import_react2.default.createElement(Reference, null, function(t5) {
      var r2 = t5.ref;
      return import_react2.default.createElement("div", { ref: r2, className: v }, d3);
    }), t4);
  } }], [{ key: "defaultProps", get: function() {
    return { hidePopper: true, popperModifiers: [], popperProps: {}, popperPlacement: "bottom-start" };
  } }]), o;
}();
var Jt = "react-datepicker-ignore-onclickoutside";
var Xt = react_onclickoutside_es_default(Vt);
var Zt = "Date input not valid.";
var er = function(t3) {
  De(s3, import_react2.default.Component);
  var a3 = be(s3);
  function s3(t4) {
    var i2;
    return he(this, s3), ye(we(i2 = a3.call(this, t4)), "getPreSelection", function() {
      return i2.props.openToDate ? i2.props.openToDate : i2.props.selectsEnd && i2.props.startDate ? i2.props.startDate : i2.props.selectsStart && i2.props.endDate ? i2.props.endDate : Ye();
    }), ye(we(i2), "modifyHolidays", function() {
      var e3;
      return null === (e3 = i2.props.holidays) || void 0 === e3 ? void 0 : e3.reduce(function(e4, t5) {
        var r2 = new Date(t5.date);
        return isValid(r2) ? [].concat(Se(e4), [de(de({}, t5), {}, { date: r2 })]) : e4;
      }, []);
    }), ye(we(i2), "calcInitialState", function() {
      var e3, t5 = i2.getPreSelection(), r2 = ft(i2.props), n = yt(i2.props), o = r2 && isBefore(t5, startOfDay(r2)) ? r2 : n && isAfter(t5, endOfDay(n)) ? n : t5;
      return { open: i2.props.startOpen || false, preventFocus: false, preSelection: null !== (e3 = i2.props.selectsRange ? i2.props.startDate : i2.props.selected) && void 0 !== e3 ? e3 : o, highlightDates: vt(i2.props.highlightDates), focused: false, shouldFocusDayInline: false, isRenderAriaLiveMessage: false };
    }), ye(we(i2), "clearPreventFocusTimeout", function() {
      i2.preventFocusTimeout && clearTimeout(i2.preventFocusTimeout);
    }), ye(we(i2), "setFocus", function() {
      i2.input && i2.input.focus && i2.input.focus({ preventScroll: true });
    }), ye(we(i2), "setBlur", function() {
      i2.input && i2.input.blur && i2.input.blur(), i2.cancelFocusInput();
    }), ye(we(i2), "setOpen", function(e3) {
      var t5 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
      i2.setState({ open: e3, preSelection: e3 && i2.state.open ? i2.state.preSelection : i2.calcInitialState().preSelection, lastPreSelectChange: rr }, function() {
        e3 || i2.setState(function(e4) {
          return { focused: !!t5 && e4.focused };
        }, function() {
          !t5 && i2.setBlur(), i2.setState({ inputValue: null });
        });
      });
    }), ye(we(i2), "inputOk", function() {
      return isDate(i2.state.preSelection);
    }), ye(we(i2), "isCalendarOpen", function() {
      return void 0 === i2.props.open ? i2.state.open && !i2.props.disabled && !i2.props.readOnly : i2.props.open;
    }), ye(we(i2), "handleFocus", function(e3) {
      i2.state.preventFocus || (i2.props.onFocus(e3), i2.props.preventOpenOnFocus || i2.props.readOnly || i2.setOpen(true)), i2.setState({ focused: true });
    }), ye(we(i2), "sendFocusBackToInput", function() {
      i2.preventFocusTimeout && i2.clearPreventFocusTimeout(), i2.setState({ preventFocus: true }, function() {
        i2.preventFocusTimeout = setTimeout(function() {
          i2.setFocus(), i2.setState({ preventFocus: false });
        });
      });
    }), ye(we(i2), "cancelFocusInput", function() {
      clearTimeout(i2.inputFocusTimeout), i2.inputFocusTimeout = null;
    }), ye(we(i2), "deferFocusInput", function() {
      i2.cancelFocusInput(), i2.inputFocusTimeout = setTimeout(function() {
        return i2.setFocus();
      }, 1);
    }), ye(we(i2), "handleDropdownFocus", function() {
      i2.cancelFocusInput();
    }), ye(we(i2), "handleBlur", function(e3) {
      (!i2.state.open || i2.props.withPortal || i2.props.showTimeInput) && i2.props.onBlur(e3), i2.setState({ focused: false });
    }), ye(we(i2), "handleCalendarClickOutside", function(e3) {
      i2.props.inline || i2.setOpen(false), i2.props.onClickOutside(e3), i2.props.withPortal && e3.preventDefault();
    }), ye(we(i2), "handleChange", function() {
      for (var e3 = arguments.length, t5 = new Array(e3), r2 = 0; r2 < e3; r2++) t5[r2] = arguments[r2];
      var n = t5[0];
      if (!i2.props.onChangeRaw || (i2.props.onChangeRaw.apply(we(i2), t5), "function" == typeof n.isDefaultPrevented && !n.isDefaultPrevented())) {
        i2.setState({ inputValue: n.target.value, lastPreSelectChange: tr });
        var o, a4, s4, p, c2, l, d3, u2, h3 = (o = n.target.value, a4 = i2.props.dateFormat, s4 = i2.props.locale, p = i2.props.strictParsing, c2 = i2.props.minDate, l = null, d3 = Ge(s4) || Ge($e()), u2 = true, Array.isArray(a4) ? (a4.forEach(function(e4) {
          var t6 = parse(o, e4, /* @__PURE__ */ new Date(), { locale: d3 });
          p && (u2 = Te(t6, c2) && o === Ie(t6, e4, s4)), Te(t6, c2) && u2 && (l = t6);
        }), l) : (l = parse(o, a4, /* @__PURE__ */ new Date(), { locale: d3 }), p ? u2 = Te(l) && o === Ie(l, a4, s4) : Te(l) || (a4 = a4.match(xe).map(function(e4) {
          var t6 = e4[0];
          return "p" === t6 || "P" === t6 ? d3 ? (0, Ee[t6])(e4, d3.formatLong) : t6 : e4;
        }).join(""), o.length > 0 && (l = parse(o, a4.slice(0, o.length), /* @__PURE__ */ new Date())), Te(l) || (l = new Date(o))), Te(l) && u2 ? l : null));
        i2.props.showTimeSelectOnly && i2.props.selected && h3 && !je(h3, i2.props.selected) && (h3 = set(i2.props.selected, { hours: getHours(h3), minutes: getMinutes(h3), seconds: getSeconds(h3) })), !h3 && n.target.value || (i2.props.showWeekPicker && (h3 = Le(h3, i2.props.locale, i2.props.calendarStartDay)), i2.setSelected(h3, n, true));
      }
    }), ye(we(i2), "handleSelect", function(e3, t5, r2) {
      if (i2.props.shouldCloseOnSelect && !i2.props.showTimeSelect && i2.sendFocusBackToInput(), i2.props.onChangeRaw && i2.props.onChangeRaw(t5), i2.props.showWeekPicker && (e3 = Le(e3, i2.props.locale, i2.props.calendarStartDay)), i2.setSelected(e3, t5, false, r2), i2.props.showDateSelect && i2.setState({ isRenderAriaLiveMessage: true }), !i2.props.shouldCloseOnSelect || i2.props.showTimeSelect) i2.setPreSelection(e3);
      else if (!i2.props.inline) {
        i2.props.selectsRange || i2.setOpen(false);
        var n = i2.props, o = n.startDate, a4 = n.endDate;
        !o || a4 || isBefore(e3, o) || i2.setOpen(false);
      }
    }), ye(we(i2), "setSelected", function(e3, t5, r2, n) {
      var o = e3;
      if (i2.props.showYearPicker) {
        if (null !== o && at(getYear(o), i2.props)) return;
      } else if (i2.props.showMonthYearPicker) {
        if (null !== o && tt(o, i2.props)) return;
      } else if (null !== o && Ze(o, i2.props)) return;
      var a4 = i2.props, s4 = a4.onChange, p = a4.selectsRange, c2 = a4.startDate, l = a4.endDate;
      if (!Ve(i2.props.selected, o) || i2.props.allowSameDay || p) if (null !== o && (!i2.props.selected || r2 && (i2.props.showTimeSelect || i2.props.showTimeSelectOnly || i2.props.showTimeInput) || (o = Re(o, { hour: getHours(i2.props.selected), minute: getMinutes(i2.props.selected), second: getSeconds(i2.props.selected) })), i2.props.inline || i2.setState({ preSelection: o }), i2.props.focusSelectedMonth || i2.setState({ monthSelectedIn: n })), p) {
        var d3 = c2 && !l, u2 = c2 && l;
        !c2 && !l ? s4([o, null], t5) : d3 && (isBefore(o, c2) ? s4([o, null], t5) : s4([c2, o], t5)), u2 && s4([o, null], t5);
      } else s4(o, t5);
      r2 || (i2.props.onSelect(o, t5), i2.setState({ inputValue: null }));
    }), ye(we(i2), "setPreSelection", function(e3) {
      var t5 = void 0 !== i2.props.minDate, r2 = void 0 !== i2.props.maxDate, n = true;
      if (e3) {
        i2.props.showWeekPicker && (e3 = Le(e3, i2.props.locale, i2.props.calendarStartDay));
        var o = startOfDay(e3);
        if (t5 && r2) n = qe(e3, i2.props.minDate, i2.props.maxDate);
        else if (t5) {
          var a4 = startOfDay(i2.props.minDate);
          n = isAfter(e3, a4) || Ve(o, a4);
        } else if (r2) {
          var s4 = endOfDay(i2.props.maxDate);
          n = isBefore(e3, s4) || Ve(o, s4);
        }
      }
      n && i2.setState({ preSelection: e3 });
    }), ye(we(i2), "toggleCalendar", function() {
      i2.setOpen(!i2.state.open);
    }), ye(we(i2), "handleTimeChange", function(e3) {
      var t5 = i2.props.selected ? i2.props.selected : i2.getPreSelection(), r2 = i2.props.selected ? e3 : Re(t5, { hour: getHours(e3), minute: getMinutes(e3) });
      i2.setState({ preSelection: r2 }), i2.props.onChange(r2), i2.props.shouldCloseOnSelect && (i2.sendFocusBackToInput(), i2.setOpen(false)), i2.props.showTimeInput && i2.setOpen(true), (i2.props.showTimeSelectOnly || i2.props.showTimeSelect) && i2.setState({ isRenderAriaLiveMessage: true }), i2.setState({ inputValue: null });
    }), ye(we(i2), "onInputClick", function() {
      i2.props.disabled || i2.props.readOnly || i2.setOpen(true), i2.props.onInputClick();
    }), ye(we(i2), "onInputKeyDown", function(e3) {
      i2.props.onKeyDown(e3);
      var t5 = e3.key;
      if (i2.state.open || i2.props.inline || i2.props.preventOpenOnFocus) {
        if (i2.state.open) {
          if ("ArrowDown" === t5 || "ArrowUp" === t5) {
            e3.preventDefault();
            var r2 = i2.props.showWeekPicker && i2.props.showWeekNumbers ? '.react-datepicker__week-number[tabindex="0"]' : '.react-datepicker__day[tabindex="0"]', n = i2.calendar.componentNode && i2.calendar.componentNode.querySelector(r2);
            return void (n && n.focus({ preventScroll: true }));
          }
          var o = Ye(i2.state.preSelection);
          "Enter" === t5 ? (e3.preventDefault(), i2.inputOk() && i2.state.lastPreSelectChange === rr ? (i2.handleSelect(o, e3), !i2.props.shouldCloseOnSelect && i2.setPreSelection(o)) : i2.setOpen(false)) : "Escape" === t5 ? (e3.preventDefault(), i2.sendFocusBackToInput(), i2.setOpen(false)) : "Tab" === t5 && i2.setOpen(false), i2.inputOk() || i2.props.onInputError({ code: 1, msg: Zt });
        }
      } else "ArrowDown" !== t5 && "ArrowUp" !== t5 && "Enter" !== t5 || i2.onInputClick();
    }), ye(we(i2), "onPortalKeyDown", function(e3) {
      "Escape" === e3.key && (e3.preventDefault(), i2.setState({ preventFocus: true }, function() {
        i2.setOpen(false), setTimeout(function() {
          i2.setFocus(), i2.setState({ preventFocus: false });
        });
      }));
    }), ye(we(i2), "onDayKeyDown", function(e3) {
      i2.props.onKeyDown(e3);
      var t5 = e3.key, r2 = Ye(i2.state.preSelection);
      if ("Enter" === t5) e3.preventDefault(), i2.handleSelect(r2, e3), !i2.props.shouldCloseOnSelect && i2.setPreSelection(r2);
      else if ("Escape" === t5) e3.preventDefault(), i2.setOpen(false), i2.inputOk() || i2.props.onInputError({ code: 1, msg: Zt });
      else if (!i2.props.disabledKeyboardNavigation) {
        var n;
        switch (t5) {
          case "ArrowLeft":
            n = i2.props.showWeekPicker ? subWeeks(r2, 1) : subDays(r2, 1);
            break;
          case "ArrowRight":
            n = i2.props.showWeekPicker ? addWeeks(r2, 1) : addDays(r2, 1);
            break;
          case "ArrowUp":
            n = subWeeks(r2, 1);
            break;
          case "ArrowDown":
            n = addWeeks(r2, 1);
            break;
          case "PageUp":
            n = subMonths(r2, 1);
            break;
          case "PageDown":
            n = addMonths(r2, 1);
            break;
          case "Home":
            n = subYears(r2, 1);
            break;
          case "End":
            n = addYears(r2, 1);
            break;
          default:
            n = null;
        }
        if (!n) return void (i2.props.onInputError && i2.props.onInputError({ code: 1, msg: Zt }));
        if (e3.preventDefault(), i2.setState({ lastPreSelectChange: rr }), i2.props.adjustDateOnChange && i2.setSelected(n), i2.setPreSelection(n), i2.props.inline) {
          var o = getMonth(r2), a4 = getMonth(n), s4 = getYear(r2), d3 = getYear(n);
          o !== a4 || s4 !== d3 ? i2.setState({ shouldFocusDayInline: true }) : i2.setState({ shouldFocusDayInline: false });
        }
      }
    }), ye(we(i2), "onPopperKeyDown", function(e3) {
      "Escape" === e3.key && (e3.preventDefault(), i2.sendFocusBackToInput());
    }), ye(we(i2), "onClearClick", function(e3) {
      e3 && e3.preventDefault && e3.preventDefault(), i2.sendFocusBackToInput(), i2.props.selectsRange ? i2.props.onChange([null, null], e3) : i2.props.onChange(null, e3), i2.setState({ inputValue: null });
    }), ye(we(i2), "clear", function() {
      i2.onClearClick();
    }), ye(we(i2), "onScroll", function(e3) {
      "boolean" == typeof i2.props.closeOnScroll && i2.props.closeOnScroll ? e3.target !== document && e3.target !== document.documentElement && e3.target !== document.body || i2.setOpen(false) : "function" == typeof i2.props.closeOnScroll && i2.props.closeOnScroll(e3) && i2.setOpen(false);
    }), ye(we(i2), "renderCalendar", function() {
      return i2.props.inline || i2.isCalendarOpen() ? import_react2.default.createElement(Xt, { ref: function(e3) {
        i2.calendar = e3;
      }, locale: i2.props.locale, calendarStartDay: i2.props.calendarStartDay, chooseDayAriaLabelPrefix: i2.props.chooseDayAriaLabelPrefix, disabledDayAriaLabelPrefix: i2.props.disabledDayAriaLabelPrefix, weekAriaLabelPrefix: i2.props.weekAriaLabelPrefix, monthAriaLabelPrefix: i2.props.monthAriaLabelPrefix, adjustDateOnChange: i2.props.adjustDateOnChange, setOpen: i2.setOpen, shouldCloseOnSelect: i2.props.shouldCloseOnSelect, dateFormat: i2.props.dateFormatCalendar, useWeekdaysShort: i2.props.useWeekdaysShort, formatWeekDay: i2.props.formatWeekDay, dropdownMode: i2.props.dropdownMode, selected: i2.props.selected, preSelection: i2.state.preSelection, onSelect: i2.handleSelect, onWeekSelect: i2.props.onWeekSelect, openToDate: i2.props.openToDate, minDate: i2.props.minDate, maxDate: i2.props.maxDate, selectsStart: i2.props.selectsStart, selectsEnd: i2.props.selectsEnd, selectsRange: i2.props.selectsRange, startDate: i2.props.startDate, endDate: i2.props.endDate, excludeDates: i2.props.excludeDates, excludeDateIntervals: i2.props.excludeDateIntervals, filterDate: i2.props.filterDate, onClickOutside: i2.handleCalendarClickOutside, formatWeekNumber: i2.props.formatWeekNumber, highlightDates: i2.state.highlightDates, holidays: Dt(i2.modifyHolidays()), includeDates: i2.props.includeDates, includeDateIntervals: i2.props.includeDateIntervals, includeTimes: i2.props.includeTimes, injectTimes: i2.props.injectTimes, inline: i2.props.inline, shouldFocusDayInline: i2.state.shouldFocusDayInline, peekNextMonth: i2.props.peekNextMonth, showMonthDropdown: i2.props.showMonthDropdown, showPreviousMonths: i2.props.showPreviousMonths, useShortMonthInDropdown: i2.props.useShortMonthInDropdown, showMonthYearDropdown: i2.props.showMonthYearDropdown, showWeekNumbers: i2.props.showWeekNumbers, showYearDropdown: i2.props.showYearDropdown, withPortal: i2.props.withPortal, forceShowMonthNavigation: i2.props.forceShowMonthNavigation, showDisabledMonthNavigation: i2.props.showDisabledMonthNavigation, scrollableYearDropdown: i2.props.scrollableYearDropdown, scrollableMonthYearDropdown: i2.props.scrollableMonthYearDropdown, todayButton: i2.props.todayButton, weekLabel: i2.props.weekLabel, outsideClickIgnoreClass: Jt, fixedHeight: i2.props.fixedHeight, monthsShown: i2.props.monthsShown, monthSelectedIn: i2.state.monthSelectedIn, onDropdownFocus: i2.handleDropdownFocus, onMonthChange: i2.props.onMonthChange, onYearChange: i2.props.onYearChange, dayClassName: i2.props.dayClassName, weekDayClassName: i2.props.weekDayClassName, monthClassName: i2.props.monthClassName, timeClassName: i2.props.timeClassName, showDateSelect: i2.props.showDateSelect, showTimeSelect: i2.props.showTimeSelect, showTimeSelectOnly: i2.props.showTimeSelectOnly, onTimeChange: i2.handleTimeChange, timeFormat: i2.props.timeFormat, timeIntervals: i2.props.timeIntervals, minTime: i2.props.minTime, maxTime: i2.props.maxTime, excludeTimes: i2.props.excludeTimes, filterTime: i2.props.filterTime, timeCaption: i2.props.timeCaption, className: i2.props.calendarClassName, container: i2.props.calendarContainer, yearItemNumber: i2.props.yearItemNumber, yearDropdownItemNumber: i2.props.yearDropdownItemNumber, previousMonthAriaLabel: i2.props.previousMonthAriaLabel, previousMonthButtonLabel: i2.props.previousMonthButtonLabel, nextMonthAriaLabel: i2.props.nextMonthAriaLabel, nextMonthButtonLabel: i2.props.nextMonthButtonLabel, previousYearAriaLabel: i2.props.previousYearAriaLabel, previousYearButtonLabel: i2.props.previousYearButtonLabel, nextYearAriaLabel: i2.props.nextYearAriaLabel, nextYearButtonLabel: i2.props.nextYearButtonLabel, timeInputLabel: i2.props.timeInputLabel, disabledKeyboardNavigation: i2.props.disabledKeyboardNavigation, renderCustomHeader: i2.props.renderCustomHeader, popperProps: i2.props.popperProps, renderDayContents: i2.props.renderDayContents, renderMonthContent: i2.props.renderMonthContent, renderQuarterContent: i2.props.renderQuarterContent, renderYearContent: i2.props.renderYearContent, onDayMouseEnter: i2.props.onDayMouseEnter, onMonthMouseLeave: i2.props.onMonthMouseLeave, onYearMouseEnter: i2.props.onYearMouseEnter, onYearMouseLeave: i2.props.onYearMouseLeave, selectsDisabledDaysInRange: i2.props.selectsDisabledDaysInRange, showTimeInput: i2.props.showTimeInput, showMonthYearPicker: i2.props.showMonthYearPicker, showFullMonthYearPicker: i2.props.showFullMonthYearPicker, showTwoColumnMonthYearPicker: i2.props.showTwoColumnMonthYearPicker, showFourColumnMonthYearPicker: i2.props.showFourColumnMonthYearPicker, showYearPicker: i2.props.showYearPicker, showQuarterYearPicker: i2.props.showQuarterYearPicker, showWeekPicker: i2.props.showWeekPicker, showPopperArrow: i2.props.showPopperArrow, excludeScrollbar: i2.props.excludeScrollbar, handleOnKeyDown: i2.props.onKeyDown, handleOnDayKeyDown: i2.onDayKeyDown, isInputFocused: i2.state.focused, customTimeInput: i2.props.customTimeInput, setPreSelection: i2.setPreSelection }, i2.props.children) : null;
    }), ye(we(i2), "renderAriaLiveRegion", function() {
      var t5, r2 = i2.props, n = r2.dateFormat, o = r2.locale, a4 = i2.props.showTimeInput || i2.props.showTimeSelect ? "PPPPp" : "PPPP";
      return t5 = i2.props.selectsRange ? "Selected start date: ".concat(Oe(i2.props.startDate, { dateFormat: a4, locale: o }), ". ").concat(i2.props.endDate ? "End date: " + Oe(i2.props.endDate, { dateFormat: a4, locale: o }) : "") : i2.props.showTimeSelectOnly ? "Selected time: ".concat(Oe(i2.props.selected, { dateFormat: n, locale: o })) : i2.props.showYearPicker ? "Selected year: ".concat(Oe(i2.props.selected, { dateFormat: "yyyy", locale: o })) : i2.props.showMonthYearPicker ? "Selected month: ".concat(Oe(i2.props.selected, { dateFormat: "MMMM yyyy", locale: o })) : i2.props.showQuarterYearPicker ? "Selected quarter: ".concat(Oe(i2.props.selected, { dateFormat: "yyyy, QQQ", locale: o })) : "Selected date: ".concat(Oe(i2.props.selected, { dateFormat: a4, locale: o })), import_react2.default.createElement("span", { role: "alert", "aria-live": "polite", className: "react-datepicker__aria-live" }, t5);
    }), ye(we(i2), "renderDateInput", function() {
      var t5, n = (0, import_classnames.default)(i2.props.className, ye({}, Jt, i2.state.open)), o = i2.props.customInput || import_react2.default.createElement("input", { type: "text" }), a4 = i2.props.customInputRef || "ref", s4 = "string" == typeof i2.props.value ? i2.props.value : "string" == typeof i2.state.inputValue ? i2.state.inputValue : i2.props.selectsRange ? function(e3, t6, r2) {
        if (!e3) return "";
        var n2 = Oe(e3, r2), o2 = t6 ? Oe(t6, r2) : "";
        return "".concat(n2, " - ").concat(o2);
      }(i2.props.startDate, i2.props.endDate, i2.props) : Oe(i2.props.selected, i2.props);
      return import_react2.default.cloneElement(o, (ye(ye(ye(ye(ye(ye(ye(ye(ye(ye(t5 = {}, a4, function(e3) {
        i2.input = e3;
      }), "value", s4), "onBlur", i2.handleBlur), "onChange", i2.handleChange), "onClick", i2.onInputClick), "onFocus", i2.handleFocus), "onKeyDown", i2.onInputKeyDown), "id", i2.props.id), "name", i2.props.name), "form", i2.props.form), ye(ye(ye(ye(ye(ye(ye(ye(ye(ye(t5, "autoFocus", i2.props.autoFocus), "placeholder", i2.props.placeholderText), "disabled", i2.props.disabled), "autoComplete", i2.props.autoComplete), "className", (0, import_classnames.default)(o.props.className, n)), "title", i2.props.title), "readOnly", i2.props.readOnly), "required", i2.props.required), "tabIndex", i2.props.tabIndex), "aria-describedby", i2.props.ariaDescribedBy), ye(ye(ye(t5, "aria-invalid", i2.props.ariaInvalid), "aria-labelledby", i2.props.ariaLabelledBy), "aria-required", i2.props.ariaRequired)));
    }), ye(we(i2), "renderClearButton", function() {
      var t5 = i2.props, n = t5.isClearable, o = t5.disabled, a4 = t5.selected, s4 = t5.startDate, p = t5.endDate, c2 = t5.clearButtonTitle, l = t5.clearButtonClassName, d3 = void 0 === l ? "" : l, u2 = t5.ariaLabelClose, h3 = void 0 === u2 ? "Close" : u2;
      return !n || null == a4 && null == s4 && null == p ? null : import_react2.default.createElement("button", { type: "button", className: (0, import_classnames.default)("react-datepicker__close-icon", d3, { "react-datepicker__close-icon--disabled": o }), disabled: o, "aria-label": h3, onClick: i2.onClearClick, title: c2, tabIndex: -1 });
    }), i2.state = i2.calcInitialState(), i2.preventFocusTimeout = null, i2;
  }
  return fe(s3, [{ key: "componentDidMount", value: function() {
    window.addEventListener("scroll", this.onScroll, true);
  } }, { key: "componentDidUpdate", value: function(e3, t4) {
    var r2, n;
    e3.inline && (r2 = e3.selected, n = this.props.selected, r2 && n ? getMonth(r2) !== getMonth(n) || getYear(r2) !== getYear(n) : r2 !== n) && this.setPreSelection(this.props.selected), void 0 !== this.state.monthSelectedIn && e3.monthsShown !== this.props.monthsShown && this.setState({ monthSelectedIn: 0 }), e3.highlightDates !== this.props.highlightDates && this.setState({ highlightDates: vt(this.props.highlightDates) }), t4.focused || Ve(e3.selected, this.props.selected) || this.setState({ inputValue: null }), t4.open !== this.state.open && (false === t4.open && true === this.state.open && this.props.onCalendarOpen(), true === t4.open && false === this.state.open && this.props.onCalendarClose());
  } }, { key: "componentWillUnmount", value: function() {
    this.clearPreventFocusTimeout(), window.removeEventListener("scroll", this.onScroll, true);
  } }, { key: "renderInputContainer", value: function() {
    var t4 = this.props, r2 = t4.showIcon, n = t4.icon, o = t4.calendarIconClassname, a4 = t4.toggleCalendarOnIconClick, s4 = this.state.open;
    return import_react2.default.createElement("div", { className: "react-datepicker__input-container".concat(r2 ? " react-datepicker__view-calendar-icon" : "") }, r2 && import_react2.default.createElement(qt, ve({ icon: n, className: "".concat(o, " ").concat(s4 && "react-datepicker-ignore-onclickoutside") }, a4 ? { onClick: this.toggleCalendar } : null)), this.state.isRenderAriaLiveMessage && this.renderAriaLiveRegion(), this.renderDateInput(), this.renderClearButton());
  } }, { key: "render", value: function() {
    var t4 = this.renderCalendar();
    if (this.props.inline) return t4;
    if (this.props.withPortal) {
      var r2 = this.state.open ? import_react2.default.createElement($t, { enableTabLoop: this.props.enableTabLoop }, import_react2.default.createElement("div", { className: "react-datepicker__portal", tabIndex: -1, onKeyDown: this.onPortalKeyDown }, t4)) : null;
      return this.state.open && this.props.portalId && (r2 = import_react2.default.createElement(Ut, { portalId: this.props.portalId, portalHost: this.props.portalHost }, r2)), import_react2.default.createElement("div", null, this.renderInputContainer(), r2);
    }
    return import_react2.default.createElement(Gt, { className: this.props.popperClassName, wrapperClassName: this.props.wrapperClassName, hidePopper: !this.isCalendarOpen(), portalId: this.props.portalId, portalHost: this.props.portalHost, popperModifiers: this.props.popperModifiers, targetComponent: this.renderInputContainer(), popperContainer: this.props.popperContainer, popperComponent: t4, popperPlacement: this.props.popperPlacement, popperProps: this.props.popperProps, popperOnKeyDown: this.onPopperKeyDown, enableTabLoop: this.props.enableTabLoop });
  } }], [{ key: "defaultProps", get: function() {
    return { allowSameDay: false, dateFormat: "MM/dd/yyyy", dateFormatCalendar: "LLLL yyyy", onChange: function() {
    }, disabled: false, disabledKeyboardNavigation: false, dropdownMode: "scroll", onFocus: function() {
    }, onBlur: function() {
    }, onKeyDown: function() {
    }, onInputClick: function() {
    }, onSelect: function() {
    }, onClickOutside: function() {
    }, onMonthChange: function() {
    }, onCalendarOpen: function() {
    }, onCalendarClose: function() {
    }, preventOpenOnFocus: false, onYearChange: function() {
    }, onInputError: function() {
    }, monthsShown: 1, readOnly: false, withPortal: false, selectsDisabledDaysInRange: false, shouldCloseOnSelect: true, showTimeSelect: false, showTimeInput: false, showPreviousMonths: false, showMonthYearPicker: false, showFullMonthYearPicker: false, showTwoColumnMonthYearPicker: false, showFourColumnMonthYearPicker: false, showYearPicker: false, showQuarterYearPicker: false, showWeekPicker: false, strictParsing: false, timeIntervals: 30, timeCaption: "Time", previousMonthAriaLabel: "Previous Month", previousMonthButtonLabel: "Previous Month", nextMonthAriaLabel: "Next Month", nextMonthButtonLabel: "Next Month", previousYearAriaLabel: "Previous Year", previousYearButtonLabel: "Previous Year", nextYearAriaLabel: "Next Year", nextYearButtonLabel: "Next Year", timeInputLabel: "Time", enableTabLoop: true, yearItemNumber: Ne, focusSelectedMonth: false, showPopperArrow: true, excludeScrollbar: true, customTimeInput: null, calendarStartDay: void 0, toggleCalendarOnIconClick: false };
  } }]), s3;
}();
var tr = "input";
var rr = "navigate";
export {
  Ht as CalendarContainer,
  er as default,
  $e as getDefaultLocale,
  Ue as registerLocale,
  ze as setDefaultLocale
};
/*! Bundled license information:

classnames/index.js:
  (*!
  	Copyright (c) 2018 Jed Watson.
  	Licensed under the MIT License (MIT), see
  	http://jedwatson.github.io/classnames
  *)
*/
//# sourceMappingURL=react-datepicker.js.map
