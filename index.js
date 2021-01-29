'use strict';

const httpReq = require('./services/http-req');
const snsPub = require('./services/sns-pub');
const dynamo = require('./services/dynamo');

/**
 * Pass the url to send as `event.url`
 */
exports.handler = (event, context, callback) => {
    console.log('event.url:', event.url);
    httpReq.req(event.url).then(res => {
        console.log('success:', res);
        snsPub.publish(JSON.stringify(res));
        dynamo.save(res);
        callback(null, res);
    }).catch(error => {
        console.log('error:', error);
        callback(error);
    })
};