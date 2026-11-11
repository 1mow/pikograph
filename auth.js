'use strict';
(async()=>{
 const el=id=>document.getElementById(id),status=el('auth-message');
 async function request(url,options){const r=await fetch(url,options);const j=await r.json();if(!r.ok)throw Error(j.error||'Не удалось выполнить запрос');return j}
 async function login(){el('login-start').disabled=true;status.textContent='Создаём персональную ссылку…';try{const j=await request('/api/auth/start',{method:'POST'});el('bot-link').href=j.url;el('bot-link').textContent='Открыть бота с персональным кодом входа';status.textContent='Нажмите ссылку ниже, отправьте /start и подтвердите подписку.';el('bot-link').focus()}catch(e){status.textContent=e.message}finally{el('login-start').disabled=false}}
 el('login-start').onclick=login;
 let user;try{({user}=await request('/api/me'))}catch{status.textContent='Сервер недоступен. Запустите сайт через server.py.'}
 if(!user)return;
 function load(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.body.append(s)})}
 try{await load('search-upgrade.js');await load('app.js')}catch{status.textContent='Не удалось загрузить приложение. Обновите страницу.';return}
 document.body.classList.remove('auth-pending');el('auth-gate').hidden=true;
 el('profile-name').textContent=[user.first_name,user.last_name].filter(Boolean).join(' ')||'Пользователь Telegram';
 el('profile-username').textContent=user.username?'@'+user.username:'Username не указан';
 const avatar=el('profile-avatar');avatar.onerror=()=>{avatar.hidden=true};avatar.src='/api/avatar';
 document.querySelectorAll('.profile-open').forEach(b=>b.onclick=()=>el('profile-dialog').showModal());
 el('profile-close').onclick=()=>el('profile-dialog').close();
 el('logout').onclick=async()=>{try{await fetch('/api/auth/logout',{method:'POST'});location.reload()}catch{el('profile-username').textContent='Не удалось выйти. Проверьте сеть.'}};
})();
