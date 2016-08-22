var App = chrome.app.getDetails();
var hostname = window.location.hostname || '192.168.4.158';

function init(){
	var has_had_focus = false;
        var pipe = function(el_name, send) {
            var div  = $(el_name + ' div');
            var inp  = $(el_name + ' input');
            var form = $(el_name + ' form');

            var print = function(m, p) {
                p = (p === undefined) ? '' : JSON.stringify(p);
                div.append($("<code>").text(m + ' ' + p));
                div.scrollTop(div.scrollTop() + 10000);
            };

            if (send) {
                form.submit(function() {
                    send(inp.val());
                    inp.val('');
                    return false;
                });
            }
            return print;
        };

      // Stomp.js boilerplate
      if (location.search == '?ws') {
          var ws = new WebSocket('ws://' + hostname + ':15674/ws');
      } else {
          var ws = new SockJS('http://' + hostname + ':15674/stomp');
      }
      var client = Stomp.over(ws);

      client.debug = pipe('#second');

      var print_first = pipe('#first', function(data) {
          client.send('/topic/test', {"content-type":"text/plain"}, data);
      });
      var on_connect = function(x) {
          id = client.subscribe("/topic/test", function(d) {
               print_first(d.body);
          });
      };
      var on_error =  function() {
        console.log('error');
      };
      client.connect('guest', 'guest', on_connect, on_error, '/');

      $('#first input').focus(function() {
          if (!has_had_focus) {
              has_had_focus = true;
              $(this).val("");
          }
      });
	  
	chrome.extension.onConnect.addListener(function(port) {
	  console.assert(port.name === "knockknock");
	  port.onMessage.addListener(function(msg) {
		console.log(JSON.stringify(msg));
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


