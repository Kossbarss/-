// Animated glass pricing treatment adapted for the existing single-plan order block.
;(function () {
  const initPricingEffects = () => {
    const section = document.getElementById('pricing')
    if (!section || section.dataset.animatedPricingReady === 'true') return

    const clip = section.querySelector('.section-clip') || section
    const orderBox = section.querySelector('.order-box')
    const orderButton = section.querySelector('.order-form .btn')
    if (!orderBox) return

    section.dataset.animatedPricingReady = 'true'
    section.classList.add('pricing-animated-single-plan')
    orderBox.classList.add('pricing-glass-card')

    const style = document.createElement('style')
    style.dataset.feature = 'single-plan-animated-glass-pricing'
    style.textContent = `
      .pricing-animated-single-plan .section-clip {
        isolation: isolate;
      }

      .pricing-shader-canvas {
        position: absolute;
        inset: 0;
        z-index: 0;
        width: 100%;
        height: 100%;
        display: block;
        pointer-events: none;
        opacity: .92;
      }

      .pricing-animated-single-plan .pricing-watermark {
        z-index: 1;
        mix-blend-mode: screen;
        opacity: .16;
      }

      .pricing-animated-single-plan .container {
        position: relative;
        z-index: 2;
      }

      .pricing-animated-single-plan .pricing-glass-card {
        overflow: hidden;
        border: 1px solid rgba(232, 213, 168, .72);
        border-radius: 24px;
        background:
          linear-gradient(145deg, rgba(255, 253, 250, .88), rgba(255, 247, 239, .72));
        -webkit-backdrop-filter: blur(14px) saturate(1.22);
        backdrop-filter: blur(14px) saturate(1.22);
        box-shadow:
          0 28px 70px -34px rgba(0, 0, 0, .72),
          0 0 0 1px rgba(255, 255, 255, .32) inset,
          0 0 40px rgba(201, 162, 74, .15);
      }

      .pricing-animated-single-plan .pricing-glass-card::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        pointer-events: none;
        background:
          radial-gradient(circle at 18% 12%, rgba(255, 255, 255, .62), transparent 36%),
          linear-gradient(110deg, transparent 20%, rgba(232, 213, 168, .16) 48%, transparent 72%);
      }

      .pricing-animated-single-plan .pricing-glass-card::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 5;
        border-radius: inherit;
        padding: 1px;
        pointer-events: none;
        background: linear-gradient(115deg, rgba(76, 55, 35, .8), rgba(216, 189, 131, .95), rgba(139, 103, 60, .8), rgba(255, 255, 255, .75));
        background-size: 240% 240%;
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        animation: pricing-glass-edge-flow 5s linear infinite;
      }

      .pricing-animated-single-plan .order-form input {
        position: relative;
        z-index: 2;
        background: rgba(255, 255, 255, .76);
        border-color: rgba(21, 17, 15, .14);
        box-shadow: 0 1px 0 rgba(255, 255, 255, .6) inset;
      }

      .pricing-animated-single-plan .order-form input:focus {
        outline: none;
        border-color: rgba(201, 162, 74, .9);
        box-shadow: 0 0 0 3px rgba(201, 162, 74, .16);
      }

      .pricing-ripple-btn {
        position: relative;
        overflow: hidden;
        isolation: isolate;
      }

      .pricing-click-ripple {
        position: absolute;
        z-index: 1;
        border-radius: 999px;
        pointer-events: none;
        transform: scale(0);
        background: rgba(255, 255, 255, .48);
        animation: pricing-click-ripple .68s ease-out forwards;
      }

      @keyframes pricing-click-ripple {
        0% { transform: scale(0); opacity: .9; }
        100% { transform: scale(1); opacity: 0; }
      }

      @keyframes pricing-glass-edge-flow {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }

      @media (max-width: 700px) {
        .pricing-animated-single-plan .pricing-glass-card {
          padding: 28px 18px;
          border-radius: 20px;
        }

        .pricing-shader-canvas {
          opacity: .86;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .pricing-animated-single-plan .pricing-glass-card::after,
        .pricing-click-ripple {
          animation: none;
        }
      }
    `
    document.head.appendChild(style)

    const canvas = document.createElement('canvas')
    canvas.className = 'pricing-shader-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    clip.insertBefore(canvas, clip.firstChild)

    if (orderButton) {
      orderButton.classList.add('pricing-ripple-btn')
      orderButton.addEventListener('pointerdown', (event) => {
        const rect = orderButton.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height) * 2
        const ripple = document.createElement('span')
        ripple.className = 'pricing-click-ripple'
        ripple.style.width = `${size}px`
        ripple.style.height = `${size}px`
        ripple.style.left = `${event.clientX - rect.left - size / 2}px`
        ripple.style.top = `${event.clientY - rect.top - size / 2}px`
        orderButton.appendChild(ripple)
        window.setTimeout(() => ripple.remove(), 700)
      })
    }

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false })
    if (!gl) {
      canvas.style.background = 'radial-gradient(circle at 76% 42%, rgba(201,162,74,.42), transparent 24%), linear-gradient(145deg, #240004, #dd0003 58%, #fe5200)'
      return
    }

    const vertexSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `

    const fragmentSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;

      mat2 rotate2d(float angle) {
        float c = cos(angle);
        float s = sin(angle);
        return mat2(c, -s, s, c);
      }

      float variation(vec2 v1, vec2 v2, float strength, float speed) {
        return sin(dot(normalize(v1), normalize(v2)) * strength + iTime * speed) / 90.0;
      }

      float ring(vec2 uv, vec2 center, float radius, float width) {
        vec2 diff = center - uv;
        float len = length(diff);
        len += variation(diff, vec2(0.0, 1.0), 5.0, 1.6);
        len -= variation(diff, vec2(1.0, 0.0), 5.0, 1.35);
        return smoothstep(radius - width, radius, len) - smoothstep(radius, radius + width, len);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        float aspect = iResolution.x / max(iResolution.y, 1.0);
        uv.x *= aspect;

        vec2 centerA = vec2(aspect * 0.78, 0.52);
        vec2 centerB = vec2(aspect * 0.18, 0.44);
        vec2 drift = rotate2d(iTime * 0.12) * (uv - centerA);

        float mask = 0.0;
        mask += ring(uv, centerA, 0.34, 0.030);
        mask += ring(uv, centerA, 0.28, 0.010);
        mask += ring(uv, centerA, 0.41, 0.006);
        mask += ring(uv, centerB, 0.24, 0.018) * 0.55;

        float softGlow = exp(-5.2 * length(uv - centerA));
        float wave = 0.5 + 0.5 * sin(iTime * 0.8 + drift.x * 3.0 - drift.y * 2.0);

        vec3 burgundy = vec3(0.08, 0.0, 0.012);
        vec3 redColor = vec3(0.93, 0.0, 0.018);
        vec3 orangeColor = vec3(1.0, 0.25, 0.0);
        vec3 goldColor = vec3(0.79, 0.64, 0.29);

        vec3 energy = mix(redColor, orangeColor, wave);
        energy = mix(energy, goldColor, clamp(mask * 0.72 + softGlow * 0.18, 0.0, 0.72));

        vec3 color = mix(burgundy, energy, clamp(mask * 0.92 + softGlow * 0.36, 0.0, 1.0));
        color += goldColor * ring(uv, centerA, 0.34, 0.0025) * 0.72;
        gl_FragColor = vec4(color, 0.97);
      }
    `

    const compileShader = (type, source) => {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader) || 'Pricing shader compilation failed')
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource)
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program) || 'Pricing shader link failed')
      return
    }
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    )

    const positionLocation = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    const timeLocation = gl.getUniformLocation(program, 'iTime')
    const resolutionLocation = gl.getUniformLocation(program, 'iResolution')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let visible = true
    let frameId = 0

    const resize = () => {
      const rect = clip.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width * dpr))
      const height = Math.max(1, Math.round(rect.height * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const render = (now) => {
      resize()
      gl.useProgram(program)
      gl.uniform1f(timeLocation, now * 0.001)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (!reducedMotion && visible) frameId = requestAnimationFrame(render)
    }

    if ('ResizeObserver' in window) {
      new ResizeObserver(resize).observe(clip)
    } else {
      window.addEventListener('resize', resize, { passive: true })
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        const nextVisible = entry.isIntersecting
        if (nextVisible && !visible && !reducedMotion) {
          visible = true
          frameId = requestAnimationFrame(render)
        } else if (!nextVisible && visible) {
          visible = false
          cancelAnimationFrame(frameId)
        }
      }, { threshold: 0.02 }).observe(section)
    }

    resize()
    frameId = requestAnimationFrame(render)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPricingEffects, { once: true })
  } else {
    initPricingEffects()
  }
})()
