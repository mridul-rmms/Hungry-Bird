/* ============================================================
   HUNGRY BIRD — interaction engine
   router · time-adaptive themes · mood wheel · plate cart · FX
   ============================================================ */
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const phone=$('#phone'), toastEl=$('#toast');

/* ---------- THEME (time-adaptive) ---------- */
const THEMES=['dawn','day','dusk','night'];
let themePref='auto';
function hourTheme(h=new Date().getHours()){
  if(h>=5&&h<10)return'dawn'; if(h>=10&&h<17)return'day'; if(h>=17&&h<21)return'dusk'; return'night';
}
function applyTheme(){
  const t=themePref==='auto'?hourTheme():themePref;
  phone.dataset.t=t;
  $$('.dp-themes button,[data-tset]').forEach(b=>b.classList.toggle('on',b.dataset.tset===themePref));
  const sub={dawn:"Fresh morning bites, sun-warmed palette.",day:"Bright and quick — lunch o'clock energy.",dusk:"Golden hour cravings? We're glowing.",night:"Late-night mode: neon on, kitchen open."}[t];
  const gs=$('#greetSub'); if(gs)gs.textContent=sub;
  const h=new Date().getHours(), g=h<12?'Good morning':h<17?'Good afternoon':h<21?'Good evening':'Night owl hours';
  const gt=$('#greetText'); if(gt)gt.innerHTML=g+', <em>Aarav</em>';
}
function setTheme(p){themePref=p;applyTheme();if(p!=='auto')toast('Theme · '+p,p==='night'?'#i-moon':'#i-sun');}
document.addEventListener('click',e=>{const b=e.target.closest('[data-tset]');if(b)setTheme(b.dataset.tset);});
let tCycle=['auto','day','night'];
$('#themeCycle')?.addEventListener('click',()=>{
  const i=tCycle.indexOf(themePref); setTheme(tCycle[(i+1)%tCycle.length]);
});

/* status bar clock */
function tick(){const d=new Date();let h=d.getHours(),m=String(d.getMinutes()).padStart(2,'0');
  const el=$('#sbTime'); if(el)el.textContent=`${h}:${m}`;}
tick();setInterval(tick,10000);

/* ---------- ROUTER ---------- */
const NAV_SCREENS=['s-home','s-search','s-cart','s-history','s-profile'];
let current='s-home', busy=false;
function show(id){
  if(busy||id===current)return;
  const from=document.getElementById(current), to=document.getElementById(id);
  if(!to)return; busy=true;
  const steam=id==='s-cart'&&current==='s-dish';
  const swap=()=>{from.classList.remove('active','enter','leave');to.classList.add('active','enter');
    to.scrollTop=0;current=id;busy=false;
    if(id==='s-track')startTimeline();
    if(id==='s-success')restartSuccess();
    updateReveal(to);positionBlob();};
  from.classList.add('leave');
  if(steam){playVeil();setTimeout(swap,420);}else setTimeout(swap,200);
}
function positionBlob(){
  const tabbar=$('#tabbar'), blob=$('#navBlob');
  const hideNav=!NAV_SCREENS.includes(current);
  tabbar.classList.toggle('hide',hideNav);
  const btn=$(`.tabbar button[data-tab="${current}"]`);
  $$('.tabbar button').forEach(b=>b.classList.toggle('on',b===btn));
  /* desktop sidebar active state */
  $$('.sb-item').forEach(b=>b.classList.toggle('on',b.dataset.go===current));
  const sb=$('.sidebar');if(sb)sb.classList.toggle('immersive',!NAV_SCREENS.includes(current)&&['s-onb','s-auth','s-otp'].includes(current));
  if(btn&&blob){blob.style.transform=`translateX(${btn.offsetLeft+btn.offsetWidth/2-32}px)`;}
}
document.addEventListener('click',e=>{
  const go=e.target.closest('[data-go]');
  if(go){e.stopPropagation();show(go.dataset.go);}
});

/* ---------- SCROLL REVEAL ---------- */
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}}),{root:null,threshold:.12});
function updateReveal(root=document){$$('.rv:not(.in)',root).forEach(el=>io.observe(el));}
updateReveal();

/* ---------- HERO TILT PARALLAX ---------- */
function tilt(media,img,max=10){
  if(!media||!img)return;
  const card=media.closest('.hero-card')||media;
  card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    img.style.transform=`scale(1.08) translate(${x*max}px,${y*max}px)`;
  });
  card.addEventListener('pointerleave',()=>{img.style.transform='scale(1.04)';});
}
tilt($('#heroMedia'),$('#heroImg'),14);
$$('#restHero img, #dishHero img').forEach(im=>{
  const holder=im.parentElement;
  holder.addEventListener('pointermove',e=>{const r=holder.getBoundingClientRect();
    im.style.transform=`scale(1.07) translate(${(e.clientX-r.left)/r.width*.5*18}px,${(e.clientY-r.top)/r.height*.5*10}px)`;});
  holder.addEventListener('pointerleave',()=>im.style.transform='');
});
/* subtle scroll parallax on restaurant hero */
$('#s-rest')?.addEventListener('scroll',e=>{
  const im=$('#restHero img'),y=e.target.scrollTop;
  if(im&&y<300)im.style.transform=`scale(${1+y/900}) translateY(${y*.25}px)`;
});

/* ---------- MOOD WHEEL ---------- */
const MOODS={
  comfort:{e:'🛋️',n:'Comfort',hero:{img:'/img/hero-butter.jpg',name:'Slow Butter Chicken',meta:'Dakshin Spoon · 1.4 km · ★4.8',tag:'Warm hug in a bowl',price:'₹329'},title:'Comfort classics'},
  spicy:{e:'🌶️',n:'Spicy',hero:{img:'/img/dish-tacos.jpg',name:'Smoked Ember Skewers',meta:'Ember & Smoke · 1.2 km · ★4.8',tag:'Chef’s fire pick',price:'₹289'},title:'Turn the heat up'},
  late:{e:'🌙',n:'Late-night',hero:{img:'/img/dish-ramen.jpg',name:'Midnight Ramen',meta:'Neon Wok · 800 m · ★4.8',tag:'Open till 3 AM',price:'₹349'},title:'Midnight menu'},
  healthy:{e:'🥗',n:'Healthy',hero:{img:'/img/dish-bowl.jpg',name:'Green Goddess Bowl',meta:'The Daily Bowl · 900 m · ★4.9',tag:'Under 500 kcal',price:'₹269'},title:'Clean and green'},
  celebration:{e:'🎉',n:'Celebration',hero:{img:'/img/dish-pizza.jpg',name:'Charred Margherita Party Size',meta:'Forno Nova · 1.8 km · ★4.7',tag:'Feeds 4 happily',price:'₹499'},title:'Worthy of a toast'},
  quick:{e:'⚡',n:'Quick bite',hero:{img:'/img/dish-burger.jpg',name:'Double Smash Burger',meta:'Ember & Smoke · 1.2 km · ★4.9',tag:'18 min express',price:'₹249'},title:'Fast, not furious'}
};
$('#moodDial')?.addEventListener('click',e=>{
  const b=e.target.closest('.mood-c');if(!b)return;
  const dial=$('#moodDial'),m=MOODS[b.dataset.mood];
  dial.dataset.mood=b.dataset.mood;
  $('#moodFace').textContent=m.e;$('#moodName').textContent=m.n;
  const c=$('#moodCenter');c.classList.remove('wave');void c.offsetWidth;c.classList.add('wave');
  const hero=$('#heroCard');hero.style.opacity=0;hero.style.transform='translateY(10px)';
  setTimeout(()=>{
    const img=$('#heroImg');img.classList.remove('img-fail');img.src=m.hero.img;
    $('#heroName').textContent=m.hero.name;$('#heroMeta').innerHTML=m.hero.meta.replace('★','<svg class="ic"><use href="#i-star"/></svg>');
    $('#heroTag').textContent=m.hero.tag;$('#heroPrice').textContent=m.hero.price;
    $('#feedTitle').textContent=m.title;
    hero.style.transition='all .45s cubic-bezier(.34,1.56,.64,1)';hero.style.opacity=1;hero.style.transform='';
    $('#heroMedia').scrollIntoView({behavior:'smooth',block:'nearest'});
  },220);
  vibrate(8);
});

/* ---------- CART STATE ---------- */
let cartCount=2, cartTotal=543;
const fmt=n=>'₹'+n;
function renderCartBadge(){
  const b=$('#cartBadge');if(!b)return;b.textContent=cartCount;
  b.classList.remove('pop');void b.offsetWidth;b.classList.add('pop');
  b.style.display=cartCount?'grid':'none';
  const sb=$('#sbCartBadge');if(sb){sb.textContent=cartCount;sb.style.display=cartCount?'grid':'none';}
}
function toast(msg,icon='#i-check'){
  toastEl.innerHTML=`<svg class="ic"><use href="${icon}"/></svg>${msg}`;
  toastEl.classList.add('show');clearTimeout(toastEl._t);
  toastEl._t=setTimeout(()=>toastEl.classList.remove('show'),1900);
}
function vibrate(ms){navigator.vibrate&&navigator.vibrate(ms)}
function sizzle(x,y){
  for(let i=0;i<4;i++){
    const p=document.createElement('i');p.className='fx-puff';
    p.style.cssText=`left:${x}px;top:${y}px;--dx:${(Math.random()*44-22)}px;animation-delay:${i*60}ms`;
    phone.appendChild(p);setTimeout(()=>p.remove(),900);
  }
}
function spiceConfetti(host){
  const r=host.getBoundingClientRect(),pr=phone.getBoundingClientRect();
  for(let i=0;i<14;i++){
    const s=document.createElement('i');s.className='fx-shard';
    const colors=['#F4502A','#F2A93B','#D93A2B','#E86A1F'];
    s.style.cssText=`left:${r.left-pr.left+r.width/2}px;top:${r.top-pr.top}px;--tx:${(Math.random()*160-80)}px;--ty:${40+Math.random()*90}px;--rz:${Math.random()*360}deg;background:${colors[i%4]};animation-delay:${i*25}ms`;
    phone.appendChild(s);setTimeout(()=>s.remove(),1100);
  }
}
document.addEventListener('click',e=>{
  const add=e.target.closest('[data-add]');
  if(add){
    e.stopPropagation();e.preventDefault();
    cartCount++;const r=add.getBoundingClientRect(),pr=phone.getBoundingClientRect();
    cartTotal+=+add.dataset.price;sizzle(r.left-pr.left+19,r.top-pr.top+19);
    renderCartBadge();vibrate(12);toast(`${add.dataset.name} plated`,'#i-bag');
    add.classList.add('burst');setTimeout(()=>add.classList.remove('burst'),300);
  }
  const rev=e.target.closest('.reorder-btn');
  if(rev){cartCount++;cartTotal+=+rev.dataset.price;renderCartBadge();
    toast(`${rev.dataset.name} re-plated — one tap`,'#i-bag');vibrate(10);}
});

/* cart bill recompute on steppers */
$$('#cartItems .qty-stepper').forEach(st=>{
  const [minus,plus]=st.querySelectorAll('button'),qty=st.querySelector('b');
  const item=st.closest('.cart-item');
  function recalc(){
    const rows=$$('#cartItems .cart-item');
    const items=rows.reduce((a,r)=>a+ +r.dataset.price* +r.querySelector('.qty-stepper b').textContent,0);
    const tax=Math.round(items*.09);
    $('#bItems').textContent=items;$('#bTax').textContent=tax;
    const tot=Math.max(0,items+49+tax-60);
    $('#bTotal').textContent=tot;$('#ctaTotal').textContent=tot;
  }
  minus.addEventListener('click',()=>{let q=+qty.textContent;if(q>1){qty.textContent=--q;recalc();}else{item.style.cssText='transition:.3s;opacity:0;transform:translateX(-16px)';setTimeout(()=>item.remove(),300);recalc();toast('Removed from plate','#i-minus');}});
  plus.addEventListener('click',()=>{qty.textContent=++qty.textContent;recalc();});
});

/* ---------- DISH CUSTOMIZE ---------- */
const dishState={base:289,size:0,addons:0,qty:1};
function dishPrice(){
  const t=(dishState.base+dishState.size+dishState.addons)*dishState.qty;
  $('#dishPrice')&&($('#dishPrice').textContent=fmt(dishState.base+dishState.size+dishState.addons));
  $('#ctaPrice')&&($('#ctaPrice').textContent=fmt(t));
}
$('#sizeSeg')?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  $$('#sizeSeg button').forEach(x=>x.classList.toggle('on',x===b));dishState.size=+b.dataset.d;dishPrice();vibrate(6);});
$$('#s-dish .addon input').forEach(i=>i.addEventListener('change',()=>{
  dishState.addons=$$('#s-dish .addon input:checked').reduce((a,c)=>a+ +c.dataset.d,0);dishPrice();}));
$('#spiceRow')?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  const l=+b.dataset.l;
  $$('#spiceRow button').forEach((x,i)=>x.classList.toggle('on',i<l));
  $('#spiceLabel').textContent=['Mild — just warmth','Medium — a gentle kick','Hot — nicely fiery','Inferno — respect 🌵'][l-1];
  if(l>=3)spiceConfetti($('#spiceRow'));
  vibrate(l>=3?24:8);});
$('#qtyPlus')?.addEventListener('click',()=>{$('#qtyVal').textContent=++dishState.qty;dishPrice();});
$('#qtyMinus')?.addEventListener('click',()=>{if(dishState.qty>1){$('#qtyVal').textContent=--dishState.qty;dishPrice();}});
$('#addPlateBtn')?.addEventListener('click',e=>{
  cartCount+=dishState.qty;cartTotal+=(dishState.base+dishState.size+dishState.addons)*dishState.qty;
  renderCartBadge();vibrate(18);
  const r=e.currentTarget.getBoundingClientRect(),pr=phone.getBoundingClientRect();
  sizzle(r.left-pr.left+r.width/2,r.top-pr.top);
  playVeil();setTimeout(()=>show('s-cart'),300);
});
function playVeil(){const v=$('#veil');v.classList.remove('play');void v.offsetWidth;v.classList.add('play');}

/* ---------- CHECKOUT ---------- */
$('#payList')?.addEventListener('click',e=>{
  const b=e.target.closest('.pay-item');if(!b)return;
  $$('#payList .pay-item').forEach(x=>x.classList.toggle('on',x===b));
  $('#payMode').textContent={upi:'UPI',card:'Card ••4629',wallet:'Wallet',cod:'Cash'}[b.dataset.pay];
  $('#payBtn').innerHTML=`<svg class="ic"><use href="#i-check"/></svg> ${b.dataset.pay==='cod'?'Place order':'Pay'} ₹543`;
  vibrate(6);
});
$('#tipRow')?.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;
  $$('#tipRow .chip').forEach(x=>x.classList.toggle('chip-active',x===b));});

/* ---------- SUCCESS ---------- */
function restartSuccess(){
  const check=$('.success-check'),ring=$('.ring-fg');
  [check,ring].forEach(el=>{if(!el)return;const a=el.getAnimationName?null:null;
    el.style.animation='none';void el.offsetWidth;el.style.animation='';});
  const plate=$('.success-plate');plate.style.animation='none';void plate.offsetWidth;plate.style.animation='';
}

/* ---------- TRACKING ---------- */
let tlDone=false;
function startTimeline(){
  if(tlDone)return;tlDone=true;
  $$('#timeline .t-step').forEach((s,i)=>{setTimeout(()=>s.classList.add(i<3?'done':'now'),i*450);});
  setTimeout(()=>{},1800);
}
/* route glow draw-in when entering tracking */
new MutationObserver(()=>{
  if($('#s-track').classList.contains('active')){
    const p=$('#routePath');if(p){const L=p.getTotalLength();
      p.style.strokeDasharray='14 10';p.style.opacity=1;}
  }
}).observe($('#s-track'),{attributes:true,attributeFilter:['class']});

/* ---------- CHAT ---------- */
function pushBubble(text,me=false){
  const b=document.createElement('div');b.className='bub '+(me?'me':'them');b.textContent=text;
  $('#chatBody').appendChild(b);$('#chatBody').scrollTop=1e6;
}
$('#chatSend')?.addEventListener('click',()=>{
  const inp=$('.chat-input input');if(!inp.value.trim())return;
  pushBubble(inp.value.trim(),true);inp.value='';vibrate(6);
  const t=$('#typingBubble');$('#chatBody').appendChild(t);t.style.display='flex';$('#chatBody').scrollTop=1e6;
  setTimeout(()=>{t.style.display='none';pushBubble('Got it, see you soon! 🛵');},1600);
});
$$('[data-qr]').forEach(b=>b.addEventListener('click',()=>{pushBubble(b.dataset.qr,true);vibrate(6);
  const t=$('#typingBubble');$('#chatBody').appendChild(t);t.style.display='flex';$('#chatBody').scrollTop=1e6;
  setTimeout(()=>{t.style.display='none';pushBubble('On it 👍');},1400);}));

/* ---------- OTP ---------- */
const otpInputs=$$('#otpRow input');
otpInputs.forEach((inp,i)=>{
  inp.addEventListener('input',()=>{
    inp.value=inp.value.replace(/\D/g,'');
    if(inp.value&&i<3)otpInputs[i+1].focus();
    $('#otpVerify').disabled=!otpInputs.every(x=>x.value);
  });
  inp.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!inp.value&&i>0)otpInputs[i-1].focus();});
});
let otpT=24;const otInt=setInterval(()=>{otpT=Math.max(0,otpT-1);const el=$('#otpTimer');if(el)el.textContent=otpT;if(!otpT)clearInterval(otInt);},1000);
$('#otpResend')?.addEventListener('click',()=>{otpT=24;toast('OTP resent','#i-bell');});

/* ---------- STARS / MISC ---------- */
$('#starRow')?.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  const v=+b.dataset.v;
  $$('#starRow button').forEach((x,i)=>{x.classList.toggle('on',i<v);x.classList.remove('pop');});
  b.classList.add('pop');
  $('#starLabel').textContent=['Oh no… tell us more','Meh — what went wrong?','Decent, could be hotter','Great feast!','Legends only 🔥'][v-1];
  if(v===5)spiceConfetti($('#starRow'));vibrate(v*4);});
$('#rateSubmit')?.addEventListener('click',()=>{toast('Review posted · +20 bird coins','#i-spark');vibrate(14);});
$('#scratchCard')?.addEventListener('click',function(){this.classList.add('revealed');toast('20% OFF unlocked!','#i-gift');spiceConfetti(this);vibrate(20);},{once:true});
$$('.fav-toggle').forEach(f=>f.addEventListener('click',e=>{e.stopPropagation();f.classList.toggle('on');f.classList.remove('pop');void f.offsetWidth;f.classList.add('pop');vibrate(8);}));
$$('.chip-row').forEach(row=>row.addEventListener('click',e=>{
  const c=e.target.closest('.chip');if(!c||row.id==='tipRow'||row.closest('#s-checkout .chip-row.wrap:first-of-type'))return;
  if(row.closest('#s-checkout'))return;
  $$('.chip',row).forEach(x=>x.classList.remove('chip-active'));c.classList.add('chip-active');
}));
$('#retryBtn')?.addEventListener('click',e=>{const b=e.currentTarget;b.textContent='Reconnecting…';
  setTimeout(()=>{b.textContent='Try again';toast('Back online','#i-check');},1200);});
$$('.search-field input, #searchInput').forEach(inp=>inp.addEventListener('input',()=>{
  const t=$('#searchTitle');if(t)t.textContent=inp.value?`Results for “${inp.value}”`:'Trending near you';
}));

/* ---------- DEMO PANEL ---------- */
const DP=[['onb','Onboarding ×3'],['auth','Login'],['otp','OTP'],['loc','Location'],['home','Home'],['search','Search'],['rest','Restaurant'],['dish','Customize'],['cart','Plate cart'],['checkout','Checkout'],['success','Success FX'],['track','Live tracking'],['chat','Rider chat'],['history','Orders'],['favs','Favorites'],['rewards','Rewards'],['rate','Rate & review'],['profile','Profile'],['notifs','Notifications'],['states','States'],['system','Design system']];
$('#dpGrid').innerHTML=DP.map(([id,label])=>`<button data-go="s-${id}">${label}</button>`).join('');

/* ---------- FX styles injected ---------- */
const fx=document.createElement('style');
fx.textContent=`
.fx-puff{position:absolute;z-index:58;width:10px;height:10px;border-radius:50%;pointer-events:none;
  background:radial-gradient(circle,color-mix(in srgb,var(--ink2) 40%,transparent),transparent 70%);
  animation:puff .8s ease-out forwards}
@keyframes puff{to{transform:translate(var(--dx),-58px) scale(2.6);opacity:0}}
.fx-shard{position:absolute;z-index:58;width:9px;height:13px;border-radius:2.5px;pointer-events:none;
  animation:shard .9s var(--ease) forwards}
@keyframes shard{0%{transform:translate(0,0) rotate(0);opacity:1}100%{transform:translate(var(--tx),var(--ty)) rotate(var(--rz));opacity:0}}
`;
document.head.appendChild(fx);

/* ---------- INIT ---------- */
applyTheme();renderCartBadge();
$('#s-home').classList.add('active');
window.addEventListener('load',positionBlob);
window.addEventListener('resize',positionBlob);
positionBlob();
