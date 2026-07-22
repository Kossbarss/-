import { useState } from "react";
import { createRoot } from "react-dom/client";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";

type CaseStudy = {
  name: string;
  module: string;
  text: string;
  stat: string;
  accent: string;
  dark: string;
};

const CASES: CaseStudy[] = [
  { name: "Марго, 24 года", module: "Лайнворк · Модуль 5", text: "Первая работа на модели под наблюдением ментора: ровный контур и уверенная постановка руки.", stat: "3 клиента за первую неделю", accent: "#d59d2f", dark: "#201712" },
  { name: "Максим, 31 год", module: "Графика · Модуль 7", text: "Собрал первое портфолио из учебных и клиентских работ и начал принимать заказы.", stat: "12 работ в портфолио", accent: "#a9271f", dark: "#160a09" },
  { name: "Оля, 27 лет", module: "Продвижение · Модуль 9", text: "Оформила профиль и получила первые обращения ещё до окончания обучения.", stat: "30+ заявок, 5 продаж", accent: "#c68a2b", dark: "#21160c" },
  { name: "Дмитрий, 29 лет", module: "Техника · Модуль 6", text: "Освоил лайнворк и штриховку с нуля после персональных разборов техники.", stat: "8 работ за месяц практики", accent: "#8e201a", dark: "#180908" },
  { name: "Настя, 22 года", module: "Композиция · Модуль 4", text: "Пришла без художественного опыта и выполнила первую платную работу.", stat: "Первый клиент на 3 неделе", accent: "#d0a03e", dark: "#21180d" },
  { name: "Карина, 34 года", module: "Цвет · Модуль 8", text: "Сменила профессию и уверенно перешла от учебных упражнений к цветным работам.", stat: "15 работ в портфолио", accent: "#a52a21", dark: "#180a09" },
  { name: "Марта, 26 лет", module: "Диплом · Модуль 10", text: "Прошла обучение дистанционно и защитила дипломную работу на созвоне с ментором.", stat: "20+ заявок после выпуска", accent: "#c59235", dark: "#21160c" },
  { name: "Артём, 33 года", module: "Практика · Модуль 5", text: "Сделал первую татуировку под контролем ментора и начал брать оплачиваемые работы.", stat: "Первая оплата на 4 неделе", accent: "#8f241d", dark: "#170908" },
  { name: "Юля, 25 лет", module: "Цвет · Модуль 8", text: "Разобралась с цветовой теорией и перестала бояться сложных сочетаний оттенков.", stat: "10 цветных работ за 2 месяца", accent: "#d1a03f", dark: "#22180d" },
  { name: "Богдан, 27 лет", module: "Композиция · Модуль 7", text: "Перенёс навыки графического дизайна в тату и сформировал узнаваемую подачу.", stat: "18 работ в портфолио", accent: "#a62a21", dark: "#180a09" },
];

const XML_ENTITIES: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  "\"": "&quot;",
};

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, character => XML_ENTITIES[character] || character);
}

function createCaseImage(study: CaseStudy, index: number) {
  const number = String(index + 1).padStart(2, "0");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="700" viewBox="0 0 440 700">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${study.accent}"/>
        <stop offset="0.48" stop-color="${study.dark}"/>
        <stop offset="1" stop-color="#090706"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="38%" r="58%">
        <stop offset="0" stop-color="#fff4cc" stop-opacity=".28"/>
        <stop offset="1" stop-color="#fff4cc" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="440" height="700" rx="34" fill="url(#bg)"/>
    <rect width="440" height="700" rx="34" fill="url(#glow)"/>
    <g fill="none" stroke="#f8e5b4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".78">
      <path d="M220 105c-72 0-130 57-130 128 0 96 130 204 130 204s130-108 130-204c0-71-58-128-130-128Z"/>
      <path d="M151 245c27-47 54-71 69-71s42 24 69 71c-23 20-46 30-69 30s-46-10-69-30Z"/>
      <circle cx="220" cy="222" r="24"/>
      <path d="M132 346c34-20 63-28 88-24m88 24c-34-20-63-28-88-24M164 382c20-12 39-18 56-18s36 6 56 18"/>
    </g>
    <text x="42" y="58" fill="#fff7df" font-family="Arial,sans-serif" font-size="22" opacity=".82">/${number}</text>
    <text x="220" y="520" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="700" font-size="28">${escapeXml(study.name)}</text>
    <text x="220" y="558" text-anchor="middle" fill="#fff3d0" font-family="Arial,sans-serif" font-size="18" opacity=".9">${escapeXml(study.module)}</text>
    <text x="220" y="628" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-size="16" opacity=".72">КЕЙС УЧЕНИКА</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const CARDS: CardItem[] = CASES.map((study, index) => ({
  imgUrl: createCaseImage(study, index),
  alt: `${study.name}. ${study.stat}`,
}));

function Demo() {
  const [activeIndex, setActiveIndex] = useState(3);
  const activeCase = CASES[activeIndex] || CASES[0];

  return (
    <div className="case-carousel-demo">
      <SocialCards cards={CARDS} onActiveChange={setActiveIndex} />
      <article className="case-carousel-detail" aria-live="polite">
        <span>{activeCase.module}</span>
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
const avatars = document.querySelector(".case-fan-cta .avatars");

if (legacyDetail) legacyDetail.hidden = true;
if (legacyNav) legacyNav.hidden = true;

if (avatars) {
  avatars.replaceChildren();
  ["М", "Д", "О", "Н", "К"].forEach((initial, index) => {
    const avatar = document.createElement("span");
    avatar.className = "avatar case-student-avatar";
    avatar.textContent = initial;
    avatar.setAttribute("aria-label", `Выпускник ${index + 1}`);
    avatars.appendChild(avatar);
  });
}

if (mountNode) {
  mountNode.replaceChildren();
  mountNode.setAttribute("data-card-fan-carousel", "true");
  createRoot(mountNode).render(<Demo />);
}
