'use strict';

const MenuAssets = require('../MenuAssets');

module.exports = class Subtitle extends MenuAssets {
  static factory (id, text) {
    return new Subtitle(id, text);
  }

  constructor (id, text) {
    super(id);

    this.text = text;

    this.s_id = `s_${this.id}`;
    this.href = `#${this.s_id}`;

    this.generateSvgDef();
    this.generateGObjectUses();
    this.generateObject();
  }

  generateSvgDef () {
    this.svgs.push({
      $: { id: this.s_id },
      defs: [{
        filter: [{
          $: { id: 'shadowFilter' },
          feGaussianBlur: [{ $: { stdDeviation: 3 } }],
        }],
      }],
      rect: [{
        $: {
          x: 0,
          y: 0,
          width: '100%',
          height: '100%',
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
            style: 'dominant-baseline:middle;font-family:Standard Symbols L;font-size:24;font-style:normal;font-weight:bold;stroke-width:0;text-anchor:middle;',
          },
          _: this.text,
        }],
      }],
    });
  }

  generateGObjectUses () {
    this.gObjectUses.push({
      $: {
        x: 212,
        y: 88,
        width: 446,
        height: 24,
        id: this.id,
        'xlink:href': this.href,
      },
    });
  }

  generateObject () {
    this.objects.push({
      $: { id: this.id },
      filename: [{ _: 'text-v2.xml' }],
    });
  }
};
