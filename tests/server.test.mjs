import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';

test('Static HTTP server serves pages, data and 404 with correct types',async()=>{
 const server=spawn(process.execPath,['scripts/serve.mjs'],{env:{...process.env,PORT:'0'},stdio:['ignore','pipe','pipe']});
 let timeout;
 try {
  const [startup]=await Promise.race([once(server.stdout,'data'),new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Server startup timeout')),3000);})]);
  clearTimeout(timeout);
  const base=startup.toString().match(/http:\/\/localhost:\d+/)[0];
  for(const url of ['/','/araclar/','/rehber/montaj-kontrol-listesi/']) {
   const response=await fetch(base+url);
   assert.equal(response.status,200,url);
   assert.match(response.headers.get('content-type'),/text\/html/);
   assert.ok((await response.text()).includes('<main id="main">'));
  }
  const data=await fetch(base+'/site-data.json');
  assert.match(data.headers.get('content-type'),/application\/json/);
  assert.equal((await data.json()).vehicles.length,8);
  const module=await fetch(base+'/message.js');
  assert.match(module.headers.get('content-type'),/text\/javascript/);
  const missing=await fetch(base+'/missing-page/');
  assert.equal(missing.status,404);
  assert.ok((await missing.text()).includes('Sayfa bulunamadı'));
  const traversal=await fetch(base+'/%2e%2e%2fpackage.json');
  assert.equal(traversal.status,403);
 } finally {clearTimeout(timeout);server.kill();await once(server,'exit');}
});
