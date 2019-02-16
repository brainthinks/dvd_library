'use strict';

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');
const xml2js = require('xml2js');

const Logger = require('./Logger');
const MainMenu = require('./menus/mainMenu/');
const LanguageOptionsMenu = require('./menus/languageOptionsMenu/');
const Titleset = require('./titleset/Titleset');
const utils = require('./utils/');

module.exports = class DvdStylerProject {
  static factory (discConfig) {
    return new DvdStylerProject(discConfig);
  }

  // @todo - this isn't used
  static async generateISO (pathToXml, pathToIso) {
    await utils.asPromise(child_process.exec)(`mkdir -p "${path.dirname(pathToFile)}"`);
    await utils.asPromise(fs.writeFile)(pathToFile, xml);
  }

  constructor (discConfig) {
    try {
      this.logger = Logger.factory('DvdStylerProject');

      if (!discConfig) {
        throw this.logger.error('"discConfig" is required');
      }
      if (!discConfig.title) {
        throw this.logger.error('"discConfig.title" is required');
      }
      if (!discConfig.logo) {
        throw this.logger.error('"discConfig.logo" is required');
      }
      if (!discConfig.isAvailableImage) {
        throw this.logger.error('"discConfig.isAvailableImage" is required');
      }
      if (!discConfig.quality) {
        throw this.logger.error('"discConfig.quality" is required');
      }
      if (!discConfig.targets) {
        throw this.logger.error('"discConfig.targets" is required');
      }
      if (!discConfig.targets.dvds) {
        throw this.logger.error('"discConfig.targets.dvds" is required');
      }
      if (!discConfig.targets.iso) {
        throw this.logger.error('"discConfig.targets.iso" is required');
      }
      if (!discConfig.isoName) {
        throw this.logger.error('"discConfig.isoName" is required');
      }
      if (!discConfig.videos) {
        throw this.logger.error('"discConfig.videos" is required');
      }

      this.logger.debug(`Creating DvdStylerProject for ${discConfig.title}`);

      this.title = discConfig.title;
      this.logo = discConfig.logo;
      this.isAvailableImage = discConfig.isAvailableImage;
      this.quality = discConfig.quality;
      this.targets = discConfig.targets;
      this.isoName = discConfig.isoName;
      // @todo - make the rest of the tools use an object rather than an
      // array so we don't have to modify the value that gets passed in
      // here.
      this.videos = Object.values(discConfig.videos);

      this.menus = [];
      this.titlesets = [];
    }
    catch (error) {
      this.logger.error('Failed to instantiate this DvdStylerProject');
      throw error;
    }
  }

  generateMenus () {
    try {
      this.logger.debug(`Generating menus for ${this.title}`);

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
    catch (error) {
      this.logger.error(`Failed to generate menus for "${this.title}"`);
      throw error;
    }
  }

  generateTitlesets () {
    try {
      this.logger.debug(`Generating menus for ${this.title}`);

      this.titlesets.push(Titleset.factory(this.videos, this.quality));
    }
    catch (error) {
      this.logger.error(`Failed to generate title sets for "${this.title}"`);
      throw error;
    }
  }

  generateRoot () {
    try {
      if (!this.titlesets || !this.titlesets.length) {
        throw this.logger.error('You must first run generateTitlesets');
      }

      this.logger.debug(`Generating root template for ${this.title}`);

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
            isoFile: this.targets.iso,
            name: this.isoName,
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
    catch(error) {
      this.logger.error(`Failed to generate root template for "${this.title}"`);
      throw error;
    }
  }

  async generateDvdStylerXML () {
    try {
      if (!this.dvdstylerRoot) {
        throw this.logger.error('You must first run generateRoot');
      }

      this.logger.debug(`Generating dvdstyler template for ${this.title}`);

      const builder = new xml2js.Builder();

      const xml = builder.buildObject(this.dvdstylerRoot)
        // @todo - this is hopefully unnecessary, but I wasn't able to figure out
        // how to do this properly with xml2js
        .replace(/&lt;tbreak\/&gt;/gi, global.NEWLINE);

      await utils.asPromise(child_process.exec)(`mkdir -p "${path.dirname(this.targets.dvds)}"`);
      await utils.asPromise(fs.writeFile)(this.targets.dvds, xml);
    }
    catch (error) {
      this.logger.error(`Failed to generate dvdstyler template for "${this.title}"`);
      throw error;
    }
  }

  async prepareIsoDirectory () {
    try {
      this.logger.debug(`Preparing iso directory for ${this.title}`);

      await utils.asPromise(child_process.exec)(`mkdir -p "${path.dirname(this.targets.iso)}"`);
    }
    catch(error) {
      this.logger.error(`Failed to prepare iso directory for "${this.title}"`);
      throw error;
    }
  }
};
