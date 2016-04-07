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

        //runtime vars
        this.data = {};
        this.cumulativeFailure = 0;
    }

    validate(){

    }

    /**
     * 根据规则提取所需的页面元素
     * @param rule {
     *  key:  'title',
     *  base: 'content|url',
     *  mode: 'css|regex|xpath|value',
     *  expr: '.class|^(\w+)$|/html/body/div[@id=test]/text()',
     *  val: 'val|attr:far',
     *  require: true|false
     * }
    */
    extract(url, content, rules){
        if(scrapy.isNotEmpty(this.data)) return this.data;
        var data = {};
        for(var rule in rules){
            var key = rule['key'];
            if(!key){
                console.log('invalid rule [no key]!');
                continue;
            }
            switch(rule['mode']){
                case 'regex':
                    var baser = content;
                    if(rule['base'] === 'url') baser = url;
                    var tmp_result = baser.regex(rule['expr'], rule['index']||0);
                    data[key] = tmp_result;
                    break;
                case 'xpath':
                    break;
                case 'value':
                    data[key] = rule['expr'];
                    break;
                case 'json':
                    break;
                default://css selector
                    var baser = HtmlParser.load(content);
                    var elem = baser.select(rule['expr']);
                    if(elem){
                        if(rule['val'] === 'val'){
                            data[key] = elem[rule['val']]();
                        }
                        else{ //attr:
                            var fn = rule['val'].split(':')[0];
                            var args = rule['val'].split(':')[1];
                            data[key] = elem[fn](args);
                        }
                    }
            }
        }
        this.data = data;
        return data;
    }

    /**
     * According rules extracting all links from html string
     * @param content
     * @param rules
     * @returns {Array}
     */
    extractLink($, rules){
        var links = [];
        for(var i=0;i<rules.length;i++){
            $(rules[i]).each(function(i, elem) {
                if(elem['name']=='img')links.push($(this).attr('src'));
    	    else links.push($(this).attr('href'));
            });
        }
        return links;
    }
}

//expose class/functions
scrapy.Extractor = Extractor;
module.exports = scrapy;
