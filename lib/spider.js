/**
 * 采集核心类，基于事件机制的扩展
 */
var scrapy = require('./common').scrapy;

var Spider = function(options){
  EventEmiter.call(this);
  this.options = options;

  //runtime vars
  this.cookies = {};
  this.data = [];
}
util.inherit(Spider, EventEmiter);

Spider.prototype = {
    EVENTS: [
      'init' , 'login', 'fetch','end'
    ],

	//登录函数
	login: function(username, password){
		this.emit('login', {step: 'begin', sid: username});
		this.emit('login', {step: 'checkcode', sid: username});
		this.emit('login', {step: 'smscode', sid: username});
		this.emit('login', {step: 'end', sid: username});
	},

	//获取数据
	fetch: function(){
		this.emit('fetch', {step: 'begin', sid: username});
		this.emit('fetch', {step: 'checkcode', sid: username});
		this.emit('fetch', {step: 'smscode', sid: username});
		this.emit('fetch', {step: 'data', sid: username});
		this.emit('fetch', {step: 'end', sid: username});
	},

	//导出数据，比如导出到db/fs/net
	// exportTo: function(target){
		
	// },

    //开始采集任务
    start: function(){
        this.emit('init', this);
        this.login(this.getUsername(), this.getPassword());
		this.fetch();
		this.emit('end', this.data);
    }

}


//expose class/functions
scrapy.Spider = Spider;
module.exports = scrapy;
