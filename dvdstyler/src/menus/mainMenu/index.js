'use strict';

const Menu = require('../Menu');
const Playlist = require('./playlist/Playlist');
const Title = require('../Title');
const Sidebar = require('../Sidebar');

module.exports = class MainMenu extends Menu {
  static fromVobMenu (menu, index, title, logo, videos, isAvailableImage) {
    return MainMenu.factory(menu, index, title, logo, videos, isAvailableImage);
  }

  static factory (menu, index, title, logo, videos, isAvailableImage) {
    return new MainMenu(menu, index, title, logo, videos, isAvailableImage);
  }

  constructor (menu, index, title, logo, videos, isAvailableImage) {
    super(menu, index, title, logo, videos, isAvailableImage);

    // Set it as the title menu
    this.pgc.$ = { entry: 'title' };

    const menuTitle = Title.fromIndex(index, title);

    const sidebar = Sidebar.fromIndex(index, logo)
      .generateLogo()
      .generatePlayAllButton()
      .generateLanguageOptionsButton();

    const playlist = Playlist.factory(videos, isAvailableImage);

    this.addMenuAssets(
      menuTitle,
      sidebar,
      playlist,
    );
  }
};
