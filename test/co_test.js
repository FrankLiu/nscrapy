'use strict';

var EventEmitter = require('events');
var co = require('co');

co(function *(){
  // yield any promise
  var result = yield Promise.resolve(true);
}).catch(onerror);

co(function *(){
  // resolve multiple promises in parallel
  var a = Promise.resolve(1);
  var b = Promise.resolve(2);
  var c = Promise.resolve(3);
  var res = yield [a, b, c];
  console.log(res);
  // => [1, 2, 3]
}).catch(onerror);

// errors can be try/catched
co(function *(){
  try {
    yield Promise.reject(new Error('boom'));
  } catch (err) {
    console.error(err.message); // "boom"
 }
}).catch(onerror);

function onerror(err) {
  // log any uncaught errors
  // co will not throw any errors you do not handle!!!
  // HANDLE ALL YOUR ERRORS!!!
  console.error(err.stack);
}

var arr = [1, [[2, 3], 4], [5, 6]];

var flat = function* (a) {
  var length = a.length;
  for (var i = 0; i < length; i++) {
    var item = a[i];
    if (typeof item !== 'number') {
      yield* flat(item);
    } else {
      yield item;
    }
  }
};

for (var f of flat(arr)) {
  console.log(f);
}

function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
console.log(a.next()) // Object{value:6, done:false}
console.log(a.next()) // Object{value:NaN, done:false}
console.log(a.next()) // Object{value:NaN, done:true}

var b = foo(5);
console.log(b.next()) // { value:6, done:false }
console.log(b.next(12)) // { value:8, done:false }
console.log(b.next(13)) // { value:42, done:true }

class CoClass extends EventEmitter{
	constructor(){
		super();
		this.emit('init');
	}
	
	* hello(name){
		var w = yield this.world();
		var res = yield Promise.resolve('hello ' + name + ': ' + w);
		return res;
	}
	
	* world(){
		var res = yield Promise.resolve('generator');
		return res;
	}
	
	main(){
		co(this.hello('liujun')).then(function(data){
			console.log(data);
		});
	}
}

var cc = new CoClass();
cc.main();

