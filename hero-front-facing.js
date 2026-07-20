;(function () {
  'use strict'

  const shell = document.querySelector('[data-hero-carousel]')
  if (!shell || shell.dataset.frontFacingCards === 'true') return

  const cards = [...shell.querySelectorAll('.hero-shot')]
  if (!cards.length) return

  shell.dataset.frontFacingCards = 'true'

  function normalizeTransform(value) {
    return String(value || '').replace(/rotateY\([^)]*\)/g, 'rotateY(0deg)')
  }

  let scheduled = false

  function normalizeCards() {
    scheduled = false
    cards.forEach((card) => {
      const current = card.style.transform
      const next = normalizeTransform(current)
      if (next !== current) card.style.transform = next
    })
  }

  function scheduleNormalize() {
    if (scheduled) return
    scheduled = true
    requestAnimationFrame(normalizeCards)
  }

  normalizeCards()

  if ('MutationObserver' in window) {
    const observer = new MutationObserver(scheduleNormalize)
    cards.forEach((card) => observer.observe(card, {
      attributes: true,
      attributeFilter: ['style'],
    }))
  }

  window.addEventListener('resize', scheduleNormalize, { passive: true })
})()
