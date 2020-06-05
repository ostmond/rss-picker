'use strict';

const httpReq = require('./http-req');
const snsPub = require('./sns-pub');

/**
 * Pass the url to send as `event.url`
 */
exports.handler = (event, context, callback) => {
    console.log('event.url:', event.url);
    httpReq.req(event.url).then(res => {
        console.log('success:', res);
        snsPub.publish(JSON.stringify(res));
        callback(null, res);
    }).catch(error => {
        console.log('error:', error);
        callback(error);
    })
};