'use strict';

const packageJson = require('../package.json');
const Debug = require('debug');

module.exports = class Logger {
  static factory (prefix, logDelimiter = '\t', prefixDelimiter = ':') {
    return new Logger(prefix, logDelimiter, prefixDelimiter);
  }

  constructor (prefix, logDelimiter, prefixDelimiter) {
    if (!prefix) {
      throw new Error('"prefix" is required to construct a Logger');
    }
    if (!logDelimiter) {
      throw new Error('"logDelimiter" is required to construct a Logger');
    }
    if (!prefixDelimiter) {
      throw new Error('"prefixDelimiter" is required to construct a Logger');
    }

    this.prefixDelimiter = prefixDelimiter;
    this.delimiter = logDelimiter;

    this.prefix = [packageJson.name, prefix].join(this.prefixDelimiter);
    this._debug = Debug(this.prefix);
  }

  prepareMessage (type, message) {
    return [type, Date.now(), message].join(this.delimiter);
  }

  // For development
  debug (message) {
    const preparedMessage = this.prepareMessage('DEBUG', message);

    this._debug(preparedMessage);

    return this;
  }

  // For system access logging
  info (message) {
    const preparedMessage = this.prepareMessage('INFO', message);

    this._debug(preparedMessage);
    console.log(preparedMessage);

    return this;
  }

  // For system error logging
  error (message) {
    if (typeof message === 'string') {
      message = new Error(message);
    }

    const preparedMessage = this.prepareMessage('ERROR', message.toString());

    this._debug(preparedMessage);
    console.error(preparedMessage);

    // return the Error instance
    return message;
  }
};
