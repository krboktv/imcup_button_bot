const semver = require('semver')

const encodings = [
  'ascii',
  semver.gte(process.version, '6.4.0') && 'latin1',
  'binary',
  'utf8',
  'utf-8',
  'ucs2',
  'ucs-2',
  'utf16le',
  'utf-16le',
  'hex',
  'base64'
];

const map = {};

encodings.forEach(encoding => {
  if(encoding) {
    map[encoding] = true;
  }
})

module.exports = map;
