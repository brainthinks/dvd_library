'use strict';

module.exports = class Title {
  static fromIndex (index, title) {
    return Title.factory(`menu_${index}_title`, title);
  }

  static factory (id, title) {
    return new Title(id, title);
  }

  constructor (id, title) {
    this.id = id;
    this.s_id = `s_${this.id}`;
    this.href = `#${this.s_id}`;
    this.title = title;

    this.svgDef = this.generateSvgDef();
    this.svgGObject = this.generateSvgGObject();
    this.object = this.generateObject();
  }

  generateSvgDef () {
    return {
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
          x: '0',
          y: '0',
          width: '100%',
          height: '100%',
          id: 'background',
          style: 'fill:none;fill-opacity:1;',
        },
      }],
      use: [{
        $: {
          x: '2',
          y: '2',
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
          _: this.title,
        }],
      }],
    };
  }

  generateSvgGObject () {
    return {
      $: {
        x: '104',
        y: '32',
        width: '506',
        height: '24',
        id: this.id,
        'xlink:href': this.href,
      },
    };
  }

  generateObject () {
    return {
      $: { id: this.id },
      filename: [{ _: 'text-v2.xml' }],
    };
  }
};
