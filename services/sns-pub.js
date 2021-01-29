const AWS = require('aws-sdk');
AWS.config.region = 'eu-central-1';

const TOPIC_ARN = process.env.TOPIC_ARN;

module.exports = {
  publish: function(jsonString) {
    const sns = new AWS.SNS();
    sns.publish({
        Message: jsonString,
        TopicArn: TOPIC_ARN
    }, function(err, data) {
        if (err) {
            console.log(err.stack)
            return;
        }
        console.log('push sent to ', TOPIC_ARN);
        console.log('MessageId: ', data.MessageId);
    });
  }
}