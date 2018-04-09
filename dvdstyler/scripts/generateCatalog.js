#!/usr/bin/env node
'use strict';

const debug = require('debug')('dvdstyler:scripts:generateCatalog');
const path = require('path');
const XLSX = require('xlsx');

const config = require('../library/config');
const library = require('../library/');

async function main () {
  const workbook = XLSX.utils.book_new();

  const rows = [];
  const titles = library.byId();

  for (let id in titles) {
    debug(`Processing ${id}`);

    const title = titles[id];

    rows.push({
      'Code': title.id,
      'Is Clone Of': title.parentId || '',
      'Title': title.title,
      'Year': title.productionYear || '',
      'Run Time': title.runTime,
      'Approx Run Time': `${title.approximateRunTime} min`,
      'Spanish': title.audio.spanish ? 'Y' : '',
      'Category': title.category,
    });
  }

  const worksheet = XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Catalog');

  XLSX.writeFile(workbook, path.join(__dirname, '..', 'build', config.catalog.fileName), { type: 'file' });
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
