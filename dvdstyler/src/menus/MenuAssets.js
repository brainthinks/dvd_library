'use strict';

module.exports = class MenuAssets {
  static fromIndex (index) {
    throw new Error('Abstract static method "fromIndex" not yet implemented');
  }

  static factory (id) {
    throw new Error('Abstract static method "factory" not yet implemented');
  }

  constructor (id) {
    if (!id) {
      throw new Error('id is required when instantiating a MenuAssets object.');
    }

    this.id = id;

    this.svgs = [];
    this.gObjectUses = [];
    this.gButtonUses = [];
    this.objects = [];
    this.buttons = [];
  }
};
