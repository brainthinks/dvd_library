#!/usr/bin/env node

'use strict';

require('module-alias/register');

// NOTE - you must provide this yourself!
const config = require('../config');

const DvdStylerProject = require('./DvdStylerProject');

global.NEWLINE = '<tbreak/>';

async function main () {
  const dvdStylerProject = await DvdStylerProject.factory(config);

  dvdStylerProject.generateMenus();
  dvdStylerProject.generateTitlesets();
  dvdStylerProject.generateRoot();

  // Note - this will overwrite the target file!
  await dvdStylerProject.toFile(config.target);
}

main()
  .then(() => {
    console.log('SUCCESS');
    process.exit();
  })
  .catch((error) => {
    console.error('FAILURE');
    console.error(error);
    process.exit(1);
  });
