'use strict';

require('../src/es5_polyfill');
import test from 'ava';

function Person(){
	if(arguments.length > 2){
		throw new Error('Two arguments only can be allowed!');
	}
	this.nickName = arguments[0];
	this.age = arguments[1];
}
Person.prototype.showInfo = function(){
	return 'Hi, my name is ' + this.nickName + ', i am ' + this.age + ' years old!';
}

function Child(myName, myAge){
	this.$super(myName, myAge);
}
Child.prototype = new Person();
var child = new Child('Jame', 8);
console.log(child.showInfo());
