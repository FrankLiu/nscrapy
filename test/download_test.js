import assert from 'assert';
import path from 'path';
import fs from 'fs';
import download from '../lib/downloader';
import { randomFilename } from '../lib/downloader/utils';

let readFile = f => fs.readFileSync(f).toString();
let getFileSize = f => fs.statSync(f).size;

describe('es2015_demo', () => {
	
	it('复制本地文件成功', done => {
		
		let source = __filename;
		let target = randomFilename();
		let onProgress = false;
		
		download(source, target, (size, total) => {
			onProgress = true;
			assert.equal(size, total);
			assert.equal(total, getFileSize(source));
		})
		.then(filename => {
			console.log(`已保存到${filename}`);
			assert.equal(onProgress, true);
			assert.equal(target, filename);
			assert.equal(readFile(source), readFile(target)); 
			
			done();
		})
		.catch(err => {
			console.log(`出错：${err}`)
			throw err;
		});
	});
	
	it('下载文件成功', done => {
		
		let source = 'https://static.yuanbaopu.com/ui/ec/images/indexs/websitelog.png';
		let target = randomFilename()+'.png';
		let onProgress = false;
		
		download(source, target, (size, total) => {
			onProgress = true;
			assert.equal(size, total);
			assert.equal(total, getFileSize(source));
		})
		.then(filename => {
			console.log(`已保存到${filename}`);
			assert.equal(onProgress, true);
			assert.equal(target, filename);
			assert.equal(readFile(source), readFile(target)); 
			
			done();
		})
		.catch(err => {
			console.log(`出错：${err}`)
			throw err;
		});
	});
});
