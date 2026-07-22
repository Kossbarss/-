import { useState } from "react";
import { createRoot } from "react-dom/client";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";

type CaseStudy = {
  name: string;
  module: string;
  text: string;
  stat: string;
  style: string;
  image: string;
};

type Graduate = [name: string, role: string];

const isUkrainian =
  document.documentElement.lang.toLowerCase().startsWith("uk") ||
  /\/ua(?:\/|$)/.test(window.location.pathname);

const assetPrefix = isUkrainian ? "../assets/" : "assets/";

const RU_CASES: CaseStudy[] = [
  { name: "Марго, 24 года", module: "Лайнворк · Модуль 5", text: "Первая работа на модели под наблюдением ментора: ровный контур и уверенная постановка руки.", stat: "3 клиента за первую неделю", style: "ЛАЙНВОРК", image: "hero-tattoo-process.jpg" },
  { name: "Максим, 31 год", module: "Графика · Модуль 7", text: "Собрал первое портфолио из учебных и клиентских работ и начал принимать заказы.", stat: "12 работ в портфолио", style: "ГРАФИКА", image: "hero-student-practice.jpg" },
  { name: "Оля, 27 лет", module: "Продвижение · Модуль 9", text: "Оформила профиль и получила первые обращения ещё до окончания обучения.", stat: "30+ заявок, 5 продаж", style: "МИНИ-ТАТУ", image: "hero-teaching.jpg" },
  { name: "Дмитрий, 29 лет", module: "Техника · Модуль 6", text: "Освоил лайнворк и штриховку с нуля после персональных разборов техники.", stat: "8 работ за месяц практики", style: "БЛЭКВОРК", image: "hero-guided-practice.jpg" },
  { name: "Настя, 22 года", module: "Композиция · Модуль 4", text: "Пришла без художественного опыта и выполнила первую платную работу.", stat: "Первый клиент на 3 неделе", style: "БОТАНИКА", image: "hero-founder-portrait.jpg" },
  { name: "Карина, 34 года", module: "Цвет · Модуль 8", text: "Сменила профессию и уверенно перешла от учебных упражнений к цветным работам.", stat: "15 работ в портфолио", style: "ЦВЕТ", image: "hero-student-portrait.jpg" },
  { name: "Марта, 26 лет", module: "Диплом · Модуль 10", text: "Прошла обучение дистанционно и защитила дипломную работу на созвоне с ментором.", stat: "20+ заявок после выпуска", style: "ОРНАМЕНТ", image: "hero-practice.jpg" },
  { name: "Артём, 33 года", module: "Практика · Модуль 5", text: "Сделал первую татуировку под контролем ментора и начал брать оплачиваемые работы.", stat: "Первая оплата на 4 неделе", style: "ОЛДСКУЛ", image: "hero-client-practice.jpg" },
  { name: "Юля, 25 лет", module: "Цвет · Модуль 8", text: "Разобралась с цветовой теорией и перестала бояться сложных сочетаний оттенков.", stat: "10 цветных работ за 2 месяца", style: "АКВАРЕЛЬ", image: "hero-graduation.jpg" },
  { name: "Богдан, 27 лет", module: "Композиция · Модуль 7", text: "Перенёс навыки графического дизайна в тату и сформировал узнаваемую подачу.", stat: "18 работ в портфолио", style: "ГЕОМЕТРИЯ", image: "hero-process-moments.jpg" },
];

const UK_CASES: CaseStudy[] = [
  { name: "Марго, 24 роки", module: "Лайнворк · Модуль 5", text: "Перша робота на моделі під наглядом ментора: рівний контур і впевнена постановка руки.", stat: "3 клієнти за перший тиждень", style: "ЛАЙНВОРК", image: "hero-tattoo-process.jpg" },
  { name: "Максим, 31 рік", module: "Графіка · Модуль 7", text: "Зібрав перше портфоліо з навчальних і клієнтських робіт та почав приймати замовлення.", stat: "12 робіт у портфоліо", style: "ГРАФІКА", image: "hero-student-practice.jpg" },
  { name: "Оля, 27 років", module: "Просування · Модуль 9", text: "Оформила профіль і отримала перші звернення ще до завершення навчання.", stat: "30+ заявок, 5 продажів", style: "МІНІ-ТАТУ", image: "hero-teaching.jpg" },
  { name: "Дмитро, 29 років", module: "Техніка · Модуль 6", text: "Опанував лайнворк і штрихування з нуля після персональних розборів техніки.", stat: "8 робіт за місяць практики", style: "БЛЕКВОРК", image: "hero-guided-practice.jpg" },
  { name: "Настя, 22 роки", module: "Композиція · Модуль 4", text: "Прийшла без художнього досвіду та виконала першу оплачувану роботу.", stat: "Перший клієнт на 3 тижні", style: "БОТАНІКА", image: "hero-founder-portrait.jpg" },
  { name: "Каріна, 34 роки", module: "Колір · Модуль 8", text: "Змінила професію та впевнено перейшла від навчальних вправ до кольорових робіт.", stat: "15 робіт у портфоліо", style: "КОЛІР", image: "hero-student-portrait.jpg" },
  { name: "Марта, 26 років", module: "Диплом · Модуль 10", text: "Пройшла навчання дистанційно та захистила дипломну роботу на дзвінку з ментором.", stat: "20+ заявок після випуску", style: "ОРНАМЕНТ", image: "hero-practice.jpg" },
  { name: "Артем, 33 роки", module: "Практика · Модуль 5", text: "Зробив перше татуювання під контролем ментора та почав брати оплачувані роботи.", stat: "Перша оплата на 4 тижні", style: "ОЛДСКУЛ", image: "hero-client-practice.jpg" },
  { name: "Юля, 25 років", module: "Колір · Модуль 8", text: "Розібралася з теорією кольору та перестала боятися складних поєднань відтінків.", stat: "10 кольорових робіт за 2 місяці", style: "АКВАРЕЛЬ", image: "hero-graduation.jpg" },
  { name: "Богдан, 27 років", module: "Композиція · Модуль 7", text: "Переніс навички графічного дизайну в тату та сформував упізнавану подачу.", stat: "18 робіт у портфоліо", style: "ГЕОМЕТРІЯ", image: "hero-process-moments.jpg" },
];

const RU_GRADUATES: Graduate[] = [
  ["Марго", "Украина · лайнворк"],
  ["Максим", "Польша · графика"],
  ["Оля", "Чехия · мини-тату"],
  ["Настя", "Германия · ботаника"],
  ["Карина", "Испания · цвет"],
];

const UK_GRADUATES: Graduate[] = [
  ["Марго", "Україна · лайнворк"],
  ["Максим", "Польща · графіка"],
  ["Оля", "Чехія · міні-тату"],
  ["Настя", "Німеччина · ботаніка"],
  ["Каріна", "Іспанія · колір"],
];

const CASES = isUkrainian ? UK_CASES : RU_CASES;
const GRADUATES = isUkrainian ? UK_GRADUATES : RU_GRADUATES;
const labels = isUkrainian
  ? { previous: "Попередній кейс", next: "Наступний кейс", card: "Кейс" }
  : { previous: "Предыдущий кейс", next: "Следующий кейс", card: "Кейс" };

const CARDS: CardItem[] = CASES.map(study => ({
  imgUrl: `${assetPrefix}${study.image}`,
  alt: `${study.name}. ${study.stat}`,
  title: study.name,
  subtitle: study.style,
}));

function Demo() {
  const [activeIndex, setActiveIndex] = useState(3);
  const activeCase = CASES[activeIndex] || CASES[0];

  return (
    <div className="case-carousel-demo">
      <SocialCards
        cards={CARDS}
        onActiveChange={setActiveIndex}
        previousLabel={labels.previous}
        nextLabel={labels.next}
        cardLabel={labels.card}
      />
      <article className="case-carousel-detail" aria-live="polite">
        <span className="case-carousel-detail-module">{activeCase.module}</span>
        <h3>{activeCase.name}</h3>
        <p>{activeCase.text}</p>
        <strong>{activeCase.stat}</strong>
      </article>
    </div>
  );
}

const mountNode = document.getElementById("caseFanLayout");
const stars = document.querySelector<HTMLElement>(".case-fan-cta .stars");
const avatars = document.querySelector(".case-fan-cta .avatars");
const count = document.querySelector<HTMLElement>(".case-fan-cta .count");

if (stars) stars.textContent = "★★★★★";
if (count) count.textContent = "300+";

if (avatars) {
  avatars.replaceChildren();

  GRADUATES.forEach(([name, role]) => {
    const item = document.createElement("div");
    item.className = "avatar-tip";

    const bubble = document.createElement("div");
    bubble.className = "avatar-tip-bubble";
    bubble.textContent = `${name} · ${role}`;

    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.setAttribute("aria-label", `${name}, ${role}`);

    item.append(bubble, avatar);
    avatars.appendChild(item);
  });
}

if (mountNode) {
  mountNode.replaceChildren();
  mountNode.setAttribute("data-card-fan-carousel", "true");
  createRoot(mountNode).render(<Demo />);
}
