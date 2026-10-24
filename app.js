'use strict';
const $=q=>document.querySelector(q),uid=()=>Math.random().toString(36).slice(2,9),
esc=t=>String(t??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* хранилище с запасным вариантом (если localStorage недоступен) */
const LS=(()=>{try{localStorage.setItem('__t',1);localStorage.removeItem('__t');return localStorage}catch{const m={};return{getItem:k=>k in m?m[k]:null,setItem:(k,v)=>{m[k]=String(v)},removeItem:k=>{delete m[k]}}}})();
const ld0=(k,d)=>{try{return JSON.parse(LS.getItem(k))||d}catch{return d}},sv=(k,v)=>{try{LS.setItem(k,JSON.stringify(v))}catch{toast('Не удалось сохранить: память браузера заполнена')}};
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('o');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('o'),2800)}
addEventListener('error',e=>toast('Ошибка: '+e.message));
/* иконки */
const I=d=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const IC={person:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z"/>',acc:'<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-4 8"/>',email:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',domain:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',org:'<path d="M4 21V5l8-2v18M12 9h8v12M4 21h16M8 8h1M8 12h1M8 16h1M16 13h1M16 17h1"/>',addr:'<path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',doc:'<path d="M6 3h8l4 4v14H6zM14 3v4h4M9 13h6M9 17h6"/>',obj:'<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9zM12 12l8-4.5M12 12v9M12 12L4 7.5"/>',result:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',photo:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M3 18l6-5 4 3 3-2 5 4"/>'};
const UI={bk:'M15 5l-7 7 7 7',un:'M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3',re:'M15 14l5-5-5-5M20 9H10a6 6 0 000 12h3',zo:'M5 12h14',zi:'M12 5v14M5 12h14',mb:'M5 12h.01M12 12h.01M19 12h.01',x:'M6 6l12 12M18 6L6 18',ed:'M4 20h4L19 9l-4-4L4 16zM13 7l4 4',cp:'M9 9h11v11H9zM5 15V4h11',tr:'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13'};
for(const k of['bk','un','re','zo','zi','mb'])$('#'+k).innerHTML=I(`<path d="${UI[k]}"/>`);
/* типы карточек: [название, режим поиска по умолчанию] */
const T={person:['ФИО','name'],phone:['Телефон','phone'],acc:['Аккаунт','user'],email:['E-mail','email'],domain:['Домен','net'],org:['Организация','work'],addr:['Адрес','geo'],doc:['Документ','gen'],obj:['Объект','gen'],photo:['Фото','photo'],result:['Результаты','gen']};
/* режимы поиска (какие именно API — см. PV в блоке поиска) */
const M={name:['ФИО'],user:['Никнейм'],phone:['Телефон'],email:['E-mail'],net:['Домен / IP'],work:['Организация'],geo:['Адрес / место'],photo:['Фото'],gen:['Общий поиск']};
const FONTS=['Inter','Space Grotesk','Manrope','Syne','Unbounded','Oswald','Playfair Display','Cormorant Garamond','JetBrains Mono','IBM Plex Mono','Georgia','system-ui'];
const D={f:'Inter',fs:14,bl:26,ga:.06,br:.14,r:18,nw:200,ew:1.5,ec:'c',ar:1,gr:'dots',gs:28,th:'d',gn:.07,an:1,pt:0,inst:''};
let s=null,st={...D,...ld0('pk:s',{})},U=[],R=[],sel=null,els={},rc={},drag=null,pinch=null,last='';const P=new Map;
const snap=()=>JSON.stringify({n:s.n,e:s.e}),nm=id=>s.n.find(n=>n.id==id),idx=()=>ld0('pk:i',[]),setI=i=>sv('pk:i',i);

/* ---------- проекты ---------- */
function save(){if(!s)return;s.t=Date.now();sv('pk:p:'+s.id,s);setI([{id:s.id,name:s.name,c:s.n.length,t:s.t},...idx().filter(x=>x.id!=s.id)])}
const SD=v=>v==null||v===''?undefined:[0,1,2,3].includes(+v)?+v:undefined;
function clean(j){const ids=new Set,n=(j.n||[]).filter(x=>x&&x.id).map(x=>{ids.add(String(x.id));const o={id:String(x.id),x:+x.x||0,y:+x.y||0,t:T[x.t]?x.t:'obj',v:String(x.v??''),c:String(x.c??''),m:M[x.m]?x.m:null};
if(o.t=='result'){o.it=(Array.isArray(x.it)?x.it:[]).slice(0,30).map(i=>({t:String(i.t??''),u:String(i.u??''),c:String(i.c??''),i:String(i.i??'')}));o.st=x.st=='err'?'err':x.st=='ok'?'ok':(o.it.length?'ok':'err');o.src=String(x.src??'');o.p=x.p?String(x.p):null;o.q=String(x.q??'');o.er=String(x.er??'')}return o});
return{n,e:(j.e||[]).filter(e=>e&&ids.has(String(e.a))&&ids.has(String(e.b))).map(e=>({id:String(e.id||uid()),a:String(e.a),b:String(e.b),l:String(e.l??''),d:[0,1,2,3].includes(+e.d)?+e.d:1,sa:SD(e.sa),sb:SD(e.sb)})),v:j.v&&j.v.k?{x:+j.v.x||0,y:+j.v.y||0,k:+j.v.k}:{x:0,y:0,k:1}}}
function mk(name,d={}){const p={...clean(d),name:name||'Новый граф',id:uid(),t:Date.now()};sv('pk:p:'+p.id,p);setI([{id:p.id,name:p.name,c:p.n.length,t:p.t},...idx()]);return p.id}
const go=id=>{if(location.hash=='#'+id)route();else location.hash=id};
function route(){const id=location.hash.slice(1);id&&LS.getItem('pk:p:'+id)?openP(id):showHome()}
function openP(id){s=ld0('pk:p:'+id,null);Object.assign(s,clean(s));U=[];R=[];sel=null;rc={};last=snap();document.body.classList.remove('hm');$('#nm').value=s.name;nodes();panel();
if(s.n.length&&s.v.k==1&&!s.v.x&&!s.v.y)fit();else view()}
function thumb(p){if(!p.n.length)return'<svg viewBox="0 0 160 90"></svg>';let a=1e9,b=1e9,c=-1e9,d=-1e9;p.n.forEach(n=>{a=Math.min(a,n.x);b=Math.min(b,n.y);c=Math.max(c,n.x);d=Math.max(d,n.y)});
const w=c-a,h=d-b,k=Math.min(128/(w||1),58/(h||1),60),ox=(160-w*k)/2,oy=(90-h*k)/2,X=n=>ox+(n.x-a)*k,Y=n=>oy+(n.y-b)*k,m={};p.n.forEach(n=>m[n.id]=n);
return`<svg viewBox="0 0 160 90">${p.e.map(e=>`<line x1="${X(m[e.a])}" y1="${Y(m[e.a])}" x2="${X(m[e.b])}" y2="${Y(m[e.b])}"/>`).join('')}${p.n.map(n=>`<circle cx="${X(n)}" cy="${Y(n)}" r="3.2"/>`).join('')}</svg>`}
function showHome(){if(s)save();s=null;sel=null;$('#nd').innerHTML='';$('#eg').innerHTML='';['#pn','#mn'].forEach(q=>$(q).classList.remove('o'));document.body.classList.add('hm');const i=idx();
$('#pl').innerHTML=i.length?i.map((p,k)=>{const d=ld0('pk:p:'+p.id,{n:[],e:[]});return`<div class="pc glass" data-id="${p.id}" style="animation-delay:${k*60}ms"><div class="th">${thumb({n:d.n||[],e:d.e||[]})}</div><div class="pi"><div><b>${esc(p.name)}</b><small>${p.c} карт. · ${new Date(p.t).toLocaleDateString('ru',{day:'numeric',month:'short'})}</small></div><div class="pa"><button data-a="r" title="Переименовать">${I(`<path d="${UI.ed}"/>`)}</button><button data-a="d" title="Копия">${I(`<path d="${UI.cp}"/>`)}</button><button data-a="x" title="Удалить">${I(`<path d="${UI.tr}"/>`)}</button></div></div></div>`}).join(''):'<p class="empty">Проектов пока нет — создайте первый.</p>'}
$('#pl').onclick=e=>{const c=e.target.closest('.pc');if(!c)return;const id=c.dataset.id,b=e.target.closest('button'),a=b&&b.dataset.a;if(!a)return go(id);const p=ld0('pk:p:'+id,null);if(!p)return showHome();
if(a=='r'){go(id);setTimeout(()=>{$('#nm').focus();$('#nm').select()},80);return}
if(a=='d')mk(p.name+' (копия)',p);
else{if(!b.dataset.arm){b.dataset.arm=1;b.innerHTML='Удалить?';setTimeout(()=>{if(b.isConnected){delete b.dataset.arm;b.innerHTML=I(`<path d="${UI.tr}"/>`)}},3000);return}LS.removeItem('pk:p:'+id);setI(idx().filter(x=>x.id!=id))}showHome()};
$('#pl').onpointermove=e=>{const c=e.target.closest('.pc');if(c){const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}};
$('#hn').onclick=()=>go(mk('Новый граф'));
$('#hi').onclick=()=>$('#fi').click();
$('#fi').onchange=async e=>{try{const f=e.target.files[0],j=JSON.parse(await f.text());if(!Array.isArray(j.n)||!Array.isArray(j.e))throw 0;go(mk(j.name||f.name.replace(/\.json$/i,''),j))}catch{toast('Неверный файл проекта')}e.target.value=''};
$('#hs').onclick=()=>$('#set').classList.toggle('o');$('#bk').onclick=()=>{location.hash=''};
addEventListener('hashchange',route);addEventListener('pagehide',()=>save());

/* ---------- история ---------- */
function commit(){U.push(last);if(U.length>100)U.shift();last=snap();R=[];save()}
function ld(x){x=JSON.parse(x);s.n=x.n;s.e=x.e;last=snap();sel=null;nodes();panel();save()}
const undo=()=>{if(s&&U.length){R.push(snap());ld(U.pop())}},redo=()=>{if(s&&R.length){U.push(snap());ld(R.pop())}};

/* ---------- отрисовка ---------- */
function apply(){const r=document.documentElement,v=r.style;r.className=st.th=='l'?'l':'';document.body.classList.toggle('na',!st.an);
v.setProperty('--f',`'${st.f}',system-ui,sans-serif`);v.setProperty('--fs',st.fs+'px');v.setProperty('--bl',st.bl+'px');v.setProperty('--ga',st.ga);v.setProperty('--bd',st.br);v.setProperty('--r',st.r+'px');v.setProperty('--nw',st.nw+'px');v.setProperty('--ew',st.ew+'px');v.setProperty('--gn',st.gn);
document.querySelector('meta[name=theme-color]').content=st.th=='l'?'#e9e9e9':'#060606';if(s){view();edges()}}
function view(){if(!s)return;const v=s.v,g=$('#stage').style,gs=Math.max(4,st.gs*v.k);$('#world').style.transform=`translate(${v.x}px,${v.y}px) scale(${v.k})`;$('#zl').textContent=Math.round(v.k*100)+'%';
g.backgroundImage=st.gr=='dots'?'radial-gradient(rgba(var(--c),.3) 1px,transparent 1.3px)':st.gr=='lines'?'linear-gradient(rgba(var(--c),.07) 1px,transparent 1px),linear-gradient(90deg,rgba(var(--c),.07) 1px,transparent 1px)':'none';
g.backgroundSize=gs+'px '+gs+'px';g.backgroundPosition=v.x+'px '+v.y+'px'}
const HD=[0,1,2,3].map(i=>`<div class="hd" data-s="${i}"></div>`).join('');
function resHTML(n){const hd=`<div class="nh"><span class="ic">${I(IC.result)}</span><div class="rt"><small>Результаты поиска</small><em></em></div><span class="cnt">${n.st=='ok'?n.it.length:''}</span></div>`;let b;
if(n.st=='load')b='<div class="sk"><span></span><span></span><span></span></div><p class="rm">Ищу в открытых источниках…</p>';
else if(n.st=='err'||!n.it.length)b=`<p class="rm">${esc(n.st=='err'?(n.er||'Поиск прерван.'):'Ничего не найдено.')}</p><button data-act="rt">Повторить</button>`;
else b='<div class="rl">'+n.it.map((x,i)=>{let h='';try{h=new URL(x.u).hostname.replace(/^www\./,'')}catch{}return`<div class="ri" style="animation-delay:${Math.min(i,10)*40}ms"><span class="fv">${esc((h[0]||'•').toUpperCase())}</span><div>${/^https?:/.test(x.i)?`<img src="${esc(x.i)}" loading="lazy" referrerpolicy="no-referrer" alt="">`:''}<a href="${/^https?:/.test(x.u)?esc(x.u):'#'}" target="_blank" rel="noopener noreferrer">${esc(x.t)}</a><small>${esc(h)}</small>${x.c?`<p>${esc(x.c)}</p>`:''}<button data-act="add" data-i="${i}">+ в граф</button></div></div>`}).join('')+'</div>';
return hd+(n.st=='ok'&&n.er?`<p class="rm">${esc(n.er)}</p>`:'')+b+(n.src&&n.st=='ok'?`<div class="rf">${esc(n.src)}</div>`:'')+HD}
function nodes(){const w=$('#nd'),sc={};w.querySelectorAll('.rl').forEach(r=>sc[r.closest('.node').dataset.id]=r.scrollTop);w.innerHTML='';els={};
s.n.forEach(n=>{const e=document.createElement('div'),t=T[n.t]||T.obj,r=n.t=='result';e.className='node glass'+(r?' res':'')+(sel&&sel.k=='n'&&sel.id==n.id?' s':'');e.dataset.id=n.id;
if(r){e.innerHTML=resHTML(n);e.querySelector('em').textContent=n.v}
else{e.innerHTML=`<div class="nh"><span class="ic">${I(IC[n.t]||IC.obj)}</span><small></small></div><b></b><i></i>${HD}`;e.querySelector('small').textContent=t[0];e.children[1].textContent=n.v||'—';e.children[2].textContent=n.c||''}
e.style.left=n.x+'px';e.style.top=n.y+'px';w.append(e);els[n.id]=e;const l=e.querySelector('.rl');if(l&&sc[n.id])l.scrollTop=sc[n.id]});edges();view();$('#hint').style.display=s.n.length?'none':'block'}
const NV=[[0,-1],[1,0],[0,1],[-1,0]],anc=(n,el,i)=>[n.x+(i==1?el.offsetWidth:i==3?0:el.offsetWidth/2),n.y+(i==2?el.offsetHeight:i==0?0:el.offsetHeight/2)];
/* ломаная со скруглёнными углами (угловые связи, как в Miro) */
function rpoly(p,r){let d=`M${p[0][0]} ${p[0][1]}`;for(let i=1;i<p.length-1;i++){const a=p[i-1],c=p[i],b=p[i+1],l1=Math.hypot(c[0]-a[0],c[1]-a[1])||1,l2=Math.hypot(b[0]-c[0],b[1]-c[1])||1,k=Math.min(r,l1/2,l2/2);d+=`L${c[0]-(c[0]-a[0])/l1*k} ${c[1]-(c[1]-a[1])/l1*k}Q${c[0]} ${c[1]} ${c[0]+(b[0]-c[0])/l2*k} ${c[1]+(b[1]-c[1])/l2*k}`}const z=p[p.length-1];return d+`L${z[0]} ${z[1]}`}
function elbow(p,n,q,m){const o=22,a=[p[0]+n[0]*o,p[1]+n[1]*o],b=[q[0]+m[0]*o,q[1]+m[1]*o],h1=n[0]!=0,h2=m[0]!=0;
if(h1&&h2){const x=n[0]*m[0]<0?(a[0]+b[0])/2:(n[0]>0?Math.max(a[0],b[0]):Math.min(a[0],b[0]));return[p,[x,p[1]],[x,q[1]],q]}
if(!h1&&!h2){const y=n[1]*m[1]<0?(a[1]+b[1])/2:(n[1]>0?Math.max(a[1],b[1]):Math.min(a[1],b[1]));return[p,[p[0],y],[q[0],y],q]}
return h1?[p,[q[0],p[1]],q]:[p,[p[0],q[1]],q]}
function pmid(t){let L=0;const s=[];for(let i=1;i<t.length;i++){const l=Math.hypot(t[i][0]-t[i-1][0],t[i][1]-t[i-1][1]);s.push(l);L+=l}let h=L/2;for(let i=0;i<s.length;i++){if(h<=s[i]||i==s.length-1){const k=s[i]?h/s[i]:0;return[t[i][0]+(t[i+1][0]-t[i][0])*k,t[i][1]+(t[i+1][1]-t[i][1])*k]}h-=s[i]}return t[0]}
/* связь как в Miro: крепится к середине стороны карточки (верх/право/низ/лево), наконечник смотрит по касательной */
function shape(e){const A=nm(e.a),B=nm(e.b),a=els[e.a],b=els[e.b];if(!A||!B||!a||!b)return;
const dd=e.d??1,ah=8+st.ew*1.8,ar=[],cx=A.x+a.offsetWidth/2,cy=A.y+a.offsetHeight/2,dx=B.x+b.offsetWidth/2-cx,dy=B.y+b.offsetHeight/2-cy,
hz=Math.abs(dx)/((a.offsetWidth+b.offsetWidth)/2||1)>Math.abs(dy)/((a.offsetHeight+b.offsetHeight)/2||1),
sa=e.sa??(hz?(dx>=0?1:3):(dy>=0?2:0)),sb=e.sb??(hz?(dx>=0?3:1):(dy>=0?0:2)),
p1=anc(A,a,sa),p2=anc(B,b,sb),n1=NV[sa],n2=NV[sb],t1=st.ar&&(dd==2||dd==3),t2=st.ar&&(dd==1||dd==3);
let d,u1,u2,q1=p1,q2=p2,lx,ly;
if(st.ec=='s'){const L=Math.hypot(p2[0]-p1[0],p2[1]-p1[1])||1,ux=(p2[0]-p1[0])/L,uy=(p2[1]-p1[1])/L;u2=[ux,uy];u1=[-ux,-uy];
q1=t1?[p1[0]+ux*ah*.7,p1[1]+uy*ah*.7]:p1;q2=t2?[p2[0]-ux*ah*.7,p2[1]-uy*ah*.7]:p2;d=`M${q1[0]} ${q1[1]}L${q2[0]} ${q2[1]}`;lx=(q1[0]+q2[0])/2;ly=(q1[1]+q2[1])/2}
else{u1=[-n1[0],-n1[1]];u2=[-n2[0],-n2[1]];q1=t1?[p1[0]+n1[0]*ah*.7,p1[1]+n1[1]*ah*.7]:p1;q2=t2?[p2[0]+n2[0]*ah*.7,p2[1]+n2[1]*ah*.7]:p2;
if(st.ec=='e'){const t=elbow(q1,n1,q2,n2);d=rpoly(t,12);[lx,ly]=pmid(t)}
else{const k=Math.min(Math.max(Math.hypot(q2[0]-q1[0],q2[1]-q1[1])*.4,30),180),c1=[q1[0]+n1[0]*k,q1[1]+n1[1]*k],c2=[q2[0]+n2[0]*k,q2[1]+n2[1]*k];
d=`M${q1[0]} ${q1[1]}C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${q2[0]} ${q2[1]}`;lx=(q1[0]+3*c1[0]+3*c2[0]+q2[0])/8;ly=(q1[1]+3*c1[1]+3*c2[1]+q2[1])/8}}
const tip=(x,y,ux,uy)=>{const bx=x-ux*ah,by=y-uy*ah,px=-uy*ah*.5,py=ux*ah*.5;return[[x,y],[bx+px,by+py],[bx-px,by-py]]};
if(t2)ar.push(tip(p2[0],p2[1],u2[0],u2[1]));if(t1)ar.push(tip(p1[0],p1[1],u1[0],u1[1]));
return{d,ar,lx,ly,x1:q1[0],y1:q1[1],x2:q2[0],y2:q2[1]}}
function edges(){if(!s)return;let h='';s.e.forEach((e,i)=>{const g=shape(e);if(!g)return;const d=g.d,dd=e.d??1,on=sel&&sel.id==e.id,w=e.l?e.l.length*6.5+24:0;
h+=`<g data-e="${e.id}" class="${on?'es':''}"><linearGradient id="g${i}" gradientUnits="userSpaceOnUse" x1="${g.x1}" y1="${g.y1}" x2="${g.x2}" y2="${g.y2}"><stop offset="0" style="stop-color:var(--fg);stop-opacity:${dd==2?.9:dd==1?.18:.6}"/><stop offset="1" style="stop-color:var(--fg);stop-opacity:${dd==1?.9:dd==2?.18:.6}"/></linearGradient><path class="hit" d="${d}"/><path class="ln" stroke="url(#g${i})" d="${d}"/>${g.ar.map(p=>`<polygon class="ah" points="${p.map(q=>q.join(',')).join(' ')}"/>`).join('')}${on||st.pt?`<circle class="pt" r="2.8"><animateMotion dur="2.6s" repeatCount="indefinite" path="${d}"${dd==2?' keyPoints="1;0" keyTimes="0;1" calcMode="linear"':''}/></circle>`:''}${e.l?`<g transform="translate(${g.lx} ${g.ly})"><rect class="lb" x="${-w/2}" y="-11" width="${w}" height="22" rx="11"/><text text-anchor="middle" dy="4">${esc(e.l)}</text></g>`:''}</g>`});$('#eg').innerHTML=h}
function pick(k,id){sel=k?{k,id}:null;for(const i in els)els[i].classList.toggle('s',!!sel&&sel.k=='n'&&sel.id==i);edges();panel()}

/* ---------- панель редактирования ---------- */
const XB=`<button class="ib" id="cl">${I(`<path d="${UI.x}"/>`)}</button>`,modes=c=>Object.entries(M).map(([k,v])=>`<option value="${k}" ${k==c?'selected':''}>${v[0]}</option>`).join('');
const kill=n=>{const g=new Set([n.id,...s.n.filter(x=>x.p==n.id).map(x=>x.id)]);s.n=s.n.filter(x=>!g.has(x.id));s.e=s.e.filter(e=>!g.has(e.a)&&!g.has(e.b));commit();sel=null;nodes();panel()};
function panel(){const p=$('#pn');if(!s||!sel){p.classList.remove('o');return}p.classList.add('o');
if(sel.k=='e'){const e=s.e.find(x=>x.id==sel.id);if(!e){pick(null);return}const d=e.d??1;
p.innerHTML=`<div class="row hd2"><h3>Связь</h3>${XB}</div><label>Подпись</label><input id="el" value="${esc(e.l)}" placeholder="Например: владелец"><label>Направление стрелки</label><div class="seg">${[['0','—'],['1','→'],['2','←'],['3','↔']].map(([v,l])=>`<button data-d="${v}" class="${d==v?'on':''}">${l}</button>`).join('')}</div><div class="row"><button id="rv">⇄ Развернуть</button><button id="dl">Удалить</button></div>`;
$('#el').oninput=x=>{e.l=x.target.value;edges()};$('#el').onchange=commit;$('#rv').onclick=()=>{[e.a,e.b]=[e.b,e.a];[e.sa,e.sb]=[e.sb,e.sa];if(e.d==2)e.d=1;else if(e.d==1||e.d===undefined)e.d=2;commit();edges();panel()};
p.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{e.d=+b.dataset.d;commit();edges();panel()});
$('#dl').onclick=()=>{s.e=s.e.filter(x=>x!=e);commit();pick(null)}}
else{const n=nm(sel.id);if(!n){pick(null);return}
if(n.t=='result'){p.innerHTML=`<div class="row hd2"><span class="ic">${I(IC.result)}</span><h3>Результаты</h3>${XB}</div><label>Запрос</label><input id="rq" value="${esc(n.q)}"><label>Источник поиска</label><select id="pm">${modes(n.m)}</select><button class="pri" id="sr">Обновить поиск</button><div class="row"><button id="so">↗ В браузере</button><button id="dl">Удалить</button></div>`;
$('#rq').onchange=x=>{n.q=x.target.value;save()};$('#pm').onchange=x=>{n.m=x.target.value;save()};$('#sr').onclick=()=>retry(n);
$('#so').onclick=()=>open(br(n.q),'_blank','noopener');$('#dl').onclick=()=>kill(n)}
else{p.innerHTML=`<div class="row hd2"><span class="ic">${I(IC[n.t])}</span><h3>Редактирование</h3>${XB}</div>
<label>Тип</label><select id="pt">${Object.entries(T).filter(([k])=>k!='result').map(([k,v])=>`<option value="${k}" ${k==n.t?'selected':''}>${v[0]}</option>`).join('')}</select>
<label>Значение</label><textarea id="pv" rows="2">${esc(n.v)}</textarea><label>Заметки</label><textarea id="pc" rows="3">${esc(n.c)}</textarea>
<label>Источник поиска</label><select id="pm">${modes(n.m||T[n.t][1])}</select>
<button class="pri" id="sr">Искать · результат появится блоком</button>
<div class="row"><button id="du">Копия</button><button id="dl">Удалить</button></div>`;
$('#pt').onchange=x=>{n.t=x.target.value;n.m=null;commit();nodes();panel()};
$('#pv').oninput=x=>{n.v=x.target.value;els[n.id].children[1].textContent=n.v||'—';edges()};$('#pc').oninput=x=>{n.c=x.target.value;els[n.id].children[2].textContent=n.c;edges()};
$('#pv').onchange=$('#pc').onchange=commit;$('#pm').onchange=x=>{n.m=x.target.value;save()};
$('#sr').onclick=()=>find(n);
$('#du').onclick=()=>{const c={...n,id:uid(),x:n.x+30,y:n.y+30};s.n.push(c);commit();nodes();pick('n',c.id)};
$('#dl').onclick=()=>kill(n)}}
$('#cl').onclick=()=>pick(null)}

/* ---------- OSINT-поиск: только открытые API без ключей и регистрации ---------- */
const br=q=>'https://duckduckgo.com/?q='+encodeURIComponent(q);
const E=encodeURIComponent,cut=(t,n=260)=>String(t||'').slice(0,n);
/* 404 = «ничего нет» (не ошибка); любая другая ошибка просто выключает один источник */
const tf=async(u,ms=8000)=>{const c=new AbortController,t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(u,{signal:c.signal,credentials:'omit'});if(r.status==404)return null;if(!r.ok)throw new Error(r.status);return await r.json()}finally{clearTimeout(t)}};
const dt=h=>{try{return(new DOMParser().parseFromString(String(h||''),'text/html').body.textContent||'').replace(/\s+/g,' ').trim()}catch{return''}};
const isIP=q=>/^(\d{1,3}\.){3}\d{1,3}$/.test(q)||(/^[0-9a-f:]{3,39}$/i.test(q)&&q.includes(':'));
const tg=q=>{q=q.trim();return isIP(q)?q:q.replace(/^[a-z]+:\/\//i,'').replace(/^.*@/,'').split(/[\/?#:]/)[0].toLowerCase()};
const sha=async t=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t)))].map(b=>b.toString(16).padStart(2,'0')).join('');
const doh=async(n,t)=>{const j=await tf(`https://dns.google/resolve?name=${E(n)}&type=${t}`);return(j?.Answer||[]).map(a=>a.data)};
const day=s=>(s||'').slice(0,10);

/* — энциклопедии, базы — */
const wiki=l=>async q=>{const j=await tf(`https://${l}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${E(q)}&srlimit=6&format=json&origin=*`);return(j?.query?.search||[]).map(x=>({t:x.title+' · Wikipedia '+l.toUpperCase(),u:`https://${l}.wikipedia.org/?curid=${x.pageid}`,c:cut(dt(x.snippet))}))};
const wikidata=async q=>{const j=await tf(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${E(q)}&language=ru&uselang=ru&limit=6&format=json&origin=*`);return(j?.search||[]).map(x=>({t:(x.label||x.id)+' · Wikidata',u:x.concepturi||'https://www.wikidata.org/wiki/'+x.id,c:cut(x.description)}))};
const commons=async q=>{const j=await tf(`https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${E(q)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=360&format=json&origin=*`);return Object.values(j?.query?.pages||{}).map(p=>{const i=p.imageinfo?.[0]||{};return{t:p.title.replace(/^File:/,''),u:i.descriptionurl||'',c:'Wikimedia Commons',i:i.thumburl||''}})};
const openalex=async q=>{const j=await tf(`https://api.openalex.org/authors?search=${E(q)}&per-page=5`);return(j?.results||[]).map(x=>({t:x.display_name+' · OpenAlex',u:x.id,c:`работ: ${x.works_count}, цитирований: ${x.cited_by_count}${x.last_known_institutions?.[0]?' · '+x.last_known_institutions[0].display_name:''}`}))};
const archive=async q=>{const j=await tf(`https://archive.org/advancedsearch.php?q=${E(q)}&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=description&rows=6&output=json`);return(j?.response?.docs||[]).map(x=>({t:(x.title||x.identifier)+' · Internet Archive',u:'https://archive.org/details/'+x.identifier,c:cut(dt(Array.isArray(x.description)?x.description[0]:x.description))}))};
const gleif=async q=>{const j=await tf(`https://api.gleif.org/api/v1/lei-records?filter[fulltext]=${E(q)}&page[size]=6`);return(j?.data||[]).map(x=>{const e=x.attributes?.entity||{},a=e.legalAddress||{};return{t:(e.legalName?.name||x.id)+' · GLEIF',u:'https://search.gleif.org/#/record/'+x.id,c:[`LEI ${x.id}`,e.status,a.city,a.country,e.jurisdiction].filter(Boolean).join(' · ')}})};
const nominatim=async q=>{const j=await tf(`https://nominatim.openstreetmap.org/search?q=${E(q)}&format=jsonv2&limit=6&accept-language=ru`);return(j||[]).map(x=>({t:x.display_name,u:`https://www.openstreetmap.org/${x.osm_type}/${x.osm_id}`,c:`${x.type||''} · ${(+x.lat).toFixed(5)}, ${(+x.lon).toFixed(5)}`}))};

/* — обсуждения и сообщества — */
const hnSearch=async q=>{const j=await tf(`https://hn.algolia.com/api/v1/search?query=${E(q)}&hitsPerPage=8`);return(j?.hits||[]).map(x=>({t:(x.title||x.story_title||x.comment_text&&'Комментарий')+' · Hacker News',u:x.url||'https://news.ycombinator.com/item?id='+x.objectID,c:cut(dt(x.comment_text||x.story_text||'автор: '+x.author))}))};
const redditSearch=async q=>{const j=await tf(`https://www.reddit.com/search.json?q=${E(q)}&limit=8&raw_json=1`);return(j?.data?.children||[]).map(({data:x})=>({t:x.title+' · '+x.subreddit_name_prefixed,u:'https://www.reddit.com'+x.permalink,c:cut(x.selftext)}))};

/* — аккаунты — */
const ghUser=async q=>{if(/\s/.test(q))return[];const x=await tf('https://api.github.com/users/'+E(q));if(!x)return[];return[{t:`${x.login}${x.name?' · '+x.name:''} · GitHub`,u:x.html_url,c:[x.bio,x.company,x.location,x.blog,'репозиториев: '+x.public_repos,'с '+day(x.created_at)].filter(Boolean).join(' · '),i:x.avatar_url}]};
const ghSearch=async q=>{const j=await tf(`https://api.github.com/search/users?q=${E(q)}&per_page=6`);return(j?.items||[]).map(x=>({t:x.login+' · GitHub',u:x.html_url,c:'Похожие логины на GitHub',i:x.avatar_url}))};
const ghMail=async q=>{const j=await tf(`https://api.github.com/search/users?q=${E(q+' in:email')}&per_page=5`);return(j?.items||[]).map(x=>({t:x.login+' · GitHub (по публичному e-mail)',u:x.html_url,c:'Профиль, где этот e-mail указан публично',i:x.avatar_url}))};
const gitlab=async q=>{if(/\s/.test(q))return[];const j=await tf('https://gitlab.com/api/v4/users?username='+E(q));return(j||[]).map(x=>({t:`${x.username}${x.name?' · '+x.name:''} · GitLab`,u:x.web_url,c:'Аккаунт GitLab',i:x.avatar_url}))};
const redditUser=async q=>{if(/\s/.test(q))return[];const j=await tf(`https://www.reddit.com/user/${E(q)}/about.json?raw_json=1`),x=j?.data;if(!x?.name)return[];return[{t:'u/'+x.name+' · Reddit',u:'https://www.reddit.com/user/'+x.name,c:`карма: ${x.link_karma}/${x.comment_karma} · с ${day(new Date(x.created_utc*1000).toISOString())}`,i:(x.icon_img||'').split('?')[0]}]};
const hnUser=async q=>{if(/\s/.test(q))return[];const x=await tf('https://hacker-news.firebaseio.com/v0/user/'+E(q)+'.json');if(!x)return[];return[{t:x.id+' · Hacker News',u:'https://news.ycombinator.com/user?id='+x.id,c:cut(dt(x.about))||`карма ${x.karma}`}]};
const mastodon=async q=>{if(/\s/.test(q))return[];const x=await tf('https://mastodon.social/api/v1/accounts/lookup?acct='+E(q));if(!x)return[];return[{t:`@${x.acct} · Mastodon`,u:x.url,c:cut(dt(x.note))||`подписчиков: ${x.followers_count}`,i:x.avatar}]};
const devto=async q=>{if(/\s/.test(q))return[];const x=await tf('https://dev.to/api/users/by_username?url='+E(q));if(!x||!x.username)return[];return[{t:`${x.username}${x.name?' · '+x.name:''} · DEV`,u:'https://dev.to/'+x.username,c:[x.summary,x.location,x.github_username&&'GitHub: '+x.github_username,x.twitter_username&&'X: '+x.twitter_username].filter(Boolean).join(' · '),i:x.profile_image}]};
const keybase=async q=>{if(/\s/.test(q))return[];const j=await tf(`https://keybase.io/_/api/1.0/user/lookup.json?usernames=${E(q)}&fields=basics,profile,proofs_summary`),x=j?.them?.[0];if(!x)return[];const pr=(x.proofs_summary?.all||[]).map(p=>p.proof_type+': '+p.nametag).join(', ');return[{t:`${x.basics?.username} · Keybase`,u:'https://keybase.io/'+x.basics?.username,c:[x.profile?.full_name,x.profile?.location,pr&&'Привязано: '+pr].filter(Boolean).join(' · ')}]};
const bsky=async q=>{const j=await tf(`https://public.api.bsky.app/xrpc/app.bsky.actor.searchActors?q=${E(q)}&limit=8`);return(j?.actors||[]).map(x=>({t:`${x.displayName||x.handle} · @${x.handle}`,u:'https://bsky.app/profile/'+x.handle,c:cut(x.description),i:x.avatar||''}))};
const seUsers=async q=>{const j=await tf(`https://api.stackexchange.com/2.3/users?inname=${E(q)}&site=stackoverflow&pagesize=5`);return(j?.items||[]).map(x=>({t:dt(x.display_name)+' · Stack Overflow',u:x.link,c:[x.location,'репутация '+x.reputation].filter(Boolean).join(' · '),i:x.profile_image}))};

/* — e-mail — */
const gravatar=async q=>{if(!q.includes('@'))return[];const x=await tf('https://api.gravatar.com/v3/profiles/'+await sha(q.trim().toLowerCase()));if(!x)return[];return[{t:`${x.display_name||'Профиль'} · Gravatar`,u:x.profile_url,c:[x.job_title,x.company,x.location,cut(x.description,120),...(x.verified_accounts||[]).map(a=>a.service_label)].filter(Boolean).join(' · '),i:x.avatar_url}]};
const mxInfo=async q=>{const d=q.split('@')[1];if(!d)return[];const m=await doh(d.trim(),'MX');return m.length?[{t:'Почтовый домен '+d.trim(),u:'https://dnschecker.org/all-dns-records-of-domain.php?query='+E(d.trim()),c:'MX: '+m.join(', ')}]:[]};

/* — домены и IP — */
const dnsInfo=async q=>{const h=tg(q);if(isIP(h)||!h.includes('.'))return[];const T=['A','AAAA','MX','NS','TXT'],r=await Promise.allSettled(T.map(t=>doh(h,t))),l=[];r.forEach((x,i)=>{if(x.status=='fulfilled'&&x.value.length)l.push(T[i]+': '+x.value.join(', '))});return l.length?[{t:'DNS-записи · '+h,u:'https://dnschecker.org/all-dns-records-of-domain.php?query='+E(h),c:cut(l.join(' · '),600)}]:[]};
const rdap=async q=>{const h=tg(q);if(!h)return[];const x=await tf('https://rdap.org/'+(isIP(h)?'ip/':'domain/')+E(h));if(!x)return[];const reg=(x.entities||[]).find(e=>(e.roles||[]).includes('registrar')||(e.roles||[]).includes('registrant')),fn=reg?.vcardArray?.[1]?.find(v=>v[0]=='fn')?.[3];
return[{t:`RDAP · ${x.ldhName||x.name||h}`,u:'https://rdap.org/'+(isIP(h)?'ip/':'domain/')+h,c:cut([fn&&'Регистратор: '+fn,x.country,x.startAddress&&x.startAddress+' – '+x.endAddress,(x.events||[]).map(e=>e.eventAction+' '+day(e.eventDate)).join(', '),(x.status||[]).join(', '),(x.nameservers||[]).map(n=>n.ldhName).join(', ')].filter(Boolean).join(' · '),500)}]};
const ipInfo=async q=>{const h=tg(q);if(!isIP(h))return[];const x=await tf('https://ipwho.is/'+E(h));if(!x||x.success===false)return[];return[{t:`${x.ip} · ${[x.city,x.country].filter(Boolean).join(', ')}`,u:`https://www.openstreetmap.org/?mlat=${x.latitude}&mlon=${x.longitude}#map=9/${x.latitude}/${x.longitude}`,c:[x.region,x.connection?.asn&&'AS'+x.connection.asn,x.connection?.org||x.connection?.isp,x.connection?.domain,x.timezone?.id,x.type].filter(Boolean).join(' · ')}]};
const certs=async q=>{const h=tg(q);if(isIP(h)||!h.includes('.'))return[];const j=await tf(`https://api.certspotter.com/v1/issuances?domain=${E(h)}&include_subdomains=true&expand=dns_names`),n=new Set;(j||[]).forEach(c=>(c.dns_names||[]).forEach(d=>n.add(d)));return n.size?[{t:`Поддомены из CT-логов (${n.size})`,u:'https://crt.sh/?q='+E('%.'+h),c:cut([...n].slice(0,40).join(', '),600)}]:[]};
const wayback=async q=>{const h=tg(q);if(isIP(h)||!h.includes('.'))return[];const c=(await tf('https://archive.org/wayback/available?url='+E(h)))?.archived_snapshots?.closest;return c?[{t:'Архив сайта · Wayback Machine',u:c.url.replace(/^http:/,'https:'),c:'Ближайший снимок: '+c.timestamp.replace(/^(\d{4})(\d\d)(\d\d).*/,'$1-$2-$3')}]:[]};

/* — телефон: разбор номера локально (бесключевых API с владельцем номера нет) — */
const CC={'1':'США / Канада (NANP)','7':'Россия / Казахстан','20':'Египет','27':'ЮАР','30':'Греция','31':'Нидерланды','32':'Бельгия','33':'Франция','34':'Испания','36':'Венгрия','39':'Италия','40':'Румыния','41':'Швейцария','43':'Австрия','44':'Великобритания','45':'Дания','46':'Швеция','47':'Норвегия','48':'Польша','49':'Германия','51':'Перу','52':'Мексика','53':'Куба','54':'Аргентина','55':'Бразилия','56':'Чили','57':'Колумбия','58':'Венесуэла','60':'Малайзия','61':'Австралия','62':'Индонезия','63':'Филиппины','64':'Новая Зеландия','65':'Сингапур','66':'Таиланд','81':'Япония','82':'Южная Корея','84':'Вьетнам','86':'Китай','90':'Турция','91':'Индия','92':'Пакистан','93':'Афганистан','94':'Шри-Ланка','95':'Мьянма','98':'Иран','212':'Марокко','213':'Алжир','216':'Тунис','218':'Ливия','234':'Нигерия','254':'Кения','351':'Португалия','352':'Люксембург','353':'Ирландия','354':'Исландия','357':'Кипр','358':'Финляндия','359':'Болгария','370':'Литва','371':'Латвия','372':'Эстония','373':'Молдова','374':'Армения','375':'Беларусь','376':'Андорра','380':'Украина','381':'Сербия','385':'Хорватия','386':'Словения','387':'Босния и Герцеговина','420':'Чехия','421':'Словакия','852':'Гонконг','886':'Тайвань','971':'ОАЭ','972':'Израиль','992':'Таджикистан','993':'Туркменистан','994':'Азербайджан','995':'Грузия','996':'Киргизия','998':'Узбекистан'};
const phoneInfo=async q=>{let d=q.replace(/\D/g,'');if(d.length<7||d.length>15)return[];if(!/^\s*\+/.test(q)){if(d.length==11&&d[0]=='8')d='7'+d.slice(1);else if(d.startsWith('00'))d=d.slice(2)}
let cc='';for(const n of[3,2,1])if(CC[d.slice(0,n)]){cc=d.slice(0,n);break}if(!cc)return[];const r=d.slice(cc.length);let c=CC[cc],ex='';
if(cc=='7'){c=/^[67]/.test(r)?'Казахстан':'Россия';if(r[0]=='9')ex='мобильный диапазон'}if(cc=='1')ex='код региона '+r.slice(0,3);
return[{t:`+${cc} ${r} · ${c}`,u:'https://en.wikipedia.org/wiki/List_of_country_calling_codes',c:`E.164: +${d}. Код страны +${cc}${ex?', '+ex:''}. Разобрано локально; оператора и владельца номера открытые API без ключа не отдают.`}]};

/* свой SearXNG (необязательно, добавляется к остальным источникам) */
const searx=async q=>{const j=await tf(st.inst.replace(/\/+$/,'')+'/search?q='+E(q)+'&format=json&categories=general');return(j?.results||[]).slice(0,10).map(x=>({t:x.title||x.url,u:x.url||'',c:cut(x.content),i:x.thumbnail_src||x.thumbnail||x.img_src||''}))};

/* какие API опрашиваются в каждом режиме */
const q4=f=>q=>f('"'+q+'"');
const PV={
name:[['Wikipedia RU',wiki('ru')],['Wikipedia EN',wiki('en')],['Wikidata',wikidata],['OpenAlex',openalex],['Bluesky',bsky],['Stack Overflow',seUsers],['Internet Archive',archive]],
user:[['GitHub',ghUser],['GitLab',gitlab],['Reddit',redditUser],['Hacker News',hnUser],['Mastodon',mastodon],['DEV',devto],['Keybase',keybase],['Bluesky',bsky],['GitHub-поиск',ghSearch]],
phone:[['Номер',phoneInfo],['Hacker News',q4(hnSearch)],['Reddit',q4(redditSearch)]],
email:[['Gravatar',gravatar],['GitHub',ghMail],['MX',mxInfo],['Hacker News',q4(hnSearch)],['Reddit',q4(redditSearch)]],
net:[['IP',ipInfo],['RDAP',rdap],['DNS',dnsInfo],['CT-логи',certs],['Wayback',wayback]],
work:[['Wikipedia RU',wiki('ru')],['Wikipedia EN',wiki('en')],['Wikidata',wikidata],['GLEIF',gleif],['Hacker News',hnSearch]],
geo:[['OpenStreetMap',nominatim],['Wikipedia RU',wiki('ru')],['Wikipedia EN',wiki('en')]],
photo:[['Wikimedia Commons',commons]],
gen:[['Wikipedia RU',wiki('ru')],['Wikipedia EN',wiki('en')],['Wikidata',wikidata],['Hacker News',hnSearch],['Reddit',redditSearch],['Internet Archive',archive]]};
/* ссылки для ручного поиска — всегда в конце списка, чтобы результат никогда не был пустым */
const LINKS=(m,q)=>{const e=E(q),qq=E('"'+q+'"'),h=tg(q);let l=[['Google','https://www.google.com/search?q='+qq],['DuckDuckGo','https://duckduckgo.com/?q='+qq],['Bing','https://www.bing.com/search?q='+qq],['Yandex','https://yandex.com/search/?text='+qq]];
if(m=='user')l.unshift(['WhatsMyName','https://whatsmyname.app/?q='+e]);
if(m=='email')l.unshift(['Epieos','https://epieos.com/?q='+e+'&t=email']);
if(m=='net')l=[['Whois','https://who.is/whois/'+h],['Shodan','https://www.shodan.io/search?query='+E(h)],['Wayback','https://web.archive.org/web/*/'+h],l[0]];
if(m=='photo')l=/^https?:/i.test(q.trim())?[['Google Lens','https://lens.google.com/uploadbyurl?url='+e],['Yandex Images','https://yandex.com/images/search?rpt=imageview&url='+e],['TinEye','https://tineye.com/search?url='+e]]:[['Google Images','https://www.google.com/search?tbm=isch&q='+e],['Yandex Images','https://yandex.com/images/search?text='+e],['Bing Images','https://www.bing.com/images/search?q='+e]];
return l.slice(0,5).map(([n,u])=>({t:n+' · открыть поиск',u,c:'Откроется в новой вкладке — запрос выполнит сам сайт'}))};
async function query(m,q){q=q.trim();const jobs=[...(st.inst?[['SearXNG',searx]]:[]),...(PV[m]||PV.gen)].map(([n,f])=>[n,()=>f(q)]),
rs=await Promise.allSettled(jobs.map(([,f])=>f())),ok=[],ls=[];let resp=0;
rs.forEach((r,i)=>{if(r.status=='fulfilled'){resp++;const a=(r.value||[]).filter(x=>x&&x.u);if(a.length){ls.push(a.slice(0,8));ok.push(jobs[i][0])}}});
const items=[];for(let i=0;items.length<24&&ls.some(l=>l[i]);i++)ls.forEach(l=>{if(l[i]&&items.length<24)items.push(l[i])});
items.push(...LINKS(m,q));
return{items,src:ok.join(' · ')||'ссылки',note:ok.length?'':resp>rs.length-resp?'В открытых базах ничего не найдено — ниже ссылки для ручного поиска.':'Онлайн-источники сейчас не ответили (нет сети или блокировщик). Ниже ссылки для ручного поиска.'}}
function spot(n){let x=n.x+(els[n.id]?.offsetWidth||st.nw)+110,y=n.y;while(s.n.some(o=>Math.abs(o.x-x)<350&&Math.abs(o.y-y)<280))y+=300;return[x,y]}
async function find(n,r){const m=r?r.m:(n.m||T[n.t][1]),q=(r?r.q:n.v).trim();if(!q)return toast('Введите значение для поиска');
if(!r)r=s.n.find(x=>x.t=='result'&&x.p==n.id&&x.m==m);
if(!r){const[x,y]=spot(n);r={id:uid(),x,y,t:'result',v:'',c:'',p:n.id,m,it:[],st:'load',src:'',q,er:''};s.n.push(r);s.e.push({id:uid(),a:n.id,b:r.id,l:M[m][0],d:1});commit()}
r.q=q;r.st='load';r.v=M[m][0]+' · '+q;const S=s;nodes();els[r.id].classList.add('pp');
const b=els[r.id].getBoundingClientRect();if(b.right>innerWidth||b.bottom>innerHeight-90||b.left<0||b.top<0)fit();if(innerWidth<700)pick(null);
try{const o=await query(m,q);r.it=o.items;r.src=o.src;r.st='ok';r.er=o.note||''}catch(e){r.it=[];r.st='err';r.er=e.message}
if(s===S&&nm(r.id)){last=snap();save();nodes()}else if(S!==s){sv('pk:p:'+S.id,S)}}
const retry=r=>find(nm(r.p)||null,r);
function addFrom(r,i){const x=r.it[i];if(!x)return;const c={id:uid(),x:r.x+400,y:r.y+Math.random()*140,t:'obj',v:x.t,c:x.u};s.n.push(c);s.e.push({id:uid(),a:r.id,b:c.id,l:'',d:1});commit();nodes();els[c.id].classList.add('pp');toast('Добавлено в граф')}
$('#nd').onclick=e=>{const b=e.target.closest('[data-act]');if(!b)return;const n=nm(b.closest('.node').dataset.id);if(!n)return;if(b.dataset.act=='rt')retry(n);else addFrom(n,+b.dataset.i)};

/* ---------- настройки ---------- */
const SET=[['f','Шрифт','select',FONTS],['fs','Размер текста','range',10,22,1],['th','Тема','select',[['d','Чёрная'],['l','Белая']]],['bl','Размытие стекла','range',0,60,1],['ga','Плотность стекла','range',0,.3,.01],['br','Яркость границ','range',.04,.4,.02],['r','Скругление','range',0,36,1],['nw','Ширина карточек','range',120,340,5],['ew','Толщина связей','range',.5,6,.5],['ec','Линии связей','select',[['c','Изогнутые'],['e','Угловые'],['s','Прямые']]],['ar','Стрелки','check'],['pt','Частицы на всех связях','check'],['gr','Сетка','select',[['dots','Точки'],['lines','Линии'],['none','Нет']]],['gs','Шаг сетки','range',12,90,2],['gn','Зерно плёнки','range',0,.2,.01],['an','Анимация фона','check'],['inst','Свой SearXNG (дополнительный источник)','text']];
function settings(){const p=$('#set');p.innerHTML=`<div class="row hd2"><h3>Настройки</h3><button class="ib" id="sc">${I(`<path d="${UI.x}"/>`)}</button></div>`+SET.map(([k,t,y,a,b,c])=>{let i;
if(y=='select')i=`<select data-k="${k}">${a.map(o=>{const[v,l]=Array.isArray(o)?o:[o,o];return`<option value="${v}" ${st[k]==v?'selected':''} ${k=='f'?`style="font-family:'${v}'"`:''}>${l}</option>`}).join('')}</select>`;
else if(y=='range')i=`<input type="range" data-k="${k}" min="${a}" max="${b}" step="${c}" value="${st[k]}">`;else if(y=='check')i=`<input type="checkbox" data-k="${k}" ${st[k]?'checked':''}>`;else i=`<input data-k="${k}" value="${esc(st[k])}" placeholder="${k=='inst'?'https://searx.example.org':'https://…/?url='}">`;
return`<label>${t}<span>${y=='range'?st[k]:''}</span></label>${i}`}).join('')+'<div class="row"><button id="rs0">Сбросить всё</button></div>';
p.querySelectorAll('[data-k]').forEach(i=>i.oninput=()=>{const k=i.dataset.k;st[k]=i.type=='checkbox'?+i.checked:i.type=='range'?+i.value:i.value;if(i.type=='range')i.previousElementSibling.lastChild.textContent=st[k];sv('pk:s',st);apply()});
$('#sc').onclick=()=>p.classList.remove('o');$('#rs0').onclick=()=>{st={...D};sv('pk:s',st);settings();apply()}}

/* ---------- добавление, жесты ---------- */
function add(t,x,y){const w=$('#stage'),v=s.v;x??=(w.clientWidth/2-v.x)/v.k-st.nw/2;y??=(w.clientHeight/2-v.y)/v.k-40;const n={id:uid(),x:Math.round(x+(Math.random()-.5)*40),y:Math.round(y+(Math.random()-.5)*40),t,v:'',c:''};s.n.push(n);commit();nodes();els[n.id].classList.add('pp');pick('n',n.id);$('#pv').focus()}
const zoomAt=(mx,my,k)=>{const v=s.v;k=Math.min(3,Math.max(.15,k));v.x=mx-(mx-v.x)*k/v.k;v.y=my-(my-v.y)*k/v.k;v.k=k};
const wp=(cx,cy)=>[(cx-s.v.x)/s.v.k,(cy-s.v.y)/s.v.k];
const bounds=()=>{let a=1e9,b=1e9,c=-1e9,d=-1e9;s.n.forEach(n=>{const e=els[n.id];a=Math.min(a,n.x);b=Math.min(b,n.y);c=Math.max(c,n.x+e.offsetWidth);d=Math.max(d,n.y+e.offsetHeight)});return{x:a,y:b,w:c-a,h:d-b}};
function fit(){if(!s)return;if(!s.n.length){s.v={x:0,y:0,k:1};view();return}const b=bounds(),w=$('#stage'),k=Math.min((w.clientWidth-80)/(b.w||1),(w.clientHeight-240)/(b.h||1),1.4)||1;s.v={k,x:(w.clientWidth-b.w*k)/2-b.x*k,y:(w.clientHeight-b.h*k)/2-b.y*k+10};view();save()}
function layout(){const N=s.n;if(N.length<2)return toast('Нужно хотя бы две карточки');N.forEach(n=>{n.x+=Math.random()-.5;n.y+=Math.random()-.5});
for(let it=0;it<300;it++){N.forEach(a=>{a.fx=a.fy=0});
for(let i=0;i<N.length;i++)for(let j=i+1;j<N.length;j++){const a=N[i],b=N[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy)||1,f=90000/(d*d);a.fx+=dx/d*f;a.fy+=dy/d*f;b.fx-=dx/d*f;b.fy-=dy/d*f}
s.e.forEach(e=>{const a=nm(e.a),b=nm(e.b),dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy)||1,f=(d-300)*.04;a.fx+=dx/d*f;a.fy+=dy/d*f;b.fx-=dx/d*f;b.fy-=dy/d*f});
N.forEach(a=>{a.x+=Math.max(-25,Math.min(25,a.fx));a.y+=Math.max(-25,Math.min(25,a.fy))})}
N.forEach(n=>{delete n.fx;delete n.fy;n.x=Math.round(n.x);n.y=Math.round(n.y)});commit();nodes();fit()}
const stg=$('#stage');
stg.addEventListener('pointerdown',ev=>{if(ev.target.closest('.rl,.res a,.res button')){const nd=ev.target.closest('.node');if(nd&&!(sel&&sel.id==nd.dataset.id))pick('n',nd.dataset.id);return}P.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});stg.setPointerCapture?.(ev.pointerId);
if(P.size==2){const[a,b]=[...P.values()];pinch={d:Math.hypot(a.x-b.x,a.y-b.y)||1,k:s.v.k,mx:(a.x+b.x)/2,my:(a.y+b.y)/2};drag=null;return}
const hd=ev.target.closest('.hd'),nd=ev.target.closest('.node'),eg=ev.target.closest('[data-e]'),b={sx:ev.clientX,sy:ev.clientY};
if(hd){drag={...b,m:'l',id:nd.dataset.id,s:+hd.dataset.s||0}}else if(nd){const n=nm(nd.dataset.id);pick('n',n.id);drag={...b,m:'n',id:n.id,ox:n.x,oy:n.y}}
else if(eg){pick('e',eg.dataset.e)}else drag={...b,m:'p',vx:s.v.x,vy:s.v.y}});
stg.addEventListener('pointermove',ev=>{if(P.has(ev.pointerId))P.set(ev.pointerId,{x:ev.clientX,y:ev.clientY});
if(pinch&&P.size==2){const[a,b]=[...P.values()],d=Math.hypot(a.x-b.x,a.y-b.y),mx=(a.x+b.x)/2,my=(a.y+b.y)/2;zoomAt(mx,my,pinch.k*d/pinch.d);s.v.x+=mx-pinch.mx;s.v.y+=my-pinch.my;pinch.mx=mx;pinch.my=my;view();return}
if(!drag)return;const dx=ev.clientX-drag.sx,dy=ev.clientY-drag.sy;if(Math.abs(dx)+Math.abs(dy)>3)drag.mv=1;
if(drag.m=='p'){s.v.x=drag.vx+dx;s.v.y=drag.vy+dy;view()}
else if(drag.m=='n'&&drag.mv){const n=nm(drag.id);n.x=drag.ox+dx/s.v.k;n.y=drag.oy+dy/s.v.k;els[n.id].style.left=n.x+'px';els[n.id].style.top=n.y+'px';edges()}
else if(drag.m=='l'){const n=nm(drag.id),e=els[n.id],p=anc(n,e,drag.s),v=NV[drag.s],[x,y]=wp(ev.clientX,ev.clientY),k=Math.min(Math.max(Math.hypot(x-p[0],y-p[1])*.4,30),160);$('#tmp').setAttribute('d',st.ec=='s'?`M${p[0]} ${p[1]}L${x} ${y}`:`M${p[0]} ${p[1]}C${p[0]+v[0]*k} ${p[1]+v[1]*k} ${x} ${y} ${x} ${y}`)}});
const up=ev=>{P.delete(ev.pointerId);if(pinch){if(P.size<2)pinch=null;drag=null;save();return}if(!drag)return;
if(drag.m=='l'){$('#tmp').removeAttribute('d');const t=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('.node');
if(t&&t.dataset.id!=drag.id&&!s.e.some(e=>(e.a==drag.id&&e.b==t.dataset.id)||(e.b==drag.id&&e.a==t.dataset.id))){const m=nm(t.dataset.id),[wx,wy]=wp(ev.clientX,ev.clientY);let sb,bd=45;for(let i=0;i<4;i++){const q=anc(m,t,i),dd=Math.hypot(q[0]-wx,q[1]-wy);if(dd<bd){bd=dd;sb=i}}s.e.push({id:uid(),a:drag.id,b:t.dataset.id,l:'',d:1,sa:drag.s,sb});commit();edges()}}
else if(drag.m=='n'&&drag.mv)commit();else if(drag.m=='p'){if(!drag.mv)pick(null);save()}drag=null};
stg.addEventListener('pointerup',up);stg.addEventListener('pointercancel',up);
stg.addEventListener('wheel',ev=>{if(ev.target.closest('.rl'))return;ev.preventDefault();if(s){zoomAt(ev.clientX,ev.clientY,s.v.k*Math.exp(-ev.deltaY*.0015));view()}},{passive:false});
stg.addEventListener('dblclick',ev=>{const t=document.elementFromPoint(ev.clientX,ev.clientY);if(s&&t&&!t.closest('.node,[data-e]')){const[x,y]=wp(ev.clientX,ev.clientY);add('obj',x-st.nw/2,y-40)}});
addEventListener('keydown',ev=>{if(!s)return;const t=ev.target.tagName,ed=t=='TEXTAREA'||t=='INPUT'||t=='SELECT';
if(ev.ctrlKey||ev.metaKey){if(ed)return;if(ev.key=='z'){ev.preventDefault();ev.shiftKey?redo():undo()}if(ev.key=='y'){ev.preventDefault();redo()}return}
if((ev.key=='Delete'||ev.key=='Backspace')&&sel&&!ed)$('#dl')?.click();if(ev.key=='Escape'){pick(null);$('#mn').classList.remove('o')}});

/* ---------- экспорт ---------- */
const dl=(h,n)=>{const a=document.createElement('a');a.href=h;a.download=n;a.click()};
function png(){if(!s.n.length)return toast('Граф пуст');const b=bounds(),pd=60,sc=2,W=b.w+pd*2,H=b.h+pd*2,c=document.createElement('canvas');c.width=W*sc;c.height=H*sc;const x=c.getContext('2d'),L=st.th=='l',fg=L?'#080808':'#f5f5f5',tx=n=>n-b.x+pd,ty=n=>n-b.y+pd;
x.scale(sc,sc);x.fillStyle=L?'#e9e9e9':'#060606';x.fillRect(0,0,W,H);x.strokeStyle=fg;x.fillStyle=fg;x.lineWidth=st.ew;
s.e.forEach(e=>{const g=shape(e);if(!g)return;x.save();x.translate(pd-b.x,pd-b.y);x.globalAlpha=.6;x.stroke(new Path2D(g.d));x.globalAlpha=1;
g.ar.forEach(p=>{x.beginPath();p.forEach(([a,c],i)=>i?x.lineTo(a,c):x.moveTo(a,c));x.closePath();x.fill()});
if(e.l){x.font=`500 11.5px '${st.f}',sans-serif`;const w=x.measureText(e.l).width+24,X=g.lx-w/2,Y=g.ly-11;x.beginPath();x.roundRect(X,Y,w,22,11);x.fillStyle=L?'#e9e9e9':'#060606';x.fill();x.globalAlpha=.4;x.stroke();x.globalAlpha=1;x.fillStyle=fg;x.textAlign='center';x.fillText(e.l,g.lx,g.ly+4);x.textAlign='left'}x.restore()});
s.n.forEach(n=>{const e=els[n.id],X=tx(n.x),Y=ty(n.y),w=e.offsetWidth,h=e.offsetHeight;x.beginPath();x.roundRect(X,Y,w,h,st.r);x.globalAlpha=.09;x.fill();x.globalAlpha=.5;x.stroke();x.globalAlpha=1;
x.font=`600 10px '${st.f}',sans-serif`;x.globalAlpha=.6;x.fillText(T[n.t][0].toUpperCase(),X+16,Y+26);x.globalAlpha=1;x.font=`600 ${st.fs}px '${st.f}',sans-serif`;
let ln=Y+52,l='';for(const wd of (n.v||'—').split(' ')){if(x.measureText(l+wd).width>w-32){x.fillText(l,X+16,ln);ln+=st.fs*1.4;l=''}l+=wd+' '}x.fillText(l,X+16,ln)});
c.toBlob(bl=>dl(URL.createObjectURL(bl),(s.name||'graph')+'.png'))}

/* ---------- верхняя панель и меню ---------- */
$('#nm').oninput=e=>{if(s){s.name=e.target.value;save()}};
$('#un').onclick=undo;$('#re').onclick=redo;
const zc=k=>{const w=$('#stage');zoomAt(w.clientWidth/2,w.clientHeight/2,k(s.v.k));view();save()};
$('#zi').onclick=()=>zc(k=>k*1.2);$('#zo').onclick=()=>zc(k=>k/1.2);$('#zl').onclick=()=>zc(()=>1);
$('#mb').onclick=()=>$('#mn').classList.toggle('o');
document.addEventListener('pointerdown',e=>{if(!e.target.closest('#mn,#mb'))$('#mn').classList.remove('o')});
$('#mn').onclick=e=>{const a=e.target.closest('button')?.dataset.a;if(!a)return;$('#mn').classList.remove('o');
if(a=='fit')fit();else if(a=='lay')layout();else if(a=='png')png();
else if(a=='json')dl(URL.createObjectURL(new Blob([JSON.stringify(s,null,1)],{type:'application/json'})),(s.name||'graph')+'.json');
else if(a=='clr'){if(!s.n.length)return;s.n=[];s.e=[];commit();sel=null;nodes();panel();toast('Граф очищен — кнопка ↶ вернёт всё назад')}
else if(a=='set')$('#set').classList.toggle('o')};
$('#dk').innerHTML=Object.entries(T).filter(([k])=>k!='result').map(([k,v])=>`<button data-t="${k}">${I(IC[k])}${v[0]}</button>`).join('');
$('#dk').onclick=e=>{const b=e.target.closest('button');if(b&&s){if(innerWidth<700)$('#set').classList.remove('o');add(b.dataset.t)}};
settings();apply();route();
