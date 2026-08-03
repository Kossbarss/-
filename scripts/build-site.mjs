import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputRoot = path.join(root, '_site')
const version = process.env.GITHUB_SHA || process.env.BUILD_VERSION || 'local'

const excludedTopLevel = new Set([
  '.git',
  '.github',
  '.build',
  '_site',
  'components',
  'node_modules',
  'scripts',
  'src',
  'package.json',
  'package-lock.json',
  'server.js',
  'tsconfig.json',
])

async function copyStaticTree(source, target) {
  await mkdir(target, { recursive: true })
  for (const entry of await readdir(source, { withFileTypes: true })) {
    if (excludedTopLevel.has(entry.name)) continue
    const sourcePath = path.join(source, entry.name)
    const targetPath = path.join(target, entry.name)
    if (entry.isDirectory()) {
      await cp(sourcePath, targetPath, { recursive: true })
    } else {
      await cp(sourcePath, targetPath)
    }
  }
}

const localeCopy = {
  ru: {
    intro: 'Это не просто курс про «как держать машинку». Это курс, после которого вы:',
    chatTitle: 'Общий чат выпускников школы',
    now: 'сейчас',
    chat: 'Спасибо! 🙏 Мечтала уверенно держать машинку целый год, но всегда думала, что это не для меня. После разбора работы с ментором наконец чувствую себя мастером, а не «той, кто нарисовала пятно». Спасибо...',
    kicker: 'Кейсы учеников',
    title: 'Кейсы учеников после обучения',
    cta: 'Купить курс и начать обучение тату',
    graduates: [
      ['Марго', 'Украина · лайнворк'],
      ['Максим', 'Польша · графика'],
      ['Оля', 'Чехия · мини-тату'],
      ['Настя', 'Германия · ботаника'],
      ['Карина', 'Испания · цвет'],
    ],
  },
  uk: {
    intro: 'Це не просто курс про «як тримати машинку». Це курс, після якого ви:',
    chatTitle: 'Загальний чат випускників школи',
    now: 'зараз',
    chat: 'Дякую! 🙏 Мріяла впевнено тримати машинку цілий рік, але завжди думала, що це не для мене. Після розбору роботи з ментором нарешті відчуваю себе майстром, а не «тією, хто намалювала пляму». Дякую...',
    kicker: 'Кейси учнів',
    title: 'Кейси учнів після навчання',
    cta: 'Купити курс і почати навчання тату',
    graduates: [
      ['Марго', 'Україна · лайнворк'],
      ['Максим', 'Польща · графіка'],
      ['Оля', 'Чехія · міні-тату'],
      ['Настя', 'Німеччина · ботаніка'],
      ['Каріна', 'Іспанія · колір'],
    ],
  },
}

function renderGraduates(graduates) {
  return graduates.map(([name, role]) => `          <div class="avatar-tip">
            <div class="avatar-tip-bubble">${name} · ${role}</div>
            <span class="avatar" aria-label="${name}, ${role}"></span>
          </div>`).join('\n')
}

function renderCasesSection(locale) {
  const copy = localeCopy[locale]
  return `  <!-- ============ CHAT TESTIMONIAL + CASES ============ -->
  <section class="section cases-section">
    <div class="container">
      <div class="section-head cases-intro">
        <h2>${copy.intro}</h2>
      </div>

      <div class="chat-mock">
        <div class="chat-head"><span>${copy.chatTitle}</span><span>${copy.now}</span></div>
        <p><span class="author">Марта_ink:</span> ${copy.chat}</p>
      </div>

      <div class="section-head case-fan-head">
        <span class="kicker">${copy.kicker}</span>
        <h2>${copy.title}</h2>
      </div>

      <div class="case-fan-wrap">
        <div class="case-fan-layout" id="caseFanLayout"></div>
      </div>

      <div class="case-fan-cta">
        <div class="stars">★★★★★</div>
        <div class="avatar-row">
          <div class="avatars">
${renderGraduates(copy.graduates)}
          </div>
          <span class="count">300+</span>
        </div>
        <a href="#pricing" class="btn btn-stardust"><span class="btn-stardust-wrap">${copy.cta}</span></a>
      </div>
    </div>
  </section>`
}

function replaceCasesSection(html, locale) {
  const whatYouGetMarker = '<!-- ============ WHAT YOU GET ============ -->'
  const nextMarker = html.indexOf(whatYouGetMarker)
  const mount = html.lastIndexOf('id="caseFanLayout"', nextMarker)
  if (nextMarker < 0 || mount < 0) throw new Error(`Cannot locate cases section in ${locale} page.`)

  const sectionStart = html.lastIndexOf('<section', mount)
  const commentStart = html.lastIndexOf('<!-- ============ CHAT TESTIMONIAL + CASES ============ -->', mount)
  const replaceStart = commentStart >= 0 ? commentStart : sectionStart
  if (replaceStart < 0) throw new Error(`Cannot locate cases section start in ${locale} page.`)

  return `${html.slice(0, replaceStart)}${renderCasesSection(locale)}\n\n  ${html.slice(nextMarker)}`
}

function replaceInlineLayoutStyles(html) {
  return html
    .replaceAll('class="section-head" style="max-width: 720px; margin-bottom: 0;"', 'class="section-head section-head--narrow"')
    .replaceAll('class="section-head" style="margin-bottom: 0;"', 'class="section-head section-head--flush"')
    .replaceAll('class="section-head" style="margin-bottom: 28px;"', 'class="section-head section-head--compact"')
    .replaceAll('class="section-head" style="text-align: center; max-width: 960px; margin-inline: auto;"', 'class="section-head section-head--centered section-head--wide"')
    .replaceAll('<section class="section" style="background: var(--paper-alt); padding-top: 0;">', '<section class="section section--paper-alt">')
    .replaceAll('<section class="section" style="background: var(--paper-alt);">', '<section class="section section--paper-alt">')
    .replaceAll('<section class="section" style="text-align:center;">', '<section class="section section--centered">')
    .replaceAll('<p style="margin-top:32px;">', '<p class="section-cta">')
    .replaceAll('class="card guarantee-box" style="max-width:720px;margin-inline:auto;"', 'class="card guarantee-box guarantee-box--centered"')
}

function fixLanguageContent(html, locale) {
  if (locale === 'uk') {
    return html
      .replaceAll('Сразу після оплати', 'Одразу після оплати')
      .replaceAll('Тому зробила перший потік курсу', 'Тому зробив перший потік курсу')
  }
  return html.replaceAll('Поэтому сделала первый поток курса', 'Поэтому сделал первый поток курса')
}

function injectAssets(html, assetPrefix) {
  const mainCss = `  <link rel="stylesheet" href="${assetPrefix}style.css?v=${version}" />`
  const carouselCss = `  <link rel="stylesheet" href="${assetPrefix}dist/card-fan-carousel.css?v=${version}" />`
  const rhythmCss = `  <link rel="stylesheet" href="${assetPrefix}layout-rhythm.css?v=${version}" />`
  const testimonialCss = `  <link rel="stylesheet" href="${assetPrefix}dist/testimonial-stack.css?v=${version}" />`
  const carouselJs = `<script src="${assetPrefix}dist/card-fan-carousel.js?v=${version}"></script>`
  const testimonialJs = `<script src="${assetPrefix}dist/testimonial-stack.js?v=${version}"></script>`
  const certificateJs = `<script src="${assetPrefix}dist/certificate-tilt.js?v=${version}"></script>`
  const heroStatsJs = `<script src="${assetPrefix}dist/hero-stats.js?v=${version}"></script>`
  const heroShaderJs = `<script src="${assetPrefix}hero-shader-background.js?v=${version}"></script>`

  html = html
    // style.css has no cache-busting query string in the source HTML
    // (unlike the others below), so a browser/CDN caching it from a
    // prior deploy would keep serving stale CSS after a fix landed
    // here -- give it the same versioned treatment.
    .replace(/\s*<link rel="stylesheet" href="(?:\.\.\/)?style\.css[^\n]*\n?/g, '\n')
    .replace(/\s*<link rel="stylesheet" href="(?:\.\.\/)?dist\/card-fan-carousel\.css[^\n]*\n?/g, '\n')
    .replace(/\s*<link rel="stylesheet" href="(?:\.\.\/)?layout-rhythm\.css[^\n]*\n?/g, '\n')
    .replace(/\s*<link rel="stylesheet" href="layout-fixes\.css[^\n]*\n?/g, '\n')
    .replace(/\s*<link rel="stylesheet" href="(?:\.\.\/)?dist\/testimonial-stack\.css[^\n]*\n?/g, '\n')
    .replace(/\s*<script src="(?:\.\.\/)?dist\/card-fan-carousel\.js[^\n]*<\/script>\n?/g, '\n')
    .replace(/\s*<script src="(?:\.\.\/)?dist\/testimonial-stack\.js[^\n]*<\/script>\n?/g, '\n')
    .replace(/\s*<script src="(?:\.\.\/)?dist\/certificate-tilt\.js[^\n]*<\/script>\n?/g, '\n')
    .replace(/\s*<script src="(?:\.\.\/)?dist\/hero-stats\.js[^\n]*<\/script>\n?/g, '\n')
    .replace(/\s*<script src="(?:\.\.\/)?hero-shader-background\.js[^\n]*<\/script>\n?/g, '\n')

  html = html.replace('</head>', `${mainCss}\n${carouselCss}\n${rhythmCss}\n${testimonialCss}\n</head>`)
  html = html.replace('<script src="script.js"></script>', `${carouselJs}\n  ${testimonialJs}\n  ${certificateJs}\n  ${heroStatsJs}\n  ${heroShaderJs}\n  <script src="script.js"></script>`)
  return html
}

function sectionSignature(html) {
  return [...html.matchAll(/<section\b([^>]*)>/g)].map(([, attributes]) => {
    const id = attributes.match(/\bid="([^"]+)"/)?.[1] || ''
    const classes = attributes.match(/\bclass="([^"]+)"/)?.[1] || ''
    return `${id}|${classes}`
  })
}

function validatePage(html, locale) {
  const forbidden = ['caseFanDetail', 'caseFanNav', 'layout-fixes.css']
  for (const token of forbidden) {
    if (html.includes(token)) throw new Error(`${locale} build still contains legacy token: ${token}`)
  }
  if (!html.includes('dist/card-fan-carousel.js')) throw new Error(`${locale} build is missing carousel JavaScript.`)
  if (!html.includes('layout-rhythm.css')) throw new Error(`${locale} build is missing shared layout CSS.`)
}

async function buildPage(sourcePath, outputPath, locale, assetPrefix) {
  let html = await readFile(sourcePath, 'utf8')
  html = replaceCasesSection(html, locale)
  html = replaceInlineLayoutStyles(html)
  html = fixLanguageContent(html, locale)
  html = injectAssets(html, assetPrefix)
  validatePage(html, locale)
  await mkdir(path.dirname(outputPath), { recursive: true })
  await writeFile(outputPath, html, 'utf8')
  return html
}

await rm(outputRoot, { recursive: true, force: true })
await copyStaticTree(root, outputRoot)

const ruHtml = await buildPage(
  path.join(root, 'index.html'),
  path.join(outputRoot, 'index.html'),
  'ru',
  '',
)

const ukHtml = await buildPage(
  path.join(root, 'ua', 'index.html'),
  path.join(outputRoot, 'ua', 'index.html'),
  'uk',
  '../',
)

const ruSignature = sectionSignature(ruHtml)
const ukSignature = sectionSignature(ukHtml)
if (JSON.stringify(ruSignature) !== JSON.stringify(ukSignature)) {
  throw new Error(`RU and UA section structures differ.\nRU: ${ruSignature.join(', ')}\nUA: ${ukSignature.join(', ')}`)
}

await writeFile(path.join(outputRoot, '.nojekyll'), '', 'utf8')
console.log(`Built bilingual site in ${outputRoot}`)
