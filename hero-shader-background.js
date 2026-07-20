// Reference-inspired animated background for the existing hero only.
;(function () {
  function initHeroShader() {
    const hero = document.querySelector('.hero')
    if (!hero || hero.dataset.shaderReady === 'true') return

    const stats = hero.querySelector('.hero-stats')
    hero.dataset.shaderReady = 'true'
    hero.classList.add('hero-shader-active')

    const