/* ===========================================================
   plume2.js — palette-driven hydrothermal smoke plume.
   Smoke only: slow, fluid, continuous cloud (no node network).
   Configure per page:
     window.PLUME_CONFIG = {
       mode:'full'|'calm'|'subtle', // density + default intensity
       warm:'70,200,180',           // glowing vent base (RGB)
       cool:'120,170,205',          // diffuse upper cloud (RGB)
       intensity:0.72,              // opacity scaler (optional; mode default otherwise)
       ventXFrac:0.80               // horizontal vent position (0..1)
     }
   Requires <canvas id="sim"> in the DOM.
   =========================================================== */
(function(){
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- shared: sticky nav condense ---------- */
  var nav = document.querySelector('.nav');
  function onScroll(){ if(nav) nav.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---------- shared: staggered entrance ----------
     Only hide + animate when the doc is actually visible and motion is
     allowed (adds .anim to <html>). Otherwise base (visible) styles stand,
     so content never gets stuck invisible in a paused-timeline / hidden tab. */
  var revEls = [].slice.call(document.querySelectorAll('.reveal'));
  if(!reduce && document.visibilityState === 'visible'){
    document.documentElement.classList.add('anim');
    revEls.forEach(function(el,i){ setTimeout(function(){ el.classList.add('in'); }, 80 + i*120); });
  }

  /* ---------- the simulation ---------- */
  var canvas = document.getElementById('sim');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var cfg = window.PLUME_CONFIG || {};
  var mode = cfg.mode || 'full';
  var DENS = mode==='full'?1 : mode==='calm'?0.66 : 0.42;
  var INTENS = cfg.intensity != null ? cfg.intensity : (mode==='full'?0.72 : mode==='calm'?0.5 : 0.34);
  var VENTF = cfg.ventXFrac != null ? cfg.ventXFrac : 0.80;
  var WARM = cfg.warm || '70,200,180';
  var COOL = cfg.cool || '120,170,205';

  var w,h,dpr,ventX,ventY,plume=[];
  var U,DRIFT,TURB, aN=0.55;
  var perfScale=1, fpsAcc=0, fpsN=0, lastT=0, downshifts=0;

  function sprite(rgb){
    var s=document.createElement('canvas'); s.width=s.height=64;
    var c=s.getContext('2d'); var g=c.createRadialGradient(32,32,0,32,32,32);
    g.addColorStop(0,'rgba('+rgb+',1)'); g.addColorStop(.5,'rgba('+rgb+',.32)'); g.addColorStop(1,'rgba('+rgb+',0)');
    c.fillStyle=g; c.fillRect(0,0,64,64); return s;
  }
  var spWarm=sprite(WARM), spCool=sprite(COOL);
  function smooth(e0,e1,x){ var t=Math.max(0,Math.min(1,(x-e0)/(e1-e0))); return t*t*(3-2*t); }

  function size(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    w=canvas.width=innerWidth*dpr; h=canvas.height=innerHeight*dpr;
    canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px';
    ventX=VENTF*w; ventY=h+6*dpr;
    /* slow, liquid motion */
    U=1.05*dpr; DRIFT=0.95*dpr; TURB=0.5*dpr;
    init();
  }
  function spawnPlume(){
    return { x:ventX+(Math.random()-.5)*70*dpr, y:ventY-Math.random()*12*dpr,
      age:0, life:1200+Math.random()*900, size:(16+Math.random()*16)*dpr, seed:Math.random()*1000 };
  }
  function init(){
    var area=innerWidth*innerHeight;
    var mobile = innerWidth < 760 || (window.matchMedia && window.matchMedia('(pointer:coarse)').matches);
    var k = perfScale * DENS * (mobile ? 0.55 : 1);
    var pc=Math.round(Math.max(240, Math.min(area/15000, 680)) * k);
    plume=[]; for(var i=0;i<pc;i++){ var pp=spawnPlume(); pp.age=Math.random()*pp.life; plume.push(pp); }
    for(var s=0;s<900;s++) step(s*0.011);
  }
  function field(x,y){
    var a=Math.max(0,Math.min(1,(h-y)/h));
    var rise=Math.max(0, 1 - a/aN);
    var spread=smooth(0.10, aN*0.98, a);
    return {a:a, vx:-DRIFT*spread, vy:-U*(0.20+0.80*rise)};
  }
  function step(t){
    var i,p,f;
    /* low-frequency billowing -> smooth, liquid, continuous motion */
    for(i=0;i<plume.length;i++){
      p=plume[i]; f=field(p.x,p.y);
      p.x += f.vx + Math.sin(p.y*0.0042 + t*0.32 + p.seed)*TURB;
      p.y += f.vy + Math.cos(p.x*0.0048 + t*0.27 + p.seed*1.3)*TURB*0.42;
      p.age++;
      if(p.age>p.life || p.x<-120 || p.y<-120){ plume[i]=spawnPlume(); }
    }
  }
  function drawSprite(spr,x,y,r,alpha){ if(alpha<=0.003)return; ctx.globalAlpha=alpha; ctx.drawImage(spr, x-r, y-r, r*2, r*2); }
  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.globalCompositeOperation='lighter';
    var i,p,a,fade,hot,sz;
    for(i=0;i<plume.length;i++){
      p=plume[i]; a=Math.max(0,Math.min(1,(h-p.y)/h));
      var tt=p.age/p.life; fade=Math.sin(Math.min(1,tt)*Math.PI);
      hot=Math.max(0,1-a/0.24); sz=p.size*(1+a*2.6);
      drawSprite(spCool, p.x,p.y, sz, fade*0.085*INTENS*(0.4+0.6*smooth(0.10,aN,a)));
      drawSprite(spWarm, p.x,p.y, sz*0.78, fade*hot*0.42*INTENS);
    }
    ctx.globalAlpha=1; ctx.globalCompositeOperation='source-over';
  }

  var tsec=0;
  function frame(ts){
    tsec+=0.011; step(tsec); draw();
    if(ts && lastT){
      var dt=ts-lastT; if(dt>0&&dt<500){ fpsAcc+=dt; fpsN++; }
      if(fpsN>=90){
        var avg=fpsAcc/fpsN; fpsAcc=0; fpsN=0;
        if(avg>30 && downshifts<3){ downshifts++; plume.length=Math.round(plume.length*0.72); }
      }
    }
    lastT=ts||0;
    if(!reduce) requestAnimationFrame(frame);
  }

  size();
  window.addEventListener('resize', size);
  if(reduce){ draw(); } else { frame(); }
})();
