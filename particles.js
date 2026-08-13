;(function () {
  'use strict'

  if (window.__vipTattooEffectsLoaderStarted) return
  window.__vipTattooEffectsLoaderStarted = true

  const prefix = location.pathname.includes('/ru/') ? '../' : ''
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // hero-shader-background.js has its own <script> tag (loaded early,
  // in parallel with script.js) instead of going through this chain --
  // it doesn't depend on site-core.js/site-interactions.js at all, and
  // waiting for the vip:app-ready chain to finish first was adding a
  // few hundred ms of pure network/parse delay before the hero
  // background could even start.
  const modules = [
    'pricing-reference.js',
  ]
  if (!reducedMotion) modules.push('legacy-effects.js')

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
