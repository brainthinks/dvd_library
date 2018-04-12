'use strict';

const fs = require('fs');
const xml2js = require('xml2js');
// const util = require('util');

const MainMenu = require('./menus/mainMenu/');
const LanguageOptionsMenu = require('./menus/languageOptionsMenu/');
const Titleset = require('./titleset/Titleset');

module.exports = class DvdStylerProject {
  static factory (config) {
    return new DvdStylerProject(config);
  }

  constructor (
    {
      name,
      title,
      logo,
      videos,
      quality,
      isAvailableImage,
    } = {}
  ) {
    if (!name) {
      throw new Error('DvdStylerProject needs a name.');
    }
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

    this.name = name;
    this.title = title;
    this.logo = logo;
    this.videos = videos;
    this.quality = quality;
    this.isAvailableImage = isAvailableImage;

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
    this.root = {
      dvdstyler: {
        $: {
          format: 4,
          template: 'Basic/neon.dvdt',
          isoFile: '/home/user/dvd.iso',
          name: this.name,
          defPostCommand: 1,
          videoFormat: 3,
          audioFormat: 3,
          aspectRatio: 1,
        },
        colours: [{
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
        }],
        vmgm: [{
          fpc: [{
            _: 'g1=0;jump vmgm menu 1;',
          }],
          menus: [{
            video: [{
              $: {
                format: 'ntsc',
                aspect: '4:3',
                widescreen: 'nopanscan',
              },
            }],
            audio: [{ $: { lang: 'EN' } }],
            subpicture: [{ $: { lang: 'EN' } }],
            pgc: this.menus.map((menu) => menu.pgc),
          }],
        }],
        titleset: this.titlesets.map((titleset) => titleset.titleset),
      },
    };
  };

  toFile (pathToFile) {
    const builder = new xml2js.Builder();

    // console.log(util.inspect(this.root.dvdstyler.vmgm[0].menus[0].pgc[0].vob[0].menu[0], false, null))

    const xml = builder.buildObject(this.root)
      // @todo - this is hopefully unnecessary, but I wasn't able to figure out
      // how to do this properly with xml2js
      .replace(/&lt;tbreak\/&gt;/gi, global.NEWLINE);

    return new Promise((resolve, reject) => {
      fs.writeFile(pathToFile, xml, (error) => {
        if (error) {
          return reject(error);
        }

        resolve();
      });
    });
  }
};
