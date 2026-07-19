// ---------- Countdown (persisted per visitor, not reset on reload) ----------
const DEADLINE_KEY = 'vipTattooDeadline'
const DEADLINE_WINDOW_MS = 5 * 24 * 60 * 60 * 1000 // 5 days from first visit

function getDeadline() {
  let stored = localStorage.getItem(DEADLINE_KEY)
  if (!stored) {
    stored = String(Date.now() + DEADLINE_WINDOW_MS)
    localStorage.setItem(DEADLINE_KEY, stored)
  }
  return parseInt(stored, 10)
}

function formatRemaining(ms) {
  if (ms <= 0) return '00:00:00'
  const days = Math.floor(ms / 86400000)
  const hours = Math.floor((ms % 86400000) / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const pad = (n) => String(n).padStart(2, '0')
  return (days > 0 ? `${days}д ` : '') + `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

function tickCountdown() {
  const remaining = getDeadline() - Date.now()
  const text = formatRemaining(remaining)
  const heroClock = document.getElementById('heroClock')
  if (heroClock) heroClock.textContent = text
}

tickCountdown()
setInterval(tickCountdown, 1000)

// ---------- Hero panorama: curved desktop strip + flat mobile strip ----------
document.querySelectorAll('[data-hero-carousel]').forEach((shell) => {
  const cards = [...shell.querySelectorAll('.hero-shot')]
  if (cards.length < 3) return

  let step = 220
  let offset = 0
  let dragVelocity = 0
  let dragging = false
  let pointerX = 0
  let lastFrame = performance.now()
  let visible = true
  let compact = false
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function layoutCarousel() {
    compact = window.matchMedia('(max-width: 700px)').matches
    step = compact
      ? window.innerWidth * 0.4
      : Math.min(238, Math.max(196, window.innerWidth * 0.128))
    offset = -2 * step
    render()
  }

  function render() {
    const span = cards.length * step
    cards.forEach((card, index) => {
      const rawX = index * step + offset
      const x = ((rawX + span / 2) % span + span) % span - span / 2
      const distance = Math.abs(x / step)

      if (compact) {
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, 0, 0)`
        card.style.opacity = distance <= 2.05 ? '1' : '0'
        card.style.filter = 'none'
      } else {
        const curve = Math.min(distance, 4.5)
        const y = 0
        const depth = Math.max(0, 1 - curve / 4)
        const z = -depth * 60
        const rotation = Math.max(-18, Math.min(18, (x / (step * 4)) * 18))
        const scale = 0.64 + Math.min(curve / 4, 1) * 0.36
        const brightness = Math.max(0.64, 1 - curve * 0.07)
        card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotation}deg) scale(${scale})`
        card.style.opacity = distance <= 5.2 ? '1' : '0'
        card.style.filter = `brightness(${brightness})`
      }
      card.style.zIndex = String(20 - Math.round(distance))
    })
  }

  function animate(now) {
    const delta = Math.min(now - lastFrame, 40)
    lastFrame = now
    if (visible && !dragging) {
      if (!reducedMotion) offset -= delta * (compact ? 0.018 : 0.024)
      offset += dragVelocity
      dragVelocity *= 0.93
      if (Math.abs(dragVelocity) < 0.01) dragVelocity = 0
      render()
    }
    requestAnimationFrame(animate)
  }

  shell.addEventListener('pointerdown', (event) => {
    dragging = true
    pointerX = event.clientX
    dragVelocity = 0
    shell.classList.add('is-dragging')
    shell.setPointerCapture(event.pointerId)
  })

  shell.addEventListener('pointermove', (event) => {
    if (!dragging) return
    const deltaX = event.clientX - pointerX
    pointerX = event.clientX
    offset += deltaX
    dragVelocity = deltaX * 0.13
    render()
  })

  function releasePointer() {
    dragging = false
    shell.classList.remove('is-dragging')
  }

  shell.addEventListener('pointerup', releasePointer)
  shell.addEventListener('pointercancel', releasePointer)
  shell.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    offset += event.key === 'ArrowLeft' ? step : -step
    render()
  })

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
    }, { threshold: 0.05 }).observe(shell)
  }

  layoutCarousel()
  render()
  window.addEventListener('resize', layoutCarousel, { passive: true })
  requestAnimationFrame(animate)
})

const heroSection = document.querySelector('.hero')
const stickyBar = document.getElementById('stickyBar')
if (heroSection && stickyBar && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    stickyBar.classList.toggle('is-visible', !entry.isIntersecting)
  }, { threshold: 0.04 }).observe(heroSection)
} else if (stickyBar) {
  stickyBar.classList.add('is-visible')
}

// ---------- Sticky bar urgency countdown (short, resets every visit, spelled out in words) ----------
const STICKY_COUNTDOWN_MS = (10 * 60 + 40) * 1000 // 10 minutes 40 seconds
const stickyDeadline = Date.now() + STICKY_COUNTDOWN_MS

function pluralRu(n, [one, few, many]) {
  const n10 = n % 10
  const n100 = n % 100
  if (n100 >= 11 && n100 <= 14) return many
  if (n10 === 1) return one
  if (n10 >= 2 && n10 <= 4) return few
  return many
}

function formatStickyRemaining(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const minWord = pluralRu(minutes, ['минута', 'минуты', 'минут'])
  const secWord = pluralRu(seconds, ['секунда', 'секунды', 'секунд'])
  return `${minutes} ${minWord} и ${seconds} ${secWord}`
}

function tickStickyCountdown() {
  const text = formatStickyRemaining(stickyDeadline - Date.now())
  const stickyClock = document.getElementById('stickyClock')
  if (stickyClock) stickyClock.textContent = text
  const popupClock = document.getElementById('popupClock')
  if (popupClock) popupClock.textContent = text
  const miniClock = document.getElementById('miniClock')
  if (miniClock) miniClock.textContent = text
}

tickStickyCountdown()
setInterval(tickStickyCountdown, 1000)

// ---------- Ribbon marquee (kept from MCMM) ----------
const ribbonStats = [
  '8 недель обучения',
  '40+ часов практики',
  '300+ выпускников',
  'Сертификат VIP Tattoo School',
  'Пожизненный доступ к записям',
]

const ribbonTrack = document.getElementById('ribbonTrack')
if (ribbonTrack) {
  const items = [...ribbonStats, ...ribbonStats]
    .map((s) => `<span>${s}<span class="dot"> ✦ </span></span>`)
    .join('')
  ribbonTrack.innerHTML = items
}

// ---------- Vertical topics scroller (duplicated for a seamless loop) ----------
const topicsTrack = document.getElementById('topicsTrack')
if (topicsTrack) {
  topicsTrack.innerHTML += topicsTrack.innerHTML
}

// ---------- FAQ accordion (single-open, like Radix Accordion type="single") ----------
const faqItems = document.querySelectorAll('.faq-item-big')
faqItems.forEach((item, index) => {
  const trigger = item.querySelector('.faq-trigger-big')
  if (index === 0) item.classList.add('open')
  trigger.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open')
    faqItems.forEach((other) => other.classList.remove('open'))
    if (!wasOpen) item.classList.add('open')
  })
})

// ---------- Mobile nav (full-screen overlay) ----------
const navToggle = document.getElementById('navToggle')
const mobileNav = document.getElementById('mobileNav')
const mobileNavClose = document.getElementById('mobileNavClose')

function setMobileNavOpen(open) {
  mobileNav.classList.toggle('open', open)
  navToggle.classList.toggle('on', open)
  document.body.classList.toggle('nav-open', open)
}

if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    setMobileNavOpen(!mobileNav.classList.contains('open'))
  })
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', () => setMobileNavOpen(false))
  }
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMobileNavOpen(false))
  })
}

// ---------- Popup (lead-capture modal, opened from the sticky bar) ----------
const stickyBarTrigger = document.getElementById('stickyBarTrigger')
const popupOverlay = document.getElementById('popupOverlay')
const popupCard = document.getElementById('popupCard')
const popupClose = document.getElementById('popupClose')

function setPopupOpen(open) {
  popupOverlay.classList.toggle('open', open)
  popupCard.classList.toggle('open', open)
  document.body.classList.toggle('popup-open', open)
}

if (stickyBarTrigger && popupOverlay && popupCard) {
  stickyBarTrigger.addEventListener('click', () => setPopupOpen(true))
  stickyBarTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setPopupOpen(true)
    }
  })
  if (popupClose) popupClose.addEventListener('click', () => setPopupOpen(false))
  popupOverlay.addEventListener('click', () => setPopupOpen(false))
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setPopupOpen(false)
  })
}

// ---------- Case studies fan carousel ----------
const caseStudies = [
  {
    idx: '01',
    name: 'Лиана, 24 года',
    module: 'До / После · Модуль 5',
    text: 'Первая тату на модели под наблюдением ментора — ровная линия без дрожи с первого раза.',
    stat: '3 клиента за первую неделю',
  },
  {
    idx: '02',
    name: 'Максим, 31 год',
    module: 'До / После · Модуль 7',
    text: 'Перешёл от рисования на бумаге сразу к цветной работе — портфолио за 2 месяца.',
    stat: '12 работ в портфолио',
  },
  {
    idx: '03',
    name: 'Оля, 27 лет',
    module: 'До / После · Модуль 9',
    text: 'Нашла первых клиентов через Instagram ещё до завершения курса, по шаблону из бонусов.',
    stat: '30+ заявок, 5 продаж',
  },
  {
    idx: '04',
    name: 'Дмитрий, 29 лет',
    module: 'До / После · Модуль 6',
    text: 'Освоил лайнворк и штриховку с нуля, преподаватель разобрал его технику на трёх личных созвонах.',
    stat: '8 работ за месяц практики',
  },
  {
    idx: '05',
    name: 'Настя, 22 года',
    module: 'До / После · Модуль 4',
    text: 'Пришла без художественного опыта — после блока по композиции взяла первую платную работу.',
    stat: 'Первый клиент на 3 неделе',
  },
  {
    idx: '06',
    name: 'Карина, 34 года',
    module: 'До / После · Модуль 8',
    text: 'Сменила профессию в 34 — курс подтянул именно то, чего не хватало для перехода в цвет и реализм.',
    stat: '15 работ в портфолио',
  },
  {
    idx: '07',
    name: 'Марта, 26 лет',
    module: 'До / После · Модуль 10',
    text: 'Прошла курс полностью удалённо, дипломную работу разбирали на выпускном созвоне с ментором.',
    stat: '20+ заявок после выпуска',
  },
  {
    idx: '08',
    name: 'Артём, 33 года',
    module: 'До / После · Модуль 5',
    text: 'Раньше рисовал только скетчи для себя — на курсе впервые набил тату другу под контролем ментора.',
    stat: 'Первая оплаченная работа на 4 неделе',
  },
  {
    idx: '09',
    name: 'Юля, 25 лет',
    module: 'До / После · Модуль 8',
    text: 'Боялась цвета — блок по цветовой теории и разбор работ снял страх, теперь цвет в каждой третьей работе.',
    stat: '10 цветных работ за 2 месяца',
  },
  {
    idx: '10',
    name: 'Богдан, 27 лет',
    module: 'До / После · Модуль 7',
    text: 'Пришёл из графического дизайна — перенос композиции на кожу дался легко, специализация в геометрии.',
    stat: '18 работ в портфолио',
  },
  {
    idx: '11',
    name: 'Соня, 30 лет',
    module: 'До / После · Модуль 9',
    text: 'Совмещала обучение с основной работой — по вечерам разбирала уроки, к выпуску набрала первую очередь клиентов.',
    stat: 'Запись на 3 недели вперёд',
  },
  {
    idx: '12',
    name: 'Игорь, 36 лет',
    module: 'До / После · Модуль 6',
    text: 'Сменил профессию после 15 лет в другой сфере — курс дал уверенность работать с реальной кожей с первой недели.',
    stat: '6 клиентов за первый месяц',
  },
]

const caseFanLayout = document.getElementById('caseFanLayout')

if (caseFanLayout) {
  const caseFanDetail = document.getElementById('caseFanDetail')
  const caseFanNav = document.getElementById('caseFanNav')
  const caseFanDots = document.getElementById('caseFanDots')
  const caseFanPrev = document.getElementById('caseFanPrev')
  const caseFanNext = document.getElementById('caseFanNext')

  const MAX_VISIBLE = 7

  // rot(deg), scale, x(rem), y(rem), z-index — the hand-tuned 7-slot fan
  // geometry, used verbatim once there are enough cases to fill it
  const FAN_POSITIONS = [
    { rot: -21, scale: 0.7756, x: -9.5, y: 2.3, z: 1 },
    { rot: -14, scale: 0.8498, x: -7.0, y: 1.3, z: 2 },
    { rot: -7, scale: 0.9346, x: -3.5, y: 0.4, z: 3 },
    { rot: 0, scale: 1.0, x: 0, y: 0, z: 10 },
    { rot: 7, scale: 0.9346, x: 3.5, y: 0.4, z: 3 },
    { rot: 14, scale: 0.8498, x: 7.0, y: 1.3, z: 2 },
    { rot: 21, scale: 0.7756, x: 9.5, y: 2.3, z: 1 },
  ]

  // fallback for fewer than 7 cards: same proportions, scaled down to
  // however many are actually on screen
  function getSlotConfig(totalVisible, slot) {
    if (totalVisible >= MAX_VISIBLE) return FAN_POSITIONS[slot]
    const center = totalVisible >> 1
    const distance = totalVisible > 1 ? (slot - center) / (center || 1) : 0
    const abs = Math.abs(distance)
    return {
      rot: distance * 21,
      scale: 1 - 0.2244 * abs * abs,
      x: distance * 9.5,
      y: abs * abs * 2.3,
      z: 10 - Math.abs(slot - center),
    }
  }

  const needsPagination = caseStudies.length > MAX_VISIBLE
  let centerIndex = Math.floor(caseStudies.length / 2)
  let focusedSlot = null

  function renderDetail(item) {
    caseFanDetail.innerHTML = `
      <span class="case-fan-detail-module">${item.module}</span>
      <h4>${item.name}</h4>
      <p>${item.text}</p>
      <div class="case-stat">${item.stat}</div>
    `
  }

  function applyLayout() {
    const cards = caseFanLayout.querySelectorAll('.case-fan-card')
    const visibleCount = cards.length
    const centerSlot = (visibleCount - 1) / 2

    cards.forEach((card) => {
      const slot = Number(card.dataset.slot)
      const base = getSlotConfig(visibleCount, slot)
      let x = base.x
      let y = base.y
      let rot = base.rot
      let scale = base.scale

      if (focusedSlot !== null) {
        const distance = Math.abs(slot - focusedSlot)
        if (slot === focusedSlot) {
          y -= 0.9
          scale *= 1.1
        } else {
          const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0
          const push = 2.6 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance))
          if (slot < focusedSlot) {
            x -= push
            rot -= 3 / (distance + 1)
          } else {
            x += push
            rot += 3 / (distance + 1)
          }
        }
      }

      card.style.transform = `translate(-50%, -50%) translate(${x}rem, ${y}rem) rotate(${rot}deg) scale(${scale})`
      card.classList.toggle('is-focused', focusedSlot === slot)
      card.style.zIndex = focusedSlot === slot ? 20 : base.z
    })
  }

  function render() {
    caseFanLayout.innerHTML = ''
    caseFanDots.innerHTML = ''
    focusedSlot = null

    const visibleCount = Math.min(caseStudies.length, MAX_VISIBLE)
    const half = Math.floor(visibleCount / 2)

    caseStudies.forEach((_, i) => {
      const dot = document.createElement('span')
      dot.className = 'case-fan-dot' + (i === centerIndex ? ' is-active' : '')
      caseFanDots.appendChild(dot)
    })

    for (let slot = 0; slot < visibleCount; slot++) {
      const dataIndex = ((centerIndex + slot - half) % caseStudies.length + caseStudies.length) % caseStudies.length
      const item = caseStudies[dataIndex]
      const card = document.createElement('div')
      card.className = 'case-fan-card'
      card.dataset.slot = String(slot)
      card.innerHTML = `
        <div class="case-fan-card-visual">
          <div class="case-fan-card-label">
            <span class="case-fan-card-index">/${item.idx}</span>
            <span class="case-fan-card-name">${item.name}</span>
          </div>
        </div>
      `
      card.addEventListener('mouseenter', () => {
        focusedSlot = slot
        renderDetail(item)
        applyLayout()
      })
      card.addEventListener('mouseleave', () => {
        focusedSlot = null
        renderDetail(caseStudies[centerIndex])
        applyLayout()
      })
      caseFanLayout.appendChild(card)
    }

    renderDetail(caseStudies[centerIndex])
    caseFanNav.hidden = !needsPagination
    applyLayout()
  }

  if (caseFanPrev) {
    caseFanPrev.addEventListener('click', () => {
      centerIndex = (centerIndex - 1 + caseStudies.length) % caseStudies.length
      render()
    })
  }
  if (caseFanNext) {
    caseFanNext.addEventListener('click', () => {
      centerIndex = (centerIndex + 1) % caseStudies.length
      render()
    })
  }

  render()
}

// ---------- Avatar tooltip tilt + tap-to-open (touch has no hover) ----------
const avatarTips = document.querySelectorAll('.avatar-tip')
avatarTips.forEach((tip) => {
  const avatar = tip.querySelector('.avatar')
  avatar.addEventListener('mousemove', (e) => {
    const rect = avatar.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const rot = Math.max(-20, Math.min(20, (offsetX / (rect.width / 2)) * 20))
    tip.style.setProperty('--tip-rot', rot + 'deg')
  })
  avatar.addEventListener('mouseleave', () => {
    tip.style.setProperty('--tip-rot', '0deg')
  })
  avatar.addEventListener('click', (e) => {
    e.stopPropagation()
    const wasActive = tip.classList.contains('is-active')
    avatarTips.forEach((t) => t.classList.remove('is-active'))
    tip.classList.toggle('is-active', !wasActive)
  })
})
document.addEventListener('click', () => {
  avatarTips.forEach((t) => t.classList.remove('is-active'))
})
