var DatagAgent = DatagAgent || {};

//common functions
DatagAgent.injectScript = function injectScript(tabId, script, runAt){
	chrome.tabs.executeScript(tabId, {file: script, runAt: runAt});
};
DatagAgent.injectScripts = function injectScript(tabId, scripts, runAt){
	for(var script in scripts){
		chrome.tabs.executeScript(tabId, {file: script, runAt: runAt});
	}
};
DatagAgent.injectCode = function injectCode(tabId, codeExpr, runAt){
	chrome.tabs.executeScript(tabId, { code: codeExpr, runAt: runAt});
};
DatagAgent.inject = function inject(tabId, codeOrScript, runAt){
	runAt = runAt || 'document_end'
	if(_.isString(codeOrScript) && codeOrScript.indexOf('.js') > 0){
		DatagAgent.injectScript(tab.id, codeOrScript, runAt);
	}
	else{
		DatagAgent.injectCode(tab.id, codeOrScript+';', runAt);
	}
};
DatagAgent.createTab = function createTab(opts, codeOrScript){
	opts = _.extend(opts, {index: 0, selected: true, pinned: false});
	chrome.tabs.create(opts, function(tab){
		DatagAgent.injectScripts(tab.id, [
			'assets/libs/jquery-1.11.3.min.js',
			'assets/libs/underscore.min.js',
			'assets/libs/moment.min.js',
			'assets/libs/jsencrypt.min.js'
			], 'document_start');
		DatagAgent.inject(tab.id, codeOrScript, 'document_end');
	});
};

//AJAX
DatagAgent.ajax = function(url, opts, callback){
	opts = opts || {};
	var async = opts.async || _.isFunction(callback);
	var method = opts.method || 'get';
	var data = opts.data || null;
	
	// Try to get the content
	var content = null;
	try{
		var xhr = new XMLHttpRequest();
		
		xhr.ontimeout = function(){
			content = opts.errorMessage || "request timeout!";
		};
		xhr.onreadystatechange = function(){
			if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
				content = xhr.responseText;
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
DatagAgent.get = function(url, opts, callback){
	opts = _.extend(opts, {method: 'get'});
	return DatagAgent.ajax(url, opts, callback);
};
DatagAgent.post = function(url, opts, callback){
	opts = _.extend(opts, {method: 'post'});
	return DatagAgent.ajax(url, opts, callback);
}

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


