import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import Carousel3D, { type Carousel3DHandle, type Carousel3DItem } from "@/components/ui/carousel-3d";
import CaseCarouselDots from "@/components/ui/case-carousel-dots";
import { NumberTicker } from "@/components/ui/be-ui-number-animation";

type CaseStudy = {
  name: string;
  city: string;
  text: string;
  image: string;
};

const isUkrainian =
  document.documentElement.lang.toLowerCase().startsWith("uk") ||
  /\/ua(?:\/|$)/.test(window.location.pathname);

const assetPrefix = isUkrainian ? "../assets/" : "assets/";

// Real graduates, sourced verbatim from the client-provided document (14
// clients, each with name/age/city/quote paired to their own photo --
// cross-checked against the source XML's image-to-paragraph order so no
// two people's data could get swapped, e.g. the two different "Анна"s).
// No invented stats/modules/styles here, unlike the earlier placeholder
// data this replaces -- only what's actually in the source.
const RU_CASES: CaseStudy[] = [
  { name: "Вероника, 30 лет", city: "Florida", text: "Тату-мастер. Я никогда не оцениваю клиентов по одежде, внешности и т. д. Всегда создаю максимально комфортное пространство, где каждый клиент во время сеанса может быть собой. Благодаря 2-м разборам в личном Zoom-созвоне поняла, что мой стиль — минимализм.", image: "case-veronika-florida.jpg" },
  { name: "Анна, 32 года", city: "Hamburg", text: "Я создаю татуировки со смыслом, с историей. Это не просто рисунок — это диалог, где ваша идея превращается в произведение искусства на вашей коже. В обучении научилась доверять своей интуиции и делегировать часть рутины своей помощнице.", image: "case-anna-hamburg.jpg" },
  { name: "Анна, 34 года", city: "Nice", text: "Придя в мир татуировки, я твёрдо для себя решила, что буду учиться делать реализм, потому что для меня это один из самых сложных стилей, а я люблю сложности 😍", image: "case-anna-nice.jpg" },
  { name: "Полина, 28 лет", city: "Milan", text: "Если у вас закончится память на телефоне, мы поймём, потому что каждая новая тату достойна тысячи фотографий 😇 Если клиенты делают запись за 2 месяца — это не о том, что к нам трудно записаться, а о том, что вам доверяют ✅️", image: "case-polina-milan.jpg" },
  { name: "Амира, 38 лет", city: "Vancouver", text: "В студии теперь работают 4 тату-мастерицы, а атмосфера наполнена светлым и солнечным настроением. Теперь студия, не похожая ни на одно тату-помещение в округе, встретит вас уютом 🥰 Спасибо Виктории за обучение 🫂", image: "case-amira-vancouver.jpg" },
  { name: "Оля, 42 года", city: "Gdansk", text: "Важно никогда не отказываться от своей мечты 💫 Превращение художественного хобби в собственную тату-студию — иногда новые знакомства дарят нам новые пути и образ жизни 😊", image: "case-olya-gdansk.jpg" },
  { name: "Criss, 44 года", city: "Rotterdam", text: "Важно знать и чувствовать сигнал, когда пора делиться знаниями и опытом) Создала собственное обучение для тату-мастеров и теперь помогаю новичкам строить свои мечты 💫", image: "case-criss-rotterdam.jpg" },
  { name: "Марго, 34 года", city: "Toronto", text: "Коллеги-мастера, расскажите, какие негласные правила у вас? Тату по цене маникюра бить — это стоит того, или неважно, какая цена, ведь главное — настроение) Теперь каждое тату — без страха испортить кожу)", image: "case-margo-toronto.jpg" },
  { name: "Адам, 38 лет", city: "Rotterdam", text: "Полгода назад открыл собственную студию и теперь работаю только по рекомендациям. Нашёл свой стиль и понял, что страх экспериментировать существует только в нашей голове.", image: "case-adam-rotterdam.jpg" },
  { name: "Эдвард, 42 года", city: "Massachusetts", text: "Никогда не поздно учиться — особенно если речь идёт о татуировках. Теперь вкусный кофе и самая крутая атмосфера возможны только у нас в студии. До этого у меня было всего несколько клиентов. Спасибо Виктории 🤝", image: "case-edvard-massachusetts.jpg" },
  { name: "Мари, 29 лет", city: "Munich", text: "Готова бесконечно признаваться в любви своему делу, которое научило меня любить и отдавать! А обучение у Виктории научило меня выстраивать отношения с клиентами, без шуток)) Была и эйфория в начале, и притирки, и желания расстаться со своими мыслями, и кризисы, но пришло понимание, и теперь я кайфую от своего дела 😉", image: "case-mari-munich.jpg" },
  { name: "Андрей, 33 года", city: "Kyiv", text: "Тату — это современное искусство. И как художник (теперь по совместительству и тату-мастер) я всегда стараюсь делать свою работу так, чтобы клиент радовался новому имиджу. Важно быть открытым для новых проектов и идей)", image: "case-andrei-kyiv.jpg" },
  { name: "Дарья, 21 год", city: "Cologne", text: "Из фотографа и стилиста — в тату-мастера) Вроде это несовместимо, но я нашла свой стиль и тандем этих разных на первый взгляд стихий) Теперь в свободное время могу ещё и создавать фото, которое будет всегда с вами) Спасибо, Виктория 🫶", image: "case-darya-cologne.jpg" },
  { name: "Ника, 34 года", city: "Oslo", text: "Завершила обучение, теперь спокойно работаю с кожей и нашла свои стили 👌 Моя реклама теперь — это мои рекомендации, система обучения до сих пор приносит хорошие результаты и активность в Instagram. Теперь планирую повышать цены на татуировки и комплексные сеансы 😊", image: "case-nika-oslo.jpg" },
];

const UK_CASES: CaseStudy[] = [
  { name: "Вероніка, 30 років", city: "Florida", text: "Тату-майстриня. Я ніколи не оцінюю клієнтів за одягом, зовнішністю тощо. Завжди створюю максимально комфортний простір, де кожен клієнт під час сеансу може бути собою. Завдяки 2 розборам на особистому Zoom-дзвінку зрозуміла, що мій стиль — мінімалізм.", image: "case-veronika-florida.jpg" },
  { name: "Анна, 32 роки", city: "Hamburg", text: "Я створюю татуювання зі змістом, з історією. Це не просто малюнок — це діалог, де ваша ідея перетворюється на витвір мистецтва на вашій шкірі. Під час навчання навчилася довіряти своїй інтуїції та делегувати частину рутини своїй помічниці.", image: "case-anna-hamburg.jpg" },
  { name: "Анна, 34 роки", city: "Nice", text: "Прийшовши у світ татуювання, я твердо для себе вирішила, що вчитимусь робити реалізм, бо для мене це один із найскладніших стилів, а я люблю складнощі 😍", image: "case-anna-nice.jpg" },
  { name: "Поліна, 28 років", city: "Milan", text: "Якщо у вас закінчиться пам'ять на телефоні, ми зрозуміємо, бо кожне нове тату варте тисячі фотографій 😇 Якщо клієнти записуються за 2 місяці — це не про те, що до нас важко записатися, а про те, що вам довіряють ✅️", image: "case-polina-milan.jpg" },
  { name: "Аміра, 38 років", city: "Vancouver", text: "У студії тепер працюють 4 тату-майстрині, а атмосфера наповнена світлим і сонячним настроєм. Тепер студія, не схожа на жодне тату-приміщення в окрузі, зустріне вас затишком 🥰 Дякую Вікторії за навчання 🫂", image: "case-amira-vancouver.jpg" },
  { name: "Оля, 42 роки", city: "Gdansk", text: "Важливо ніколи не відмовлятися від своєї мрії 💫 Перетворення художнього хобі на власну тату-студію — іноді нові знайомства дарують нам нові шляхи й спосіб життя 😊", image: "case-olya-gdansk.jpg" },
  { name: "Criss, 44 роки", city: "Rotterdam", text: "Важливо знати й відчувати сигнал, коли пора ділитися знаннями та досвідом) Створила власне навчання для тату-майстрів і тепер допомагаю новачкам будувати свої мрії 💫", image: "case-criss-rotterdam.jpg" },
  { name: "Марго, 34 роки", city: "Toronto", text: "Колеги-майстри, розкажіть, які негласні правила у вас? Бити тату за ціною манікюру — це того варте, чи неважливо, яка ціна, адже головне — настрій) Тепер кожне тату — без страху зіпсувати шкіру)", image: "case-margo-toronto.jpg" },
  { name: "Адам, 38 років", city: "Rotterdam", text: "Півроку тому відкрив власну студію і тепер працюю лише за рекомендаціями. Знайшов свій стиль і зрозумів, що страх експериментувати існує лише в нашій голові.", image: "case-adam-rotterdam.jpg" },
  { name: "Едвард, 42 роки", city: "Massachusetts", text: "Ніколи не пізно вчитися — особливо коли йдеться про татуювання. Тепер смачна кава і найкрутіша атмосфера можливі лише у нас у студії. До цього в мене було всього кілька клієнтів. Дякую Вікторії 🤝", image: "case-edvard-massachusetts.jpg" },
  { name: "Марі, 29 років", city: "Munich", text: "Готова нескінченно освідчуватися в коханні своїй справі, яка навчила мене любити й віддавати! А навчання у Вікторії навчило мене вибудовувати стосунки з клієнтами, без жартів)) Були і ейфорія на початку, і притирання, і бажання розлучитися зі своїми думками, і кризи, але прийшло розуміння, і тепер я кайфую від своєї справи 😉", image: "case-mari-munich.jpg" },
  { name: "Андрій, 33 роки", city: "Kyiv", text: "Тату — це сучасне мистецтво. І як художник (тепер за сумісництвом і тату-майстер) я завжди намагаюся робити свою роботу так, щоб клієнт радів новому іміджу. Важливо бути відкритим до нових проєктів та ідей)", image: "case-andrei-kyiv.jpg" },
  { name: "Дар'я, 21 рік", city: "Cologne", text: "Із фотографа й стиліста — в тату-майстрині) Здавалося б, це несумісно, але я знайшла свій стиль і тандем цих різних на перший погляд стихій) Тепер у вільний час можу ще й створювати фото, яке буде завжди з вами) Дякую, Вікторіє 🫶", image: "case-darya-cologne.jpg" },
  { name: "Ніка, 34 роки", city: "Oslo", text: "Завершила навчання, тепер спокійно працюю зі шкірою і знайшла свої стилі 👌 Моя реклама тепер — це мої рекомендації, система навчання досі приносить хороші результати й активність в Instagram. Тепер планую підвищувати ціни на татуювання та комплексні сеанси 😊", image: "case-nika-oslo.jpg" },
];

const CASES = isUkrainian ? UK_CASES : RU_CASES;

// The avatar-tip bubbles reuse the first 5 real cases (name+age already
// baked into .name, city in .city) instead of a separately maintained
// name/city list, so this display can never drift out of sync with the
// verified per-person data in CASES.
const GRADUATES = CASES.slice(0, 5);

const CAROUSEL_ITEMS: Carousel3DItem[] = CASES.map(study => ({
  src: `${assetPrefix}${study.image}`,
  alt: `${study.name}, ${study.city}`,
  name: study.name,
  subtitle: study.city,
}));

function Demo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCase = CASES[activeIndex] || CASES[0];
  const carouselRef = useRef<Carousel3DHandle>(null);

  return (
    <div className="case-carousel-demo">
      <Carousel3D ref={carouselRef} items={CAROUSEL_ITEMS} onActiveChange={setActiveIndex} />
      <CaseCarouselDots
        total={CASES.length}
        activeIndex={activeIndex}
        onChange={(index) => carouselRef.current?.goTo(index)}
        ariaLabels={
          isUkrainian
            ? { prev: "Попередній кейс", next: "Наступний кейс", track: "Кейси учнів", case: (i) => `Кейс ${i + 1}` }
            : { prev: "Предыдущий кейс", next: "Следующий кейс", track: "Кейсы учеников", case: (i) => `Кейс ${i + 1}` }
        }
      />
      <article className="case-carousel-detail" aria-live="polite">
        <span className="case-carousel-detail-module">{activeCase.city}</span>
        <h3>{activeCase.name}</h3>
        <p>{activeCase.text}</p>
      </article>
    </div>
  );
}

const mountNode = document.getElementById("caseFanLayout");
const avatars = document.querySelector(".case-fan-cta .avatars");
const count = document.querySelector<HTMLElement>(".case-fan-cta .count");

// Same rolling-digit mechanism and typographic treatment as the
// instructor stats-row's "300+" (src/instructor-carousel-entry.tsx),
// reused here per client request.
if (count) {
  createRoot(count).render(
    <NumberTicker value={300} suffix="+" duration={2.2} stagger={0.15} />
  );
}

if (avatars) {
  avatars.replaceChildren();

  const tips: HTMLElement[] = [];

  GRADUATES.forEach((graduate, i) => {
    const item = document.createElement("div");
    item.className = "avatar-tip";
    item.style.setProperty("--reveal-delay", `${i * 0.06}s`);

    const bubble = document.createElement("div");
    bubble.className = "avatar-tip-bubble";

    const watermark = document.createElement("img");
    watermark.src = `${assetPrefix}logo-watermark.png`;
    watermark.className = "avatar-tip-watermark";
    watermark.alt = "";
    watermark.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.className = "avatar-tip-name";
    name.textContent = graduate.name;

    const role = document.createElement("span");
    role.className = "avatar-tip-role";
    role.textContent = graduate.city;

    bubble.append(watermark, name, role);

    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.setAttribute("aria-label", `${graduate.name}, ${graduate.city}`);

    item.append(bubble, avatar);
    avatars.appendChild(item);
    tips.push(item);
  });

  // Reveal each card once as the row scrolls into view, instead of all
  // being visible from the first paint -- .is-visible only adds
  // opacity/transform (see style-base.css), so this never affects layout
  // or the existing idle-float animation once revealed.
  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.3 }
    );
    tips.forEach((tip) => observer.observe(tip));
  } else {
    tips.forEach((tip) => tip.classList.add("is-visible"));
  }

  // Auto-cycle the name/city bubble: most visitors never discover that
  // hovering or tapping an avatar reveals it, so cycle through the cards
  // on a timer instead of waiting for that gesture. A manual hover/tap
  // (still wired up in site-interactions.js) briefly overrides this, and
  // the timer pauses while the pointer is over the row so it doesn't yank
  // the bubble away mid-read.
  if (tips.length > 0) {
    let activeIndex = 0;
    const activate = (index: number) => {
      tips.forEach((tip, i) => tip.classList.toggle("is-active", i === index));
    };
    activate(0);

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      let timer: number | undefined;
      const advance = () => {
        activeIndex = (activeIndex + 1) % tips.length;
        activate(activeIndex);
      };
      const start = () => {
        timer = window.setInterval(advance, 2200);
      };
      const stop = () => window.clearInterval(timer);

      start();
      avatars.addEventListener("mouseenter", stop);
      avatars.addEventListener("mouseleave", start);
    }
  }
}

if (mountNode) {
  mountNode.replaceChildren();
  mountNode.setAttribute("data-case-carousel-3d", "true");
  createRoot(mountNode).render(<Demo />);
}
