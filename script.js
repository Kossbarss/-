;(function () {
  'use strict'

  window.VIP_TATTOO_LOCALE = 'ru'
  const modules = ['site-core.js', 'site-interactions.js']

  function clearCasesComponents() {
    const wrap = document.querySelector('.case-fan-wrap')
    if (wrap) {
      const mount = document.createElement('div')
      mount.id = 'caseComponentMount'
      mount.className = 'case-component-mount'
      wrap.replaceChildren(mount)
    }
    document.querySelector('.case-fan-cta')?.remove()
  }

  function finish() {
    clearCasesComponents()
    window.__vipTattooAppReady = true
    document.dispatchEvent(new CustomEvent('vip:app-ready'))
  }

  function load(index) {
    if (index >= modules.length) {
      finish()
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
