;(function () {
  'use strict'

  if (window.__vipTattooCasesLoaded) return
  window.__vipTattooCasesLoaded = true

  const app = window.VIP_TATTOO_APP
  if (!app) return

  const ru = [
    ['01', 'Марго, 24 года', 'До / После · Модуль 5', 'Первая тату на модели под наблюдением ментора — ровная линия без дрожи с первого раза.', '3 клиента за первую неделю'],
    ['02', 'Максим, 31 год', 'До / После · Модуль 7', 'Перешёл от рисования на бумаге сразу к цветной работе — портфолио за 2 месяца.', '12 работ в портфолио'],
    ['03', 'Оля, 27 лет', 'До / После · Модуль 9', 'Нашла первых клиентов через Instagram ещё до завершения курса, по шаблону из бонусов.', '30+ заявок, 5 продаж'],
    ['04', 'Дмитрий, 29 лет', 'До / После · Модуль 6', 'Освоил лайнворк и штриховку с нуля, преподаватель разобрал его технику на трёх личных созвонах.', '8 работ за месяц практики'],
    ['05', 'Настя, 22 года', 'До / После · Модуль 4', 'Пришла без художественного опыта — после блока по композиции взяла первую платную работу.', 'Первый клиент на 3 неделе'],
    ['06', 'Карина, 34 года', 'До / После · Модуль 8', 'Сменила профессию в 34 — курс подтянул именно то, чего не хватало для перехода в цвет и реализм.', '15 работ в портфолио'],
    ['07', 'Марта, 26 лет', 'До / После · Модуль 10', 'Прошла курс полностью удалённо, дипломную работу разбирали на выпускном созвоне с ментором.', '20+ заявок после выпуска'],
    ['08', 'Артём, 33 года', 'До / После · Модуль 5', 'Раньше рисовал только скетчи для себя — на курсе впервые набил тату другу под контролем ментора.', 'Первая оплаченная работа на 4 неделе'],
    ['09', 'Юля, 25 лет', 'До / После · Модуль 8', 'Боялась цвета — блок по цветовой теории и разбор работ сняли страх, теперь цвет в каждой третьей работе.', '10 цветных работ за 2 месяца'],
    ['10', 'Богдан, 27 лет', 'До / После · Модуль 7', 'Пришёл из графического дизайна — перенос композиции на кожу дался легко, специализация в геометрии.', '18 работ в портфолио'],
    ['11', 'Соня, 30 лет', 'До / После · Модуль 9', 'Совмещала обучение с основной работой — по вечерам разбирала уроки, к выпуску набрала первую очередь клиентов.', 'Запись на 3 недели вперёд'],
    ['12', 'Игорь, 36 лет', 'До / После · Модуль 6', 'Сменил профессию после 15 лет в другой сфере — курс дал уверенность работать с реальной кожей с первой недели.', '6 клиентов за первый месяц'],
  ]

  const uk = [
    ['01', 'Марго, 24 роки', 'До / Після · Модуль 5', 'Перше тату на моделі під наглядом ментора — рівна лінія без тремтіння з першого разу.', '3 клієнти за перший тиждень'],
    ['02', 'Максим, 31 рік', 'До / Після · Модуль 7', 'Перейшов від малювання на папері одразу до кольорової роботи — портфоліо за 2 місяці.', '12 робіт у портфоліо'],
    ['03', 'Оля, 27 років', 'До / Після · Модуль 9', 'Знайшла перших клієнтів через Instagram ще до завершення курсу, за шаблоном із бонусів.', '30+ заявок, 5 продажів'],
    ['04', 'Дмитро, 29 років', 'До / Після · Модуль 6', 'Опанував лайнворк і штрихування з нуля, викладач розібрав його техніку на трьох особистих дзвінках.', '8 робіт за місяць практики'],
    ['05', 'Настя, 22 роки', 'До / Після · Модуль 4', 'Прийшла без художнього досвіду — після блоку з композиції взяла першу платну роботу.', 'Перший клієнт на 3 тижні'],
    ['06', 'Карина, 34 роки', 'До / Після · Модуль 8', 'Змінила професію у 34 — курс підтягнув саме те, чого бракувало для переходу в колір і реалізм.', '15 робіт у портфоліо'],
    ['07', 'Марта, 26 років', 'До / Після · Модуль 10', 'Пройшла курс повністю дистанційно, дипломну роботу розбирали на випускному дзвінку з ментором.', '20+ заявок після випуску'],
    ['08', 'Артем, 33 роки', 'До / Після · Модуль 5', 'Раніше малював лише скетчі для себе — на курсі вперше зробив тату другові під контролем ментора.', 'Перша оплачена робота на 4 тижні'],
    ['09', 'Юля, 25 років', 'До / Після · Модуль 8', 'Боялася кольору — блок із теорії кольору та розбір робіт зняли страх, тепер колір у кожній третій роботі.', '10 кольорових робіт за 2 місяці'],
    ['10', 'Богдан, 27 років', 'До / Після · Модуль 7', 'Прийшов із графічного дизайну — перенесення композиції на шкіру далося легко, спеціалізація в геометрії.', '18 робіт у портфоліо'],
    ['11', 'Соня, 30 років', 'До / Після · Модуль 9', 'Поєднувала навчання з основною роботою — вечорами проходила уроки, до випуску зібрала першу чергу клієнтів.', 'Запис на 3 тижні наперед'],
    ['12', 'Ігор, 36 років', 'До / Після · Модуль 6', 'Змінив професію після 15 років в іншій сфері — курс дав упевненість працювати зі справжньою шкірою з першого тижня.', '6 клієнтів за перший місяць'],
  ]

  const studies = (app.isUk ? uk : ru).map(([idx, name, module, text, stat]) => ({ idx, name, module, text, stat }))
  const layout = document.getElementById('caseFanLayout')
  if (!layout || !studies.length) return

  const detail = document.getElementById('caseFanDetail')
  const nav = document.getElementById('caseFanNav')
  const dots = document.getElementById('caseFanDots')
  const previous = document.getElementById('caseFanPrev')
  const next = document.getElementById('caseFanNext')
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)')
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let centerIndex = Math.floor(studies.length / 2)
  let focusedSlot = null
  let renderedVisibleCount = 0
  let resizeFrame = 0
  let suppressClickUntil = 0
  const gesture = { active: false, pointerId: null, startX: 0, startY: 0, x: 0, y: 0 }

  layout.setAttribute('role', 'group')
  layout.setAttribute('aria-roledescription', app.isUk ? 'карусель кейсів' : 'карусель кейсов')
  layout.setAttribute('aria-label', app.isUk ? 'Кейси випускників. Обирайте картку, гортайте свайпом або кнопками.' : 'Кейсы выпускников. Выбирайте карточку, листайте свайпом или кнопками.')
  layout.tabIndex = 0
  detail?.setAttribute('aria-live', 'polite')
  detail?.setAttribute('aria-atomic', 'true')
  previous?.setAttribute('aria-label', app.copy.previousCase)
  next?.setAttribute('aria-label', app.copy.nextCase)

  function modeForWidth() {
    const width = layout.getBoundingClientRect().width || window.innerWidth
    if (width < 480) return { visible: 6, rotation: 16, edgeScale: 0.68, vertical: 18 }
    if (width < 768) return { visible: 7, rotation: 18, edgeScale: 0.70, vertical: 22 }
    if (width < 1024) return { visible: 12, rotation: 22, edgeScale: 0.61, vertical: 31 }
    return { visible: 18, rotation: 25, edgeScale: 0.55, vertical: 44 }
  }

  function renderDetail(item) {
    if (!detail) return
    detail.replaceChildren()
    const module = document.createElement('span')
    module.className = 'case-fan-detail-module'
    module.textContent = item.module
    const title = document.createElement('h4')
    title.textContent = item.name
    const text = document.createElement('p')
    text.textContent = item.text
    const stat = document.createElement('div')
    stat.className = 'case-stat'
    stat.textContent = item.stat
    detail.append(module, title, text, stat)
  }

  function applyLayout() {
    const cards = [...layout.querySelectorAll('.case-fan-card')]
    if (!cards.length) return

    const mode = modeForWidth()
    const activeSlot = Math.floor(cards.length / 2)
    const leftSlots = Math.max(1, activeSlot)
    const rightSlots = Math.max(1, cards.length - 1 - activeSlot)
    const cardWidth = cards[0].getBoundingClientRect().width || 110
    const layoutWidth = layout.getBoundingClientRect().width || window.innerWidth
    const maxX = Math.max(cardWidth * 0.58, layoutWidth / 2 - cardWidth * 0.58 - 10)

    cards.forEach((card) => {
      const slot = Number(card.dataset.slot)
      const offset = slot - activeSlot
      const normalized = offset < 0 ? offset / leftSlots : offset / rightSlots
      const absolute = Math.abs(normalized)
      let x = normalized * maxX
      let y = absolute * absolute * mode.vertical
      let rotation = normalized * mode.rotation
      let scale = 1 - (1 - mode.edgeScale) * absolute
      let zIndex = 100 - Math.round(absolute * 36)

      if (focusedSlot !== null && hoverCapable.matches) {
        const slotDistance = Math.abs(slot - focusedSlot)
        if (slot === focusedSlot) {
          y -= 10
          scale *= 1.08
          zIndex = 130
        } else {
          const direction = slot < focusedSlot ? -1 : 1
          x += direction * Math.max(6, cardWidth * 0.06) / (slotDistance + 0.5)
        }
      }

      const isActive = slot === activeSlot
      card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`
      card.style.zIndex = String(zIndex)
      card.setAttribute('aria-pressed', String(isActive))
      card.classList.toggle('is-focused', focusedSlot === slot)
      card.classList.toggle('is-centered', isActive)
    })
  }

  function select(index, options = {}) {
    centerIndex = (index + studies.length) % studies.length
    render({ focusCenter: Boolean(options.focusCenter) })
  }

  function createDot(item, index) {
    const dot = document.createElement('button')
    dot.type = 'button'
    dot.className = `case-fan-dot${index === centerIndex ? ' is-active' : ''}`
    dot.setAttribute('aria-label', `${app.isUk ? 'Відкрити кейс' : 'Открыть кейс'} ${item.name}`)
    dot.setAttribute('aria-current', index === centerIndex ? 'true' : 'false')
    dot.addEventListener('click', () => select(index))
    return dot
  }

  function createCard(item, dataIndex, slot, activeSlot) {
    const card = document.createElement('button')
    card.type = 'button'
    card.className = 'case-fan-card'
    card.dataset.slot = String(slot)
    card.dataset.caseIndex = String(dataIndex)
    card.setAttribute('aria-label', `${app.isUk ? 'Відкрити кейс' : 'Открыть кейс'} ${item.name}. ${item.stat}`)
    card.setAttribute('aria-pressed', String(slot === activeSlot))

    const visual = document.createElement('span')
    visual.className = 'case-fan-card-visual'
    const label = document.createElement('span')
    label.className = 'case-fan-card-label'
    const indexNode = document.createElement('span')
    indexNode.className = 'case-fan-card-index'
    indexNode.textContent = `/${item.idx}`
    const name = document.createElement('span')
    name.className = 'case-fan-card-name'
    name.textContent = item.name
    label.append(indexNode, name)
    visual.appendChild(label)
    card.appendChild(visual)

    if (hoverCapable.matches) {
      card.addEventListener('mouseenter', () => {
        focusedSlot = slot
        renderDetail(item)
        applyLayout()
      })
      card.addEventListener('mouseleave', () => {
        focusedSlot = null
        renderDetail(studies[centerIndex])
        applyLayout()
      })
    }

    card.addEventListener('focus', () => {
      focusedSlot = slot
      renderDetail(item)
      applyLayout()
    })
    card.addEventListener('blur', () => {
      focusedSlot = null
      renderDetail(studies[centerIndex])
      applyLayout()
    })
    card.addEventListener('click', (event) => {
      if (performance.now() < suppressClickUntil) {
        event.preventDefault()
        return
      }
      select(dataIndex, { focusCenter: event.detail === 0 })
    })
    return card
  }

  function render(options = {}) {
    const mode = modeForWidth()
    const visibleCount = mode.visible
    const activeSlot = Math.floor(visibleCount / 2)
    renderedVisibleCount = visibleCount
    focusedSlot = null
    layout.dataset.visibleSlots = String(visibleCount)
    layout.replaceChildren()
    dots?.replaceChildren()

    studies.forEach((item, index) => dots?.appendChild(createDot(item, index)))

    for (let slot = 0; slot < visibleCount; slot += 1) {
      const dataIndex = ((centerIndex + slot - activeSlot) % studies.length + studies.length) % studies.length
      layout.appendChild(createCard(studies[dataIndex], dataIndex, slot, activeSlot))
    }

    renderDetail(studies[centerIndex])
    if (nav) nav.hidden = studies.length <= 1
    applyLayout()

    requestAnimationFrame(() => {
      dots?.querySelector('.case-fan-dot.is-active')?.scrollIntoView({ block: 'nearest', inline: 'center' })
      if (options.focusCenter) {
        layout.querySelector(`.case-fan-card[data-slot="${activeSlot}"]`)?.focus({ preventScroll: true })
      }
    })
  }

  function step(direction, options = {}) {
    select(centerIndex + direction, options)
  }

  previous?.addEventListener('click', () => step(-1))
  next?.addEventListener('click', () => step(1))

  layout.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Home') select(0, { focusCenter: true })
    else if (event.key === 'End') select(studies.length - 1, { focusCenter: true })
    else step(event.key === 'ArrowLeft' ? -1 : 1, { focusCenter: true })
  })

  layout.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary) return
    gesture.active = true
    gesture.pointerId = event.pointerId
    gesture.startX = gesture.x = event.clientX
    gesture.startY = gesture.y = event.clientY
    layout.classList.add('is-dragging')
    layout.setPointerCapture?.(event.pointerId)
  })

  layout.addEventListener('pointermove', (event) => {
    if (!gesture.active || event.pointerId !== gesture.pointerId) return
    gesture.x = event.clientX
    gesture.y = event.clientY
    const deltaX = gesture.x - gesture.startX
    const deltaY = gesture.y - gesture.startY
    if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) event.preventDefault()
  }, { passive: false })

  function finishGesture(event) {
    if (!gesture.active || (event && event.pointerId !== gesture.pointerId)) return
    const deltaX = gesture.x - gesture.startX
    const deltaY = gesture.y - gesture.startY
    const threshold = Math.max(32, Math.min(68, layout.getBoundingClientRect().width * 0.09))
    const horizontalSwipe = Math.abs(deltaX) >= threshold && Math.abs(deltaX) > Math.abs(deltaY) * 1.12

    if (event && layout.hasPointerCapture?.(event.pointerId)) layout.releasePointerCapture(event.pointerId)
    gesture.active = false
    gesture.pointerId = null
    layout.classList.remove('is-dragging')

    if (horizontalSwipe) {
      suppressClickUntil = performance.now() + 300
      step(deltaX < 0 ? 1 : -1)
    }
  }

  layout.addEventListener('pointerup', finishGesture)
  layout.addEventListener('pointercancel', finishGesture)

  function scheduleResponsiveUpdate() {
    if (resizeFrame) cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0
      const nextVisibleCount = modeForWidth().visible
      if (nextVisibleCount !== renderedVisibleCount) render()
      else applyLayout()
    })
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(scheduleResponsiveUpdate).observe(layout)
  } else {
    window.addEventListener('resize', scheduleResponsiveUpdate, { passive: true })
  }

  if (!reducedMotion) layout.classList.add('has-motion')
  render()
})()
