/* Shared activity is served publicly; every update is authorized by the server. */
let activity = new Map(), isLeader = false;
const labels = {none:'Not started',current:'Current prayer',completed:'Completed prayer'};
const visits = {none:'No visit scheduled',planned:'Planned visit',completed:'Completed visit'};
const tracking = document.createElement('section');
tracking.id = 'tracking';
tracking.innerHTML = `<div class="section-heading"><h2>Prayer & visits</h2><span id="accessBadge" class="access-badge">Public view</span></div>
 <p class="intro">Pray with purpose. Plan the next step.</p>
 <div id="metrics" class="metrics"></div>
 <label for="activityFilter">Show activity</label><select id="activityFilter"><option value="all">All activity</option><option value="current">Current prayer</option><option value="prayed">Completed prayer</option><option value="planned">Planned visits</option><option value="visited">Completed visits</option></select>
 <p id="syncStatus" role="status" aria-live="polite">Connecting to shared tracking…</p>
 <div id="activityList" class="activity-list"></div>
 <form id="loginForm"><label for="leaderPassword">Leader password</label><div class="login-row"><input id="leaderPassword" type="password" autocomplete="current-password" required maxlength="256"><button>Sign in</button></div></form>
 <button id="logout" hidden>Sign out</button>
 <form id="activityForm" hidden><h3>Update a location</h3><label for="activitySite">Location</label><select id="activitySite"></select>
 <label for="prayerState">Prayer</label><select id="prayerState"><option value="none">Not started</option><option value="current">Current prayer</option><option value="completed">Completed prayer</option></select>
 <label for="visitState">Visit</label><select id="visitState"><option value="none">No visit scheduled</option><option value="planned">Planned visit</option><option value="completed">Completed visit</option></select>
 <label for="visitDate">Visit date</label><input id="visitDate" type="date"><button class="primary" id="saveActivity">Save update</button></form>`;
document.querySelector('header').after(tracking);
const escapeText = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(url, method='GET', data) {
 const response = await fetch(url,{method,headers:data?{'Content-Type':'application/json'}:{},body:data?JSON.stringify(data):undefined});
 const value = await response.json();
 if(!response.ok) throw new Error(value.error || 'Unable to connect');
 return value;
}
function updateAccess() {
 $('loginForm').hidden=isLeader; $('activityForm').hidden=!isLeader; $('logout').hidden=!isLeader;
 $('accessBadge').textContent=isLeader?'Leader access':'Public view';
}
function loadEditor() {
 const record=activity.get($('activitySite').value);
 $('prayerState').value=record?.prayer || 'none'; $('visitState').value=record?.visit || 'none'; $('visitDate').value=record?.visit_date || '';
 $('activityForm').dataset.version=record?.updated || '';
}
function renderActivity() {
 const records=scopeRecords();
 const counts=[['Current prayer','current','prayer'],['Completed prayer','completed','prayer'],['Planned visits','planned','visit'],['Completed visits','completed','visit']];
 $('metrics').innerHTML=counts.map(([label,value,key],i)=>`<div class="metric metric-${i}"><strong>${records.filter(r=>activity.get(r.id)?.[key]===value).length}</strong><span>${label}</span></div>`).join('');
 const filter=$('activityFilter').value;
 const matches=records.filter(r=>{const a=activity.get(r.id); return filter==='all' || (filter==='current'&&a?.prayer==='current') || (filter==='prayed'&&a?.prayer==='completed') || (filter==='planned'&&a?.visit==='planned') || (filter==='visited'&&a?.visit==='completed');});
 $('activityList').innerHTML=matches.map(r=>{const a=activity.get(r.id);return `<button class="activity-card" data-site="${r.id}"><strong>${escapeText(r.name)}</strong>${!r.mapChecked?'<small>Not mapped · location needs verification</small>':''}<span class="activity-tags"><span class="prayer-${a?.prayer || 'none'}">${labels[a?.prayer || 'none']}</span><span>${visits[a?.visit || 'none']}${a?.visit_date?' · '+escapeText(a.visit_date):''}</span></span>${a?.updated?`<small>Updated ${escapeText(new Date(a.updated).toLocaleString())}</small>`:''}</button>`;}).join('') || '<p>No locations match this activity filter.</p>';
 $('activityList').querySelectorAll('button').forEach(button=>button.onclick=()=>{focusSite(button.dataset.site);$('activitySite').value=button.dataset.site;loadEditor();if(byId(button.dataset.site)?.mapChecked && innerWidth<=820 && !isLeader && !panel.classList.contains('hidden'))toggleBtn.click();});
}
// Keep existing geographic filters connected to the shared activity dashboard.
const originalRender=render;
render=function(){originalRender();renderActivity();};
const originalPopup=popup;
popup=function(r){const a=activity.get(r.id);return `<div class="popup-activity"><b>${labels[a?.prayer || 'none']}</b><br>${visits[a?.visit || 'none']}${a?.visit_date?' · '+escapeText(a.visit_date):''}</div>`+originalPopup(r);};
const originalPin=pin;
pin=function(pos,html,color,dim,unverified,type,offset){
 const r=RECORDS.find(r=>r.pos===pos); const a=r&&activity.get(r.id);
 return originalPin(pos,html,a?.prayer==='current'?'#7c3aed':a?.prayer==='completed'?'#059669':color,dim,unverified,type,offset);
};
fill('activitySite',RECORDS.map(r=>({v:r.id,t:r.name})),RECORDS[0].id);
$('activitySite').onchange=loadEditor;
$('activityFilter').onchange=renderActivity;
$('loginForm').onsubmit=async e=>{e.preventDefault();try{await api('/api/login','POST',{password:$('leaderPassword').value});isLeader=true;$('leaderPassword').value='';updateAccess();loadEditor();$('syncStatus').textContent='Signed in. Updates are shared with everyone.';}catch(err){$('syncStatus').textContent=err.message;}};
$('logout').onclick=async()=>{try{await api('/api/logout','POST',{});isLeader=false;updateAccess();$('syncStatus').textContent='Signed out. Public view is active.';}catch(err){$('syncStatus').textContent=err.message;}};
$('activityForm').onsubmit=async e=>{
 e.preventDefault(); $('saveActivity').disabled=true;
 try{
  await api('/api/activity','PUT',{site:$('activitySite').value,prayer:$('prayerState').value,visit:$('visitState').value,visit_date:$('visitDate').value,expected_updated:$('activityForm').dataset.version});
  await sync();loadEditor();
 }catch(err){$('syncStatus').textContent=err.message;}
 finally{$('saveActivity').disabled=false;}
};
async function sync(){
 try {
  const [rows,session]=await Promise.all([api('/api/activity'),api('/api/session')]);
  activity=new Map(rows.map(a=>[a.site,a]));isLeader=session.leader;updateAccess();render();
  $('syncStatus').textContent='Live shared tracking · checked '+new Date().toLocaleTimeString();
 }catch(err){$('syncStatus').textContent='Shared tracking unavailable. Displayed statuses may be out of date. '+err.message;}
}
loadEditor();renderActivity();sync();setInterval(sync,30000);
