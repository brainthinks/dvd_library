'use strict';

const fs = require('fs');
const xml2js = require('xml2js');

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

  constructor (root, { clientName, year, diskName, diskTitle }) {
    this.root = root;
    this.clientName = clientName;
    this.year = year;
    this.diskName = diskName;
    this.diskTitle = diskTitle;

    this.menus = Menus.factory();

    this.menus.createFromPgc(this.root.dvdstyler.vmgm[0].menus[0].pgc[0], this.diskTitle);
    this.menus.createFromPgc(this.root.dvdstyler.vmgm[0].menus[0].pgc[1], this.diskTitle);
  }

  toFile (pathToFile) {
    const builder = new xml2js.Builder();
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
