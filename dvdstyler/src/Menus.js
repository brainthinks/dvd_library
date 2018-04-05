'use strict';

const Menu = require('./mainMenu/Menu');

module.exports = class Menus {
  static factory (menus = []) {
    return new Menus(menus);
  }

  constructor (menus) {
    if (!Array.isArray(menus)) {
      throw new Error('Menus must be an array.');
    }

    this.menus = menus;
  }

  createFromPgc (pgc, diskTitle) {
    if (!pgc) {
      throw new Error('A pgc element is required to construct a menu.');
    }

    if (!diskTitle) {
      throw new Error('A disk title is required to construct a menu.');
    }

    const menu = Menu.fromVobMenu(pgc.vob[0].menu[0], this.menus.length, diskTitle);

    this.menus.push(menu);
  }
};
