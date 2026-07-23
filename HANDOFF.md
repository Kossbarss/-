# VIP Tattoo School — unified build handoff

Дата оновлення: 2026-07-21

## Репозиторій

- Repository: `Kossbarss/-`
- Єдина актуальна робоча/default-гілка: `claude/landing-page-redesign-bzy3r4`
- Не створювати нові гілки для дрібних змін.
- Резервна гілка `vip-final-rebuild` залишається недоторканною.

## Сторінки та стилі

- RU: `index.html`
- UA: `ua/index.html`
- Основний CSS wrapper: `style.css`
- Базові стилі: `style-base.css`
- RU entry loader: `script.js`
- UA entry loader: `ua/script.js`
- Visual effects loader: `particles.js`
- UA visual loader bridge: `ua/particles.js`

## Основна логіка

`script.js` і `ua/script.js` послідовно завантажують:

1. `site-core.js` — локаль, перевірені контакти, реальні CTA, очищення placeholder-реквізитів, sticky-bar і статичні стрічки.
2. `site-interactions.js` — hero carousel, FAQ, mobile menu, popup, focus management і keyboard/touch interaction.
3. `site-cases.js` — RU/UA кейси з прямим ім’ям «Марго», без MutationObserver.

Після завершення вони надсилають подію `vip:app-ready`.

## Візуальні модулі

`particles.js` чекає `vip:app-ready`, а потім запускає тільки локальні модулі:

1. `hero-shader-background.js` — hero WebGL background.
2. `pricing-reference.js` — pricing WebGL animation.
3. `legacy-effects.js` — footer particles і золота рамка галереї; не запускається при `prefers-reduced-motion`.

Файли `hero-front-facing.js` та `case-name-margo.js` видалені як застарілі runtime-патчі.

## Виправлення поточного аудиту

1. Прибрано дубльовані реалізації таймерів, hero carousel, меню, popup, FAQ і кейсів зі старих великих `script.js`.
2. Прибрано штучний 10-хвилинний та персональний 5-денний countdown; непідтверджені таймери приховані.
3. Непрацюючі форми замінюються на реальний Telegram CTA до `@mentor_tatoo_Viktoria_bot`.
4. Instagram і Telegram-посилання отримують реальні адреси, `target="_blank"` та `rel="noopener noreferrer"`.
5. Placeholder ІПН/РНОКПП `0000000000` і порожня оферта не показуються; замість них використовується перевірений контакт адміністратора.
6. Hero carousel має одну реалізацію, прямий `rotateY(0deg)`, клавіатурне керування та зупинку rAF поза viewport/при прихованій вкладці.
7. Mobile menu і popup мають ARIA-стани, Escape, focus trap і повернення фокуса.
8. FAQ має `aria-expanded`, `aria-controls` та `aria-hidden`.
9. Кейси мають кнопкову клавіатурну навігацію, локалізовані дані й не використовують observer для заміни імені.
10. Footer canvas має статичний fallback-логотип; continuous canvas animation вимикається для reduced-motion.
11. Injected mobile hero CSS перенесено в постійний `style.css`.
12. Додано глобальний видимий `:focus-visible` і reset для runtime-кнопок.

## Відомі межі

- Проведена статична перевірка коду через GitHub connector.
- Повна браузерна перевірка console/network, desktop/mobile layout та анімацій ще потрібна.
- Дані про відгуки, партнерські студії, SafeInk, гарантію, кількість учнів і юридичні умови не підтверджені зовнішніми документами; не змінювати й не називати перевіреними без матеріалів користувача.
- Для публічної оферти та юридичних реквізитів потрібні реальні дані власника.

## Правила подальшої роботи

- Усі підтверджені зміни вносити в `claude/landing-page-redesign-bzy3r4`.
- Не створювати окрему гілку для кожної зміни.
- Не використовувати monkey patches браузерних API або MutationObserver для виправлення статичного контенту.
- Не підключати код або стилі з інших комітів через CDN/raw.githack.
- Після кожної зміни перевіряти RU і UA.
- Не заявляти про візуальну справність без браузерної перевірки або скріншота.

## Запит для нового сеансу

Відкрий репозиторій `Kossbarss/-`, default-гілку `claude/landing-page-redesign-bzy3r4`, прочитай `HANDOFF.md` і продовжуй роботу в цій самій гілці. Не створюй нову гілку без прямої команди користувача. Спочатку перевір RU та UA версії в браузері, console і network.
