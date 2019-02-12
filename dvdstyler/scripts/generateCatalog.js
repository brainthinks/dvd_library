#!/usr/bin/env node
'use strict';

const debug = require('debug')('dvdstyler:scripts:generateCatalog');
const path = require('path');
const XLSX = require('xlsx');

const configs = require('../configs/config.all');
const library = require('../configs/')(configs);

async function main () {
  const workbook = XLSX.utils.book_new();

  const rows = [];

  for (let i = 0; i < library.discs.length; i++) {
    const disc = library.discs[i];

    for (let j = 0; j < disc.videos.length; j++) {
      const video = disc.videos[j];
      const id = video.id;

      debug(`Processing ${id}`);

      rows.push({
        'Code': id,
        'Is Clone Of': video.parentId || '',
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

  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Catalog');

  XLSX.writeFile(workbook, path.join(__dirname, '..', 'build', library.catalog.fileName), { type: 'file' });
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
