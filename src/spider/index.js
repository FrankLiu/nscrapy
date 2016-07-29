/**
 * 抽象一个采集任务流程：初始化 -> 登录 -> 采集 -> 解析 -> 存储 -> 完成
 * 实例化Spider代表初始化一个流程，每个流程都由一个唯一的标识id，流程所有阶段都会公用同一个id
 * 流程分为6个阶段，每个阶段都由下列5个状态：doing, waiting_input, done_succ, done_failure, done_timeout
 * 每个阶段有进度标识，progress，用于记录当前阶段的流程进度，取值0-100
 * 每个阶段有过滤器，用于灵活处理流程开始和结束时的数据
 */
require('../es5_polyfill');
var scrapy = require('../base');
var ResultItems = require('./resultitems');
var Downloader = require('./downloader');
var Extractor = require('./extractor');
var Pipeline = require('./pipeline');
var ProxyRouter = require('../proxyrouter');
var Scheduler = require('../scheduler');

var EventEmiter = require('events');

var Spider = function(options){
  EventEmiter.call(this);
  this.id = scrapy.genUuid();
  this.options = options || {};
  
  this.filters = options.filters || [];
  this.scheduler = this.options.scheduler || new Schduler(this);
  this.downloader = this.options.downloader || new Downloader(this);
  this.extractor = this.options.extractor || new Extractor(this);
  this.pipeline = this.options.pipeline || new Pipeline(this);

  //runtime vars
  this.cookies = {};
  this.data = new ResultItems(this);
}
util.inherit(Spider, EventEmiter);

Spider.Event = function(id, stage, status, progress){
	this.id = id;
	this.stage = stage;
	this.status = status;
	this.progress = 0;
}

Spider.STAGES = ['init' , 'login', 'fetch', 'extract', 'export', 'end'];
Spider.STATUSES = ['doing', 'waiting_input', 'done_succ', 'done_failure', 'done_timeout'];

Spider.prototype = {
	//分发事件
	publish: function(event){
		if(!event instanceof Spider.Event){
			throw new Error('invalid-event: ' + e.toString());
		}
		this.emit(event.id, event);
	},
	
	//订阅事件
	subscribe: function(event, cb){
		if(!event instanceof Spider.Event){
			throw new Error('invalid-event: ' + e.toString());
		}
		this.on(event.id, cb);
	},
	
	//初始化
	assembly: function(){
		this.publish(new Spider.Event(this.id, 'init', 'doing', 0));
		return this;
	},
	
	//登录函数: before and after 事件可以基于filter机制来实现
	login: function(username, password){
		this.publish(new Spider.Event(this.id, 'login', 'doing', 0));
		this.emit('login', {status: 'waiting_input', type: 'img', id: this.id});
		this.emit('login', {status: 'waiting_input', type: 'sms', id: this.id});
		this.emit('login', {status: 'waiting_input', type: 'pwd', id: this.id});
		return this;
	},

	//获取数据
	fetch: function(){
		this.emit('fetch', this.id);
		this.emit('fetch', {status: 'done_succ', id: this.id});
		return this;
	},

	// 分析提取数据
	extract: function(){
		this.emit('extract', this.id);
		return this;
	},

	// 导出数据，比如导出到db/fs/COS
	pipe: function(target){
		this.emit('export', this.id);
		return this;
	},

	//结束阶段
	end: function(){
		this.emit('end', this.id);
		return this;
	},
	
    //开始采集任务
    start: function(){
        this.assembly()
			.login(this.getUsername(), this.getPassword())
			.fetch()
			.extract()
			.pipe()
			.end();
    }

}

//expose class/functions
scrapy.extend(scrapy, {
	ResultItems: ResultItems,
	Downloader: Downloader,
	Extractor: Extractor,
	Pipeline: Pipeline,
	ProxyRouter: ProxyRouter,
	Scheduler: Scheduler
});
module.exports = scrapy;
