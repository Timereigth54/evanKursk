import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {once} from 'node:events';

test('public reads, leader authorization, validation, conflicts and persistence',async()=>{
 const dir=await mkdtemp(path.join(os.tmpdir(),'prayer-map-test-'));
 const origin='http://127.0.0.1:31987';
 const password='test-only-long-leader-password';
 let child;
 async function start(){
  child=spawn(process.execPath,['server.mjs'],{env:{...process.env,LEADER_PASSWORD:password,DATA_DIR:dir,PORT:'31987',NODE_ENV:'test',PUBLIC_ORIGIN:origin},stdio:['ignore','pipe','pipe']});
  await Promise.race([once(child.stdout,'data'),once(child,'exit').then(()=>{throw new Error('Server failed to start');})]);
 }
 async function stop(){const done=once(child,'exit');child.kill();await done;}
 async function request(url,method='GET',data,cookie,customOrigin=origin){return fetch(origin+url,{method,headers:{'Content-Type':'application/json',Origin:customOrigin,...(cookie?{Cookie:cookie}:{})},body:data?JSON.stringify(data):undefined});}
 try{
  await start();
  assert.equal((await request('/')).status,200);
  assert.equal((await request('/launch.css')).headers.get('content-type'),'text/css; charset=utf-8');
  assert.deepEqual(await (await request('/api/activity')).json(),[]);
  assert.equal((await request('/api/activity','PUT',{})).status,401);
  assert.equal((await request('/api/login','POST',{password:'wrong'})).status,401);
  const login=await request('/api/login','POST',{password});assert.equal(login.status,200);
  const cookie=login.headers.get('set-cookie').split(';')[0];
  assert.equal((await (await request('/api/session','GET',null,cookie)).json()).leader,true);
  const activity={site:'ksu-campus',prayer:'current',visit:'planned',visit_date:'2026-10-27',expected_updated:''};
  assert.equal((await request('/api/activity','PUT',activity,cookie,'http://evil.example')).status,403);
  assert.equal((await request('/api/activity','PUT',{...activity,site:'unknown'},cookie)).status,400);
  assert.equal((await request('/api/activity','PUT',{...activity,visit_date:''},cookie)).status,400);
  assert.equal((await request('/api/activity','PUT',activity,cookie)).status,200);
  assert.equal((await request('/api/activity','PUT',activity,cookie)).status,409);
  const current=(await (await request('/api/activity')).json())[0];
  assert.equal(current.prayer,'current');assert.equal(current.visit,'planned');
  assert.equal((await request('/api/activity','PUT',{...activity,prayer:'completed',visit:'completed',expected_updated:current.updated},cookie)).status,200);
  assert.equal((await request('/data/prayer.sqlite')).status,404);
  await stop();await start();
  const saved=await (await request('/api/activity')).json();assert.equal(saved[0].prayer,'completed');assert.equal(saved[0].visit,'completed');
  assert.equal((await request('/api/activity','PUT',activity,cookie)).status,401);
  // Existing inline map JavaScript and tracker both parse before release.
  const html=await readFile('Kursk-explorer.html','utf8');
  for(const match of html.matchAll(/<script>([\s\S]*?)<\/script>/g))new Function(match[1]);
  new Function(await readFile('tracker.js','utf8'));
 }finally{if(child?.exitCode===null)await stop();await rm(dir,{recursive:true,force:true});}
});
