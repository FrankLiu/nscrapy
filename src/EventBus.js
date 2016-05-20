'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.WebSocketEventBus = exports.EventBus = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//缓存所有的EventBus实例
var eventBusMap = new Map();

//事件总线

var EventBus = exports.EventBus = function (_EventEmitter) {
	_inherits(EventBus, _EventEmitter);

	function EventBus(name) {
		_classCallCheck(this, EventBus);

		var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EventBus).call(this));

		_this.__name__ = name;
		return _this;
	}

	_createClass(EventBus, [{
		key: 'publish',


		//发布事件
		value: function publish(event) {
			this.emit(event);
		}

		//订阅事件

	}, {
		key: 'subscribe',
		value: function subscribe(event, callback) {
			this.on(event, callback);
		}
	}, {
		key: 'unsubscribe',
		value: function unsubscribe(event, callback) {
			this.remove(event, callback);
		}
	}], [{
		key: 'getInstance',
		value: function getInstance(name) {
			if (!eventBusMap.has(name)) {
				eventBusMap[name] = new EventBus(name);
			}
			return eventBusMap[name];
		}
	}, {
		key: 'getDefault',
		value: function getDefault() {
			return EventBus.getInstance('default');
		}

		//返回所有事件总线的实例

	}, {
		key: 'getEventBuses',
		value: function getEventBuses() {
			return eventBusMap;
		}
	}]);

	return EventBus;
}(_events2.default);

//基于websocket通信机制的事件总线


var WebSocketEventBus = exports.WebSocketEventBus = function (_EventBus) {
	_inherits(WebSocketEventBus, _EventBus);

	function WebSocketEventBus(name) {
		_classCallCheck(this, WebSocketEventBus);

		return _possibleConstructorReturn(this, Object.getPrototypeOf(WebSocketEventBus).call(this, name));
	}

	//发布网络事件


	_createClass(WebSocketEventBus, [{
		key: 'publish',
		value: function publish(event) {}

		//监听网络事件

	}, {
		key: 'subscribe',
		value: function subscribe(event, callback) {}
	}]);

	return WebSocketEventBus;
}(EventBus);