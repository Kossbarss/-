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

// ---------- Hero 3D photo carousel (autoplay + mouse/touch drag) ----------
document.querySelectorAll('[data-hero-carousel]').forEach((shell) => {
  const cylinder = shell.querySelector('.hero-panorama')
  const cards = [...shell.querySelectorAll('.hero-shot')]
  if (!cylinder || cards.length < 3) return

  let rotation = -(360 / cards.length) * 2
  let dragVelocity = 0
  let dragging = false
  let pointerX = 0
  let lastFrame = performance.now()
  let visible = true

  function layoutCarousel() {
    const compact = window.matchMedia('(max-width: 700px)').matches
    const cylinderWidth = compact ? 1100 : 1800
    const faceWidth = cylinderWidth / cards.length
    const radius = cylinderWidth / (2 * Math.PI)
    const angle = 360 / cards.length

    shell.style.setProperty('--hero-cylinder-width', `${cylinderWidth}px`)
    shell.style.setProperty('--hero-face-width', `${faceWidth}px`)
    cards.forEach((card, index) => {
      card.style.transform = `translate(-50%, -50%) rotateY(${index * angle}deg) translateZ(${radius}px)`
    })
  }

  function render() {
    cylinder.style.transform = `rotateY(${rotation}deg)`
  }

  function animate(now) {
    const delta = Math.min(now - lastFrame, 40)
    lastFrame = now
    if (visible && !dragging) {
      rotation += delta * 0.004
      rotation += dragVelocity
      dragVelocity *= 0.94
      if (Math.abs(dragVelocity) < 0.002) dragVelocity = 0
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
    const rotationDelta = deltaX * 0.08
    rotation += rotationDelta
    dragVelocity = rotationDelta * 0.12
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
    rotation += event.key === 'ArrowLeft' ? 18 : -18
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

// ---------- Sticky bar urgency countdown (short, resets every visit, spelled out in words) ----------
const STICKY_COUNTDOWN_MS = (10 * 60 + 40) * 1000 // 10 minutes 40 seconds
const stickyDeadline = Date.now() + STICKY_COUNTDOWN_MS

function pluralUa(n, [one, few, many]) {
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
  const minWord = pluralUa(minutes, ['хвилина', 'хвилини', 'хвилин'])
  const secWord = pluralUa(seconds, ['секунда', 'секунди', 'секунд'])
  return `${minutes} ${minWord} та ${seconds} ${secWord}`
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
  '8 тижнів навчання',
  '40+ годин практики',
  '300+ випускників',
  'Сертифікат VIP Tattoo School',
  'Довічний доступ до записів',
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
    name: 'Ліана, 24 роки',
    module: 'До / Після · Модуль 5',
    text: 'Перша тату на моделі під наглядом ментора — рівна лінія без тремтіння з першого разу.',
    stat: '3 клієнти за перший тиждень',
  },
  {
    idx: '02',
    name: 'Максим, 31 рік',
    module: 'До / Після · Модуль 7',
    text: 'Перейшов з малювання на папері одразу до кольорової роботи — портфоліо за 2 місяці.',
    stat: '12 робіт у портфоліо',
  },
  {
    idx: '03',
    name: 'Оля, 27 років',
    module: 'До / Після · Модуль 9',
    text: 'Знайшла перших клієнтів через Instagram ще до завершення курсу, за шаблоном з бонусів.',
    stat: '30+ заявок, 5 продажів',
  },
  {
    idx: '04',
    name: 'Дмитро, 29 років',
    module: 'До / Після · Модуль 6',
    text: 'Освоїв лайнворк і штрихування з нуля, викладач розібрав його техніку на трьох особистих дзвінках.',
    stat: '8 робіт за місяць практики',
  },
  {
    idx: '05',
    name: 'Настя, 22 роки',
    module: 'До / Після · Модуль 4',
    text: 'Прийшла без художнього досвіду — після блоку з композиції взяла першу платну роботу.',
    stat: 'Перший клієнт на 3 тижні',
  },
  {
    idx: '06',
    name: 'Карина, 34 роки',
    module: 'До / Після · Модуль 8',
    text: 'Змінила професію у 34 — курс підтягнув саме те, чого бракувало для переходу в колір і реалізм.',
    stat: '15 робіт у портфоліо',
  },
  {
    idx: '07',
    name: 'Марта, 26 років',
    module: 'До / Після · Модуль 10',
    text: 'Пройшла курс повністю дистанційно, дипломну роботу розбирали на випускному дзвінку з ментором.',
    stat: '20+ заявок після випуску',
  },
  {
    idx: '08',
    name: 'Артем, 33 роки',
    module: 'До / Після · Модуль 5',
    text: 'Раніше малював тільки скетчі для себе — на курсі вперше набив тату другу під контролем ментора.',
    stat: 'Перша оплачена робота на 4 тижні',
  },
  {
    idx: '09',
    name: 'Юля, 25 років',
    module: 'До / Після · Модуль 8',
    text: 'Боялась кольору — блок з колірної теорії та розбір робіт зняли страх, тепер колір у кожній третій роботі.',
    stat: '10 кольорових робіт за 2 місяці',
  },
  {
    idx: '10',
    name: 'Богдан, 27 років',
    module: 'До / Після · Модуль 7',
    text: 'Прийшов з графічного дизайну — перенесення композиції на шкіру далося легко, спеціалізація в геометрії.',
    stat: '18 робіт у портфоліо',
  },
  {
    idx: '11',
    name: 'Соня, 30 років',
    module: 'До / Після · Модуль 9',
    text: 'Поєднувала навчання з основною роботою — вечорами розбирала уроки, до випуску набрала першу чергу клієнтів.',
    stat: 'Запис на 3 тижні наперед',
  },
  {
    idx: '12',
    name: 'Ігор, 36 років',
    module: 'До / Після · Модуль 6',
    text: 'Змінив професію після 15 років в іншій сфері — курс дав впевненість працювати зі справжньою шкірою з першого тижня.',
    stat: '6 клієнтів за перший місяць',
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
