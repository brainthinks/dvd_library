#!/usr/bin/env node

'use strict';

require('module-alias/register');

const child_process = require('child_process');

const Logger = require('./Logger');
const DvdStylerProject = require('./DvdStylerProject');

const logger = Logger.factory('main');

// @todo - validate config
async function processConfig (config) {
  try {
    const dvdStylerProject = DvdStylerProject.factory(config);

    dvdStylerProject.generateMenus();
    dvdStylerProject.generateTitlesets();
    dvdStylerProject.generateRoot();

    // Note - this will overwrite the target files!
    await dvdStylerProject.generateDvdStylerXML(config.targets.dvds);
    await dvdStylerProject.prepareIsoDirectory(config.targets.iso);

    await utils.asPromise(child_process.exec)(`dvdstyler "${config.targets.dvds}"`);
  }
  catch (error) {
    logger.error(`Failed to process config for`);
    throw error;
  }
}

async function main () {
  const pathToConfig = process.argv[2];

  if (!pathToConfig) {
    throw logger.error('You must tell the script what ids to include in the dvd!');
  }

  const Configs = require(pathToConfig);
  const configs = await Configs();
  console.log(configs);
  process.exit();

  // @todo - no globals!
  global.NEWLINE = '<tbreak/>';

  await Promise.all(configs.map((config) => {
    return processConfig(config);
  }));
}

main()
  .then(() => {
    logger.info(`Successfully generated dvdstyler templates`);
    process.exit();
  })
  .catch((error) => {
    logger.error(`Failed to generate dvdstyler templates`);
    logger.error(error);
    process.exit(1);
  });
