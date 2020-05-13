'use strict';

const https = require('https');
const convert = require('xml2json');

module.exports = {
  req: function(url) {
    return new Promise((resolve, reject) => {
      const req = https.request(url, (res) => {
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
                resolve(body);
            // The ECDC includes the charset in the content type, we cannot handle the string with ===    
            } else if (res.headers['content-type'] && res.headers['content-type'].includes('application/rss+xml')) {
              bodyObj = JSON.parse(convert.toJson(body));
              resolve(bodyObj.rss.channel);
            } else {
              reject('response content type ' + res.headers['content-type'] + 'cannot be processed');
            }
        });
      });
      req.end();
    });
  }
}
