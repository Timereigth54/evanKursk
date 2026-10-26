import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

test('published figures take priority over labeled planning estimates',async()=>{
 const context=vm.createContext({window:{},document:{}});
 const html=await readFile('Kursk-explorer.html','utf8');
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
 for(const script of scripts){
  if(script.includes('const RECORDS ='))vm.runInContext(script.slice(0,script.indexOf('const map = L.map'))+';window.records=RECORDS;window.count=count;window.state=state;',context);
  else vm.runInContext(script,context);
 }
 const {POPULATION,DORM_POPULATION,records,count,state}=context.window;
 assert.equal(Object.values(POPULATION).reduce((sum,r)=>sum+r.total,0),33647);
 assert.equal(Object.values(POPULATION).reduce((sum,r)=>sum+r.foreign,0),3046);
 assert.equal(Object.values(POPULATION).reduce((sum,r)=>sum+r.fullTime,0),19645);
 assert.equal(Object.values(DORM_POPULATION).reduce((sum,r)=>sum+r.total,0),2499);
 for(const r of records){
  assert.deepEqual(Object.keys(r.countries),[],'No invented country distribution');
  assert.equal(r.russian,undefined,'No inferred ethnicity/citizenship count');
  if(r.kind==='campus')assert.ok(r.populationSource.includes('monitoring.miccedu.ru'));
  if(r.kind==='rental'||(r.kind==='dorm'&&r.uni!=='ksmu')){
   assert.equal(r.estimated,true);assert.ok(r.occ>0);assert.equal(r.populationSource,null);
  }else assert.equal(r.estimated,false);
 }
 state.kind='dorm';state.pop='all';
 assert.equal(count(records.find(r=>r.id==='ksmu-d1')),172);
 assert.equal(count(records.find(r=>r.id==='ksu-d1')),500);
 state.pop='foreign';
 assert.equal(count(records.find(r=>r.id==='ksmu-d1')),0,'Published zero stays distinct from unknown');
 assert.equal(count(records.find(r=>r.id==='ksu-d1')),91);
 for(const [id,u] of Object.entries(POPULATION)){
  const housing=records.filter(r=>r.uni===id&&r.kind!=='campus');
  assert.ok(housing.reduce((sum,r)=>sum+r.foreign,0)<=u.foreign,'Modeled international housing must fit within the dated enrollment reference');
  assert.ok(housing.every(r=>r.foreign<=r.occ));
 }
 state.pop='fulltime';
 assert.equal(count(records.find(r=>r.id==='ksu-d1')),null,'Do not invent full-time dorm counts');
});
