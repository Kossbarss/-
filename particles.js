;(function () {
  const prefix = location.pathname.includes('/ua/') ? '../' : ''

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
