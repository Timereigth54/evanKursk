import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { mkdirSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = process.env.DATA_DIR || path.join(root, 'data');
mkdirSync(dataDir, { recursive: true });
const db = new DatabaseSync(path.join(dataDir, 'prayer.sqlite'));
db.exec(`PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS activity (
 site TEXT PRIMARY KEY, prayer TEXT NOT NULL, visit TEXT NOT NULL,
 visit_date TEXT NOT NULL, updated TEXT NOT NULL);
 CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY, site TEXT, previous TEXT, next TEXT, updated TEXT);`);
const password = process.env.LEADER_PASSWORD;
if (!password || password.length < 16) throw new Error('Set LEADER_PASSWORD to a unique password of at least 16 characters.');
const salt = randomBytes(32);
const passwordHash = scryptSync(password, salt, 32);
const sessions = new Map();
const attempts = new Map();
const secure = process.env.NODE_ENV === 'production';
const validSites = new Set(['ksu','swsu','ksmu','ksaa','fin'].flatMap((u,i)=>[
 `${u}-campus`, ...Array.from({length:[3,4,6,5,0][i]},(_,j)=>`${u}-d${j+1}`),
 ...({ksu:['c1','c2'],swsu:['c5'],ksmu:['c2','c3'],ksaa:['c4'],fin:['c1']}[u]).map(c=>`${u}-${c}`)
]));
const getSession = req => {
 const token = /(?:^|;\s*)leader=([a-f0-9]+)/.exec(req.headers.cookie || '')?.[1];
 const session = sessions.get(token);
 if (!session || session < Date.now()) { sessions.delete(token); return null; }
 return token;
};
async function body(req) {
 let raw = '';
 for await (const chunk of req) { raw += chunk; if (raw.length > 4096) throw new Error('Request too large'); }
 return JSON.parse(raw);
}
const server = http.createServer(async (req,res)=>{
 const url = new URL(req.url, 'http://localhost');
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','no-referrer');
 res.setHeader('X-Frame-Options','DENY');
 res.setHeader('Cache-Control','no-store');
 res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://unpkg.com; img-src 'self' data: blob: https://*.arcgisonline.com https://unpkg.com; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'");
 const send = (code,data)=>{res.writeHead(code,{'Content-Type':'application/json'});res.end(JSON.stringify(data));};
 try {
  if (req.method === 'GET' && ['/','/index.html','/Kursk-explorer.html','/tracker.js','/locations.js','/launch.css'].includes(url.pathname)) {
   const file = ['/tracker.js','/locations.js','/launch.css'].includes(url.pathname) ? url.pathname.slice(1) : 'Kursk-explorer.html';
   res.writeHead(200,{'Content-Type':file.endsWith('.js')?'text/javascript; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8'});
   return res.end(await readFile(path.join(root,file)));
  }
  if (req.method === 'GET' && url.pathname === '/api/activity') return send(200,db.prepare('SELECT * FROM activity').all());
  if (req.method === 'GET' && url.pathname === '/api/session') return send(200,{leader:!!getSession(req)});
  if (!['POST','PUT'].includes(req.method)) return send(404,{error:'Not found'});
  // Browser mutations must come from the page's origin; no CORS is enabled.
  const expectedOrigin = process.env.PUBLIC_ORIGIN || `${secure?'https':'http'}://${req.headers.host}`;
  if (req.headers.origin !== expectedOrigin || req.headers['content-type']?.split(';')[0] !== 'application/json') return send(403,{error:'Invalid request origin or content type'});
  if (url.pathname === '/api/login' && req.method === 'POST') {
   const ip = req.socket.remoteAddress;
   const now = Date.now();
   for (const [key,value] of attempts) if(value.until < now) attempts.delete(key);
   const attempt = attempts.get(ip) || {count:0,until:now+15*60*1000};
   if (attempt.count >= 10) return send(429,{error:'Too many attempts. Try again in 15 minutes.'});
   attempt.count++; attempts.set(ip,attempt);
   const input = await body(req);
   if(typeof input.password !== 'string' || !timingSafeEqual(scryptSync(input.password,salt,32),passwordHash)) return send(401,{error:'Incorrect leader password'});
   attempts.delete(ip);
   for (const [key,value] of sessions) if(value < now) sessions.delete(key);
   const token = randomBytes(32).toString('hex'); sessions.set(token,now+8*60*60*1000);
   res.setHeader('Set-Cookie',`leader=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800${secure?'; Secure':''}`);
   return send(200,{leader:true});
  }
  if (!getSession(req)) return send(401,{error:'Leader sign-in required'});
  if (url.pathname === '/api/logout' && req.method === 'POST') {
   sessions.delete(getSession(req));
   res.setHeader('Set-Cookie',`leader=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0${secure?'; Secure':''}`);
   return send(200,{leader:false});
  }
  if (url.pathname === '/api/activity' && req.method === 'PUT') {
   const d = await body(req);
   if (!validSites.has(d.site) || !['none','current','completed'].includes(d.prayer) || !['none','planned','completed'].includes(d.visit) || typeof d.visit_date !== 'string' || (d.visit_date !== '' && (!/^\d{4}-\d{2}-\d{2}$/.test(d.visit_date) || new Date(d.visit_date+'T00:00:00Z').toISOString().slice(0,10) !== d.visit_date))) return send(400,{error:'Invalid location, status, or date'});
   if (d.visit === 'planned' && !d.visit_date) return send(400,{error:'Choose a planned visit date'});
   const previous = db.prepare('SELECT * FROM activity WHERE site=?').get(d.site) || null;
   if ((previous?.updated || '') !== d.expected_updated) return send(409,{error:'Another leader updated this location. Refresh and try again.'});
   const updated = new Date().toISOString();
   db.exec('BEGIN');
   try {
    db.prepare('INSERT INTO activity VALUES (?,?,?,?,?) ON CONFLICT(site) DO UPDATE SET prayer=excluded.prayer,visit=excluded.visit,visit_date=excluded.visit_date,updated=excluded.updated').run(d.site,d.prayer,d.visit,d.visit_date,updated);
    db.prepare('INSERT INTO audit(site,previous,next,updated) VALUES (?,?,?,?)').run(d.site,JSON.stringify(previous),JSON.stringify(d),updated);
    db.exec('COMMIT');
   } catch(error) {db.exec('ROLLBACK');throw error;}
   return send(200,{updated});
  }
  return send(404,{error:'Not found'});
 } catch(error) { console.error(error.message); return send(400,{error:'Request could not be processed'}); }
});
server.listen(Number(process.env.PORT || 3000),process.env.HOST || '127.0.0.1',()=>console.log('Prayer map listening on port '+(process.env.PORT || 3000)));
