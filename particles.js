;(function () {
  'use strict'

  if (window.__vipTattooEffectsLoaderStarted) return
  window.__vipTattooEffectsLoaderStarted = true

  const prefix = location.pathname.includes('/ua/') ? '../' : ''
  const modules = [
    'hero-shader-background.js',
    'pricing-reference.js',
    'legacy-effects.js',
  ]

  function load(index) {
    if (index >= modules.length) {
      window.__vipTattooEffectsLoaded = true
      return
    }

    const script = document.createElement('script')
    script.src = prefix + modules[index]
    script.async = false
    script.dataset.vipEffectModule = modules[index]
    script.addEventListener('load', () => load(index + 1), { once: true })
    script.addEventListener('error', () => {
      console.error('[VIP Tattoo] Failed to load visual module:', modules[index])
      load(index + 1)
    }, { once: true })
    document.head.appendChild(script)
  }

  function start() {
    if (window.__vipTattooEffectsLoadRequested) return
    window.__vipTattooEffectsLoadRequested = true
    load(0)
  }

  if (window.__vipTattooAppReady) start()
  else document.addEventListener('vip:app-ready', start, { once: true })
})()
