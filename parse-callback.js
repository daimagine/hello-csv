'use strict';

const debug = require('debug')('parse:callback');

const fs = require('fs');
const parse = require('csv-parse');
const helper = require('./helper');

// 0. Naïve

const naive = () => {
  fs.readFile(__dirname + '/sample.csv', (err, loadedCsv) => {
    parse(loadedCsv, (err, parsed) => {
      if (err) {
        debug('failed to parse the csv');
        return;
      }

      parsed.map((line, index) => {
        // transform line to get fullname
        if (index > 0) {
          debug(`sending data index: ${index}`);
          helper.sendSmsAndLogToS3(line, (err, loggingStatus) => {
            if (err) {
              debug(err.message);
            }
          });
        }
      });
    });
  });
};

naive();
