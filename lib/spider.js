/**
 * 采集核心类，基于事件机制的扩展
 */
var dgcore = require('./common').dgcore;

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
      'init'
      , 'before_login', 'login_checkcode', 'login_smscode', 'login_end'
      , 'before_fetch', 'fetch', 'extract', 'fetch_end'
      , 'before_export', 'export_one', 'export_end'
      ， 'end'
    ],

	//登录函数
	login: function(username, password){

	},

	//获取数据
	fetch: function(datasource){

	},

	//导出数据，比如导出到db/fs/net
	'export': function(target){

	},

    //开始采集任务
    start: function(){
        this.emit('init', this);
        this.login()
    }

}

dgcore.Spider = Spider;
module.exports = exports.dgcore = dgcore;
