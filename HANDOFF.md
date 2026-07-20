# VIP Tattoo School — handoff snapshot

Дата фіксації: 2026-07-20

## Репозиторій

- Repository: `Kossbarss/-`
- Гілка для продовження роботи: `vip-handoff-2026-07-20`
- Базовий snapshot-коміт: `cbb5659e04a441d2c2d75b87666ad5c8e084208f`
- Production-гілка не змінювалася під час створення цього snapshot.

## Актуальні сторінки

- RU: `index.html`
- UA: `ua/index.html`
- Основний CSS wrapper: `style.css`
- Базові стилі: `style-base.css`
- Основний JS: `script.js`
- UA loader: `ua/particles.js`
- Загальний loader анімацій: `particles.js`

## Актуальні анімаційні модулі

- `hero-shader-background.js` — hero WebGL background
- `pricing-reference.js` — pricing animation
- `hero-front-facing.js` — локальне вирівнювання hero-карток без глобального перехоплення `transform`
- `case-name-margo.js` — заміна Лиана/Ліана на Марго без нескінченного MutationObserver loop

## Що виправлено у snapshot

1. Прибрано глобальне переписування `window.requestAnimationFrame`.
2. Прибрано глобальне переписування `CSSStyleDeclaration.prototype.transform` та `setProperty`.
3. `hero-front-facing.js` працює тільки з `.hero-shot` у hero carousel.
4. Виправлено нескінченний цикл у `case-name-margo.js`, через який браузер зависав у блоці кейсів і не домальовував нижню частину лендингу.
5. Нижні секції не видалені з HTML.
6. RU та UA сторінки збережені в одному snapshot.
7. Типографічний експеримент RISE не підключений до `style.css`, бо він конфліктував із геометрією та анімаціями.

## Критичні правила для наступного сеансу

- Не змінювати production напряму без окремого підтвердження користувача.
- Працювати тільки від гілки `vip-handoff-2026-07-20` або створити від неї нову робочу гілку.
- Не використовувати глобальні monkey patches для `requestAnimationFrame`, `CSSStyleDeclaration`, `transform` або DOM API.
- Не підключати великі глобальні CSS overrides без перевірки всіх секцій.
- Після кожної зміни перевіряти RU і UA версії.
- Не заявляти, що візуально все працює, без браузерної перевірки або скріншота.
- Не створювати preview-файл, який лише перенаправляє на старий `index.html`.

## Відомий технічний борг

`particles.js` досі завантажує legacy particles/gallery-border script із зафіксованого старого коміту через raw.githack. Це вже не переписує глобальний RAF, але у наступному сеансі бажано перенести legacy-код у локальний файл репозиторію та прибрати зовнішню залежність.

## Preview snapshot

- RU: `https://raw.githack.com/Kossbarss/-/cbb5659e04a441d2c2d75b87666ad5c8e084208f/index.html`
- UA: `https://raw.githack.com/Kossbarss/-/cbb5659e04a441d2c2d75b87666ad5c8e084208f/ua/index.html`

## Запит для нового сеансу

Відкрий репозиторій `Kossbarss/-`, гілку `vip-handoff-2026-07-20`, прочитай `HANDOFF.md` і продовжуй роботу тільки від цього snapshot. Спочатку перевір поточний стан RU та UA сторінок у браузері. Не змінюй production без окремої команди.
