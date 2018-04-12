'use strict';

const Menu = require('../Menu');
const Title = require('../Title');
const Sidebar = require('../Sidebar');
const Subtitle = require('./Subtitle');
const LanguageOptionSelector = require('./LanguageOptionSelector');
const ReturnButton = require('./ReturnButton');

module.exports = class LanguageOptionsMenu extends Menu {
  static fromVobMenu (menu, index, title, logo, videos, isAvailableImage) {
    return LanguageOptionsMenu.factory(menu, index, title, logo, videos, isAvailableImage);
  }

  static factory (menu, index, title, logo, videos, isAvailableImage) {
    return new LanguageOptionsMenu(menu, index, title, logo, videos, isAvailableImage);
  }

  constructor (menu, index, title, logo, videos, isAvailableImage) {
    super(menu, index, title, logo, videos, isAvailableImage);

    const menuTitle = Title.fromIndex(index, title);

    const sidebar = Sidebar.fromIndex(index, logo)
      .generateLogo();

    const spanishSelector = LanguageOptionSelector.factory('spanish', {
      text: 'Enable Spanish Audio Tracks (where available)',
      action: 'g1=1; jump menu 1;',
      leftMargin: 200,
      topMargin: 180,
      width: 400,
      height: 17,
    });

    const englishSelector = LanguageOptionSelector.factory('english', {
      text: 'Enable English Audio Tracks',
      action: 'g1=0; jump menu 1;',
      leftMargin: 200,
      topMargin: 180 + 30,
      width: 400,
      height: 17,
    });

    const subtitle = Subtitle.factory('subtitle', 'Language Options');

    const returnButton = ReturnButton.factory('return', {
      text: 'Return to Main Menu',
      action: 0,
      leftMargin: 200,
      topMargin: 288,
      width: 400,
      height: 17,
    });

    spanishSelector.setButtonDirection(0, {
      left: 'none',
      right: 'none',
      up: returnButton.buttonId,
      down: englishSelector.buttonId,
    });

    englishSelector.setButtonDirection(0, {
      left: 'none',
      right: 'none',
      up: spanishSelector.buttonId,
      down: returnButton.buttonId,
    });

    returnButton.setButtonDirection(0, {
      left: 'none',
      right: 'none',
      up: englishSelector.buttonId,
      down: spanishSelector.buttonId,
    });

    this.addMenuAssets(
      menuTitle,
      sidebar,
      spanishSelector,
      englishSelector,
      subtitle,
      returnButton,
    );
  }
};
