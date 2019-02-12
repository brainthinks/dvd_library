'use strict';

const Title = require('./Title');

module.exports = class Titleset {
  static factory (configs, quality) {
    return new Titleset(configs, quality);
  }

  constructor (configs, quality) {
    if (!configs)
      throw new Error('Titleset requires configs');
    if (!quality)
      throw new Error('Titleset requires quality');

    this.configs = configs;
    this.quality = quality;

    this.generateTitleset();
  }

  generateTitleset () {
    this.titleset = {
      menus: [
        {
          video: [
            {
              $: {
                widescreen: 'nopanscan',
              },
            },
          ],
          audio: [
            {
              $: {
                lang: 'EN',
              },
            },
          ],
        },
      ],
      titles: [
        {
          video: [
            {
              $: {
                aspect: '4:3',
                widescreen: 'nopanscan',
              },
            },
          ],
          audio: [
            {
              $: {
                lang: 'EN',
              },
            },
            {
              $: {
                lang: 'ES',
              },
            },
          ],
          pgc: this.configs.map((config) => Title.factory(config, this.quality).pgc),
        },
      ],
    };
  }
};
