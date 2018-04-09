'use strict';

const Title = require('./Title');
const Sidebar = require('./Sidebar');
const Playlist = require('./playlist/Playlist');

module.exports = class Menu {
  static fromVobMenu (menu, index, title, logo, videos, isAvailableImage) {
    return Menu.factory(menu, index, title, logo, videos, isAvailableImage);
  }

  static factory (menu, index, title, logo, videos, isAvailableImage) {
    return new Menu(menu, index, title, logo, videos, isAvailableImage);
  }

  static generateSvgDefs (title, sidebar, content) {
    return [{
      $: { id: 'defs' },
      svg: [
        // disk title
        title.svgDef,
        // main logo
        sidebar.logo.entry,
        // play all button
        sidebar.playAllButton.container.entry,
        sidebar.playAllButton.button.entry,
        // language options button
        sidebar.languageOptionsButton.container.entry,
        sidebar.languageOptionsButton.button.entry,
        //
        ...content.svgs,
      ],
    }];
  }

  static generateSvgG (title, sidebar, content) {
    return [
      {
        $: { id: 'objects' },
        use: [
          title.svgGObject,
          sidebar.logo.gObject,
          sidebar.playAllButton.container.gObject,
          sidebar.languageOptionsButton.container.gObject,
          ...content.gObjectUses,
        ],
      },
      {
        $: { id: 'buttons' },
        use: [
          sidebar.playAllButton.button.gButton,
          sidebar.languageOptionsButton.button.gButton,
          ...content.gButtonUses,
        ],
      },
    ];
  }

  static generateObjects (title, sidebar, content) {
    return [
      title.object,
      sidebar.logo.object,
      sidebar.playAllButton.container.object,
      sidebar.languageOptionsButton.container.object,
      ...content.objects,
    ];
  }

  static generateButtons (sidebar, content) {
    return [
      sidebar.playAllButton.button.button,
      sidebar.languageOptionsButton.button.button,
      ...content.buttons,
    ];
  }

  constructor (menu, index, title, logo, videos, isAvailableImage) {
    if (!menu) {
      throw new Error('Menu needs a menu definition.');
    }
    if (!index && index !== 0) {
      throw new Error('Menu needs an index.');
    }
    if (!title) {
      throw new Error('Menu needs a title.');
    }
    if (!logo) {
      throw new Error('Menu needs a logo.');
    }
    if (!videos) {
      throw new Error('Menu needs video definitions.');
    }
    if (!isAvailableImage) {
      throw new Error('Menu needs isAvailableImage.');
    }

    this.menu = menu;

    this.title = Title.fromIndex(index, title);
    this.sidebar = Sidebar.fromIndex(index, logo);
    this.content = Playlist.factory(videos, isAvailableImage);

    // console.log(this.content)

    this.menu.svg[0].defs = Menu.generateSvgDefs(this.title, this.sidebar, this.content);
    this.menu.svg[0].g = Menu.generateSvgG(this.title, this.sidebar, this.content);
    this.menu.object = Menu.generateObjects(this.title, this.sidebar, this.content);
    this.menu.button = Menu.generateButtons(this.sidebar, this.content);
  }
};
