;(function(){
  const isUa=location.pathname.includes('/ua/')
  const loadScript=(src)=>{
    const script=document.createElement('script')
    script.src=src
    script.async=false
    document.head.appendChild(script)
  }

  loadScript(isUa?'../legacy-effects.js':'legacy-effects.js')
  loadScript(isUa?'../pricing-effects.js':'pricing-effects.js')

  const style=document.createElement('style')
  style.dataset.feature='hero-final-gallery-layout'
  style.textContent=`
    @keyframes hero-mobile-gold-edge {
      0% { background-position: 0% 50%; }
      100% { background-position: 200% 50%; }
    }

    @media (min-width: 701px