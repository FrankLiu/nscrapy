'use strict';

import assert from 'assert';
import test from 'ava';
import '../lib';

test('scrapy.Spider', t => {
	assert.notnull(scrapy.Spider);
  t.pass();
});
