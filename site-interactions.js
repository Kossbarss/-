;(function () {
  'use strict'

  if (window.__vipTattooInteractionsLoaded) return
  window.__vipTattooInteractionsLoaded = true

  const app = window.VIP_TATTOO_APP
  if (!app) return
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  document.querySelectorAll('[data-hero-carousel]').forEach((shell) => {
    const cards = [...shell.querySelectorAll('.hero-shot')]
    if (cards.length < 3) return

    let step = 220
    let offset = 0
    let velocity = 0
    let dragging = false
    let pointerX = 0
    let compact = false
    let visible = true
    let frameId = 0
    let lastFrame = performance.now()

    shell.setAttribute('aria-roledescription', 'carousel')
    shell.setAttribute('aria-label', app.copy.carousel)

    function render() {
      const span = cards.length * step
      cards.forEach((card, index) => {
        const rawX = index * step + offset
        const x = ((rawX + span / 2) % span + span) % span - span / 2
        const distance = Math.abs(x / step)
        const curve = Math.min(distance, 4.5)
        const depth = Math.max(0, 1 - curve / 4)
        const z = compact ? 0 : -depth * 60
        const scale = compact ? 1 : 0.64 + Math.min(curve / 4, 1) * 0.36
        const brightness = compact ? 1 : Math.max(0.64, 1 - curve * 0.07)

        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, ${z}px) rotateY(0deg) scale(${scale})`
        card.style.opacity = distance <= (compact ? 2.05 : 5.2) ? '1' : '0'
        card.style.filter = `brightness(${brightness})`
        card.style.zIndex = String(20 - Math.round(distance))
        card.setAttribute('aria-hidden', distance <= (compact ? 2.05 : 5.2) ? 'false' : 'true')
      })
    }

    function layout({ preservePosition = true } = {}) {
      compact = window.matchMedia('(max-width: 700px)').matches
      step = compact ? window.innerWidth * 0.4 : Math.min(238, Math.max(196, window.innerWidth * 0.128))
      if (!preservePosition || !Number.isFinite(offset)) offset = -2 * step
      render()
    }

    function stopAnimation() {
      if (frameId) cancelAnimationFrame(frameId)
      frameId = 0
    }

    function animate(now) {
      if (!visible || document.hidden) {
        stopAnimation()
        return
      }
      const delta = Math.min(Math.max(now - lastFrame, 0), 40)
      lastFrame = now
      if (!dragging) {
        if (!reducedMotion) offset -= delta * (compact ? 0.018 : 0.024)
        offset += velocity
        velocity *= 0.93
        if (Math.abs(velocity) < 0.01) velocity = 0
        render()
      }
      frameId = requestAnimationFrame(animate)
    }

    function startAnimation() {
      if (frameId || !visible || document.hidden || reducedMotion) return
      lastFrame = performance.now()
      frameId = requestAnimationFrame(animate)
    }

    function releasePointer(event) {
      dragging = false
      shell.classList.remove('is-dragging')
      if (event && shell.hasPointerCapture?.(event.pointerId)) shell.releasePointerCapture(event.pointerId)
      startAnimation()
    }

    shell.addEventListener('pointerdown', (event) => {
      dragging = true
      pointerX = event.clientX
      velocity = 0
      stopAnimation()
      shell.classList.add('is-dragging')
      shell.setPointerCapture?.(event.pointerId)
    })
    shell.addEventListener('pointermove', (event) => {
      if (!dragging) return
      const deltaX = event.clientX - pointerX
      pointerX = event.clientX
      offset += deltaX
      velocity = deltaX * 0.13
      render()
    })
    shell.addEventListener('pointerup', releasePointer)
    shell.addEventListener('pointercancel', releasePointer)
    shell.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home'].includes(event.key)) return
      event.preventDefault()
      if (event.key === 'Home') offset = -2 * step
      else offset += event.key === 'ArrowLeft' ? step : -step
      render()
    })

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        if (visible) startAnimation()
        else stopAnimation()
      }, { threshold: 0.05 }).observe(shell)
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAnimation()
      else startAnimation()
    })
    window.addEventListener('resize', () => layout({ preservePosition: true }), { passive: true })
    window.addEventListener('pagehide', stopAnimation, { once: true })

    layout({ preservePosition: false })
    if (!reducedMotion) startAnimation()
  })

  document.querySelectorAll('.faq-item-big').forEach((item, index, items) => {
    const trigger = item.querySelector('.faq-trigger-big')
    const panel = item.querySelector('.faq-panel-big')
    if (!trigger || !panel) return
    const panelId = panel.id || `faq-panel-${index + 1}`
    panel.id = panelId
    trigger.setAttribute('aria-controls', panelId)

    function setOpen(open) {
      item.classList.toggle('open', open)
      trigger.setAttribute('aria-expanded', String(open))
      panel.setAttribute('aria-hidden', String(!open))
    }

    setOpen(index === 0)
    trigger.addEventListener('click', () => {
      const open = trigger.getAttribute('aria-expanded') !== 'true'
      items.forEach((other) => {
        const otherTrigger = other.querySelector('.faq-trigger-big')
        const otherPanel = other.querySelector('.faq-panel-big')
        other.classList.remove('open')
        otherTrigger?.setAttribute('aria-expanded', 'false')
        otherPanel?.setAttribute('aria-hidden', 'true')
      })
      if (open) setOpen(true)
    })
  })

  const navToggle = document.getElementById('navToggle')
  const mobileNav = document.getElementById('mobileNav')
  const mobileNavClose = document.getElementById('mobileNavClose')
  let navReturnFocus = null

  if (navToggle && mobileNav) {
    mobileNav.setAttribute('role', 'dialog')
    mobileNav.setAttribute('aria-modal', 'true')
    mobileNav.setAttribute('aria-label', navToggle.getAttribute('aria-label') || 'Menu')
    mobileNav.setAttribute('aria-hidden', 'true')
    navToggle.setAttribute('aria-controls', 'mobileNav')
    navToggle.setAttribute('aria-expanded', 'false')

    function setMobileNavOpen(open) {
      mobileNav.classList.toggle('open', open)
      navToggle.classList.toggle('on', open)
      document.body.classList.toggle('nav-open', open)
      navToggle.setAttribute('aria-expanded', String(open))
      mobileNav.setAttribute('aria-hidden', String(!open))
      if (open) {
        navReturnFocus = document.activeElement
        ;(mobileNavClose || app.focusableElements(mobileNav)[0])?.focus()
      } else if (navReturnFocus instanceof HTMLElement) {
        navReturnFocus.focus()
      }
    }

    navToggle.addEventListener('click', () => setMobileNavOpen(!mobileNav.classList.contains('open')))
    mobileNavClose?.addEventListener('click', () => setMobileNavOpen(false))
    mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMobileNavOpen(false)))
    mobileNav.addEventListener('keydown', (event) => app.trapFocus(event, mobileNav))
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mobileNav.classList.contains('open')) setMobileNavOpen(false)
    })
  }

  let stickyTrigger = document.getElementById('stickyBarTrigger')
  if (stickyTrigger && stickyTrigger.tagName !== 'BUTTON') {
    const button = document.createElement('button')
    button.type = 'button'
    button.id = stickyTrigger.id
    button.className = stickyTrigger.className
    button.innerHTML = stickyTrigger.innerHTML
    button.setAttribute('aria-haspopup', 'dialog')
    stickyTrigger.replaceWith(button)
    stickyTrigger = button
  }

  const popupOverlay = document.getElementById('popupOverlay')
  const popupCard = document.getElementById('popupCard')
  const popupClose = document.getElementById('popupClose')
  let popupReturnFocus = null

  if (stickyTrigger && popupOverlay && popupCard) {
    popupOverlay.setAttribute('aria-hidden', 'true')
    popupCard.setAttribute('aria-hidden', 'true')

    function setPopupOpen(open) {
      popupOverlay.classList.toggle('open', open)
      popupCard.classList.toggle('open', open)
      document.body.classList.toggle('popup-open', open)
      popupOverlay.setAttribute('aria-hidden', String(!open))
      popupCard.setAttribute('aria-hidden', String(!open))
      if (open) {
        popupReturnFocus = document.activeElement
        ;(popupClose || app.focusableElements(popupCard)[0])?.focus()
      } else if (popupReturnFocus instanceof HTMLElement) {
        popupReturnFocus.focus()
      }
    }

    stickyTrigger.addEventListener('click', () => setPopupOpen(true))
    popupClose?.addEventListener('click', () => setPopupOpen(false))
    popupOverlay.addEventListener('click', () => setPopupOpen(false))
    popupCard.addEventListener('keydown', (event) => app.trapFocus(event, popupCard))
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && popupCard.classList.contains('open')) setPopupOpen(false)
    })
  }

  document.querySelectorAll('.avatar-tip').forEach((tip) => {
    const avatar = tip.querySelector('.avatar')
    if (!avatar) return
    if (!avatar.hasAttribute('tabindex')) avatar.tabIndex = 0
    avatar.setAttribute('aria-expanded', 'false')

    avatar.addEventListener('mousemove', (event) => {
      if (reducedMotion) return
      const rect = avatar.getBoundingClientRect()
      const offsetX = event.clientX - rect.left - rect.width / 2
      const rotation = Math.max(-20, Math.min(20, (offsetX / (rect.width / 2)) * 20))
      tip.style.setProperty('--tip-rot', `${rotation}deg`)
    })
    avatar.addEventListener('mouseleave', () => tip.style.setProperty('--tip-rot', '0deg'))

    function toggle() {
      const next = !tip.classList.contains('is-active')
      document.querySelectorAll('.avatar-tip').forEach((other) => {
        other.classList.remove('is-active')
        other.querySelector('.avatar')?.setAttribute('aria-expanded', 'false')
      })
      tip.classList.toggle('is-active', next)
      avatar.setAttribute('aria-expanded', String(next))
    }
    avatar.addEventListener('click', (event) => {
      event.stopPropagation()
      toggle()
    })
    avatar.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        toggle()
      }
    })
  })
  document.addEventListener('click', () => {
    document.querySelectorAll('.avatar-tip').forEach((tip) => {
      tip.classList.remove('is-active')
      tip.querySelector('.avatar')?.setAttribute('aria-expanded', 'false')
    })
  })

  // Certificate image sizing/position: on the two-column desktop layout,
  // keep the gap above the image (to the first checklist row) and below it
  // (to the last checklist row) equal at GAP px, at every width — not just
  // the reference width the numbers were tuned at. A fixed CSS margin only
  // matches one width; the checklist's own height changes whenever its
  // text re-wraps at a narrower column, so this recomputes the image's
  // height (to always exactly span the checklist) and margin-top (to
  // start GAP px above it) from live measurements instead.
  ;(function () {
    const mount = document.querySelector('.certificate-tilt-mount')
    const checklist = document.querySelector('.certificate-checklist')
    const copy = document.querySelector('.certificate-copy')
    if (!mount || !checklist || !copy) return
    const GAP = 60
    const desktopQuery = window.matchMedia('(min-width: 1024px)')
    let naturalRatio = 0 // width / height of the certificate image itself

    function sync() {
      if (!desktopQuery.matches) {
        mount.style.maxWidth = ''
        mount.style.marginTop = ''
        return
      }
      const rows = checklist.querySelectorAll('.check-row')
      if (!rows.length) return
      const firstRowTop = rows[0].getBoundingClientRect().top
      const lastRowBottom = rows[rows.length - 1].getBoundingClientRect().bottom
      const copyTop = copy.getBoundingClientRect().top
      const targetHeight = lastRowBottom - firstRowTop
      if (!(targetHeight > 0)) return
      if (!naturalRatio) {
        const img = mount.querySelector('img')
        const r = mount.getBoundingClientRect()
        if (img && img.naturalWidth && r.height > 0) naturalRatio = r.width / r.height
      }
      if (naturalRatio) mount.style.maxWidth = `${Math.round(targetHeight * naturalRatio)}px`
      mount.style.marginTop = `${(firstRowTop - GAP - copyTop).toFixed(2)}px`
    }

    let resizeTimer = 0
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(sync, 120)
    })
    new ResizeObserver(() => sync()).observe(checklist)
    const img = mount.querySelector('img')
    if (img) {
      if (img.complete) sync()
      else img.addEventListener('load', sync, { once: true })
    }
    sync()
  })()

  // Section-edge glare: a solid-color outline of the section's actual
  // top-corner shape (so it genuinely curves through the rounded corners)
  // revealed through a soft moving gradient mask — dim, brightening to a
  // full-strength core, dimming again — rather than a flat dash. The mask
  // is a plain horizontal gradient, which is a very close approximation
  // of "distance along the path" here since the corner radius is small
  // next to the path's total length. Drifts slowly and constantly on its
  // own, independent of scroll.
  if (!reducedMotion) {
    const WINDOW_WIDTH = 130
    const BASE_SPEED = 0.12
    let uid = 0
    const glares = [...document.querySelectorAll('.section-edge-glare')].map((svg) => {
      uid += 1
      const gradientId = `glare-gradient-${uid}`
      const maskId = `glare-mask-${uid}`
      const path = svg.querySelector('.section-edge-glare-path')
      const radius = parseFloat(svg.dataset.radius) || 24

      const defs = document.createElementNS(svg.namespaceURI, 'defs')
      defs.innerHTML = `
        <linearGradient id="${gradientId}" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#fff" stop-opacity="0" />
          <stop offset="50%" stop-color="#fff" stop-opacity="1" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
        <mask id="${maskId}" maskUnits="userSpaceOnUse">
          <rect class="glare-mask-rect" y="-10" height="1000" fill="url(#${gradientId})" />
        </mask>
      `
      svg.prepend(defs)
      path.setAttribute('mask', `url(#${maskId})`)
      const gradient = defs.querySelector('linearGradient')
      const rect = defs.querySelector('rect')
      return { svg, path, gradient, rect, radius, length: 0, pos: 0 }
    })
    if (glares.length) {
      function layout(g) {
        const width = g.svg.getBoundingClientRect().width
        if (!(width > 0)) return
        const r = g.radius
        g.path.setAttribute(
          'd',
          `M0,${r} A${r},${r} 0 0 1 ${r},0 L${Math.max(r, width - r)},0 A${r},${r} 0 0 1 ${width},${r}`
        )
        g.svg.setAttribute('viewBox', `0 0 ${width} ${r + 6}`)
        g.length = width
        g.rect.setAttribute('width', String(WINDOW_WIDTH))
      }
      glares.forEach(layout)

      let resizeTimer = 0
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer)
        resizeTimer = setTimeout(() => glares.forEach(layout), 150)
      })

      function tick() {
        glares.forEach((g) => {
          if (!g.length) return
          const span = g.length + WINDOW_WIDTH * 2
          g.pos = (g.pos + BASE_SPEED) % span
          const x = g.pos - WINDOW_WIDTH
          g.gradient.setAttribute('x1', String(x))
          g.gradient.setAttribute('x2', String(x + WINDOW_WIDTH))
          g.rect.setAttribute('x', String(x))
        })
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
  }
})()
