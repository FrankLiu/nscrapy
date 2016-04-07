/**
 * 抽象一个采集任务流程：初始化 -> 登录 -> 采集 -> 解析 -> 存储 -> 完成
 * 实例化Spider代表初始化一个流程，每个流程都由一个唯一的标识id，流程所有阶段都会公用同一个id
 * 流程分为6个阶段，每个阶段都由下列5个状态：doing, waiting_input, done_succ, done_failure, done_timeout
 * 每个阶段有进度标识，progress，用于记录当前阶段的流程进度，取值0-100
 * 每个阶段有过滤器，用于灵活处理流程开始和结束时的数据
 */
var scrapy = require('./common').scrapy;

var Spider = function(options){
  EventEmiter.call(this);
  this.options = options || {};
  this.id = scrapy.genUuid();
  this.filters = [];
  this.scheduler = this.options.scheduler;
  this.downloader = this.options.downloader;
  this.extractor = this.options.extractor;
  this.pipelines = this.options.pipelines || [];

  //runtime vars
  this.cookies = {};
  this.data = [];
}
util.inherit(Spider, EventEmiter);

Spider.prototype = {
    EVENTS: [
      'init' , 'login', 'fetch', 'extract', 'export', 'end'
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
		this.emit('fetch', {step: 'data', sid: username});
		this.emit('fetch', {step: 'end', sid: username});
	},

	// 分析提取数据
	extract: function(){

	},

	// 导出数据，比如导出到db/fs/net
	exportTo: function(target){
		
	},

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
