;(function () {
  'use strict'

  window.VIP_TATTOO_LOCALE = 'ru'
  const modules = ['site-core.js', 'site-interactions.js']

  function installCasesSection() {
    const currentHead = document.querySelector('.section-head.case-fan-head')
    const currentSection = currentHead?.closest('section.section')
    if (!currentSection) return

    currentSection.outerHTML = `<section class="section">
  <div class="container">
    <!-- 1. Заголовок -->
    <div class="section-head"><h2>Это не просто курс…</h2></div>

    <!-- 2. Чат-моксап -->
    <div class="chat-mock">
      <div class="chat-head"><span>Общий чат выпускников школы</span><span>сейчас</span></div>
      <p><span class="author">Марта_ink:</span> Спасибо! 🙏 …</p>
    </div>

    <!-- 3. Підзаголовок -->
    <div class="section-head case-fan-head">
      <span class="kicker">Кейсы учеников</span>
      <h2>Кейсы учеников после обучения</h2>
    </div>

    <!-- 4. Віяло кейсів (малює script.js) -->
    <div class="case-fan-wrap">
      <div class="case-fan-layout" id="caseFanLayout"></div>
      <div class="case-fan-detail" id="caseFanDetail"></div>
      <div class="case-fan-nav" id="caseFanNav" hidden>
        <button class="case-fan-arrow" id="caseFanPrev">‹</button>
        <div class="case-fan-dots" id="caseFanDots"></div>
        <button class="case-fan-arrow" id="caseFanNext">›</button>
      </div>
    </div>

    <!-- 5. CTA: зірки + аватарки-тултіпи + кнопка -->
    <div class="case-fan-cta">
      <div class="stars">★★★★★</div>
      <div class="avatar-row">
        <div class="avatars">
          <div class="avatar-tip">
            <div class="avatar-tip-bubble">…ім'я/країна/роль…</div>
            <span class="avatar"></span>
          </div>
          <!-- ×5 аватарок -->
        </div>
        <span class="count">300+</span>
      </div>
      <a href="#pricing" class="btn btn-stardust"><span class="btn-stardust-wrap">Купить курс и начать обучение тату</span></a>
    </div>
  </div>
</section>`
  }

  function finish() {
    installCasesSection()
    window.__vipTattooAppReady = true
    document.dispatchEvent(new CustomEvent('vip:app-ready'))
  }

  function load(index) {
    if (index >= modules.length) {
      finish()
      return
    }

    const script = document.createElement('script')
    script.src = modules[index]
    script.async = false
    script.dataset.vipAppModule = modules[index]
    script.addEventListener('load', () => load(index + 1), { once: true })
    script.addEventListener('error', () => {
      console.error('[VIP Tattoo] Failed to load app module:', modules[index])
      load(index + 1)
    }, { once: true })
    document.head.appendChild(script)
  }

  load(0)
})()
