'use strict';

const https = require('https');
const convert = require('xml2json');

/**
 * Pass the data to send as `event.data`, and the request options as
 * `event.options`. For more information see the HTTPS module documentation
 * at https://nodejs.org/api/https.html.
 *
 * Will succeed with the response body.
 */
exports.handler = (event, context, callback) => {
    const req = https.request('https://www.ecdc.europa.eu/en/taxonomy/term/1295/feed', (res) => {
        let body = '';
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log('Successfully processed HTTPS response');
            // If we know it's JSON, parse it
            if (res.headers['content-type'] === 'application/json') {
                body = JSON.parse(body);
            } else if (res.headers['content-type'].includes('application/rss+xml')) {
                body = convert.toJson(body);
            }
            callback(null, body);
        });
    });
    req.on('error', callback);
    // req.get(JSON.stringify(event.data)); // TODO: to remove if it is not used.
    req.end();
};