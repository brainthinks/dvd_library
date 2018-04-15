'use strict';

const Menu = require('../Menu');
const Playlist = require('./playlist/Playlist');
const Title = require('../Title');
const Sidebar = require('../Sidebar');

module.exports = class MainMenu extends Menu {
  static factory (id, title, logo, videos, isAvailableImage, options) {
    return new MainMenu(id, title, logo, videos, isAvailableImage);
  }

  constructor (id, title, logo, videos, isAvailableImage, options) {
    super(id, title, logo, videos, isAvailableImage, options);

    const menuTitle = Title.fromIndex(id, title);

    const sidebar = Sidebar.fromIndex(id, logo)
      .generateLogo()
      .generatePlayAllButton()
      .generateLanguageOptionsButton();

    const playAllButtonId = sidebar.buttons[0].$.id;
    const languageOptionsButtonId = sidebar.buttons[1].$.id;

    const playlist = Playlist.factory(videos, isAvailableImage, playAllButtonId);

    const playlistFirstItemId = playlist.items.items[0].button.$.id;

    sidebar.setButtonDirection(0, {
      left: playAllButtonId,
      right: playlistFirstItemId,
      up: languageOptionsButtonId,
      down: languageOptionsButtonId,
    });

    sidebar.setButtonDirection(1, {
      left: languageOptionsButtonId,
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
