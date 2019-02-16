#!/usr/bin/env node

'use strict';

require('module-alias/register');

const child_process = require('child_process');

const Logger = require('./Logger');
const DvdStylerProject = require('./DvdStylerProject');
const utils = require('./utils/');

const logger = Logger.factory('main');

// @todo - validate config
async function processDiscConfig (discConfig) {
  try {
    if (!discConfig) {
      throw logger.error('"discConfig" is required');
    }
    if (!discConfig.title) {
      throw logger.error('"discConfig.title" is required');
    }
    if (!discConfig.targets) {
      throw logger.error('"discConfig.targets" is required');
    }
    if (!discConfig.targets.dvds) {
      throw logger.error('"discConfig.targets.dvds" is required');
    }

    logger.info(`Generating dvdstyler file for "${discConfig.title}"`);

    const dvdStylerProject = DvdStylerProject.factory(discConfig);

    dvdStylerProject.generateMenus();
    dvdStylerProject.generateTitlesets();
    dvdStylerProject.generateRoot();

    // Note - this will overwrite the target files!
    await dvdStylerProject.generateDvdStylerXML();
    await dvdStylerProject.prepareIsoDirectory();

    // this will open dvdstyler.  Don't await it, because at that
    // point it will be up to the user to close the program.
    utils.asPromise(child_process.exec)(`dvdstyler "${discConfig.targets.dvds}"`);

    return discConfig.targets.dvds;
  }
  catch (error) {
    logger.error(`Failed to process config`);
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

  if (!configs) {
    throw logger.error(`"configs" from "${pathToConfig}" is empty`);
  }
  if (!configs.discs) {
    throw logger.error('"configs.discs" is required');
  }
  if (!Array.isArray(configs.discs) || !configs.discs.length) {
    throw logger.error('"configs.discs" must be a non-empty array');
  }

  // @todo - no globals!
  global.NEWLINE = '<tbreak/>';

  const filenames = await Promise.all(configs.discs.map((discConfig) => {
    return processDiscConfig(discConfig);
  }));

  return filenames;
}

main()
  .then((filenames) => {
    logger.info(`Successfully generated the following dvdstyler templates:`);
    for (let i = 0; i < filenames.length; i++) {
      logger.info(`"${filenames[i]}"`);
    }
    process.exit();
  })
  .catch((error) => {
    logger.error(`Failed to generate dvdstyler templates`);
    logger.error(error);
    process.exit(1);
  });
