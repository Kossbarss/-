;(function () {
  'use strict'

  function replaceCaseName(root) {
    const scope = root && root.querySelectorAll ? root : document
    scope.querySelectorAll('.case-fan-card-name, #caseFanDetail h4').forEach((node) => {
      node.textContent = node.textContent
        .replace(/^Лиана\b/, 'Марго')
        .replace(/^Ліана\b/, 'Марго')
    })
  }

  replaceCaseName(document)

  const targets = [
    document.getElementById('caseFanLayout'),
    document.getElementById('caseFanDetail'),
  ].filter(Boolean)

  if (!targets.length || !('MutationObserver' in window)) return

  const observer = new MutationObserver(() => replaceCaseName(document))
  targets.forEach((target) => observer.observe(target, {
    childList: true,
    subtree: true,
    characterData: true,
  }))
})()
