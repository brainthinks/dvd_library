'use strict';

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

const xml2js = require('xml2js');

const MainMenu = require('./menus/mainMenu/');
const LanguageOptionsMenu = require('./menus/languageOptionsMenu/');
const Titleset = require('./titleset/Titleset');

/**
 * Use async/await or Promises with asynchronous functions that require the use
 * of callbacks.
 *
 * There are still many node functions that are asynchronous but use callbacks
 * rather than promises.  There are probably other libraries that require the
 * caller to use callbacks rather than promises.
 *
 * This function will return a new function that returns a promise.  It returns
 * a function rather than directly returning the promise to give you more
 * freedom regarding how and when you want to execute the asynchronous function.
 *
 * e.g.
 *
 * ```javascript
 * const fs = require('fs');
 * const { asPromise } = require('brain-utils');
 *
 * await asPromise(fs.mkdir)('/path/to/dir');
 * ```
 *
 * When the promise resolves, it resolves with an array containing all of the
 * values that were sent to the callback, with the exception of the first
 * callback argument, which I assume to be the error.  This is configurable.
 *
 * e.g.
 *
 * ```javascript
 * const fs = require('fs');
 * const { asPromise } = require('brain-utils');
 *
 * const [ data ] = await asPromise(fs.readFile)('/path/to/file');
 * const [ error, data ] = await asPromise(fs.readFile, { resolveWithError: true })('/path/to/file');
 * ```
 *
 * @param  {Function} asyncFunction
 *   The function that takes a callback
 *
 * @param  {[Object]} options
 *   * context - if passed, the asyncFunction will be `call`'d with this as its context
 *   * resolveWithError - if `true`, the resolved value will contain the error argument from the callback
 *
 * @return {Function}
 *   A function that will return a Promise.  The returned function should be
 *   executed with the arguments that you would normally have passed the
 *   `asyncFunction`, except for the callback.
 */
function asPromise (asyncFunction, {
  context, resolveWithError,
} = {}) {
  if (!asyncFunction || typeof asyncFunction !== 'function') {
    throw new Error('asPromise needs a function.');
  }

  return (...args) => new Promise((resolve, reject) => {
    function callback (error, ...results) {
      if (error) {
        return reject(error);
      }

      if (resolveWithError) {
        return resolve([
          error,
          ...results,
        ]);
      }

      resolve(results);
    }

    if (context) {
      return asyncFunction.call(
        context, ...args, callback
      );
    }

    asyncFunction(...args, callback);
  });
}

module.exports = class DvdStylerProject {
  static factory (config) {
    return new DvdStylerProject(config);
  }

  static async generateISO (pathToXml, pathToIso) {
    await asPromise(child_process.exec)(`mkdir -p "${path.dirname(pathToFile)}"`);
    await asPromise(fs.writeFile)(pathToFile, xml);
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

    await asPromise(child_process.exec)(`mkdir -p "${path.dirname(target)}"`);
    await asPromise(fs.writeFile)(target, xml);
  }

  async prepareIsoDirectory (pathToIso) {
    await asPromise(child_process.exec)(`mkdir -p "${path.dirname(pathToIso)}"`);
  }
};
