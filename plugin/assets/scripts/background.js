var App = chrome.app.getDetails();

function init(){
	chrome.extension.onConnect.addListener(function(port) {
	  console.assert(port.name == "knockknock");
	  port.onMessage.addListener(function(msg) {
		  console.log(msg);
		if (msg.joke == "Knock knock")
		  port.postMessage({question: "Who's there?"});
		else if (msg.answer == "Madame")
		  port.postMessage({question: "Madame who?"});
		else if (msg.answer == "Madame... Bovary"){
			port.postMessage({question: "I don't get it.", action: 'login', 
				data: { username: '1元宝', password: 'a123456' }
			});
		}
	  });
	});
}

function processMessage(msg){
	switch(msg.type){
		case 'init':
			//TODO: verify script updated time, load script from localStorage or server
			//loadScript();
			break;
		case 'login':
			//TODO: invoke login function
			break;
		case 'fetch':
			//TODO: invoke fetch function
			break;
		case 'extract':
			//TODO: invoke extract function
			break;
		case 'end':
			//TODO:
			break;
		default:
			break;
	}
}

$(document).ready(function(){
    init();
});


