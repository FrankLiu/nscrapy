'use strict';

//3rd party libs
var _ = require('underscore');
var moment = require('moment');

/**
 * Javascript语言层面的扩展
 */
//===========================================Object
Object.prototype.$super = function(){
	var result;
	try{
		 //首先获取基类的构造器，将它保存在变量result中
		 result = eval(this.constructor).prototype.constructor;
		 //调用基类的构造器方法
		 result.apply(this, arguments);
	}
	catch(e){
		//如果不是内建类或者自定义类，或者不在构造器中调用该方法，就抛出错误
		throw new Error('only can be used in constructor!');
	}
	return result;
}

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
String.prototype.ltrim= function(){
    return this.replace(/(^\s*)/g, "");
}
String.prototype.rtrim= function(){
    return this.replace(/(\s*$)/g, "");
}
String.prototype.strip = function(){
	return this.replace(/(^\/*)|(\/*$)/g, '');
}
String.prototype.lstrip = function(){
	return this.replace(/(^\/*)/g, '');
}
String.prototype.rstrip = function(){
	return this.replace(/(\/*$)/g, '');
}

//判断是否包含某单词
String.prototype.contains = function(word){
	return this.indexOf(word) >= 0;
}

//根据开始字符串截取给定长度字符串
String.prototype.substr2 = function(startStr, length){
	var startPos = this.indexOf(startStr) + startStr.length;
	if(startPos >= 0 && length > 0){
		return this.substr(startPos, length);
	}
	return "";
}

//根据开始字符串和结束字符串截取中间段
String.prototype.substring2 = function(startStr, endStr){
	var startPos = this.indexOf(startStr) + startStr.length;
	var endPos = this.indexOf(endStr);
	if(startPos >= 0 && endPos < this.length){
		return this.substring(startPos, endPos);
	}
	return "";
}

//根据开始字符及结束字符或长度截取字符串
String.prototype.between = function(start, endOrLen){
	if(Object.prototype.toString.call(end) === '[object Number]'){
		return this.html.substr2(start, end);
	}
	return this.html.substring2(start, end);
}

//根据正则表达式提取数据
String.prototype.regex = function(expression, index){
    var content = this;
    var index = parseInt(index, 10)||0;
    // if(index===0) index=1;
    var expression = new RegExp(expression,"ig");
    if(index>0){
        var matched = expression.exec(content);
        if(matched&&matched.length>index)return matched[index];
    }else{
        var arr = [],matched;
        while (matched = expression.exec(content))
            arr.push(matched[1]);
        return arr;
    }
}

//=========================================================日期函数
Date.DEFAULT_DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";
Date.DEFAULT_DATE_FORMAT = "YYYY-MM-DD";
Date.DEFAULT_MONTH_FORMAT = "YYYY-MM";

if(!Date.inst){
    Date.inst = function(){
        return new Date();
    }
}
if(!Date.now){
	Date.now = function(){
		return (new Date()).getTime();
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
