Nockstream
==========

A nock-compatible mockstream wrapper (for mocking HTTP requests).

# Usage

Nockstream is designed for use with [nock](https://github.com/flatiron/nock).

```
var Nockstream = require('nockstream'),
    nock = require('nock'),
    http = require('http');

var stream = new Nockstream({ streamString: 'Hello, world!' });
nock('http://github.com').get('/benastan').reply(200, stream);
http.get('https://github.com/benastan', function(res) {
  var str = '';
  res.on('data', function(chunk) { str += chunk.toString(); });
  res.on('end', function() { console.log(str); }); // Hello, world!
});
```
