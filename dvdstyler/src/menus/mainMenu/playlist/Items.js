'use strict';

const Item = require('./Item');

module.exports = class Items {
  static factory (videos, options) {
    return new Items(videos, options);
  }

  constructor (
    videos,
    {
      spaceBetween,
      leftMargin,
      topMargin,
      languageOptions,
    } = {}
  ) {
    if (!videos) {
      throw new Error('Items needs videos.');
    }
    if (!spaceBetween) {
      throw new Error('Items needs spaceBetween');
    }
    if (!leftMargin) {
      throw new Error('Items needs leftMargin');
    }
    if (!topMargin) {
      throw new Error('Items needs topMargin');
    }
    if (!languageOptions) {
      throw new Error('Items needs languageOptions');
    }

    this.items = [];
    this.spaceBetween = spaceBetween;
    this.leftMargin = leftMargin;
    this.topMargin = topMargin;
    this.languageOptions = languageOptions;

    this.addItems(videos);
  }

  addItems (videos) {
    const numVideos = videos.length;

    for (let i = 0; i < numVideos; i++) {
      this.items.push(Item.factory(
        videos[i],
        i,
        {
          spaceBetween: this.spaceBetween,
          leftMargin: this.leftMargin,
          topMargin: this.topMargin,
          languageOptions: this.languageOptions,
        }
      ));
    }
  }

  forEach (func) {
    const numItems = this.items.length;

    for (let i = 0; i < numItems; i++) {
      func(this.items[i], i, this.items, this);
    }
  }

  map (func) {
    const results = [];

    this.forEach((item, index, items, context) => {
      results.push(func(item, index, items, context));
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
