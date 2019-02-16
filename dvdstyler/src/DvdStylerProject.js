'use strict';

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const xml2js = require('xml2js');

const MainMenu = require('./menus/mainMenu/');
const LanguageOptionsMenu = require('./menus/languageOptionsMenu/');
const Titleset = require('./titleset/Titleset');

const utils = require('./utils/');

module.exports = class DvdStylerProject {
  static factory (config) {
    return new DvdStylerProject(config);
  }

  static async generateISO (pathToXml, pathToIso) {
    await utils.asPromise(child_process.exec)(`mkdir -p "${path.dirname(pathToFile)}"`);
    await utils.asPromise(fs.writeFile)(pathToFile, xml);
  }

  constructor ({
    title,
    logo,
    videos,
    quality,
    isAvailableImage,
    ...config
  } = {}) {
    if (!title) {
      throw new Error('DvdStylerProject needs a title.');
    }
    if (!logo) {
      throw new Error('DvdStylerProject needs a logo.');
    }
    if (!videos) {
      throw new Error('DvdStylerProject needs videos.');
    }
    if (!quality) {
      throw new Error('DvdStylerProject needs quality.');
    }
    if (!isAvailableImage) {
      throw new Error('DvdStylerProject needs an isAvailableImage.');
    }

    this.title = title;
    this.logo = logo;
    this.videos = videos;
    this.quality = quality;
    this.isAvailableImage = isAvailableImage;
    this.config = config;

    this.menus = [];
    this.titlesets = [];
  }

  generateMenus () {
    this.menus.push(MainMenu.factory(
      'main_menu',
      this.title,
      this.logo,
      this.videos,
      this.isAvailableImage,
      {
        isTitleMenu: true,
      }
    ));

    this.menus.push(LanguageOptionsMenu.factory(
      'language_options_menu',
      this.title,
      this.logo,
      this.videos,
      this.isAvailableImage,
    ));
  }

  generateTitlesets () {
    this.titlesets.push(Titleset.factory(this.videos, this.quality));
  }

  generateRoot () {
    this.body = {
      vmgm: [
        {
          fpc: [
            {
              _: 'g1=0;jump vmgm menu 1;',
            },
          ],
          menus: [
            {
              video: [
                {
                  $: {
                    format: 'ntsc',
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
              ],
              subpicture: [
                {
                  $: {
                    lang: 'EN',
                  },
                },
              ],
              pgc: this.menus.map((menu) => menu.pgc),
            },
          ],
        },
      ],
      titleset: this.titlesets.map((titleset) => titleset.titleset),
    };

    this.dvdstylerRoot = {
      dvdstyler: {
        $: {
          format: 4,
          template: 'Basic/neon.dvdt',
          isoFile: this.config.targets.iso,
          name: this.config.isoName,
          defPostCommand: 1,
          videoFormat: 3,
          audioFormat: 3,
          aspectRatio: 1,
        },
        colours: [
          {
            $: {
              colour0: '#aae3ff',
              colour1: '#00356a',
              colour2: '#0000ec',
              colour3: '#0080c0',
              colour4: '#0000ec',
              colour5: '#0000ec',
              colour6: '#0080c0',
              colour7: '#0080c0',
              colour8: '#0080c0',
            },
          },
        ],
        ...this.body,
      },
    };
  }

  async generateDvdStylerXML (target) {
    const builder = new xml2js.Builder();

    const xml = builder.buildObject(this.dvdstylerRoot)
      // @todo - this is hopefully unnecessary, but I wasn't able to figure out
      // how to do this properly with xml2js
      .replace(/&lt;tbreak\/&gt;/gi, global.NEWLINE);

    await utils.asPromise(child_process.exec)(`mkdir -p "${path.dirname(target)}"`);
    await utils.asPromise(fs.writeFile)(target, xml);
  }

  async prepareIsoDirectory (pathToIso) {
    await utils.asPromise(child_process.exec)(`mkdir -p "${path.dirname(pathToIso)}"`);
  }
};
