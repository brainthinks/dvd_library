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
    const type = 'DEBUG';
    const preparedMessage = this.prepareMessage(type, message);

    this._debug(preparedMessage);

    return this;
  }

  // For system access logging
  info (message) {
    const type = 'INFO';
    const preparedMessage = this.prepareMessage(type, message);

    this._debug(preparedMessage);
    console.log(preparedMessage);

    return this;
  }

  warn (message) {
    const type = 'WARN';
    const preparedMessage = this.prepareMessage(type, message);

    this._debug(preparedMessage);
    console.warn(preparedMessage);

    return this;
  }

  // For system error logging
  error (message) {
    if (typeof message === 'string') {
      message = new Error(message);
    }

    const type = 'ERROR';
    const preparedMessage = this.prepareMessage(type, message.toString());

    this._debug(preparedMessage);
    console.error(type, message);

    // return the Error instance
    return message;
  }
};
