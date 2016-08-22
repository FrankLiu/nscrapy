/**
 * 优优云图片解码类
 */
'use strict';

import { util } from 'util';
import { Stream } from 'stream';
import { co } from 'co';
import { scrapy } from '../base';

export default class UUDecoder extends ImageDecoder{
	constructor(opts){
		super(opts || {retryTimes: 3});
		this.options = this.loadConfig('uucode');
		this.isLogined = false;
		this.loginUrl = '';
		this.uploadUrl = '';
		this.resultUrl = '';
	}
	
	//根据优优云API访问入口获取服务器地址列表
    _getServerAddresses: function *(){
        var resp = yield this.httpClient.get(this.options.endpoint);
		if(resp.error){
			scrapy.raise('uucode-failure', 'Get uucode server addresses failure!');
		}
		if(resp.content && resp.content.contains(',')){
			var tokens = resp.content.split(',');
			this.timeout = parseInt(tokens.shift(), 10);
			for(var i=0; i<tokens.length; i++){
			// _.each(tokens, function(token){
				var addrs = (tokens[i].match(/^(.*)[:]([\d]+)$/)||[]);
				if (addrs[1] && addrs[2]) {
					this._buildAddrs(addrs[2], addrs[1]);
				}
			}
		}

		scrapy.notEmpty(this.loginUrl, 'loginUrl-is-required', '获取优优云服务器登陆地址列表失败');
		scrapy.notEmpty(this.uploadUrl, 'uploadUrl-is-required', '获取优优云服务器上传地址列表失败');
		scrapy.notEmpty(this.resultUrl, 'resultUrl-is-required', '获取优优云服务器结果地址列表失败');
    }

	_buildAddrs: function(code, addr){
		switch(code){
			case '101': this.loginUrl = util.format('http://%s/Upload/Login.aspx', addr);
			case '102': this.uploadUrl = util.format('http://%s/Upload/Processing.aspx', addr);
			case '103': this.resultUrl = util.format('http://%s/Upload/GetResult.aspx', addr);
		}
	}

    //md5加密
    _md5: function(a, toUpperCase){
        var str;
        if(_.isArray(a)){
            str = _.reduce(a, function(memo, i){
                if(toUpperCase){
                    i = i.toUpperCase();
                }
                memo += i;
            }, '');
        }
        else{ //a is string
            if(toUpperCase) a = a.toUpperCase();
            str = a;
        }
        return scrapy.md5(str);
    }

    //构建登录url
    _buildLoginUrl: function(endpoint, username, passwd){
        return util.format('%s?U=%s&p=%s', endpoint, username, this._md5(passwd));
    }

    //构建登录的http头
    _buildLoginHeader: function(){
		if(_.isNotEmpty(this.loginHeader)){
			return this.loginHeader;
		}
        var softkey = this.options.softkey.toUpperCase();
        var username = this.options.username.toUpperCase();
        this.loginHeader = {
            "Accept": 'text/html, application/xhtml+xml, */*',
			"Accept-Language": 'zh-CN',
			"Connection": 'Keep-Alive',
			"Cache-Control": 'no-cache',
    	    "SID"       : this.options.sid,
    	    "HASH"      : this._md5(this.options.sid + softkey),
    	    "UUVersion" : this.options.version,
    	    "UID"       : "100" ,
    	    "User-Agent" : this._md5(softkey + "100"),
            "KEY"       : this._md5(softkey + username) + this.options.mac
    	};
		return this.loginHeader;
    }

    //构建提交图片的表单
    _buildProcessingForm: function(userkey){
        this.processingForm = {
            "Version" : "100",
            "TimeOut" : 60*1000,
            "Type" : '1004', //默认4位英文字母码
            "SID" : this.options.sid,
            "KEY": userkey.toUpperCase(),
			"SKEY": this._md5(userkey.toLowerCase() + this.options.sid + this.options.softkey)
        };
        return this.processingForm;
    }

    //登录优优云服务
    _login: function *(){
		if(this.logined){
			this.logger.warn('login uuwise before, ignored!');
			return;
		}
        var loginUrl = this._buildLoginUrl(this.loginUrl, this.options.username, this.options.password);
		var options = {
			headers: this._buildLoginHeader()
		};
		var resp = yield this.httpClient.get(loginUrl, options);
		if (resp.error || resp.statusCode != 200 || !resp.content || resp.content.length < 10) {
			scrapy.raise('invalid-response', "登陆图片验证服务器失败");
		}
        this.loginCookies = resp.cookies;

		var userkey = resp.content;
		var matched = resp.content.match( /([^_]+).*/);
		if(!matched) {
			scrapy.raise('login-failure', "登陆图片验证服务器失败:" + resp.content);
		}

		var uid = matched[1];
		_.extend(this.loginHeader, {
			"UID": uid,
			"User-Agent": this._md5(this.options.softkey.toUpperCase()+uid)
		});
        this._buildProcessingForm(userkey);
		this.logined = true;
		return this;
    }

    //上传图片到优优云服务器
    _uploadImg: function *(imgBuf, type){
        var options = {
            headers: _.omit(this.loginHeader, 'KEY'),
            formData: _.extend(this.processingForm, {
                "Type" : type||'1004', //默认4位英文字母码
                "IMG": {
                    value: imgBuf,
                    options: {
                        filename: 'capacha.jpg',
                        contentType: 'image/jpg',
                        knownLength: imgBuf.length
                    }
                }
            })
        };
        var resp = yield this.httpClient.post(this.uploadUrl, options);
		if(resp.error || resp.statusCode !== 200 || !resp.content){
			datag.raise('validate-image-failed', '图片验证失败!');
		}
		var content = resp.content;
        this.logger.debug('response of processing: ', content);
		var tokens = content.split("|") ;
		if (tokens[0] === '-12003' ) {
			datag.raise('login-required', "登陆图片验证服务器失败");
		}
		else if(tokens[1]){
			return tokens[1];
		}
        else{
            return this._getResult(tokens[0]);
        }
    }

    //构建getResult地址
    _buildGetResultUrl: function(token){
        return this.resultUrl + '?key=' + this.processingForm.KEY + '&ID=' + token;
    }

	//获取解码结果:重试10次
    _getResult: function *(token){
        var ret='';
		// let's try 10 times
		for (var retriedTimes=0; retriedTimes<10 && !ret; retriedTimes++) {
            //等待1s
            datag.sleep(500);
            var options = {
                headers: _.omit(this.loginHeader, 'KEY'),
                cookies: this.loginCookies
            };
            this.logger.info('等待打码结果第[%s]次...', retriedTimes+1);
			var resp = yield this.httpClient.get(this._buildGetResultUrl(token), options);
			if (resp.error || resp.statusCode != 200 || !resp.content) {
				datag.raise('invalid-response', "获取图片验证结果失败");
			}
			ret = resp.content ;
            this.logger.info('response of getResult: ', ret);
			if(ret.match(/^[-]\d+$/)){
				ret = '' ;
				continue ;
			}
            else {
				break ;
			}
		}
        return ret;
    }

	//图片解码
	decode(resource, type){
		if(Buffer.isBuffer(resource)){
			return this.decodeBuffer(resource, type);
		}
		else if(resource instanceof Stream){
			
		}
	}
	
    //对图片地址进行解码
    * decodeUrl(imgurl, type){
        this.logger.info('decode image: %s', imgurl);
        var resp = yield this.httpClient.get(imgurl);
		if(resp.error) datag.raise('invalid-imgurl', 'invalid image url');
        return this.decodeBuffer(new Buffer(resp.content), type);
    }
    
    //对图片字节流进行解码
    decodeBuffer(buf, type){
        this.logger.info('decode image buffer...');
        datag.notNull(buf, 'invalid-image', '图片流为空!');
        var ret;
        try{
    		if(!this.logined){
    			this._getServerAddresses();
    			this._login();
    		}
    		type = type || '1004';
    		ret = this._uploadImg(buf, type);
        }
        catch(e){
            //重新登录
            if(e.code === 'login-required'){
                this.logined = false;
                this.decodeBuffer(buf, type);
            }
            this.logger.error('图片解码失败', e);
        }
        this.logger.info('image code: %s', ret);
		return ret||'';
    }
		
	decodeStream(stream, type){
		scrapy.raise('not-implemented', 'decodeStream is not implemented!');
	}
}