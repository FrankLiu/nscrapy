import assert from 'assert';
import test from 'ava';

var PI = 3.141593;
function sum(x, y){ return x + y; }

/* eslint-disable no-alert, no-console */
test('math.pi', t => {
  assert.equal(PI, 3.141593);
});
test('math.sum', t => {
  assert.equal(math.sum(5,3), 8);
});

/* eslint-enable no-alert, no-console */
