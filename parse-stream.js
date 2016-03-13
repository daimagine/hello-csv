// 0. Please use readline (https://nodejs.org/api/readline.html)
//    to deal with per line file reading
// 1. Then use the parse API of csv-parse (http://csv.adaltas.com/parse/
//    find the Node.js Stream API section)
'use strict';

const debug = require('debug')('parse:stream');

const fs = require('fs');
const parse = require('csv-parse');
const readline = require('readline');
const helper = require('./helper');

const stream = readline.createInterface({
  input: fs.createReadStream(__dirname + '/sample.csv'),
});

stream.on('line', (rawLine) => {
  parse(rawLine, {}, (err, lines) => {
    if (err) return;
    lines.map((line, index) => {
      if (line[0] !== 'first_name') {
        debug(line);
        helper.sendSmsAndLogToS3(line, (err, loggingStatus) => {
          if (err) {
            debug(err.message);
          }
        });
      }
    });
  });
});
