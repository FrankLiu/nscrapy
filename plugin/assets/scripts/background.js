// chrome.tabs.getSelected(null, function(tab) {
  // chrome.tabs.sendRequest(tab.id, {greeting: "hello"}, function(response) {
    // console.log(response.farewell);
  // });
// });
var DatagAgent = DatagAgent || {};

//AJAX
DatagAgent.getUrlContent = function(url, errorMessage){
	var content = null;

	// Try to get the content
	try{
		var request = new XMLHttpRequest();
		
		request.ontimeout = function(){
			content = errorMessage;
		};

		request.open("get", url, false);
		request.send(null);

		content = request.responseText;
	}catch(exception){
		content = errorMessage;
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

//localStorage
DatagAgent.Storage = DatagAgent.Storage || {};

DatagAgent.Storage.setItem = function(item, value){
	chrome.localStorage.setItem(item, value);
};
DatagAgent.Storage.getItem = function(item){
	chrome.localStorage.getItem(item);
};

chrome.extension.onConnect.addListener(function(port) {
  console.assert(port.name == "knockknock");
  port.onMessage.addListener(function(msg) {
    if (msg.joke == "Knock knock")
      port.postMessage({question: "Who's there?"});
    else if (msg.answer == "Madame")
      port.postMessage({question: "Madame who?"});
    else if (msg.answer == "Madame... Bovary")
      port.postMessage({question: "I don't get it."});
  });
});