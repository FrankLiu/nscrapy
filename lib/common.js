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
 //=====字符串函数
//判断string开始字母是否匹配
String.prototype.startsWith = function(word, casesensive){
	if(_.isEmpty(word) || !_.isString(word)) return false;
	if(casesensive){
		return this.indexOf(word) == 0;
	}
	return this.toLowerCase().indexOf(word.toLowerCase()) == 0;

}

//判断string开始字母是否匹配
String.prototype.endsWith = function(word, casesensive){
	if(_.isEmpty(word) || !_.isString(word)) return false;

	if(casesensive){
		return this.lastIndexOf(word) == (this.length-word.length);
	}
	return this.toLowerCase().lastIndexOf(word.toLowerCase()) == (this.length-word.length);
}

//判断string是否包含某单词
String.prototype.contains = function(word, casesensive){
	if(_.isEmpty(word)) return false;
	if(casesensive){
		return this.indexOf(word) >= 0;
	}
	return this.toLowerCase().indexOf(word.toLowerCase()) >= 0;
}

String.prototype.notContains = function(word, casesensive){
	return !this.contains(word, casesensive);
}

//根据给定的开始字符串和长度截取中间段
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

//根据给定的开始字符串和结束字符串截取中间段
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

//======日期函数
Date.DEFAULT_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";
Date.DEFAULT_DAY_FORMAT = "YYYY-MM-DD";
Date.DEFAULT_MONTH_FORMAT = "YYYY-MM";

Date.now = (Date.now || function(){
	return new Date();
})
Date.timestamp = function(){
	return (new Date()).getTime();
}
Date.parse = function(d, format){
	format = format || Date.DEFAULT_DATE_FORMAT;
	return moment(d, format).toDate();
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
	format = format || Date.DEFAULT_DATE_FORMAT;
	return this.toMoment().format(format);
}
Date.prototype.formatDate = function(){
	return this.format(Date.DEFAULT_DAY_FORMAT);
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

//=====Function函数扩展
Function.emptyFn = function(){};

//=====underscore函数扩展
_.mixin({
	isNotEmpty: function(o){
		return !_.isEmpty(o);
	}
});

/***************************************************************
 *    dgcore = dgcore || {}, 申明命名空间
 **************************************************************/
var dgcore = dgcore || {};

//内核扩展函数
dgcore.mixin = _.mixin.bind(dgcore);
dgcore.extend = _.extend.bind(_);

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

/*
获取本地ip地址
*/
function getLocalIP() {
	var ipobj = os.networkInterfaces();
	var eth = ipobj.eth0 || ipobj.eth1 || ipobj.p4p1 || [];//1号或者2号网卡
	var ip = eth[0] && eth[0].family == 'IPv4' ? eth[0].address : "";//获取ipV4的地址
	return ip;
}

/**
 * 简单的md5加密算法实现
 */
function md5(data) {
    var buf = new Buffer(data);
    var str = buf.toString("binary");
    return crypto.createHash("md5").update(str).digest("hex");
}

/**
 * uuid的简单实现
 */
function genUuid(){
  return uuid();
}

//导出class/functions
dgcore = {
  log: log,
  colorLog: colorLog,
  getLocalIP: getLocalIP,
  md5: md5,
  genUuid: genUuid
};

module.exports = exports.dgcore = dgcore;
