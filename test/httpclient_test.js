'use strict';

import assert from 'assert';
import { HttpClient } from '../httpclient';

let hc = HttpClient.create();


describe('httpclient', () => {
	it('hc not null', done => {
		assert.notNull(hc);
	});
	
});