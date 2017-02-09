var extension;
var DatagAgent;

function init() {
	extension = chrome.extension.getBackgroundPage();
	App = extension.App;
	DatagAgent = extension.DatagAgent;
	loginJd();
}

function loginJd(){
	$('#loginJdBtn').click(function(evt){
		console.log(this);
		// var injectedCode = function injectedCode(){
			// $('#username').val('1Ôª±¦');
			// $('#nloginpwd').val('a123456');
			// $('#loginsubmit').click();
		// };
		var injectScript = 'assets/scripts/content_scripts.js';
		DatagAgent.createTab({url: 'https://passport.jd.com/new/login.aspx?ReturnUrl=http%3A%2F%2Fwww.jd.com%2F'}, injectScript);
	});
}

$(document).ready(function(){
	init();
});