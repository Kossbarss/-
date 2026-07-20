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
        background: linear-gradient(180deg,
          var(--paper) 0,
          #160503 62px,
          #160503 calc(100% - 62px),
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
          radial-gradient(circle at 68% 38%, rgba(240,179,82,.20), transparent 30%),
          radial-gradient(circle at 26% 62%, rgba(126,24,9,.34), transparent 44%),
          linear-gradient(135deg, #0b0201 0%, #210604 40%, #4a1007 72%, #7d2c08 112%);
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
        background: linear-gradient(180deg, rgba(9,1,1,.96), transparent);
      }

      .pricing-reference-single .section-clip::after {
        bottom: 0;
        background: linear-gradient(0deg, rgba(9,1,1,.96), transparent);
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
        color: #d6a34e;
        opacity: .18;
        mix-blend-mode: screen;
        filter: drop-shadow(0 0 24px rgba(222,164,68,.18));
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
        border: 1px solid rgba(237,197,112,.82);
        border-radius: 22px;
        background:
          linear-gradient(145deg, rgba(255,252,245,.90), rgba(250,230,213,.76));
        -webkit-backdrop-filter: blur(16px) saturate(1.2);
        backdrop-filter: blur(16px) saturate(1.2);
        box-shadow:
          0 34px 80px -32px rgba(0,0,0,.9),
          inset 0 1px 0 rgba(255,255,255,.86),
          0 0 0 1px rgba(143,59,13,.22),
          0 0 48px rgba(220,154,54,.16);
        transform: translateZ(0);
      }

      .pricing-reference-single .pricing-reference-card::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background:
          radial-gradient(circle at 18% 12%, rgba(255,255,255,.74), transparent 34%),
          radial-gradient(circle at 80% 68%, rgba(230,161,65,.15), transparent 34%),
          linear-gradient(112deg, transparent 16%, rgba(255,244,214,.22) 48%, transparent 76%);
      }

      .pricing-reference-single .pricing-reference-card::after {
        content: '';
        position: absolute;
        inset: 0;
        z-index: 4;
        padding: 1px;
        border-radius: inherit;
        pointer-events: none;
        background: linear-gradient(115deg,#4b1608,#ad4d14,#efc46d,#7b250b,#d79a3d,#4b1608);
        background-size: 280% 280%;
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        animation: pricingReferenceBorder 5.4s linear infinite;
      }

      .pricing-reference-single .pricing-reference-card > * {
        position: relative;
        z-index: 2;
      }

      .pricing-reference-single .order-form input {
        background: rgba(255,255,255,.82);
        border-color: rgba(94,42,12,.2);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.84);
      }

      .pricing-reference-single .order-form input:focus {
        outline: none;
        border-color: rgba(211,151,55,.9);
        box-shadow: 0 0 0 3px rgba(211,151,55,.17);
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
        background: rgba(255,225,164,.56);
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
        .pricing-reference-single .section-clip { min-height: 520px; }
        .pricing-reference-single .container { width: min(1180px, 100% - 32px); }
        .pricing-reference-single .pricing-reference-card {
          padding: 28px 18px;
          border-radius: 18px;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .pricing-reference-single .pricing-reference-card::after,
        .pricing-reference-ripple { animation: none; }
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
      canvas.style.background = 'radial-gradient(circle at 56% 42%, rgba(236,184,88,.36), transparent 27%), radial-gradient(circle at 36% 58%, rgba(116,27,8,.42), transparent 38%), linear-gradient(145deg,#090101,#260704 48%,#5d1708 82%,#9b470f 125%)'
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
        len+=variation(diff,vec2(0.0,1.0),5.0,1.6);
        len-=variation(diff,vec2(1.0,0.0),5.0,1.4);
        return smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
      }

      void main(){
        vec2 uv=gl_FragCoord.xy/iResolution.xy;
        float aspect=iResolution.x/max(iResolution.y,1.0);
        uv.x*=aspect;

        vec2 center=vec2(aspect*.52,.5);
        vec2 shifted=uv-center;
        float radius=.34;
        float mask=0.0;
        mask+=circle(uv,center,radius,.038);
        mask+=circle(uv,center,radius-.022,.012);
        mask+=circle(uv,center,radius+.022,.006);

        vec2 v=rotate2d(iTime*.16)*shifted;
        float sweep=.5+.5*sin(iTime*.55+v.x*4.5-v.y*3.0);
        float pulse=.5+.5*cos(iTime*.34+v.y*3.6);

        vec3 nearBlack=vec3(.025,.004,.002);
        vec3 darkRed=vec3(.13,.020,.008);
        vec3 warmRed=vec3(.34,.065,.018);
        vec3 bronze=vec3(.55,.25,.045);
        vec3 gold=vec3(.92,.62,.20);
        vec3 paleGold=vec3(1.0,.82,.43);

        float radialWarmth=exp(-length(shifted)*1.8);
        float sideWarmth=smoothstep(0.0,1.0,uv.x/aspect);
        vec3 bg=mix(nearBlack,darkRed,radialWarmth*.78);
        bg=mix(bg,warmRed,sideWarmth*.24);
        bg=mix(bg,bronze,pulse*.055);

        vec3 ringColor=mix(warmRed,gold,sweep);
        ringColor=mix(ringColor,paleGold,pulse*.28);

        float ringDistance=abs(length(shifted)-radius);
        float halo=exp(-ringDistance*16.0);

        float glintTrack=shifted.x*.62+shifted.y*.88;
        float glintCenter=sin(iTime*.28)*.42;
        float glint=exp(-pow(glintTrack-glintCenter,2.0)*34.0);
        glint*=smoothstep(.86,.06,length(shifted));

        vec3 color=bg;
        color+=ringColor*(mask*.9+halo*.2);
        color+=paleGold*circle(uv,center,radius,.003)*.68;
        color+=paleGold*glint*.055;

        float vignette=smoothstep(1.06,.25,length(vec2(shifted.x/max(aspect,1.0),shifted.y)));
        color*=.7+.3*vignette;

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
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
      if (visible && !reducedMotion) frameId = requestAnimationFrame(render)
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        const nextVisible = entries[0].isIntersecting
        if (nextVisible && !visible && !reducedMotion) {
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
