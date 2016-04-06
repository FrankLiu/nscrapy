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
		this.options = options || {};
		this.drillUrl = this.options.drillUrl;
		this.drillRules = this.options.drillRules || {};
		
        //runtime vars
        this.data = {};
		this.cumulative_failure = 0;
    }

	//验证结果是否符合预期，具体的采集流程可以用来判断是否需要重试
	validate(body){
		
	}
	
    //根据规则提取页面元素
    extract(body){
		var $ = HtmlParser.load(body);
		if(!this.drillRules){
			
		}
    }
	
	//根据selector提取指定元素
	getItem(context, selector){
		
	}
}

//expose class/functions
scrapy.Extractor = Extractor;
module.exports = scrapy;
