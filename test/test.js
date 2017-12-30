const assert = require('assert');
const validateFormat = require('../src/validate-format');
const getOwnerAndName = require('../src/get-owner-and-name');

it('should throw if input is not an array', () => {
  assert.throws(() => validateFormat(4));
  assert.throws(() => validateFormat({}));
  assert.throws(() => validateFormat('dagny'));
});

it('should throw if input array doesn\'t contain an object', () => {
  assert.throws(() => validateFormat([ 4 ]));
  assert.throws(() => validateFormat([ 'dagny' ]));
});

it('should throw if github property is not a string', () => {
  assert.throws(() => validateFormat([ { github: 2 } ]));
});

it('should throw if process property is not a string', () => {
  assert.throws(() => validateFormat([ { process: 'fem droppar till' } ]));
});

it('should throw if npm property is not a string', () => {
  assert.throws(() => validateFormat([ { npm: 3 } ]));
});