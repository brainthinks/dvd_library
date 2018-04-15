#!/usr/bin/env node

'use strict';

require('module-alias/register');

const pathToConfig = process.argv[2];

if (!pathToConfig) {
  throw new Error('You must tell the script what ids to include in the dvd!');
}

const child_process = require('child_process');

const config = require(pathToConfig);
const configs = require('../configs')(config);
const DvdStylerProject = require('./DvdStylerProject');

global.NEWLINE = '<tbreak/>';

async function processConfig (config) {
  const dvdStylerProject = await DvdStylerProject.factory(config);

  dvdStylerProject.generateMenus();
  dvdStylerProject.generateTitlesets();
  dvdStylerProject.generateRoot();

  // Note - this will overwrite the target files!
  await dvdStylerProject.generateDvdStylerXML(config.targets.dvds);
  await dvdStylerProject.prepareIsoDirectory(config.targets.iso);

  child_process.exec(`dvdstyler "${config.targets.dvds}"`);
}

async function main () {
  await Promise.all(configs.map((config) => processConfig(config)));
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
