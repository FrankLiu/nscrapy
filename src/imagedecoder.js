"use strict"

const fs = require('fs');
const _ = require('underscore');
const logger = require('log4js').getLogger("Login");
const request = require('request');

const ysConfig = {
	endpoint: 'http://api.ysdm.net/create.json',
    userName:"xxxxx",
    password:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    softId:"xxxx",
    softKey:"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
};
const DEFAULT_HEADERS = {
	'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0',
	'Content-Type' : 'application/x-www-form-urlencoded'
};
const DEFAULT_OPTIONS = {
	header: DEFAULT_HEADERS,
	cookies: {},
	followRedirect : true,
	followAllRedirects: true
};
const TRANS_MODE = {
	BY_URL: 0,
	BY_FILE: 1,
	BY_BUFFER: 2
};
request.debug = true;

//按图片地址解码
function decode(imageUrl, type, callback){
	if(!callback && _.isFunction(type)){
		type = '3040';
		callback = type;
	}

	var formData = {
			'username':ysConfig.userName,
			'password': ysConfig.password,
			'typeid': type,
			'softid': ysConfig.softId,
			'softkey': ysConfig.softKey,
			'imageurl': imageUrl
	};
	request.post(ysConfig.endpoint, _.extend({}, DEFAULT_OPTIONS, {form: formData}), function(err, resp, body){
		logger.debug(body);
		logger.debug(JSON.parse(body).Result);
		callback(JSON.parse(body).Result);
	})
}

//按字节码解码
function decodeBuffer(data, type, callback){
	if(!callback && _.isFunction(type)){
		type = '3040';
		callback = type;
	}

	var formData = {
			'username':ysConfig.userName,
			'password': ysConfig.password,
			'typeid': type,
			'softid': ysConfig.softId,
			'softkey': ysConfig.softKey,
			'image': {"buffer": data, "filename": "photo.jpg", "content-type": "image/jpg"} // filename: 抓取回来的码证码文件
	};
	var upForm = request.post(ysConfig.endpoint, DEFAULT_OPTIONS, function(err, resp, body){
			//logger.debug(response);
			logger.debug(body);
			logger.debug(JSON.parse(body).Result);
			return callback(JSON.parse(body).Result);
		}).form();

	_.each(formData,function(v,k){
		if (v && v.buffer && (v.buffer instanceof Buffer) ) {
			upForm.append(k, v.buffer, { filename: v['filename'] || 'image.jpg', contentType: v['content-type'] || 'image/jpg', knownLength: v.buffer.length });
		} else {
			upForm.append(k,v);
		}
	});
}

//按流解码
function decodeStream(stream, type, callback){

}

//云速打码模式
var ysCode = function(effectiveInfo, codeType, transportMode, callback){
	logger.info('decode image: %s', effectiveInfo);
	if(transportMode == TRANS_MODE.BY_URL){
		decode(effectiveInfo, codeType, callback);
    }
	else if(transportMode == TRANS_MODE.BY_FILE){
        //传图片文件
        decodeBuffer(fs.readFileSync(effectiveInfo), codeType, callback);
    }
	else if(transportMode == TRANS_MODE.BY_BUFFER){
        //传buffer
        decodeBuffer(effectiveInfo, codeType, callback);
    }
	else{
		logger.error("非法入参: ", arguments);
        callback(new Error("请传入正确的参数"));
    }
}

//expose class/functions
module.exports=exports={
	ysCode: ysCode,
	decode: decode,
	decodeBuffer: decodeBuffer
};
