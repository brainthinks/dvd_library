'use strict';

const MenuAssets = require('./MenuAssets');
const Style = require('~/Style');

module.exports = class Title extends MenuAssets {
  static fromIndex (index, title) {
    return Title.factory(`menu_${index}_title`, title);
  }

  static factory (id, title) {
    return new Title(id, title);
  }

  constructor (id, title) {
    super(id);

    this.title = title;

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
          feGaussianBlur: [{
            $: { stdDeviation: 3 },
          }],
        }],
      }],
      rect: [{
        $: {
          x: 0,
          y: 0,
          width: '100%',
          height: '100%',
          id: 'background',
          style: Style.factory({
            fill: 'none',
            'fill-opacity': 1,
          }).toXmlString(),
        },
      }],
      use: [{
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
      }],
      g: [{
        $: {
          id: 'main',
          style: Style.factory({
            fill: '#ffffff',
            'fill-opacity': 1,
            stroke: 'none',
            'stroke-opacity': 1,
          }).toXmlString(),
        },
        text: [{
          $: {
            x: '50%',
            y: '50%',
            id: 'text',
            'xml:space': 'preserve',
            style: Style.factory({
              'dominant-baseline': 'middle',
              'font-family': 'Standard Symbols L',
              'font-size': this.title.length > 55 ? 17 : 19,
              'font-style': 'normal',
              'font-weight': 'bold',
              'stroke-width': 0,
              'text-anchor': 'middle',
            }).toXmlString(),
          },
          _: this.title,
        }],
      }],
    });
  }

  generateGObjectUses () {
    this.gObjectUses.push({
      $: {
        x: 0,
        y: 32,
        width: '100%',
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
