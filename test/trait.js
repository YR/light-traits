(function(root) {
	// Load or return cached version of requested module with id 'path' or 'path/index'
	// @param {String} path
	// @return {Object}
	function require (path) {
		// Convert relative path to absolute for cases where 'require' has not been resolved
		// called from outside of a module, for example
		if (!this.module && path.charAt(0) == '.') {
			path = path.slice((path.indexOf('..') === 0) ? 3 : 2);
		}
		// Check with/without root package (need to handle node_modules differently)
		var paths = [path, path.slice(path.indexOf('/') + 1)]
			, m;
		// Find in cache
		for (var i = 0, n = paths.length; i < n; i++) {
			path = paths[i];
			m = require.modules[path] || require.modules[path + '/index'];
			if (m) break;
		}
		if (!m) {
			throw "Couldn't find module for: " + path;
		}
		// Instantiate the module if it's export object is not yet defined
		if (!m.exports) {
			// Convert 'lazy' evaluated string to Function
			if ('string' == typeof m) {
				m = require.modules[path] = new Function('module', 'exports', 'require', m);
			}
			m.exports = {};
			m.filename = path;
			m.call(this, m, m.exports, require.relative(path));
		}
		// Return the exports object
		return m.exports;
	}

	// Cache of module objects
	require.modules = {};

	// Resolve 'to' an absolute path
	// @param {String} curr
	// @param {String} path
	// @return {String}
	require.resolve = function(from, to) {
		var fromSegs = from.split('/')
			, seg;

		// Non relative path
		if (to.charAt(0) != '.') return to;

		// Don't strip root paths (handled specially in require())
		if (fromSegs.length > 1) fromSegs.pop();
		to = to.split('/');
		// Use 'from' path segments to resolve relative 'to' path
		for (var i = 0; i < to.length; ++i) {
			seg = to[i];
			if (seg == '..') {
				fromSegs.pop();
			} else if (seg != '.') {
				fromSegs.push(seg);
			}
		}
		return fromSegs.join('/');
	};

	// Partial completion of the module's inner 'require' function
	// @param {String} path
	// @return {Object}
	require.relative = function(path) {
		return function(p) {
			return require(require.resolve(path, p));
		};
	};

	// Register a module with id of 'path' and callback of 'fn'
	// @param {String} path
	// @param {Function} fn [signature should be of type (module, exports, require)]
	require.register = function(path, fn) {
		require.modules[path] = fn;
	};

	// Expose
	root.require = require;
})(window != null ? window : global);

require.register('lodash._isnative', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /** Used to detect if a method is native */
  var reNative = RegExp('^' +
    String(toString)
      .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      .replace(/toString| for [^\]]+/g, '.*?') + '$'
  );
  
  /**
   * Checks if `value` is a native function.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
   */
  function isNative(value) {
    return typeof value == 'function' && reNative.test(value);
  }
  
  module.exports = isNative;
  
});
require.register('lodash._objecttypes', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used to determine if values are of the language type Object */
  var objectTypes = {
    'boolean': false,
    'function': true,
    'object': true,
    'number': false,
    'string': false,
    'undefined': false
  };
  
  module.exports = objectTypes;
  
});
require.register('lodash.isobject', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var objectTypes = require('lodash._objecttypes');
  
  /**
   * Checks if `value` is the language type of Object.
   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(1);
   * // => false
   */
  function isObject(value) {
    // check if the value is the ECMAScript language type of Object
    // http://es5.github.io/#x8
    // and avoid a V8 bug
    // http://code.google.com/p/v8/issues/detail?id=2291
    return !!(value && objectTypes[typeof value]);
  }
  
  module.exports = isObject;
  
});
require.register('lodash.noop', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * A no-operation function.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @example
   *
   * var object = { 'name': 'fred' };
   * _.noop(object) === undefined;
   * // => true
   */
  function noop() {
    // no operation performed
  }
  
  module.exports = noop;
  
});
require.register('lodash._basecreate', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash._isnative'),
      isObject = require('lodash.isobject'),
      noop = require('lodash.noop');
  
  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate;
  
  /**
   * The base implementation of `_.create` without support for assigning
   * properties to the created object.
   *
   * @private
   * @param {Object} prototype The object to inherit from.
   * @returns {Object} Returns the new object.
   */
  function baseCreate(prototype, properties) {
    return isObject(prototype) ? nativeCreate(prototype) : {};
  }
  // fallback for browsers without `Object.create`
  if (!nativeCreate) {
    baseCreate = (function() {
      function Object() {}
      return function(prototype) {
        if (isObject(prototype)) {
          Object.prototype = prototype;
          var result = new Object;
          Object.prototype = null;
        }
        return result || global.Object();
      };
    }());
  }
  
  module.exports = baseCreate;
  
});
require.register('lodash._setbinddata', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash._isnative'),
      noop = require('lodash.noop');
  
  /** Used as the property descriptor for `__bindData__` */
  var descriptor = {
    'configurable': false,
    'enumerable': false,
    'value': null,
    'writable': false
  };
  
  /** Used to set meta data on functions */
  var defineProperty = (function() {
    // IE 8 only accepts DOM elements
    try {
      var o = {},
          func = isNative(func = Object.defineProperty) && func,
          result = func(o, o, o) && func;
    } catch(e) { }
    return result;
  }());
  
  /**
   * Sets `this` binding data on a given function.
   *
   * @private
   * @param {Function} func The function to set data on.
   * @param {Array} value The data array to set.
   */
  var setBindData = !defineProperty ? noop : function(func, value) {
    descriptor.value = value;
    defineProperty(func, '__bindData__', descriptor);
  };
  
  module.exports = setBindData;
  
});
require.register('lodash._slice', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * Slices the `collection` from the `start` index up to, but not including,
   * the `end` index.
   *
   * Note: This function is used instead of `Array#slice` to support node lists
   * in IE < 9 and to ensure dense arrays are returned.
   *
   * @private
   * @param {Array|Object|string} collection The collection to slice.
   * @param {number} start The start index.
   * @param {number} end The end index.
   * @returns {Array} Returns the new array.
   */
  function slice(array, start, end) {
    start || (start = 0);
    if (typeof end == 'undefined') {
      end = array ? array.length : 0;
    }
    var index = -1,
        length = end - start || 0,
        result = Array(length < 0 ? 0 : length);
  
    while (++index < length) {
      result[index] = array[start + index];
    }
    return result;
  }
  
  module.exports = slice;
  
});
require.register('lodash._basebind', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreate = require('lodash._basecreate'),
      isObject = require('lodash.isobject'),
      setBindData = require('lodash._setbinddata'),
      slice = require('lodash._slice');
  
  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];
  
  /** Native method shortcuts */
  var push = arrayRef.push;
  
  /**
   * The base implementation of `_.bind` that creates the bound function and
   * sets its meta data.
   *
   * @private
   * @param {Array} bindData The bind data array.
   * @returns {Function} Returns the new bound function.
   */
  function baseBind(bindData) {
    var func = bindData[0],
        partialArgs = bindData[2],
        thisArg = bindData[4];
  
    function bound() {
      // `Function#bind` spec
      // http://es5.github.io/#x15.3.4.5
      if (partialArgs) {
        // avoid `arguments` object deoptimizations by using `slice` instead
        // of `Array.prototype.slice.call` and not assigning `arguments` to a
        // variable as a ternary expression
        var args = slice(partialArgs);
        push.apply(args, arguments);
      }
      // mimic the constructor's `return` behavior
      // http://es5.github.io/#x13.2.2
      if (this instanceof bound) {
        // ensure `new bound` is an instance of `func`
        var thisBinding = baseCreate(func.prototype),
            result = func.apply(thisBinding, args || arguments);
        return isObject(result) ? result : thisBinding;
      }
      return func.apply(thisArg, args || arguments);
    }
    setBindData(bound, bindData);
    return bound;
  }
  
  module.exports = baseBind;
  
});
require.register('lodash._basecreatewrapper', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreate = require('lodash._basecreate'),
      isObject = require('lodash.isobject'),
      setBindData = require('lodash._setbinddata'),
      slice = require('lodash._slice');
  
  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];
  
  /** Native method shortcuts */
  var push = arrayRef.push;
  
  /**
   * The base implementation of `createWrapper` that creates the wrapper and
   * sets its meta data.
   *
   * @private
   * @param {Array} bindData The bind data array.
   * @returns {Function} Returns the new function.
   */
  function baseCreateWrapper(bindData) {
    var func = bindData[0],
        bitmask = bindData[1],
        partialArgs = bindData[2],
        partialRightArgs = bindData[3],
        thisArg = bindData[4],
        arity = bindData[5];
  
    var isBind = bitmask & 1,
        isBindKey = bitmask & 2,
        isCurry = bitmask & 4,
        isCurryBound = bitmask & 8,
        key = func;
  
    function bound() {
      var thisBinding = isBind ? thisArg : this;
      if (partialArgs) {
        var args = slice(partialArgs);
        push.apply(args, arguments);
      }
      if (partialRightArgs || isCurry) {
        args || (args = slice(arguments));
        if (partialRightArgs) {
          push.apply(args, partialRightArgs);
        }
        if (isCurry && args.length < arity) {
          bitmask |= 16 & ~32;
          return baseCreateWrapper([func, (isCurryBound ? bitmask : bitmask & ~3), args, null, thisArg, arity]);
        }
      }
      args || (args = arguments);
      if (isBindKey) {
        func = thisBinding[key];
      }
      if (this instanceof bound) {
        thisBinding = baseCreate(func.prototype);
        var result = func.apply(thisBinding, args);
        return isObject(result) ? result : thisBinding;
      }
      return func.apply(thisBinding, args);
    }
    setBindData(bound, bindData);
    return bound;
  }
  
  module.exports = baseCreateWrapper;
  
});
require.register('lodash.isfunction', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * Checks if `value` is a function.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   */
  function isFunction(value) {
    return typeof value == 'function';
  }
  
  module.exports = isFunction;
  
});
require.register('lodash._createwrapper', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseBind = require('lodash._basebind'),
      baseCreateWrapper = require('lodash._basecreatewrapper'),
      isFunction = require('lodash.isfunction'),
      slice = require('lodash._slice');
  
  /**
   * Used for `Array` method references.
   *
   * Normally `Array.prototype` would suffice, however, using an array literal
   * avoids issues in Narwhal.
   */
  var arrayRef = [];
  
  /** Native method shortcuts */
  var push = arrayRef.push,
      unshift = arrayRef.unshift;
  
  /**
   * Creates a function that, when called, either curries or invokes `func`
   * with an optional `this` binding and partially applied arguments.
   *
   * @private
   * @param {Function|string} func The function or method name to reference.
   * @param {number} bitmask The bitmask of method flags to compose.
   *  The bitmask may be composed of the following flags:
   *  1 - `_.bind`
   *  2 - `_.bindKey`
   *  4 - `_.curry`
   *  8 - `_.curry` (bound)
   *  16 - `_.partial`
   *  32 - `_.partialRight`
   * @param {Array} [partialArgs] An array of arguments to prepend to those
   *  provided to the new function.
   * @param {Array} [partialRightArgs] An array of arguments to append to those
   *  provided to the new function.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {number} [arity] The arity of `func`.
   * @returns {Function} Returns the new function.
   */
  function createWrapper(func, bitmask, partialArgs, partialRightArgs, thisArg, arity) {
    var isBind = bitmask & 1,
        isBindKey = bitmask & 2,
        isCurry = bitmask & 4,
        isCurryBound = bitmask & 8,
        isPartial = bitmask & 16,
        isPartialRight = bitmask & 32;
  
    if (!isBindKey && !isFunction(func)) {
      throw new TypeError;
    }
    if (isPartial && !partialArgs.length) {
      bitmask &= ~16;
      isPartial = partialArgs = false;
    }
    if (isPartialRight && !partialRightArgs.length) {
      bitmask &= ~32;
      isPartialRight = partialRightArgs = false;
    }
    var bindData = func && func.__bindData__;
    if (bindData && bindData !== true) {
      // clone `bindData`
      bindData = slice(bindData);
      if (bindData[2]) {
        bindData[2] = slice(bindData[2]);
      }
      if (bindData[3]) {
        bindData[3] = slice(bindData[3]);
      }
      // set `thisBinding` is not previously bound
      if (isBind && !(bindData[1] & 1)) {
        bindData[4] = thisArg;
      }
      // set if previously bound but not currently (subsequent curried functions)
      if (!isBind && bindData[1] & 1) {
        bitmask |= 8;
      }
      // set curried arity if not yet set
      if (isCurry && !(bindData[1] & 4)) {
        bindData[5] = arity;
      }
      // append partial left arguments
      if (isPartial) {
        push.apply(bindData[2] || (bindData[2] = []), partialArgs);
      }
      // append partial right arguments
      if (isPartialRight) {
        unshift.apply(bindData[3] || (bindData[3] = []), partialRightArgs);
      }
      // merge flags
      bindData[1] |= bitmask;
      return createWrapper.apply(null, bindData);
    }
    // fast path for `_.bind`
    var creater = (bitmask == 1 || bitmask === 17) ? baseBind : baseCreateWrapper;
    return creater([func, bitmask, partialArgs, partialRightArgs, thisArg, arity]);
  }
  
  module.exports = createWrapper;
  
});
require.register('lodash.bind', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var createWrapper = require('lodash._createwrapper'),
      slice = require('lodash._slice');
  
  /**
   * Creates a function that, when called, invokes `func` with the `this`
   * binding of `thisArg` and prepends any additional `bind` arguments to those
   * provided to the bound function.
   *
   * @static
   * @memberOf _
   * @category Functions
   * @param {Function} func The function to bind.
   * @param {*} [thisArg] The `this` binding of `func`.
   * @param {...*} [arg] Arguments to be partially applied.
   * @returns {Function} Returns the new bound function.
   * @example
   *
   * var func = function(greeting) {
   *   return greeting + ' ' + this.name;
   * };
   *
   * func = _.bind(func, { 'name': 'fred' }, 'hi');
   * func();
   * // => 'hi fred'
   */
  function bind(func, thisArg) {
    return arguments.length > 2
      ? createWrapper(func, 17, slice(arguments, 2), null, thisArg)
      : createWrapper(func, 1, null, null, thisArg);
  }
  
  module.exports = bind;
  
});
require.register('lodash.identity', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * This method returns the first argument provided to it.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'name': 'fred' };
   * _.identity(object) === object;
   * // => true
   */
  function identity(value) {
    return value;
  }
  
  module.exports = identity;
  
});
require.register('lodash.support', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash._isnative');
  
  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;
  
  /**
   * An object used to flag environments features.
   *
   * @static
   * @memberOf _
   * @type Object
   */
  var support = {};
  
  /**
   * Detect if functions can be decompiled by `Function#toString`
   * (all but PS3 and older Opera mobile browsers & avoided in Windows 8 apps).
   *
   * @memberOf _.support
   * @type boolean
   */
  support.funcDecomp = !isNative(global.WinRTError) && reThis.test(function() { return this; });
  
  /**
   * Detect if `Function#name` is supported (all but IE).
   *
   * @memberOf _.support
   * @type boolean
   */
  support.funcNames = typeof Function.name == 'string';
  
  module.exports = support;
  
});
require.register('lodash._basecreatecallback', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var bind = require('lodash.bind'),
      identity = require('lodash.identity'),
      setBindData = require('lodash._setbinddata'),
      support = require('lodash.support');
  
  /** Used to detected named functions */
  var reFuncName = /^\s*function[ \n\r\t]+\w/;
  
  /** Used to detect functions containing a `this` reference */
  var reThis = /\bthis\b/;
  
  /** Native method shortcuts */
  var fnToString = Function.prototype.toString;
  
  /**
   * The base implementation of `_.createCallback` without support for creating
   * "_.pluck" or "_.where" style callbacks.
   *
   * @private
   * @param {*} [func=identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of the created callback.
   * @param {number} [argCount] The number of arguments the callback accepts.
   * @returns {Function} Returns a callback function.
   */
  function baseCreateCallback(func, thisArg, argCount) {
    if (typeof func != 'function') {
      return identity;
    }
    // exit early for no `thisArg` or already bound by `Function#bind`
    if (typeof thisArg == 'undefined' || !('prototype' in func)) {
      return func;
    }
    var bindData = func.__bindData__;
    if (typeof bindData == 'undefined') {
      if (support.funcNames) {
        bindData = !func.name;
      }
      bindData = bindData || !support.funcDecomp;
      if (!bindData) {
        var source = fnToString.call(func);
        if (!support.funcNames) {
          bindData = !reFuncName.test(source);
        }
        if (!bindData) {
          // checks if `func` references the `this` keyword and stores the result
          bindData = reThis.test(source);
          setBindData(func, bindData);
        }
      }
    }
    // exit early if there are no `this` references or `func` is bound
    if (bindData === false || (bindData !== true && bindData[1] & 1)) {
      return func;
    }
    switch (argCount) {
      case 1: return function(value) {
        return func.call(thisArg, value);
      };
      case 2: return function(a, b) {
        return func.call(thisArg, a, b);
      };
      case 3: return function(value, index, collection) {
        return func.call(thisArg, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(thisArg, accumulator, value, index, collection);
      };
    }
    return bind(func, thisArg);
  }
  
  module.exports = baseCreateCallback;
  
});
require.register('lodash.forin', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreateCallback = require('lodash._basecreatecallback'),
      objectTypes = require('lodash._objecttypes');
  
  /**
   * Iterates over own and inherited enumerable properties of an object,
   * executing the callback for each property. The callback is bound to `thisArg`
   * and invoked with three arguments; (value, key, object). Callbacks may exit
   * iteration early by explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * function Shape() {
   *   this.x = 0;
   *   this.y = 0;
   * }
   *
   * Shape.prototype.move = function(x, y) {
   *   this.x += x;
   *   this.y += y;
   * };
   *
   * _.forIn(new Shape, function(value, key) {
   *   console.log(key);
   * });
   * // => logs 'x', 'y', and 'move' (property order is not guaranteed across environments)
   */
  var forIn = function(collection, callback, thisArg) {
    var index, iterable = collection, result = iterable;
    if (!iterable) return result;
    if (!objectTypes[typeof iterable]) return result;
    callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      for (index in iterable) {
        if (callback(iterable[index], index, collection) === false) return result;
      }
    return result
  };
  
  module.exports = forIn;
  
});
require.register('lodash._arraypool', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used to pool arrays and objects used internally */
  var arrayPool = [];
  
  module.exports = arrayPool;
  
});
require.register('lodash._getarray', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var arrayPool = require('lodash._arraypool');
  
  /**
   * Gets an array from the array pool or creates a new one if the pool is empty.
   *
   * @private
   * @returns {Array} The array from the pool.
   */
  function getArray() {
    return arrayPool.pop() || [];
  }
  
  module.exports = getArray;
  
});
require.register('lodash._maxpoolsize', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /** Used as the max size of the `arrayPool` and `objectPool` */
  var maxPoolSize = 40;
  
  module.exports = maxPoolSize;
  
});
require.register('lodash._releasearray', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var arrayPool = require('lodash._arraypool'),
      maxPoolSize = require('lodash._maxpoolsize');
  
  /**
   * Releases the given array back to the array pool.
   *
   * @private
   * @param {Array} [array] The array to release.
   */
  function releaseArray(array) {
    array.length = 0;
    if (arrayPool.length < maxPoolSize) {
      arrayPool.push(array);
    }
  }
  
  module.exports = releaseArray;
  
});
require.register('lodash._baseisequal', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var forIn = require('lodash.forin'),
      getArray = require('lodash._getarray'),
      isFunction = require('lodash.isfunction'),
      objectTypes = require('lodash._objecttypes'),
      releaseArray = require('lodash._releasearray');
  
  /** `Object#toString` result shortcuts */
  var argsClass = '[object Arguments]',
      arrayClass = '[object Array]',
      boolClass = '[object Boolean]',
      dateClass = '[object Date]',
      numberClass = '[object Number]',
      objectClass = '[object Object]',
      regexpClass = '[object RegExp]',
      stringClass = '[object String]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /** Native method shortcuts */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * The base implementation of `_.isEqual`, without support for `thisArg` binding,
   * that allows partial "_.where" style comparisons.
   *
   * @private
   * @param {*} a The value to compare.
   * @param {*} b The other value to compare.
   * @param {Function} [callback] The function to customize comparing values.
   * @param {Function} [isWhere=false] A flag to indicate performing partial comparisons.
   * @param {Array} [stackA=[]] Tracks traversed `a` objects.
   * @param {Array} [stackB=[]] Tracks traversed `b` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
    // used to indicate that when comparing objects, `a` has at least the properties of `b`
    if (callback) {
      var result = callback(a, b);
      if (typeof result != 'undefined') {
        return !!result;
      }
    }
    // exit early for identical values
    if (a === b) {
      // treat `+0` vs. `-0` as not equal
      return a !== 0 || (1 / a == 1 / b);
    }
    var type = typeof a,
        otherType = typeof b;
  
    // exit early for unlike primitive values
    if (a === a &&
        !(a && objectTypes[type]) &&
        !(b && objectTypes[otherType])) {
      return false;
    }
    // exit early for `null` and `undefined` avoiding ES3's Function#call behavior
    // http://es5.github.io/#x15.3.4.4
    if (a == null || b == null) {
      return a === b;
    }
    // compare [[Class]] names
    var className = toString.call(a),
        otherClass = toString.call(b);
  
    if (className == argsClass) {
      className = objectClass;
    }
    if (otherClass == argsClass) {
      otherClass = objectClass;
    }
    if (className != otherClass) {
      return false;
    }
    switch (className) {
      case boolClass:
      case dateClass:
        // coerce dates and booleans to numbers, dates to milliseconds and booleans
        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal
        return +a == +b;
  
      case numberClass:
        // treat `NaN` vs. `NaN` as equal
        return (a != +a)
          ? b != +b
          // but treat `+0` vs. `-0` as not equal
          : (a == 0 ? (1 / a == 1 / b) : a == +b);
  
      case regexpClass:
      case stringClass:
        // coerce regexes to strings (http://es5.github.io/#x15.10.6.4)
        // treat string primitives and their corresponding object instances as equal
        return a == String(b);
    }
    var isArr = className == arrayClass;
    if (!isArr) {
      // unwrap any `lodash` wrapped values
      var aWrapped = hasOwnProperty.call(a, '__wrapped__'),
          bWrapped = hasOwnProperty.call(b, '__wrapped__');
  
      if (aWrapped || bWrapped) {
        return baseIsEqual(aWrapped ? a.__wrapped__ : a, bWrapped ? b.__wrapped__ : b, callback, isWhere, stackA, stackB);
      }
      // exit for functions and DOM nodes
      if (className != objectClass) {
        return false;
      }
      // in older versions of Opera, `arguments` objects have `Array` constructors
      var ctorA = a.constructor,
          ctorB = b.constructor;
  
      // non `Object` object instances with different constructors are not equal
      if (ctorA != ctorB &&
            !(isFunction(ctorA) && ctorA instanceof ctorA && isFunction(ctorB) && ctorB instanceof ctorB) &&
            ('constructor' in a && 'constructor' in b)
          ) {
        return false;
      }
    }
    // assume cyclic structures are equal
    // the algorithm for detecting cyclic structures is adapted from ES 5.1
    // section 15.12.3, abstract operation `JO` (http://es5.github.io/#x15.12.3)
    var initedStack = !stackA;
    stackA || (stackA = getArray());
    stackB || (stackB = getArray());
  
    var length = stackA.length;
    while (length--) {
      if (stackA[length] == a) {
        return stackB[length] == b;
      }
    }
    var size = 0;
    result = true;
  
    // add `a` and `b` to the stack of traversed objects
    stackA.push(a);
    stackB.push(b);
  
    // recursively compare objects and arrays (susceptible to call stack limits)
    if (isArr) {
      // compare lengths to determine if a deep comparison is necessary
      length = a.length;
      size = b.length;
      result = size == length;
  
      if (result || isWhere) {
        // deep compare the contents, ignoring non-numeric properties
        while (size--) {
          var index = length,
              value = b[size];
  
          if (isWhere) {
            while (index--) {
              if ((result = baseIsEqual(a[index], value, callback, isWhere, stackA, stackB))) {
                break;
              }
            }
          } else if (!(result = baseIsEqual(a[size], value, callback, isWhere, stackA, stackB))) {
            break;
          }
        }
      }
    }
    else {
      // deep compare objects using `forIn`, instead of `forOwn`, to avoid `Object.keys`
      // which, in this case, is more costly
      forIn(b, function(value, key, b) {
        if (hasOwnProperty.call(b, key)) {
          // count the number of properties.
          size++;
          // deep compare each property value.
          return (result = hasOwnProperty.call(a, key) && baseIsEqual(a[key], value, callback, isWhere, stackA, stackB));
        }
      });
  
      if (result && !isWhere) {
        // ensure both objects have the same number of properties
        forIn(a, function(value, key, a) {
          if (hasOwnProperty.call(a, key)) {
            // `size` will be `-1` if `a` has more properties than `b`
            return (result = --size > -1);
          }
        });
      }
    }
    stackA.pop();
    stackB.pop();
  
    if (initedStack) {
      releaseArray(stackA);
      releaseArray(stackB);
    }
    return result;
  }
  
  module.exports = baseIsEqual;
  
});
require.register('lodash._shimkeys', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var objectTypes = require('lodash._objecttypes');
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Native method shortcuts */
  var hasOwnProperty = objectProto.hasOwnProperty;
  
  /**
   * A fallback implementation of `Object.keys` which produces an array of the
   * given object's own enumerable property names.
   *
   * @private
   * @type Function
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns an array of property names.
   */
  var shimKeys = function(object) {
    var index, iterable = object, result = [];
    if (!iterable) return result;
    if (!(objectTypes[typeof object])) return result;
      for (index in iterable) {
        if (hasOwnProperty.call(iterable, index)) {
          result.push(index);
        }
      }
    return result
  };
  
  module.exports = shimKeys;
  
});
require.register('lodash.keys', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash._isnative'),
      isObject = require('lodash.isobject'),
      shimKeys = require('lodash._shimkeys');
  
  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;
  
  /**
   * Creates an array composed of the own enumerable property names of an object.
   *
   * @static
   * @memberOf _
   * @category Objects
   * @param {Object} object The object to inspect.
   * @returns {Array} Returns an array of property names.
   * @example
   *
   * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
   * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
   */
  var keys = !nativeKeys ? shimKeys : function(object) {
    if (!isObject(object)) {
      return [];
    }
    return nativeKeys(object);
  };
  
  module.exports = keys;
  
});
require.register('lodash.property', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  
  /**
   * Creates a "_.pluck" style function, which returns the `key` value of a
   * given object.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {string} key The name of the property to retrieve.
   * @returns {Function} Returns the new function.
   * @example
   *
   * var characters = [
   *   { 'name': 'fred',   'age': 40 },
   *   { 'name': 'barney', 'age': 36 }
   * ];
   *
   * var getName = _.property('name');
   *
   * _.map(characters, getName);
   * // => ['barney', 'fred']
   *
   * _.sortBy(characters, getName);
   * // => [{ 'name': 'barney', 'age': 36 }, { 'name': 'fred',   'age': 40 }]
   */
  function property(key) {
    return function(object) {
      return object[key];
    };
  }
  
  module.exports = property;
  
});
require.register('lodash.createcallback', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreateCallback = require('lodash._basecreatecallback'),
      baseIsEqual = require('lodash._baseisequal'),
      isObject = require('lodash.isobject'),
      keys = require('lodash.keys'),
      property = require('lodash.property');
  
  /**
   * Produces a callback bound to an optional `thisArg`. If `func` is a property
   * name the created callback will return the property value for a given element.
   * If `func` is an object the created callback will return `true` for elements
   * that contain the equivalent object properties, otherwise it will return `false`.
   *
   * @static
   * @memberOf _
   * @category Utilities
   * @param {*} [func=identity] The value to convert to a callback.
   * @param {*} [thisArg] The `this` binding of the created callback.
   * @param {number} [argCount] The number of arguments the callback accepts.
   * @returns {Function} Returns a callback function.
   * @example
   *
   * var characters = [
   *   { 'name': 'barney', 'age': 36 },
   *   { 'name': 'fred',   'age': 40 }
   * ];
   *
   * // wrap to create custom callback shorthands
   * _.createCallback = _.wrap(_.createCallback, function(func, callback, thisArg) {
   *   var match = /^(.+?)__([gl]t)(.+)$/.exec(callback);
   *   return !match ? func(callback, thisArg) : function(object) {
   *     return match[2] == 'gt' ? object[match[1]] > match[3] : object[match[1]] < match[3];
   *   };
   * });
   *
   * _.filter(characters, 'age__gt38');
   * // => [{ 'name': 'fred', 'age': 40 }]
   */
  function createCallback(func, thisArg, argCount) {
    var type = typeof func;
    if (func == null || type == 'function') {
      return baseCreateCallback(func, thisArg, argCount);
    }
    // handle "_.pluck" style callback shorthands
    if (type != 'object') {
      return property(func);
    }
    var props = keys(func),
        key = props[0],
        a = func[key];
  
    // handle "_.where" style callback shorthands
    if (props.length == 1 && a === a && !isObject(a)) {
      // fast path the common case of providing an object with a single
      // property containing a primitive value
      return function(object) {
        var b = object[key];
        return a === b && (a !== 0 || (1 / a == 1 / b));
      };
    }
    return function(object) {
      var length = props.length,
          result = false;
  
      while (length--) {
        if (!(result = baseIsEqual(object[props[length]], func[props[length]], null, true))) {
          break;
        }
      }
      return result;
    };
  }
  
  module.exports = createCallback;
  
});
require.register('lodash.forown', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreateCallback = require('lodash._basecreatecallback'),
      keys = require('lodash.keys'),
      objectTypes = require('lodash._objecttypes');
  
  /**
   * Iterates over own enumerable properties of an object, executing the callback
   * for each property. The callback is bound to `thisArg` and invoked with three
   * arguments; (value, key, object). Callbacks may exit iteration early by
   * explicitly returning `false`.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {Object} object The object to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Object} Returns `object`.
   * @example
   *
   * _.forOwn({ '0': 'zero', '1': 'one', 'length': 2 }, function(num, key) {
   *   console.log(key);
   * });
   * // => logs '0', '1', and 'length' (property order is not guaranteed across environments)
   */
  var forOwn = function(collection, callback, thisArg) {
    var index, iterable = collection, result = iterable;
    if (!iterable) return result;
    if (!objectTypes[typeof iterable]) return result;
    callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
      var ownIndex = -1,
          ownProps = objectTypes[typeof iterable] && keys(iterable),
          length = ownProps ? ownProps.length : 0;
  
      while (++ownIndex < length) {
        index = ownProps[ownIndex];
        if (callback(iterable[index], index, collection) === false) return result;
      }
    return result
  };
  
  module.exports = forOwn;
  
});
require.register('lodash.isarray', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var isNative = require('lodash._isnative');
  
  /** `Object#toString` result shortcuts */
  var arrayClass = '[object Array]';
  
  /** Used for native method references */
  var objectProto = Object.prototype;
  
  /** Used to resolve the internal [[Class]] of values */
  var toString = objectProto.toString;
  
  /* Native method shortcuts for methods with the same name as other `lodash` methods */
  var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray;
  
  /**
   * Checks if `value` is an array.
   *
   * @static
   * @memberOf _
   * @type Function
   * @category Objects
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if the `value` is an array, else `false`.
   * @example
   *
   * (function() { return _.isArray(arguments); })();
   * // => false
   *
   * _.isArray([1, 2, 3]);
   * // => true
   */
  var isArray = nativeIsArray || function(value) {
    return value && typeof value == 'object' && typeof value.length == 'number' &&
      toString.call(value) == arrayClass || false;
  };
  
  module.exports = isArray;
  
});
require.register('lodash.some', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var createCallback = require('lodash.createcallback'),
      forOwn = require('lodash.forown'),
      isArray = require('lodash.isarray');
  
  /**
   * Checks if the callback returns a truey value for **any** element of a
   * collection. The function returns as soon as it finds a passing value and
   * does not iterate over the entire collection. The callback is bound to
   * `thisArg` and invoked with three arguments; (value, index|key, collection).
   *
   * If a property name is provided for `callback` the created "_.pluck" style
   * callback will return the property value of the given element.
   *
   * If an object is provided for `callback` the created "_.where" style callback
   * will return `true` for elements that have the properties of the given object,
   * else `false`.
   *
   * @static
   * @memberOf _
   * @alias any
   * @category Collections
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function|Object|string} [callback=identity] The function called
   *  per iteration. If a property name or object is provided it will be used
   *  to create a "_.pluck" or "_.where" style callback, respectively.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {boolean} Returns `true` if any element passed the callback check,
   *  else `false`.
   * @example
   *
   * _.some([null, 0, 'yes', false], Boolean);
   * // => true
   *
   * var characters = [
   *   { 'name': 'barney', 'age': 36, 'blocked': false },
   *   { 'name': 'fred',   'age': 40, 'blocked': true }
   * ];
   *
   * // using "_.pluck" callback shorthand
   * _.some(characters, 'blocked');
   * // => true
   *
   * // using "_.where" callback shorthand
   * _.some(characters, { 'age': 1 });
   * // => false
   */
  function some(collection, callback, thisArg) {
    var result;
    callback = createCallback(callback, thisArg, 3);
  
    var index = -1,
        length = collection ? collection.length : 0;
  
    if (typeof length == 'number') {
      while (++index < length) {
        if ((result = callback(collection[index], index, collection))) {
          break;
        }
      }
    } else {
      forOwn(collection, function(value, index, collection) {
        return !(result = callback(value, index, collection));
      });
    }
    return !!result;
  }
  
  module.exports = some;
  
});
require.register('lodash.foreach', function(module, exports, require) {
  /**
   * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
   * Build: `lodash modularize modern exports="npm" -o ./npm/`
   * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
   * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
   * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   * Available under MIT license <http://lodash.com/license>
   */
  var baseCreateCallback = require('lodash._basecreatecallback'),
      forOwn = require('lodash.forown');
  
  /**
   * Iterates over elements of a collection, executing the callback for each
   * element. The callback is bound to `thisArg` and invoked with three arguments;
   * (value, index|key, collection). Callbacks may exit iteration early by
   * explicitly returning `false`.
   *
   * Note: As with other "Collections" methods, objects with a `length` property
   * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
   * may be used for object iteration.
   *
   * @static
   * @memberOf _
   * @alias each
   * @category Collections
   * @param {Array|Object|string} collection The collection to iterate over.
   * @param {Function} [callback=identity] The function called per iteration.
   * @param {*} [thisArg] The `this` binding of `callback`.
   * @returns {Array|Object|string} Returns `collection`.
   * @example
   *
   * _([1, 2, 3]).forEach(function(num) { console.log(num); }).join(',');
   * // => logs each number and returns '1,2,3'
   *
   * _.forEach({ 'one': 1, 'two': 2, 'three': 3 }, function(num) { console.log(num); });
   * // => logs each number and returns the object (property order is not guaranteed across environments)
   */
  function forEach(collection, callback, thisArg) {
    var index = -1,
        length = collection ? collection.length : 0;
  
    callback = callback && typeof thisArg == 'undefined' ? callback : baseCreateCallback(callback, thisArg, 3);
    if (typeof length == 'number') {
      while (++index < length) {
        if (callback(collection[index], index, collection) === false) {
          break;
        }
      }
    } else {
      forOwn(collection, callback);
    }
    return collection;
  }
  
  module.exports = forEach;
  
});
require.register('trait', function(module, exports, require) {
  var forEach = require('lodash.foreach')
  	, bind = require('lodash.bind')
  	, keys = require('lodash.keys')
  	, owns = bind(Function.prototype.call, Object.prototype.hasOwnProperty);
  
  /* Feature tests */
  var SUPPORTS_ACCESSORS = (function () {
  	try {
  		var test = {};
  		Object.defineProperty(test, 'x', {
  			get: function() {
  				return 1;
  			}
  		});
  		return test.x === 1;
  	} catch (err) {
  		return false;
  	}
  })();
  // IE8 implements Obejct.defineProperty and Object.getOwnPropertyDescriptor
  // only for DOM objects.
  var SUPPORTS_GET_OWN_PROP_DESCRIPTOR = (function () {
  	try {
  		if (Object.getOwnPropertyDescriptor) {
  			var test = {x: 1};
  			return !!Object.getOwnPropertyDescriptor(test, 'x');
  		}
  	} catch (err) {}
  	return false;
  })();
  var SUPPORTS_DEFINE_PROP = (function () {
  	try {
  		if (Object.defineProperty) {
  			var test = {};
  			Object.defineProperty(test, 'x', {value: 1});
  			return test.x === 1;
  		}
  	} catch (err) {}
  	return false;
  })();
  
  /* ES3 fallbacks */
  var freeze = Object.freeze
  	|| function (obj) { return obj; };
  var getPrototypeOf = Object.getPrototypeOf
  	|| function (obj) { return Object.prototype; };
  var getOwnPropertyNames = Object.getOwnPropertyNames
  	|| function (obj) {
  			var props = [];
  			for (var p in obj) {
  				if (hasOwnProperty(obj, p)) props.push(p);
  			}
  			return props;
  		};
  var getOwnPropertyDescriptor = SUPPORTS_GET_OWN_PROP_DESCRIPTOR
  	? Object.getOwnPropertyDescriptor
  	: function (obj, name) {
  			return {
  				value: obj[name],
  				enumerable: true,
  				writable: true,
  				configurable: true
  			};
  		};
  var defineProperty = SUPPORTS_DEFINE_PROP
  	? Object.defineProperty
  	: function (obj, name, pd) {
  			obj[name] = pd.value;
  		};
  var defineProperties = Object.defineProperties
  	|| function (obj, propMap) {
  			for (var name in propMap) {
  				if (hasOwnProperty(obj, name)) {
  					defineProperty(obj, name, propMap[name]);
  				}
  			}
  		};
  var objectCreate = Object.create
  	|| function (proto, propMap) {
  			var self;
  			function dummy() {};
  			dummy.prototype = proto || Object.prototype;
  			self = new dummy();
  			if (propMap) defineProperties(self, propMap);
  			return self;
  		};
  var getOwnProperties = Object.getOwnProperties
  	|| function (obj) {
  			var map = {};
  			forEach(getOwnPropertyNames(obj), function (name) {
  				map[name] = getOwnPropertyDescriptor(obj, name);
  			});
  			return map;
  		};
  
  // Polyfill
  if (!Object.create) Object.create = objectCreate;
  if (!Object.getOwnPropertyNames) Object.getOwnPropertyNames = getOwnPropertyNames;
  if (!Object.getOwnProperties) Object.getOwnProperties = getOwnProperties;
  if (!Object.getPrototypeOf) Object.getPrototypeOf = getPrototypeOf;
  
  
  /**
   * Whether or not given property descriptors are equivalent. They are
   * equivalent either if both are marked as 'conflict' or 'required' property
   * or if all the properties of descriptors are equal.
   * @param {Object} actual
   * @param {Object} expected
   * @returns {Boolean}
   */
  function equivalentDescriptors (actual, expected) {
  	return (actual.conflict && expected.conflict) ||
  		(actual.required && expected.required) ||
  		equalDescriptors(actual, expected);
  }
  
  /**
   * Whether or not given property descriptors define equal properties.
   * @param {Object} actual
   * @param {Object} expected
   * @returns {Boolean}
   */
  function equalDescriptors (actual, expected) {
  	return actual.get === expected.get &&
  		actual.set === expected.set &&
  		actual.value === expected.value &&
  		!!actual.enumerable === !!expected.enumerable &&
  		!!actual.configurable === !!expected.configurable &&
  		!!actual.writable === !!expected.writable;
  }
  
  // Utilities that throw exceptions for properties that are marked
  // as 'required' or 'conflict' properties.
  function throwConflictPropertyError (name) {
  	throw new Error('Remaining conflicting property: ' + name);
  }
  function throwRequiredPropertyError (name) {
  	throw new Error('Missing required property: ' + name);
  }
  
  /**
   * Generates custom **required** property descriptor. Descriptor contains
   * non-standard property `required` that is equal to `true`.
   * @param {String} name
   *    property name to generate descriptor for.
   * @returns {Object}
   *    custom property descriptor
   */
  function RequiredPropertyDescriptor (name) {
  	// Creating function by binding first argument to a property `name` on the
  	// `throwConflictPropertyError` function. Created function is used as a
  	// getter & setter of the created property descriptor. This way we ensure
  	// that we throw exception late (on property access) if object with
  	// `required` property was instantiated using built-in `Object.create`.
  	var accessor = bind(throwRequiredPropertyError, null, name);
  	if (SUPPORTS_ACCESSORS) {
  		return {
  			get: accessor,
  			set: accessor,
  			required: true
  		}
  	} else {
  		return {
  			value: accessor,
  			required: true
  		}
  	}
  }
  
  /**
   * Generates custom **conflicting** property descriptor. Descriptor contains
   * non-standard property `conflict` that is equal to `true`.
   * @param {String} name
   *    property name to generate descriptor for.
   * @returns {Object}
   *    custom property descriptor
   */
  function ConflictPropertyDescriptor (name) {
  	// For details see `RequiredPropertyDescriptor` since idea is same.
  	var accessor = bind(throwConflictPropertyError, null, name);
  	if (SUPPORTS_ACCESSORS) {
  		return {
  			get: accessor,
  			set: accessor,
  			conflict: true
  		}
  	} else {
  		return {
  			value: accessor,
  			conflict: true
  		}
  	}
  }
  
  /**
   * Tests if property is marked as `required` property.
   */
  function isRequiredProperty (object, name) {
  	return !!object[name].required;
  }
  
  /**
   * Tests if property is marked as `conflict` property.
   */
  function isConflictProperty (object, name) {
  	return !!object[name].conflict;
  }
  
  /**
   * Function tests whether or not method of the `source` object with a given
   * `name` is inherited from `Object.prototype`.
   */
  function isBuiltInMethod (name, source) {
  	var target = Object.prototype[name];
  
  	// If methods are equal then we know it's `true`.
  	return target == source
  		// If `source` object comes form a different sandbox `==` will evaluate
  		// to `false`, in that case we check if functions names and sources match.
  		|| (String(target) === String(source) && target.name === source.name);
  }
  
  /**
   * Function overrides `toString` and `constructor` methods of a given `target`
   * object with a same-named methods of a given `source` if methods of `target`
   * object are inherited / copied from `Object.prototype`.
   * @see create
   */
  function overrideBuiltInMethods (target, source) {
  	if (isBuiltInMethod('toString', target.toString)) {
  		defineProperty(target, 'toString',  {
  			value: source.toString,
  			configurable: true,
  			enumerable: false
  		});
  	}
  
  	if (isBuiltInMethod('constructor', target.constructor)) {
  		defineProperty(target, 'constructor', {
  			value: source.constructor,
  			configurable: true,
  			enumerable: false
  		});
  	}
  }
  
  /**
   * Composes new trait with the same own properties as the original trait,
   * except that all property names appearing in the first argument are replaced
   * by 'required' property descriptors.
   * @param {String[]} keys
   *    Array of strings property names.
   * @param {Object} trait
   *    A trait some properties of which should be excluded.
   * @returns {Object}
   * @example
   *    var newTrait = exclude(['name', ...], trait)
   */
  function exclude (names, trait) {
  	var map = {};
  
  	forEach(keys(trait), function(name) {
  
  		// If property is not excluded (the array of names does not contain it),
  		// or it is a 'required' property, copy it to the property descriptor `map`
  		// that will be used for creation of resulting trait.
  		if (!~names.indexOf(name) || isRequiredProperty(trait, name)) {
  			map[name] = { value: trait[name], enumerable: true };
  
  		// For all the `names` in the exclude name array we create required
  		// property descriptors and copy them to the `map`.
  		} else {
  			map[name] = { value: RequiredPropertyDescriptor(name), enumerable: true };
  		}
  	});
  
  	return Object.create(Trait.prototype, map);
  }
  
  /**
   * Composes new instance of `Trait` with a properties of a given `trait`,
   * except that all properties whose name is an own property of `renames` will
   * be renamed to `renames[name]` and a `'required'` property for name will be
   * added instead.
   *
   * For each renamed property, a required property is generated. If
   * the `renames` map two properties to the same name, a conflict is generated.
   * If the `renames` map a property to an existing unrenamed property, a
   * conflict is generated.
   *
   * @param {Object} renames
   *    An object whose own properties serve as a mapping from old names to new
   *    names.
   * @param {Object} trait
   *    A new trait with renamed properties.
   * @returns {Object}
   * @example
   *
   *    // Return trait with `bar` property equal to `trait.foo` and with
   *    // `foo` and `baz` 'required' properties.
   *    var renamedTrait = rename({ foo: 'bar', baz: null }), trait);
   *
   *    // t1 and t2 are equivalent traits
   *    var t1 = rename({a: 'b'}, t);
   *    var t2 = compose(exclude(['a'], t), { a: { required: true }, b: t[a] });
   */
  function rename (renames, trait) {
  	var map = {};
  
  	// Loop over all the properties of the given `trait` and copy them to a
  	// property descriptor `map` that will be used for creation of resulting
  	// trait. Also renaming properties in the `map` as specified by `renames`.
  	forEach(keys(trait), function(name) {
  		var alias;
  
  		// If the property is in the `renames` map, and it isn't a 'required'
  		// property (which should never need to be aliased because 'required'
  		// properties never conflict), then we must try to rename it.
  		if (owns(renames, name) && !isRequiredProperty(trait, name)) {
  			alias = renames[name];
  
  			// If the `map` already has the `alias`, and it isn't a 'required'
  			// property, that means the `alias` conflicts with an existing name for a
  			// provided trait (that can happen if >=2 properties are aliased to the
  			// same name). In this case we mark it as a conflicting property.
  			// Otherwise, everything is fine, and we copy property with an `alias`
  			// name.
  			if (owns(map, alias) && !map[alias].value.required) {
  				map[alias] = {
  					value: ConflictPropertyDescriptor(alias),
  					enumerable: true
  				};
  			} else {
  				map[alias] = {
  					value: trait[name],
  					enumerable: true
  				};
  			}
  
  			// Regardless of whether or not the rename was successful, we check to
  			// see if the original `name` exists in the map (such a property
  			// could exist if previous another property was aliased to this `name`).
  			// If it isn't, we mark it as 'required', to make sure the caller
  			// provides another value for the old name, to which methods of the trait
  			// might continue to reference.
  			if (!owns(map, name)) {
  				map[name] = {
  					value: RequiredPropertyDescriptor(name),
  					enumerable: true
  				};
  			}
  
  		// Otherwise, either the property isn't in the `renames` map (thus the
  		// caller is not trying to rename it) or it is a 'required' property.
  		// Either way, we don't have to alias the property, we just have to copy it
  		// to the map.
  		} else {
  			// The property isn't in the map yet, so we copy it over.
  			if (!owns(map, name)) {
  				map[name] = { value: trait[name], enumerable: true };
  
  			// The property is already in the map (that means another property was
  			// aliased with this `name`, which creates a conflict if the property is
  			// not marked as 'required'), so we have to mark it as a 'conflict'
  			// property.
  			} else if (!isRequiredProperty(trait, name)) {
  				map[name] = {
  					value: ConflictPropertyDescriptor(name),
  					enumerable: true
  				};
  			}
  		}
  	});
  
  	return Object.create(Trait.prototype, map);
  }
  
  /**
   * Composes new resolved trait, with all the same properties as the original
   * `trait`, except that all properties whose name is an own property of
   * `resolutions` will be renamed to `resolutions[name]`.
   *
   * If `resolutions[name]` is `null`, the value is mapped to a property
   * descriptor that is marked as a 'required' property.
   */
  function resolve (resolutions, trait) {
  	var renames = {}
  		, exclusions = [];
  
  	// Go through each mapping in `resolutions` object and distribute it either
  	// to `renames` or `exclusions`.
  	forEach(keys(resolutions), function(name) {
  
  		// If `resolutions[name]` is a truthy value then it's a mapping old -> new
  		// so we copy it to `renames` map.
  		if (resolutions[name]) {
  			renames[name] = resolutions[name];
  
  		// Otherwise it's not a mapping but an exclusion instead in which case we
  		// add it to the `exclusions` array.
  		} else {
  			exclusions.push(name);
  		}
  	});
  
  	// First `exclude` **then** `rename` and order is important since
  	// `exclude` and `rename` are not associative.
  	return rename(renames, exclude(exclusions, trait));
  }
  
  /**
   * Create a Trait (a custom property descriptor map) that represents the given
   * `object`'s own properties. Property descriptor map is a 'custom', because it
   * inherits from `Trait.prototype` and it's property descriptors may contain
   * two attributes that is not part of the ES5 specification:
   *
   *  - 'required' (this property must be provided by another trait
   *    before an instance of this trait can be created)
   *  - 'conflict' (when the trait is composed with another trait,
   *    a unique value for this property is provided by two or more traits)
   *
   * Data properties bound to the `Trait.required` singleton exported by
   * this module will be marked as 'required' properties.
   *
   * @param {Object} object
   *    Map of properties to compose trait from.
   * @returns {Trait}
   *    Trait / Property descriptor map containing all the own properties of the
   *    given argument.
   */
  function trait (object) {
  	var trait = object
  		, map;
  
  	if (!(object instanceof Trait)) {
  		// If passed `object` is not already an instance of `Trait` we create
  		// a property descriptor `map` containing descriptors of own properties of
  		// a given `object`. `map` is used to create a `Trait` instance after all
  		// properties are mapped. Please note that we can't create trait and then
  		// just copy properties into it since that will fails for inherited
  		// 'read-only' properties.
  		map = {};
  
  		// Each own property of a given `object` is mapped to a data property, who's
  		// value is a property descriptor.
  		forEach(keys(object), function (name) {
  
  			// If property of an `object` is equal to a `Trait.required`, it means
  			// that it was marked as 'required' property, in which case we map it
  			// to 'required' property.
  			if (Trait.required == getOwnPropertyDescriptor(object, name).value) {
  				map[name] = {
  					value: RequiredPropertyDescriptor(name),
  					enumerable: true
  				};
  
  			// Otherwise property is mapped to it's property descriptor.
  			} else {
  				map[name] = {
  					value: getOwnPropertyDescriptor(object, name),
  					enumerable: true
  				};
  			}
  		});
  
  		trait = Object.create(Trait.prototype, map);
  	}
  
  	return trait;
  }
  
  /**
   * Compose a property descriptor map that inherits from `Trait.prototype` and
   * contains property descriptors for all the own properties of the passed
   * traits.
   *
   * If two or more traits have own properties with the same name, the returned
   * trait will contain a 'conflict' property for that name. Composition is a
   * commutative and associative operation, and the order of its arguments is
   * irrelevant.
   */
  function compose () {
  	// Create a new property descriptor `map` to which all own properties of the
  	// passed traits are copied. This map will be used to create a `Trait`
  	// instance that will be result of this composition.
  	var map = {};
  
  	// Properties of each passed trait are copied to the composition.
  	forEach(arguments, function(trait) {
  		// Copying each property of the given trait.
  		forEach(keys(trait), function(name) {
  			// If `map` already owns a property with the `name` and it is not marked 'required'.
  			if (owns(map, name) && !map[name].value.required) {
  
  				// If source trait's property with the `name` is marked as 'required'
  				// we do nothing, as requirement was already resolved by a property in
  				// the `map` (because it already contains non-required property with
  				// that `name`). But if properties are just different, we have a name
  				// clash and we substitute it with a property that is marked 'conflict'.
  				if (!isRequiredProperty(trait, name) && !equivalentDescriptors(map[name].value, trait[name])) {
  					map[name] = {
  						value: ConflictPropertyDescriptor(name),
  						enumerable: true
  					};
  				}
  
  			// Otherwise, the `map` does not have an own property with the `name`, or
  			// it is marked 'required'. Either way trait's property is copied to the
  			// map (If property of the `map` is marked 'required' it is going to be
  			// resolved by the property that is being copied).
  			} else {
  				map[name] = { value: trait[name], enumerable: true };
  			}
  		});
  	});
  
  	return Object.create(Trait.prototype, map);
  }
  
  /**
   *  `defineProperties` is like `Object.defineProperties`, except that it
   *  ensures that:
   *    - An exception is thrown if any property in a given `properties` map
   *      is marked as 'required' property and same named property is not
   *      found in a given `prototype`.
   *    - An exception is thrown if any property in a given `properties` map
   *      is marked as 'conflict' property.
   * @param {Object} object
   *    Object to define properties on.
   * @param {Object} properties
   *    Properties descriptor map.
   * @returns {Object}
   *    `object` that was passed as a first argument.
   */
  function verifiedDefineProperties (object, properties) {
  
  	// Create a map into which we will copy each verified property from the given
  	// `properties` description map. We use it to verify that none of the
  	// provided properties is marked as a 'conflict' property and that all
  	// 'required' properties are resolved by a property of an `object`, so we
  	// can throw an exception before mutating object if that isn't the case.
  	var verifiedProperties = {};
  
  	// Coping each property from a given `properties` descriptor map to a
  	// verified map of property descriptors.
  	forEach(keys(properties), function(name) {
  
  		// If property is marked as 'required' property and we don't have a same
  		// named property in a given `object` we throw an exception. If `object`
  		// has same named property just skip this property since required property
  		// is was inherited and there for requirement was satisfied.
  		if (isRequiredProperty(properties, name)) {
  			if (!(name in object)) {
  				throwRequiredPropertyError(name);
  			}
  
  		// If property is marked as 'conflict' property we throw an exception.
  		} else if (isConflictProperty(properties, name)) {
  			throwConflictPropertyError(name);
  
  		// If property is not marked neither as 'required' nor 'conflict' property
  		// we copy it to verified properties map.
  		} else {
  			verifiedProperties[name] = properties[name];
  		}
  	});
  
  	// If no exceptions were thrown yet, we know that our verified property
  	// descriptor map has no properties marked as 'conflict' or 'required',
  	// so we just delegate to the built-in `Object.defineProperties`.
  	return defineProperties(object, verifiedProperties);
  }
  
  /**
   *  `create` is like `Object.create`, except that it ensures that:
   *    - An exception is thrown if any property in a given `properties` map
   *      is marked as 'required' property and same named property is not
   *      found in a given `prototype`.
   *    - An exception is thrown if any property in a given `properties` map
   *      is marked as 'conflict' property.
   * @param {Object} prototype
   *    prototype of the composed object
   * @param {Object} properties
   *    Properties descriptor map.
   * @returns {Object}
   *    An object that inherits form a given `prototype` and implements all the
   *    properties defined by a given `properties` descriptor map.
   */
  function create (prototype, properties) {
  
  	// Creating an instance of the given `prototype`.
  	var object = Object.create(prototype);
  
  	// Overriding `toString`, `constructor` methods if they are just inherited
  	// from `Object.prototype` with a same named methods of the `Trait.prototype`
  	// that will have more relevant behavior.
  	overrideBuiltInMethods(object, Trait.prototype);
  
  	// Trying to define given `properties` on the `object`. We use our custom
  	// `defineProperties` function instead of build-in `Object.defineProperties`
  	// that behaves exactly the same, except that it will throw if any
  	// property in the given `properties` descriptor is marked as 'required' or
  	// 'conflict' property.
  	return verifiedDefineProperties(object, properties);
  }
  
  /**
   * Composes new trait. If two or more traits have own properties with the
   * same name, the new trait will contain a 'conflict' property for that name.
   * 'compose' is a commutative and associative operation, and the order of its
   * arguments is not significant.
   *
   * **Note:** Use `Trait.compose` instead of calling this function with more
   * than one argument. The multiple-argument functionality is strictly for
   * backward compatibility.
   *
   * @params {Object} trait
   *    Takes traits as an arguments
   * @returns {Object}
   *    New trait containing the combined own properties of all the traits.
   * @example
   *    var newTrait = compose(trait_1, trait_2, ..., trait_N)
   */
  function Trait (trait1, trait2) {
  
  	// If the function was called with one argument, the argument should be
  	// an object whose properties are mapped to property descriptors on a new
  	// instance of Trait, so we delegate to the trait function.
  	// If the function was called with more than one argument, those arguments
  	// should be instances of Trait or plain property descriptor maps
  	// whose properties should be mixed into a new instance of Trait,
  	// so we delegate to the compose function.
  
  	return trait2 === undefined
  		? trait(trait1)
  		: compose.apply(null, arguments);
  }
  
  freeze(defineProperties(Trait.prototype, {
  	toString: {
  		value: function toString() {
  			return '[object ' + this.constructor.name + ']';
  		}
  	},
  
  	/**
  	 * `create` is like `Object.create`, except that it ensures that:
  	 *    - An exception is thrown if this trait defines a property that is
  	 *      marked as required property and same named property is not
  	 *      found in a given `prototype`.
  	 *    - An exception is thrown if this trait contains property that is
  	 *      marked as 'conflict' property.
  	 * @param {Object}
  	 *    prototype of the compared object
  	 * @returns {Object}
  	 *    An object with all of the properties described by the trait.
  	 */
  	create: {
  		value: function createTrait(prototype) {
  			return create(undefined === prototype
  				? Object.prototype
  				: prototype,
  			this);
  		},
  		enumerable: true
  	},
  
  	/**
  	 * Composes a new resolved trait, with all the same properties as the original
  	 * trait, except that all properties whose name is an own property of
  	 * `resolutions` will be renamed to the value of `resolutions[name]`. If
  	 * `resolutions[name]` is `null`, the property is marked as 'required'.
  	 * @param {Object} resolutions
  	 *   An object whose own properties serve as a mapping from old names to new
  	 *   names, or to `null` if the property should be excluded.
  	 * @returns {Object}
  	 *   New trait with the same own properties as the original trait but renamed.
  	 */
  	resolve: {
  		value: function resolveTrait(resolutions) {
  			return resolve(resolutions, this);
  		},
  		enumerable: true
  	}
  }));
  
  /**
   * @see compose
   */
  Trait.compose = freeze(compose);
  freeze(compose.prototype);
  
  /**
   * Constant singleton, representing placeholder for required properties.
   * @type {Object}
   */
  Trait.required = freeze(Object.create(Object.prototype, {
  	toString: {
  		value: freeze(function toString() {
  			return '<Trait.required>';
  		})
  	}
  }));
  freeze(Trait.required.toString.prototype);
  
  module.exports = freeze(Trait);
});
require.register('test/src/index', function(module, exports, require) {
  require('lodash.some');
  require('trait');
  
});