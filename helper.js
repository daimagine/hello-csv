'use strict';

const _ = require('underscore');
const debug = require('debug')('hello-helper');
const AWS = require('mock-aws-s3');

AWS.config.basePath = __dirname + '/buckets';

const s3 = AWS.S3({ params: { Bucket: 'example' } });

const surprise = (name) => {
  if (_.random(0, 50) % 2) {
    return new Error(`w00t!!! ${name} error`);
  }
};

// simulates sending sms
exports.sendSms = (data, callback) => {

  setTimeout(() => {
    debug(`sending out sms: ${JSON.stringify(data)}`);
    let response = {
      status: 200,
      message: 'OK',
    };
    const error = surprise('sending-sms');
    if (error) {
      response = {
        status: 500,
        message: 'SMS Failed',
      };
    }

    callback(error, response);
  }, 200);
};

// simulates logging to s3
exports.logToS3 = (data, callback) => {

  setTimeout(() => {
    debug(`putting data to S3: ${JSON.stringify(data)}`);
    s3.putObject({
      Key: `row/line-${_.now()}.json`,
      Body: JSON.stringify(data),
    }, (err) => {
      callback(err ? err : surprise('log-to-s3'), { data, logged: true });
    });
  });
};

// line transformation. for now just merge first and last into fullname
exports.transformLine = (line) => _.union(
  [`${line[0]} ${line[1]}`],
  _.rest(line, 2)
);
