'use strict';

module.exports = class MainMenu {
  static fromVobMenu (menu, index, title, logo, videos, isAvailableImage) {
    throw new Error('Abstract static method "fromVobMenu" not yet implemented...');
  }

  static factory (menu, index, title, logo, videos, isAvailableImage) {
    throw new Error('Abstract static method "factory" not yet implemented...');
  }

  constructor (menu, index, title, logo, videos, isAvailableImage) {
    if (!menu) {
      throw new Error('MainMenu needs a menu definition.');
    }
    if (!index && index !== 0) {
      throw new Error('MainMenu needs an index.');
    }
    if (!title) {
      throw new Error('MainMenu needs a title.');
    }
    if (!logo) {
      throw new Error('MainMenu needs a logo.');
    }
    if (!videos) {
      throw new Error('MainMenu needs video definitions.');
    }
    if (!isAvailableImage) {
      throw new Error('MainMenu needs isAvailableImage.');
    }

    this.svgs = [];
    this.gObjectUses = [];
    this.gButtonUses = [];
    this.objects = [];
    this.buttons = [];

    this.generateMenu();
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
                style: 'fill:#444444;',
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
