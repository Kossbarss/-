// Footer logo particle animation — lightweight Canvas 2D adaptation of a
// Three.js "star shockwaves" reference: particles sample the brand mark
// instead of a star, click/hold triggers a radial shockwave, four color
// themes (Molten/Cosmic/Emerald + our VIP burgundy-gold) are switchable.
;(function () {
  const canvas = document.getElementById('logoParticles')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  const size = 300
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = size * dpr
  canvas.height = size * dpr
  canvas.style.width = size + 'px'
  canvas.style.height = size + 'px'
  ctx.scale(dpr, dpr)

  const themes = {
    molten: ['#ff4800', '#ff8c00', '#d73a00', '#ffc600'],
    cosmic: ['#6a0dad', '#9370db', '#4b0082', '#dda0dd'],
    emerald: ['#00ff7f', '#3cb371', '#2e8b57', '#98fb98'],
    vip: ['#c9a24a', '#e8d5a8', '#a3162e', '#7a0f22'],
  }
  let currentTheme = 'vip'
  let animating = true
  let time = 0
  let particles = []
  let shockwaves = []

  function hexToRgb(hex) {
    const v = parseInt(hex.slice(1), 16)
    return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 }
  }

  function lerpColor(palette, t) {
    const n = palette.length
    const scaled = ((t % 1) + 1) % 1 * n
    const i0 = Math.floor(scaled) % n
    const i1 = (i0 + 1) % n
    const f = scaled - Math.floor(scaled)
    const c0 = hexToRgb(palette[i0])
    const c1 = hexToRgb(palette[i1])
    return {
      r: c0.r + (c1.r - c0.r) * f,
      g: c0.g + (c1.g - c0.g) * f,
      b: c0.b + (c1.b - c0.b) * f,
    }
  }

  function sampleLogoPoints(img, count) {
    const off = document.createElement('canvas')
    off.width = 200
    off.height = 200
    const octx = off.getContext('2d')
    octx.drawImage(img, 0, 0, 200, 200)
    const data = octx.getImageData(0, 0, 200, 200).data
    const pts = []
    for (let y = 0; y < 200; y++) {
      for (let x = 0; x < 200; x++) {
        const alpha = data[(y * 200 + x) * 4 + 3]
        if (alpha > 80) {
          pts.push({ x: (x - 100) * 1.35, y: (y - 100) * 1.35 })
        }
      }
    }
    for (let i = pts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const tmp = pts[i]
      pts[i] = pts[j]
      pts[j] = tmp
    }
    const chosen = []
    for (let i = 0; i < count; i++) chosen.push(pts[i % pts.length])
    return chosen
  }

  function initParticles(points) {
    particles = points.map((p, i) => {
      const angle = Math.random() * Math.PI * 2
      const dist = 60 + Math.random() * 110
      return {
        homeX: p.x,
        homeY: p.y,
        x: p.x + Math.cos(angle) * dist,
        y: p.y + Math.sin(angle) * dist,
        size: 1 + Math.random() * 1.5,
        colorOffset: Math.random(),
        seed: i,
      }
    })
  }

  function triggerShockwave(amplitude) {
    shockwaves.push({ t0: time, amplitude, speed: 55, width: 18, decay: 1.15 })
    if (shockwaves.length > 5) shockwaves.shift()
  }

  let holdStart = null
  canvas.style.cursor = 'pointer'
  canvas.style.touchAction = 'none'

  function startHold(e) {
    e.preventDefault()
    holdStart = performance.now()
  }
  function endHold(e) {
    if (holdStart === null) return
    const heldSec = Math.min((performance.now() - holdStart) / 1000, 2)
    triggerShockwave(16 + heldSec * 34)
    holdStart = null
  }
  canvas.addEventListener('pointerdown', startHold)
  canvas.addEventListener('pointerup', endHold)
  canvas.addEventListener('pointerleave', () => {
    holdStart = null
  })

  function loop() {
    requestAnimationFrame(loop)
    time += 0.02
    ctx.clearRect(0, 0, size, size)
    ctx.save()
    ctx.translate(size / 2, size / 2)

    if (animating) {
      shockwaves = shockwaves.filter((sw) => time - sw.t0 < 4)
    }

    const palette = themes[currentTheme]

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      let targetX = p.homeX
      let targetY = p.homeY

      if (animating) {
        const dist = Math.sqrt(p.homeX * p.homeX + p.homeY * p.homeY) + 1e-6
        let addX = 0
        let addY = 0
        for (let w = 0; w < shockwaves.length; w++) {
          const sw = shockwaves[w]
          const elapsed = time - sw.t0
          const R = sw.speed * elapsed
          const g = Math.exp(-((dist - R) * (dist - R)) / (2 * sw.width * sw.width))
          const decay = Math.exp(-sw.decay * elapsed)
          const amp = sw.amplitude * g * decay
          addX += (p.homeX / dist) * amp
          addY += (p.homeY / dist) * amp
        }
        targetX += addX
        targetY += addY
        p.x += (targetX - p.x) * 0.09
        p.y += (targetY - p.y) * 0.09
      }

      const color = lerpColor(palette, p.colorOffset + time * 0.04)
      const bright = 0.55 + Math.sin(time * 3 + p.seed) * 0.35
      ctx.beginPath()
      ctx.fillStyle = `rgba(${color.r | 0}, ${color.g | 0}, ${color.b | 0}, ${0.65 + bright * 0.3})`
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = canvas.dataset.logo
  img.onload = () => {
    initParticles(sampleLogoPoints(img, 1300))
    requestAnimationFrame(loop)
  }

  document.querySelectorAll('.particle-theme-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      currentTheme = btn.dataset.theme
      document.querySelectorAll('.particle-theme-btn').forEach((b) => b.classList.remove('active'))
      btn.classList.add('active')
    })
  })

  const animateToggle = document.getElementById('particleAnimateToggle')
  if (animateToggle) {
    animateToggle.addEventListener('change', (e) => {
      animating = e.target.checked
    })
  }
})()
