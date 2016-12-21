/**
 * 内容提取工具类，用于提取各类页面元素
 */
"use strict"

/**
 **
 * Http客户端工具
 */
var scrapy = require('./common').scrapy;
var util = require('util');
var EventEmitter = require('events');
var _ = require('underscore');
var async = require('async');
var log4js = require('log4js');
var request = require('request');
var iconv = require('iconv-lite');
var tough = require('tough-cookie');
var HtmlParser = require('../parsers/htmlparser');

var SUPPORTED_METHODS = ['GET','POST','PUT','HEAD'];
var DEFAULT_HEADERS =  {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/*,*/*;q=0.8'
    ,'Accept-Charset' : 'utf-8, iso-8859-1, utf-16, *;q=0.7'
    ,'Accept-Language': 'zh-CN, en-US'
    ,'x-Getzip'       : 'supported'
    ,'Cache-Control'  : 'no-cache'
    ,'Connection'     : 'keep-alive'
    ,'User-Agent'     : 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.65 Safari/537.36'
};
var DEFAULT_TIMEOUT = 60*1000 ;
var DEFAULT_REQ_OPTIONS = {
    headers: DEFAULT_HEADERS,
    timeout: DEFAULT_TIMEOUT,
    followRedirect : true ,
    followAllRedirects: true
};

var DEFAULT_OPTS = {
    autoDecode: true,
    keepCookies: true,
    autoParseData: true,
    cache: 'memory' //TODO: cache the response to redis or file
};
function HttpClient(opts){
    EventEmitter.call(this);
    this.opts = _.extend({}, DEFAULT_OPTS, opts);
    this.reqOptions = _.extend({}, DEFAULT_REQ_OPTIONS);
    this.logger = log4js.getLogger('http');
    //用于保存上次访问的cookies
    this.cookies = [];
}
util.inherits(HttpClient, EventEmitter);

HttpClient.create = function(opts){
    return new HttpClient(opts);
}

HttpClient.prototype = {
    //设置headers['Referer']属性
    setReferer: function(referer){
        this.reqOptions.headers['Referer'] = referer;
    },

    //设置headers['User-Agent']属性
    setUserAgent: function(ua){
        this.reqOptions.headers['User-Agent'] = ua;
    },

    //设置cache
    setCache: function(cache){
        this.opts.cache = cache;
    },

    //发送请求并分析结果
    _call: function(method, url, options, callback){
        this.logger.info('[%s] %s', method, url);
        if(!_.contains(SUPPORTED_METHODS, method)){
            this.logger.info("Not supported http method: " + method);
            return;
        }
        //request options
        if(_.isFunction(options)){
            callback = options;
            options = {};
        }
        options = _.extend({}, this.reqOptions, options);

        //如果请求过程中传入cookies，就用该cookies，
        //如果没有传入，就根据keepCookies开关确定是否从之前的请求中还原cookies
        if(!options.jar){
            this.logger.debug('initialize options.jar...');
            options.jar = request.jar();
        }

        if(options.cookies && _.isArray(options.cookies)){
            this.logger.debug('restore previous cookies from request...');
            for(let s of options.cookies){
                let cookie = request.cookie(s);
                options.jar.setCookie(cookie,url);
            }
            //options.jar['_jar'].store.idx = options.cookies;
            delete options.cookies;
        }
        else if(this.opts.keepCookies && this.cookies.length>0){
            this.logger.debug('restore previous cookies from instance...');
            for(let c of this.cookies){
                options.jar.setCookie(c,url);
            }
            //options.jar['_jar'].store.idx = this.cookies;
        }

        options.encoding = options.encoding || null; //encoding the body as expect or binary
        if(options.encoding === 'binary') options.encoding = null;
        this.logger.debug('request options: ', options);

        //call http request and process response
        var self = this;
        options.method = method;
        var onResponse = _.once(this._onResponse.bind(this));
        if(!_.isFunction(callback)){
            this.logger.error('callback should be a function!');
            return;
        }
        this.logger.debug('send async http request...');
        return request(url, options, function(err, resp, body){
            if(err){
                self.logger.error(err);
                return callback(err);
            }
            resp.content = body;
			onResponse(resp, options, url);
			self.emit('response', resp, options, url);
            self.logger.debug('response async http request .');
            //return the result by callback
            callback(err, resp);
        });
    },

    //处理返回结果
    _onResponse: function(resp, options,url){
        var self = this;
        //header handler
        var encoding = options.encoding;
        var contentType = (resp.headers && resp.headers['content-type'])||'text/html';
        if(self.opts.autoDecode) encoding = self._detectEncoding(contentType);
        self.logger.info('response content encoding: %s', encoding);
        self.logger.info('response status code: %s', resp.statusCode);
        self.logger.debug('response headers: ', resp.headers);

        //cookies handler
        //TODO: hack cookies, need find a better solution later
        //resp.cookies = options.jar.getCookies(url);
        if(self.opts.keepCookies){
            self.logger.debug('store cookies to instance...');
            self.cookies = options.jar.getCookies(url);
            self.logger.debug('current cookies: ', options.jar.getCookieString(url));
        }
        if(resp.statusCode !== 200 || _.isEmpty(resp.content)){
            self.logger.warn('the response may be invalid!');
            return;
        }

        if(encoding === 'binary'){
            self.logger.debug('encoding as binary, ignore decode response content!');
            return;
        }

        //content handler
        if(self.opts.autoDecode){
            self.logger.debug('decode response content to encoding: %s', encoding);
			try{
				resp.content = iconv.decode(resp.content, encoding);
			}
			catch(e){
				self.logger.error('decode error: ', e);
			}
        }
        //parse json/js data
        if(self.opts.autoParseData){
            resp.data = self._parseContent(resp.content, contentType[0]);
        }
    },

    //自动检测encoding，内部使用
    _detectEncoding: function(contentType){
        var encoding;
        if(contentType){
            if(contentType.contains('charset')){
                encoding = contentType.split('charset=')[1];// .substr2('charset=', 6);
            }
            else if(contentType.contains('image/')){
                encoding = 'binary';
            }
            else if(contentType.contains('application/json')){
                encoding = 'utf8';
            }
        }
        return encoding || 'utf8';
    },

	//解析网页内容，内部使用
	_parseContent: function(content, contentType){
		contentType = contentType || 'text/html';
		var data = null;
		if(_.include(['application/json', 'text/javascript'], contentType.trim())) {
			try {
				this.logger.debug('auto parse content to json data...');
				data = JSON.parse(resp.content);
                } catch (err) {
				this.logger.error('parse json content failed!', err);
			}
		}
		else{
			try{
				this.logger.debug('auto parse content to html data...');
				data = HtmlParser.load(resp.content);
			}
			catch(err){
				this.logger.error('parse html content failed!', err);
			}
		}
		return data;
	},

    //get请求
    get: function(url, options, callback){
        this._call('GET', url, options, callback);
		return this;
    },

    //post请求
    post: function(url, options, asyncCallback){
        this._call('POST', url, options, asyncCallback);
		return this;
    },

    //put请求
    put: function(url, options, asyncCallback){
        this._call('PUT', url, options, asyncCallback);
		return this;
    },

    head: function(url, options, asyncCallback){
        this._call('HEAD', url, options, asyncCallback);
		return this;
    },

    //opts property: autoDecode
    enableAutoDecode: function(){
        this.opts.autoDecode = true;
    },
    disableAutoDecode: function(){
        this.opts.autoDecode = false;
    },
    //opts property: keepCookies
    enableKeepCookies: function(){
        this.opts.keepCookies = true;
    },
    disableKeepCookies: function(){
        this.opts.keepCookies = false;
    },

	//事件链，模拟多个url采集参数传递
	pipe: function(dst){
		var self = this;
		this.on('pipe', function(resp){
			var hc = HttpClient.create();
			hc.src = self;
			self.next = hc;
			_.extend(hc, self);
			_.extend(hc.reqOptions, self.reqOptions);
			hc._call(dst.method || 'GET', dst.url, dst.options, dst.callback);
			return hc;
		});
	},

	//回调链，可用于多个请求之间的结果传递
	waterfall: function(chains, callback/*所有函数完成后返回*/){
		var self = this;
		var fns = [], chain;
		_.each(chains, function(chain){
			var fn = _.isFunction(chain) ? chain : function(method, url, options, callback){
				method = method || chain.method;
				url = url || chain.url;
				options = options || chain.options;
				callback = options || chain.callback;
				self._call(method || 'GET', url, options, callback);
			};
			fns.push(fn);
		});

		async.waterfall(fns, callback || function(err, result){
			if(err){
				self.logger.error("error on make requests: ", err);
			}
			self.logger.debug("waterfall result: ", result);
		});
	}
}

//声明命名空间
scrapy.HttpClient = HttpClient;
module.exports = scrapy;
