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
    ['09', 'Юля, 25 лет', 'До / После · Модуль 8', 'Боялась цвета — блок по цветовой теории и разбор работ снял страх, теперь цвет в каждой третьей работе.', '10 цветных работ за 2 месяца'],
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
  const maxVisible = 7
  const positions = [
    { rot: -21, scale: 0.7756, x: -9.5, y: 2.3, z: 1 },
    { rot: -14, scale: 0.8498, x: -7.0, y: 1.3, z: 2 },
    { rot: -7, scale: 0.9346, x: -3.5, y: 0.4, z: 3 },
    { rot: 0, scale: 1, x: 0, y: 0, z: 10 },
    { rot: 7, scale: 0.9346, x: 3.5, y: 0.4, z: 3 },
    { rot: 14, scale: 0.8498, x: 7, y: 1.3, z: 2 },
    { rot: 21, scale: 0.7756, x: 9.5, y: 2.3, z: 1 },
  ]
  let centerIndex = Math.floor(studies.length / 2)
  let focusedSlot = null

  layout.setAttribute('role', 'list')
  layout.setAttribute('aria-label', app.isUk ? 'Кейси випускників' : 'Кейсы выпускников')
  previous?.setAttribute('aria-label', app.copy.previousCase)
  next?.setAttribute('aria-label', app.copy.nextCase)

  function slotConfig(total, slot) {
    if (total >= maxVisible) return positions[slot]
    const center = total >> 1
    const distance = total > 1 ? (slot - center) / (center || 1) : 0
    const absolute = Math.abs(distance)
    return {
      rot: distance * 21,
      scale: 1 - 0.2244 * absolute * absolute,
      x: distance * 9.5,
      y: absolute * absolute * 2.3,
      z: 10 - Math.abs(slot - center),
    }
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
    const centerSlot = (cards.length - 1) / 2
    cards.forEach((card) => {
      const slot = Number(card.dataset.slot)
      const base = slotConfig(cards.length, slot)
      let { x, y, rot, scale } = base
      if (focusedSlot !== null) {
        const distance = Math.abs(slot - focusedSlot)
        if (slot === focusedSlot) {
          y -= 0.9
          scale *= 1.1
        } else {
          const normalized = centerSlot > 0 ? (slot - centerSlot) / centerSlot : 0
          const push = 2.6 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - distance))
          if (slot < focusedSlot) {
            x -= push
            rot -= 3 / (distance + 1)
          } else {
            x += push
            rot += 3 / (distance + 1)
          }
        }
      }
      card.style.transform = `translate(-50%, -50%) translate(${x}rem, ${y}rem) rotate(${rot}deg) scale(${scale})`
      card.style.zIndex = String(focusedSlot === slot ? 20 : base.z)
      card.classList.toggle('is-focused', focusedSlot === slot)
    })
  }

  function select(index) {
    centerIndex = (index + studies.length) % studies.length
    render()
  }

  function render() {
    layout.replaceChildren()
    dots?.replaceChildren()
    focusedSlot = null
    const visible = Math.min(studies.length, maxVisible)
    const half = Math.floor(visible / 2)

    studies.forEach((item, index) => {
      if (!dots) return
      const dot = document.createElement('button')
      dot.type = 'button'
      dot.className = `case-fan-dot${index === centerIndex ? ' is-active' : ''}`
      dot.setAttribute('aria-label', `${app.isUk ? 'Відкрити кейс' : 'Открыть кейс'} ${item.name}`)
      dot.setAttribute('aria-current', index === centerIndex ? 'true' : 'false')
      dot.addEventListener('click', () => select(index))
      dots.appendChild(dot)
    })

    for (let slot = 0; slot < visible; slot += 1) {
      const dataIndex = ((centerIndex + slot - half) % studies.length + studies.length) % studies.length
      const item = studies[dataIndex]
      const card = document.createElement('button')
      card.type = 'button'
      card.className = 'case-fan-card'
      card.dataset.slot = String(slot)
      card.setAttribute('role', 'listitem')
      card.setAttribute('aria-label', `${item.name}. ${item.stat}`)

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

      const focus = () => {
        focusedSlot = slot
        renderDetail(item)
        applyLayout()
      }
      const clear = () => {
        focusedSlot = null
        renderDetail(studies[centerIndex])
        applyLayout()
      }
      card.addEventListener('mouseenter', focus)
      card.addEventListener('mouseleave', clear)
      card.addEventListener('focus', focus)
      card.addEventListener('blur', clear)
      card.addEventListener('click', () => select(dataIndex))
      layout.appendChild(card)
    }

    renderDetail(studies[centerIndex])
    if (nav) nav.hidden = studies.length <= maxVisible
    applyLayout()
  }

  previous?.addEventListener('click', () => select(centerIndex - 1))
  next?.addEventListener('click', () => select(centerIndex + 1))
  render()
})()
