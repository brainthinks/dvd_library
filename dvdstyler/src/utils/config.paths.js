'use strict';

const fs = require('fs');

const Logger = require('../Logger');

const logger = Logger.factory('utils:config:paths');

function getEnglishAudioFilePath(basePath, seriesName, record, isParent = false) {
  return new Promise((resolve, reject) => {
    if (!seriesName) {
      return reject(logger.error('"seriesName" is required'));
    }
    if (!record) {
      return reject(logger.error('"record" is required'));
    }
    if (!record.id) {
      return reject(logger.error('"record.id" is required'));
    }

    logger.debug(`Getting English audio file path for ${record.id}`);

    const filepath = `${basePath}/${seriesName}/raw_audio/${record.id}.flac`;
    logger.debug(`Looking for file "${filepath}"`);

    fs.access(filepath, fs.constants.F_OK, (error) => {
      if (error) {
        if (!isParent && record.parentId) {
          logger.info(`Could not find English audio file for ${record.id}`);
          return getEnglishAudioFilePath(basePath, record.parentCategory, { id: record.parentId }, true)
            .then(resolve)
            .catch(reject);
        }

        // reject here, because we cannot continue without the English
        // audio track
        logger.error(`Error while trying to find English audio file "${filepath}"`);
        return reject(error);
      }

      resolve(filepath);
    });
  });
}

function getSpanishAudioFilePath(basePath, seriesName, record, isParent = false) {
  return new Promise((resolve, reject) => {
    if (!seriesName) {
      return reject(logger.error('"seriesName" is required'));
    }
    if (!record) {
      return reject(logger.error('"record" is required'));
    }
    if (!record.id) {
      return reject(logger.error('"record.id" is required'));
    }

    logger.debug(`Getting Spanish audio file path for ${record.id}`);

    const filepath = `${basePath}/${seriesName}/raw_audio/${record.id}S.flac`;
    logger.debug(`Looking for file "${filepath}"`);

    fs.access(filepath, fs.constants.F_OK, (error) => {
      // @todo - it would be better to check the error type, because doing
      // this when a file doesn't exist is fine, but what if the error was
      // not thrown because the file didn't exist?  Like there was some
      // deeper system error?
      if (error) {
        if (!isParent && record.parentId) {
          logger.info(`Could not find Spanish audio file for ${record.id}`);
          return getSpanishAudioFilePath(basePath, record.parentCategory, { id: record.parentId }, true)
            .then(resolve)
            .catch(reject);
        }

        // No need to reject here, it just means we don't have a Spanish
        // track
        return resolve(null);
      }

      resolve(filepath);
    });
  });
}

// @todo - this function makes some assumptions...
function getVideoFilePath(basePath, seriesName, record, type = 'mkv', isParent = false) {
  return new Promise((resolve, reject) => {
    if (!seriesName) {
      return reject(logger.error('"seriesName" is required'));
    }
    if (!record) {
      return reject(logger.error('"record" is required'));
    }
    if (!record.id) {
      return reject(logger.error('"record.id" is required'));
    }
    if (!type) {
      return reject(logger.error('"type" is required'));
    }
    if (!['mkv', 'mpeg'].includes(type)) {
      return reject(logger.error(`Unable to process video type "${type}".  type must be either "mkv" or "mpeg"`));
    }

    logger.debug(`Getting video file path of type "${type}" for ${record.id}`);

    const filepath = `${basePath}/${seriesName}/raw_video/${record.id}.${type}`;
    logger.debug(`Looking for file "${filepath}"`);

    fs.access(filepath, fs.constants.F_OK, (error) => {
      if (!error) {
        return resolve(filepath);
      }

      if (!isParent) {
        // If we didn't find the mkv, look for the mpeg
        if (type === 'mkv') {
          logger.info(`Could not find "mkv" for ${record.id}`);
          return getVideoFilePath(basePath, seriesName, record, 'mpeg')
            .then(resolve)
            .catch(reject);
        }

        // Assuming we didn't find the mkv OR the mpeg, try to find it on the parent
        logger.info(`Could not find "mpeg" for ${record.id}`);

        if (record.parentId) {
          return getVideoFilePath(basePath, record.parentCategory, { id: record.parentId }, 'mkv', true)
            .then(resolve)
            .catch(reject);
        }

        return reject(error);
      }

      // If we didn't find the mkv on the parent, look for the mpeg on the parent
      if (type === 'mkv') {
        logger.info(`Could not find "mkv" for parent ${record.id}`);
        return getVideoFilePath(basePath, seriesName, record, 'mpeg', true)
          .then(resolve)
          .catch(reject);
      }

      // reject here, because we cannot continue without the video track
      logger.info(`Could not find "mpeg" for parent ${record.id}`);
      return reject(error);
    });
  });
}

async function getPaths(basePath, seriesName, record) {
  try {
    if (!basePath) {
      return reject(logger.error('"basePath" is required'));
    }
    if (!seriesName) {
      return reject(logger.error('"seriesName" is required'));
    }
    if (!record) {
      return reject(logger.error('"record" is required'));
    }

    logger.debug(`Getting paths for ${record.id}`);

    return {
      audio: {
        english: await getEnglishAudioFilePath(basePath, seriesName, record),
        spanish: await getSpanishAudioFilePath(basePath, seriesName, record),
      },
      video: {
        sd: await getVideoFilePath(basePath, seriesName, record),
      },
    };
  }
  catch (error) {
    logger.error(`Failed to get paths for ${record.id}`);
    throw error;
  }
}

module.exports = {
  getEnglishAudioFilePath,
  getSpanishAudioFilePath,
  getVideoFilePath,
  getPaths,
}
