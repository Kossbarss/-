// Footer logo particle animation and final hero gallery effects.
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
  const palette = ['#c9a24a', '#e8d5a8', '#ff0003', '#dd0003']
  let time = 0
  let particles = []
  let shockwaves = []
  let nextPulseAt = 3
  let globeRadius = 135
  const SPIN_SPEED = 0.45
  const FACE_OFFSETS = [0, Math.PI]
  const DISINTEGRATION_CYCLE = 10.0
  const STABLE_END = 0.55
  const DIS_FULL = STABLE_END + 0.15
  const HOLD_END = DIS_FULL + 0.1

  function hexToRgb(hex) {
    const v = parseInt(hex.slice(1), 16)
    return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 }
  }

  function lerpColor(pal, t) {
    const n = pal.length
    const scaled = ((t % 1) + 1) % 1 * n
    const i0 = Math.floor(scaled) % n
    const i1 = (i0 + 1) % n
    const f = scaled - Math.floor(scaled)
    const c0 = hexToRgb(pal[i0])
    const c1 = hexToRgb(pal[i1])
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
        if (alpha > 80) pts.push({ x: (x - 100) * 1.35, y: (y - 100) * 1.35 })
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

  function initParticles(points, count) {
    globeRadius = points.reduce((m, p) => Math.max(m, Math.abs(p.x)), 1)
    particles = []
    for (let f = 0; f < FACE_OFFSETS.length; f++) {
      for (let i = 0; i < points.length; i++) {
        const p = points[i]
        const angle = Math.random() * Math.PI * 2
        const dist = 60 + Math.random() * 110
        const offStrength = 40 + Math.random() * 55
        const offAngle = Math.random() * Math.PI * 2
        particles.push({
          homeX: p.x,
          homeY: p.y,
          baseAngle: Math.asin(Math.max(-1, Math.min(1, p.x / globeRadius))),
          faceOffset: FACE_OFFSETS[f],
          x: p.x + Math.cos(angle) * dist,
          y: p.y + Math.sin(angle) * dist,
          size: 1.2 + Math.random() * 1.7,
          colorOffset: Math.random(),
          seed: f * count + i,
          cycleOffset: (i / count) * DISINTEGRATION_CYCLE * 0.5,
          disintegrationOffsetX: Math.cos(offAngle) * offStrength,
          disintegrationOffsetY: Math.sin(offAngle) * offStrength,
        })
      }
    }
  }

  function triggerShockwave(amplitude) {
    shockwaves.push({ t0: time, amplitude, speed: 55, width: 18, decay: 1.15 })
    if (shockwaves.length > 5) shockwaves.shift()
  }

  let rafId = null

  function loop() {
    rafId = requestAnimationFrame(loop)
    time += 0.02
    if (time >= nextPulseAt) {
      triggerShockwave(28)
      nextPulseAt = time + 4.5 + Math.random() * 1.5
    }
    const spinPhase = time * SPIN_SPEED
    ctx.clearRect(0, 0, size, size)
    ctx.save()
    ctx.translate(size / 2, size / 2)
    ctx.globalCompositeOperation = 'lighter'
    shockwaves = shockwaves.filter((sw) => time - sw.t0 < 4)

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const globeAngle = p.baseAngle + spinPhase + p.faceOffset
      const gx = globeRadius * Math.sin(globeAngle)
      const depth = Math.cos(globeAngle)
      if (depth <= 0) continue
      const visibility = depth
      const cycleProgress = ((time * 0.6 + p.cycleOffset) % DISINTEGRATION_CYCLE) / DISINTEGRATION_CYCLE
      let disAmt = 0
      if (cycleProgress < STABLE_END) disAmt = 0
      else if (cycleProgress < DIS_FULL) disAmt = (cycleProgress - STABLE_END) / (DIS_FULL - STABLE_END)
      else if (cycleProgress < HOLD_END) disAmt = 1
      else disAmt = 1 - (cycleProgress - HOLD_END) / (1 - HOLD_END)
      disAmt = Math.sin(disAmt * Math.PI * 0.5)
      const dist = Math.sqrt(gx * gx + p.homeY * p.homeY) + 1e-6
      let addX = 0
      let addY = 0
      for (let w = 0; w < shockwaves.length; w++) {
        const sw = shockwaves[w]
        const elapsed = time - sw.t0
        const R = sw.speed * elapsed
        const g = Math.exp(-((dist - R) * (dist - R)) / (2 * sw.width * sw.width))
        const decay = Math.exp(-sw.decay * elapsed)
        const amp = sw.amplitude * g * decay
        addX += (gx / dist) * amp
        addY += (p.homeY / dist) * amp
      }
      let targetX = gx + addX
      let targetY = p.homeY + addY
      let lerp = 0.09
      if (disAmt > 0.001) {
        targetX += p.disintegrationOffsetX * disAmt
        targetY += p.disintegrationOffsetY * disAmt
        lerp = 0.05 + disAmt * 0.02
      }
      p.x += (targetX - p.x) * lerp
      p.y += (targetY - p.y) * lerp
      const color = lerpColor(palette, p.colorOffset + time * 0.04)
      const bright = (0.55 + Math.sin(time * 3 + p.seed) * 0.35) * (1 - disAmt * 0.7)
      const curSize = p.size * (1 - disAmt * 0.75) * (0.6 + 0.4 * visibility)
      const edgeFade = Math.sqrt(visibility)
      const boost = 1.25
      ctx.beginPath()
      ctx.fillStyle = `rgba(${Math.min(255, color.r * boost) | 0}, ${Math.min(255, color.g * boost) | 0}, ${Math.min(255, color.b * boost) | 0}, ${(0.8 + bright * 0.4) * edgeFade})`
      ctx.arc(p.x, p.y, Math.max(0.2, curSize), 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalCompositeOperation = 'source-over'
    ctx.restore()
  }

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = canvas.dataset.logo
  img.onload = () => {
    const count = 1300
    initParticles(sampleLogoPoints(img, count), count)
    const observer = new IntersectionObserver((entries) => {
      const isVisible = entries[0].isIntersecting
      if (isVisible && rafId === null) rafId = requestAnimationFrame(loop)
      else if (!isVisible && rafId !== null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    })
    observer.observe(canvas)
  }
})()

// Brown animated border with a soft gold highlight.
;(function () {
  const style = document.createElement('style')
  style.dataset.feature = 'hero-gallery-brown-gold-flow'
  style.textContent = `
    @keyframes hero-gallery-brown-gold-flow {
      0% { background-position: 0 0, 0% 50%; }
      100% { background-position: 0 0, 200% 50%; }
    }
    .hero-shot {
      border: 2px solid transparent !important;
      background-image:
        linear-gradient(#17110c, #17110c),
        linear-gradient(115deg, #352619 0%, #4c3723 18%, #5b4028 34%, #d8bd83 46%, #7a5835 53%, #4c3723 68%, #3a2a1c 84%, #b99557 100%) !important;
      background-origin: border-box !important;
      background-clip: padding-box, border-box !important;
      background-size: 100% 100%, 300% 300% !important;
      animation: hero-gallery-brown-gold-flow 3.4s linear infinite !important;
      box-shadow: 0 0 0 1px rgba(204, 170, 105, 0.12), 0 0 13px rgba(181, 143, 75, 0.18), 0 24px 54px -26px rgba(0, 0, 0, 0.95) !important;
      will-change: background-position;
    }
    .hero-shot:nth-child(2n) { animation-delay: -0.8s !important; }
    .hero-shot:nth-child(3n) { animation-delay: -1.6s !important; }
    .hero-shot:nth-child(4n) { animation-delay: -2.4s !important; }
    .hero-shot img { border-radius: calc(clamp(20px, 1.62vw, 30px) - 2px) !important; }
    @media (max-width: 700px) {
      .hero-shot {
        border-width: 1.5px !important;
        animation-duration: 4.2s !important;
        box-shadow: 0 0 0 1px rgba(204, 170, 105, 0.1), 0 0 9px rgba(181, 143, 75, 0.14) !important;
      }
    }
    @media (prefers-reduced-motion: reduce) { .hero-shot { animation: none !important; } }
  `
  document.head.appendChild(style)
})()

// Keep every desktop hero card facing straight forward.
;(function keepHeroCardsFrontFacing() {
  function levelCards() {
    if (window.innerWidth > 700) {
      document.querySelectorAll('.hero-shot').forEach((card) => {
        const transform = card.style.transform
        if (transform && transform.includes('rotateY(')) {
          card.style.transform = transform.replace(/rotateY\([^)]*\)/, 'rotateY(0deg)')
        }
      })
    }
    requestAnimationFrame(levelCards)
  }
  requestAnimationFrame(levelCards)
})()
