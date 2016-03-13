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

      parsed.map((rawLine, index) => {
        // transform line to get fullname
        const line = helper.transformLine(rawLine);
        if (index > 0) {
          debug(`sending data index: ${index}`);

          helper.sendSms(line, (err, sendingStatus) => {
            if (err) {
              debug(err.message);

              helper.logToS3({
                sendingStatus,
                line,
              }, (err, loggingStatus) => {
                if (err) {
                  debug(err.message);
                }
              });
            }
          });
        }
      });
    });
  });
};

naive();
