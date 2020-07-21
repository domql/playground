// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/@rackai/domql/node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"../node_modules/@rackai/domql/src/element/nodes.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  root: ['body', 'html'],
  head: ['title', 'base', 'meta', 'style'],
  body: ['string', 'fragment', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hr', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', // SVG
  'svg', 'path']
};
exports.default = _default;
},{}],"../node_modules/@rackai/domql/src/utils/object.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.overwrite = exports.deepClone = exports.deepMerge = exports.map = exports.exec = exports.isObjectLike = exports.isArray = exports.isFunction = exports.isObject = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var isObject = function isObject(arg) {
  return _typeof(arg) === 'object' && arg.constructor === Object;
};

exports.isObject = isObject;

var isFunction = function isFunction(arg) {
  return typeof arg === 'function';
};

exports.isFunction = isFunction;

var isArray = function isArray(arg) {
  return Array.isArray(arg);
};

exports.isArray = isArray;

var isObjectLike = function isObjectLike(arg) {
  if (arg === null) return false;
  return _typeof(arg) === 'object';
};

exports.isObjectLike = isObjectLike;

var exec = function exec(param, element) {
  if (isFunction(param)) return param(element);
  return param;
};

exports.exec = exec;

var map = function map(obj, extention, element) {
  for (var e in extention) {
    obj[e] = exec(extention[e], element);
  }
};

exports.map = map;

var deepMerge = function deepMerge(element, proto) {
  for (var e in proto) {
    var elementProp = element[e];
    var protoProp = proto[e];

    if (elementProp === undefined) {
      element[e] = protoProp;
    } else if (isObjectLike(elementProp) && isObjectLike(protoProp)) {
      deepMerge(elementProp, protoProp);
    }
  }

  return element;
};

exports.deepMerge = deepMerge;

var deepClone = function deepClone(obj) {
  var o = {};

  for (var prop in obj) {
    var objProp = obj[prop];
    if (_typeof(objProp) === 'object') o[prop] = deepClone(objProp);else o[prop] = objProp;
  }

  return o;
};

exports.deepClone = deepClone;

var overwrite = function overwrite(obj, params) {
  for (var e in params) {
    var objProp = obj[e];
    var paramsProp = params[e];

    if (isObjectLike(objProp) && isObjectLike(paramsProp)) {
      overwrite(objProp, paramsProp);
    } else if (paramsProp) obj[e] = paramsProp;
  }

  return obj;
};

exports.overwrite = overwrite;
},{}],"../node_modules/@rackai/domql/src/utils/report.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.report = exports.errors = void 0;
var errors = {
  en: {
    DocumentNotDefined: {
      title: 'Document is undefined',
      description: 'To tweak with DOM, you should use browser.'
    },
    OverwriteToBuiltin: {
      title: 'Overwriting to builtin method',
      description: "Overwriting a builtin method in the global define is not possible, please choose different name"
    },
    BrowserNotDefined: {
      title: 'Can\'t recognize environment',
      description: 'Environment should be browser application, that can run Javascript'
    },
    SetQuickPreferancesIsNotObject: {
      title: 'Quick preferances object is required',
      description: 'Please pass a plain object with "lang", "culture" and "area" properties'
    },
    InvalidParams: {
      title: 'Params are invalid',
      description: 'Please pass a plain object with "lang", "culture" and "area" properties'
    },
    CantCreateWithoutNode: {
      title: 'You must provide node',
      description: 'Can\'t create DOM element without setting node or text'
    },
    HTMLInvalidTag: {
      title: 'Element tag name (or DOM nodeName) is invalid',
      description: 'To create element, you must provide valid DOM node. See full list of them at here: http://www.w3schools.com/tags/'
    },
    HTMLInvalidAttr: {
      title: 'Attibutes object is invalid',
      description: 'Please pass a valid plain object to apply as an attributes for a DOM node'
    },
    HTMLInvalidData: {
      title: 'Data object is invalid',
      description: 'Please pass a valid plain object to apply as an dataset for a DOM node'
    },
    HTMLInvalidStyles: {
      title: 'Styles object is invalid',
      description: 'Please pass a valid plain object to apply as an style for a DOM node'
    },
    HTMLInvalidText: {
      title: 'Text string is invalid',
      description: 'Please pass a valid string to apply text to DOM node'
    }
  }
};
exports.errors = errors;

var report = function report(err, arg, element) {
  var currentLang = 'en';
  var errObj;
  if (err && typeof err === 'string') errObj = errors[currentLang][err];
  return new Error("\"".concat(err, "\", \"").concat(arg, "\"\n\n"), "".concat(errObj.description), element ? "\n\n".concat(element) : '');
};

exports.report = report;
},{}],"../node_modules/@rackai/domql/src/utils/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "isObject", {
  enumerable: true,
  get: function () {
    return _object.isObject;
  }
});
Object.defineProperty(exports, "isObjectLike", {
  enumerable: true,
  get: function () {
    return _object.isObjectLike;
  }
});
Object.defineProperty(exports, "isFunction", {
  enumerable: true,
  get: function () {
    return _object.isFunction;
  }
});
Object.defineProperty(exports, "isArray", {
  enumerable: true,
  get: function () {
    return _object.isArray;
  }
});
Object.defineProperty(exports, "exec", {
  enumerable: true,
  get: function () {
    return _object.exec;
  }
});
Object.defineProperty(exports, "map", {
  enumerable: true,
  get: function () {
    return _object.map;
  }
});
Object.defineProperty(exports, "deepMerge", {
  enumerable: true,
  get: function () {
    return _object.deepMerge;
  }
});
Object.defineProperty(exports, "deepClone", {
  enumerable: true,
  get: function () {
    return _object.deepClone;
  }
});
Object.defineProperty(exports, "overwrite", {
  enumerable: true,
  get: function () {
    return _object.overwrite;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _object.set;
  }
});
Object.defineProperty(exports, "report", {
  enumerable: true,
  get: function () {
    return _report.report;
  }
});

var _object = require("./object");

var _report = require("./report");
},{"./object":"../node_modules/@rackai/domql/src/utils/object.js","./report":"../node_modules/@rackai/domql/src/utils/report.js"}],"../node_modules/@rackai/domql/src/element/root.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = _interopRequireDefault(require("../utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  node: document ? document.body : (0, _utils.default)('DocumentNotDefined', document)
};
exports.default = _default;
},{"../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/tree.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _root = _interopRequireDefault(require("./root"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _root.default;
exports.default = _default;
},{"./root":"../node_modules/@rackai/domql/src/element/root.js"}],"../node_modules/@rackai/domql/src/event/on.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.input = exports.load = exports.keyUp = exports.keyDown = exports.mouseUp = exports.mouseMove = exports.mouseDown = exports.change = exports.click = exports.render = exports.init = void 0;

var init = function init(param, element) {
  param(element);
};

exports.init = init;

var render = function render(param, element) {
  param(element, element.state);
};

exports.render = render;

var click = function click(param, element) {
  var node = element.node,
      state = element.state;
  node.addEventListener('click', function (event) {
    return param(event, element, state);
  }, true);
};

exports.click = click;

var change = function change(param, element) {
  var node = element.node,
      state = element.state;
  node.addEventListener('change', function (event) {
    return param(event, element, state);
  }, true);
};

exports.change = change;

var mouseDown = function mouseDown(param, element) {
  var node = element.node,
      state = element.state;
  node.addEventListener('mousedown', function (event) {
    return param(event, element, state);
  }, true);
};

exports.mouseDown = mouseDown;

var mouseMove = function mouseMove(param, element) {
  var node = element.node,
      state = element.state;
  node.addEventListener('mousemove', function (event) {
    return param(event, element, state);
  }, true);
};

exports.mouseMove = mouseMove;

var mouseUp = function mouseUp(param, element) {
  var node = element.node,
      state = element.state;
  node.addEventListener('mouseup', function (event) {
    return param(event, element, state);
  }, true);
};

exports.mouseUp = mouseUp;

var keyDown = function keyDown(param, element) {
  var node = element.node,
      state = element.state;
  node.addEventListener('keydown', function (event) {
    return param(event, element, state);
  }, true);
};

exports.keyDown = keyDown;

var keyUp = function keyUp(param, element) {
  var node = element.node,
      state = element.state;
  node.addEventListener('keyup', function (event) {
    return param(event, element, state);
  }, true);
};

exports.keyUp = keyUp;

var load = function load(param, element) {
  var node = element.node,
      state = element.state;
  node.addEventListener('load', function (event) {
    return param(event, element, state);
  }, true);
};

exports.load = load;

var input = function input(param, element) {
  var node = element.node,
      state = element.state;
  node.addEventListener('input', function (event) {
    return param(event, element, state);
  }, true);
};

exports.input = input;
},{}],"../node_modules/@rackai/domql/src/event/can.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = void 0;

var _element = require("../element");

var _utils = require("../utils");

var render = function render(element) {
  var tag = element.tag || 'div';
  var isValid = _element.nodes.body.indexOf(tag) > -1;
  return isValid || (0, _utils.report)('HTMLInvalidTag');
};

exports.render = render;
},{"../element":"../node_modules/@rackai/domql/src/element/index.js","../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/event/is.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.node = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var node = function node(_node) {
  var _window = window,
      Node = _window.Node;
  return _typeof(Node) === 'object' ? _node instanceof Node : _node && _typeof(_node) === 'object' && typeof _node.nodeType === 'number' && typeof _node.tag === 'string';
};

exports.node = node;
},{}],"../node_modules/@rackai/domql/src/event/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.is = exports.can = exports.on = void 0;

var on = _interopRequireWildcard(require("./on"));

exports.on = on;

var can = _interopRequireWildcard(require("./can"));

exports.can = can;

var is = _interopRequireWildcard(require("./is"));

exports.is = is;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
},{"./on":"../node_modules/@rackai/domql/src/event/on.js","./can":"../node_modules/@rackai/domql/src/event/can.js","./is":"../node_modules/@rackai/domql/src/event/is.js"}],"../node_modules/@rackai/domql/src/element/cache.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _event = require("../event");

var _utils = require("../utils");

var _nodes = _interopRequireDefault(require("./nodes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cachedElements = {};

var createNode = function createNode(element) {
  var tag = element.tag;

  if (tag) {
    if (tag === 'string') return document.createTextNode(element.text);else if (tag === 'fragment') {
      return document.createDocumentFragment();
    } else if (tag === 'svg' || tag === 'path') {
      // change that
      return document.createElementNS('http://www.w3.org/2000/svg', tag);
    } else return document.createElement(tag);
  } else {
    return document.createElement('div');
  }
};

var _default = function _default(element) {
  var tag = element.tag,
      key = element.key;
  var tagFromKey = _nodes.default.body.indexOf(key) > -1;

  if (typeof tag !== 'string') {
    if (tagFromKey && tag === true) tag = key;else tag = tagFromKey ? key : 'div';
  }

  element.tag = tag;

  if (!_event.can.render(element)) {
    return (0, _utils.report)('HTMLInvalidTag');
  }

  var cachedTag = cachedElements[tag];
  if (!cachedTag) cachedTag = cachedElements[tag] = createNode(element);
  var clonedNode = cachedTag.cloneNode(true);
  if (tag === 'string') clonedNode.nodeValue = element.text;
  return clonedNode;
};

exports.default = _default;
},{"../event":"../node_modules/@rackai/domql/src/event/index.js","../utils":"../node_modules/@rackai/domql/src/utils/index.js","./nodes":"../node_modules/@rackai/domql/src/element/nodes.js"}],"../node_modules/@rackai/domql/src/element/params/attr.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../utils");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Recursively add attributes to a DOM node
 */
var _default = function _default(params, element, node) {
  if (params) {
    if (!(_typeof(params) === 'object')) (0, _utils.report)('HTMLInvalidAttr', params);

    for (var attr in params) {
      // if (!node) node = element.node
      var val = (0, _utils.exec)(params[attr], element);
      if (val) node.setAttribute(attr, val);else node.removeAttribute(attr);
    }
  }
};

exports.default = _default;
},{"../../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/params/classList.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../utils");

// stringifies class object
var classify = function classify(obj, element) {
  var className = '';

  for (var item in obj) {
    var param = obj[item];
    if (typeof param === 'boolean' && param) className += " ".concat(item);else if (typeof param === 'string') className += " ".concat(param);else if (typeof param === 'function') {
      className += " ".concat((0, _utils.exec)(param, element));
    }
  }

  return className;
};

var classList = function classList(params, element) {
  var node = element.node,
      key = element.key;
  if (typeof params === 'string') element.class = {
    default: params
  };
  if (params === true) params = element.class = {
    key: key
  };
  var className = classify(element.class, element);
  var trimmed = className.replace(/\s+/g, ' ').trim();
  node.classList = trimmed;
};

var _default = classList;
exports.default = _default;
},{"../../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/set.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _create = _interopRequireDefault(require("./create"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var set = function set(params, enter, leave) {
  var element = this;

  if (element.content && element.content.node) {
    // leave(element, () => {
    element.node.removeChild(element.content.node);
    delete element.content; // })
  }

  if (params) {
    // enter(element, () => {
    (0, _create.default)(params, element, 'content'); // })
  }

  return element;
};

var _default = set;
exports.default = _default;
},{"./create":"../node_modules/@rackai/domql/src/element/create.js"}],"../node_modules/@rackai/domql/src/element/params/content.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _set = _interopRequireDefault(require("../set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Appends anything as content
 * an original one as a child
 */
var _default = function _default(param, element, node) {
  if (param && element) {
    _set.default.call(element, param);
  }
};

exports.default = _default;
},{"../set":"../node_modules/@rackai/domql/src/element/set.js"}],"../node_modules/@rackai/domql/src/element/params/data.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _report = _interopRequireDefault(require("../../utils/report"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * Apply data parameters on the DOM nodes
 * this should only work if `showOnNode: true` is passed
 */
var _default = function _default(params, element, node) {
  if (params && params.showOnNode) {
    if (!(_typeof(params) === 'object')) (0, _report.default)('HTMLInvalidData', params); // Apply data params on node

    for (var dataset in params) {
      if (dataset !== 'showOnNode') {
        node.dataset[dataset] = params[dataset];
      }
    }
  }
};

exports.default = _default;
},{"../../utils/report":"../node_modules/@rackai/domql/src/utils/report.js"}],"../node_modules/@rackai/domql/src/element/params/html.js":[function(require,module,exports) {
'use strict';
/**
 * Appends raw HTML as content
 * an original one as a child
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(param, element, node) {
  if (param) {
    // var parser = new window.DOMParser()
    // param = parser.parseFromString(param, 'text/html')
    if (node.nodeName === 'SVG') node.textContent = param;else node.innerHTML = param;
  }
};

exports.default = _default;
},{}],"../node_modules/@rackai/domql/src/element/params/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../utils");

var _report = require("../../utils/report");

/**
 * Recursively add styles to a DOM node
 */
var _default = function _default(params, element, node) {
  if (params) {
    if ((0, _utils.isObject)(params)) (0, _utils.map)(node.style, params, element);else (0, _report.report)('HTMLInvalidStyles', params);
  }
};

exports.default = _default;
},{"../../utils":"../node_modules/@rackai/domql/src/utils/index.js","../../utils/report":"../node_modules/@rackai/domql/src/utils/report.js"}],"../node_modules/@rackai/domql/src/element/assign.js":[function(require,module,exports) {
'use strict';
/**
 * Receives child and parent nodes as parametes
 * and assigns them into real DOM tree
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assignNode = exports.appendNode = void 0;

var appendNode = function appendNode(node, parentNode) {
  parentNode.appendChild(node);
  return node;
};
/**
 * Receives elements and assigns the first
 * parameter as a child of the second one
 */


exports.appendNode = appendNode;

var assignNode = function assignNode(element, parent, key) {
  parent[key || element.key] = element;
  appendNode(element.node, parent.node);
};

exports.assignNode = assignNode;
},{}],"../node_modules/@rackai/domql/src/element/params/text.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _assign = require("../assign");

var _cache = _interopRequireDefault(require("../cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creates a text node and appends into
 * an original one as a child
 */
var _default = function _default(param, element) {
  if (element.tag === 'string') element.node.innerText = param;else {
    param = {
      tag: 'string',
      text: param
    };
    var textNode = (0, _cache.default)(param);
    (0, _assign.appendNode)(textNode, element.node);
  }
};

exports.default = _default;
},{"../assign":"../node_modules/@rackai/domql/src/element/assign.js","../cache":"../node_modules/@rackai/domql/src/element/cache.js"}],"../node_modules/@rackai/domql/src/element/params/state.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../../utils");

var _default = function _default(param, element, node) {
  if (param) element.state = (0, _utils.exec)(param, element);
  return element;
};

exports.default = _default;
},{"../../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/params/registry.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ = require("./");

var _default = {
  attr: _.attr,
  style: _.style,
  text: _.text,
  html: _.html,
  content: _.content,
  data: _.data,
  class: _.classList,
  state: _.state,
  proto: {},
  path: {},
  childProto: {},
  if: {},
  define: {},
  transform: {},
  __cached: {},
  key: {},
  tag: {},
  parent: {},
  node: {},
  set: {},
  update: {},
  on: {}
};
exports.default = _default;
},{"./":"../node_modules/@rackai/domql/src/element/params/index.js"}],"../node_modules/@rackai/domql/src/element/params/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "attr", {
  enumerable: true,
  get: function () {
    return _attr.default;
  }
});
Object.defineProperty(exports, "classList", {
  enumerable: true,
  get: function () {
    return _classList.default;
  }
});
Object.defineProperty(exports, "content", {
  enumerable: true,
  get: function () {
    return _content.default;
  }
});
Object.defineProperty(exports, "data", {
  enumerable: true,
  get: function () {
    return _data.default;
  }
});
Object.defineProperty(exports, "html", {
  enumerable: true,
  get: function () {
    return _html.default;
  }
});
Object.defineProperty(exports, "style", {
  enumerable: true,
  get: function () {
    return _style.default;
  }
});
Object.defineProperty(exports, "text", {
  enumerable: true,
  get: function () {
    return _text.default;
  }
});
Object.defineProperty(exports, "state", {
  enumerable: true,
  get: function () {
    return _state.default;
  }
});
Object.defineProperty(exports, "registry", {
  enumerable: true,
  get: function () {
    return _registry.default;
  }
});

var _attr = _interopRequireDefault(require("./attr"));

var _classList = _interopRequireDefault(require("./classList"));

var _content = _interopRequireDefault(require("./content"));

var _data = _interopRequireDefault(require("./data"));

var _html = _interopRequireDefault(require("./html"));

var _style = _interopRequireDefault(require("./style"));

var _text = _interopRequireDefault(require("./text"));

var _state = _interopRequireDefault(require("./state"));

var _registry = _interopRequireDefault(require("./registry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./attr":"../node_modules/@rackai/domql/src/element/params/attr.js","./classList":"../node_modules/@rackai/domql/src/element/params/classList.js","./content":"../node_modules/@rackai/domql/src/element/params/content.js","./data":"../node_modules/@rackai/domql/src/element/params/data.js","./html":"../node_modules/@rackai/domql/src/element/params/html.js","./style":"../node_modules/@rackai/domql/src/element/params/style.js","./text":"../node_modules/@rackai/domql/src/element/params/text.js","./state":"../node_modules/@rackai/domql/src/element/params/state.js","./registry":"../node_modules/@rackai/domql/src/element/params/registry.js"}],"../node_modules/@rackai/domql/src/element/createNode.js":[function(require,module,exports) {
var define;
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _create = _interopRequireDefault(require("./create"));

var _cache = _interopRequireDefault(require("./cache"));

var _params = require("./params");

var _utils = require("../utils");

var on = _interopRequireWildcard(require("../event/on"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createNode = function createNode(element) {
  // create and assign a node
  var node = element.node;
  var isNewNode;

  if (!node) {
    isNewNode = true;
    node = (0, _cache.default)(element);
    element.node = node;
    node.ref = element;
  } // run define iteration to set params


  if (element.define && (0, _utils.isObject)(element.define)) {
    for (var param in element.define) {
      if (!element[param]) element[param] = element.define[param](void 0, element);
    }
  } // Apply element parameters


  if (element.tag !== 'string' || element.tag !== 'fragment') {
    // apply define
    if ((0, _utils.isObject)(element.define)) {
      var define = element.define;

      for (var _param in define) {
        var execParam = (0, _utils.exec)(element[_param], element);
        element.data[_param] = execParam;
        element[_param] = define[_param](execParam, element);
      }
    } // apply transform


    if ((0, _utils.isObject)(element.transform)) {
      var transform = element.transform;

      for (var _param2 in transform) {
        execParam = (0, _utils.exec)(element[_param2], element);

        if (element.data[_param2]) {
          execParam = (0, _utils.exec)(element.data[_param2], element);
        } else {
          execParam = (0, _utils.exec)(element[_param2], element);
          element.data[_param2] = execParam;
        }

        element[_param2] = transform[_param2](execParam, element);
      }
    } // apply events


    if (isNewNode && (0, _utils.isObject)(element.on)) {
      for (var _param3 in element.on) {
        if (_param3 === 'init' || _param3 === 'render') continue;
        var appliedFunction = element.on[_param3];
        var registeredFunction = on[_param3];

        if (typeof appliedFunction === 'function' && typeof registeredFunction === 'function') {
          registeredFunction(appliedFunction, element);
        } // var definedFunction = element.define && element.define[param]
        // else console.error('Not such function', appliedFunction, registeredFunction)
        // if (typeof appliedFunction === 'function' && typeof definedFunction === 'function') definedFunction(appliedFunction, element)

      }
    }

    for (var _param4 in element) {
      if (_param4 === 'set' || _param4 === 'update' || !element[_param4] === undefined) return;
      execParam = (0, _utils.exec)(element[_param4], element);
      var hasDefine = element.define && element.define[_param4];
      var registeredParam = _params.registry[_param4];

      if (registeredParam) {
        // Check if it's registered param
        if (typeof registeredParam === 'function') {
          registeredParam(execParam, element, node);
        }

        if (_param4 === 'style') _params.registry['class'](element['class'], element, node);
      } else if (element[_param4] && !hasDefine) {
        // Create element
        (0, _create.default)(execParam, element, _param4); // if (isNewNode) create(execParam, element, param)
        // else createNode(execParam)
      }
    }
  } // node.dataset.key = key


  return element;
};

var _default = createNode;
exports.default = _default;
},{"./create":"../node_modules/@rackai/domql/src/element/create.js","./cache":"../node_modules/@rackai/domql/src/element/cache.js","./params":"../node_modules/@rackai/domql/src/element/params/index.js","../utils":"../node_modules/@rackai/domql/src/utils/index.js","../event/on":"../node_modules/@rackai/domql/src/event/on.js"}],"../node_modules/@rackai/domql/src/element/proto.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyPrototype = exports.deepProto = exports.flattenPrototype = exports.mergeProtosArray = exports.flattenProtosAsArray = void 0;

var _utils = require("../utils");

/**
 * Flattens deep level prototypes into an array
 */
var flattenProtosAsArray = function flattenProtosAsArray(proto) {
  var protos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  protos.push(proto);
  if (proto.proto) flattenProtosAsArray(proto.proto, protos);
  return protos;
};
/**
 * Merges array prototypes
 */


exports.flattenProtosAsArray = flattenProtosAsArray;

var mergeProtosArray = function mergeProtosArray(arr) {
  return arr.reduce(function (a, c) {
    return (0, _utils.deepMerge)(a, (0, _utils.deepClone)(c));
  }, {});
};
/**
 * Flattens deep level prototypes into an flat object
 */


exports.mergeProtosArray = mergeProtosArray;

var flattenPrototype = function flattenPrototype(proto) {
  var flattenedArray = flattenProtosAsArray(proto);
  var flattenedObj = mergeProtosArray(flattenedArray);
  if (flattenedObj.proto) delete flattenedObj.proto;
  return (0, _utils.deepClone)(flattenedObj);
};
/**
 * Applies multiple prototype level
 */


exports.flattenPrototype = flattenPrototype;

var deepProto = function deepProto(element, proto) {
  // if proto presented as array
  if ((0, _utils.isArray)(proto)) proto = mergeProtosArray(proto); // flatten prototypal inheritances

  var flatten = flattenPrototype(proto); // merge with prototype

  return (0, _utils.deepMerge)(element, flatten);
};
/**
 * Checks whether element has `proto` or is a part
 * of parent's `childProto` prototype
 */


exports.deepProto = deepProto;

var applyPrototype = function applyPrototype(element) {
  var parent = element.parent,
      proto = element.proto;
  /** Merge with `proto` */

  if (proto) {
    deepProto(element, proto);
  }
  /** Merge with parent's `childProto` */


  if (parent && parent.childProto) {
    deepProto(element, parent.childProto);
  }

  return element;
};

exports.applyPrototype = applyPrototype;
},{"../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/id.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var createID = /*#__PURE__*/regeneratorRuntime.mark(function createID() {
  var index;
  return regeneratorRuntime.wrap(function createID$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          index = 1;

        case 1:
          if (!(index < index + 1)) {
            _context.next = 6;
            break;
          }

          _context.next = 4;
          return index++;

        case 4:
          _context.next = 1;
          break;

        case 6:
        case "end":
          return _context.stop();
      }
    }
  }, createID);
});

var _default = createID();

exports.default = _default;
},{}],"../node_modules/@rackai/domql/src/element/update.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _createNode = _interopRequireDefault(require("./createNode"));

var _utils = require("../utils");

var on = _interopRequireWildcard(require("../event/on"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import applyPrototype from './proto'
var update = function update() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var element = this;
  (0, _utils.overwrite)(element, params);
  element.node.innerHTML = '';
  (0, _createNode.default)(element); // run onRender

  if (element.on && typeof element.on.render === 'function') {
    on.render(element.on.render, element);
  }

  return this;
};

var _default = update;
exports.default = _default;
},{"./createNode":"../node_modules/@rackai/domql/src/element/createNode.js","../utils":"../node_modules/@rackai/domql/src/utils/index.js","../event/on":"../node_modules/@rackai/domql/src/event/on.js"}],"../node_modules/@rackai/domql/src/element/create.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _utils = require("../utils");

var _tree = _interopRequireDefault(require("./tree"));

var _createNode = _interopRequireDefault(require("./createNode"));

var _assign = require("./assign");

var _proto = require("./proto");

var _id = _interopRequireDefault(require("./id"));

var _nodes = _interopRequireDefault(require("./nodes"));

var _set = _interopRequireDefault(require("./set"));

var _update = _interopRequireDefault(require("./update"));

var on = _interopRequireWildcard(require("../event/on"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Creating a domQL element using passed parameters
 */
var create = function create(element, parent, key) {
  // If parent is not given
  if (!parent) parent = _tree.default; // If element is not given

  if (!element) return (0, _utils.report)('CantCreateWithoutNode'); // run onInit

  if (element.on && typeof element.on.init === 'function') {
    on.init(element.on.init, element);
  } // define key


  var assignedKey = element.key || key || _id.default.next().value; // if it already has a node


  if (element.node) {
    return (0, _assign.assignNode)(element, parent, assignedKey);
  } // If element is string


  if (typeof element === 'string' || typeof element === 'number') {
    element = {
      text: element,
      tag: !element.proto && parent.childProto && parent.childProto.tag || _nodes.default.body.indexOf(key) > -1 && key || 'string'
    };
  } // Assign parent reference to the element


  element.parent = parent; // Set the path

  if (!parent.path) parent.path = [];
  element.path = parent.path.concat(assignedKey); // if proto, or inherited proto

  (0, _proto.applyPrototype)(element); // generate a class name

  if (element.class === true) element.class = assignedKey;else if (!element.class && typeof assignedKey === 'string' && assignedKey.charAt(0) === '_') {
    element.class = assignedKey.slice(1);
  } // create and assign a key

  element.key = assignedKey;
  if (typeof element.if === 'function' && !element.if(element)) return void 0; // enable caching in data

  if (!element.data) element.data = {}; // create Element class

  (0, _createNode.default)(element);
  element.set = _set.default;
  element.update = _update.default;
  (0, _assign.assignNode)(element, parent, key); // run onRender

  if (element.on && typeof element.on.render === 'function') {
    on.render(element.on.render, element);
  }

  return element;
};

var _default = create;
exports.default = _default;
},{"../utils":"../node_modules/@rackai/domql/src/utils/index.js","./tree":"../node_modules/@rackai/domql/src/element/tree.js","./createNode":"../node_modules/@rackai/domql/src/element/createNode.js","./assign":"../node_modules/@rackai/domql/src/element/assign.js","./proto":"../node_modules/@rackai/domql/src/element/proto.js","./id":"../node_modules/@rackai/domql/src/element/id.js","./nodes":"../node_modules/@rackai/domql/src/element/nodes.js","./set":"../node_modules/@rackai/domql/src/element/set.js","./update":"../node_modules/@rackai/domql/src/element/update.js","../event/on":"../node_modules/@rackai/domql/src/event/on.js"}],"../node_modules/@rackai/domql/src/element/define.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _params = require("./params");

var _utils = require("../utils");

var _default = function _default(params, options) {
  var overwrite = options.overwrite;

  for (var param in params) {
    if (_params.registry[param] && !overwrite) {
      (0, _utils.report)('OverwriteToBuiltin', param);
    } else _params.registry[param] = params[param];
  }
};

exports.default = _default;
},{"./params":"../node_modules/@rackai/domql/src/element/params/index.js","../utils":"../node_modules/@rackai/domql/src/utils/index.js"}],"../node_modules/@rackai/domql/src/element/parse.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _create = _interopRequireDefault(require("./create"));

var _assign = require("./assign");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var parse = function parse(element) {
  var virtualTree = {
    node: document.createElement('div')
  };
  if (element && element.node) (0, _assign.assignNode)(element, virtualTree);else (0, _create.default)(element, virtualTree);
  return virtualTree.node.innerHTML;
};

var _default = parse;
exports.default = _default;
},{"./create":"../node_modules/@rackai/domql/src/element/create.js","./assign":"../node_modules/@rackai/domql/src/element/assign.js"}],"../node_modules/@rackai/domql/src/element/index.js":[function(require,module,exports) {

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "nodes", {
  enumerable: true,
  get: function () {
    return _nodes.default;
  }
});
Object.defineProperty(exports, "root", {
  enumerable: true,
  get: function () {
    return _root.default;
  }
});
Object.defineProperty(exports, "tree", {
  enumerable: true,
  get: function () {
    return _tree.default;
  }
});
Object.defineProperty(exports, "create", {
  enumerable: true,
  get: function () {
    return _create.default;
  }
});
Object.defineProperty(exports, "createNode", {
  enumerable: true,
  get: function () {
    return _createNode.default;
  }
});
Object.defineProperty(exports, "assign", {
  enumerable: true,
  get: function () {
    return _assign.default;
  }
});
Object.defineProperty(exports, "define", {
  enumerable: true,
  get: function () {
    return _define.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function () {
    return _parse.default;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _set.default;
  }
});

var _nodes = _interopRequireDefault(require("./nodes"));

var _root = _interopRequireDefault(require("./root"));

var _tree = _interopRequireDefault(require("./tree"));

var _create = _interopRequireDefault(require("./create"));

var _createNode = _interopRequireDefault(require("./createNode"));

var _assign = _interopRequireDefault(require("./assign"));

var _define = _interopRequireDefault(require("./define"));

var _parse = _interopRequireDefault(require("./parse"));

var _set = _interopRequireDefault(require("./set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./nodes":"../node_modules/@rackai/domql/src/element/nodes.js","./root":"../node_modules/@rackai/domql/src/element/root.js","./tree":"../node_modules/@rackai/domql/src/element/tree.js","./create":"../node_modules/@rackai/domql/src/element/create.js","./createNode":"../node_modules/@rackai/domql/src/element/createNode.js","./assign":"../node_modules/@rackai/domql/src/element/assign.js","./define":"../node_modules/@rackai/domql/src/element/define.js","./parse":"../node_modules/@rackai/domql/src/element/parse.js","./set":"../node_modules/@rackai/domql/src/element/set.js"}],"../node_modules/@rackai/domql/src/index.js":[function(require,module,exports) {

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("regenerator-runtime/runtime");

var _element = require("./element");

var _default = {
  create: _element.create,
  parse: _element.parse,
  define: _element.define,
  tree: _element.tree
};
exports.default = _default;
},{"regenerator-runtime/runtime":"../node_modules/@rackai/domql/node_modules/regenerator-runtime/runtime.js","./element":"../node_modules/@rackai/domql/src/element/index.js"}],"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/sequence.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  'minor-second': 1.067,
  'major-second': 1.125,
  'minor-third': 1.2,
  'major-third': 1.25,
  'perfect-fourth': 1.333,
  'augmented-fourth': 1.414,
  'perfect-fifth': 1.5,
  'phi': 1.618,
  // golden-ratio
  'square-root-3': 1.73205,
  // theodorus
  'square-root-5': 2.23,
  // pythagoras
  'pi': 3.14 // archimedes

};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/color.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var black = '#000000';
var blue = '#5081BB';
var green = '#4C904B';
var cyan = '#63B7A4';
var yellow = '#DAB648';
var orange = '#C37234';
var purple = '#7938B2';
var red = '#D13B3B';
var peach = '#EF604E';
var pink = '#9A36AF';
var white = '#FFFFFF';
var colors = {
  black,
  blue,
  green,
  cyan,
  yellow,
  orange,
  purple,
  red,
  peach,
  pink,
  white
};
var _default = {};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/theme.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var themeA = {
  text: 'blue',
  background: 'white',
  border: 'black',
  // .opacity(0.2),
  helpers: [],
  inverse: {} // schemeAInverse

};
var _default = {};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/box.js":[function(require,module,exports) {

},{}],"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/size.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequence = _interopRequireDefault(require("./sequence"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  base: 16,
  ratio: _sequence.default['phi']
};
exports.default = _default;
},{"./sequence":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/sequence.js"}],"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/typography.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/unit.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = 'px';
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Sequence", {
  enumerable: true,
  get: function () {
    return _sequence.default;
  }
});
Object.defineProperty(exports, "Color", {
  enumerable: true,
  get: function () {
    return _color.default;
  }
});
Object.defineProperty(exports, "Theme", {
  enumerable: true,
  get: function () {
    return _theme.default;
  }
});
Object.defineProperty(exports, "Box", {
  enumerable: true,
  get: function () {
    return _box.default;
  }
});
Object.defineProperty(exports, "Size", {
  enumerable: true,
  get: function () {
    return _size.default;
  }
});
Object.defineProperty(exports, "Typography", {
  enumerable: true,
  get: function () {
    return _typography.default;
  }
});
Object.defineProperty(exports, "Unit", {
  enumerable: true,
  get: function () {
    return _unit.default;
  }
});

var _sequence = _interopRequireDefault(require("./sequence"));

var _color = _interopRequireDefault(require("./color"));

var _theme = _interopRequireDefault(require("./theme"));

var _box = _interopRequireDefault(require("./box"));

var _size = _interopRequireDefault(require("./size"));

var _typography = _interopRequireDefault(require("./typography"));

var _unit = _interopRequireDefault(require("./unit"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./sequence":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/sequence.js","./color":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/color.js","./theme":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/theme.js","./box":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/box.js","./size":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/size.js","./typography":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/typography.js","./unit":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/unit.js"}],"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/utils/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFontFace = exports.setCustomFont = exports.getFontFormat = exports.opacify = exports.mixTwoRGBA = exports.mixTwoRGB = exports.hexToRGBA = exports.hexToRGB = exports.mixTwoColors = exports.colorStringToRGBAArray = exports.merge = void 0;

const merge = (obj, original) => {
  for (const e in original) {
    const objProp = obj[e];
    const originalProp = original[e];

    if (objProp === undefined) {
      obj[e] = originalProp;
    }
  }

  return obj;
};

exports.merge = merge;

const colorStringToRGBAArray = color => {
  if (color === '') return;
  if (color.toLowerCase() === 'transparent') return [0, 0, 0, 0]; // convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA

  if (color[0] === '#') {
    if (color.length < 7) {
      color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] + (color.length > 4 ? color[4] + color[4] : '');
    }

    return [parseInt(color.substr(1, 2), 16), parseInt(color.substr(3, 2), 16), parseInt(color.substr(5, 2), 16), color.length > 7 ? parseInt(color.substr(7, 2), 16) / 255 : 1];
  } // convert named colors


  if (color.indexOf('rgb') === -1) {
    // intentionally use unknown tag to lower chances of css rule override with !important
    var elem = document.body.appendChild(document.createElement('fictum')); // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14

    var flag = 'rgb(1, 2, 3)';
    elem.style.color = flag; // color set failed - some monstrous css rule is probably taking over the color of our object

    if (elem.style.color !== flag) return;
    elem.style.color = color;
    if (elem.style.color === flag || elem.style.color === '') return; // color parse failed

    color = window.getComputedStyle(elem).color;
    document.body.removeChild(elem);
  } // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below


  if (color.indexOf('rgb') === 0) {
    if (color.indexOf('rgba') === -1) color = `${color}, 1`;
    return color.match(/[\.\d]+/g).map(a => +a); // eslint-disable-line
  }
};

exports.colorStringToRGBAArray = colorStringToRGBAArray;

const mixTwoColors = (colorA, colorB, range = 0.5) => {
  colorA = colorStringToRGBAArray(colorA);
  colorB = colorStringToRGBAArray(colorB);
  return mixTwoRGBA(colorA, colorB, range);
};

exports.mixTwoColors = mixTwoColors;

const hexToRGB = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgb(${r},${g},${b})`;
};

exports.hexToRGB = hexToRGB;

const hexToRGBA = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

exports.hexToRGBA = hexToRGBA;

const mixTwoRGB = (colorA, colorB, range = 0.5) => {
  let arr = [];

  for (let i = 0; i < 3; i++) {
    arr[i] = Math.round(colorA[i] + (colorB[i] - colorA[i]) * range);
  }

  return `rgb(${arr})`;
};

exports.mixTwoRGB = mixTwoRGB;

const mixTwoRGBA = (colorA, colorB, range = 0.5) => {
  let arr = [];

  for (let i = 0; i < 4; i++) {
    let round = i === 3 ? x => x : Math.round;
    arr[i] = round(colorA[i] + (colorB[i] - colorA[i]) * range);
  }

  return `rgba(${arr})`;
};

exports.mixTwoRGBA = mixTwoRGBA;

const opacify = (color, opacity) => {
  let arr = colorStringToRGBAArray(color);
  arr[3] = opacity;
  return `rgba(${arr})`;
};

exports.opacify = opacify;

const getFontFormat = url => url.split(/[#?]/)[0].split('.').pop().trim();

exports.getFontFormat = getFontFormat;

const setCustomFont = (name, weight, url) => `@font-face {
  font-family: '${name}';
  font-style: normal;
  font-weight: ${weight};
  src: url('${url}') format('${getFontFormat(url)}');
}`;

exports.setCustomFont = setCustomFont;

const getFontFace = Library => {
  var fonts = '';

  for (var name in Library) {
    var font = Library[name];

    for (var weight in font) {
      var url = font[weight];
      fonts += `\n${setCustomFont(name, weight, url)}`;
    }
  }

  return fonts;
};

exports.getFontFace = getFontFace;
},{}],"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/methods/set.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _config = require("../config");

var _utils = require("../utils");

var set = (kind, ...props) => {
  if (kind === 'color') {
    var Colors = props[0];

    for (let c in Colors) {
      _config.Color[c] = Colors[c];
    }

    return Colors;
  } else if (kind === 'theme') {
    props.map(value => {
      var {
        name
      } = value;
      _config.Theme[name] = value;
    });
    return _config.Theme;
  } else if (kind === 'typography') {
    props.map(value => {
      var {
        name
      } = value;
      delete value.name;
      _config.Typography[name] = value;
    });
    return (0, _utils.getFontFace)(_config.Typography);
  }
};

var _default = set;
exports.default = _default;
},{"../config":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/index.js","../utils":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/utils/index.js"}],"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/methods/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _set.default;
  }
});

var _set = _interopRequireDefault(require("./set"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./set":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/methods/set.js"}],"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _methods.set;
  }
});
Object.defineProperty(exports, "Sequence", {
  enumerable: true,
  get: function () {
    return _config.Sequence;
  }
});
Object.defineProperty(exports, "Color", {
  enumerable: true,
  get: function () {
    return _config.Color;
  }
});
Object.defineProperty(exports, "Theme", {
  enumerable: true,
  get: function () {
    return _config.Theme;
  }
});
Object.defineProperty(exports, "Box", {
  enumerable: true,
  get: function () {
    return _config.Box;
  }
});
Object.defineProperty(exports, "Size", {
  enumerable: true,
  get: function () {
    return _config.Size;
  }
});
Object.defineProperty(exports, "Typography", {
  enumerable: true,
  get: function () {
    return _config.Typography;
  }
});
Object.defineProperty(exports, "Unit", {
  enumerable: true,
  get: function () {
    return _config.Unit;
  }
});
Object.defineProperty(exports, "colorStringToRGBAArray", {
  enumerable: true,
  get: function () {
    return _utils.colorStringToRGBAArray;
  }
});
Object.defineProperty(exports, "opacify", {
  enumerable: true,
  get: function () {
    return _utils.opacify;
  }
});
Object.defineProperty(exports, "mixTwoColors", {
  enumerable: true,
  get: function () {
    return _utils.mixTwoColors;
  }
});
Object.defineProperty(exports, "hexToRGB", {
  enumerable: true,
  get: function () {
    return _utils.hexToRGB;
  }
});
Object.defineProperty(exports, "hexToRGBA", {
  enumerable: true,
  get: function () {
    return _utils.hexToRGBA;
  }
});
Object.defineProperty(exports, "mixTwoRGB", {
  enumerable: true,
  get: function () {
    return _utils.mixTwoRGB;
  }
});
Object.defineProperty(exports, "mixTwoRGBA", {
  enumerable: true,
  get: function () {
    return _utils.mixTwoRGBA;
  }
});
Object.defineProperty(exports, "getFontFormat", {
  enumerable: true,
  get: function () {
    return _utils.getFontFormat;
  }
});
Object.defineProperty(exports, "setCustomFont", {
  enumerable: true,
  get: function () {
    return _utils.setCustomFont;
  }
});
Object.defineProperty(exports, "getFontFace", {
  enumerable: true,
  get: function () {
    return _utils.getFontFace;
  }
});

var _methods = require("./methods");

var _config = require("./config");

var _utils = require("./utils");
},{"./methods":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/methods/index.js","./config":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/config/index.js","./utils":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/utils/index.js"}],"../node_modules/@rackai/symbols/src/Shape/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.size = exports.depth = exports.round = exports.shape = exports.style = void 0;

var _scratch = require("@rackai/scratch");

var style = {
  border: `1px solid transparent`,
  boxSizing: 'border-box'
};
exports.style = style;
var round = {
  0: {
    borderRadius: 0
  },
  4: {
    borderRadius: 4
  },
  6: {
    borderRadius: 6
  },
  10: {
    borderRadius: 10
  },
  16: {
    borderRadius: 16
  },
  26: {
    borderRadius: 26
  },
  42: {
    borderRadius: 42
  }
};
exports.round = round;
var depth = {
  4: {
    boxShadow: `rgba(0,0,0,.10) 0 2${_scratch.Unit} 4${_scratch.Unit}`
  },
  6: {
    boxShadow: `rgba(0,0,0,.10) 0 3${_scratch.Unit} 6${_scratch.Unit}`
  },
  10: {
    boxShadow: `rgba(0,0,0,.10) 0 4${_scratch.Unit} 10${_scratch.Unit}`
  },
  16: {
    boxShadow: `rgba(0,0,0,.10) 0 8${_scratch.Unit} 16${_scratch.Unit}`
  },
  26: {
    boxShadow: `rgba(0,0,0,.10) 0 14${_scratch.Unit} 26${_scratch.Unit}`
  },
  42: {
    boxShadow: `rgba(0,0,0,.10) 0 20${_scratch.Unit} 42${_scratch.Unit}`
  }
};
exports.depth = depth;
var shape = {
  rectangle: {},
  circle: {
    borderRadius: '100%'
  },
  bubble: {},
  tooltip: {}
};
exports.shape = shape;
var size = {
  default: {
    height: `${Math.pow(_scratch.Size.ratio, 2)}em`,
    padding: `0 ${_scratch.Size.ratio}em`,
    fontSize: `${_scratch.Size.base}${_scratch.Unit}`,
    lineHeight: `${_scratch.Size.base}${_scratch.Unit}`
  }
};
exports.size = size;
},{"@rackai/scratch":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/index.js"}],"../node_modules/@rackai/symbols/src/Shape/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scratch = require("@rackai/scratch");

var _style = require("./style");

var Shape = {
  style: _style.style,
  class: {
    shape: element => _style.shape[element.shape],
    depth: element => _style.depth[element.depth],
    round: element => _style.round[element.round],
    size: element => _style.size[element.size],
    theme: element => _scratch.Theme[element.theme]
  },
  define: {
    shape: param => param || 'rectangle',
    depth: param => param !== undefined ? param : 10,
    round: param => param !== undefined ? param : 6,
    size: param => param || 'default',
    theme: param => param || Object.keys(_scratch.Theme)[0] || ''
  } // mode: {
  //   dark: {
  //     theme: 'white'
  //   }
  // }
  // theme: {
  //   default: 'primary',
  //   dark: 'whiteish'
  // }
  // size: {
  //   default: 'auto',
  //   mobile: 'fit'
  // }
  // spacing: {
  //   default: ratio.phi,
  //   mobile: ratio.perfect
  // }

};
var _default = Shape;
exports.default = _default;
},{"@rackai/scratch":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/index.js","./style":"../node_modules/@rackai/symbols/src/Shape/style.js"}],"../node_modules/@rackai/symbols/src/SVG/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var useSVGSymbol = file => `<use xlink:href="${file}" />`; // create icon


var _default = {
  tag: 'svg',
  define: {
    file: (param, element) => useSVGSymbol(param)
  },
  html: element => element.file || useSVGSymbol(element.key)
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow/bold/left.svg":[function(require,module,exports) {
module.exports="/left.71e84d4c.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow/bold/right.svg":[function(require,module,exports) {
module.exports="/right.2632fccf.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow/bold/up.svg":[function(require,module,exports) {
module.exports="/up.f7f7f85f.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow/bold/down.svg":[function(require,module,exports) {
module.exports="/down.df03a0c2.svg";
},{}],"../node_modules/@rackai/symbols/src/Icon/svg/arrow/bold/index.js":[function(require,module,exports) {
'use strict'; // arrows/bold

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _left = _interopRequireDefault(require("./left.svg"));

var _right = _interopRequireDefault(require("./right.svg"));

var _up = _interopRequireDefault(require("./up.svg"));

var _down = _interopRequireDefault(require("./down.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  left: _left.default,
  right: _right.default,
  up: _up.default,
  down: _down.default
};
exports.default = _default;
},{"./left.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow/bold/left.svg","./right.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow/bold/right.svg","./up.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow/bold/up.svg","./down.svg":"../node_modules/@rackai/symbols/src/Icon/svg/arrow/bold/down.svg"}],"../node_modules/@rackai/symbols/src/Icon/svg/index.js":[function(require,module,exports) {
'use strict'; // arrows

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bold = _interopRequireDefault(require("./arrow/bold"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = { ..._bold.default
};
exports.default = _default;
},{"./arrow/bold":"../node_modules/@rackai/symbols/src/Icon/svg/arrow/bold/index.js"}],"../node_modules/@rackai/symbols/src/Icon/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  display: 'inline-block'
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/Icon/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _svg = _interopRequireDefault(require("./svg"));

var _style = _interopRequireDefault(require("./style"));

var _SVG = _interopRequireDefault(require("../SVG"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  proto: _SVG.default,
  style: _style.default,
  define: {
    name: param => param
  },
  file: element => _svg.default[element.name || element.key],
  attr: {
    viewBox: '0 0 16 16'
  }
};
exports.default = _default;
},{"./svg":"../node_modules/@rackai/symbols/src/Icon/svg/index.js","./style":"../node_modules/@rackai/symbols/src/Icon/style.js","../SVG":"../node_modules/@rackai/symbols/src/SVG/index.js"}],"../node_modules/@rackai/symbols/src/IconText/style.js":[function(require,module,exports) {
'use strict'; // import { Sequence, Size, Unit } from 'scratch'

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  display: 'flex',
  alignItems: 'center',
  alignContent: 'center',
  lineHeight: 1,
  '> svg': {
    marginInlineEnd: `${0.35}em`
  }
};
exports.default = _default;
},{}],"../node_modules/@rackai/symbols/src/IconText/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _style = _interopRequireDefault(require("./style"));

var _ = require("..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  style: _style.default,
  define: {
    icon: param => param || 'left'
  },
  _icon: {
    proto: _.Icon,
    name: element => element.parent.icon
  },
  text: ''
};
exports.default = _default;
},{"./style":"../node_modules/@rackai/symbols/src/IconText/style.js","..":"../node_modules/@rackai/symbols/src/index.js"}],"../node_modules/@rackai/symbols/src/Button/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _scratch = require("@rackai/scratch");

var primaryFont = Object.keys(_scratch.Typography)[0];
var defaultFont = primaryFont || '--system-default';
var _default = {
  appearance: 'none',
  outline: 0,
  cursor: 'pointer',
  fontFamily: 'inherit'
};
exports.default = _default;
},{"@rackai/scratch":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/index.js"}],"../node_modules/@rackai/symbols/src/Button/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _style = _interopRequireDefault(require("./style"));

var _ = require("..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  proto: _.Shape,
  tag: 'button',
  style: _style.default
};
exports.default = _default;
},{"./style":"../node_modules/@rackai/symbols/src/Button/style.js","..":"../node_modules/@rackai/symbols/src/index.js"}],"../node_modules/@rackai/symbols/src/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Sequence", {
  enumerable: true,
  get: function () {
    return _scratch.Sequence;
  }
});
Object.defineProperty(exports, "Color", {
  enumerable: true,
  get: function () {
    return _scratch.Color;
  }
});
Object.defineProperty(exports, "Theme", {
  enumerable: true,
  get: function () {
    return _scratch.Theme;
  }
});
Object.defineProperty(exports, "Box", {
  enumerable: true,
  get: function () {
    return _scratch.Box;
  }
});
Object.defineProperty(exports, "Size", {
  enumerable: true,
  get: function () {
    return _scratch.Size;
  }
});
Object.defineProperty(exports, "Typography", {
  enumerable: true,
  get: function () {
    return _scratch.Typography;
  }
});
Object.defineProperty(exports, "Unit", {
  enumerable: true,
  get: function () {
    return _scratch.Unit;
  }
});
Object.defineProperty(exports, "set", {
  enumerable: true,
  get: function () {
    return _scratch.set;
  }
});
Object.defineProperty(exports, "colorStringToRGBAArray", {
  enumerable: true,
  get: function () {
    return _scratch.colorStringToRGBAArray;
  }
});
Object.defineProperty(exports, "opacify", {
  enumerable: true,
  get: function () {
    return _scratch.opacify;
  }
});
Object.defineProperty(exports, "mixTwoColors", {
  enumerable: true,
  get: function () {
    return _scratch.mixTwoColors;
  }
});
Object.defineProperty(exports, "hexToRGB", {
  enumerable: true,
  get: function () {
    return _scratch.hexToRGB;
  }
});
Object.defineProperty(exports, "hexToRGBA", {
  enumerable: true,
  get: function () {
    return _scratch.hexToRGBA;
  }
});
Object.defineProperty(exports, "mixTwoRGB", {
  enumerable: true,
  get: function () {
    return _scratch.mixTwoRGB;
  }
});
Object.defineProperty(exports, "mixTwoRGBA", {
  enumerable: true,
  get: function () {
    return _scratch.mixTwoRGBA;
  }
});
Object.defineProperty(exports, "getFontFormat", {
  enumerable: true,
  get: function () {
    return _scratch.getFontFormat;
  }
});
Object.defineProperty(exports, "setCustomFont", {
  enumerable: true,
  get: function () {
    return _scratch.setCustomFont;
  }
});
Object.defineProperty(exports, "getFontFace", {
  enumerable: true,
  get: function () {
    return _scratch.getFontFace;
  }
});
Object.defineProperty(exports, "Shape", {
  enumerable: true,
  get: function () {
    return _Shape.default;
  }
});
Object.defineProperty(exports, "SVG", {
  enumerable: true,
  get: function () {
    return _SVG.default;
  }
});
Object.defineProperty(exports, "Icon", {
  enumerable: true,
  get: function () {
    return _Icon.default;
  }
});
Object.defineProperty(exports, "IconText", {
  enumerable: true,
  get: function () {
    return _IconText.default;
  }
});
Object.defineProperty(exports, "Button", {
  enumerable: true,
  get: function () {
    return _Button.default;
  }
});

var _scratch = require("@rackai/scratch");

var _Shape = _interopRequireDefault(require("./Shape"));

var _SVG = _interopRequireDefault(require("./SVG"));

var _Icon = _interopRequireDefault(require("./Icon"));

var _IconText = _interopRequireDefault(require("./IconText"));

var _Button = _interopRequireDefault(require("./Button"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"@rackai/scratch":"../node_modules/@rackai/symbols/node_modules/@rackai/scratch/src/index.js","./Shape":"../node_modules/@rackai/symbols/src/Shape/index.js","./SVG":"../node_modules/@rackai/symbols/src/SVG/index.js","./Icon":"../node_modules/@rackai/symbols/src/Icon/index.js","./IconText":"../node_modules/@rackai/symbols/src/IconText/index.js","./Button":"../node_modules/@rackai/symbols/src/Button/index.js"}],"../node_modules/@emotion/sheet/dist/sheet.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StyleSheet = void 0;

/*

Based off glamor's StyleSheet, thanks Sunil ❤️

high performance StyleSheet for css-in-js systems

- uses multiple style tags behind the scenes for millions of rules
- uses `insertRule` for appending in production for *much* faster performance

// usage

import { StyleSheet } from '@emotion/sheet'

let styleSheet = new StyleSheet({ key: '', container: document.head })

styleSheet.insert('#box { border: 1px solid red; }')
- appends a css rule into the stylesheet

styleSheet.flush()
- empties the stylesheet of all its contents

*/
// $FlowFixMe
function sheetForTag(tag) {
  if (tag.sheet) {
    // $FlowFixMe
    return tag.sheet;
  } // this weirdness brought to you by firefox

  /* istanbul ignore next */


  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      // $FlowFixMe
      return document.styleSheets[i];
    }
  }
}

function createStyleElement(options) {
  var tag = document.createElement('style');
  tag.setAttribute('data-emotion', options.key);

  if (options.nonce !== undefined) {
    tag.setAttribute('nonce', options.nonce);
  }

  tag.appendChild(document.createTextNode(''));
  return tag;
}

var StyleSheet = /*#__PURE__*/function () {
  function StyleSheet(options) {
    this.isSpeedy = options.speedy === undefined ? "development" === 'production' : options.speedy;
    this.tags = [];
    this.ctr = 0;
    this.nonce = options.nonce; // key is the value of the data-emotion attribute, it's used to identify different sheets

    this.key = options.key;
    this.container = options.container;
    this.before = null;
  }

  var _proto = StyleSheet.prototype;

  _proto.insert = function insert(rule) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      var _tag = createStyleElement(this);

      var before;

      if (this.tags.length === 0) {
        before = this.before;
      } else {
        before = this.tags[this.tags.length - 1].nextSibling;
      }

      this.container.insertBefore(_tag, before);
      this.tags.push(_tag);
    }

    var tag = this.tags[this.tags.length - 1];

    if (this.isSpeedy) {
      var sheet = sheetForTag(tag);

      try {
        // this is a really hot path
        // we check the second character first because having "i"
        // as the second character will happen less often than
        // having "@" as the first character
        var isImportRule = rule.charCodeAt(1) === 105 && rule.charCodeAt(0) === 64; // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools

        sheet.insertRule(rule, // we need to insert @import rules before anything else
        // otherwise there will be an error
        // technically this means that the @import rules will
        // _usually_(not always since there could be multiple style tags)
        // be the first ones in prod and generally later in dev
        // this shouldn't really matter in the real world though
        // @import is generally only used for font faces from google fonts and etc.
        // so while this could be technically correct then it would be slower and larger
        // for a tiny bit of correctness that won't matter in the real world
        isImportRule ? 0 : sheet.cssRules.length);
      } catch (e) {
        if ("development" !== 'production') {
          console.warn("There was a problem inserting the following rule: \"" + rule + "\"", e);
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule));
    }

    this.ctr++;
  };

  _proto.flush = function flush() {
    // $FlowFixMe
    this.tags.forEach(function (tag) {
      return tag.parentNode.removeChild(tag);
    });
    this.tags = [];
    this.ctr = 0;
  };

  return StyleSheet;
}();

exports.StyleSheet = StyleSheet;
},{}],"../node_modules/@emotion/stylis/dist/stylis.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function stylis_min(W) {
  function M(d, c, e, h, a) {
    for (var m = 0, b = 0, v = 0, n = 0, q, g, x = 0, K = 0, k, u = k = q = 0, l = 0, r = 0, I = 0, t = 0, B = e.length, J = B - 1, y, f = '', p = '', F = '', G = '', C; l < B;) {
      g = e.charCodeAt(l);
      l === J && 0 !== b + n + v + m && (0 !== b && (g = 47 === b ? 10 : 47), n = v = m = 0, B++, J++);

      if (0 === b + n + v + m) {
        if (l === J && (0 < r && (f = f.replace(N, '')), 0 < f.trim().length)) {
          switch (g) {
            case 32:
            case 9:
            case 59:
            case 13:
            case 10:
              break;

            default:
              f += e.charAt(l);
          }

          g = 59;
        }

        switch (g) {
          case 123:
            f = f.trim();
            q = f.charCodeAt(0);
            k = 1;

            for (t = ++l; l < B;) {
              switch (g = e.charCodeAt(l)) {
                case 123:
                  k++;
                  break;

                case 125:
                  k--;
                  break;

                case 47:
                  switch (g = e.charCodeAt(l + 1)) {
                    case 42:
                    case 47:
                      a: {
                        for (u = l + 1; u < J; ++u) {
                          switch (e.charCodeAt(u)) {
                            case 47:
                              if (42 === g && 42 === e.charCodeAt(u - 1) && l + 2 !== u) {
                                l = u + 1;
                                break a;
                              }

                              break;

                            case 10:
                              if (47 === g) {
                                l = u + 1;
                                break a;
                              }

                          }
                        }

                        l = u;
                      }

                  }

                  break;

                case 91:
                  g++;

                case 40:
                  g++;

                case 34:
                case 39:
                  for (; l++ < J && e.charCodeAt(l) !== g;) {}

              }

              if (0 === k) break;
              l++;
            }

            k = e.substring(t, l);
            0 === q && (q = (f = f.replace(ca, '').trim()).charCodeAt(0));

            switch (q) {
              case 64:
                0 < r && (f = f.replace(N, ''));
                g = f.charCodeAt(1);

                switch (g) {
                  case 100:
                  case 109:
                  case 115:
                  case 45:
                    r = c;
                    break;

                  default:
                    r = O;
                }

                k = M(c, r, k, g, a + 1);
                t = k.length;
                0 < A && (r = X(O, f, I), C = H(3, k, r, c, D, z, t, g, a, h), f = r.join(''), void 0 !== C && 0 === (t = (k = C.trim()).length) && (g = 0, k = ''));
                if (0 < t) switch (g) {
                  case 115:
                    f = f.replace(da, ea);

                  case 100:
                  case 109:
                  case 45:
                    k = f + '{' + k + '}';
                    break;

                  case 107:
                    f = f.replace(fa, '$1 $2');
                    k = f + '{' + k + '}';
                    k = 1 === w || 2 === w && L('@' + k, 3) ? '@-webkit-' + k + '@' + k : '@' + k;
                    break;

                  default:
                    k = f + k, 112 === h && (k = (p += k, ''));
                } else k = '';
                break;

              default:
                k = M(c, X(c, f, I), k, h, a + 1);
            }

            F += k;
            k = I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
            break;

          case 125:
          case 59:
            f = (0 < r ? f.replace(N, '') : f).trim();
            if (1 < (t = f.length)) switch (0 === u && (q = f.charCodeAt(0), 45 === q || 96 < q && 123 > q) && (t = (f = f.replace(' ', ':')).length), 0 < A && void 0 !== (C = H(1, f, c, d, D, z, p.length, h, a, h)) && 0 === (t = (f = C.trim()).length) && (f = '\x00\x00'), q = f.charCodeAt(0), g = f.charCodeAt(1), q) {
              case 0:
                break;

              case 64:
                if (105 === g || 99 === g) {
                  G += f + e.charAt(l);
                  break;
                }

              default:
                58 !== f.charCodeAt(t - 1) && (p += P(f, q, g, f.charCodeAt(2)));
            }
            I = r = u = q = 0;
            f = '';
            g = e.charCodeAt(++l);
        }
      }

      switch (g) {
        case 13:
        case 10:
          47 === b ? b = 0 : 0 === 1 + q && 107 !== h && 0 < f.length && (r = 1, f += '\x00');
          0 < A * Y && H(0, f, c, d, D, z, p.length, h, a, h);
          z = 1;
          D++;
          break;

        case 59:
        case 125:
          if (0 === b + n + v + m) {
            z++;
            break;
          }

        default:
          z++;
          y = e.charAt(l);

          switch (g) {
            case 9:
            case 32:
              if (0 === n + m + b) switch (x) {
                case 44:
                case 58:
                case 9:
                case 32:
                  y = '';
                  break;

                default:
                  32 !== g && (y = ' ');
              }
              break;

            case 0:
              y = '\\0';
              break;

            case 12:
              y = '\\f';
              break;

            case 11:
              y = '\\v';
              break;

            case 38:
              0 === n + b + m && (r = I = 1, y = '\f' + y);
              break;

            case 108:
              if (0 === n + b + m + E && 0 < u) switch (l - u) {
                case 2:
                  112 === x && 58 === e.charCodeAt(l - 3) && (E = x);

                case 8:
                  111 === K && (E = K);
              }
              break;

            case 58:
              0 === n + b + m && (u = l);
              break;

            case 44:
              0 === b + v + n + m && (r = 1, y += '\r');
              break;

            case 34:
            case 39:
              0 === b && (n = n === g ? 0 : 0 === n ? g : n);
              break;

            case 91:
              0 === n + b + v && m++;
              break;

            case 93:
              0 === n + b + v && m--;
              break;

            case 41:
              0 === n + b + m && v--;
              break;

            case 40:
              if (0 === n + b + m) {
                if (0 === q) switch (2 * x + 3 * K) {
                  case 533:
                    break;

                  default:
                    q = 1;
                }
                v++;
              }

              break;

            case 64:
              0 === b + v + n + m + u + k && (k = 1);
              break;

            case 42:
            case 47:
              if (!(0 < n + m + v)) switch (b) {
                case 0:
                  switch (2 * g + 3 * e.charCodeAt(l + 1)) {
                    case 235:
                      b = 47;
                      break;

                    case 220:
                      t = l, b = 42;
                  }

                  break;

                case 42:
                  47 === g && 42 === x && t + 2 !== l && (33 === e.charCodeAt(t + 2) && (p += e.substring(t, l + 1)), y = '', b = 0);
              }
          }

          0 === b && (f += y);
      }

      K = x;
      x = g;
      l++;
    }

    t = p.length;

    if (0 < t) {
      r = c;
      if (0 < A && (C = H(2, p, r, d, D, z, t, h, a, h), void 0 !== C && 0 === (p = C).length)) return G + p + F;
      p = r.join(',') + '{' + p + '}';

      if (0 !== w * E) {
        2 !== w || L(p, 2) || (E = 0);

        switch (E) {
          case 111:
            p = p.replace(ha, ':-moz-$1') + p;
            break;

          case 112:
            p = p.replace(Q, '::-webkit-input-$1') + p.replace(Q, '::-moz-$1') + p.replace(Q, ':-ms-input-$1') + p;
        }

        E = 0;
      }
    }

    return G + p + F;
  }

  function X(d, c, e) {
    var h = c.trim().split(ia);
    c = h;
    var a = h.length,
        m = d.length;

    switch (m) {
      case 0:
      case 1:
        var b = 0;

        for (d = 0 === m ? '' : d[0] + ' '; b < a; ++b) {
          c[b] = Z(d, c[b], e).trim();
        }

        break;

      default:
        var v = b = 0;

        for (c = []; b < a; ++b) {
          for (var n = 0; n < m; ++n) {
            c[v++] = Z(d[n] + ' ', h[b], e).trim();
          }
        }

    }

    return c;
  }

  function Z(d, c, e) {
    var h = c.charCodeAt(0);
    33 > h && (h = (c = c.trim()).charCodeAt(0));

    switch (h) {
      case 38:
        return c.replace(F, '$1' + d.trim());

      case 58:
        return d.trim() + c.replace(F, '$1' + d.trim());

      default:
        if (0 < 1 * e && 0 < c.indexOf('\f')) return c.replace(F, (58 === d.charCodeAt(0) ? '' : '$1') + d.trim());
    }

    return d + c;
  }

  function P(d, c, e, h) {
    var a = d + ';',
        m = 2 * c + 3 * e + 4 * h;

    if (944 === m) {
      d = a.indexOf(':', 9) + 1;
      var b = a.substring(d, a.length - 1).trim();
      b = a.substring(0, d).trim() + b + ';';
      return 1 === w || 2 === w && L(b, 1) ? '-webkit-' + b + b : b;
    }

    if (0 === w || 2 === w && !L(a, 1)) return a;

    switch (m) {
      case 1015:
        return 97 === a.charCodeAt(10) ? '-webkit-' + a + a : a;

      case 951:
        return 116 === a.charCodeAt(3) ? '-webkit-' + a + a : a;

      case 963:
        return 110 === a.charCodeAt(5) ? '-webkit-' + a + a : a;

      case 1009:
        if (100 !== a.charCodeAt(4)) break;

      case 969:
      case 942:
        return '-webkit-' + a + a;

      case 978:
        return '-webkit-' + a + '-moz-' + a + a;

      case 1019:
      case 983:
        return '-webkit-' + a + '-moz-' + a + '-ms-' + a + a;

      case 883:
        if (45 === a.charCodeAt(8)) return '-webkit-' + a + a;
        if (0 < a.indexOf('image-set(', 11)) return a.replace(ja, '$1-webkit-$2') + a;
        break;

      case 932:
        if (45 === a.charCodeAt(4)) switch (a.charCodeAt(5)) {
          case 103:
            return '-webkit-box-' + a.replace('-grow', '') + '-webkit-' + a + '-ms-' + a.replace('grow', 'positive') + a;

          case 115:
            return '-webkit-' + a + '-ms-' + a.replace('shrink', 'negative') + a;

          case 98:
            return '-webkit-' + a + '-ms-' + a.replace('basis', 'preferred-size') + a;
        }
        return '-webkit-' + a + '-ms-' + a + a;

      case 964:
        return '-webkit-' + a + '-ms-flex-' + a + a;

      case 1023:
        if (99 !== a.charCodeAt(8)) break;
        b = a.substring(a.indexOf(':', 15)).replace('flex-', '').replace('space-between', 'justify');
        return '-webkit-box-pack' + b + '-webkit-' + a + '-ms-flex-pack' + b + a;

      case 1005:
        return ka.test(a) ? a.replace(aa, ':-webkit-') + a.replace(aa, ':-moz-') + a : a;

      case 1e3:
        b = a.substring(13).trim();
        c = b.indexOf('-') + 1;

        switch (b.charCodeAt(0) + b.charCodeAt(c)) {
          case 226:
            b = a.replace(G, 'tb');
            break;

          case 232:
            b = a.replace(G, 'tb-rl');
            break;

          case 220:
            b = a.replace(G, 'lr');
            break;

          default:
            return a;
        }

        return '-webkit-' + a + '-ms-' + b + a;

      case 1017:
        if (-1 === a.indexOf('sticky', 9)) break;

      case 975:
        c = (a = d).length - 10;
        b = (33 === a.charCodeAt(c) ? a.substring(0, c) : a).substring(d.indexOf(':', 7) + 1).trim();

        switch (m = b.charCodeAt(0) + (b.charCodeAt(7) | 0)) {
          case 203:
            if (111 > b.charCodeAt(8)) break;

          case 115:
            a = a.replace(b, '-webkit-' + b) + ';' + a;
            break;

          case 207:
          case 102:
            a = a.replace(b, '-webkit-' + (102 < m ? 'inline-' : '') + 'box') + ';' + a.replace(b, '-webkit-' + b) + ';' + a.replace(b, '-ms-' + b + 'box') + ';' + a;
        }

        return a + ';';

      case 938:
        if (45 === a.charCodeAt(5)) switch (a.charCodeAt(6)) {
          case 105:
            return b = a.replace('-items', ''), '-webkit-' + a + '-webkit-box-' + b + '-ms-flex-' + b + a;

          case 115:
            return '-webkit-' + a + '-ms-flex-item-' + a.replace(ba, '') + a;

          default:
            return '-webkit-' + a + '-ms-flex-line-pack' + a.replace('align-content', '').replace(ba, '') + a;
        }
        break;

      case 973:
      case 989:
        if (45 !== a.charCodeAt(3) || 122 === a.charCodeAt(4)) break;

      case 931:
      case 953:
        if (!0 === la.test(d)) return 115 === (b = d.substring(d.indexOf(':') + 1)).charCodeAt(0) ? P(d.replace('stretch', 'fill-available'), c, e, h).replace(':fill-available', ':stretch') : a.replace(b, '-webkit-' + b) + a.replace(b, '-moz-' + b.replace('fill-', '')) + a;
        break;

      case 962:
        if (a = '-webkit-' + a + (102 === a.charCodeAt(5) ? '-ms-' + a : '') + a, 211 === e + h && 105 === a.charCodeAt(13) && 0 < a.indexOf('transform', 10)) return a.substring(0, a.indexOf(';', 27) + 1).replace(ma, '$1-webkit-$2') + a;
    }

    return a;
  }

  function L(d, c) {
    var e = d.indexOf(1 === c ? ':' : '{'),
        h = d.substring(0, 3 !== c ? e : 10);
    e = d.substring(e + 1, d.length - 1);
    return R(2 !== c ? h : h.replace(na, '$1'), e, c);
  }

  function ea(d, c) {
    var e = P(c, c.charCodeAt(0), c.charCodeAt(1), c.charCodeAt(2));
    return e !== c + ';' ? e.replace(oa, ' or ($1)').substring(4) : '(' + c + ')';
  }

  function H(d, c, e, h, a, m, b, v, n, q) {
    for (var g = 0, x = c, w; g < A; ++g) {
      switch (w = S[g].call(B, d, x, e, h, a, m, b, v, n, q)) {
        case void 0:
        case !1:
        case !0:
        case null:
          break;

        default:
          x = w;
      }
    }

    if (x !== c) return x;
  }

  function T(d) {
    switch (d) {
      case void 0:
      case null:
        A = S.length = 0;
        break;

      default:
        if ('function' === typeof d) S[A++] = d;else if ('object' === typeof d) for (var c = 0, e = d.length; c < e; ++c) {
          T(d[c]);
        } else Y = !!d | 0;
    }

    return T;
  }

  function U(d) {
    d = d.prefix;
    void 0 !== d && (R = null, d ? 'function' !== typeof d ? w = 1 : (w = 2, R = d) : w = 0);
    return U;
  }

  function B(d, c) {
    var e = d;
    33 > e.charCodeAt(0) && (e = e.trim());
    V = e;
    e = [V];

    if (0 < A) {
      var h = H(-1, c, e, e, D, z, 0, 0, 0, 0);
      void 0 !== h && 'string' === typeof h && (c = h);
    }

    var a = M(O, e, c, 0, 0);
    0 < A && (h = H(-2, a, e, e, D, z, a.length, 0, 0, 0), void 0 !== h && (a = h));
    V = '';
    E = 0;
    z = D = 1;
    return a;
  }

  var ca = /^\0+/g,
      N = /[\0\r\f]/g,
      aa = /: */g,
      ka = /zoo|gra/,
      ma = /([,: ])(transform)/g,
      ia = /,\r+?/g,
      F = /([\t\r\n ])*\f?&/g,
      fa = /@(k\w+)\s*(\S*)\s*/,
      Q = /::(place)/g,
      ha = /:(read-only)/g,
      G = /[svh]\w+-[tblr]{2}/,
      da = /\(\s*(.*)\s*\)/g,
      oa = /([\s\S]*?);/g,
      ba = /-self|flex-/g,
      na = /[^]*?(:[rp][el]a[\w-]+)[^]*/,
      la = /stretch|:\s*\w+\-(?:conte|avail)/,
      ja = /([^-])(image-set\()/,
      z = 1,
      D = 1,
      E = 0,
      w = 1,
      O = [],
      S = [],
      A = 0,
      R = null,
      Y = 0,
      V = '';
  B.use = T;
  B.set = U;
  void 0 !== W && U(W);
  return B;
}

var _default = stylis_min;
exports.default = _default;
},{}],"../node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var weakMemoize = function weakMemoize(func) {
  // $FlowFixMe flow doesn't include all non-primitive types as allowed for weakmaps
  var cache = new WeakMap();
  return function (arg) {
    if (cache.has(arg)) {
      // $FlowFixMe
      return cache.get(arg);
    }

    var ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
};

var _default = weakMemoize;
exports.default = _default;
},{}],"../node_modules/@emotion/cache/dist/cache.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sheet = require("@emotion/sheet");

var _stylis = _interopRequireDefault(require("@emotion/stylis"));

require("@emotion/weak-memoize");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://github.com/thysultan/stylis.js/tree/master/plugins/rule-sheet
// inlined to avoid umd wrapper and peerDep warnings/installing stylis
// since we use stylis after closure compiler
var delimiter = '/*|*/';
var needle = delimiter + '}';

function toSheet(block) {
  if (block) {
    Sheet.current.insert(block + '}');
  }
}

var Sheet = {
  current: null
};

var ruleSheet = function ruleSheet(context, content, selectors, parents, line, column, length, ns, depth, at) {
  switch (context) {
    // property
    case 1:
      {
        switch (content.charCodeAt(0)) {
          case 64:
            {
              // @import
              Sheet.current.insert(content + ';');
              return '';
            }
          // charcode for l

          case 108:
            {
              // charcode for b
              // this ignores label
              if (content.charCodeAt(2) === 98) {
                return '';
              }
            }
        }

        break;
      }
    // selector

    case 2:
      {
        if (ns === 0) return content + delimiter;
        break;
      }
    // at-rule

    case 3:
      {
        switch (ns) {
          // @font-face, @page
          case 102:
          case 112:
            {
              Sheet.current.insert(selectors[0] + content);
              return '';
            }

          default:
            {
              return content + (at === 0 ? delimiter : '');
            }
        }
      }

    case -2:
      {
        content.split(needle).forEach(toSheet);
      }
  }
};

var createCache = function createCache(options) {
  if (options === undefined) options = {};
  var key = options.key || 'css';
  var stylisOptions;

  if (options.prefix !== undefined) {
    stylisOptions = {
      prefix: options.prefix
    };
  }

  var stylis = new _stylis.default(stylisOptions);

  if ("development" !== 'production') {
    // $FlowFixMe
    if (/[^a-z-]/.test(key)) {
      throw new Error("Emotion key must only contain lower case alphabetical characters and - but \"" + key + "\" was passed");
    }
  }

  var inserted = {}; // $FlowFixMe

  var container;
  {
    container = options.container || document.head;
    var nodes = document.querySelectorAll("style[data-emotion-" + key + "]");
    Array.prototype.forEach.call(nodes, function (node) {
      var attrib = node.getAttribute("data-emotion-" + key); // $FlowFixMe

      attrib.split(' ').forEach(function (id) {
        inserted[id] = true;
      });

      if (node.parentNode !== container) {
        container.appendChild(node);
      }
    });
  }

  var _insert;

  {
    stylis.use(options.stylisPlugins)(ruleSheet);

    _insert = function insert(selector, serialized, sheet, shouldCache) {
      var name = serialized.name;
      Sheet.current = sheet;

      if ("development" !== 'production' && serialized.map !== undefined) {
        var map = serialized.map;
        Sheet.current = {
          insert: function insert(rule) {
            sheet.insert(rule + map);
          }
        };
      }

      stylis(selector, serialized.styles);

      if (shouldCache) {
        cache.inserted[name] = true;
      }
    };
  }

  if ("development" !== 'production') {
    // https://esbench.com/bench/5bf7371a4cd7e6009ef61d0a
    var commentStart = /\/\*/g;
    var commentEnd = /\*\//g;
    stylis.use(function (context, content) {
      switch (context) {
        case -1:
          {
            while (commentStart.test(content)) {
              commentEnd.lastIndex = commentStart.lastIndex;

              if (commentEnd.test(content)) {
                commentStart.lastIndex = commentEnd.lastIndex;
                continue;
              }

              throw new Error('Your styles have an unterminated comment ("/*" without corresponding "*/").');
            }

            commentStart.lastIndex = 0;
            break;
          }
      }
    });
    stylis.use(function (context, content, selectors) {
      switch (context) {
        case -1:
          {
            var flag = 'emotion-disable-server-rendering-unsafe-selector-warning-please-do-not-use-this-the-warning-exists-for-a-reason';
            var unsafePseudoClasses = content.match(/(:first|:nth|:nth-last)-child/g);

            if (unsafePseudoClasses && cache.compat !== true) {
              unsafePseudoClasses.forEach(function (unsafePseudoClass) {
                var ignoreRegExp = new RegExp(unsafePseudoClass + ".*\\/\\* " + flag + " \\*\\/");
                var ignore = ignoreRegExp.test(content);

                if (unsafePseudoClass && !ignore) {
                  console.error("The pseudo class \"" + unsafePseudoClass + "\" is potentially unsafe when doing server-side rendering. Try changing it to \"" + unsafePseudoClass.split('-child')[0] + "-of-type\".");
                }
              });
            }

            break;
          }
      }
    });
  }

  var cache = {
    key: key,
    sheet: new _sheet.StyleSheet({
      key: key,
      container: container,
      nonce: options.nonce,
      speedy: options.speedy
    }),
    nonce: options.nonce,
    inserted: inserted,
    registered: {},
    insert: _insert
  };
  return cache;
};

var _default = createCache;
exports.default = _default;
},{"@emotion/sheet":"../node_modules/@emotion/sheet/dist/sheet.browser.esm.js","@emotion/stylis":"../node_modules/@emotion/stylis/dist/stylis.browser.esm.js","@emotion/weak-memoize":"../node_modules/@emotion/weak-memoize/dist/weak-memoize.browser.esm.js"}],"../node_modules/@emotion/hash/dist/hash.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/* eslint-disable */
// Inspired by https://github.com/garycourt/murmurhash-js
// Ported from https://github.com/aappleby/smhasher/blob/61a0530f28277f2e850bfc39600ce61d02b518de/src/MurmurHash2.cpp#L37-L86
function murmur2(str) {
  // 'm' and 'r' are mixing constants generated offline.
  // They're not really 'magic', they just happen to work well.
  // const m = 0x5bd1e995;
  // const r = 24;
  // Initialize the hash
  var h = 0; // Mix 4 bytes at a time into the hash

  var k,
      i = 0,
      len = str.length;

  for (; len >= 4; ++i, len -= 4) {
    k = str.charCodeAt(i) & 0xff | (str.charCodeAt(++i) & 0xff) << 8 | (str.charCodeAt(++i) & 0xff) << 16 | (str.charCodeAt(++i) & 0xff) << 24;
    k =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16);
    k ^=
    /* k >>> r: */
    k >>> 24;
    h =
    /* Math.imul(k, m): */
    (k & 0xffff) * 0x5bd1e995 + ((k >>> 16) * 0xe995 << 16) ^
    /* Math.imul(h, m): */
    (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Handle the last few bytes of the input array


  switch (len) {
    case 3:
      h ^= (str.charCodeAt(i + 2) & 0xff) << 16;

    case 2:
      h ^= (str.charCodeAt(i + 1) & 0xff) << 8;

    case 1:
      h ^= str.charCodeAt(i) & 0xff;
      h =
      /* Math.imul(h, m): */
      (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  } // Do a few final mixes of the hash to ensure the last few
  // bytes are well-incorporated.


  h ^= h >>> 13;
  h =
  /* Math.imul(h, m): */
  (h & 0xffff) * 0x5bd1e995 + ((h >>> 16) * 0xe995 << 16);
  return ((h ^ h >>> 15) >>> 0).toString(36);
}

var _default = murmur2;
exports.default = _default;
},{}],"../node_modules/@emotion/unitless/dist/unitless.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var unitlessKeys = {
  animationIterationCount: 1,
  borderImageOutset: 1,
  borderImageSlice: 1,
  borderImageWidth: 1,
  boxFlex: 1,
  boxFlexGroup: 1,
  boxOrdinalGroup: 1,
  columnCount: 1,
  columns: 1,
  flex: 1,
  flexGrow: 1,
  flexPositive: 1,
  flexShrink: 1,
  flexNegative: 1,
  flexOrder: 1,
  gridRow: 1,
  gridRowEnd: 1,
  gridRowSpan: 1,
  gridRowStart: 1,
  gridColumn: 1,
  gridColumnEnd: 1,
  gridColumnSpan: 1,
  gridColumnStart: 1,
  msGridRow: 1,
  msGridRowSpan: 1,
  msGridColumn: 1,
  msGridColumnSpan: 1,
  fontWeight: 1,
  lineHeight: 1,
  opacity: 1,
  order: 1,
  orphans: 1,
  tabSize: 1,
  widows: 1,
  zIndex: 1,
  zoom: 1,
  WebkitLineClamp: 1,
  // SVG-related properties
  fillOpacity: 1,
  floodOpacity: 1,
  stopOpacity: 1,
  strokeDasharray: 1,
  strokeDashoffset: 1,
  strokeMiterlimit: 1,
  strokeOpacity: 1,
  strokeWidth: 1
};
var _default = unitlessKeys;
exports.default = _default;
},{}],"../node_modules/@emotion/memoize/dist/memoize.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function memoize(fn) {
  var cache = {};
  return function (arg) {
    if (cache[arg] === undefined) cache[arg] = fn(arg);
    return cache[arg];
  };
}

var _default = memoize;
exports.default = _default;
},{}],"../node_modules/@emotion/serialize/dist/serialize.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializeStyles = void 0;

var _hash = _interopRequireDefault(require("@emotion/hash"));

var _unitless = _interopRequireDefault(require("@emotion/unitless"));

var _memoize = _interopRequireDefault(require("@emotion/memoize"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ILLEGAL_ESCAPE_SEQUENCE_ERROR = "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";
var UNDEFINED_AS_OBJECT_KEY_ERROR = "You have passed in falsy value as style object's key (can happen when in example you pass unexported component as computed key).";
var hyphenateRegex = /[A-Z]|^ms/g;
var animationRegex = /_EMO_([^_]+?)_([^]*?)_EMO_/g;

var isCustomProperty = function isCustomProperty(property) {
  return property.charCodeAt(1) === 45;
};

var isProcessableValue = function isProcessableValue(value) {
  return value != null && typeof value !== 'boolean';
};

var processStyleName = (0, _memoize.default)(function (styleName) {
  return isCustomProperty(styleName) ? styleName : styleName.replace(hyphenateRegex, '-$&').toLowerCase();
});

var processStyleValue = function processStyleValue(key, value) {
  switch (key) {
    case 'animation':
    case 'animationName':
      {
        if (typeof value === 'string') {
          return value.replace(animationRegex, function (match, p1, p2) {
            cursor = {
              name: p1,
              styles: p2,
              next: cursor
            };
            return p1;
          });
        }
      }
  }

  if (_unitless.default[key] !== 1 && !isCustomProperty(key) && typeof value === 'number' && value !== 0) {
    return value + 'px';
  }

  return value;
};

if ("development" !== 'production') {
  var contentValuePattern = /(attr|calc|counters?|url)\(/;
  var contentValues = ['normal', 'none', 'counter', 'open-quote', 'close-quote', 'no-open-quote', 'no-close-quote', 'initial', 'inherit', 'unset'];
  var oldProcessStyleValue = processStyleValue;
  var msPattern = /^-ms-/;
  var hyphenPattern = /-(.)/g;
  var hyphenatedCache = {};

  processStyleValue = function processStyleValue(key, value) {
    if (key === 'content') {
      if (typeof value !== 'string' || contentValues.indexOf(value) === -1 && !contentValuePattern.test(value) && (value.charAt(0) !== value.charAt(value.length - 1) || value.charAt(0) !== '"' && value.charAt(0) !== "'")) {
        console.error("You seem to be using a value for 'content' without quotes, try replacing it with `content: '\"" + value + "\"'`");
      }
    }

    var processed = oldProcessStyleValue(key, value);

    if (processed !== '' && !isCustomProperty(key) && key.indexOf('-') !== -1 && hyphenatedCache[key] === undefined) {
      hyphenatedCache[key] = true;
      console.error("Using kebab-case for css properties in objects is not supported. Did you mean " + key.replace(msPattern, 'ms-').replace(hyphenPattern, function (str, _char) {
        return _char.toUpperCase();
      }) + "?");
    }

    return processed;
  };
}

var shouldWarnAboutInterpolatingClassNameFromCss = true;

function handleInterpolation(mergedProps, registered, interpolation, couldBeSelectorInterpolation) {
  if (interpolation == null) {
    return '';
  }

  if (interpolation.__emotion_styles !== undefined) {
    if ("development" !== 'production' && interpolation.toString() === 'NO_COMPONENT_SELECTOR') {
      throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
    }

    return interpolation;
  }

  switch (typeof interpolation) {
    case 'boolean':
      {
        return '';
      }

    case 'object':
      {
        if (interpolation.anim === 1) {
          cursor = {
            name: interpolation.name,
            styles: interpolation.styles,
            next: cursor
          };
          return interpolation.name;
        }

        if (interpolation.styles !== undefined) {
          var next = interpolation.next;

          if (next !== undefined) {
            // not the most efficient thing ever but this is a pretty rare case
            // and there will be very few iterations of this generally
            while (next !== undefined) {
              cursor = {
                name: next.name,
                styles: next.styles,
                next: cursor
              };
              next = next.next;
            }
          }

          var styles = interpolation.styles + ";";

          if ("development" !== 'production' && interpolation.map !== undefined) {
            styles += interpolation.map;
          }

          return styles;
        }

        return createStringFromObject(mergedProps, registered, interpolation);
      }

    case 'function':
      {
        if (mergedProps !== undefined) {
          var previousCursor = cursor;
          var result = interpolation(mergedProps);
          cursor = previousCursor;
          return handleInterpolation(mergedProps, registered, result, couldBeSelectorInterpolation);
        } else if ("development" !== 'production') {
          console.error('Functions that are interpolated in css calls will be stringified.\n' + 'If you want to have a css call based on props, create a function that returns a css call like this\n' + 'let dynamicStyle = (props) => css`color: ${props.color}`\n' + 'It can be called directly with props or interpolated in a styled call like this\n' + "let SomeComponent = styled('div')`${dynamicStyle}`");
        }

        break;
      }

    case 'string':
      if ("development" !== 'production') {
        var matched = [];
        var replaced = interpolation.replace(animationRegex, function (match, p1, p2) {
          var fakeVarName = "animation" + matched.length;
          matched.push("const " + fakeVarName + " = keyframes`" + p2.replace(/^@keyframes animation-\w+/, '') + "`");
          return "${" + fakeVarName + "}";
        });

        if (matched.length) {
          console.error('`keyframes` output got interpolated into plain string, please wrap it with `css`.\n\n' + 'Instead of doing this:\n\n' + [].concat(matched, ["`" + replaced + "`"]).join('\n') + '\n\nYou should wrap it with `css` like this:\n\n' + ("css`" + replaced + "`"));
        }
      }

      break;
  } // finalize string values (regular strings and functions interpolated into css calls)


  if (registered == null) {
    return interpolation;
  }

  var cached = registered[interpolation];

  if ("development" !== 'production' && couldBeSelectorInterpolation && shouldWarnAboutInterpolatingClassNameFromCss && cached !== undefined) {
    console.error('Interpolating a className from css`` is not recommended and will cause problems with composition.\n' + 'Interpolating a className from css`` will be completely unsupported in a future major version of Emotion');
    shouldWarnAboutInterpolatingClassNameFromCss = false;
  }

  return cached !== undefined && !couldBeSelectorInterpolation ? cached : interpolation;
}

function createStringFromObject(mergedProps, registered, obj) {
  var string = '';

  if (Array.isArray(obj)) {
    for (var i = 0; i < obj.length; i++) {
      string += handleInterpolation(mergedProps, registered, obj[i], false);
    }
  } else {
    for (var _key in obj) {
      var value = obj[_key];

      if (typeof value !== 'object') {
        if (registered != null && registered[value] !== undefined) {
          string += _key + "{" + registered[value] + "}";
        } else if (isProcessableValue(value)) {
          string += processStyleName(_key) + ":" + processStyleValue(_key, value) + ";";
        }
      } else {
        if (_key === 'NO_COMPONENT_SELECTOR' && "development" !== 'production') {
          throw new Error('Component selectors can only be used in conjunction with babel-plugin-emotion.');
        }

        if (Array.isArray(value) && typeof value[0] === 'string' && (registered == null || registered[value[0]] === undefined)) {
          for (var _i = 0; _i < value.length; _i++) {
            if (isProcessableValue(value[_i])) {
              string += processStyleName(_key) + ":" + processStyleValue(_key, value[_i]) + ";";
            }
          }
        } else {
          var interpolated = handleInterpolation(mergedProps, registered, value, false);

          switch (_key) {
            case 'animation':
            case 'animationName':
              {
                string += processStyleName(_key) + ":" + interpolated + ";";
                break;
              }

            default:
              {
                if ("development" !== 'production' && _key === 'undefined') {
                  console.error(UNDEFINED_AS_OBJECT_KEY_ERROR);
                }

                string += _key + "{" + interpolated + "}";
              }
          }
        }
      }
    }
  }

  return string;
}

var labelPattern = /label:\s*([^\s;\n{]+)\s*;/g;
var sourceMapPattern;

if ("development" !== 'production') {
  sourceMapPattern = /\/\*#\ssourceMappingURL=data:application\/json;\S+\s+\*\//;
} // this is the cursor for keyframes
// keyframes are stored on the SerializedStyles object as a linked list


var cursor;

var serializeStyles = function serializeStyles(args, registered, mergedProps) {
  if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null && args[0].styles !== undefined) {
    return args[0];
  }

  var stringMode = true;
  var styles = '';
  cursor = undefined;
  var strings = args[0];

  if (strings == null || strings.raw === undefined) {
    stringMode = false;
    styles += handleInterpolation(mergedProps, registered, strings, false);
  } else {
    if ("development" !== 'production' && strings[0] === undefined) {
      console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
    }

    styles += strings[0];
  } // we start at 1 since we've already handled the first arg


  for (var i = 1; i < args.length; i++) {
    styles += handleInterpolation(mergedProps, registered, args[i], styles.charCodeAt(styles.length - 1) === 46);

    if (stringMode) {
      if ("development" !== 'production' && strings[i] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles += strings[i];
    }
  }

  var sourceMap;

  if ("development" !== 'production') {
    styles = styles.replace(sourceMapPattern, function (match) {
      sourceMap = match;
      return '';
    });
  } // using a global regex with .exec is stateful so lastIndex has to be reset each time


  labelPattern.lastIndex = 0;
  var identifierName = '';
  var match; // https://esbench.com/bench/5b809c2cf2949800a0f61fb5

  while ((match = labelPattern.exec(styles)) !== null) {
    identifierName += '-' + // $FlowFixMe we know it's not null
    match[1];
  }

  var name = (0, _hash.default)(styles) + identifierName;

  if ("development" !== 'production') {
    // $FlowFixMe SerializedStyles type doesn't have toString property (and we don't want to add it)
    return {
      name: name,
      styles: styles,
      map: sourceMap,
      next: cursor,
      toString: function toString() {
        return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop).";
      }
    };
  }

  return {
    name: name,
    styles: styles,
    next: cursor
  };
};

exports.serializeStyles = serializeStyles;
},{"@emotion/hash":"../node_modules/@emotion/hash/dist/hash.browser.esm.js","@emotion/unitless":"../node_modules/@emotion/unitless/dist/unitless.browser.esm.js","@emotion/memoize":"../node_modules/@emotion/memoize/dist/memoize.browser.esm.js"}],"../node_modules/@emotion/utils/dist/utils.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRegisteredStyles = getRegisteredStyles;
exports.insertStyles = void 0;
var isBrowser = "object" !== 'undefined';

function getRegisteredStyles(registered, registeredStyles, classNames) {
  var rawClassName = '';
  classNames.split(' ').forEach(function (className) {
    if (registered[className] !== undefined) {
      registeredStyles.push(registered[className]);
    } else {
      rawClassName += className + " ";
    }
  });
  return rawClassName;
}

var insertStyles = function insertStyles(cache, serialized, isStringTag) {
  var className = cache.key + "-" + serialized.name;

  if ( // we only need to add the styles to the registered cache if the
  // class name could be used further down
  // the tree but if it's a string tag, we know it won't
  // so we don't have to add it to registered cache.
  // this improves memory usage since we can avoid storing the whole style string
  (isStringTag === false || // we need to always store it if we're in compat mode and
  // in node since emotion-server relies on whether a style is in
  // the registered cache to know whether a style is global or not
  // also, note that this check will be dead code eliminated in the browser
  isBrowser === false && cache.compat !== undefined) && cache.registered[className] === undefined) {
    cache.registered[className] = serialized.styles;
  }

  if (cache.inserted[serialized.name] === undefined) {
    var current = serialized;

    do {
      var maybeStyles = cache.insert("." + className, current, cache.sheet, true);
      current = current.next;
    } while (current !== undefined);
  }
};

exports.insertStyles = insertStyles;
},{}],"../node_modules/create-emotion/dist/create-emotion.browser.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cache = _interopRequireDefault(require("@emotion/cache"));

var _serialize = require("@emotion/serialize");

var _utils = require("@emotion/utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function insertWithoutScoping(cache, serialized) {
  if (cache.inserted[serialized.name] === undefined) {
    return cache.insert('', serialized, cache.sheet, true);
  }
}

function merge(registered, css, className) {
  var registeredStyles = [];
  var rawClassName = (0, _utils.getRegisteredStyles)(registered, registeredStyles, className);

  if (registeredStyles.length < 2) {
    return className;
  }

  return rawClassName + css(registeredStyles);
}

var createEmotion = function createEmotion(options) {
  var cache = (0, _cache.default)(options); // $FlowFixMe

  cache.sheet.speedy = function (value) {
    if ("development" !== 'production' && this.ctr !== 0) {
      throw new Error('speedy must be changed before any rules are inserted');
    }

    this.isSpeedy = value;
  };

  cache.compat = true;

  var css = function css() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var serialized = (0, _serialize.serializeStyles)(args, cache.registered, undefined);
    (0, _utils.insertStyles)(cache, serialized, false);
    return cache.key + "-" + serialized.name;
  };

  var keyframes = function keyframes() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    var serialized = (0, _serialize.serializeStyles)(args, cache.registered);
    var animation = "animation-" + serialized.name;
    insertWithoutScoping(cache, {
      name: serialized.name,
      styles: "@keyframes " + animation + "{" + serialized.styles + "}"
    });
    return animation;
  };

  var injectGlobal = function injectGlobal() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var serialized = (0, _serialize.serializeStyles)(args, cache.registered);
    insertWithoutScoping(cache, serialized);
  };

  var cx = function cx() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    return merge(cache.registered, css, classnames(args));
  };

  return {
    css: css,
    cx: cx,
    injectGlobal: injectGlobal,
    keyframes: keyframes,
    hydrate: function hydrate(ids) {
      ids.forEach(function (key) {
        cache.inserted[key] = true;
      });
    },
    flush: function flush() {
      cache.registered = {};
      cache.inserted = {};
      cache.sheet.flush();
    },
    // $FlowFixMe
    sheet: cache.sheet,
    cache: cache,
    getRegisteredStyles: _utils.getRegisteredStyles.bind(null, cache.registered),
    merge: merge.bind(null, cache.registered, css)
  };
};

var classnames = function classnames(args) {
  var cls = '';

  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (arg == null) continue;
    var toAdd = void 0;

    switch (typeof arg) {
      case 'boolean':
        break;

      case 'object':
        {
          if (Array.isArray(arg)) {
            toAdd = classnames(arg);
          } else {
            toAdd = '';

            for (var k in arg) {
              if (arg[k] && k) {
                toAdd && (toAdd += ' ');
                toAdd += k;
              }
            }
          }

          break;
        }

      default:
        {
          toAdd = arg;
        }
    }

    if (toAdd) {
      cls && (cls += ' ');
      cls += toAdd;
    }
  }

  return cls;
};

var _default = createEmotion;
exports.default = _default;
},{"@emotion/cache":"../node_modules/@emotion/cache/dist/cache.browser.esm.js","@emotion/serialize":"../node_modules/@emotion/serialize/dist/serialize.browser.esm.js","@emotion/utils":"../node_modules/@emotion/utils/dist/utils.browser.esm.js"}],"../node_modules/emotion/dist/emotion.esm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sheet = exports.merge = exports.keyframes = exports.injectGlobal = exports.hydrate = exports.getRegisteredStyles = exports.flush = exports.cx = exports.css = exports.cache = void 0;

var _createEmotion2 = _interopRequireDefault(require("create-emotion"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _createEmotion = (0, _createEmotion2.default)(),
    flush = _createEmotion.flush,
    hydrate = _createEmotion.hydrate,
    cx = _createEmotion.cx,
    merge = _createEmotion.merge,
    getRegisteredStyles = _createEmotion.getRegisteredStyles,
    injectGlobal = _createEmotion.injectGlobal,
    keyframes = _createEmotion.keyframes,
    css = _createEmotion.css,
    sheet = _createEmotion.sheet,
    cache = _createEmotion.cache;

exports.cache = cache;
exports.sheet = sheet;
exports.css = css;
exports.keyframes = keyframes;
exports.injectGlobal = injectGlobal;
exports.getRegisteredStyles = getRegisteredStyles;
exports.merge = merge;
exports.cx = cx;
exports.hydrate = hydrate;
exports.flush = flush;
},{"create-emotion":"../node_modules/create-emotion/dist/create-emotion.browser.esm.js"}],"define.js":[function(require,module,exports) {
'use strict';

var _domql = _interopRequireDefault(require("@rackai/domql"));

var _utils = require("@rackai/domql/src/utils");

var _params = require("@rackai/domql/src/element/params");

var _emotion = require("emotion");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_domql.default.define({
  style: function style(params, element, node) {
    if (params) {
      if ((0, _utils.isObject)(element.class)) element.class.style = params;else element.class = {
        style: params
      };
    }
  },
  class: function _class(params, element, node) {
    if ((0, _utils.isObject)(params)) {
      for (var param in params) {
        var prop = (0, _utils.exec)(params[param], element);
        var CSSed = (0, _emotion.css)(prop);
        element.class[param] = CSSed;
      }

      (0, _params.classList)(element.class, element, node);
    }
  }
}, {
  overwrite: true
});
},{"@rackai/domql":"../node_modules/@rackai/domql/src/index.js","@rackai/domql/src/utils":"../node_modules/@rackai/domql/src/utils/index.js","@rackai/domql/src/element/params":"../node_modules/@rackai/domql/src/element/params/index.js","emotion":"../node_modules/emotion/dist/emotion.esm.js"}],"canvas/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.style = void 0;

var _emotion = require("emotion");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  html, body {\n    overflow: hidden;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var style = {
  background: '#1D2043',
  position: 'absolute',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignContent: 'stretch',
  fontFamily: 'Avenir Next',
  top: 0,
  left: 0,
  overflow: 'hidden',
  color: 'white'
};
exports.style = style;
(0, _emotion.injectGlobal)(_templateObject());
},{"emotion":"../node_modules/emotion/dist/emotion.esm.js"}],"preview/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.center = exports.style = void 0;
var style = {
  padding: '16 22',
  flex: 1,
  position: 'relative'
};
exports.style = style;
var center = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate3d(-50%, -50%, 1px)',
  '*': {
    minWidth: 10,
    minHeight: 10,
    fontFamily: 'Avenir Next'
  }
};
exports.center = center;
},{}],"preview/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _style = require("./style");

var _default = {
  style: _style.style,
  center: {
    style: _style.center
  }
};
exports.default = _default;
},{"./style":"preview/style.js"}],"../node_modules/codeflask/build/codeflask.module.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var BACKGROUND_COLOR = "#fff",
    LINE_HEIGHT = "20px",
    FONT_SIZE = "13px",
    defaultCssTheme = "\n.codeflask {\n  background: " + BACKGROUND_COLOR + ";\n  color: #4f559c;\n}\n\n.codeflask .token.punctuation {\n  color: #4a4a4a;\n}\n\n.codeflask .token.keyword {\n  color: #8500ff;\n}\n\n.codeflask .token.operator {\n  color: #ff5598;\n}\n\n.codeflask .token.string {\n  color: #41ad8f;\n}\n\n.codeflask .token.comment {\n  color: #9badb7;\n}\n\n.codeflask .token.function {\n  color: #8500ff;\n}\n\n.codeflask .token.boolean {\n  color: #8500ff;\n}\n\n.codeflask .token.number {\n  color: #8500ff;\n}\n\n.codeflask .token.selector {\n  color: #8500ff;\n}\n\n.codeflask .token.property {\n  color: #8500ff;\n}\n\n.codeflask .token.tag {\n  color: #8500ff;\n}\n\n.codeflask .token.attr-value {\n  color: #8500ff;\n}\n";

function cssSupports(e, t) {
  return "undefined" != typeof CSS ? CSS.supports(e, t) : "undefined" != typeof document && toCamelCase(e) in document.body.style;
}

function toCamelCase(e) {
  return (e = e.split("-").filter(function (e) {
    return !!e;
  }).map(function (e) {
    return e[0].toUpperCase() + e.substr(1);
  }).join(""))[0].toLowerCase() + e.substr(1);
}

var FONT_FAMILY = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
    COLOR = cssSupports("caret-color", "#000") ? BACKGROUND_COLOR : "#ccc",
    LINE_NUMBER_WIDTH = "40px",
    editorCss = "\n  .codeflask {\n    position: absolute;\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n  }\n\n  .codeflask, .codeflask * {\n    box-sizing: border-box;\n  }\n\n  .codeflask__pre {\n    pointer-events: none;\n    z-index: 3;\n    overflow: hidden;\n  }\n\n  .codeflask__textarea {\n    background: none;\n    border: none;\n    color: " + COLOR + ";\n    z-index: 1;\n    resize: none;\n    font-family: " + FONT_FAMILY + ";\n    -webkit-appearance: pre;\n    caret-color: #111;\n    z-index: 2;\n    width: 100%;\n    height: 100%;\n  }\n\n  .codeflask--has-line-numbers .codeflask__textarea {\n    width: calc(100% - " + LINE_NUMBER_WIDTH + ");\n  }\n\n  .codeflask__code {\n    display: block;\n    font-family: " + FONT_FAMILY + ";\n    overflow: hidden;\n  }\n\n  .codeflask__flatten {\n    padding: 10px;\n    font-size: " + FONT_SIZE + ";\n    line-height: " + LINE_HEIGHT + ";\n    white-space: pre;\n    position: absolute;\n    top: 0;\n    left: 0;\n    overflow: auto;\n    margin: 0 !important;\n    outline: none;\n    text-align: left;\n  }\n\n  .codeflask--has-line-numbers .codeflask__flatten {\n    width: calc(100% - " + LINE_NUMBER_WIDTH + ");\n    left: " + LINE_NUMBER_WIDTH + ";\n  }\n\n  .codeflask__line-highlight {\n    position: absolute;\n    top: 10px;\n    left: 0;\n    width: 100%;\n    height: " + LINE_HEIGHT + ";\n    background: rgba(0,0,0,0.1);\n    z-index: 1;\n  }\n\n  .codeflask__lines {\n    padding: 10px 4px;\n    font-size: 12px;\n    line-height: " + LINE_HEIGHT + ";\n    font-family: 'Cousine', monospace;\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: " + LINE_NUMBER_WIDTH + ";\n    height: 100%;\n    text-align: right;\n    color: #999;\n    z-index: 2;\n  }\n\n  .codeflask__lines__line {\n    display: block;\n  }\n\n  .codeflask.codeflask--has-line-numbers {\n    padding-left: " + LINE_NUMBER_WIDTH + ";\n  }\n\n  .codeflask.codeflask--has-line-numbers:before {\n    content: '';\n    position: absolute;\n    left: 0;\n    top: 0;\n    width: " + LINE_NUMBER_WIDTH + ";\n    height: 100%;\n    background: #eee;\n    z-index: 1;\n  }\n";

function injectCss(e, t, n) {
  var a = t || "codeflask-style",
      s = n || document.head;
  if (!e) return !1;
  if (document.getElementById(a)) return !0;
  var o = document.createElement("style");
  return o.innerHTML = e, o.id = a, s.appendChild(o), !0;
}

var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;"
};

function escapeHtml(e) {
  return String(e).replace(/[&<>"'`=/]/g, function (e) {
    return entityMap[e];
  });
}

var commonjsGlobal = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

function createCommonjsModule(e, t) {
  return e(t = {
    exports: {}
  }, t.exports), t.exports;
}

var prism = createCommonjsModule(function (e) {
  var t = function (e) {
    var t = /\blang(?:uage)?-([\w-]+)\b/i,
        n = 0,
        a = {
      manual: e.Prism && e.Prism.manual,
      disableWorkerMessageHandler: e.Prism && e.Prism.disableWorkerMessageHandler,
      util: {
        encode: function (e) {
          return e instanceof s ? new s(e.type, a.util.encode(e.content), e.alias) : Array.isArray(e) ? e.map(a.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
        },
        type: function (e) {
          return Object.prototype.toString.call(e).slice(8, -1);
        },
        objId: function (e) {
          return e.__id || Object.defineProperty(e, "__id", {
            value: ++n
          }), e.__id;
        },
        clone: function e(t, n) {
          var s,
              o,
              i = a.util.type(t);

          switch (n = n || {}, i) {
            case "Object":
              if (o = a.util.objId(t), n[o]) return n[o];

              for (var r in s = {}, n[o] = s, t) t.hasOwnProperty(r) && (s[r] = e(t[r], n));

              return s;

            case "Array":
              return o = a.util.objId(t), n[o] ? n[o] : (s = [], n[o] = s, t.forEach(function (t, a) {
                s[a] = e(t, n);
              }), s);

            default:
              return t;
          }
        }
      },
      languages: {
        extend: function (e, t) {
          var n = a.util.clone(a.languages[e]);

          for (var s in t) n[s] = t[s];

          return n;
        },
        insertBefore: function (e, t, n, s) {
          var o = (s = s || a.languages)[e],
              i = {};

          for (var r in o) if (o.hasOwnProperty(r)) {
            if (r == t) for (var l in n) n.hasOwnProperty(l) && (i[l] = n[l]);
            n.hasOwnProperty(r) || (i[r] = o[r]);
          }

          var c = s[e];
          return s[e] = i, a.languages.DFS(a.languages, function (t, n) {
            n === c && t != e && (this[t] = i);
          }), i;
        },
        DFS: function e(t, n, s, o) {
          o = o || {};
          var i = a.util.objId;

          for (var r in t) if (t.hasOwnProperty(r)) {
            n.call(t, r, t[r], s || r);
            var l = t[r],
                c = a.util.type(l);
            "Object" !== c || o[i(l)] ? "Array" !== c || o[i(l)] || (o[i(l)] = !0, e(l, n, r, o)) : (o[i(l)] = !0, e(l, n, null, o));
          }
        }
      },
      plugins: {},
      highlightAll: function (e, t) {
        a.highlightAllUnder(document, e, t);
      },
      highlightAllUnder: function (e, t, n) {
        var s = {
          callback: n,
          selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
        };
        a.hooks.run("before-highlightall", s);

        for (var o, i = s.elements || e.querySelectorAll(s.selector), r = 0; o = i[r++];) a.highlightElement(o, !0 === t, s.callback);
      },
      highlightElement: function (n, s, o) {
        for (var i, r, l = n; l && !t.test(l.className);) l = l.parentNode;

        l && (i = (l.className.match(t) || [, ""])[1].toLowerCase(), r = a.languages[i]), n.className = n.className.replace(t, "").replace(/\s+/g, " ") + " language-" + i, n.parentNode && (l = n.parentNode, /pre/i.test(l.nodeName) && (l.className = l.className.replace(t, "").replace(/\s+/g, " ") + " language-" + i));

        var c = {
          element: n,
          language: i,
          grammar: r,
          code: n.textContent
        },
            d = function (e) {
          c.highlightedCode = e, a.hooks.run("before-insert", c), c.element.innerHTML = c.highlightedCode, a.hooks.run("after-highlight", c), a.hooks.run("complete", c), o && o.call(c.element);
        };

        if (a.hooks.run("before-sanity-check", c), c.code) {
          if (a.hooks.run("before-highlight", c), c.grammar) {
            if (s && e.Worker) {
              var u = new Worker(a.filename);
              u.onmessage = function (e) {
                d(e.data);
              }, u.postMessage(JSON.stringify({
                language: c.language,
                code: c.code,
                immediateClose: !0
              }));
            } else d(a.highlight(c.code, c.grammar, c.language));
          } else d(a.util.encode(c.code));
        } else a.hooks.run("complete", c);
      },
      highlight: function (e, t, n) {
        var o = {
          code: e,
          grammar: t,
          language: n
        };
        return a.hooks.run("before-tokenize", o), o.tokens = a.tokenize(o.code, o.grammar), a.hooks.run("after-tokenize", o), s.stringify(a.util.encode(o.tokens), o.language);
      },
      matchGrammar: function (e, t, n, o, i, r, l) {
        for (var c in n) if (n.hasOwnProperty(c) && n[c]) {
          if (c == l) return;
          var d = n[c];
          d = "Array" === a.util.type(d) ? d : [d];

          for (var u = 0; u < d.length; ++u) {
            var p = d[u],
                h = p.inside,
                g = !!p.lookbehind,
                f = !!p.greedy,
                m = 0,
                b = p.alias;

            if (f && !p.pattern.global) {
              var k = p.pattern.toString().match(/[imuy]*$/)[0];
              p.pattern = RegExp(p.pattern.source, k + "g");
            }

            p = p.pattern || p;

            for (var y = o, C = i; y < t.length; C += t[y].length, ++y) {
              var F = t[y];
              if (t.length > e.length) return;

              if (!(F instanceof s)) {
                if (f && y != t.length - 1) {
                  if (p.lastIndex = C, !(T = p.exec(e))) break;

                  for (var v = T.index + (g ? T[1].length : 0), x = T.index + T[0].length, w = y, A = C, _ = t.length; w < _ && (A < x || !t[w].type && !t[w - 1].greedy); ++w) v >= (A += t[w].length) && (++y, C = A);

                  if (t[y] instanceof s) continue;
                  E = w - y, F = e.slice(C, A), T.index -= C;
                } else {
                  p.lastIndex = 0;
                  var T = p.exec(F),
                      E = 1;
                }

                if (T) {
                  g && (m = T[1] ? T[1].length : 0);
                  x = (v = T.index + m) + (T = T[0].slice(m)).length;
                  var L = F.slice(0, v),
                      N = F.slice(x),
                      S = [y, E];
                  L && (++y, C += L.length, S.push(L));
                  var I = new s(c, h ? a.tokenize(T, h) : T, b, T, f);
                  if (S.push(I), N && S.push(N), Array.prototype.splice.apply(t, S), 1 != E && a.matchGrammar(e, t, n, y, C, !0, c), r) break;
                } else if (r) break;
              }
            }
          }
        }
      },
      tokenize: function (e, t) {
        var n = [e],
            s = t.rest;

        if (s) {
          for (var o in s) t[o] = s[o];

          delete t.rest;
        }

        return a.matchGrammar(e, n, t, 0, 0, !1), n;
      },
      hooks: {
        all: {},
        add: function (e, t) {
          var n = a.hooks.all;
          n[e] = n[e] || [], n[e].push(t);
        },
        run: function (e, t) {
          var n = a.hooks.all[e];
          if (n && n.length) for (var s, o = 0; s = n[o++];) s(t);
        }
      },
      Token: s
    };

    function s(e, t, n, a, s) {
      this.type = e, this.content = t, this.alias = n, this.length = 0 | (a || "").length, this.greedy = !!s;
    }

    if (e.Prism = a, s.stringify = function (e, t, n) {
      if ("string" == typeof e) return e;
      if (Array.isArray(e)) return e.map(function (n) {
        return s.stringify(n, t, e);
      }).join("");
      var o = {
        type: e.type,
        content: s.stringify(e.content, t, n),
        tag: "span",
        classes: ["token", e.type],
        attributes: {},
        language: t,
        parent: n
      };

      if (e.alias) {
        var i = Array.isArray(e.alias) ? e.alias : [e.alias];
        Array.prototype.push.apply(o.classes, i);
      }

      a.hooks.run("wrap", o);
      var r = Object.keys(o.attributes).map(function (e) {
        return e + '="' + (o.attributes[e] || "").replace(/"/g, "&quot;") + '"';
      }).join(" ");
      return "<" + o.tag + ' class="' + o.classes.join(" ") + '"' + (r ? " " + r : "") + ">" + o.content + "</" + o.tag + ">";
    }, !e.document) return e.addEventListener ? (a.disableWorkerMessageHandler || e.addEventListener("message", function (t) {
      var n = JSON.parse(t.data),
          s = n.language,
          o = n.code,
          i = n.immediateClose;
      e.postMessage(a.highlight(o, a.languages[s], s)), i && e.close();
    }, !1), a) : a;
    var o = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
    return o && (a.filename = o.src, a.manual || o.hasAttribute("data-manual") || ("loading" !== document.readyState ? window.requestAnimationFrame ? window.requestAnimationFrame(a.highlightAll) : window.setTimeout(a.highlightAll, 16) : document.addEventListener("DOMContentLoaded", a.highlightAll))), a;
  }("undefined" != typeof window ? window : "undefined" != typeof WorkerGlobalScope && self instanceof WorkerGlobalScope ? self : {});

  e.exports && (e.exports = t), void 0 !== commonjsGlobal && (commonjsGlobal.Prism = t), t.languages.markup = {
    comment: /<!--[\s\S]*?-->/,
    prolog: /<\?[\s\S]+?\?>/,
    doctype: /<!DOCTYPE[\s\S]+?>/i,
    cdata: /<!\[CDATA\[[\s\S]*?]]>/i,
    tag: {
      pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/i,
      greedy: !0,
      inside: {
        tag: {
          pattern: /^<\/?[^\s>\/]+/i,
          inside: {
            punctuation: /^<\/?/,
            namespace: /^[^\s>\/:]+:/
          }
        },
        "attr-value": {
          pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/i,
          inside: {
            punctuation: [/^=/, {
              pattern: /^(\s*)["']|["']$/,
              lookbehind: !0
            }]
          }
        },
        punctuation: /\/?>/,
        "attr-name": {
          pattern: /[^\s>\/]+/,
          inside: {
            namespace: /^[^\s>\/:]+:/
          }
        }
      }
    },
    entity: /&#?[\da-z]{1,8};/i
  }, t.languages.markup.tag.inside["attr-value"].inside.entity = t.languages.markup.entity, t.hooks.add("wrap", function (e) {
    "entity" === e.type && (e.attributes.title = e.content.replace(/&amp;/, "&"));
  }), Object.defineProperty(t.languages.markup.tag, "addInlined", {
    value: function (e, n) {
      var a = {};
      a["language-" + n] = {
        pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
        lookbehind: !0,
        inside: t.languages[n]
      }, a.cdata = /^<!\[CDATA\[|\]\]>$/i;
      var s = {
        "included-cdata": {
          pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
          inside: a
        }
      };
      s["language-" + n] = {
        pattern: /[\s\S]+/,
        inside: t.languages[n]
      };
      var o = {};
      o[e] = {
        pattern: RegExp(/(<__[\s\S]*?>)(?:<!\[CDATA\[[\s\S]*?\]\]>\s*|[\s\S])*?(?=<\/__>)/.source.replace(/__/g, e), "i"),
        lookbehind: !0,
        greedy: !0,
        inside: s
      }, t.languages.insertBefore("markup", "cdata", o);
    }
  }), t.languages.xml = t.languages.extend("markup", {}), t.languages.html = t.languages.markup, t.languages.mathml = t.languages.markup, t.languages.svg = t.languages.markup, function (e) {
    var t = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;
    e.languages.css = {
      comment: /\/\*[\s\S]*?\*\//,
      atrule: {
        pattern: /@[\w-]+?[\s\S]*?(?:;|(?=\s*\{))/i,
        inside: {
          rule: /@[\w-]+/
        }
      },
      url: RegExp("url\\((?:" + t.source + "|.*?)\\)", "i"),
      selector: RegExp("[^{}\\s](?:[^{};\"']|" + t.source + ")*?(?=\\s*\\{)"),
      string: {
        pattern: t,
        greedy: !0
      },
      property: /[-_a-z\xA0-\uFFFF][-\w\xA0-\uFFFF]*(?=\s*:)/i,
      important: /!important\b/i,
      function: /[-a-z0-9]+(?=\()/i,
      punctuation: /[(){};:,]/
    }, e.languages.css.atrule.inside.rest = e.languages.css;
    var n = e.languages.markup;
    n && (n.tag.addInlined("style", "css"), e.languages.insertBefore("inside", "attr-value", {
      "style-attr": {
        pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
        inside: {
          "attr-name": {
            pattern: /^\s*style/i,
            inside: n.tag.inside
          },
          punctuation: /^\s*=\s*['"]|['"]\s*$/,
          "attr-value": {
            pattern: /.+/i,
            inside: e.languages.css
          }
        },
        alias: "language-css"
      }
    }, n.tag));
  }(t), t.languages.clike = {
    comment: [{
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: !0
    }, {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: !0,
      greedy: !0
    }],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: !0
    },
    "class-name": {
      pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
      lookbehind: !0,
      inside: {
        punctuation: /[.\\]/
      }
    },
    keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    boolean: /\b(?:true|false)\b/,
    function: /\w+(?=\()/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
    operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
    punctuation: /[{}[\];(),.:]/
  }, t.languages.javascript = t.languages.extend("clike", {
    "class-name": [t.languages.clike["class-name"], {
      pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
      lookbehind: !0
    }],
    keyword: [{
      pattern: /((?:^|})\s*)(?:catch|finally)\b/,
      lookbehind: !0
    }, {
      pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: !0
    }],
    number: /\b(?:(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+)n?|\d+n|NaN|Infinity)\b|(?:\b\d+\.?\d*|\B\.\d+)(?:[Ee][+-]?\d+)?/,
    function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
  }), t.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/, t.languages.insertBefore("javascript", "keyword", {
    regex: {
      pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})\]]))/,
      lookbehind: !0,
      greedy: !0
    },
    "function-variable": {
      pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
      alias: "function"
    },
    parameter: [{
      pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
      lookbehind: !0,
      inside: t.languages.javascript
    }, {
      pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
      inside: t.languages.javascript
    }, {
      pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
      lookbehind: !0,
      inside: t.languages.javascript
    }, {
      pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
      lookbehind: !0,
      inside: t.languages.javascript
    }],
    constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
  }), t.languages.insertBefore("javascript", "string", {
    "template-string": {
      pattern: /`(?:\\[\s\S]|\${[^}]+}|[^\\`])*`/,
      greedy: !0,
      inside: {
        interpolation: {
          pattern: /\${[^}]+}/,
          inside: {
            "interpolation-punctuation": {
              pattern: /^\${|}$/,
              alias: "punctuation"
            },
            rest: t.languages.javascript
          }
        },
        string: /[\s\S]+/
      }
    }
  }), t.languages.markup && t.languages.markup.tag.addInlined("script", "javascript"), t.languages.js = t.languages.javascript, "undefined" != typeof self && self.Prism && self.document && document.querySelector && (self.Prism.fileHighlight = function (e) {
    e = e || document;
    var n = {
      js: "javascript",
      py: "python",
      rb: "ruby",
      ps1: "powershell",
      psm1: "powershell",
      sh: "bash",
      bat: "batch",
      h: "c",
      tex: "latex"
    };
    Array.prototype.slice.call(e.querySelectorAll("pre[data-src]")).forEach(function (e) {
      if (!e.hasAttribute("data-src-loaded")) {
        for (var a, s = e.getAttribute("data-src"), o = e, i = /\blang(?:uage)?-([\w-]+)\b/i; o && !i.test(o.className);) o = o.parentNode;

        if (o && (a = (e.className.match(i) || [, ""])[1]), !a) {
          var r = (s.match(/\.(\w+)$/) || [, ""])[1];
          a = n[r] || r;
        }

        var l = document.createElement("code");
        l.className = "language-" + a, e.textContent = "", l.textContent = "Loading…", e.appendChild(l);
        var c = new XMLHttpRequest();
        c.open("GET", s, !0), c.onreadystatechange = function () {
          4 == c.readyState && (c.status < 400 && c.responseText ? (l.textContent = c.responseText, t.highlightElement(l), e.setAttribute("data-src-loaded", "")) : c.status >= 400 ? l.textContent = "✖ Error " + c.status + " while fetching file: " + c.statusText : l.textContent = "✖ Error: File does not exist or is empty");
        }, c.send(null);
      }
    }), t.plugins.toolbar && t.plugins.toolbar.registerButton("download-file", function (e) {
      var t = e.element.parentNode;

      if (t && /pre/i.test(t.nodeName) && t.hasAttribute("data-src") && t.hasAttribute("data-download-link")) {
        var n = t.getAttribute("data-src"),
            a = document.createElement("a");
        return a.textContent = t.getAttribute("data-download-link-label") || "Download", a.setAttribute("download", ""), a.href = n, a;
      }
    });
  }, document.addEventListener("DOMContentLoaded", function () {
    self.Prism.fileHighlight();
  }));
}),
    CodeFlask = function (e, t) {
  if (!e) throw Error("CodeFlask expects a parameter which is Element or a String selector");
  if (!t) throw Error("CodeFlask expects an object containing options as second parameter");
  if (e.nodeType) this.editorRoot = e;else {
    var n = document.querySelector(e);
    n && (this.editorRoot = n);
  }
  this.opts = t, this.startEditor();
};

CodeFlask.prototype.startEditor = function () {
  if (!injectCss(editorCss, null, this.opts.styleParent)) throw Error("Failed to inject CodeFlask CSS.");
  this.createWrapper(), this.createTextarea(), this.createPre(), this.createCode(), this.runOptions(), this.listenTextarea(), this.populateDefault(), this.updateCode(this.code);
}, CodeFlask.prototype.createWrapper = function () {
  this.code = this.editorRoot.innerHTML, this.editorRoot.innerHTML = "", this.elWrapper = this.createElement("div", this.editorRoot), this.elWrapper.classList.add("codeflask");
}, CodeFlask.prototype.createTextarea = function () {
  this.elTextarea = this.createElement("textarea", this.elWrapper), this.elTextarea.classList.add("codeflask__textarea", "codeflask__flatten");
}, CodeFlask.prototype.createPre = function () {
  this.elPre = this.createElement("pre", this.elWrapper), this.elPre.classList.add("codeflask__pre", "codeflask__flatten");
}, CodeFlask.prototype.createCode = function () {
  this.elCode = this.createElement("code", this.elPre), this.elCode.classList.add("codeflask__code", "language-" + (this.opts.language || "html"));
}, CodeFlask.prototype.createLineNumbers = function () {
  this.elLineNumbers = this.createElement("div", this.elWrapper), this.elLineNumbers.classList.add("codeflask__lines"), this.setLineNumber();
}, CodeFlask.prototype.createElement = function (e, t) {
  var n = document.createElement(e);
  return t.appendChild(n), n;
}, CodeFlask.prototype.runOptions = function () {
  this.opts.rtl = this.opts.rtl || !1, this.opts.tabSize = this.opts.tabSize || 2, this.opts.enableAutocorrect = this.opts.enableAutocorrect || !1, this.opts.lineNumbers = this.opts.lineNumbers || !1, this.opts.defaultTheme = !1 !== this.opts.defaultTheme, this.opts.areaId = this.opts.areaId || null, this.opts.ariaLabelledby = this.opts.ariaLabelledby || null, this.opts.readonly = this.opts.readonly || null, "boolean" != typeof this.opts.handleTabs && (this.opts.handleTabs = !0), "boolean" != typeof this.opts.handleSelfClosingCharacters && (this.opts.handleSelfClosingCharacters = !0), "boolean" != typeof this.opts.handleNewLineIndentation && (this.opts.handleNewLineIndentation = !0), !0 === this.opts.rtl && (this.elTextarea.setAttribute("dir", "rtl"), this.elPre.setAttribute("dir", "rtl")), !1 === this.opts.enableAutocorrect && (this.elTextarea.setAttribute("spellcheck", "false"), this.elTextarea.setAttribute("autocapitalize", "off"), this.elTextarea.setAttribute("autocomplete", "off"), this.elTextarea.setAttribute("autocorrect", "off")), this.opts.lineNumbers && (this.elWrapper.classList.add("codeflask--has-line-numbers"), this.createLineNumbers()), this.opts.defaultTheme && injectCss(defaultCssTheme, "theme-default", this.opts.styleParent), this.opts.areaId && this.elTextarea.setAttribute("id", this.opts.areaId), this.opts.ariaLabelledby && this.elTextarea.setAttribute("aria-labelledby", this.opts.ariaLabelledby), this.opts.readonly && this.enableReadonlyMode();
}, CodeFlask.prototype.updateLineNumbersCount = function () {
  for (var e = "", t = 1; t <= this.lineNumber; t++) e = e + '<span class="codeflask__lines__line">' + t + "</span>";

  this.elLineNumbers.innerHTML = e;
}, CodeFlask.prototype.listenTextarea = function () {
  var e = this;
  this.elTextarea.addEventListener("input", function (t) {
    e.code = t.target.value, e.elCode.innerHTML = escapeHtml(t.target.value), e.highlight(), setTimeout(function () {
      e.runUpdate(), e.setLineNumber();
    }, 1);
  }), this.elTextarea.addEventListener("keydown", function (t) {
    e.handleTabs(t), e.handleSelfClosingCharacters(t), e.handleNewLineIndentation(t);
  }), this.elTextarea.addEventListener("scroll", function (t) {
    e.elPre.style.transform = "translate3d(-" + t.target.scrollLeft + "px, -" + t.target.scrollTop + "px, 0)", e.elLineNumbers && (e.elLineNumbers.style.transform = "translate3d(0, -" + t.target.scrollTop + "px, 0)");
  });
}, CodeFlask.prototype.handleTabs = function (e) {
  if (this.opts.handleTabs) {
    if (9 !== e.keyCode) return;
    e.preventDefault();
    var t = this.elTextarea,
        n = t.selectionDirection,
        a = t.selectionStart,
        s = t.selectionEnd,
        o = t.value,
        i = o.substr(0, a),
        r = o.substring(a, s),
        l = o.substring(s),
        c = " ".repeat(this.opts.tabSize);

    if (a !== s && r.length >= c.length) {
      var d = a - i.split("\n").pop().length,
          u = c.length,
          p = c.length;
      if (e.shiftKey) o.substr(d, c.length) === c ? (u = -u, d > a ? (r = r.substring(0, d) + r.substring(d + c.length), p = 0) : d === a ? (u = 0, p = 0, r = r.substring(c.length)) : (p = -p, i = i.substring(0, d) + i.substring(d + c.length))) : (u = 0, p = 0), r = r.replace(new RegExp("\n" + c.split("").join("\\"), "g"), "\n");else i = i.substr(0, d) + c + i.substring(d, a), r = r.replace(/\n/g, "\n" + c);
      t.value = i + r + l, t.selectionStart = a + u, t.selectionEnd = a + r.length + p, t.selectionDirection = n;
    } else t.value = i + c + l, t.selectionStart = a + c.length, t.selectionEnd = a + c.length;

    var h = t.value;
    this.updateCode(h), this.elTextarea.selectionEnd = s + this.opts.tabSize;
  }
}, CodeFlask.prototype.handleSelfClosingCharacters = function (e) {
  if (this.opts.handleSelfClosingCharacters) {
    var t = e.key;
    if (["(", "[", "{", "<", "'", '"'].includes(t) || [")", "]", "}", ">", "'", '"'].includes(t)) switch (t) {
      case "(":
      case ")":
        this.closeCharacter(t);
        break;

      case "[":
      case "]":
        this.closeCharacter(t);
        break;

      case "{":
      case "}":
        this.closeCharacter(t);
        break;

      case "<":
      case ">":
      case "'":
      case '"':
        this.closeCharacter(t);
    }
  }
}, CodeFlask.prototype.setLineNumber = function () {
  this.lineNumber = this.code.split("\n").length, this.opts.lineNumbers && this.updateLineNumbersCount();
}, CodeFlask.prototype.handleNewLineIndentation = function (e) {
  if (this.opts.handleNewLineIndentation && 13 === e.keyCode) {
    e.preventDefault();
    var t = this.elTextarea,
        n = t.selectionStart,
        a = t.selectionEnd,
        s = t.value,
        o = s.substr(0, n),
        i = s.substring(a),
        r = s.lastIndexOf("\n", n - 1),
        l = r + s.slice(r + 1).search(/[^ ]|$/),
        c = l > r ? l - r : 0,
        d = o + "\n" + " ".repeat(c) + i;
    t.value = d, t.selectionStart = n + c + 1, t.selectionEnd = n + c + 1, this.updateCode(t.value);
  }
}, CodeFlask.prototype.closeCharacter = function (e) {
  var t = this.elTextarea.selectionStart,
      n = this.elTextarea.selectionEnd;

  if (this.skipCloseChar(e)) {
    var a = this.code.substr(n, 1) === e,
        s = a ? n + 1 : n,
        o = !a && ["'", '"'].includes(e) ? e : "",
        i = "" + this.code.substring(0, t) + o + this.code.substring(s);
    this.updateCode(i), this.elTextarea.selectionEnd = ++this.elTextarea.selectionStart;
  } else {
    var r = e;

    switch (e) {
      case "(":
        r = String.fromCharCode(e.charCodeAt() + 1);
        break;

      case "<":
      case "{":
      case "[":
        r = String.fromCharCode(e.charCodeAt() + 2);
    }

    var l = this.code.substring(t, n),
        c = "" + this.code.substring(0, t) + l + r + this.code.substring(n);
    this.updateCode(c);
  }

  this.elTextarea.selectionEnd = t;
}, CodeFlask.prototype.skipCloseChar = function (e) {
  var t = this.elTextarea.selectionStart,
      n = this.elTextarea.selectionEnd,
      a = Math.abs(n - t) > 0;
  return [")", "}", "]", ">"].includes(e) || ["'", '"'].includes(e) && !a;
}, CodeFlask.prototype.updateCode = function (e) {
  this.code = e, this.elTextarea.value = e, this.elCode.innerHTML = escapeHtml(e), this.highlight(), this.setLineNumber(), setTimeout(this.runUpdate.bind(this), 1);
}, CodeFlask.prototype.updateLanguage = function (e) {
  var t = this.opts.language;
  this.elCode.classList.remove("language-" + t), this.elCode.classList.add("language-" + e), this.opts.language = e, this.highlight();
}, CodeFlask.prototype.addLanguage = function (e, t) {
  prism.languages[e] = t;
}, CodeFlask.prototype.populateDefault = function () {
  this.updateCode(this.code);
}, CodeFlask.prototype.highlight = function () {
  prism.highlightElement(this.elCode, !1);
}, CodeFlask.prototype.onUpdate = function (e) {
  if (e && "[object Function]" !== {}.toString.call(e)) throw Error("CodeFlask expects callback of type Function");
  this.updateCallBack = e;
}, CodeFlask.prototype.getCode = function () {
  return this.code;
}, CodeFlask.prototype.runUpdate = function () {
  this.updateCallBack && this.updateCallBack(this.code);
}, CodeFlask.prototype.enableReadonlyMode = function () {
  this.elTextarea.setAttribute("readonly", !0);
}, CodeFlask.prototype.disableReadonlyMode = function () {
  this.elTextarea.removeAttribute("readonly");
};
var _default = CodeFlask;
exports.default = _default;
},{}],"code/style.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.code = exports.style = void 0;

var _emotion = require("emotion");

var _symbols = require("@rackai/symbols");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  .codeflask.codeflask {\n    background: none;\n    color: white;\n    padding: 0;\n  }\n  .codeflask__textarea.codeflask__textarea {\n    background: none;\n    color: white;\n    caret-color: white;\n  }\n  .codeflask__flatten.codeflask__flatten {\n    padding: 0;\n    color: white;\n    line-height: 22px;\n  }\n  .codeflask.codeflask .token.punctuation {\n    color: #4a4a4a;\n  }\n  .codeflask.codeflask .token.keyword {\n    color: #8500ff;\n  }\n  .codeflask.codeflask .token.operator {\n    color: #ff5598;\n  }\n  .codeflask.codeflask .token.string {\n    color: #41ad8f;\n  }\n  .codeflask.codeflask .token.comment {\n    color: #9badb7;\n  }\n  .codeflask.codeflask .token.function {\n    color: #8500ff;\n  }\n  .codeflask.codeflask .token.boolean {\n    color: #8500ff;\n  }\n  .codeflask.codeflask .token.number {\n    color: #8500ff;\n  }\n  .codeflask.codeflask .token.selector {\n    color: #8500ff;\n  }\n  .codeflask.codeflask .token.property {\n    color: #8500ff;\n  }\n  .codeflask.codeflask .token.tag {\n    color: #8500ff;\n  }\n  .codeflask.codeflask .token.attr-value {\n    color: #8500ff;\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var style = {
  margin: 6,
  background: (0, _symbols.opacify)('#D8D8D8', 0.05),
  padding: '16 20',
  minWidth: 420,
  maxWidth: 540,
  position: 'relative',
  borderRadius: 6,
  flex: '0 1 42%',
  display: 'flex',
  flexDirection: 'column',
  '> header': {
    padding: '0 0 10',
    opacity: 0.35,
    fontWeight: 700,
    textTransform: 'uppercase',
    fontSize: 12
  }
};
exports.style = style;
var code = {
  flex: 1,
  position: 'relative'
};
exports.code = code;
(0, _emotion.injectGlobal)(_templateObject());
},{"emotion":"../node_modules/emotion/dist/emotion.esm.js","@rackai/symbols":"../node_modules/@rackai/symbols/src/index.js"}],"code/utils.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.objectify = exports.prototypefy = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var prototypefy = function prototypefy(obj) {
  for (var param in obj) {
    var val = obj[param];
    if (_typeof(val) === 'object') prototypefy(val);else if (param === 'proto' || param === 'childProto') {
      val = val.split('.').reduce(function (o, i) {
        return o[i];
      }, UIkit);
      obj[param] = val;
    }
  }

  return obj;
};

exports.prototypefy = prototypefy;

var objectify = function objectify(string) {
  var splitKeys = /(\w+(?=:))|((?<=:\s)[a-zA-Z0-9.\s/'@?":]+(?=\n|,))/g;
  var toJSONFormat = (string + '\n').replace(splitKeys, '"$&"');
  var obj = JSON.parse(toJSONFormat);
  return prototypefy(obj);
};

exports.objectify = objectify;
},{}],"code/index.js":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _codeflask = _interopRequireDefault(require("codeflask"));

var _style = require("./style");

var _preview = _interopRequireDefault(require("../preview"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var str = "var Button = {\n  tag: 'button',\n  style: {\n    background: 'white',\n    color: 'black',\n    padding: '10 20',\n    fontSize: 16,\n    borderRadius: 10,\n    fontWeight: 500,\n    boxShadow: '0 3px 10px rgba(0, 0, 0, .35)',\n    border: 0\n  }\n}\n\nvar number = {\n  tag: 'h2',\n  text: 0\n}\n\nvar app = {\n  number,\n  increment: {\n    proto: Button,\n    text: 'Increment',\n    on: {\n      click: event => {\n        number.update({ text: number.text + 1 })\n      }\n    }\n  }\n}\n\n// connecting to preview\nwindow.app = app";
var _default = {
  style: _style.style,
  header: 'Code',
  content: {
    style: _style.code,
    attr: {
      contentEditable: true
    },
    on: {
      render: function render(element) {
        var flask = new _codeflask.default(element.node, {
          language: 'js',
          defaultTheme: false
        });
        flask.updateCode(str);
        flask.onUpdate(function (code) {
          // var obj = objectify(code.replace(/'/g, ''))
          // try {  } catch (error) {
          //   throw error
          // }
          eval(code);

          _preview.default.center.set(app);
        });
      }
    }
  }
};
exports.default = _default;
},{"codeflask":"../node_modules/codeflask/build/codeflask.module.js","./style":"code/style.js","../preview":"preview/index.js","./utils":"code/utils.js"}],"index.js":[function(require,module,exports) {
'use strict';

var _domql = _interopRequireDefault(require("@rackai/domql"));

var _symbols = _interopRequireDefault(require("@rackai/symbols"));

require("./define");

var _style = require("./canvas/style");

var _preview = _interopRequireDefault(require("./preview"));

var _code = _interopRequireDefault(require("./code"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

window.DOM = _domql.default;
window.Symbols = _symbols.default;

var dom = _domql.default.create({
  style: _style.style,
  preview: _preview.default,
  code: _code.default
});
},{"@rackai/domql":"../node_modules/@rackai/domql/src/index.js","@rackai/symbols":"../node_modules/@rackai/symbols/src/index.js","./define":"define.js","./canvas/style":"canvas/style.js","./preview":"preview/index.js","./code":"code/index.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49181" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map