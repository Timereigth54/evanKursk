import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

test('only sourced building coordinates are plotted; old browser pins cannot override them',async()=>{
 const context=vm.createContext({window:{},document:{},localStorage:{getItem(){throw new Error('Legacy overrides must not load');}}});
 vm.runInContext(await readFile('locations.js','utf8'),context);
 vm.runInContext(await readFile('population.js','utf8'),context);
 const html=await readFile('Kursk-explorer.html','utf8');
 const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match=>match[1]);
 assert.ok(scripts.some(script=>script.includes('window.LOCATIONS =')),'Location data must ship inside the HTML so a missing asset cannot blank the map');
 const script=scripts.find(script=>script.includes('const RECORDS ='));
 vm.runInContext(script.slice(0,script.indexOf('const map = L.map'))+';window.records=RECORDS;window.malls=MALLS;',context);
 const {records,malls,LOCATIONS}=context.window;
 assert.equal(records.filter(r=>r.mapChecked).length,5);
 assert.equal(malls.length,4);
 for(const r of [...records.filter(r=>r.mapChecked),...malls]){
  assert.deepEqual(r.pos,LOCATIONS[r.id].pos);
  assert.ok(r.source.startsWith('https://'));
  assert.ok(r.address);
 }
 for(const r of records.filter(r=>!r.mapChecked))assert.equal(r.pos,null);
 assert.equal(records.find(r=>r.id==='ksmu-campus').pos[0],51.749094);
 assert.equal(records.find(r=>r.id==='swsu-campus').pos[1],36.148243);
});
