const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
// Scroll fluido (Lenis, se caricato)
if(window.Lenis&&!reduce){const l=new Lenis({lerp:.09});(function r(t){l.raf(t);requestAnimationFrame(r)})(0)}
// Transizione tra pagine: tendina
const c=$('#curtain');
const open=()=>{c.style.transition='transform 1s cubic-bezier(.76,0,.24,1)';c.style.transform='translateY(-100%)';document.body.classList.add('ready')};
addEventListener('pageshow',()=>setTimeout(open,100));
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');if(!a||a.target||e.metaKey||e.ctrlKey)return;
  const u=new URL(a.href,location);
  if(!/^(https?|file):/.test(u.protocol)||u.origin!==location.origin||(u.pathname===location.pathname&&u.hash))return;
  e.preventDefault();c.style.transition='none';c.style.transform='translateY(100%)';c.offsetHeight;
  c.style.transition='transform .8s cubic-bezier(.76,0,.24,1)';c.style.transform='translateY(0)';
  setTimeout(()=>location.href=a.href,820);
});
// Header, menu, reveal
const h=$('#site-header');addEventListener('scroll',()=>h.classList.toggle('scrolled',scrollY>20),{passive:true});
const mb=$('#menu-btn'),mm=$('#mobile-menu');mb&&mb.addEventListener('click',()=>mb.setAttribute('aria-expanded',!mm.classList.toggle('hidden')));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>io.observe(el));
// Cursore personalizzato + pillole che seguono il mouse
const cur=$('#cursor');let tx=0,ty=0,x=0,y=0;
if(cur&&matchMedia('(hover:hover)').matches){
  addEventListener('mousemove',e=>{tx=e.clientX;ty=e.clientY;
    $$('[data-depth]').forEach(el=>el.style.translate=`${(tx/innerWidth-.5)*el.dataset.depth}px ${(ty/innerHeight-.5)*el.dataset.depth}px`)});
  document.addEventListener('mouseover',e=>cur.classList.toggle('big',!!e.target.closest('[data-cursor]')));
  (function l(){x+=(tx-x)*.2;y+=(ty-y)*.2;cur.style.transform=`translate(${x}px,${y}px)`;requestAnimationFrame(l)})();
}
// Effetti legati allo scroll: parallax, showreel che si allarga, schede che si aprono a ventaglio
const sp=$$('[data-speed]'),gr=$$('[data-grow]'),fan=$('#fan'),clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
(function tick(){const vh=innerHeight;
  sp.forEach(el=>{const r=el.parentElement.getBoundingClientRect();el.style.transform=`translateY(${(r.top+r.height/2-vh/2)*-el.dataset.speed}px) scale(1.18)`});
  gr.forEach(el=>{const r=el.getBoundingClientRect();el.style.transform=`scale(${.84+.16*clamp((vh-r.top)/(vh*.8),0,1)})`});
  if(fan){const p=clamp((vh-fan.getBoundingClientRect().top)/(vh*.9),0,1);
    [...fan.children].forEach((el,i)=>el.style.transform=`translateX(${(i-1)*90*p}px) rotate(${(i-1)*13*p}deg)`)}
  requestAnimationFrame(tick)})();
// Confronto wireframe / render
$$('.cmp').forEach(b=>b.querySelector('input').addEventListener('input',e=>b.style.setProperty('--p',e.target.value+'%')));
const y2=$('#year');y2&&y2.append(new Date().getFullYear());
// Immagini mancanti: nascondi l'icona rotta e il testo alternativo, resta il riquadro colorato
$$('img').forEach(i=>{const hide=()=>i.style.visibility='hidden';(i.complete&&!i.naturalWidth)?hide():i.addEventListener('error',hide)});
