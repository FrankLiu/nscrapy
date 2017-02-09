'use strict';

/**
 * 内容提取类，根据预配置的规则提取页面元素
 */

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var util = require('util');
var EventEmiter = require('events');
var scrapy = require('./common').scrapy;
var HtmlParser = require('./htmlparser');

var Extractor = function (_EventEmiter) {
    _inherits(Extractor, _EventEmiter);

    function Extractor(options) {
        _classCallCheck(this, Extractor);

        var _this = _possibleConstructorReturn(this, (Extractor.__proto__ || Object.getPrototypeOf(Extractor)).call(this, arguments));

        _this.options = options;
        _this.drill_rules = options.drill_rules || {};

        //runtime vars
        _this.data = {};
        return _this;
    }

    //根据规则提取页面元素


    _createClass(Extractor, [{
        key: 'extract',
        value: function extract(body) {
            if (!this.options.drill_rules) {}
        }
    }]);

    return Extractor;
}(EventEmiter);

//expose class/functions


scrapy.Extractor = Extractor;
module.exports = scrapy;