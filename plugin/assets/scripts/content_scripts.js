// chrome.extension.sendRequest({greeting: "hello"}, function(response) {
  // console.log(response.farewell);
// });

// chrome.extension.onRequest.addListener(
   // function(request, sender, sendResponse) {
    // console.log(sender.tab ?
                // "from a content script:" + sender.tab.url :
                // "from the extension");
    // if (request.greeting == "hello")
      // sendResponse({farewell: "goodbye"});
    // else
      // sendResponse({}); // snub them.
// });
var port = chrome.extension.connect({name: "knockknock"});
port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function(msg) {
	console.log(JSON.stringify(msg));
	if (msg.question == "Who's there?")
		port.postMessage({answer: "Madame"});
	else if (msg.question == "Madame who?")
		port.postMessage({answer: "Madame... Bovary"});
	else if(msg.action == 'login'){
		$('#loginname').val(msg.data.username);
		$('#nloginpwd').val(msg.data.password);
		$('div.login-btn').click();
	}
});

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
