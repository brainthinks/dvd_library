'use strict';

const Logger = require('../Logger');
const { getPaths } = require('./config.paths');
const { getTimeStuff } = require('./config.time');

const logger = Logger.factory('utils:config');

function clone (parent, cloneProperties) {
  try {
    logger.debug(`About to clone ${parent.id} to be used as ${cloneProperties.id}`);

    return {
      parentId: parent.id,
      parentCategory: parent.category,
      ...parent,
      ...cloneProperties,
    };
  }
  catch (error) {
    logger.error(`Failied to clone ${parent.id}`);
    throw error;
  }
}

async function exportById(basePath, seriesName, records) {
  try {
    logger.debug(`Processing series "${seriesName}"`);
    const recordsById = {};

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const id = record.id;
      logger.debug(`processing record "${id}"`);

      const paths = await getPaths(basePath, seriesName, record);
      const timeStuff = await getTimeStuff(basePath, seriesName, record);

      if (record.enabled) {
        recordsById[id] = {
          ...record,
          ...paths,
          ...timeStuff,
          category: seriesName,
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
