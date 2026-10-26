import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';

test('HTML boots the map without a separate location asset and handles unmapped filters',async()=>{
 const html=await readFile('Kursk-explorer.html','utf8');
 const elements=new Map(), markers=[];
 const element=id=>{
  if(!elements.has(id))elements.set(id,{value:'',innerHTML:'',textContent:'',style:{},classList:{toggle(){},contains(){return false;}},setAttribute(){}});
  return elements.get(id);
 };
 const layer=()=>({addTo(){return this;},clearLayers(){},bindPopup(){return this;},bindTooltip(){return this;}});
 const map={...layer(),setView(){return this;},fitBounds(){},getZoom(){return 13;},on(){},getContainer(){return element('map');}};
 const control=Object.assign(()=>layer(),{zoom:()=>layer(),scale:()=>layer()});
 const context=vm.createContext({document:{getElementById:element,querySelectorAll(){return [];}},L:{map:()=>map,control,tileLayer:()=>layer(),layerGroup:layer,latLngBounds:()=>({pad(){return this;}}),divIcon:()=>({}),marker(pos){assert.ok(pos,'A marker needs a real coordinate');markers.push(pos);return layer();}},setTimeout(){}});
 context.window=context;
 for(const [,script] of html.matchAll(/<script>([\s\S]*?)<\/script>/g))vm.runInContext(script,context);
 assert.equal(markers.length,9,'Five campuses and four malls should display at startup');
 assert.ok(element('fUni').innerHTML.includes('All universities'));
 element('fKind').onchange({target:{value:'dorm'}});
 assert.match(element('dataExplanation').innerHTML,/12 planning estimates/);
 assert.match(element('big').textContent,/^~/);
 element('fit').onclick();
 assert.match(element('tierInfo').textContent,/No map-checked locations/);
 vm.runInContext('showEnrollment()',context);
 assert.equal(element('big').textContent,'33,647');
 assert.equal(element('dataExplanation').hidden,true);
 assert.equal(element('fKind').value,'campus');
 assert.ok(html.includes('href="./launch.css"'));
 assert.ok(!html.includes('src="/locations.js"'));
});
