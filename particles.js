;(function(){
  const isUa=location.pathname.includes('/ua/')

  const localEffects=document.createElement('script')
  localEffects.src=isUa?'../legacy-effects.js':'legacy-effects.js'
  localEffects.async=false
  document.head.appendChild(localEffects)

  const pricingEffects=document.createElement('script')
  pricingEffects.src=isUa?'../pricing-effects.js':'pricing-effects.js'
 