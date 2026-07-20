;(function () {
  const prefix = location.pathname.includes('/ua/') ? '../' : ''

  const fallbackStyle = document.createElement('style')
  fallbackStyle.dataset.feature = 'hero-paper-mesh-fallback'
  fallbackStyle.textContent = `
    .hero-topline {
      background-color: #000000 !important;
      background-image:
        radial-gradient(circle at 18% 130%, rgba(6,182,212,.58) 0%, rgba(6,182,212,.18) 34%, transparent 62%),
        radial-gradient(circle at 82% 125%, rgba(249,115,22,.48) 0%, rgba(249,115,22,.14) 32%, transparent 60%),
        linear-gradient(90deg, #000000 0%, #164e63 48%, #000000 100%) !important;
    }
    .hero {
      background-color: #000000 !important;
      background-image:
        radial-gradient(ellipse at 18% 18%, #06b6d4 0%, rgba(6,182,212,.34) 24%, transparent 55%),
        radial-gradient(ellipse at 82% 24%, #f97316 0%, rgba(249,115,22,.30) 23%, transparent 54%),
        radial-gradient(ellipse at 56% 78%, #0891b2 0%, rgba(8,145,178,.28) 27%, transparent 58%),
        radial-gradient(ellipse at 40% 52%, #164e63 0%, rgba(22,78,99,.30) 31%, transparent 61%),
        linear-gradient(180deg, #000000 0%, #000000 100%) !important;
      isolation: isolate;
    }
    .hero > .hero-glow { display: none !important; }
    .hero > .container { position: relative; z-index: 1; }
    .hero .hero-panorama-fade--left { background: linear-gradient(90deg, #000000 3%, transparent 100%) !important; }
    .hero .hero-panorama-fade--right { background: linear-gradient(270deg, #000000 3%, transparent 100%) !important; }
  `
  document.head.appendChild(fallbackStyle)

  const mobileStyle = document.createElement('style')
  mobileStyle.dataset.feature = 'hero-mobile-gallery-spacing-and-gold-edge'
  mobileStyle.textContent = '@keyframes hero-mobile-gold-edge{0%{background-position:0% 50%}100%{background-position:200% 50%}}@media(min-width:701px){.hero-panorama-viewport{transform:translateY(-58px)!important}}@media(max-width:700px){.hero-panorama-shell{margin-top:28px!important;margin-bottom:calc(18vw - 28px)!important}.hero-panorama-viewport{transform:none!important}.hero-shot{overflow:hidden!important;padding:0!important;background:transparent!important}.hero-shot img{width:calc(100% + 4px)!important;height:calc(100% + 4px)!important;max-width:none!important;margin:-2px!important;border-radius:0!important;object-fit:cover!important}.hero-shot::before{content:"";position:absolute;inset:0;z-index:4;border:1px solid transparent;border-radius:inherit;background:linear-gradient(115deg,#4c3723 0%,#6a4b2b 28%,#d8bd83 48%,#8b673c 58%,#4c3723 78%,#b99557 100%) border-box;background-size:240% 240%;-webkit-mask:linear-gradient(#000 0 0) padding-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none;animation:hero-mobile-gold-edge 4.2s linear infinite}.hero-shot::after{z-index:3}}'
  document.head.appendChild(mobileStyle)

  const heroScript = document.createElement('script')
  heroScript.src = prefix + 'hero-shader-background.js'
  heroScript.async = false
  document.head.appendChild(heroScript)

  const pricingScript = document.createElement('script')
  pricingScript.src = prefix + 'pricing-reference.js'
  pricingScript.async = false
  document.head.appendChild(pricingScript)

  const legacyParticles = document.createElement('script')
  legacyParticles.src = 'https://raw.githack.com/Kossbarss/-/4dae747eee4f0c35bd612daa5779babcc4d13777/particles.js'
  legacyParticles.async = true
  document.head.appendChild(legacyParticles)
})()
