/**
 * 验证码图片解码基类
 */
'use strict';

import { path } from 'path';
import { fs } from 'fs';
import { EventEmitter } from 'events';
import { scrapy } from '../base';

export default class ImageDecoder extends EventEmitter{
	constructor(opts){
		super();
		this.opts = scrapy.extend({conf: this.loadConfig()}, opts);
		this.emit('init');
	}
	
	loadConfig(){
		return JSON.parse(fs.readFileSync(path.join(__dirname,'config.json'), 'utf8'));
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

