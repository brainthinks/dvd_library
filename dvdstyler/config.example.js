'use strict';

module.exports = {
  // The absolute path to the dvds file that will be generated
  target: '/path/to/file',
  // The name that is used to identify the disk (the disk ISO ID)
  name: '',
  // The title that will appear at the top of the menus
  title: '',
  // The logo image to be used in the menus
  logo: '/path/to/file',
  // The image of green check to indicate language availability
  isAvailableImage: '/path/to/file',
  // The definitions of the videos that are to be available on this DVD
  videos: {},
  // The quality of the video streams, can be one of the following:
  // * elq
  // * lq
  // * sd
  quality: 'elq',
};
