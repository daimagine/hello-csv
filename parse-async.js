'use strict';

const debug = require('debug')('parse:async');

const async = require('async');
const fs = require('fs');
const parse = require('csv-parse');
const helper = require('./helper');

const sendSmsAndLogToS3 = (line, callback) => {
  helper.sendSmsAndLogToS3(line, (err, result) => {
    if (err) {
      debug(err.message);
    }

    // never stop the forEachOf
    callback(null, result);
  });
};

const processLines = (lines, callback) => {
  async.forEachOf(lines, (line, index, eachCallback) => {
    if (index > 0) {
      sendSmsAndLogToS3(line, eachCallback);
    }
  }, callback);
};

const asyncParse = () => {
  async.waterfall([
    async.apply(fs.readFile, __dirname + '/sample.csv'),
    parse,
    processLines,
  ], (err, results) => {
    debug(err);
  });
};

asyncParse();
