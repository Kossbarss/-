import { useState } from "react";
import { createRoot } from "react-dom/client";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";

type CaseStudy = {
  name: string;
  module: string;
  text: string;
  stat: string;
  style: string;
  imgUrl: string;
};

const CASES: CaseStudy[] = [
  { name: "Марго, 24 года", module: "Лайнворк · Модуль 5", text: "Первая работа на модели под наблюдением ментора: ровный контур и уверенная постановка руки.", stat: "3 клиента за первую неделю", style: "ЛАЙНВОРК", imgUrl: "assets/hero-tattoo-process.jpg" },
  { name: "Максим, 31 год", module: "Графика · Модуль 7", text: "Собрал первое портфолио из учебных и клиентских работ и начал принимать заказы.", stat: "12 работ в портфолио", style: "ГРАФИКА", imgUrl: "assets/hero-student-practice.jpg" },
  { name: "Оля, 27 лет", module: "Продвижение · Модуль 9", text: "Оформила профиль и получила первые обращения ещё до окончания обучения.", stat: "30+ заявок, 5 продаж", style: "МИНИ-ТАТУ", imgUrl: "assets/hero-teaching.jpg" },
  { name: "Дмитрий, 29 лет", module: "Техника · Модуль 6", text: "Освоил лайнворк и штриховку с нуля после персональных разборов техники.", stat: "8 работ за месяц практики", style: "БЛЭКВОРК", imgUrl: "assets/hero-guided-practice.jpg" },
  { name: "Настя, 22 года", module: "Композиция · Модуль 4", text: "Пришла без художественного опыта и выполнила первую платную работу.", stat: "Первый клиент на 3 неделе", style: "БОТАНИКА", imgUrl: "assets/hero-founder-portrait.jpg" },
  { name: "Карина, 34 года", module: "Цвет · Модуль 8", text: "Сменила профессию и уверенно перешла от учебных упражнений к цветным работам.", stat: "15 работ в портфолио", style: "ЦВЕТ", imgUrl: "assets/hero-student-portrait.jpg" },
  { name: "Марта, 26 лет", module: "Диплом · Модуль 10", text: "Прошла обучение дистанционно и защитила дипломную работу на созвоне с ментором.", stat: "20+ заявок после выпуска", style: "ОРНАМЕНТ", imgUrl: "assets/hero-practice.jpg" },
  { name: "Артём, 33 года", module: "Практика · Модуль 5", text: "Сделал первую татуировку под контролем ментора и начал брать оплачиваемые работы.", stat: "Первая оплата на 4 неделе", style: "ОЛДСКУЛ", imgUrl: "assets/hero-client-practice.jpg" },
  { name: "Юля, 25 лет", module: "Цвет · Модуль 8", text: "Разобралась с цветовой теорией и перестала бояться сложных сочетаний оттенков.", stat: "10 цветных работ за 2 месяца", style: "АКВАРЕЛЬ", imgUrl: "assets/hero-graduation.jpg" },
  { name: "Богдан, 27 лет", module: "Композиция · Модуль 7", text: "Перенёс навыки графического дизайна в тату и сформировал узнаваемую подачу.", stat: "18 работ в портфолио", style: "ГЕОМЕТРИЯ", imgUrl: "assets/hero-process-moments.jpg" },
];

const CARDS: CardItem[] = CASES.map(study => ({
  imgUrl: study.imgUrl,
  alt: `${study.name}. ${study.stat}`,
  title: study.name,
  subtitle: study.style,
}));

function Demo() {
  const [activeIndex, setActiveIndex] = useState(3);
  const activeCase = CASES[activeIndex] || CASES[0];

  return (
    <div className="case-carousel-demo">
      <SocialCards cards={CARDS} onActiveChange={setActiveIndex} />
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
const legacyDetail = document.getElementById("caseFanDetail");
const legacyNav = document.getElementById("caseFanNav");
const stars = document.querySelector<HTMLElement>(".case-fan-cta .stars");
const avatars = document.querySelector(".case-fan-cta .avatars");
const count = document.querySelector<HTMLElement>(".case-fan-cta .count");

if (legacyDetail) legacyDetail.hidden = true;
if (legacyNav) legacyNav.hidden = true;
if (stars) stars.textContent = "★★★★★";
if (count) count.textContent = "300+";

if (avatars) {
  avatars.replaceChildren();
  const graduates = [
    ["Марго", "Украина · лайнворк"],
    ["Максим", "Польша · графика"],
    ["Оля", "Чехия · мини-тату"],
    ["Настя", "Германия · ботаника"],
    ["Карина", "Испания · цвет"],
  ];

  graduates.forEach(([name, role]) => {
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
