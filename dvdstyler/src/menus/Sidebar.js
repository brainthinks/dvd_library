'use strict';

const MenuAssets = require('./MenuAssets');
const Style = require('~/Style');

module.exports = class Sidebar extends MenuAssets {
  static fromIndex (index, logo) {
    return Sidebar.factory(`menu_${index}_sidebar`, logo);
  }

  static factory (id, logo) {
    return new Sidebar(id, logo);
  }

  constructor (id, logo) {
    super(id);

    this.logoImage = logo;

    this.leftMargin = 50;
    this.width = 150;
    this.buttonHeight = 75;
  }

  generateLogo () {
    this.logo = this._generateLogo({
      topMargin: 64,
      height: 242,
      logo: this.logoImage,
    });

    return this;
  }

  generatePlayAllButton () {
    this._generateButton({
      name: 'playAll',
      title: 'Play All',
      topMargin: 315,
      action: {
        tsi: 0,
        pgci: 1,
        playAll: 'true',
        playAllTitlesets: 'true',
      },
    });

    return this;
  }

  generateLanguageOptionsButton () {
    this._generateButton({
      name: 'languageOptions',
      title: `Language${global.NEWLINE}Options`,
      topMargin: 400,
      action: {
        pgci: 2,
      },
    });

    return this;
  }

  _generateLogo ({ topMargin, height, logo }) {
    const id = `${this.id}_logo`;
    const s_id = `s_${id}`;
    const href = `#${s_id}`;

    this.svgs.push({
      $: { id: s_id },
      image: [{
        $: {
          width: '100%',
          height: '100%',
          preserveAspectRatio: 'none',
          id: 'image',
          'xlink:href': logo,
          style: Style.factory({ opacity: 1 }).toXmlString(),
        },
      }],
    });

    this.gObjectUses.push({
      $: {
        x: this.leftMargin,
        y: topMargin,
        width: this.width,
        height,
        id,
        'xlink:href': href,
      },
    });

    this.objects.push({
      $: {
        id,
        keepAspectRatio: 'true',
        displayVideoFrame: 'false',
      },
      filename: [{ _: 'image.xml' }],
    });
  }

  _generateButton ({ name, title, topMargin, action }) {
    const container_id = `${this.id}_${name}_container`;
    const container_s_id = `s_${container_id}`;
    const container_href = `#${container_s_id}`;

    const button_id = `${this.id}_${name}_button`;
    const button_s_id = `s_${button_id}`;
    const button_href = `#${button_s_id}`;

    // Button container
    this.svgs.push({
      $: { id: container_s_id },
      defs: [{
        filter: [{
          $: { id: 'shadowFilter' },
          feGaussianBlur: [{ $: { stdDeviation: 3 } }],
        }],
      }],
      image: [{
        $: {
          width: '100%',
          height: '100%',
          preserveAspectRatio: 'xmidymid slice',
          id: 'image',
          style: Style.factory({ opacity: 1 }).toXmlString(),
        },
      }],
      use: [{
        $: {
          id: 'shadow',
          'xlink:href': '#rect',
          style: Style.factory({
            fill: 'none',
            filter: 'url(#shadowFilter)',
            stroke: '#404040',
            'stroke-opacity': 1,
            visibility: 'visible',
          }).toXmlString(),
        },
      }],
      g: [{
        $: {
          id: 'main',
          style: Style.factory({
            fill: '#000000',
            'fill-opacity': 1,
            stroke: '#768c9c',
            'stroke-opacity': 1,
          }).toXmlString(),
        },
        rect: [{
          $: {
            width: '100%',
            height: '100%',
            rx: 0,
            ry: 0,
            id: 'rect',
            style: Style.factory({ 'stroke-width': 5 }).toXmlString(),
          },
        }],
      }],
    });

    this.gObjectUses.push({
      $: {
        x: this.leftMargin,
        y: topMargin,
        width: this.width,
        height: this.buttonHeight,
        id: container_id,
        'xlink:href': container_href,
      },
    });

    this.objects.push({
      $: {
        id: container_id,
        displayVideoFrame: 'false',
      },
      filename: [{ _: 'frame-v3.xml' }],
    });

    // Button
    this.svgs.push({
      $: { id: button_s_id },
      defs: [{
        filter: [{
          $: { id: 'shadowFilter' },
          feGaussianBlur: { stdDeviation: 3 },
        }],
      }],
      rect: [{
        $: {
          width: '100%',
          height: '100%',
          rx: 5,
          ry: 5,
          id: 'background',
          style: Style.factory({
            file: 'none',
            'fill-opacity': 1,
          }).toXmlString(),
        },
      }],
      use: [{
        $: {
          id: 'shadow',
          'xlink:href': '#text',
          style: Style.factory({
            fill: '#404040',
            'fill-opacity': 1,
            filter: 'url(#shadowFilter)',
            visibility: 'hidden',
          }).toXmlString(),
        },
      }],
      g: [{
        $: {
          id: 'gText',
          style: Style.factory({ fill: '#ffffff' }).toXmlString(),
        },
        text: [{
          $: {
            x: '50%',
            y: '50%',
            id: 'text',
            'xml:space': 'preserve',
            style: Style.factory({
              'dominant-baseline': 'middle',
              'font-family': 'Sans',
              'font-size': 20,
              'font-style': 'normal',
              'font-weight': 'normal',
              'text-anchor': 'middle',
            }).toXmlString(),
          },
          _: title,
        }],
      }],
    });

    this.gButtonUses.push({
      $: {
        x: this.leftMargin,
        y: topMargin,
        width: this.width,
        height: this.buttonHeight,
        id: button_id,
        'xlink:href': button_href,
      },
    });

    this.buttons.push({
      $: { id: button_id },
      action: [{ $: action }],
      direction: [{ $: {} }],
      filename: [{ _: 'text-v3.xml' }],
      parameter: [{
        $: {
          name: 'text_fill',
          normal: '#ffffff',
          highlighted: '#0000ff',
          selected: '#ff0000',
        },
      }],
    });
  }
};
