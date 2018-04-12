'use strict';

const Style = require('~/Style');

module.exports = class MainMenu {
  static factory (id, title, logo, videos, isAvailableImage, options) {
    throw new Error('Abstract static method "factory" not yet implemented...');
  }

  constructor (id, title, logo, videos, isAvailableImage, { isTitleMenu } = {}) {
    if (!id && id !== 0)
      throw new Error('MainMenu needs an id.');
    if (!title)
      throw new Error('MainMenu needs a title.');
    if (!logo)
      throw new Error('MainMenu needs a logo.');
    if (!videos)
      throw new Error('MainMenu needs video definitions.');
    if (!isAvailableImage)
      throw new Error('MainMenu needs isAvailableImage.');

    this.svgs = [];
    this.gObjectUses = [];
    this.gButtonUses = [];
    this.objects = [];
    this.buttons = [];

    this.generateMenu();

    if (isTitleMenu) {
      // Set it as the title menu
      this.pgc.$ = { entry: 'title' };
    }
  }

  addMenuAssets (...menuAssets) {
    const numMenuAssets = menuAssets.length;

    for (let i = 0; i < numMenuAssets; i++) {
      this.svgs.push(...menuAssets[i].svgs);
      this.gObjectUses.push(...menuAssets[i].gObjectUses);
      this.gButtonUses.push(...menuAssets[i].gButtonUses);
      this.objects.push(...menuAssets[i].objects);
      this.buttons.push(...menuAssets[i].buttons);
    }

    return this;
  }

  generateMenu () {
    this.pgc = {
      vob: [{
        $: { pause: 'inf' },
        menu: [{
          $: {
            videoFormat: 'NTSC',
            aspectRatio: 1,
          },
          svg: [{
            $: {
              width: 720,
              height: 540,
            },
            rect: [{
              $: {
                width: 720,
                height: 540,
                id: 'backgroundColour',
                style: Style.factory({ fill: '#444444' }).toXmlString(),
              },
            }],
            defs: [{
              $: { id: 'defs' },
              svg: this.svgs,
            }],
            g: [
              {
                $: { id: 'objects' },
                use: this.gObjectUses,
              },
              {
                $: { id: 'buttons' },
                use: this.gButtonUses,
              },
            ],
          }],
          button: this.buttons,
          object: this.objects,
        }],
      }],
    };

    return this;
  }
};
