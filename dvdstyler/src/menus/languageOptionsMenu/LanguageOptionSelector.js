'use strict';

const debug = require('debug')('dvdstyler:LanguageOptionSelector');

const MenuAssets = require('../MenuAssets');
const Style = require('~/Style');

module.exports = class LanguageOptionSelector extends MenuAssets {
  static factory (id, options) {
    return new LanguageOptionSelector(id, options);
  }

  constructor (id, {
    text, action, leftMargin, topMargin, width, height,
  }) {
    super(id);

    if (!text)
      throw new Error('LanguageOptionSelector needs text.');
    if (!action)
      throw new Error('LanguageOptionSelector needs an action.');
    if (!leftMargin)
      throw new Error('LanguageOptionSelector needs a left margin.');
    if (!topMargin)
      throw new Error('LanguageOptionSelector needs a topMargin.');
    if (!width)
      throw new Error('LanguageOptionSelector needs a width.');
    if (!height)
      throw new Error('LanguageOptionSelector needs a height.');

    this.buttonId = `button_${this.id}`;
    this.sButtonId = `s_${this.buttonId}`;

    this.text = text;
    this.action = action;
    this.leftMargin = leftMargin;
    this.topMargin = topMargin;
    this.width = width;
    this.height = height;

    this.generateSvg();
    this.generateGButtonUse();
    this.generateButton();
  }

  generateSvg () {
    this.svgs.push({
      $: {
        id: this.sButtonId,
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
            width: 10,
            height: 10,
            x: 10,
            y: '50%',
            id: 'square',
            style: Style.factory({
              fill: 'none',
            }).toXmlString(),
            transform: 'translate(0,-5)',
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
            id: 'gText',
            style: Style.factory({
              fill: '#ffffff',
              'fill-opacity': 1,
            }).toXmlString(),
          },
          text: [
            {
              $: {
                x: 30,
                y: '50%',
                id: 'text',
                'xml:space': 'preserve',
                style: Style.factory({
                  'dominant-baseline': 'middle',
                  'font-family': 'Liberation Serif',
                  'font-size': 18,
                  'font-style': 'normal',
                  'font-weight': 'normal',
                  'text-anchor': '',
                }).toXmlString(),
              },
              _: this.text,
            },
          ],
        },
      ],
    });
  }

  generateGButtonUse () {
    this.gButtonUses.push({
      $: {
        x: this.leftMargin,
        y: this.topMargin,
        width: this.width,
        height: this.height,
        id: this.buttonId,
        'xlink:href': `#${this.sButtonId}`,
      },
    });
  }

  generateButton () {
    this.buttons.push({
      $: {
        id: this.buttonId,
      },
      action: [
        {
          _: this.action,
        },
      ],
      direction: [
        {
          $: {},
        },
      ],
      filename: [
        {
          _: 'text-square-v2.xml',
        },
      ],
      parameter: [
        {
          $: {
            name: 'squareFill',
            normal: 'none',
            highlighted: '#0000ec',
            selected: '#a52a2a',
          },
        },
      ],
    });
  }
};
