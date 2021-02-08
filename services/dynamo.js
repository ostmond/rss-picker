import { v4 as uuidv4 } from 'uuid';
const AWS = require('aws-sdk');

AWS.config.region = 'eu-central-1';
// AWS.config.endpoint = "http://localhost:8000";

const docClient = new AWS.DynamoDB.DocumentClient();
const table = "RssFeedsEU";

module.exports = {
  save: (rss) => {
    console.log(`Adding a new item ${rss}`);
    rss['item'].map(item => {
      const newItem = {
        id: uuidv4(),
        title: item['title'],
        link: item['link'],
        description: item['description'],
        pubDate: item['pubDate'],
        dcCreator: item['dc:creator'],
        guid: item['guid']
      };
      const params = {
        TableName: table,
        Item: newItem
      };
      docClient.put(params, (err, data) => {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("Added item:", JSON.stringify(data, null, 2));
        }
      });
    })
  }
}