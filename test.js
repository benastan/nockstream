var expect = require('expect.js'),
    Nockstream = require('./nockstream.js'),
    MockStream = require('mockstream').MockDataStream,
    nock = require('nock'),
    http = require('http');

describe('Nockstream', function() {
  var stream, streamString = "Hello, world", str;
  beforeEach(function() {
    str = '';
    stream = new Nockstream({ chunkSize: 1024, streamString: streamString });
  });
  describe('standalone stream mock', function() {
    it("mocks a data stream", function(done) {
      expect(stream).to.be.a(MockStream);
      stream.on('data', function(chunk) {
        str += chunk.toString();
      });
      stream.on('end', function() {
        expect(str).to.be(streamString);
        done();
      });
      stream.start();
    });
  });
  describe('Nock integration', function() {
    beforeEach(function() {
      nock('http://google.com').get('/').reply(200, stream);
    });
    it('integrates with nock', function(done) {
      http.get('http://google.com/', function(res) {
        res.on('data', function(chunk) {
          str += chunk.toString();
        });
        res.on('end', function() {
          expect(str).to.be(streamString);
          done();
        });
      });
    });
  });
});
