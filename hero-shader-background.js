// Reference-inspired animated background for the existing hero only.
;(function () {
  function initHeroShader() {
    const hero = document.querySelector('.hero')
    if (!hero || hero.dataset.shaderReady === 'true') return
    hero.dataset.shaderReady = 'true'
    hero.classList.add('hero-shader-active')

    const style = document.createElement('style')
    style.dataset.feature = 'hero-shader-background'
    style.textContent = `
      .hero-shader-active {
        position: relative;
        isolation: isolate;
        overflow: hidden;
        background: #020304 !important;
      }

      .hero-shader-canvas,
      .hero-shader-wire,
      .hero-shader-shade {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
      }

      .hero-shader-canvas {
        z-index: 0;
        display: block;
      }

      .hero-shader-wire {
        z-index: 1;
        opacity: .42;
        background:
          repeating-linear-gradient(112deg, transparent 0 34px, rgba(255,255,255,.022) 35px 36px),
          repeating-linear-gradient(22deg, transparent 0 44px, rgba(0,198,222,.028) 45px 46px);
        mix-blend-mode: screen;
        animation: heroWireDrift 18s linear infinite;
      }

      .hero-shader-shade {
        z-index: 2;
        background:
          radial-gradient(circle at 50% 18%, rgba(0,0,0,.08), rgba(0,0,0,.34) 52%, rgba(0,0,0,.72) 100%),
          linear-gradient(180deg, rgba(0,0,0,.34) 0%, rgba(0,0,0,.10) 26%, rgba(0,0,0,.28) 68%, rgba(0,0,0,.68) 100%);
      }

      .hero-shader-active > .hero-glow,
      .hero-shader-active > .container {
        position: relative;
        z-index: 3;
      }

      .hero-shader-active .hero-glow {
        opacity: .38 !important;
        mix-blend-mode: screen;
      }

      .hero-shader-active .hero-copy h1,
      .hero-shader-active .hero-sub,
      .hero-shader-active .hero-stat,
      .hero-shader-active .hero-topline,
      .hero-shader-active .hero-lede,
      .hero-shader-active .hero-tag {
        text-shadow: 0 2px 18px rgba(0,0,0,.72);
      }

      @keyframes heroWireDrift {
        from { transform: translate3d(-2%, -1%, 0) scale(1.04); }
        to { transform: translate3d(2%, 1%, 0) scale(1.04); }
      }

      @media (max-width: 700px) {
        .hero-shader-wire { opacity: .28; }
        .hero-shader-shade {
          background:
            radial-gradient(circle at 50% 12%, rgba(0,0,0,.04), rgba(0,0,0,.38) 58%, rgba(0,0,0,.76) 100%),
            linear-gradient(180deg, rgba(0,0,0,.42), rgba(0,0,0,.16) 30%, rgba(0,0,0,.42) 72%, rgba(0,0,0,.74));
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .hero-shader-wire { animation: none; }
      }
    `
    document.head.appendChild(style)

    const canvas = document.createElement('canvas')
    canvas.className = 'hero-shader-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    const wire = document.createElement('div')
    wire.className = 'hero-shader-wire'
    wire.setAttribute('aria-hidden', 'true')
    const shade = document.createElement('div')
    shade.className = 'hero-shader-shade'
    shade.setAttribute('aria-hidden', 'true')

    hero.insertBefore(shade, hero.firstChild)
    hero.insertBefore(wire, hero.firstChild)
    hero.insertBefore(canvas, hero.firstChild)

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
    if (!gl) {
      canvas.style.background = 'radial-gradient(circle at 20% 25%, rgba(0,182,210,.52), transparent 34%), radial-gradient(circle at 78% 34%, rgba(249,115,22,.46), transparent 36%), radial-gradient(circle at 55% 78%, rgba(8,145,178,.42), transparent 40%), #020304'
      return
    }

    const vertexSource = 'attribute vec2 aPosition; void main(){gl_Position=vec4(aPosition,0.0,1.0);}'
    const fragmentSource = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;

      float blob(vec2 uv, vec2 center, float radius, float softness){
        return 1.0-smoothstep(radius, radius+softness, length(uv-center));
      }

      void main(){
        vec2 uv=gl_FragCoord.xy/iResolution.xy;
        float aspect=iResolution.x/max(iResolution.y,1.0);
        uv.x*=aspect;

        float t=iTime*.22;
        vec2 c1=vec2(aspect*(.24+.08*sin(t*.82)), .30+.09*cos(t*.73));
        vec2 c2=vec2(aspect*(.76+.07*cos(t*.64)), .36+.10*sin(t*.58));
        vec2 c3=vec2(aspect*(.53+.10*sin(t*.47)), .76+.07*cos(t*.71));
        vec2 c4=vec2(aspect*(.43+.06*cos(t*.91)), .48+.08*sin(t*.67));

        float b1=blob(uv,c1,.28,.30);
        float b2=blob(uv,c2,.31,.34);
        float b3=blob(uv,c3,.34,.36);
        float b4=blob(uv,c4,.23,.28);

        vec3 black=vec3(.004,.006,.008);
        vec3 cyan=vec3(.00,.72,.82);
        vec3 teal=vec3(.00,.36,.46);
        vec3 deepTeal=vec3(.035,.22,.28);
        vec3 orange=vec3(.96,.28,.055);
        vec3 warmWhite=vec3(.92,.91,.86);

        vec3 color=black;
        color+=cyan*b1*.68;
        color+=orange*b2*.72;
        color+=deepTeal*b3*.88;
        color+=teal*b4*.56;

        float sweep=.5+.5*sin((uv.x+uv.y)*7.0-t*1.4);
        color+=warmWhite*sweep*.028*(b1+b2+b3);

        float vignette=smoothstep(1.08,.24,length(vec2((uv.x-aspect*.5)/max(aspect,1.0),uv.y-.5)));
        color*=.58+.42*vignette;
        color=mix(color,black,.18);
        gl_FragColor=vec4(color,1.0);
      }
    `

    function compile(type, source) {
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader) || 'Hero shader compile error')
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
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frameId = 0
    let visible = true

    function resize() {
      const rect = hero.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width*dpr))
      const height = Math.max(1, Math.round(rect.height*dpr))
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width
        canvas.height = height
        gl.viewport(0,0,width,height)
      }
    }

    function render(now) {
      resize()
      gl.uniform1f(timeLocation, now*.001)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES,0,6)
      if (visible && !reducedMotion) frameId=requestAnimationFrame(render)
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        const nextVisible=entries[0].isIntersecting
        if (nextVisible && !visible && !reducedMotion) {
          visible=true
          frameId=requestAnimationFrame(render)
        } else if (!nextVisible && visible) {
          visible=false
          cancelAnimationFrame(frameId)
        }
      }, { threshold:.02 }).observe(hero)
    }

    window.addEventListener('resize', resize, { passive:true })
    resize()
    frameId=requestAnimationFrame(render)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroShader, { once:true })
  } else {
    initHeroShader()
  }
})()
