'use strict';

const https = require('https');
const convert = require('xml2json');
var AWS = require('aws-sdk');
AWS.config.region = 'eu-central-1';

const TOPIC_ARN = process.env.TOPIC_ARN;

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
        let bodyObj = {};
        console.log('Status:', res.statusCode);
        console.log('Headers:', JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', (chunk) => body += chunk);
        res.on('end', () => {
            console.log('Successfully processed HTTPS response');
            // If we know it's JSON, parse it
            if (res.headers['content-type'] === 'application/json') {
                body = JSON.parse(body);
            // The ECDC includes the charset in the content type, we cannot handle the string with ===    
            } else if (res.headers['content-type'] && res.headers['content-type'].includes('application/rss+xml')) {
                bodyObj = JSON.parse(convert.toJson(body));
                const channel = JSON.stringify(bodyObj.rss.channel);
                const sns = new AWS.SNS();
                sns.publish({
                    Message: channel,
                    TopicArn: TOPIC_ARN
                }, function(err, data) {
                    if (err) {
                        console.log(err.stack)
                        return;
                    }
                    console.log('push sent to ', TOPIC_ARN);
                    console.log('MessageId: ', data.MessageId);
                    context.done(null, 'Function Finished!'); 
                });
            }
            callback(null, bodyObj.rss.channel);
        });
    });
    req.on('error', callback);
    // req.get(JSON.stringify(event.data)); // TODO: to remove if it is not used.
    req.end();
};