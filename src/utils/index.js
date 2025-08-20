const getBuffer = (rawBuffer) => {
  if (Buffer.isBuffer(rawBuffer)) return rawBuffer;
  if (rawBuffer?.data) return Buffer.from(rawBuffer.data);
  if (rawBuffer?.buffer) return Buffer.from(rawBuffer.buffer);
};

module.exports = { getBuffer };
