'use strict';

const Logger = require('../Logger');
const { getPaths } = require('./config.paths');
const { getTimeStuff } = require('./config.time');

const logger = Logger.factory('utils:config');

function clone (record, properties) {
  try {
    if (!properties?.id) {
      throw logger.error('"properties.id" is required')
    }

    logger.debug(`About to clone ${record.id} to be used as ${properties.id}`);

    return {
      isClone: true,
      parentId: record.id,
      parentSeriesName: record.seriesName,
      ...record,
      ...properties,
    };
  }
  catch (error) {
    logger.error(`Failied to clone ${record.id}`);
    throw error;
  }
}

async function exportById (basePath, records) {
  const seriesName = records[0].seriesName;

  try {
    logger.debug(`Processing series "${seriesName}"`);

    const recordsById = {};

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      if (!record.id) {
        throw logger.error('record does not have an id');
      }

      if (!record.seriesName) {
        throw logger.error('record does not have a series name');
      }

      const id = record.id;
      logger.debug(`processing record "${id}"`);

      const paths = await getPaths(basePath, record);
      const timeStuff = await getTimeStuff(basePath, record);

      if (record.enabled) {
        recordsById[id] = {
          ...record,
          ...paths,
          ...timeStuff,
        };

        if (record.chapters) {
          // CU002 doesn't "end" properly, which results in an invalid last
          // chapter.  Therefore, chapters must be able to be overridden
          recordsById[id].chapters = record.chapters;
        }
      }
    }

    logger.debug(`Exporting ${Object.keys(recordsById).length} records by id`);
    return recordsById;
  }
  catch (error) {
    logger.error(`Failed to export "${seriesName}" series`);
    throw error;
  }
}

module.exports = {
  clone,
  exportById,
};
