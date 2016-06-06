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
var uuid = require('uuid');


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
		return this.stackTrace;
	}

	toJSON(){
		return JSON.stringify(this);
	}
}


//导出class/functions
_.extend(scrapy, {
    isEmpty: _.isEmpty,
    isNotEmpty: _.isNotEmpty,
	mixin: _.mixin,
	extend: _.extend,
	clone: clone,
  	log: log,
  	colorLog: colorLog,
	RuntimeError: RuntimeError,

	//安全回调，会预先判断回调函数是否存在
	invokeCallback = function(cb) {
		if ( !! cb && typeof cb === 'function') {
			cb.apply(null, Array.prototype.slice.call(arguments, 1));
		}
	},

	//获取本地ip地址
  	getLocalIP: function(){
		var ipobj = os.networkInterfaces();
		var eth = ipobj.eth0 || ipobj.eth1 || ipobj.p4p1 || [];//1号或者2号网卡
		var ip = (eth[0] && eth[0].family == 'IPv4') ? eth[0].address : "";//获取ipV4的地址
		return ip;
	},
	
	//判断字符串是否包含中文字符
	hasChineseChar = function(str) {
		if (/.*[\u4e00-\u9fa5]+.*$/.test(str)) {
			return true;
		} else {
			return false;
		}
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
	raise: function(code, msg){
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
});

module.exports = scrapy;
