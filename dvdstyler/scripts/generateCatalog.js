#!/usr/bin/env node

'use strict';

const path = require('path');
const XLSX = require('xlsx');

const Logger = require('../src/Logger');
const Configs = require('../configs/');

const logger = Logger.factory('scripts:generateCatalog');

async function main () {
  const configs = await Configs();
  const filepath = path.join(__dirname, '..', 'build', configs.catalog.fileName);
  logger.info(`Generating catalog at "${filepath}"`);

  const rows = [];

  logger.debug(`Processing ${configs.discs.length} discs`);
  for (let i = 0; i < configs.discs.length; i++) {
    const disc = configs.discs[i];

    for (let id in disc.videos) {
      const video = disc.videos[id];

      logger.debug(`Processing ${id}`);

      rows.push({
        'Code': id,
        'Is Clone Of': video.parentId || '',
        'Disc': disc.discId,
        'Title': video.title,
        'Year': video.productionYear || '',
        'Run Time': video.runTime,
        'Approx Run Time': `${video.approximateRunTime} min`,
        'Spanish': video.audio.spanish ? 'Y' : '',
        'Category': video.category,
        'Notes': video.notes || '',
      });
    }
  }

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Catalog');
  XLSX.writeFile(workbook, filepath, { type: 'file' });

  return filepath;
}

main()
  .then((filepath) => {
    logger.info(`Successfully generated catalog at "${filepath}"`);
    process.exit();
  })
  .catch((error) => {
    logger.error('Failed to generate catalog');
    logger.error(error);
    process.exit(1);
  });
