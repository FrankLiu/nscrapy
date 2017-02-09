'use strict';

import assert from 'assert';
import test from 'ava';
import HttpClient from '../lib/httpclient';

let hc = HttpClient.create();


test('hc not null', done => {
	assert.notNull(hc);
});
	
