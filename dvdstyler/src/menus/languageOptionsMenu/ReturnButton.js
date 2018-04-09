'use strict';

const debug = require('debug')('dvdstyler:ReturnButton');

const MenuAssets = require('../MenuAssets');

module.exports = class ReturnButton extends MenuAssets {
  static factory (id, options) {
    return new ReturnButton(id, options);
  }

  constructor (id, { text, action, leftMargin, topMargin, width, height }) {
    super(id);

    if (!text) {
      throw new Error('ReturnButton needs text.');
    }
    if (!action && action !== 0) {
      throw new Error('ReturnButton needs an action.');
    }
    if (!leftMargin) {
      throw new Error('ReturnButton needs a left margin.');
    }
    if (!topMargin) {
      throw new Error('ReturnButton needs a topMargin.');
    }
    if (!width) {
      throw new Error('ReturnButton needs a width.');
    }
    if (!height) {
      throw new Error('ReturnButton needs a height.');
    }

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
      defs: [{
        filter: [{
          $: { id: 'shadowFilter' },
          feGaussianBlur: [{ $: { stdDeviation: 3 } }],
        }],
      }],
      rect: [{
        $: {
          width: 10,
          height: 10,
          x: 10,
          y: '50%',
          id: 'square',
          style: 'fill:none;',
          transform: 'translate(0,-5)',
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
          id: 'gText',
          style: 'fill:#ffffff;fill-opacity:1;',
        },
        text: [{
          $: {
            x: 30,
            y: '50%',
            id: 'text',
            'xml:space': 'preserve',
            style: 'dominant-baseline:middle;font-family:Liberation Serif;font-size:18;font-style:italic;font-weight:normal;text-anchor:;',
          },
          _: this.text,
        }],
      }],
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
      $: { id: this.buttonId },
      action: [{ $: { pgci: this.action } }],
      // @todo
      direction: [{
        $: {
          left: this.buttonId,
          right: this.buttonId,
          up: this.buttonId, // should point to spanish
          down: this.buttonId, // should point to english
        },
      }],
      filename: [{ _: 'text-square-v2.xml' }],
      parameter: [{
        $: {
          name: 'squareFill',
          normal: 'none',
          highlighted: '#0000ec',
          selected: '#a52a2a',
        },
      }],
    });
  }
};
