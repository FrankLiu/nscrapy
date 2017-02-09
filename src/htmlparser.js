"use strict";
/**
 * 内容提取工具类，用于提取各类页面元素
 */
<<<<<<< HEAD
var cheerio = require('cheerio');
var _ = require('underscore');
var scrapy = require('./common').scrapy;

function HtmlParser(html){
    this.html = html;
=======
require('./es5_polyfill');
var cheerio = require('cheerio');
var _ = require('underscore');


function HtmlParser(html){
	if(!this instanceof HtmlParser){
		return new HtmlParser(this);
	}
    this.html = html.toString();
>>>>>>> develop
    this.$ = cheerio.load(html);
}

HtmlParser.load = function(html){
    return new HtmlParser(html);
}

HtmlParser.prototype = {
<<<<<<< HEAD
    //========================================================通过xpath选择器匹配
    xpath: function(selector){
        return this.$(selector);
    },
    select: function(selector){
        return this.xpath(selector);
    },
=======
    /**
	 * 通过css选择器匹配元素
	 */
    css: function(selector){
        return this.$(selector);
    },
>>>>>>> develop

    //根据id获取页面元素
    byId: function(id){
        if(!id.startsWith('#')){ id = '#'+id }
<<<<<<< HEAD
        return this.select(id);
=======
        return this.css(id);
>>>>>>> develop
    },

    //根据class获取页面元素
    byClass: function(cls){
        if(!cls.startsWith('.')){ cls = '.'+cls }
<<<<<<< HEAD
        return this.select(cls);
=======
        return this.css(cls);
>>>>>>> develop
    },

    //根据选择器获取属性值
    attr: function(selector, attr){
        var ret = '';
<<<<<<< HEAD
        var elem = this.select(selector);
=======
        var elem = this.css(selector);
>>>>>>> develop
        if(elem) ret = this.$(elem).attr(attr);
        return ret;
    },

    //获取form表单
    form: function(formIdOrName){
        if(_.isObject(formIdOrName) && _.isFunction(formIdOrName.find)){
            //已经取到了form表单对象了
            return formIdOrName;
        }
        if(!formIdOrName.startsWith('#')){
            formIdOrName = datag.format('form[name="%s"]', formIdOrName);
        }
<<<<<<< HEAD
        return this.select(formIdOrName);
=======
        return this.css(formIdOrName);
>>>>>>> develop
    },

    //获取form表单数据, 如果是id必须以#开头，否则当成name处理
    formData: function(formIdOrName, type){
<<<<<<< HEAD
        type = type || 'text';
        var selector = '';
        if(!type || type === 'all'){
            selector = 'input[type=text], input[type=hidden]';
        }
        else{
=======
        type = type || 'all';
        var selector = '';
        if(type === 'all'){
            selector = 'input[type=text], input[type=hidden]';
        }
        else{ // type = 'text' or type = 'hidden'
>>>>>>> develop
            selector = 'input[type='+type+']';
        }
        var ret = {};
        var $ = this.$;
        this.form(formIdOrName).find(selector).each(function(i, elem){
            key = $(elem).attr("name") || $(elem).attr("id");
            if(key){
                ret[key] = $(elem).val() || "";
            }
        });
        return ret;
    },

<<<<<<< HEAD
    //=============================================================正则表达式匹配
    regexp: function(expr){
        var matched = this.html.match(expr);
        if(matched) return matched;
        return [];
    },

    //判断是否包含字符串
    contains: function(word, casesensive){
        if(_.isEmpty(word)) return false;
        if(casesensive){
            return this.html.indexOf(word) >= 0;
        }
        return this.html.toLowerCase().indexOf(word.toLowerCase()) >= 0;
    },

    //根据前后字符串提取中间段
    substr: function(start, end, casesensive){
        var str = this.html;
        var startStr="";
        var endStr=""
        if(!casesensive){
            str = this.html.toLowerCase();
            startStr = startStr.toLowerCase();
            endStr = endStr.toLowerCase();
        }
        var startPos = str.indexOf(startStr) + startStr.length;
        var endPos = str.indexOf(endStr);
        if(startPos >= 0 && endPos < str.length){
            return this.html.substring(startPos, endPos);
        }
        return "";
    }
}

scrapy.HtmlParser = HtmlParser;
module.exports = scrapy;
=======
	/**
	 * 根据正则表达式截取字符串
	 */
    regexp: function(expr, index){
        return this.html.regex(expr, index);
    },

    /**
	 * 根据前后字符串提取中间段
	 *
	 * @param start 开始字符串
	 * @param endOrLen 结束字符串或截取字符长度
	 * @param casesensive 区分大小写，默认不区分
	 * @return 截取出来的字符串
	 */
    substr: function(start, endOrLen){
        return this.html.between(start, endOrLen);
    }
}

//expose class
module.exports = HtmlParser;
>>>>>>> develop
