'use strict';

const Item = require('./Item');

module.exports = class Items {
  static factory (videos, options) {
    return new Items(videos, options);
  }

  static determineTitleFontSize (videos) {
    let smallestTitleFontSize = 18;

    const numVideos = videos.length;

    for (let i = 0; i < numVideos; i++) {
      const video = videos[i];
      let titleFontSize = 18;

      if (video.title.length > 45) {
        titleFontSize = 16;
      }

      if (video.title.length > 55) {
        titleFontSize = 14;
      }

      if (video.title.length > 60) {
        titleFontSize = 13;
      }

      if (titleFontSize < smallestTitleFontSize) {
        smallestTitleFontSize = titleFontSize;
      }
    }

    return smallestTitleFontSize;
  }

  constructor (videos,
    {
      spaceBetween,
      leftMargin,
      topMargin,
      languageOptions,
      playAllButtonId,
    } = {}) {
    if (!videos)
      throw new Error('Items needs videos.');
    if (!spaceBetween)
      throw new Error('Items needs spaceBetween');
    if (!leftMargin)
      throw new Error('Items needs leftMargin');
    if (!topMargin)
      throw new Error('Items needs topMargin');
    if (!languageOptions)
      throw new Error('Items needs languageOptions');
    if (!playAllButtonId)
      throw new Error('Items needs playAllButtonId');

    this.items = [];
    this.spaceBetween = spaceBetween;
    this.leftMargin = leftMargin;
    this.topMargin = topMargin;
    this.languageOptions = languageOptions;
    this.playAllButtonId = playAllButtonId;

    this.addItems(videos);
  }

  addItems (videos) {
    const numVideos = videos.length;

    const titleFontSize = Items.determineTitleFontSize(videos);

    for (let i = 0; i < numVideos; i++) {
      this.items.push(Item.factory(
        videos[i],
        i,
        {
          titleFontSize,
          spaceBetween: this.spaceBetween,
          leftMargin: this.leftMargin,
          topMargin: this.topMargin,
          languageOptions: this.languageOptions,
        }
      ));
    }

    this.forEach((item, index) => {
      const nextButtonId = this.items[index + 1]
        ? this.items[index + 1].buttonId
        : this.items[0].buttonId;

      const previousButtonId = index === 0
        ? this.items[this.items.length - 1].buttonId
        : this.items[index - 1].buttonId;

      item.setButtonDirection({
        left: this.playAllButtonId,
        right: item.buttonId,
        up: previousButtonId,
        down: nextButtonId,
      });
    });
  }

  forEach (func) {
    const numItems = this.items.length;

    for (let i = 0; i < numItems; i++) {
      func(
        this.items[i], i, this.items, this
      );
    }
  }

  map (func) {
    const results = [];

    this.forEach((
      item, index, items, context
    ) => {
      results.push(func(
        item, index, items, context
      ));
    });

    return results;
  }

  getSvgs () {
    const svgs = [];

    this.forEach((item) => {
      svgs.push(item.svg);

      if (item.english) {
        svgs.push(item.english.svg);
      }

      if (item.spanish) {
        svgs.push(item.spanish.svg);
      }
    });

    return svgs;
  }

  getGObjectUses () {
    const gObjectUses = [];

    this.forEach((item) => {
      if (item.object) {
        gObjectUses.push(item.gUse);
      }

      if (item.english) {
        gObjectUses.push(item.english.gUse);
      }

      if (item.spanish) {
        gObjectUses.push(item.spanish.gUse);
      }
    });

    return gObjectUses;
  }

  getGButtonUses () {
    const gButtonUses = [];

    this.forEach((item) => {
      if (item.button) {
        gButtonUses.push(item.gUse);
      }
    });

    return gButtonUses;
  }

  getObjects () {
    const objects = [];

    this.forEach((item) => {
      if (item.object) {
        objects.push(item.object);
      }

      if (item.english) {
        objects.push(item.english.object);
      }

      if (item.spanish) {
        objects.push(item.spanish.object);
      }
    });

    return objects;
  }

  getButtons () {
    const buttons = [];

    this.forEach((item) => {
      if (item.button) {
        buttons.push(item.button);
      }
    });

    return buttons;
  }
};
