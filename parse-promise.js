'use strict';

const debug = require('debug')('parse:promise');

const Promise = require('bluebird');
const readFile = Promise.promisify(require('fs').readFile);
const parse = Promise.promisify(require('csv-parse'));

const helper = require('./helper');

const logToS3Promise = (payload) => new Promise((resolve) => {
  helper.logToS3(payload, (err, loggingStatus) => {
    debug(err, payload, loggingStatus);
    resolve(payload);
  });
});

const sendSmsPromise = (rawLine) => new Promise((resolve) => {
  const line = helper.transformLine(rawLine);
  helper.sendSms(line, (err, sendingStatus) => {
    if (err) {
      debug(err.message);
    }

    resolve({
      sendingStatus,
      line,
    });
  });
})
.then(logToS3Promise);

const processLinePromises = (lines) => Promise.map(
  lines, (line, index, length) => {
    if (index > 0) {
      return sendSmsPromise(line);
    }

    return;
  })
  .catch((err) => err);

/**
 * I promise to send all the sms and log their status to S3 #crossfinger
 **/
const iPromise = () => readFile(__dirname + '/sample.csv')
    .then(parse)
    .then(processLinePromises)
    .then((results) => {
      debug('well, I\'ve made a promise after all');
    })
    .catch((err) => {
      debug(err);
    });

iPromise();
