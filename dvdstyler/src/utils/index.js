'use strict';

const Logger = require('../Logger');

const logger = Logger.factory('utils');

let registeredUncaughtException = false;
let registeredUnhandledRejection = false;

/**
 * Use async/await or Promises with asynchronous functions that require the use
 * of callbacks.
 *
 * There are still many node functions that are asynchronous but use callbacks
 * rather than promises.  There are probably other libraries that require the
 * caller to use callbacks rather than promises.
 *
 * This function will return a new function that returns a promise.  It returns
 * a function rather than directly returning the promise to give you more
 * freedom regarding how and when you want to execute the asynchronous function.
 *
 * e.g.
 *
 * ```javascript
 * const fs = require('fs');
 * const { asPromise } = require('./utils/');
 *
 * await asPromise(fs.mkdir)('/path/to/dir');
 * ```
 *
 * When the promise resolves, it resolves with an array containing all of the
 * values that were sent to the callback, with the exception of the first
 * callback argument, which I assume to be the error.  This is configurable.
 *
 * e.g.
 *
 * ```javascript
 * const fs = require('fs');
 * const { asPromise } = require('./utils/');
 *
 * const [ data ] = await asPromise(fs.readFile)('/path/to/file');
 * const [ error, data ] = await asPromise(fs.readFile, { resolveWithError: true })('/path/to/file');
 * ```
 *
 * @param  {Function} asyncFunction
 *   The function that takes a callback
 *
 * @param  {[Object]} options
 *   * context - if passed, the asyncFunction will be `call`'d with this as its context
 *   * resolveWithError - if `true`, the resolved value will contain the error argument from the callback
 *
 * @return {Function}
 *   A function that will return a Promise.  The returned function should be
 *   executed with the arguments that you would normally have passed the
 *   `asyncFunction`, except for the callback.
 */
function asPromise(asyncFunction, {
  context, resolveWithError,
} = {}) {
  if (!asyncFunction || typeof asyncFunction !== 'function') {
    throw new Error('asPromise needs a function.');
  }

  return (...args) => new Promise((resolve, reject) => {
    function callback(error, ...results) {
      if (error) {
        return reject(error);
      }

      if (resolveWithError) {
        return resolve([
          error,
          ...results,
        ]);
      }

      resolve(results);
    }

    if (context) {
      return asyncFunction.call(
        context, ...args, callback
      );
    }

    asyncFunction(...args, callback);
  });
}

function registerGlobalUncaughtExceptionHandler() {
  if (!registeredUncaughtException) {
    registeredUncaughtException = true;

    logger.info('Registering Global Uncaught Exception Handler');

    process.on('uncaughtException', (error) => {
      logger.error('Caught uncaught exception, about to shut down!');
      logger.error(error);
    });
  }
}

function registerGlobalUnhandledRejectionHandler () {
  if (!registeredUnhandledRejection) {
    registeredUnhandledRejection = true;

    logger.info('Registering Global Unhandled Rejection Handler');

    process.on('unhandledRejection', (reason, p) => {
      logger.error('Caught unhandled rejection, about to shut down!');
      logger.error('Promise:');
      logger.error(p);
      logger.error('Reason:');
      logger.error(reason);
    });
  }
}

module.exports = {
  asPromise,
  registerGlobalUncaughtExceptionHandler,
  registerGlobalUnhandledRejectionHandler,
};
