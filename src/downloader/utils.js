import os from 'os';
import path from 'path';

let getTmpDir = os.tmpdir || os.tmpDir;

function randomString(size = 6, chars = 'abcdefghijklmnopqrstuvwxyz0123456789'){
	let max = chars.length + 1;
	let str = '';
	while(size > 0){
		str += chars.charAt(Math.floor(Math.random()*max));
		size--;
	}
	return str;
}

export function randomFilename(tmpDir = getTmpDir()){
	return path.resolve(tmpDir, randomString(20));
}

export function isURL(url){
	if(url.substring(0,7) === 'http://') return true;
	if(url.substring(0,8) === 'file:///') return true;
	return false;
}

export function noop(){ };