'use strict';

const Title = require('./Title');
const Sidebar = require('./Sidebar');

module.exports = class Menu {
  static fromVobMenu (menu, index, title) {
    return Menu.factory(menu, index, title);
  }

  static factory (menu, index, title) {
    return new Menu(menu, index, title);
  }

  constructor (menu, index, title) {
    this.menu = menu;

    this.title = Title.fromIndex(index, title);
    this.sidebar = Sidebar.fromIndex(index);

    this.menu.svg[0].defs = [{
      $: { id: 'defs' },
      svg: [
        // disk title
        this.title.svgDef,
        // main logo
        this.sidebar.logo.entry,
        // play all button
        this.sidebar.playAllButton.container.entry,
        this.sidebar.playAllButton.button.entry,
        // language options button
        this.sidebar.languageOptionsButton.container.entry,
        this.sidebar.languageOptionsButton.button.entry,
      ],
    }];

    this.menu.svg[0].g = [
      {
        $: { id: 'objects' },
        use: [
          this.title.svgGObject,
          this.sidebar.logo.gObject,
          this.sidebar.playAllButton.container.gObject,
          this.sidebar.languageOptionsButton.container.gObject,
        ],
      },
      {
        $: { id: 'buttons' },
        use: [
          this.sidebar.playAllButton.button.gButton,
          this.sidebar.languageOptionsButton.button.gButton,
        ],
      },
    ];

    this.menu.object = [
      this.title.object,
      this.sidebar.logo.object,
      this.sidebar.playAllButton.container.object,
      this.sidebar.languageOptionsButton.container.object,
    ];

    this.menu.button = [
      this.sidebar.playAllButton.button.button,
      this.sidebar.languageOptionsButton.button.button,
    ];
  }
};
