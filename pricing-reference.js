// Isolated reference-inspired animation for the existing single pricing card.
;(function () {
  function initPricingReference() {
    const section = document.getElementById('pricing')
    if (!section || section.dataset.pricingReferenceReady === 'true') return

    const clip = section.querySelector('.section-clip') || section
    const card = section.querySelector('.order-box')
    const button = section.querySelector('.order-form button')
    if (!card) return

    section.dataset.pricingReferenceReady = 'true'
    section.classList.add('pricing-reference-single')
    card.classList.add('pricing-reference-card')

    const style = document.createElement('style')
    style.dataset.feature = 'pricing-reference-single-plan'
    style.textContent = `
      .pricing-reference-single {
        background:
          linear-gradient(180deg,
            var(--paper) 0,
            #170305 62px,
            #170305 calc(100% - 62px),
            var(--paper) 100%) !important;
      }

      .pricing-reference-single .section-clip {
        position: relative;
        isolation: isolate;
        min-height: 560px;
        display: grid;
        align-items: center;
        overflow: hidden;
        background:
          radial-gradient(circle at 78% 45%, rgba(255,76,38,.22), transparent 34%),
          radial-gradient(circle at 20% 58%, rgba(128,0,8,.34), transparent 42%),
          linear-gradient(135deg, #120205 0%, #250306 42%, #5f0908 72%, #d92c18 120%);
      }

      .pricing-reference-single .section-clip::before,
      .pricing-reference-single .section-clip::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 72px;
        z-index: 1;
        pointer-events: none;
      }

      .pricing-reference-single .section-clip::before {
        top: 0;
        background: linear-gradient(180deg, rgba(16,2,4,.98), transparent);
      }

      .pricing-reference-single .section-clip::after {
        bottom: 0;
        background: linear-gradient(0deg, rgba(16,2,4,.98), transparent);
      }

      .pricing-reference-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        display: block;
      }

      .pricing-reference-single .pricing-watermark {
        z-index: 1;
        color: #f0b35a;
        opacity: .15;
        mix-blend-mode: screen;
        filter: drop-shadow(0 0 22px rgba(255,76,38,.18));
      }

      .pricing-reference-single .container {
        position: relative;
        z-index: 2;
        width: min(1180px, 100% - 48px);
      }

      .pricing-reference-single .pricing-reference-card {
        position: relative;
        overflow: hidden;
        max-width: 640px;
        border: 1px solid rgba(238,205,135,.72);
        border-radius: 22px;
        background:
          linear-gradient(145deg, rgba(255,252,247,.88), rgba(255,244,235,.72));
        -webkit-backdrop-filter: blur(16px) saturate(1.22);
        backdrop-filter: blur(16px) saturate(1.22);
        box-shadow:
          0 34px 80px -32px rgba(0,0,0,.88),
          inset 0 1px 0 rgba(255,255,255,.86),
          0 0 0 1px rgba(134,25,12,.18),
          0 0 44px rgba(255,64,31,.15);
        transform: translateZ(0);
      }

      .pricing-reference-single .pricing-reference-card::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 18% 12%, rgba(255,255,255,.76), transparent 34%),
          radial-gradient(circle at 78% 68%, rgba(255,93,43,.12), transparent 34%),
          linear-gradient(115deg, transparent 15%, rgba(255,255,255,.2) 48%, transparent 78%);
      }

      .pricing-reference-single .pricing-reference-card::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 4;
        padding: 1px;
        border-radius: inherit;
        pointer-events: none;
        background: linear-gradient(115deg,#4b120d,#ff6b3d,#eab667,#8b2315,#ff3d1f,#4b120d);
        background-size: 280% 280%;
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        animation: pricingReferenceBorder 5s linear infinite;
      }

      .pricing-reference-single .pricing-reference-card > * {
        position: relative;
        z-index: 2;
      }

      .pricing-reference-single .order-form input {
        background: rgba(255,255,255,.8);
        border-color: rgba(83,15,10,.18);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.82);
      }

      .pricing-reference-single .order-form input:focus {
        outline: none;
        border-color: rgba(255,83,43,.82);
        box-shadow: 0 0 0 3px rgba(255,83,43,.16);
      }

      .pricing-reference-ripple-button {
        position: relative !important;
        overflow: hidden !important;
        isolation: isolate;
      }

      .pricing-reference-ripple {
        position: absolute;
        z-index: 1;
        border-radius: 999px;
        pointer-events: none;
        transform: scale(0);
        background: rgba(255,240,220,.55);
        animation: pricingReferenceRipple .65s ease-out forwards;
      }

      @keyframes pricingReferenceRipple {
        from { transform: scale(0); opacity: .9; }
        to { transform: scale(1); opacity: 0; }
      }

      @keyframes pricingReferenceBorder {
        from { background-position: 0% 50%; }
        to { background-position: 200% 50%; }
      }

      @media (max-width: 700px) {
        .pricing-reference-single .section-clip {
          min-height: 520px;
        }
        .pricing-reference-single .container {
          width: min(1180px, 100% - 32px);
        }
        .pricing-reference-single .pricing-reference-card {
          padding: 28px 18px;
          border-radius: 18px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .pricing-reference-single .pricing-reference-card::after,
        .pricing-reference-ripple {
          animation: none;
        }
      }
    `
    document.head.appendChild(style)

    const canvas = document.createElement('canvas')
    canvas.className = 'pricing-reference-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    clip.insertBefore(canvas, clip.firstChild)

    if (button) {
      button.classList.add('pricing-reference-ripple-button')
      button.addEventListener('pointerdown', function (event) {
        const rect = button.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height) * 2
        const ripple = document.createElement('span')
        ripple.className = 'pricing-reference-ripple'
        ripple.style.width = size + 'px'
        ripple.style.height = size + 'px'
        ripple.style.left = event.clientX - rect.left - size / 2 + 'px'
        ripple.style.top = event.clientY - rect.top - size / 2 + 'px'
        button.appendChild(ripple)
        window.setTimeout(function () { ripple.remove() }, 700)
      })
    }

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false })
    if (!gl) {
      canvas.style.background = 'radial-gradient(circle at 50% 45%, rgba(255,92,46,.52), transparent 28%), radial-gradient(circle at 58% 56%, rgba(126,4,10,.52), transparent 36%), linear-gradient(145deg,#110205,#2a0306 45%,#8f100b 78%,#ff4f2b 125%)'
      return
    }

    const vertexSource = 'attribute vec2 aPosition; void main(){ gl_Position=vec4(aPosition,0.0,1.0); }'
    const fragmentSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;

      mat2 rotate2d(float a){
        float c=cos(a),s=sin(a);
        return mat2(c,-s,s,c);
      }

      float variation(vec2 v1,vec2 v2,float strength,float speed){
        return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0;
      }

      float circle(vec2 uv,vec2 center,float rad,float width){
        vec2 diff=center-uv;
        float len=length(diff);
        len+=variation(diff,vec2(0.0,1.0),5.0,2.0);
        len-=variation(diff,vec2(1.0,0.0),5.0,2.0);
        return smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
      }

      void main(){
        vec2 uv=gl_FragCoord.xy/iResolution.xy;
        float aspect=iResolution.x/max(iResolution.y,1.0);
        uv.x*=aspect;

        vec2 center=vec2(aspect*.5,.5);
        vec2 shifted=uv-center;
        float radius=.34;
        float mask=0.0;
        mask+=circle(uv,center,radius,.038);
        mask+=circle(uv,center,radius-.022,.012);
        mask+=circle(uv,center,radius+.022,.006);

        vec2 v=rotate2d(iTime*.20)*shifted;
        float sweep=.5+.5*sin(iTime*.72+v.x*5.2-v.y*3.4);
        float pulse=.5+.5*cos(iTime*.48+v.y*4.1);

        vec3 deepBurgundy=vec3(.055,.004,.010);
        vec3 burgundy=vec3(.24,.008,.016);
        vec3 redColor=vec3(.95,.035,.015);
        vec3 orangeColor=vec3(1.0,.28,.10);
        vec3 goldColor=vec3(.93,.61,.22);

        float horizontalGlow=smoothstep(aspect*.95,aspect*.28,abs(shifted.x));
        float verticalGlow=smoothstep(.82,.10,abs(shifted.y));
        vec3 bg=mix(deepBurgundy,burgundy,clamp(horizontalGlow*.42+verticalGlow*.16,0.0,1.0));
        bg=mix(bg,redColor,clamp((uv.x/aspect)*.16,0.0,.16));

        vec3 ringColor=mix(redColor,orangeColor,sweep);
        ringColor=mix(ringColor,goldColor,pulse*.48);

        float ringDistance=abs(length(shifted)-radius);
        float halo=exp(-ringDistance*18.0);
        vec3 color=bg;
        color+=ringColor*(mask*.92+halo*.24);
        color+=goldColor*circle(uv,center,radius,.003)*.72;

        float vignette=smoothstep(1.05,.24,length(vec2(shifted.x/max(aspect,1.0),shifted.y)));
        color*=.72+.28*vignette;

        gl_FragColor=vec4(color,1.0);
      }
    `

    function compile(type, source) {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader) || 'Pricing shader compile error')
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vertexShader = compile(gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource)
    if (!vertexShader || !fragmentShader) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'aPosition')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const timeLocation = gl.getUniformLocation(program, 'iTime')
    const resolutionLocation = gl.getUniformLocation(program, 'iResolution')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let frameId = 0
    let visible = true

    function resize() {
      const rect = clip.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width * dpr))
      const height = Math.max(1, Math.round(rect.height * dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0, 0, width, height)
      }
    }

    function render(now) {
      resize()
      gl.uniform1f(timeLocation, now * .001)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      if (visible) frameId = requestAnimationFrame(render)
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        const nextVisible = entries[0].isIntersecting
        if (nextVisible && !visible) {
          visible = true
          frameId = requestAnimationFrame(render)
        } else if (!nextVisible && visible) {
          visible = false
          cancelAnimationFrame(frameId)
        }
      }, { threshold: .02 }).observe(section)
    }

    window.addEventListener('resize', resize, { passive: true })
    resize()
    frameId = requestAnimationFrame(render)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPricingReference, { once: true })
  } else {
    initPricingReference()
  }
})()
