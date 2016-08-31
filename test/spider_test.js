'use strict';

import assert from 'assert';
import '../lib';

describe('scrapy', () => {
	
	it('scrapy.Spider', done => {
		assert.notnull(scrapy.Spider);
	});
});
