'use strict';

module.exports = class Title {
  static factory (config, quality) {
    return new Title(config, quality);
  }

  constructor (config, quality) {
    if (!config)
      throw new Error('Titleset Title requires config');
    if (!quality)
      throw new Error('Titleset Title requires quality');

    this.config = config;
    this.quality = quality;

    this.generatePgc();
  }

  generatePgc () {
    this.pgc = {
      vob: [{
        $: {
          file: this.config.video[this.quality],
          chapters: this.config.chapters.join(','),
        },
        video: [{ $: { format: 3 } }],
        audio: [
          {
            $: { format: 3 },
            _: this.config.audio.english,
          },
          {
            $: { format: 3 },
            _: this.config.audio.spanish || this.config.audio.english,
          },
        ],
      }],
      pre: [{
        _: 'if ( g1==0 ) { audio=0; } else { audio=1; }',
      }],
      post: [{
        _: 'call last menu;',
      }],
    };
  }

};
