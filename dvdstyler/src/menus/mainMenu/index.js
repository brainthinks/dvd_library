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

    const playAllButtonId = sidebar.buttons[0].$.id;
    const languageOptionsButtonId = sidebar.buttons[1].$.id;

    const playlist = Playlist.factory(videos, isAvailableImage, playAllButtonId);

    const playlistFirstItemId = playlist.items.items[0].button.$.id;

    sidebar.setButtonDirection(0, {
      left: 'none',
      right: playlistFirstItemId,
      up: languageOptionsButtonId,
      down: languageOptionsButtonId,
    });

    sidebar.setButtonDirection(1, {
      left: 'none',
      right: playlistFirstItemId,
      up: playAllButtonId,
      down: playAllButtonId,
    });

    this.addMenuAssets(
      menuTitle,
      sidebar,
      playlist,
    );
  }
};
