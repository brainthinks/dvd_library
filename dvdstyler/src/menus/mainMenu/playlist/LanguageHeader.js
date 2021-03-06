'use strict';

const Style = require('~/Style');

module.exports = class LanguageHeader {
  static factory (
    id, text, leftMargin, topMargin
  ) {
    return new LanguageHeader(
      id, text, leftMargin, topMargin
    );
  }

  constructor (
    id, text, leftMargin, topMargin
  ) {
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
      defs: [
        {
          filter: [
            {
              $: {
                id: 'shadowFilter',
              },
              feGaussianBlur: [
                {
                  $: {
                    stdDeviation: 3,
                  },
                },
              ],
            },
          ],
        },
      ],
      rect: [
        {
          $: {
            width: '100%',
            height: '100%',
            x: '0',
            y: '0',
            id: 'background',
            style: Style.factory({
              fill: 'none',
              'fill-opacity': 1,
            }).toXmlString(),
          },
        },
      ],
      use: [
        {
          $: {
            x: 2,
            y: 2,
            id: 'shadow',
            'xlink:href': '#text',
            style: Style.factory({
              fill: '#404040',
              'fill-opacity': 1,
              filter: 'url(#shadowFilter)',
              visibility: 'visible',
            }).toXmlString(),
          },
        },
      ],
      g: [
        {
          $: {
            id: 'main',
            style: Style.factory({
              fill: '#ffffff',
              'fill-opacity': 1,
              stroke: 'none',
              'stroke-opacity': 1,
            }).toXmlString(),
          },
          text: [
            {
              $: {
                x: '50%',
                y: '50%',
                id: 'text',
                'xml:space': 'preserve',
                style: Style.factory({
                  'dominant-baseline': 'middle',
                  'font-family': 'Noto Serif',
                  'font-size': 20,
                  'font-style': 'normal',
                  'font-weight': 'normal',
                  'stroke-width': 0,
                  'text-anchor': 'middle',
                }).toXmlString(),
              },
              _: this.text,
            },
          ],
        },
      ],
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
      filename: [
        {
          _: 'text-v2.xml',
        },
      ],
    };
  }
};
