'use strict';

const fs = require('fs');
const xml2js = require('xml2js');
const util = require('util');

const Menus = require('./Menus');

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

  constructor (root, { clientName, year, name, title, logo, videos, isAvailableImage }) {
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

    this.menus = Menus.factory();

    this.menus.createFromPgcs(
      this.root.dvdstyler.vmgm[0].menus[0].pgc,
      this.title,
      this.logo,
      this.videos,
      this.isAvailableImage,
    );
  }

  toFile (pathToFile) {
    const builder = new xml2js.Builder();

    // console.log(util.inspect(this.root.dvdstyler.vmgm[0].menus[0].pgc[0].vob[0].menu[0], false, null))
    const xml = builder.buildObject(this.root);

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
