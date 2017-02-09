/**
 * 验证码图片解码基类
 */
'use strict';

import { path } from 'path';
import { fs } from 'fs';
import { EventEmitter } from 'events';
import { scrapy } from '../base';
import { HttpClient } from '../httpclient';

export default class ImageDecoder extends EventEmitter{
	constructor(opts){
		super();
		this.opts = scrapy.extend({}, opts);
		this.httpClient = HttpClient.create({keepCookies: false});
		this.emit('init');
	}
	
	loadConfig(vendor){
		vendor = vendor || 'default';
		return JSON.parse(fs.readFileSync(path.join(__dirname,'config.json'), 'utf8'))[vendor];
	}
	
	decode(){
		scrapy.raise('not-implemented', 'decode is not implemented!');
	}
	
	decodeUrl(){
		scrapy.raise('not-implemented', 'decodeUrl is not implemented!');
	}
	
	decodeBuffer(){
		scrapy.raise('not-implemented', 'decodeBuffer is not implemented!');
	}
	
	decodeStream(){
		scrapy.raise('not-implemented', 'decodeStream is not implemented!');
	}
}

