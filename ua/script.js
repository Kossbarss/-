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

// ---------- Sticky bar urgency countdown (short, resets every visit, spelled out in words) ----------
const STICKY_COUNTDOWN_MS = 15 * 60 * 1000 // 15 minutes
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
  return `${minutes} ${minWord} ${seconds} ${secWord}`
}

function tickStickyCountdown() {
  const stickyClock = document.getElementById('stickyClock')
  if (!stickyClock) return
  stickyClock.textContent = formatStickyRemaining(stickyDeadline - Date.now())
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

