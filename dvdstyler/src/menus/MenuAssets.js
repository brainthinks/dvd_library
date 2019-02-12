'use strict';

module.exports = class MenuAssets {
  static fromIndex (index) {
    throw new Error('Abstract static method "fromIndex" not yet implemented');
  }

  static factory (id) {
    throw new Error('Abstract static method "factory" not yet implemented');
  }

  constructor (id) {
    if (!id)
      throw new Error('id is required when instantiating a MenuAssets object.');

    this.id = id;

    this.svgs = [];
    this.gObjectUses = [];
    this.gButtonUses = [];
    this.objects = [];
    this.buttons = [];
  }

  setButtonDirection (index, {
    left, right, up, down,
  }) {
    if (!index && index !== 0)
      throw new Error('You must supply the button index when setting button direction.');
    if (!left)
      throw new Error('You must supply left when setting button direction.');
    if (!right)
      throw new Error('You must supply right when setting button direction.');
    if (!up)
      throw new Error('You must supply up when setting button direction.');
    if (!down)
      throw new Error('You must supply down when setting button direction.');
    if (!this.buttons[index])
      throw new Error('You must supply a valid button index setting button direction.');

    this.buttons[index].direction[0].$ = {
      left,
      right,
      up,
      down,
    };
  }
};
