"use strict";
/**
 * 内容提取工具类，用于提取各类页面元素
 */
require('./es5_polyfill');
var cheerio = require('cheerio');
var _ = require('lodash');


function HtmlParser(html){
	if(!this instanceof HtmlParser){
		return new HtmlParser(this);
	}
    this.html = html.toString();
    this.$ = cheerio.load(html);
}

HtmlParser.load = function(html){
    return new HtmlParser(html);
}

HtmlParser.prototype = {
    /**
	 * 通过css选择器匹配元素
	 */
    css: function(selector){
        return this.$(selector);
    },

    //根据id获取页面元素
    byId: function(id){
        if(!id.startsWith('#')){ id = '#'+id }
        return this.css(id);
    },

    //根据class获取页面元素
    byClass: function(cls){
        if(!cls.startsWith('.')){ cls = '.'+cls }
        return this.css(cls);
    },

    //根据选择器获取属性值
    attr: function(selector, attr){
        var ret = '';
        var elem = this.css(selector);
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
        return this.css(formIdOrName);
    },

    //获取form表单数据, 如果是id必须以#开头，否则当成name处理
    formData: function(formIdOrName, type){
        type = type || 'all';
        var selector = '';
        if(type === 'all'){
            selector = 'input[type=text], input[type=hidden]';
        }
        else{ // type = 'text' or type = 'hidden'
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
