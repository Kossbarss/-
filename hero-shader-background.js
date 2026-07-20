// Paper Design MeshGradient 0.0.77, matching the supplied component's actual output.
;(function () {
  'use strict'

  const hero = document.querySelector('.hero')
  if (!hero || hero.dataset.paperMeshExact) return
  hero.dataset.paperMeshExact = 'loading'

  const VS = `#version 300 es
precision mediump float;
layout(location=0) in vec4 a_position;
uniform vec2 u_resolution;
out vec2 v_objectUV;
void main(){
  gl_Position=a_position;
  vec2 uv=gl_Position.xy*.5;
  float side=min(u_resolution.x,u_resolution.y);
  v_objectUV=uv*(u_resolution/vec2(side));
}`

  const FS = `#version 300 es
precision mediump float;
uniform float u_time;
uniform vec4 u_colors[10];
uniform float u_colorsCount;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_grainMixer;
uniform float u_grainOverlay;
in vec2 v_objectUV;
out vec4 fragColor;
vec2 rotate(vec2 uv,float th){return mat2(cos(th),sin(th),-sin(th),cos(th))*uv;}
float hash21(vec2 p){p=fract(p*vec2(.3183099,.3678794))+.1;p+=dot(p,p+19.19);return fract(p.x*p.y);}
float valueNoise(vec2 st){vec2 i=floor(st),f=fract(st);float a=hash21(i),b=hash21(i+vec2(1.,0.)),c=hash21(i+vec2(0.,1.)),d=hash21(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float noise(vec2 n,vec2 seedOffset){return valueNoise(n+seedOffset);}
vec2 getPosition(int i,float t){float a=float(i)*.37;float b=.6+fract(float(i)/3.)*.9;float c=.8+fract(float(i+1)/4.);return .5+.5*vec2(sin(t*b+a),cos(t*c+a*1.5));}
void main(){
  vec2 uv=v_objectUV;uv+=.5;vec2 grainUV=uv*1000.;
  float grain=noise(grainUV,vec2(0.));float mixerGrain=.4*u_grainMixer*(grain-.5);
  const float firstFrameOffset=41.5;float t=.5*(u_time+firstFrameOffset);
  float radius=smoothstep(0.,1.,length(uv-.5));float center=1.-radius;
  for(float i=1.;i<=2.;i++){uv.x+=u_distortion*center/i*sin(t+i*.4*smoothstep(.0,1.,uv.y))*cos(.2*t+i*2.4*smoothstep(.0,1.,uv.y));uv.y+=u_distortion*center/i*cos(t+i*2.*smoothstep(.0,1.,uv.x));}
  vec2 uvRotated=uv-.5;float angle=3.*u_swirl*radius;uvRotated=rotate(uvRotated,-angle)+.5;
  vec3 color=vec3(0.);float opacity=0.;float totalWeight=0.;
  for(int i=0;i<10;i++){if(i>=int(u_colorsCount))break;vec2 pos=getPosition(i,t)+mixerGrain;vec3 colorFraction=u_colors[i].rgb*u_colors[i].a;float opacityFraction=u_colors[i].a;float dist=length(uvRotated-pos);dist=pow(dist,3.5);float weight=1./(dist+1e-3);color+=colorFraction*weight;opacity+=opacityFraction*weight;totalWeight+=weight;}
  color/=max(1e-4,totalWeight);opacity/=max(1e-4,totalWeight);
  float grainOverlay=valueNoise(rotate(grainUV,1.)+vec2(3.));grainOverlay=mix(grainOverlay,valueNoise(rotate(grainUV,2.)+vec2(-1.)),.5);grainOverlay=pow(grainOverlay,1.3);
  float grainOverlayV=grainOverlay*2.-1.;vec3 grainOverlayColor=vec3(step(0.,grainOverlayV));float grainOverlayStrength=u_grainOverlay*abs(grainOverlayV);grainOverlayStrength=pow(grainOverlayStrength,.8);color=mix(color,grainOverlayColor,.35*grainOverlayStrength);opacity+=.5*grainOverlayStrength;opacity=clamp(opacity,0.,1.);fragColor=vec4(color,opacity);
}`

  function rgb(hex) {
    const h = hex.slice(1)
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255,
      1,
    ]
  }

  function compileShader(gl, type, source) {
    const shader = gl.createShader(type)
    if (!shader) throw new Error('Unable to create shader')
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || 'Shader compile error'
      gl.deleteShader(shader)
      throw new Error(message)
    }
    return shader
  }

  function createProgram(gl) {
    const vertex = compileShader(gl, gl.VERTEX_SHADER, VS)
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, FS)
    const program = gl.createProgram()
    if (!program) throw new Error('Unable to create WebGL program')
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    gl.deleteShader(vertex)
    gl.deleteShader(fragment)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || 'Program link error'
      gl.deleteProgram(program)
      throw new Error(message)
    }
    return program
  }

  const mount = document.createElement('div')
  mount.className = 'hero-paper-exact-shaders'
  mount.setAttribute('aria-hidden', 'true')
  mount.style.cssText = 'position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none;opacity:0;visibility:hidden'

  const baseHost = document.createElement('div')
  const overlayHost = document.createElement('div')
  baseHost.style.cssText = 'position:absolute;inset:0'
  overlayHost.style.cssText = 'position:absolute;inset:0;opacity:.6'
  mount.append(baseHost, overlayHost)
  hero.prepend(mount)

  let layers = []

  function refreshMountVisibility() {
    const ready = layers.length === 2 && layers.every((item) => item.ready)
    mount.style.opacity = ready ? '1' : '0'
    mount.style.visibility = ready ? 'visible' : 'hidden'
  }

  function createLayer(host, colors, speed) {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.cssText = 'display:block;width:100%;height:100%'
    host.appendChild(canvas)

    let gl = null
    let program = null
    let buffer = null
    let locations = null
    let width = 0
    let height = 0
    let frame = 0
    let last = performance.now()
    let raf = 0
    let active = false
    let disposed = false
    let ready = false

    const contextOptions = { alpha: true, antialias: false, powerPreference: 'high-performance' }

    function getMaxPixelCount() {
      return window.matchMedia('(max-width: 700px)').matches ? 1920 * 1080 : 1920 * 1080 * 4
    }

    function getRenderScale() {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      return window.matchMedia('(max-width: 700px)').matches ? Math.min(dpr, 1.5) : Math.max(dpr, 2)
    }

    function destroyResources() {
      if (!gl) return
      if (buffer) gl.deleteBuffer(buffer)
      if (program) gl.deleteProgram(program)
      buffer = null
      program = null
      locations = null
    }

    function initializeContext() {
      gl = canvas.getContext('webgl2', contextOptions)
      if (!gl) throw new Error('WebGL2 unavailable')
      program = createProgram(gl)
      gl.useProgram(program)
      buffer = gl.createBuffer()
      if (!buffer) throw new Error('Unable to create WebGL buffer')
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
      gl.enableVertexAttribArray(0)
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

      const locate = (name) => gl.getUniformLocation(program, name)
      locations = {
        time: locate('u_time'),
        resolution: locate('u_resolution'),
        colors: locate('u_colors[0]'),
        count: locate('u_colorsCount'),
        distortion: locate('u_distortion'),
        swirl: locate('u_swirl'),
        grainMixer: locate('u_grainMixer'),
        grainOverlay: locate('u_grainOverlay'),
      }

      gl.uniform4fv(locations.colors, new Float32Array(colors.flatMap(rgb)))
      gl.uniform1f(locations.count, colors.length)
      gl.uniform1f(locations.distortion, 0.8)
      gl.uniform1f(locations.swirl, 0.1)
      gl.uniform1f(locations.grainMixer, 0)
      gl.uniform1f(locations.grainOverlay, 0)
      gl.clearColor(0, 0, 0, 0)
      width = 0
      height = 0
    }

    function resizeCanvas() {
      if (!gl || !program || !locations) return false
      const rect = host.getBoundingClientRect()
      const scale = getRenderScale()
      let nextWidth = Math.max(1, Math.round(rect.width * scale))
      let nextHeight = Math.max(1, Math.round(rect.height * scale))
      const pixels = nextWidth * nextHeight
      const maxPixels = getMaxPixelCount()
      if (pixels > maxPixels) {
        const cap = Math.sqrt(maxPixels / pixels)
        nextWidth = Math.max(1, Math.round(nextWidth * cap))
        nextHeight = Math.max(1, Math.round(nextHeight * cap))
      }
      if (nextWidth === width && nextHeight === height) return false
      width = nextWidth
      height = nextHeight
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
      gl.useProgram(program)
      gl.uniform2f(locations.resolution, width, height)
      return true
    }

    function renderCurrentFrame() {
      if (!gl || !program || !locations || disposed || gl.isContextLost()) return false
      gl.useProgram(program)
      gl.uniform1f(locations.time, frame * 0.001)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      gl.flush()
      ready = true
      return true
    }

    function resizeAndDraw() {
      if (disposed || !gl || gl.isContextLost()) return
      resizeCanvas()
      renderCurrentFrame()
      last = performance.now()
      refreshMountVisibility()
    }

    function loop(now) {
      if (disposed || !active || !gl || gl.isContextLost()) return
      frame += (now - last) * speed
      last = now
      resizeCanvas()
      renderCurrentFrame()
      raf = requestAnimationFrame(loop)
    }

    function setActive(nextActive) {
      if (disposed) return
      const next = Boolean(nextActive)
      if (next === active) {
        if (next) resizeAndDraw()
        return
      }
      active = next
      cancelAnimationFrame(raf)
      raf = 0
      if (active) {
        resizeAndDraw()
        last = performance.now()
        raf = requestAnimationFrame(loop)
      }
    }

    function handleContextLost(event) {
      event.preventDefault()
      cancelAnimationFrame(raf)
      raf = 0
      ready = false
      refreshMountVisibility()
    }

    function handleContextRestored() {
      if (disposed) return
      ready = false
      refreshMountVisibility()
      try {
        destroyResources()
        initializeContext()
        resizeAndDraw()
        if (active) {
          last = performance.now()
          raf = requestAnimationFrame(loop)
        }
      } catch (error) {
        ready = false
        refreshMountVisibility()
        console.error('Paper MeshGradient restore failed', error)
      }
    }

    canvas.addEventListener('webglcontextlost', handleContextLost, false)
    canvas.addEventListener('webglcontextrestored', handleContextRestored, false)

    try {
      initializeContext()
      resizeAndDraw()
    } catch (error) {
      canvas.removeEventListener('webglcontextlost', handleContextLost, false)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored, false)
      destroyResources()
      canvas.remove()
      throw error
    }

    return {
      get ready() {
        return ready
      },
      resizeAndDraw,
      setActive,
      dispose() {
        disposed = true
        cancelAnimationFrame(raf)
        canvas.removeEventListener('webglcontextlost', handleContextLost, false)
        canvas.removeEventListener('webglcontextrestored', handleContextRestored, false)
        destroyResources()
        canvas.remove()
      },
    }
  }

  try {
    layers.push(createLayer(baseHost, ['#000000', '#06b6d4', '#0891b2', '#164e63', '#f97316'], 0.3))
    layers.push(createLayer(overlayHost, ['#000000', '#ffffff', '#06b6d4', '#f97316'], 0.2))
  } catch (error) {
    layers.forEach((item) => item.dispose())
    mount.remove()
    delete hero.dataset.paperMeshExact
    console.error('Paper MeshGradient failed', error)
    return
  }

  hero.dataset.paperMeshExact = 'true'
  hero.classList.add('hero-paper-mesh-exact')
  refreshMountVisibility()

  function heroIsVisible() {
    const rect = hero.getBoundingClientRect()
    return !document.hidden && rect.bottom > 0 && rect.top < window.innerHeight
  }

  function updateActivity() {
    const visible = heroIsVisible()
    layers.forEach((item) => item.setActive(visible))
  }

  const resizeObserver = 'ResizeObserver' in window
    ? new ResizeObserver(() => layers.forEach((item) => item.resizeAndDraw()))
    : null
  resizeObserver?.observe(hero)

  const intersectionObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(updateActivity, { threshold: 0.01 })
    : null
  intersectionObserver?.observe(hero)

  document.addEventListener('visibilitychange', updateActivity)
  window.addEventListener('orientationchange', () => {
    layers.forEach((item) => item.resizeAndDraw())
    updateActivity()
  }, { passive: true })

  updateActivity()
})()
