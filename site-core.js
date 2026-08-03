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
    order: 'Оформити участь у Telegram',
    orderNote: 'Telegram відкриється в новій вкладці. Адміністратор уточнить формат участі та оплату.',
    instagram: 'Instagram Вікторії Понікарової',
    telegram: 'Telegram-адміністратор VIP tattoo school',
    carousel: 'Фотогалерея навчання VIP tattoo school',
    previousCase: 'Попередній кейс',
    nextCase: 'Наступний кейс',
  } : {
    order: 'Оформить участие в Telegram',
    orderNote: 'Telegram откроется в новой вкладке. Администратор уточнит формат участия и оплату.',
    instagram: 'Instagram Виктории Поникаровой',
    telegram: 'Telegram-администратор VIP tattoo school',
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

  document.querySelectorAll('.order-form, .popup-form').forEach((form) => {
    form.removeAttribute('onsubmit')
    form.classList.add('direct-order-form')
    form.setAttribute('aria-label', copy.order)
    form.replaceChildren()

    const orderLink = document.createElement('a')
    orderLink.className = 'btn btn-stardust btn-block'
    const orderText = document.createElement('span')
    orderText.className = 'btn-stardust-wrap'
    orderText.textContent = copy.order
    orderLink.appendChild(orderText)
    setExternalLink(orderLink, contacts.mentorship, copy.order)

    const note = document.createElement('p')
    note.className = 'contact-note'
    note.textContent = copy.orderNote
    form.append(orderLink, note)
    form.addEventListener('submit', (event) => event.preventDefault())
  })

  const hero = document.querySelector('.hero')
  const stickyBar = document.getElementById('stickyBar')
  if (stickyBar) {
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => stickyBar.classList.toggle('is-visible', !entry.isIntersecting), { threshold: 0.04 }).observe(hero)
    } else {
      stickyBar.classList.add('is-visible')
    }
  }

  const stickyClock = document.getElementById('stickyClock')
  if (stickyClock) {
    const duration = (10 * 60 + 40) * 1000
    const deadline = Date.now() + duration

    function plural(value, forms) {
      const lastTwo = value % 100
      const last = value % 10
      if (lastTwo >= 11 && lastTwo <= 14) return forms[2]
      if (last === 1) return forms[0]
      if (last >= 2 && last <= 4) return forms[1]
      return forms[2]
    }

    function formatRemaining(ms) {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000))
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = totalSeconds % 60
      const minuteForms = isUk ? ['хвилина', 'хвилини', 'хвилин'] : ['минута', 'минуты', 'минут']
      const secondForms = isUk ? ['секунда', 'секунди', 'секунд'] : ['секунда', 'секунды', 'секунд']
      const joiner = isUk ? 'та' : 'и'
      return `${minutes} ${plural(minutes, minuteForms)} ${joiner} ${seconds} ${plural(seconds, secondForms)}`
    }

    function updateStickyClock() {
      const remaining = deadline - Date.now()
      stickyClock.textContent = formatRemaining(remaining)
      return remaining > 0
    }

    updateStickyClock()
    const timerId = window.setInterval(() => {
      if (!updateStickyClock()) window.clearInterval(timerId)
    }, 1000)
  }

  const ribbonTrack = document.getElementById('ribbonTrack')
  if (ribbonTrack) {
    const items = isUk
      ? ['8 тижнів навчання', '40+ годин практики', '300+ випускників', 'Сертифікат VIP Tattoo School', 'Довічний доступ до записів', '11+ країн, де цінують роботи', 'Особистий фідбек від куратора', 'Практика на моделях']
      : ['8 недель обучения', '40+ часов практики', '300+ выпускников', 'Сертификат VIP Tattoo School', 'Пожизненный доступ к записям', '11+ стран, где ценят работы', 'Личная обратная связь от куратора', 'Практика на моделях']
    const assetsPrefix = isUk ? '../assets/' : 'assets/'
    ribbonTrack.replaceChildren()
    ;[...items, ...items].forEach((text) => {
      const item = document.createElement('span')
      item.append(document.createTextNode(text))
      const dot = document.createElement('span')
      dot.className = 'dot'
      const dotLogo = document.createElement('img')
      dotLogo.src = `${assetsPrefix}logo-mark-black.png`
      dotLogo.alt = ''
      dotLogo.setAttribute('aria-hidden', 'true')
      dotLogo.width = 22
      dotLogo.height = 22
      dot.appendChild(dotLogo)
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
