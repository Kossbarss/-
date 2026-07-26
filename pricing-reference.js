// Animated ring/glow canvas behind the pricing card. Deliberately does not
// touch .pricing-section or .order-box styling -- those stay on the plain
// site CSS. This module only adds the WebGL canvas layer.
;(function () {
  function initPricingGlow() {
    const section = document.getElementById('pricing')
    if (!section || section.dataset.pricingGlowReady === 'true') return

    const clip = section.querySelector('.section-clip') || section
    section.dataset.pricingGlowReady = 'true'

    const style = document.createElement('style')
    style.dataset.feature = 'pricing-glow-canvas'
    style.textContent = `
      .pricing-glow-canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
        display: block;
      }
    `
    document.head.appendChild(style)

    const canvas = document.createElement('canvas')
    canvas.className = 'pricing-glow-canvas'
    canvas.setAttribute('aria-hidden', 'true')
    clip.insertBefore(canvas, clip.firstChild)

    const gl = canvas.getContext('webgl', { alpha: true, antialias: false, preserveDrawingBuffer: true })
    if (!gl) return

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

    function drawFrame() {
      resize()
      gl.uniform1f(timeLocation, performance.now() * .001)
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    // The canvas can only size itself correctly once .section-clip has its
    // final layout box, which may not be true yet at init time (fonts/images
    // still loading). Under prefers-reduced-motion there is no continuous
    // rAF loop to self-correct a stale/zero size later, so redraw on every
    // layout change the section box goes through, not just on window resize.
    if ('ResizeObserver' in window) {
      new ResizeObserver(drawFrame).observe(clip)
    } else {
      window.addEventListener('resize', drawFrame, { passive: true })
    }
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(drawFrame)
    }
    window.addEventListener('load', drawFrame, { once: true })

    resize()
    frameId = requestAnimationFrame(render)

    // TEMPORARY on-page diagnostic overlay -- remove once the missing-ring
    // issue in the published preview is understood. Avoids needing DevTools.
    window.setTimeout(function () {
      const rect = canvas.getBoundingClientRect()
      const pixels = new Uint8Array(4)
      let pixelInfo = 'n/a'
      try {
        gl.readPixels(Math.floor(canvas.width / 2), Math.floor(canvas.height / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
        pixelInfo = Array.from(pixels).join(',')
      } catch (e) {
        pixelInfo = 'readPixels error: ' + e.message
      }
      const badge = document.createElement('div')
      badge.textContent =
        'DIAG: canvas=' + canvas.width + 'x' + canvas.height +
        ' rect=' + Math.round(rect.width) + 'x' + Math.round(rect.height) +
        ' gl=' + (!!gl) +
        ' reducedMotion=' + reducedMotion +
        ' centerPixel=' + pixelInfo
      badge.style.cssText =
        'position:relative;z-index:99;background:#0f0;color:#000;' +
        'font:12px monospace;padding:6px 10px;word-break:break-all;'
      clip.insertBefore(badge, clip.firstChild.nextSibling)
    }, 800)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPricingGlow, { once: true })
  } else {
    initPricingGlow()
  }
})()
