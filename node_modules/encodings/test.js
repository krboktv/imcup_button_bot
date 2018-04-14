const semver = require('semver');
const assert = require('assert');
const encodings = require('./index.js');

assert.equal(semver.lt(process.version, '6.4.0'), !encodings.latin1);
assert(encodings.utf8)

// See https://github.com/ashtuchkin/iconv-lite/wiki/Supported-Encodings
assert(!encodings.iso646jp)
assert(!encodings['Windows-31j'])

assert(!encodings.kikero)
