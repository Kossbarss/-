;(function () {
  'use strict'

  if (window.__vipTattooCoreLoaded) return
  window.__vipTattooCoreLoaded = true

  const isUk = window.VIP_TATTOO_LOCALE === 'uk' || document.documentElement.lang === 'uk'
  const contacts = {
    instagram: 'https://www.instagram.com/viktoriia_ponikarova?igsh=MWZya3dvY215dGFocA==',
    telegram: 'https://t.me/tattoo_adminbot',
    mentorship: 'https://t.me/mentor_tatoo_Viktoria_bot',
  }
  const copy = isUk ? {
    expired: 'Уточніть актуальну ціну',
    order: 'Оформити участь у Telegram',
    orderNote: 'Telegram відкриється в новій вкладці. Адміністратор уточнить формат участі та оплату.',
    instagram: 'Instagram Вікторії Понікарової',
    telegram: 'Telegram-адміністратор VIP tattoo school',
    footerContact: 'Зв’язок з адміністратором',
    carousel: 'Фотогалерея навчання VIP tattoo school',
    previousCase: 'Попередній кейс',
    nextCase: 'Наступний кейс',
  } : {
    expired: 'Уточните актуальную цену',
    order: 'Оформить участие в Telegram',
    orderNote: 'Telegram откроется в новой вкладке. Администратор уточнит формат участия и оплату.',
    instagram: 'Instagram Виктории Поникаровой',
    telegram: 'Telegram-администратор VIP tattoo school',
    footerContact: 'Связаться с администратором',
    carousel: 'Фотогалерея обучения VIP tattoo school',
    previousCase: 'Предыдущий кейс',
    nextCase: 'Следующий кейс',
  }

  function setExternalLink(link, href, label) {
    if (!link) return
    link.href = href
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    if (label) link.setAttribute('aria-label', label)
  }

  function focusableElements(container) {
    return [...container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true')
  }

  function trapFocus(event, container) {
    if (event.key !== 'Tab') return
    const focusable = focusableElements(container)
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  window.VIP_TATTOO_APP = { isUk, contacts, copy, setExternalLink, focusableElements, trapFocus }

  document.querySelectorAll('a[aria-label="Instagram"]').forEach((link) => setExternalLink(link, contacts.instagram, copy.instagram))
  document.querySelectorAll('a[aria-label="Telegram"]').forEach((link) => setExternalLink(link, contacts.telegram, copy.telegram))
  document.querySelectorAll('.lang-toggle-opt.is-active[href="#"]').forEach((link) => {
    link.href = window.location.href.split('#')[0]
    link.setAttribute('aria-current', 'page')
  })

  const legalPlaceholder = [...document.querySelectorAll('.footer p')].find((node) => /0000000000/.test(node.textContent || ''))
  if (legalPlaceholder) {
    legalPlaceholder.replaceChildren()
    const adminLink = document.createElement('a')
    adminLink.className = 'legal-link'
    adminLink.textContent = copy.footerContact
    setExternalLink(adminLink, contacts.telegram, copy.telegram)
    legalPlaceholder.appendChild(adminLink)
  }

  document.querySelectorAll('.order-form, .popup-form').forEach((form) => {
    form.removeAttribute('onsubmit')
    form.classList.add('direct-order-form')
    form.setAttribute('aria-label', copy.order)
    form.replaceChildren()

    const orderLink = document.createElement('a')
    orderLink.className = 'btn btn-stardust btn-block'
    orderLink.innerHTML = `<span class="btn-stardust-wrap">${copy.order}</span>`
    setExternalLink(orderLink, contacts.mentorship, copy.order)

    const note = document.createElement('p')
    note.className = 'contact-note'
    note.textContent = copy.orderNote
    form.append(orderLink, note)
    form.addEventListener('submit', (event) => event.preventDefault())
  })

  const DEADLINE_KEY = 'vipTattooDeadline'
  const DEADLINE_WINDOW_MS = 5 * 24 * 60 * 60 * 1000
  function getDeadline() {
    try {
      const stored = Number(localStorage.getItem(DEADLINE_KEY))
      if (Number.isFinite(stored) && stored > 0) return stored
      const next = Date.now() + DEADLINE_WINDOW_MS
      localStorage.setItem(DEADLINE_KEY, String(next))
      return next
    } catch (_) {
      window.__vipTattooFallbackDeadline ||= Date.now() + DEADLINE_WINDOW_MS
      return window.__vipTattooFallbackDeadline
    }
  }
  const deadline = getDeadline()
  const pad = (value) => String(value).padStart(2, '0')
  function formatClock(ms) {
    if (ms <= 0) return copy.expired
    const days = Math.floor(ms / 86400000)
    const hours = Math.floor((ms % 86400000) / 3600000)
    const minutes = Math.floor((ms % 3600000) / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${days ? `${days}д ` : ''}${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }
  function updateClocks() {
    const text = formatClock(deadline - Date.now())
    ;['heroClock', 'stickyClock', 'popupClock', 'miniClock'].forEach((id) => {
      const node = document.getElementById(id)
      if (node) node.textContent = text
    })
  }
  updateClocks()
  window.setInterval(updateClocks, 1000)

  const hero = document.querySelector('.hero')
  const stickyBar = document.getElementById('stickyBar')
  if (stickyBar) {
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => stickyBar.classList.toggle('is-visible', !entry.isIntersecting), { threshold: 0.04 }).observe(hero)
    } else {
      stickyBar.classList.add('is-visible')
    }
  }

  const ribbonTrack = document.getElementById('ribbonTrack')
  if (ribbonTrack) {
    const items = isUk
      ? ['8 тижнів навчання', '40+ годин практики', '300+ випускників', 'Сертифікат VIP Tattoo School', 'Довічний доступ до записів']
      : ['8 недель обучения', '40+ часов практики', '300+ выпускников', 'Сертификат VIP Tattoo School', 'Пожизненный доступ к записям']
    ribbonTrack.replaceChildren()
    ;[...items, ...items].forEach((text) => {
      const item = document.createElement('span')
      item.append(document.createTextNode(text))
      const dot = document.createElement('span')
      dot.className = 'dot'
      dot.textContent = ' ✦ '
      item.appendChild(dot)
      ribbonTrack.appendChild(item)
    })
  }

  const topicsTrack = document.getElementById('topicsTrack')
  if (topicsTrack && !topicsTrack.dataset.duplicated) {
    topicsTrack.dataset.duplicated = 'true'
    ;[...topicsTrack.children].forEach((child) => topicsTrack.appendChild(child.cloneNode(true)))
  }
})()
