'use strict';

const { exec } = require('child_process');

const pathUtils = require('./config.paths');
const Logger = require('../Logger');

const logger = Logger.factory('utils:config:time');

async function getRunTime(basePath, seriesName, record = {}) {
  try {
    if (!basePath) {
      throw logger.error('"basePath" is required');
    }
    if (!seriesName) {
      throw logger.error('"seriesName" is required');
    }
    if (!record) {
      throw logger.error('"record" is required');
    }
    if (!record.id) {
      throw logger.error('"record.id" is required');
    }

    logger.debug(`Getting run time of "${record.id}"`);

    const path = await pathUtils.getVideoFilePath(basePath, seriesName, record);
    const command = `ffmpeg -i "${path}" 2>&1 | grep -i duration`;

    logger.debug(`Using the following ffmpeg command to get run time of "${record.id}"`);
    logger.debug(command);

    // The promisify version that the documentation references returns
    // Socket instances for stdout and stderr, rather than strings.
    return new Promise((resolve, reject) => {
      // @todo - what happens if the timeout is reached?
      exec(command, { timeout: 1000 }, (error, stdout, stderr) => {
        if (error) {
          logger.error(`Failed while executing command '${command}'`);
          return reject(error);
        }

        if (stderr) {
          logger.error(`Received stderr while executing command '${ command }'`);
          // @todo - reject?
          return reject(logger.error(stderr));
        }

        const duration = stdout.split(',')[0].split(': ')[1].trim();
        logger.debug(`${record.id} has a duration of "${duration}"`);

        resolve(duration);
      });
    });
  }
  catch (error) {
    logger.error(`Failed to get run time for ${record.id}`);
    throw error;
  }
}

function getApproximateRunTime (runTime) {
  try {
    logger.debug(`Generating approximate run time of "${runTime}"`);
    return Number(runTime.split(':')[1]) + 1;
  }
  catch (error) {
    logger.error(`Failed to generate approximate run time of "${runTime}"`);
    throw error;
  }
}

function generateChapters(runTime, introEnd) {
  try {
    logger.debug(`Generating chapters from run time "${runTime}" with introEnd "${introEnd}"`);

    const [
      hours,
      minutes,
      seconds_frames,
    ] = runTime.split(':');

    const [
      seconds,
      frames,
    ] = seconds_frames.split('.');

    const chapters = [];

    // The first chapter is always the beginning
    const firstChapter = '0:00';
    // The last chapter is always the last second (rounded down)
    const lastChapter = `${Number(minutes)}:${seconds}`;

    chapters.push(firstChapter);

    // This is the timestamp where the intro stops playing
    // and the actual video content starts
    if (introEnd) {
      chapters.push(introEnd);
    }

    // Add a chapter every 3 minutes
    for (let i = 3; i < minutes; i += 3) {
      chapters.push(`${i}:00`);
    }

    chapters.push(lastChapter);

    logger.debug(`Generated chapters [${chapters.join(',')}] from run time "${runTime}" with introEnd "${introEnd}"`);

    return chapters;
  }
  catch (error) {
    logger.error('Failed to generate chapters');
    throw error;
  }
}

async function getTimeStuff (basePath, seriesName, record) {
  try {
    logger.debug(`Getting time stuff for ${record.id}`);

    const runTime = await getRunTime(basePath, seriesName, record);

    return {
      runTime,
      approximateRunTime: getApproximateRunTime(runTime),
      chapters: generateChapters(runTime, record.introEnd),
    };
  }
  catch (error) {
    logger.error(`Failed to get time stuff for ${record.id}`);
    throw error;
  }
}

module.exports = {
  generateChapters,
  getRunTime,
  getApproximateRunTime,
  getTimeStuff,
};
