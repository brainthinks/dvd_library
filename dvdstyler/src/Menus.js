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

  createFromPgc (pgc, index, title, logo, videos, isAvailableImage) {
    if (!pgc) {
      throw new Error('A pgc element is required to construct a menu.');
    }
    if (!index && index !== 0) {
      throw new Error('An index is required to construct a menu.');
    }
    if (!title) {
      throw new Error('A disk title is required to construct a menu.');
    }
    if (!logo) {
      throw new Error('A logo for menu sidebars is required to construct a menu.');
    }
    if (!videos) {
      throw new Error('Video definitions are required to construct a menu.');
    }
    if (!isAvailableImage) {
      throw new Error('An image to indicate language availability is required to construct a menu.');
    }

    const menu = Menu.fromVobMenu(
      pgc.vob[0].menu[0],
      index,
      title,
      logo,
      videos,
      isAvailableImage,
    );

    this.menus.push(menu);
  }

  createFromPgcs (pgcs, title, logo, videos, isAvailableImage) {
    const numPgcs = pgcs.length;

    for (let i = 0; i < numPgcs; i++) {
      this.createFromPgc(
        pgcs[i],
        i,
        title,
        logo,
        videos,
        isAvailableImage,
      );
    }
  }
};
