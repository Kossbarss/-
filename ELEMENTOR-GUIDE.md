# Як перенести цей лендинг в Elementor Pro

Файл `index.html` + `style.css` — це готовий референс і чернетка контенту.
Оскільки Elementor Pro не імпортує довільний HTML як нативні віджети
автоматично, нижче — розбивка по секціях: що з чого зробити, яким
Elementor-віджетом і з якими налаштуваннями. Кольори винесені в змінні
CSS (`style.css`, блок `:root`) — просто скопіюйте hex-коди в
Site Settings → Global Colors, і Elementor підхопить ту саму палітру
всюди.

Глобальні кольори (Site Settings → Global Colors):
- `--ink` `#15110f` — основний темний фон/текст
- `--paper` `#faf6ef` — фон сторінки
- `--gold` `#c9a24a` — акцент VIP
- `--blood` `#a3162e` — акцент терміновості/CTA

Глобальні шрифти (Site Settings → Global Fonts): Bebas Neue (заголовки),
Playfair Display italic (акцентні фрази), Inter (текст).

---

## 1. Header
**Elementor:** Header-шаблон (Theme Builder → Headers), Section з двома
колонками: логотип (Heading/Image widget) + Nav Menu widget + Button
widget. Мобільне меню — вбудоване в Nav Menu widget (є toggle "з коробки").

## 2. Hero
**Elementor:** Section, 2 колонки.
- Ліва колонка: Heading (H1), Text Editor (підзаголовок), Text Editor
  (лід-абзац), Button/Icon List (соц-доказ "300+ учнів").
- Права колонка: Image widget (замініть SVG-заглушку на реальне фото/
  ілюстрацію) + накладений Text Editor або Call to Action widget
  поверх зображення (position: absolute в Advanced → Position).
- Прайс-бокс під hero: окрема Section →
  **Countdown widget (Elementor Pro, нативний!)** замість
  саморобного JS-таймера — набагато надійніше для WordPress.
  Поруч — Price Table widget або просто 2 Heading widgets
  (закреслена/нова ціна) + Button.

## 3. Бігуча стрічка (ribbon)
Нативного marquee-віджета в Elementor немає. Найпростіше:
- **HTML widget** (Elementor) — вставте `.ribbon-wrap` розмітку і
  відповідний шматок CSS/JS як є (працює "з коробки", просто код).
- Або плагін типу "Ultimate Addons for Elementor" / "Essential
  Addons", де є готовий Marquee/Ticker widget — тоді контент
  переносите вручну, без коду.

## 4. Блоки "Тобі підійде, якщо" (pain points)
**Elementor:** Icon Box widget × 6, у Section з 3 колонками (на мобільному
Elementor сам стекає в 1 колонку). Іконки — вбудована бібліотека
Elementor Icons або завантажте свої SVG у Custom Icon.

## 5. Блок "Цей курс для тебе, якщо" (fit-list)
**Elementor:** Icon List widget (кожен пункт — окремий рядок зі своєю
іконкою-стрілкою).

## 6. Instructor (розділ про викладача)
**Elementor:** Section на темному фоні (Background → Color = `--ink`),
2 колонки: Image widget (фото майстра) + Heading/Text Editor/Icon List
(чек-лист досягнень). Плашка з ім'ям — Button widget у стилі "badge"
(без посилання) або Text Editor з фоном.

## 7. Чат-відгук / скріншот
**Elementor:** якщо є реальний скріншот переписки — просто Image
widget. Якщо робити "живий" чат-мокап як у чернетці — Text Editor
з фоном + Advanced → Border-radius, або HTML widget з розміткою
`.chat-mock`.

## 8. Кейси учнів (case studies)
**Elementor:** Image Box widget × 3 (фото "до/після" + заголовок +
опис + невеликий текст-цифра знизу — окремий Heading під Image Box).

## 9. Зірки + аватарки + CTA
**Elementor:** Star Rating widget (нативний) + Image Carousel/Testimonial
Carousel (Pro) для аватарок або просто ряд Image widgets у Inner
Section, + Button widget.

## 10. "Що ви отримаєте на курсі" (feature grid)
**Elementor:** Icon Box widget × 4 в 4-колонковій Section.

## 11. Кольорові картки програми (program pillars)
**Elementor:** 4 окремі Inner Section одна під одною, кожна зі своїм
фоном (Background → Color/Gradient — саме тут використайте
`--gold-light`→`--gold` для перших двох, `--periwinkle`→
`--periwinkle-dark` для третьої, `--blood`→`--blood-dark` для
четвертої). Контент всередині: Heading + Text Editor + Icon List
(теги-пігулки можна зробити через Button widget в режимі "text only"
по кілька в ряд, або Icon List з інлайн-стилем).

## 12. Сітка уроків (lesson-grid)
**Elementor:** Toggle/Accordion widget НЕ підходить (це не розкривні
пункти, а статична сітка) — робіть як Section з 3 колонками ×
Icon Box widget (номер уроку як "іконка"-текст + опис), повторити
рядками.

## 13. Стек бонусів
**Elementor:** Price List widget (нативний, саме для списку
"назва — закреслена ціна — нова ціна") — ідеально лягає на цей блок.

## 14. Форма замовлення / прайсинг
**Elementor:** **Form widget (Elementor Pro, нативний)** — ім'я, email,
кнопка відправки з реальною інтеграцією (email/CRM). Ціну над формою —
Price Table widget або 2 Heading.

## 15. Порівняння "ми vs типова школа"
**Elementor:** 2 колонки, у кожній — Icon List widget (зелені
галочки в одній, червоні мінуси в іншій — колір іконки міняється
в Style-вкладці кожного пункту).

## 16. Гарантія
**Elementor:** Icon Box widget (велика іконка щита + заголовок + текст),
на всю ширину контейнера.

## 17. Сертифікат
**Elementor:** Section на темному фоні, 2 колонки: Icon List
(чек-лист вимог) + Button, і кругла "медаль" — Image widget (кругле
зображення бейджа/печатки) або Circle Progress widget у "статичному"
вигляді (100%, без анімації) як декоративна рамка.

## 18. FAQ
**Elementor:** **Accordion widget (Elementor Pro, нативний)** —
прямий заміна саморобного JS-акордеона, підтримує анімацію з коробки.

## 19. Фінальний CTA
**Elementor:** Call to Action widget (нативний, Pro) — вже має
рамку, заголовок, текст і кнопку в одному віджеті.

## 20. Sticky bottom bar
**Elementor:** зробіть це окремим **Section**, у Advanced →
Motion Effects → Sticky = Bottom (працює у Pro на будь-якій секції,
без коду). Countdown всередині — той самий нативний Countdown widget,
що і в п.2.

## Footer
**Elementor:** Footer-шаблон (Theme Builder → Footers), Social Icons
widget + Text Editor для юридичного тексту.

---

### Порядок дій на практиці
1. Створіть сторінку в WordPress → Edit with Elementor.
2. Відтворюйте секції зверху вниз за списком вище, копіюючи текст
   з `index.html` у відповідні віджети (текст уже готовий, лишається
   тільки вставити).
3. Кольори/шрифти виставте один раз у Site Settings — далі вони
   підтягуються всюди автоматично.
4. Зображення-заглушки (SVG hero, ініціали викладача, кейси)
   замініть на реальні фото/ілюстрації школи.
5. Секції 3 (ribbon) і 18 (FAQ) — там де є нативні Elementor Pro
   віджети (Countdown, Accordion, Price List, Form, CTA) —
   обов'язково користуйтесь ними замість HTML-віджета: це дасть
   повноцінне візуальне редагування без коду.
