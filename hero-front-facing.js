;(function () {
  'use strict'

  const shell = document.querySelector('[data-hero-carousel]')
  if (!shell || shell.dataset.frontFacingCards === 'true') return

  const cards = [...shell.querySelectorAll('.hero-shot')]
  if (!cards.length) return

  shell.dataset.frontFacingCards = 'true'

  const targetStyles = new WeakSet(cards.map((card) => card.style))
  const normalizeTransform = (value) => String(value || '').replace(/rotateY\([^)]*\)/g, 'rotateY(0deg)')

  let owner = CSSStyleDeclaration.prototype
  let descriptor = null

  while (owner && !descriptor) {
    descriptor = Object.getOwnPropertyDescriptor(owner, 'transform')
    if (!descriptor) owner = Object.getPrototypeOf(owner)
  }

  if (owner && descriptor && descriptor.get && descriptor.set && descriptor.configurable) {
    Object.defineProperty(owner, 'transform', {
      configurable: descriptor.configurable,
      enumerable: descriptor.enumerable,
      get: descriptor.get,
      set(value) {
        return descriptor.set.call(this, targetStyles.has(this) ? normalizeTransform(value) : value)
      },
    })
  }

  const nativeSetProperty = CSSStyleDeclaration.prototype.setProperty
  CSSStyleDeclaration.prototype.setProperty = function (property, value, priority) {
    const nextValue = targetStyles.has(this) && property === 'transform'
      ? normalizeTransform(value)
      : value
    return nativeSetProperty.call(this, property, nextValue, priority)
  }

  cards.forEach((card) => {
    card.style.transform = normalizeTransform(card.style.transform)
  })
})()
