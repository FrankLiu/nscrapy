"use strict";
/**
 * 内容提取工具类，用于提取各类页面元素
 */

var cheerio = require('cheerio');
var _ = require('underscore');
var scrapy = require('./common').scrapy;

function HtmlParser(html) {
    this.html = html;
    this.$ = cheerio.load(html);
}

HtmlParser.load = function (html) {
    return new HtmlParser(html);
};

HtmlParser.prototype = {
    //========================================================通过xpath选择器匹配
    xpath: function xpath(selector) {
        return this.$(selector);
    },
    select: function select(selector) {
        return this.xpath(selector);
    },

    //根据id获取页面元素
    byId: function byId(id) {
        if (!id.startsWith('#')) {
            id = '#' + id;
        }
        return this.select(id);
    },

    //根据class获取页面元素
    byClass: function byClass(cls) {
        if (!cls.startsWith('.')) {
            cls = '.' + cls;
        }
        return this.select(cls);
    },

    //根据选择器获取属性值
    attr: function attr(selector, _attr) {
        var ret = '';
        var elem = this.select(selector);
        if (elem) ret = this.$(elem).attr(_attr);
        return ret;
    },

    //获取form表单
    form: function form(formIdOrName) {
        if (_.isObject(formIdOrName) && _.isFunction(formIdOrName.find)) {
            //已经取到了form表单对象了
            return formIdOrName;
        }
        if (!formIdOrName.startsWith('#')) {
            formIdOrName = datag.format('form[name="%s"]', formIdOrName);
        }
        return this.select(formIdOrName);
    },

    //获取form表单数据, 如果是id必须以#开头，否则当成name处理
    formData: function formData(formIdOrName, type) {
        type = type || 'text';
        var selector = '';
        if (!type || type === 'all') {
            selector = 'input[type=text], input[type=hidden]';
        } else {
            selector = 'input[type=' + type + ']';
        }
        var ret = {};
        var $ = this.$;
        this.form(formIdOrName).find(selector).each(function (i, elem) {
            key = $(elem).attr("name") || $(elem).attr("id");
            if (key) {
                ret[key] = $(elem).val() || "";
            }
        });
        return ret;
    },

    //=============================================================正则表达式匹配
    regexp: function regexp(expr) {
        var matched = this.html.match(expr);
        if (matched) return matched;
        return [];
    },

    //判断是否包含字符串
    contains: function contains(word, casesensive) {
        if (_.isEmpty(word)) return false;
        if (casesensive) {
            return this.html.indexOf(word) >= 0;
        }
        return this.html.toLowerCase().indexOf(word.toLowerCase()) >= 0;
    },

    //根据前后字符串提取中间段
    substr: function substr(start, end, casesensive) {
        var str = this.html;
        var startStr = "";
        var endStr = "";
        if (!casesensive) {
            str = this.html.toLowerCase();
            startStr = startStr.toLowerCase();
            endStr = endStr.toLowerCase();
        }
        var startPos = str.indexOf(startStr) + startStr.length;
        var endPos = str.indexOf(endStr);
        if (startPos >= 0 && endPos < str.length) {
            return this.html.substring(startPos, endPos);
        }
        return "";
    }
};

scrapy.HtmlParser = HtmlParser;
module.exports = scrapy;