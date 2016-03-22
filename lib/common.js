'use strict';

//std libs
var util = require('util');
var EventEmiter = require('events');
var os = require("os");
var crypto = require("crypto");

//slice/splice函数
var _slice = Array.prototype.slice;
var _splice = Array.prototype.splice;

//3rd party libs
var _ = require('underscore');
var moment = require('moment');
var uuid = require('uuid');

/**
 * Javascript语言层面的扩展
 */
 //===========================================字符串函数
//判断string开始字母是否匹配
String.prototype.startsWith = function(suffix) {
    return this.indexOf(suffix,0) === 0;
}

//判断string开始字母是否匹配
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
}

// 去除前后空格符
String.prototype.trim= function(){
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

//判断是否包含某单词
String.prototype.contains = function(word, casesensive){
	if(_.isEmpty(word)) return false;
	if(casesensive){
		return this.indexOf(word) >= 0;
	}
	return this.toLowerCase().indexOf(word.toLowerCase()) >= 0;
}

//根据开始字符串截取给定长度字符串
String.prototype.substr2 = function(startStr, length, casesensive){
	var str = this;
	if(!casesensive){
		str = this.toLowerCase();
		startStr = startStr.toLowerCase();
	}
	var startPos = str.indexOf(startStr) + startStr.length;
	if(startPos >= 0 && length > 0){
		return this.substr(startPos, length);
	}
	return "";
}

//根据开始字符串和结束字符串截取中间段
String.prototype.between = function(startStr, endStr, casesensive){
	var str = this;
	if(!casesensive){
		str = this.toLowerCase();
		startStr = startStr.toLowerCase();
		endStr = endStr.toLowerCase();
	}
	var startPos = str.indexOf(startStr) + startStr.length;
	var endPos = str.indexOf(endStr);
	if(startPos >= 0 && endPos < str.length){
		return this.substring(startPos, endPos);
	}
	return "";
}

//=========================================================日期函数
Date.DEFAULT_DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";
Date.DEFAULT_DATE_FORMAT = "YYYY-MM-DD";
Date.DEFAULT_MONTH_FORMAT = "YYYY-MM";

if(!Date.now){
	Date.now = function(){
		return new Date();
	};
}
if(!Date.timestamp){
	Date.timestamp = function(){
		return (new Date()).getTime();
	}
}
if(!Date.parse){
	Date.parse = function(d, format){
		format = format || Date.DEFAULT_DATETIME_FORMAT;
		return moment(d, format).toDate();
	}
}
Date.clone = function(d){
	return moment(d).clone().toDate();
}

//for internal use
Date.prototype.toMoment = function(format){
	if(!this.__moment){
		if(_.isEmpty(format)) this.__moment = moment(this);
		else this.__moment = moment(this, format);
	}
	return this.__moment;
}
Date.prototype.moment = Date.prototype.toMoment;

Date.prototype.add = function(number, category){
	this.toMoment().add(number, category);
	return this;
}

Date.prototype.subtract = function(number, category){
	this.toMoment().subtract(number, category);
	return this;
}

Date.prototype.format = function(format){
	format = format || Date.DEFAULT_DATETIME_FORMAT;
	return this.toMoment().format(format);
}
Date.prototype.formatDate = function(){
	return this.format(Date.DEFAULT_DATE_FORMAT);
}

Date.prototype.formatMonth = function(){
	return this.format(Date.DEFAULT_MONTH_FORMAT);
}

Date.prototype.startOf = function(category){
	this.toMoment().startOf(category);
	return this;
}
Date.prototype.startOfDay = function(){
	return this.startOf('day');
}
Date.prototype.startOfMonth = function(){
	return this.startOf('month');
}
Date.prototype.endOf = function(category){
	this.toMoment().endOf(category);
	return this;
}
Date.prototype.endOfDay = function(){
	return this.toMoment().endOf('day')
}
Date.prototype.endOfMonth = function(){
	return this.endOf('month');
}
Date.prototype.isBefore = function(d, category){
	return this.toMoment().isBefore(d, category);
}
Date.prototype.isSame = function(d, category){
	return this.toMoment().isSame(d, category);
}
Date.prototype.isAfter = function(d, category){
	return this.toMoment().isAfter(d, category);
}
Date.prototype.isBetween = function(d1, d2){
	return this.toMoment().isBetween(d1, d2);
}
Date.prototype.isLeapYear = function(){
	return this.toMoment().isLeapYear();
}

Date.prototype.toISOString = function(){
	return this.toMoment().toISOString();
}
Date.prototype.toJSON = function(){
	return this.toISOString();
}

//====================================================Function函数扩展
Function.emptyFn = function(){};
Function.logFn = function(){console.log(arguments)};

//====================================================underscore函数扩展
_.mixin({
	isNotEmpty: function(o){
		return !_.isEmpty(o);
	}
});

/***************************************************************
 *    scrapy = scrapy || {}, 申明命名空间
 **************************************************************/
var scrapy = scrapy || {};
scrapy.extend = _.extend;
scrapy.mixin = _.mixin;

//ansi colors
var ANSI_CODES = {
  'FATAL': 31, // red
  'ERROR': 31, // red
  'WARN': 33, // yellow
  'INFO': 32, // green
  'DEBUG': 37 // white
};

var ansi_colors = _.keys(ANSI_CODES);
function colorable(type, msg){
	type = type.toUpperCase();
	return '\u001b[' + (ANSI_CODES[type] || ANSI_CODES['INFO']) + 'm' + msg + '\u001b[0m';
};


//simple log for internal use
function log(msg){
	var prefix = util.format("[%s] [%s] - ", Date.now().format(), 'INFO');
	if(arguments.length > 2 && _.isNotEmpty(_slice.call(arguments,2))){
		msg = util.format(msg, _slice.call(arguments, 1));
	}
	console.log(prefix, msg);
}

//colorable log
function colorLog(type, msg){
	var prefix = util.format("[%s] [%s] - ", Date.now().format(), type);
	if(arguments.length > 2 && _.isNotEmpty(_slice.call(arguments,2))){
		msg = util.format(msg, _slice.call(arguments, 2));
	}
	console.log(colorable(type, prefix), msg);
};

//拷贝任意对象
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0,len = obj.length; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}

//运行时错误
class RuntimeError extends Error{
	constructor(code, msg){
		super(msg);
		this.code = code;
	}

	getCode(){
		return this.code;
	}

	getMessage(){
		return this.message;
	}

	getStack(){
		return this.error;
	}

	toJSON(){
		return JSON.stringify(this);
	}
}


//导出class/functions
scrapy = _.extend({}, {
	mixin: _.mixin,
	extend: _.extend,
	clone: clone,
  	log: log,
  	colorLog: colorLog,
	RuntimeError: RuntimeError,

	//获取本地ip地址
  	getLocalIP: function(){
		var ipobj = os.networkInterfaces();
		var eth = ipobj.eth0 || ipobj.eth1 || ipobj.p4p1 || [];//1号或者2号网卡
		var ip = eth[0] && eth[0].family == 'IPv4' ? eth[0].address : "";//获取ipV4的地址
		return ip;
	},

	//简单的md5加密算法实现
  	md5: function(data){
		var buf = new Buffer(data);
	    var str = buf.toString("binary");
	    return crypto.createHash("md5").update(str).digest("hex");
	},

	//生成全局唯一id
  	genUuid: function(timeBased){
		if(timeBased)
			return uuid.v1();
		else
			return uuid.v4();
	},

	//抛出异常
	raiseError: function(code, msg){
		return new RuntimeError(code, msg);
	},
	
	//安全执行
	tryCatch: function(lambda, callback){
		var result = {};

		try{
			result.data = lambda();
		}
		catch(e){
			scrapy.colorLog('ERROR', JSON.stringify(e));
			result.err = e;
		}

		if(_.isFunction(callback)){
			return callback(result);
		}
		return result;
	}
};

module.exports.scrapy = scrapy;
