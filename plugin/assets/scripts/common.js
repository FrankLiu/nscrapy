var DatagAgent = DatagAgent || {};

//common functions
DatagAgent.injectScript = function injectScript(tabId, script){
	chrome.tabs.executeScript(tabId, {file: script});
};
DatagAgent.injectCode = function injectCode(tabId, codeExpr){
	chrome.tabs.executeScript(tabId, { code: codeExpr });
};

DatagAgent.createTab = function createTab(opts, injectedScript){
	opts = _.extend(opts, {index: 0, selected: true, pinned: false});
	chrome.tabs.create(opts, function(tab){
		DatagAgent.injectScript(tab.id, 'assets/libs/jquery-1.11.3.min.js');
		DatagAgent.injectScript(tab.id, 'assets/libs/underscore.min.js');
		DatagAgent.injectScript(tab.id, 'assets/libs/moment.min.js');
		DatagAgent.injectScript(tab.id, 'assets/libs/jsencrypt.min.js');
		if(injectedScript.indexOf('.js') > 0){
			DatagAgent.injectScript(tab.id, injectedScript);
		}
		else{
			DatagAgent.injectCode(tab.id, injectedScript);
		}
	});
};

//AJAX
DatagAgent.getUrlContent = function(url, opts, callback){
	opts = opts || {};
	var async = opts.async || _.isFunction(callback);
	var method = opts.method || 'get';
	var data = opts.data || null;
	
	// Try to get the content
	var content = null;
	try{
		var request = new XMLHttpRequest();
		
		request.ontimeout = function(){
			content = opts.errorMessage || "Ajax failed!";
		};
		request.onreadystatechange = function(){
			if (this.readyState == XMLHttpRequest.DONE) {
				content = this.responseText;
				if(opts.parse){ content = JSON.parse(content.replace(/[\r\n\t]+/g, " ")); }
				if(async){
					callback(content);
				}
			}
		}
		
		request.open(method, url, (async ? true: false));
		request.send(data);
	}
	catch(exception){
		content = opts.errorMessage || exception.toString();
	}

	return content;
};

//Cookies
DatagAgent.Cookies = DatagAgent.Cookies || {};
DatagAgent.Cookies.getCookies = function(url, domain, callback){
	chrome.cookies.getAll({url: url, domain: domain}, function(cookies){
		if(callback) callback(cookies);
	})
};
DatagAgent.Cookies.getCookie = function(url, name, callback){
	chrome.cookies.get({url: url, name: name}, function(cookie){
		if(callback) callback(cookie);
	})
};
DatagAgent.Cookies.removeCookies = function removeCookies(domainOrName){
	chrome.cookies.getAll({}, function(cookies){
		for(i=0; i<cookies.length;i++) {
			if(cookies[i].name === domainOrName || cookies[i].domain === domainOrName){
				var url = "http" + (cookies[i].secure ? "s" : "") + "://" + cookies[i].domain + cookies[i].path;
				DatagAgent.Cookies.removeCookie(url, cookies[i].name);
			}
		}
	});
};
DatagAgent.Cookies.removeCookie = function removeCookie(url, name){
	chrome.cookies.remove({"url": url, "name": name});
};

//localStorage
DatagAgent.Storage = DatagAgent.Storage || {};
DatagAgent.Storage.setItem = function(item, value){
	window.localStorage.setItem(item, value);
};
DatagAgent.Storage.getItem = function(item){
	return window.localStorage.getItem(item);
};
DatagAgent.Storage.removeItem = function(item){
	window.localStorage.removeItem(item);
};


