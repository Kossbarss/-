;(function () {
  'use strict'

  const selectors = '.case-fan-card-name, #caseFanDetail h4'

  function replaceCaseName(root) {
    const scope = root && root.querySelectorAll ? root : document
    scope.querySelectorAll(selectors).forEach((node) => {
      const current = node.textContent || ''
      const next = current
        .replace(/^Лиана\b/, 'Марго')
        .replace(/^Ліана\b/, 'Марго')

      // Do not write the same value back. Rewriting unchanged text inside the
      // observed subtree creates another mutation and can lock the main thread.
      if (next !== current) node.textContent = next
    })
  }

  replaceCaseName(document)

  const targets = [
    document.getElementById('caseFanLayout'),
    document.getElementById('caseFanDetail'),
  ].filter(Boolean)

  if (!targets.length || !('MutationObserver' in window)) return

  let queued = false
  const observer = new MutationObserver(() => {
    if (queued) return
    queued = true
    queueMicrotask(() => {
      queued = false
      replaceCaseName(document)
    })
  })

  targets.forEach((target) => observer.observe(target, {
    childList: true,
    subtree: true,
  }))
})()
