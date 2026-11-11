'use strict';
const Search={
 normalize(mode,value){let q=String(value||'').normalize('NFKC').replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/\s+/g,' ').trim().slice(0,500);if(mode==='user')q=q.replace(/^@/,'');if(mode==='phone'){const n=q.replace(/[^\d+]/g,'');if(n)q=n}if(mode==='email'){const i=q.lastIndexOf('@');if(i>0)q=q.slice(0,i)+'@'+q.slice(i+1).toLowerCase()}if(mode==='net'){try{q=new URL(q.includes('://')?q:'https://'+q).hostname.toLowerCase()}catch{}}return q},
 safeURL(value){try{return ['https:','http:'].includes(new URL(value).protocol)}catch{return false}},
 key(value){try{const u=new URL(value);u.hash='';for(const k of [...u.searchParams.keys()])if(k.startsWith('utm_')||['fbclid','gclid'].includes(k))u.searchParams.delete(k);u.searchParams.sort();return u.hostname.replace(/^www\./,'')+u.pathname.replace(/\/$/,'')+u.search}catch{return value}},
 rank(items,query){const seen=new Map,q=query.toLocaleLowerCase(),tokens=q.split(/\s+/).filter(Boolean);for(const x of items){if(!this.safeURL(x.u))continue;const key=this.key(x.u),text=(x.t+' '+(x.c||'')).toLocaleLowerCase(),score=(text.includes(q)?20:0)+tokens.filter(t=>text.includes(t)).length*3+(new URL(x.u).protocol==='https:'?1:0);if(!seen.has(key)||seen.get(key).score<score)seen.set(key,{...x,score})}return [...seen.values()].sort((a,b)=>b.score-a.score).map(({score,...x})=>x)}
};
if(typeof module!=='undefined')module.exports=Search;
let catalogPromise;
async function openSourceCatalog(mode,value,jobId){
 const d=document.querySelector('#source-dialog'),filter=document.querySelector('#source-filter'),list=document.querySelector('#source-list');
 const q=Search.normalize(mode,value);document.querySelector('#source-query').textContent='Запрос: '+q;filter.value='';let page=0;
 d.showModal();list.textContent='Загрузка источников…';document.querySelector('#source-close').onclick=()=>d.close();
 try{
 catalogPromise??=fetch('/sources.json').then(r=>{if(!r.ok)throw Error();return r.json()}).catch(e=>{catalogPromise=null;throw e});
 const {sources}=await catalogPromise;let reports=new Map,reportState='';
 if(jobId){try{const report=await SearchJobs.request('/api/search/report?id='+encodeURIComponent(jobId));reports=new Map(report.sources.map(x=>[x.host,x]));reportState=report.state;document.querySelector('#source-query').textContent=`Запрос: ${q} · обработано ${report.completed}/${report.total} · ошибок ${report.counts.errors}`}
 catch{document.querySelector('#source-query').textContent='Отчёт истёк или сервер перезапущен. Запустите поиск заново.'}}
 function render(){const term=filter.value.toLocaleLowerCase(),rows=sources.filter(x=>(x.name+' '+x.host).toLocaleLowerCase().includes(term));page=Math.max(0,Math.min(page,Math.ceil(rows.length/20)-1));list.replaceChildren();
 for(const x of rows.slice(page*20,page*20+20)){const a=document.createElement('a'),r=reports.get(x.host);a.textContent=x.name+' · '+(r?(r.status==='error'?'ошибка: '+r.message:r.count?'найдено: '+r.count:'совпадений нет'):(jobId?(reportState==='running'?'ожидает ответа':'не проверен'):'автоматический поиск'))+' · '+(x.kind==='wiki'?'прямой API':'поисковый индекс');a.href='https://'+x.host;a.target='_blank';a.rel='noopener noreferrer';list.append(a)}
 document.querySelector('#source-page').textContent=`${rows.length} ресурсов · ${page+1}/${Math.max(1,Math.ceil(rows.length/20))}`;document.querySelector('#source-prev').disabled=page===0;document.querySelector('#source-next').disabled=(page+1)*20>=rows.length}
 filter.oninput=()=>{page=0;render()};document.querySelector('#source-prev').onclick=()=>{page--;render()};document.querySelector('#source-next').onclick=()=>{page++;render()};render();
 }catch{list.textContent='Не удалось загрузить источники. Повторите попытку.'}
}

const SearchJobs={
 async request(url,options={}){
  const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),20000);
  try{const r=await fetch(url,{credentials:'same-origin',...options,signal:abort.signal});const j=await r.json();if(!r.ok)throw Error(j.error||'Ошибка сервера поиска');return j}finally{clearTimeout(timer)}
 },
 async cancel(control){
  control.cancelled=true;
  if(control.jobId)await this.request('/api/search/cancel',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:control.jobId})});
 },
 async run(mode,query,notify,control){
  if(control.cancelled)return null;
  let snapshot=await this.request('/api/search/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode,query})});
  control.jobId=snapshot.id;
  if(control.cancelled)await this.cancel(control);
  let failures=0,lastVersion='';
  for(;;){
   const version=[snapshot.cursor,snapshot.source_cursor,snapshot.state].join(':');
   if(version!==lastVersion){notify(snapshot);lastVersion=version;}
   if(snapshot.done)return snapshot;
   if(control.cancelled)await this.cancel(control);
   await new Promise(resolve=>setTimeout(resolve,1500));
   try{snapshot=await this.request('/api/search/status?id='+encodeURIComponent(control.jobId)+'&cursor='+snapshot.cursor+'&source_cursor='+snapshot.source_cursor);failures=0}
   catch(error){if(++failures>=5)throw error;await new Promise(resolve=>setTimeout(resolve,failures*1000));continue}
  }
 },
 async download(jobId){
  const report=await this.request('/api/search/report?id='+encodeURIComponent(jobId));
  const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));
  const a=document.createElement('a');a.href=url;a.download='pikograph-search-report.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);
 }
};

if(typeof module!=='undefined')module.exports.SearchJobs=SearchJobs;
