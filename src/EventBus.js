import EventEmitter from 'events';

//缓存所有的EventBus实例
var eventBusMap = new Map();

//事件总线
export class EventBus extends EventEmitter{
	constructor(name){
		super();
		this.__name__ = name;
	}
	
	static getInstance(name){
		if(!eventBusMap.has(name)){
			eventBusMap[name] = new EventBus(name);
		}
		return eventBusMap[name];
	}
	
	static getDefault(){
		return EventBus.getInstance('default');
	}
	
	//返回所有事件总线的实例
	static getEventBuses(){
		return eventBusMap;
	}
	
	//发布事件
	publish(event){
		this.emit(event);
	}
	
	//订阅事件
	subscribe(event, callback){
		this.on(event, callback);
	}
	
	unsubscriber(event, callback){
		this.remove(event, callback);
	}
}

//基于websocket通信机制的事件总线
export class WebSocketEventBus extends EventBus{
	constructor(name){
		super(name);
	}
	
	//发布网络事件
	publish(event){
		
	}
	
	//监听网络事件
	subscribe(event, callback){
		
	}
}