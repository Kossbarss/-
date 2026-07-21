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
  let renderedModeKey = ''
  let resizeFrame = 0
  let transitionTimer = 0
  let suppressClickUntil = 0
  const gesture = {
    active: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    rotation: 0,
  }

  const modulo = (value, total) => ((value % total) + total) % total

  function getMode() {
    const width = layout.getBoundingClientRect().width || window.innerWidth
    if (width < 480) return { key: 'cylinder-6', kind: 'cylinder', slots: 6, cardRatio: 0.35 }
    if (width < 768) return { key: 'cylinder-7', kind: 'cylinder', slots: 7, cardRatio: 0.27 }
    if (width < 1024) return { key: 'fan-12', kind: 'fan', slots: 12, rotation: 18, edgeScale: 0.7, vertical: 28 }
    return { key: 'fan-20', kind: 'fan', slots: 20, rotation: 24, edgeScale: 0.64, vertical: 42 }
  }

  function buildSlots(mode) {
    const centerSlot = Math.floor(mode.slots / 2)
    return Array.from({ length: mode.slots }, (_, slot) => {
      const offset = slot - centerSlot
      const dataIndex = modulo(centerIndex + offset, studies.length)
      return { slot, centerSlot, offset, dataIndex, item: studies[dataIndex] }
    })
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

  function createDot(item, index) {
    const dot = document.createElement('button')
    dot.type = 'button'
    dot.className = `case-fan-dot${index === centerIndex ? ' is-active' : ''}`
    dot.setAttribute('aria-label', `${app.isUk ? 'Відкрити кейс' : 'Открыть кейс'} ${item.name}`)
    dot.setAttribute('aria-current', index === centerIndex ? 'true' : 'false')
    dot.addEventListener('click', () => select(index))
    return dot
  }

  function createCard(face, mode) {
    const { slot, centerSlot, dataIndex, item } = face
    const card = document.createElement('button')
    card.type = 'button'
    card.className = 'case-fan-card'
    card.dataset.slot = String(slot)
    card.dataset.caseIndex = String(dataIndex)
    card.setAttribute('aria-label', `${app.isUk ? 'Відкрити кейс' : 'Открыть кейс'} ${item.name}. ${item.stat}`)

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

    if (mode.kind === 'fan' && hoverCapable.matches) {
      card.addEventListener('mouseenter', () => renderDetail(item))
      card.addEventListener('mouseleave', () => renderDetail(studies[centerIndex]))
    }

    card.addEventListener('focus', () => renderDetail(item))
    card.addEventListener('blur', () => renderDetail(studies[centerIndex]))
    card.addEventListener('click', (event) => {
      if (performance.now() < suppressClickUntil) {
        event.preventDefault()
        return
      }
      if (mode.kind === 'cylinder') {
        const offset = slot - centerSlot
        if (offset !== 0) {
          animateCylinderStep(offset)
          return
        }
      }
      select(dataIndex, { focusCenter: event.detail === 0 })
    })
    return card
  }

  function applyFanLayout(mode) {
    const cards = [...layout.querySelectorAll('.case-fan-card')]
    if (!cards.length) return

    const centerSlot = (cards.length - 1) / 2
    const cardWidth = cards[0].getBoundingClientRect().width || 100
    const layoutWidth = layout.getBoundingClientRect().width || window.innerWidth
    const maxX = Math.max(cardWidth * 0.55, layoutWidth / 2 - cardWidth * 0.55 - 10)

    cards.forEach((card) => {
      const slot = Number(card.dataset.slot)
      const normalized = centerSlot ? (slot - centerSlot) / centerSlot : 0
      const absolute = Math.abs(normalized)
      const x = normalized * maxX
      const y = Math.pow(absolute, 1.65) * mode.vertical
      const rotation = normalized * mode.rotation
      const scale = 1 - (1 - mode.edgeScale) * absolute
      const zIndex = 100 - Math.round(absolute * 60)
      const isCenter = Math.abs(slot - centerSlot) < 0.51

      card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`
      card.style.zIndex = String(zIndex)
      card.style.opacity = '1'
      card.style.pointerEvents = 'auto'
      card.tabIndex = isCenter ? 0 : -1
      card.setAttribute('aria-hidden', 'false')
      card.setAttribute('aria-pressed', String(isCenter))
      card.classList.toggle('is-centered', isCenter)
    })
  }

  function normalizeAngle(value) {
    return modulo(value + 180, 360) - 180
  }

  function applyCylinderLayout(mode, extraRotation = 0) {
    const cards = [...layout.querySelectorAll('.case-fan-card')]
    if (!cards.length) return

    const centerSlot = Math.floor(mode.slots / 2)
    const step = 360 / mode.slots
    const cardWidth = cards[0].getBoundingClientRect().width || 130
    const radius = Math.max(cardWidth * 0.92, (cardWidth * mode.slots * 1.04) / (2 * Math.PI))

    cards.forEach((card) => {
      const slot = Number(card.dataset.slot)
      const angle = (slot - centerSlot) * step + extraRotation
      const visibleAngle = normalizeAngle(angle)
      const absoluteAngle = Math.abs(visibleAngle)
      const isCenter = absoluteAngle < step * 0.32
      const isInteractive = absoluteAngle <= 82
      const opacity = absoluteAngle <= 92 ? 1 : 0
      const depth = Math.cos((visibleAngle * Math.PI) / 180)

      card.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`
      card.style.zIndex = String(100 + Math.round(depth * 80))
      card.style.opacity = String(opacity)
      card.style.pointerEvents = isInteractive ? 'auto' : 'none'
      card.tabIndex = isCenter ? 0 : -1
      card.setAttribute('aria-hidden', String(!isInteractive))
      card.setAttribute('aria-pressed', String(isCenter))
      card.classList.toggle('is-centered', isCenter)
    })
  }

  function applyLayout(extraRotation = 0) {
    const mode = getMode()
    if (mode.kind === 'cylinder') applyCylinderLayout(mode, extraRotation)
    else applyFanLayout(mode)
  }

  function render(options = {}) {
    const mode = getMode()
    renderedModeKey = mode.key
    layout.classList.toggle('is-cylinder', mode.kind === 'cylinder')
    layout.classList.toggle('is-fan', mode.kind === 'fan')
    layout.classList.remove('is-dragging', 'is-snapping')
    layout.dataset.slots = String(mode.slots)
    layout.replaceChildren()
    dots?.replaceChildren()

    studies.forEach((item, index) => dots?.appendChild(createDot(item, index)))
    buildSlots(mode).forEach((face) => layout.appendChild(createCard(face, mode)))

    renderDetail(studies[centerIndex])
    if (nav) nav.hidden = studies.length <= 1
    applyLayout(0)

    requestAnimationFrame(() => {
      dots?.querySelector('.case-fan-dot.is-active')?.scrollIntoView({ block: 'nearest', inline: 'center' })
      if (options.focusCenter) layout.querySelector('.case-fan-card.is-centered')?.focus({ preventScroll: true })
    })
  }

  function select(index, options = {}) {
    centerIndex = modulo(index, studies.length)
    render(options)
  }

  function finishCylinderAnimation(stepCount, options = {}) {
    window.clearTimeout(transitionTimer)
    transitionTimer = window.setTimeout(() => {
      centerIndex = modulo(centerIndex + stepCount, studies.length)
      render({ focusCenter: Boolean(options.focusCenter) })
    }, reducedMotion ? 20 : 430)
  }

  function animateCylinderStep(stepCount, options = {}) {
    if (!stepCount) return
    const mode = getMode()
    if (mode.kind !== 'cylinder') {
      select(centerIndex + stepCount, options)
      return
    }

    const clamped = Math.max(-3, Math.min(3, stepCount))
    const targetRotation = -(360 / mode.slots) * clamped
    layout.classList.remove('is-dragging')
    layout.classList.add('is-snapping')
    applyCylinderLayout(mode, targetRotation)
    finishCylinderAnimation(clamped, options)
  }

  function step(direction, options = {}) {
    const mode = getMode()
    if (mode.kind === 'cylinder') animateCylinderStep(direction, options)
    else select(centerIndex + direction, options)
  }

  previous?.addEventListener('click', () => step(-1))
  next?.addEventListener('click', () => step(1))

  layout.setAttribute('role', 'group')
  layout.setAttribute('aria-roledescription', app.isUk ? 'карусель кейсів' : 'карусель кейсов')
  layout.setAttribute('aria-label', app.isUk ? 'Кейси випускників. Гортайте свайпом, кнопками або стрілками клавіатури.' : 'Кейсы выпускников. Листайте свайпом, кнопками или стрелками клавиатуры.')
  layout.tabIndex = 0
  detail?.setAttribute('aria-live', 'polite')
  detail?.setAttribute('aria-atomic', 'true')
  previous?.setAttribute('aria-label', app.copy.previousCase)
  next?.setAttribute('aria-label', app.copy.nextCase)

  layout.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    if (event.key === 'Home') select(0, { focusCenter: true })
    else if (event.key === 'End') select(studies.length - 1, { focusCenter: true })
    else step(event.key === 'ArrowLeft' ? -1 : 1, { focusCenter: true })
  })

  layout.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary) return
    const mode = getMode()
    gesture.active = true
    gesture.pointerId = event.pointerId
    gesture.startX = gesture.currentX = event.clientX
    gesture.startY = gesture.currentY = event.clientY
    gesture.rotation = 0
    layout.classList.add('is-dragging')
    layout.classList.remove('is-snapping')
    layout.setPointerCapture?.(event.pointerId)
    if (mode.kind === 'cylinder') applyCylinderLayout(mode, 0)
  })

  layout.addEventListener('pointermove', (event) => {
    if (!gesture.active || event.pointerId !== gesture.pointerId) return
    gesture.currentX = event.clientX
    gesture.currentY = event.clientY
    const deltaX = gesture.currentX - gesture.startX
    const deltaY = gesture.currentY - gesture.startY
    const mode = getMode()

    if (Math.abs(deltaX) > 8 && Math.abs(deltaX) > Math.abs(deltaY)) event.preventDefault()
    if (mode.kind === 'cylinder') {
      gesture.rotation = deltaX * 0.22
      applyCylinderLayout(mode, gesture.rotation)
    }
  }, { passive: false })

  function finishGesture(event) {
    if (!gesture.active || (event && event.pointerId !== gesture.pointerId)) return

    const deltaX = gesture.currentX - gesture.startX
    const deltaY = gesture.currentY - gesture.startY
    const mode = getMode()
    const threshold = Math.max(32, Math.min(70, layout.getBoundingClientRect().width * 0.09))
    const horizontalSwipe = Math.abs(deltaX) >= threshold && Math.abs(deltaX) > Math.abs(deltaY) * 1.12

    if (event && layout.hasPointerCapture?.(event.pointerId)) layout.releasePointerCapture(event.pointerId)
    gesture.active = false
    gesture.pointerId = null
    layout.classList.remove('is-dragging')

    if (horizontalSwipe) {
      suppressClickUntil = performance.now() + 320
      const direction = deltaX < 0 ? 1 : -1
      if (mode.kind === 'cylinder') {
        const rawSteps = Math.round(Math.abs(gesture.rotation) / (360 / mode.slots))
        animateCylinderStep(direction * Math.max(1, Math.min(3, rawSteps || 1)))
      } else {
        step(direction)
      }
    } else if (mode.kind === 'cylinder') {
      layout.classList.add('is-snapping')
      applyCylinderLayout(mode, 0)
      window.setTimeout(() => layout.classList.remove('is-snapping'), reducedMotion ? 20 : 430)
    }
  }

  layout.addEventListener('pointerup', finishGesture)
  layout.addEventListener('pointercancel', finishGesture)

  function scheduleResponsiveUpdate() {
    if (resizeFrame) cancelAnimationFrame(resizeFrame)
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0
      const nextMode = getMode()
      if (nextMode.key !== renderedModeKey) render()
      else applyLayout(0)
    })
  }

  if ('ResizeObserver' in window) {
    new ResizeObserver(scheduleResponsiveUpdate).observe(layout)
  } else {
    window.addEventListener('resize', scheduleResponsiveUpdate, { passive: true })
  }

  render()
})()
