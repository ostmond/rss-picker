const sinon = require('sinon');
const AWS = require('aws-sdk-mock');
const proxyquire = require('proxyquire').noPreserveCache()

describe('sns-pub', () => {
  let initialEnvVar;

  beforeEach(() => {
    initialEnvVar = process.env.TOPIC_ARN;
  })

  // Reset test doubles for isolating individual test cases
  afterEach(() => {
    sinon.reset;
    process.env.TOPIC_ARN = initialEnvVar;
  });

  it('should call sns publish(...)', async () => {
    // mock env
    process.env.TOPIC_ARN = 'arn:aws:sns:eu-central-1:410315750128:lambda-rss-feed';
    // Fake sns client behavior
    const publishSpy = sinon.spy();
    AWS.mock('SNS', 'publish', publishSpy);
    // execute method to be tested
    const snsPub = proxyquire('../services/sns-pub', {});
    snsPub.publish('jsonString');
    // assertion
    sinon.assert.calledWith(publishSpy, { Message: 'jsonString',  TopicArn: process.env.TOPIC_ARN}, sinon.match.any);
  });
})
