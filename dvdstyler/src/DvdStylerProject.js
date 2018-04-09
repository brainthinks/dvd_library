'use strict';

const fs = require('fs');
const xml2js = require('xml2js');
// const util = require('util');

const MainMenu = require('./menus/mainMenu/');
const LanguageOptionsMenu = require('./menus/languageOptionsMenu/');
const Titleset = require('./titleset/Titleset');

module.exports = class DvdStylerProject {
  static async fromFile (pathToFile, options) {
    const parser = new xml2js.Parser();

    return new Promise((resolve, reject) => {
      fs.readFile(pathToFile, (error, dvds) => {
        if (error) {
          return reject(error);
        }

        parser.parseString(dvds, (error, dvdsXml) => {
          if (error) {
            return reject(error);
          }

          resolve(DvdStylerProject.fromXml(dvdsXml, options));
        });
      });
    });
  }

  static fromXml (xml, options) {
    return new DvdStylerProject(xml, options);
  }

  constructor (
    root,
    {
      clientName,
      year,
      name,
      title,
      logo,
      videos,
      isAvailableImage,
    } = {}
  ) {
    if (!root) {
      throw new Error('DvdStylerProject needs a root.');
    }
    if (!clientName) {
      throw new Error('DvdStylerProject needs a clientName.');
    }
    if (!year) {
      throw new Error('DvdStylerProject needs a year.');
    }
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
    if (!isAvailableImage) {
      throw new Error('DvdStylerProject needs an isAvailableImage.');
    }

    this.root = root;
    this.clientName = clientName;
    this.year = year;
    this.name = name;
    this.title = title;
    this.logo = logo;
    this.videos = videos;
    this.isAvailableImage = isAvailableImage;

    this.mainMenu = MainMenu.fromVobMenu(
      this.root.dvdstyler.vmgm[0].menus[0].pgc[0].vob[0].menu[0],
      0,
      title,
      logo,
      videos,
      isAvailableImage,
    );

    this.languageOptionsMenu = LanguageOptionsMenu.fromVobMenu(
      this.root.dvdstyler.vmgm[0].menus[0].pgc[1].vob[0].menu[0],
      1,
      title,
      logo,
      videos,
      isAvailableImage,
    );

    this.titleset = Titleset.factory(this.videos);

    // Mutate the root

    this.root.dvdstyler.vmgm[0].menus[0].pgc = [
      this.mainMenu.pgc,
      this.languageOptionsMenu.pgc,
    ];

    this.root.dvdstyler.titleset[0] = this.titleset.titleset;
  }

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
