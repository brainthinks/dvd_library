'use strict';

module.exports = class Title {
  static factory (config) {
    return new Title(config);
  }

  constructor (config) {
    this.config = config;

    this.generatePgc();
  }

  generatePgc () {
    this.pgc = {
      vob: [{
        $: {
          file: this.config.video.elq,
          chapters: this.config.chapters.join(','),
        },
        video: [{ $: { format: 1 } }],
        audio: [
          {
            $: { format: 1 },
            _: this.config.audio.english,
          },
          {
            $: { format: 1 },
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
