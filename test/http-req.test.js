const sinon = require('sinon');
const nock = require('nock')
const chai = require('chai');
const assert = require('chai').assert;
const chaiAsPromised = require("chai-as-promised");
const expect = require('chai').expect;
const httpsReq = require('../services/http-req');

chai.use(chaiAsPromised);

describe('http-req', () => {
  let server;
  before(function () { server = sinon.createFakeServer() });
  after(function () { server.restore(); });

  it('should return an object from json body', async () => {
    // mock data
    const responseHeader = {
      statusCode: 200,
      headers: {
        'content-type': 'application/json'
      }
    };
    const responseBody = {
      status: 'success',
      data: [
        {
          id: 4,
          name: 'The Land Before Time',
          explicit: false
        }
      ]
    };
    // mock https server
    const scope = nock('https://www.ecdc.europa.eu')
      .get('/en/taxonomy/term/1295/feed')
      .reply(200, responseBody, {'content-type': 'application/json'});
    // call the method to test 
    const res = await httpsReq.req('https://www.ecdc.europa.eu/en/taxonomy/term/1295/feed');
    // assertions
    assert.equal(res.status, 'success')
    assert.equal(res.data[0].id, 4)
    assert.equal(res.data[0].name, 'The Land Before Time')
    assert.equal(res.data[0].explicit, false)
  });

  it('should return an object from rss+xml body', async () => {
    // mock data
    const responseBody = '<rss><channel><title>ECDC - RSS - Risk assessment</title></channel></rss>';
  
    // mock https server
    const scope = nock('https://www.ecdc.europa.eu')
      .get('/en/taxonomy/term/1295/feed')
      .reply(200, responseBody, {'content-type': 'application/rss+xml'});
    // call the method to test 
    const res = await httpsReq.req('https://www.ecdc.europa.eu/en/taxonomy/term/1295/feed');
    // assertions
    assert.equal(res.title, 'ECDC - RSS - Risk assessment')
  });

  it('should reject for non-json and non-rss+xml type', async () => {
    // mock data
    const responseBody = '<rss><channel><title>ECDC - RSS - Risk assessment</title></channel></rss>';
  
    // mock https server
    const scope = nock('https://www.ecdc.europa.eu')
      .get('/en/taxonomy/term/1295/feed')
      .reply(200, responseBody, {'content-type': 'application/text'});
    // call the method to test 
    assert.isRejected(httpsReq.req('https://www.ecdc.europa.eu/en/taxonomy/term/1295/feed'));
    // assertions
  });
})