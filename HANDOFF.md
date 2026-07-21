# VIP Tattoo School — unified build handoff

Дата оновлення: 2026-07-20

## Репозиторій

- Repository: `Kossbarss/-`
- Єдина актуальна робоча/default-гілка: `claude/landing-page-redesign-bzy3r4`
- Не створювати нові гілки для дрібних змін.
- Резервна гілка `vip-final-rebuild` залишається недоторканною.

## Актуальні сторінки

- RU: `index.html`
- UA: `ua/index.html`
- Основний CSS wrapper: `style.css`
- Базові стилі: `style-base.css`
- RU логіка: `script.js`
- UA логіка: `ua/script.js`
- RU loader ефектів: `particles.js`
- UA loader: `ua/particles.js`

## Локальні модулі ефектів

`particles.js` запускає модулі один раз і тільки в такому порядку:

1. `hero-shader-background.js` — hero WebGL background.
2. `pricing-reference.js` — pricing WebGL animation.
3. `hero-front-facing.js` — локальне вирівнювання hero-карток.
4. `case-name-margo.js` — безпечна заміна імені без нескінченного observer loop.
5. `legacy-effects.js` — локальні footer particles і золота рамка галереї.

## Що виправлено

1. Default-гілка вирівняна з останнім підтвердженим snapshot.
2. Прибрано зовнішнє завантаження старого `particles.js` через raw.githack.
3. Прибрано запуск legacy-коду через `requestIdleCallback` і випадкові затримки.
4. Усі модулі завантажуються локально, один раз і послідовно.
5. Прибрано глобальне переписування `window.requestAnimationFrame`.
6. Прибрано глобальне переписування `CSSStyleDeclaration.prototype.transform` та `setProperty`.
7. Старий нескінченний цикл `levelCards` не перенесено в локальний файл.
8. Виправлено нескінченний MutationObserver loop у блоці кейсів.
9. Нижні секції RU та UA сторінок збережені в HTML.
10. Типографічний експеримент RISE не підключений до `style.css`.

## Правила подальшої роботи

- Усі підтверджені зміни вносити в `claude/landing-page-redesign-bzy3r4`.
- Не створювати окрему гілку для кожної зміни.
- Не використовувати глобальні monkey patches браузерних API.
- Не підключати код або стилі з інших комітів через CDN/raw.githack.
- Після кожної зміни перевіряти RU і UA.
- Не заявляти про візуальну справність без браузерної перевірки або скріншота.

## Запит для нового сеансу

Відкрий репозиторій `Kossbarss/-`, default-гілку `claude/landing-page-redesign-bzy3r4`, прочитай `HANDOFF.md` і продовжуй роботу в цій самій гілці. Не створюй нову гілку без прямої команди користувача. Спочатку перевір RU та UA версії в браузері.
