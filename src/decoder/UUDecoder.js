/**
 * 优优云图片解码类
 */
'use strict';

import { scrapy } from '../base';

export default class UUDecoder extends ImageDecoder{
	constructor(opts){
		super(opts);
	}
	
	decode(){
		
	}
	
	decodeUrl(){
		
	}
	
	decodeBuffer(){
		
	}
	
	decodeStream(){
		scrapy.raise('not-implemented', 'decodeStream is not implemented!');
	}
}