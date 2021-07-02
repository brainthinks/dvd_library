'use strict';

const { access } = require('fs/promises');
const fs = require('fs');

const Logger = require('../Logger');

const logger = Logger.factory('utils:config:titles');

async function getEnglishAudioFilePath (basePath, record) {
  if (!basePath) {
    throw logger.error('"basePath" is required');
  }
  if (!record) {
    throw logger.error('"record" is required');
  }
  if (!record.id) {
    throw logger.error('"record.id" is required');
  }

  logger.debug(`Getting english audio file path for ${record.id}`);

  const filepath = `${basePath}/${record.seriesName}/raw_audio/${record.id}.flac`;

  try {
    logger.debug(`Looking for file "${filepath}"`);

    await access(filepath, fs.constants.F_OK);

    return filepath;
  }
  catch (error) {
    logger.warn(`Unable to find "${filepath}"`);
  }

  // If the record is a clone, try to find its parent
  if (record.parentId) {
    return getEnglishAudioFilePath(basePath, {
      id: record.parentId,
      seriesName: record.parentSeriesName,
    });
  }

  throw logger.error(`Unable to find english audio file for ${record.id}`);
}

async function getSpanishAudioFilePath (basePath, record) {
  if (!basePath) {
    throw logger.error('"basePath" is required');
  }
  if (!record) {
    throw logger.error('"record" is required');
  }
  if (!record.id) {
    throw logger.error('"record.id" is required');
  }

  logger.debug(`Getting spanish audio file path for ${record.id}`);

  const filepath = `${basePath}/${record.seriesName}/raw_audio/${record.id}S.flac`;

  try {
    logger.debug(`Looking for file "${filepath}"`);

    await access(filepath, fs.constants.F_OK);

    return filepath;
  }
  catch (error) {
    logger.warn(`Unable to find "${filepath}"`);
  }

  // If the record is a clone, try to find its parent
  if (record.parentId) {
    return getSpanishAudioFilePath(basePath, {
      id: record.parentId,
      seriesName: record.parentSeriesName,
    });
  }

  throw logger.error(`Unable to find spanish audio file for ${record.id}`);
}

async function getVideoFilePath (basePath, record) {
  if (!basePath) {
    throw logger.error('"basePath" is required');
  }
  if (!record) {
    throw logger.error('"record" is required');
  }
  if (!record.id) {
    throw logger.error('"record.id" is required');
  }

  const mkvFilepath = `${basePath}/${record.seriesName}/raw_video/${record.id}.mkv`;
  const mpegFilepath = `${basePath}/${record.seriesName}/raw_video/${record.id}.mpeg`;

  try {
    logger.debug(`Looking for file "${mkvFilepath}"`);

    await access(mkvFilepath, fs.constants.F_OK);

    return mkvFilepath;
  }
  catch (error) {
    logger.warn(`Unable to find "${mkvFilepath}"`);
  }

  try {
    logger.debug(`Looking for file "${mpegFilepath}"`);

    await access(mpegFilepath, fs.constants.F_OK);

    return mpegFilepath;
  }
  catch (error) {
    logger.warn(`Unable to find "${mpegFilepath}"`);
  }

  // If the record is a clone, try to find its parent
  if (record.parentId) {
    return getVideoFilePath(basePath, {
      id: record.parentId,
      seriesName: record.parentSeriesName,
    });
  }

  throw logger.error(`Unable to find video file for ${record.id}`);
}

async function getPaths (basePath, record) {
  try {
    if (!basePath) {
      throw logger.error('"basePath" is required');
    }
    if (!record) {
      throw logger.error('"record" is required');
    }

    const englishAudio = await getEnglishAudioFilePath(basePath, record);

    let spanishAudio;

    try {
      spanishAudio = await getSpanishAudioFilePath(basePath, record);
    }
    catch (error) {
      spanishAudio = englishAudio;
    }

    const englishVideo = await getVideoFilePath(basePath, record);

    let spanishVideo;

    if (record.useSpanishAltVideoTrack) {
      try {
        // Append "S" to the id
        const spanishRecord = {
          ...record,
          id: `${record.id}S`,
        };

        // Append "S" to the parent id
        if (spanishRecord.parentId) {
          spanishRecord.parentId = `${spanishRecord.parentId}S`;
          console.log(spanishRecord)
        }

        spanishVideo = await getVideoFilePath(basePath, spanishRecord);
      }
      catch (error) {
        throw logger.error(`Could not find spanish video file for ${record.id}`);
      }
    }

    const paths = {
      audio: {
        english: englishAudio,
        spanish: spanishAudio,
      },
      video: {
        english: englishVideo,
        spanish: spanishVideo,
      },
    };

    return paths;
  }
  catch (error) {
    logger.error(`Failed to get paths for ${record.id}`);
    throw error;
  }
}

module.exports = {
  getPaths,
  getVideoFilePath,
};
