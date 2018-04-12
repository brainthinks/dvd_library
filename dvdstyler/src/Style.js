'use strict';

module.exports = class Style {
  static factory (styles) {
    return new Style(styles);
  }

  constructor (styles) {
    this.styles = styles;
  }

  toXmlString () {
    let xmlString = '';

    for (let prop in this.styles) {
      xmlString += `${prop}:${this.styles[prop]};`;
    }

    return xmlString;
  }
};
