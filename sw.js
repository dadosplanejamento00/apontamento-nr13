// Guarda o app no tablet para abrir sem internet. As chamadas ao sistema (script.google.com) não passam pelo cache.
const CACHE='apontamento-nr13-v1';
const ARQ=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQ)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  // rede primeiro (pega atualizações do app), cache quando estiver sem internet
  e.respondWith(fetch(e.request).then(r=>{if(r&&r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));}return r;})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('./index.html'))));
});
