// Footer logo particle animation — lightweight Canvas 2D adaptation of a
// Three.js "star shockwaves" reference: particles sample the brand mark
// instead of a star. Fully automatic, no controls: a slow continuous
// rotation and an ambient disintegration cycle (particles periodically
// scatter away and reform) run alongside a looping shockwave pulse,
// using our VIP burgundy-gold palette.
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

  const palette = ['#c9a24a', '#e8d5a8', '#a3162e', '#7a0f22']
  let time = 0
  let particles = []
  let shockwaves = []
  let nextPulseAt = 3

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

  function initParticles(points, count) {
    particles = points.map((p, i) => {
      const angle = Math.random() * Math.PI * 2
      const dist = 60 + Math.random() * 110
      const offStrength = 40 + Math.random() * 55
      const offAngle = Math.random() * Math.PI * 2
      return {
        homeX: p.x,
        homeY: p.y,
        x: p.x + Math.cos(angle) * dist,
        y: p.y + Math.sin(angle) * dist,
        size: 1 + Math.random() * 1.5,
        colorOffset: Math.random(),
        seed: i,
        cycleOffset: (i / count) * DISINTEGRATION_CYCLE * 0.5,
        disintegrationOffsetX: Math.cos(offAngle) * offStrength,
        disintegrationOffsetY: Math.sin(offAngle) * offStrength,
      }
    })
  }

  function triggerShockwave(amplitude) {
    shockwaves.push({ t0: time, amplitude, speed: 55, width: 18, decay: 1.15 })
    if (shockwaves.length > 5) shockwaves.shift()
  }

  function loop() {
    requestAnimationFrame(loop)
    time += 0.02

    if (time >= nextPulseAt) {
      triggerShockwave(28)
      nextPulseAt = time + 4.5 + Math.random() * 1.5
    }

    // slow continuous rotation of the whole shape around its center
    const rotSpeed = -0.0008
    const cosR = Math.cos(rotSpeed)
    const sinR = Math.sin(rotSpeed)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const hx = p.homeX
      const hy = p.homeY
      p.homeX = hx * cosR - hy * sinR
      p.homeY = hx * sinR + hy * cosR
    }

    ctx.clearRect(0, 0, size, size)
    ctx.save()
    ctx.translate(size / 2, size / 2)

    shockwaves = shockwaves.filter((sw) => time - sw.t0 < 4)

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]

      // ambient disintegration cycle: scatter away, hold, reform
      const cycleProgress = ((time * 0.6 + p.cycleOffset) % DISINTEGRATION_CYCLE) / DISINTEGRATION_CYCLE
      let disAmt = 0
      if (cycleProgress < STABLE_END) disAmt = 0
      else if (cycleProgress < DIS_FULL) disAmt = (cycleProgress - STABLE_END) / (DIS_FULL - STABLE_END)
      else if (cycleProgress < HOLD_END) disAmt = 1
      else disAmt = 1 - (cycleProgress - HOLD_END) / (1 - HOLD_END)
      disAmt = Math.sin(disAmt * Math.PI * 0.5)

      // shockwave push, radial from center
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

      let targetX = p.homeX + addX
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
      let bright = (0.55 + Math.sin(time * 3 + p.seed) * 0.35) * (1 - disAmt * 0.7)
      const curSize = p.size * (1 - disAmt * 0.75)

      ctx.beginPath()
      ctx.fillStyle = `rgba(${color.r | 0}, ${color.g | 0}, ${color.b | 0}, ${0.65 + bright * 0.3})`
      ctx.arc(p.x, p.y, Math.max(0.2, curSize), 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.restore()
  }

  const img = new Image()
  img.crossOrigin = 'anonymous'
  img.src = canvas.dataset.logo
  img.onload = () => {
    const count = 1300
    initParticles(sampleLogoPoints(img, count), count)
    requestAnimationFrame(loop)
  }
})()
