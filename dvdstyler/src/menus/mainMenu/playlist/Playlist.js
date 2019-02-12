'use strict';

const LanguageHeader = require('./LanguageHeader');
const Items = require('./Items');

module.exports = class Playlist {
  static factory (
    videos, isAvailableImage, playAllButtonId
  ) {
    return new Playlist(
      videos, isAvailableImage, playAllButtonId
    );
  }

  static calculateSpaceBetweenItems (videos) {
    if (videos.length <= 15) {
      return 28;
    }

    if (videos.length <= 17) {
      return 24;
    }

    if (videos.length <= 19) {
      return 22;
    }

    throw new Error(`Cannot currently support ${videos.length} videos.`);
  }

  constructor (
    videos, isAvailableImage, playAllButtonId
  ) {
    if (!videos)
      throw new Error('Playlist needs a video definitions.');
    if (!isAvailableImage)
      throw new Error('Playlist needs isAvailableImage.');
    if (!playAllButtonId)
      throw new Error('Playlist needs playAllButtonId.');

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

    this.items = Items.factory(videos,
      {
        spaceBetween: Playlist.calculateSpaceBetweenItems(videos),
        // @todo - this should come from the Sidebar
        leftMargin: 200,
        // @todo - this should come from the Title
        topMargin: 90,
        languageOptions: {
          isAvailableImage,
          leftMargin: this.columnWidths.title,
          spaceBetween: this.columnWidths.language,
        },
        playAllButtonId,
      },);

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
