;(function () {
  'use strict'

  window.VIP_TATTOO_LOCALE = 'uk'
  const modules = ['../site-core.js', '../site-interactions.js']

  const casesAlignmentStyle = document.createElement('style')
  casesAlignmentStyle.textContent = `
    @media (min-width: 768px) {
      html[lang^="uk"] .case-fan-head {
        margin-left: -12px !important;
      }
    }
  `
  document.head.appendChild(casesAlignmentStyle)

  function finish() {
    window.__vipTat