;(function () {
  'use strict'

  window.VIP_TATTOO_LOCALE = 'uk'
  const modules = ['../site-core.js', '../site-interactions.js', '../site-cases.js']

  function load(index) {
    if (index >= modules.length) {
      window.__vipTattooAppReady = true
      document.dispatchEvent(new CustomEvent('vip:app-ready'))
      return
    }

    const script = document.createElement('script')
    script.src = modules[index]
    script.async = false
    script.dataset.vipAppModule = modules[index]
    script.addEventListener('load', () => load(index + 1), { once: true })
    script.addEventListener('error', () => {
      console.error('[VIP Tattoo] Failed to load app module:', modules[index])
      load(index + 1)
    }, { once: true })
    document.head.appendChild(script)
  }

  load(0)
})()
