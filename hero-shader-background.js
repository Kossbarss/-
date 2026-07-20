// Stable dual-mesh background for the existing hero only.
;(function(){
  function init(){
    const hero=document.querySelector('.hero');
    if(!hero||hero.dataset.meshReady==='true')return;
    hero.dataset.meshReady='true';
    hero.classList.add('hero-mesh-active');

    const layer=document.createElement('div');
    layer.className='hero-mesh-layer';
    layer.setAttribute('aria-hidden','true');
    layer.innerHTML='<span class="hero-mesh-base"></span><span class="hero-mesh-wire"></span><span class="hero-mesh-shade"></span>';
    hero.insertBefore(layer,hero.firstChild);

    const style=document.createElement('style');
    style.dataset.feature='hero-mesh-background-v2';
    style.textContent=`
      .hero-mesh-active{position:relative;isolation:isolate;background:#020304!important;overflow:hidden}
      .hero-mesh-layer{position:absolute;inset:0 0 auto;height:var(--hero-mesh-height,100vh);z-index:0;overflow:hidden;pointer-events:none;background:#020304}
      .hero-mesh-layer>span{position:absolute;inset:-14%;display:block;pointer-events:none;will-change:transform,background-position}
      .hero-mesh-base{background:
        radial-gradient(ellipse at 18% 22%,rgba(6,182,212,.78) 0,rgba(6,182,212,.34) 24%,transparent 54%),
        radial-gradient(ellipse at 82% 28%,rgba(249,115,22,.75) 0,rgba(249,115,22,.30) 25%,transparent 55%),
        radial-gradient(ellipse at 58% 76%,rgba(8,145,178,.65) 0,rgba(8,145,178,.25) 27%,transparent 58%),
        radial-gradient(ellipse at 38% 52%,rgba(22,78,99,.72) 0,rgba(22,78,99,.26) 30%,transparent 62%),#020304;
        background-size:125% 125%,130% 130%,140% 140%,135% 135%;
        animation:heroMeshBase 16s ease-in-out infinite alternate}
      .hero-mesh-wire{opacity:.48;mix-blend-mode:screen;background:
        radial-gradient(ellipse at 30% 35%,transparent 0 31%,rgba(255,255,255,.08) 32%,transparent 34%),
        radial-gradient(ellipse at 72% 42%,transparent 0 28%,rgba(6,182,212,.10) 29%,transparent 31%),
        radial-gradient(ellipse at 52% 72%,transparent 0 34%,rgba(249,115,22,.09) 35%,transparent 37%);
        background-size:68% 74%,72% 78%,82% 88%;
        animation:heroMeshWire 20s linear infinite}
      .hero-mesh-shade{inset:0;background:linear-gradient(180deg,rgba(0,0,0,.38) 0%,rgba(0,0,0,.12) 30%,rgba(0,0,0,.24) 68%,rgba(0,0,0,.62) 100%)}
      .hero-mesh-active>.hero-glow{opacity:0!important}
      .hero-mesh-active>.container{position:relative;z-index:2}
      .hero-mesh-active .hero-panorama-fade--left{background:linear-gradient(90deg,rgba(2,3,4,.96) 3%,rgba(2,3,4,0) 100%)}
      .hero-mesh-active .hero-panorama-fade--right{background:linear-gradient(270deg,rgba(2,3,4,.96) 3%,rgba(2,3,4,0) 100%)}
      @keyframes heroMeshBase{0%{transform:translate3d(-3%,-2%,0) scale(1.03);filter:saturate(1.05)}50%{transform:translate3d(2%,1%,0) scale(1.08);filter:saturate(1.18)}100%{transform:translate3d(4%,-1%,0) scale(1.04);filter:saturate(1.1)}}
      @keyframes heroMeshWire{from{transform:rotate(0deg) scale(1.04);background-position:0% 0%,100% 0%,50% 100%}to{transform:rotate(360deg) scale(1.08);background-position:100% 100%,0% 100%,50% 0%}}
      @media(max-width:700px){.hero-mesh-layer{height:var(--hero-mesh-height,100vh)}.hero-mesh-base{animation-duration:20s}.hero-mesh-wire{opacity:.34;animation-duration:26s}.hero-mesh-shade{background:linear-gradient(180deg,rgba(0,0,0,.44),rgba(0,0,0,.16) 34%,rgba(0,0,0,.30) 72%,rgba(0,0,0,.68))}}
      @media(prefers-reduced-motion:reduce){.hero-mesh-base,.hero-mesh-wire{animation:none!important}}
    `;
    document.head.appendChild(style);

    function sizeLayer(){
      const stats=hero.querySelector('.hero-stats');
      const heroRect=hero.getBoundingClientRect();
      let height=Math.max(window.innerHeight,720);
      if(stats){const statsRect=stats.getBoundingClientRect();height=Math.max(height,statsRect.bottom-heroRect.top+24)}
      hero.style.setProperty('--hero-mesh-height',Math.ceil(height)+'px');
    }
    sizeLayer();
    window.addEventListener('resize',sizeLayer,{passive:true});
    if('ResizeObserver'in window)new ResizeObserver(sizeLayer).observe(hero);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
