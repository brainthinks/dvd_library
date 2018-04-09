'use strict';

const debug = require('debug')('dvdstyler:LanguageAvailable');

module.exports = class LanguageAvailable {
  static factory (id, image, leftMargin, topMargin) {
    debug(`factory - ${id}, ${image}, ${leftMargin}, ${topMargin}`);

    return new LanguageAvailable(id, image, leftMargin, topMargin);
  }

  constructor (id, image, leftMargin, topMargin) {
    debug(`constructor - ${id}, ${image}, ${leftMargin}, ${topMargin}`);

    if (!id) {
      throw new Error('LanguageAvailable needs an id.');
    }
    if (!image) {
      throw new Error('LanguageAvailable needs to know what image to use.');
    }
    if (!leftMargin) {
      throw new Error('LanguageAvailable needs a left margin.');
    }
    if (!topMargin) {
      throw new Error('LanguageAvailable needs a topMargin.');
    }

    this.id = id;
    this.objectId = `object_${this.id}`;
    this.sObjectId = `s_${this.objectId}`;

    this.image = image;
    this.size = 24;
    this.leftMargin = leftMargin + 3;
    this.topMargin = topMargin;

    this.svg = this.generateSvg();
    this.gUse = this.generateGUse();
    this.object = this.generateObject();
  }

  generateSvg () {
    return {
      $: {
        id: this.sObjectId,
      },
      image: [{
        $: {
          width: '100%',
          height: '100%',
          preserveAspectRatio: 'none',
          id: 'image',
          'xlink:href': this.image,
          style: 'opacity:1;',
        },
      }],
    };
  }

  generateGUse () {
    return {
      $: {
        x: this.leftMargin,
        y: this.topMargin,
        width: this.size,
        height: this.size,
        id: this.objectId,
        'xlink:href': `#${this.sObjectId}`,
      },
    };
  }

  generateObject () {
    return {
      $: {
        id: this.objectId,
        keepAspectRatio: 'true',
        displayVideoFrame: 'false',
      },
      filename: { _: 'image.xml' },
    };
  }
};
