'use strict'

/**
 * 内容提取类，根据预配置的规则提取页面元素
 */
var util = require('util');
var EventEmiter = require('events');
var dgcore = require('./common').dgcore;
var HtmlParser = require('./htmlparser');

class Extractor extends EventEmiter{
    constructor(options){
        super(arguments);
        this.options = options;

        //runtime vars
        this.data = {};
    }

    //根据规则提取页面元素
    run(){

    }

}

//expose class/functions
dgcore.Extractor = Extractor;
module.exports = exports = dgcore;
