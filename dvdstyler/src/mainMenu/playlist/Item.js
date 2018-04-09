'use strict';

const LanguageAvailable = require('./LanguageAvailable');

module.exports = class Item {
  static factory (
    video,
    index,
    {
      isAvailableImage,
      leftMargin = 200,
      topMargin = 96,
      availabilityLeftMargin = 600,
      availabilityTopMargin = 40,
      spaceBetween = 28,
    } = {}
  ) {
    const options = {
      isAvailableImage,
      leftMargin,
      topMargin,
      availabilityLeftMargin,
      availabilityTopMargin,
      spaceBetween,
    };

    return new Item(video, index, options);
  }

  constructor (
    video,
    index,
    {
      isAvailableImage,
      leftMargin,
      topMargin,
      availabilityLeftMargin,
      availabilityTopMargin,
      spaceBetween,
    } = {}
  ) {
    if (!video) {
      throw new Error('Item needs a video definition.');
    }
    if (!index && index !== 0) {
      throw new Error('Item needs an index so it knows what position in the list it is in.');
    }
    if (!isAvailableImage) {
      throw new Error('Item needs an image to use when a language is available.');
    }
    if (!leftMargin) {
      throw new Error('Item needs a left margin.');
    }
    if (!topMargin) {
      throw new Error('Item needs a topMargin.');
    }
    if (!availabilityLeftMargin) {
      throw new Error('Item needs an availabilityLeftMargin.');
    }
    if (!availabilityTopMargin) {
      throw new Error('Item needs an availabilityTopMargin.');
    }
    if (!spaceBetween) {
      throw new Error('Item needs to know how much space it needs to put between itself and the previous item.');
    }

    this.config = video;

    this.index = index;
    this.id = this.config.id;
    this.buttonId = `button_${this.id}`;
    this.sButtonId = `s_${this.buttonId}`;

    this.width = 382;
    this.height = 17;
    this.leftMargin = leftMargin;
    this.topMargin = topMargin;
    this.spaceBetween = spaceBetween;

    this.svg = this.generateSvg();
    this.gUse = this.generateGUse();
    this.button = this.generateButton();

    this.english = this.config.audio.english
      ? LanguageAvailable.factory(
        `${this.id}_en_available`,
        isAvailableImage,
        availabilityLeftMargin,
        availabilityTopMargin + (this.spaceBetween * index),
      )
      : undefined;

    this.spanish = this.config.audio.spanish
      ? LanguageAvailable.factory(
        `${this.id}_sp_available`,
        isAvailableImage,
        availabilityLeftMargin + 40,
        availabilityTopMargin + (this.spaceBetween * index),
      )
      : undefined;

    console.log(this.english)
    console.log(this.spanish)
  }

  generateSvg () {
    return {
      $: {
        id: this.sButtonId,
      },
      defs: [{
        filter: [{
          $: { id: 'shadowFilter' },
          feGaussianBlur: [{ $: { stdDeviation: 3 } }],
        }],
      }],
      rect: [{
        $: {
          width: '10',
          height: '10',
          x: '10',
          y: '50%',
          id: 'square',
          style: 'fill:none;',
          transform: 'translate(0,-5)',
        },
      }],
      use: [{
        $: {
          x: 2,
          y: 2,
          id: 'shadow',
          'xlink:href': '#text',
          style: 'fill:#404040;fill-opacity:1;filter:url(#shadowFilter);visibility:visible;',
        },
      }],
      g: [{
        $: {
          id: 'gText',
          style: 'fill:#ffffff;fill-opacity:1;',
        },
        text: [{
          $: {
            x: '30',
            y: '50%',
            id: 'text',
            'xml:space': 'preserve',
            style: 'dominant-baseline:middle;font-family:Liberation Serif;font-size:18;font-style:normal;font-weight:normal;text-anchor:;',
          },
          _: this.config.title,
        }],
      }],
    };
  }

  generateGUse () {
    console.log('this.leftMargin', this.leftMargin)
    return {
      $: {
        x: this.leftMargin,
        y: this.topMargin + (this.spaceBetween * this.index),
        width: this.width,
        height: this.height,
        id: this.buttonId,
        'xlink:href': `#${this.sButtonId}`,
      },
    };
  }

  generateButton () {
    return {
      $: { id: this.buttonId },
      // @todo
      action: [{
        $: {
          tsi: 0,
          pgci: this.index,
        },
      }],
      // @todo
      direction: [{
        $: {
          left: this.buttonId,
          right: this.buttonId,
          up: this.buttonId,
          down: this.buttonId,
        },
      }],
      filename: [{ _: 'text-square-v2.xml' }],
      parameter: [{
        $: {
          name: 'squareFill',
          normal: 'none',
          highlighted: '#0000ec',
          selected: '#a52a2a',
        },
      }],
    };
  }
};
