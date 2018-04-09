'use strict';

const LanguageHeader = require('./LanguageHeader');
const Items = require('./Items');

module.exports = class Playlist {
  static factory (videos, isAvailableImage) {
    return new Playlist(videos, isAvailableImage);
  }

  constructor (videos, isAvailableImage) {
    if (!videos) {
      throw new Error('Playlist needs a video definitions.');
    }
    if (!isAvailableImage) {
      throw new Error('Playlist needs isAvailableImage.');
    }

    this.columnWidths = {
      title: 600,
      language: 40,
    };

    this.rowHeight = 17; // 22?
    this.topMargin = 64;

    this.englishHeader = LanguageHeader.factory(
      'english_availability_header',
      'EN',
      this.columnWidths.title,
      this.topMargin
    );

    this.spanishHeader = LanguageHeader.factory(
      'spanish_availability_header',
      'SP',
      (this.columnWidths.title + this.columnWidths.language),
      this.topMargin
    );

    this.items = Items.factory(
      videos,
      {
        spaceBetween: 28,
        // @todo - this should come from the Sidebar
        leftMargin: 200,
        // @todo - this should come from the Title
        topMargin: 96,
        languageOptions: {
          isAvailableImage,
          leftMargin: this.columnWidths.title,
          spaceBetween: this.columnWidths.language,
        },
      },
    );

    this.svgs = [
      this.englishHeader.svg,
      this.spanishHeader.svg,
      ...this.items.getSvgs(),
    ];
    this.gObjectUses = [
      this.englishHeader.gUse,
      this.spanishHeader.gUse,
      ...this.items.getGObjectUses(),
    ];
    this.gButtonUses = [
      ...this.items.getGButtonUses(),
    ];
    this.objects = [
      this.englishHeader.object,
      this.spanishHeader.object,
      ...this.items.getObjects(),
    ];
    this.buttons = [
      ...this.items.getButtons(),
    ];
  }
};
