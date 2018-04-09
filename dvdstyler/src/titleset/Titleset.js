'use strict';

const Title = require('./Title');

module.exports = class Titleset {
  static factory (configs) {
    return new Titleset(configs);
  }

  constructor (configs) {
    this.configs = configs;

    this.generateTitleset();
  }

  generateTitleset () {
    this.titleset = {
      menus: [{
        video: [{ $: { widescreen: 'nopanscan' } }],
        audio: [{ $: { lang: 'EN' } }],
      }],
      titles: [{
        video: [{
          $: {
            aspect: '4:3',
            widescreen: 'nopanscan',
          },
        }],
        audio: [
          { $: { lang: 'EN' } },
          { $: { lang: 'ES' } },
        ],
        pgc: this.configs.map((config) => Title.factory(config).pgc),
      }],
    };
  }

};
