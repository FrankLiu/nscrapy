'use strict'

/**
 * 内容提取类，根据预配置的规则提取页面元素
 */
var util = require('util');
var EventEmiter = require('events');
var scrapy = require('./common').scrapy;
var HtmlParser = require('./htmlparser');

class Extractor extends EventEmiter{
    constructor(options){
        super(arguments);
        this.options = options;
		this.drill_rules = options.drill_rules || {};
		
        //runtime vars
        this.data = {};
    }

    //根据规则提取页面元素
    extract(body){
		if(!this.options.drill_rules){
			
		}
    }
}

//expose class/functions
scrapy.Extractor = Extractor;
module.exports = scrapy;
