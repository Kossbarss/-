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
  const stickyClock = document.getElementById('stickyClock')
  if (heroClock) heroClock.textContent = text
  if (stickyClock) stickyClock.textContent = text
}

tickCountdown()
setInterval(tickCountdown, 1000)

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

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq-item').forEach((item) => {
  const question = item.querySelector('.faq-question')
  question.addEventListener('click', () => {
    item.classList.toggle('open')
  })
})

// ---------- Mobile nav ----------
const navToggle = document.getElementById('navToggle')
const mobileNav = document.getElementById('mobileNav')
if (navToggle && mobileNav) {
  navToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('open')
    navToggle.textContent = mobileNav.classList.contains('open') ? '✕' : '☰'
  })
}

// ---------- Sticky bar close ----------
const stickyBar = document.getElementById('stickyBar')
const stickyClose = document.getElementById('stickyClose')
if (stickyClose && stickyBar) {
  stickyClose.addEventListener('click', () => {
    stickyBar.style.display = 'none'
    document.body.style.paddingBottom = '0'
  })
}
