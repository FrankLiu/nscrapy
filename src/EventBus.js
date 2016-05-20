import { EventEmitter } from 'events';

let eventBusMap = new Map();

export default class EventBus extends EventEmitter{
	constructor(name){
		super();
		this.name = name;
	}
	
	static getInstance(name = 'default'){
		 if(!eventBusMap.has(name)){
			 eventBusMap[name] = new EventBus(name);
		 }
		 return eventBusMap[name];
	}
	
	static getAll(){
		return eventBusMap;
	}
	
	publish(event){
		this.emit(event);
	}
	
	subscribe(event, fn){
		this.on(event, fn);
	}
	
	unsubscribe(event, fn){
		this.removeListener(event, fn);
	}
}

