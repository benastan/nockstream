var MockStream = require('mockstream').MockDataStream,
    Stream = require('stream').Stream,
    Nockstream;

Nockstream = function(opts) {
  MockStream.call(this, [opts]);
  Stream.call(this);
  this.streamBuffer = new Buffer(opts.streamString);
  this.streamLength = this.streamBuffer.length;
};
Nockstream.prototype = new MockStream({});
Nockstream.constructor = MockStream;
Nockstream.prototype.setEncoding = function() {};
Nockstream.prototype._writeData = function() {
  if (this.paused) return;
  var remainder = this.streamLength - this.written,
      dataLength = (remainder > this.chunkSize ? this.chunkSize : remainder),
      buf = this.streamBuffer.slice(this.written, this.written + dataLength);
  this.emit('data', buf);
  this.written += dataLength;
  if (this.written >= this.streamLength) {
    this.emit('end');
  } else {
    process.nextTick(this._writeData.bind(this));
  }
};
module.exports = Nockstream;
