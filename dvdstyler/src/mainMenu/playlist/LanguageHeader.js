'use strict';

module.exports = class LanguageHeader {
  static factory (id, text, leftMargin, topMargin) {
    return new LanguageHeader(id, text, leftMargin, topMargin);
  }

  constructor (id, text, leftMargin, topMargin) {
    if (!id) {
      throw new Error('LanguageHeader needs an id.');
    }
    if (!text) {
      throw new Error('LanguageHeader needs text.');
    }
    if (!leftMargin) {
      throw new Error('LanguageHeader needs a left margin.');
    }
    if (!topMargin) {
      throw new Error('LanguageHeader needs a top margin.');
    }

    this.id = id;
    this.objectId = `object_${this.id}`;
    this.sObjectId = `s_${this.objectId}`;

    this.text = text;

    this.leftMargin = leftMargin;
    this.topMargin = topMargin;

    this.width = 33;
    this.height = 22;

    this.svg = this.generateSvg();
    this.gUse = this.generateGUse();
    this.object = this.generateObject();
  }

  generateSvg () {
    return {
      $: {
        id: this.sObjectId,
      },
      defs: [{
        filter: [{
          $: { id: 'shadowFilter' },
          feGaussianBlur: [{ $: { stdDeviation: 3 } }],
        }],
      }],
      rect: [{
        $: {
          width: '100%',
          height: '100%',
          x: '0',
          y: '0',
          id: 'background',
          style: 'fill:none;fill-opacity:1;',
        },
      }],
      use: [{
        $: {
          x: 2,
          y: 2,
          id: 'shadow',
          'xlink:href': '#text',
          style: 'fill:#404040;fill-opacity:1;filter:url(#shadowFilter);visibility:visible;',
        },
      }],
      g: [{
        $: {
          id: 'main',
          style: 'fill:#ffffff;fill-opacity:1;stroke:none;stroke-opacity:1;',
        },
        text: [{
          $: {
            x: '50%',
            y: '50%',
            id: 'text',
            'xml:space': 'preserve',
            style: 'dominant-baseline:middle;font-family:Noto Serif;font-size:20;font-style:normal;font-weight:normal;stroke-width:0;text-anchor:middle;',
          },
          _: this.text,
        }],
      }],
    };
  }

  generateGUse () {
    return {
      $: {
        x: this.leftMargin,
        y: this.topMargin,
        width: this.width,
        height: this.height,
        id: this.objectId,
        'xlink:href': `#${this.sObjectId}`,
      },
    };
  }

  generateObject () {
    return {
      $: {
        id: this.objectId,
        defSize: 'true',
        displayVideoFrame: 'false',
      },
      filename: [{ _: 'text-v2.xml' }],
    };
  }
};
