import { useState } from "react";
import { createRoot } from "react-dom/client";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";

type CaseStudy = {
  name: string;
  module: string;
  text: string;
  stat: string;
  style: string;
  accent: string;
  dark: string;
};

const CASES: CaseStudy[] = [
  { name: "Марго, 24 года", module: "Лайнворк · Модуль 5", text: "Первая работа на модели под наблюдением ментора: ровный контур и уверенная постановка руки.", stat: "3 клиента за первую неделю", style: "ЛАЙНВОРК", accent: "#c99530", dark: "#19110d" },
  { name: "Максим, 31 год", module: "Графика · Модуль 7", text: "Собрал первое портфолио из учебных и клиентских работ и начал принимать заказы.", stat: "12 работ в портфолио", style: "ГРАФИКА", accent: "#9e261f", dark: "#130908" },
  { name: "Оля, 27 лет", module: "Продвижение · Модуль 9", text: "Оформила профиль и получила первые обращения ещё до окончания обучения.", stat: "30+ заявок, 5 продаж", style: "МИНИ-ТАТУ", accent: "#b9862c", dark: "#1b120b" },
  { name: "Дмитрий, 29 лет", module: "Техника · Модуль 6", text: "Освоил лайнворк и штриховку с нуля после персональных разборов техники.", stat: "8 работ за месяц практики", style: "БЛЭКВОРК", accent: "#872019", dark: "#120807" },
  { name: "Настя, 22 года", module: "Композиция · Модуль 4", text: "Пришла без художественного опыта и выполнила первую платную работу.", stat: "Первый клиент на 3 неделе", style: "БОТАНИКА", accent: "#c89a3b", dark: "#1d150c" },
  { name: "Карина, 34 года", module: "Цвет · Модуль 8", text: "Сменила профессию и уверенно перешла от учебных упражнений к цветным работам.", stat: "15 работ в портфолио", style: "ЦВЕТ", accent: "#a12820", dark: "#150807" },
  { name: "Марта, 26 лет", module: "Диплом · Модуль 10", text: "Прошла обучение дистанционно и защитила дипломную работу на созвоне с ментором.", stat: "20+ заявок после выпуска", style: "ОРНАМЕНТ", accent: "#bd8a31", dark: "#1d130b" },
  { name: "Артём, 33 года", module: "Практика · Модуль 5", text: "Сделал первую татуировку под контролем ментора и начал брать оплачиваемые работы.", stat: "Первая оплата на 4 неделе", style: "ОЛДСКУЛ", accent: "#8f241d", dark: "#130807" },
  { name: "Юля, 25 лет", module: "Цвет · Модуль 8", text: "Разобралась с цветовой теорией и перестала бояться сложных сочетаний оттенков.", stat: "10 цветных работ за 2 месяца", style: "АКВАРЕЛЬ", accent: "#c99a3a", dark: "#1d150c" },
  { name: "Богдан, 27 лет", module: "Композиция · Модуль 7", text: "Перенёс навыки графического дизайна в тату и сформировал узнаваемую подачу.", stat: "18 работ в портфолио", style: "ГЕОМЕТРИЯ", accent: "#98251e", dark: "#140807" },
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

const MOTIFS = [
  '<path d="M90 240c45-105 215-105 260 0-45 105-215 105-260 0Z"/><circle cx="220" cy="240" r="48"/><circle cx="220" cy="240" r="13"/>',
  '<path d="M220 92l35 92 96 6-74 61 25 94-82-52-82 52 25-94-74-61 96-6Z"/><circle cx="220" cy="218" r="38"/>',
  '<path d="M220 95c-88 0-132 70-132 142 0 104 132 214 132 214s132-110 132-214c0-72-44-142-132-142Z"/><path d="M145 246c40-58 110-58 150 0-40 48-110 48-150 0Z"/><circle cx="220" cy="246" r="25"/>',
  '<path d="M124 355c12-105 56-205 96-250 40 45 84 145 96 250-60-34-132-34-192 0Z"/><path d="M160 315c35-30 85-30 120 0M176 258c25-20 63-20 88 0M220 105v238"/>',
  '<path d="M220 100c-55 40-82 85-55 125-54 8-75 55-42 94 34 40 75 26 97-12 22 38 63 52 97 12 33-39 12-86-42-94 27-40 0-85-55-125Z"/><path d="M220 307v105M180 363c26-18 54-18 80 0"/>',
  '<path d="M112 310c22-145 194-145 216 0-52-25-164-25-216 0Z"/><path d="M145 310c12 70 138 70 150 0M165 212l55 98 55-98"/><circle cx="220" cy="190" r="32"/>',
  '<path d="M220 98l42 72 82 18-55 62 8 84-77-34-77 34 8-84-55-62 82-18Z"/><circle cx="220" cy="222" r="58"/><path d="M180 222h80M220 182v80"/>',
  '<path d="M112 330c35-120 75-180 108-224 33 44 73 104 108 224-64-42-152-42-216 0Z"/><path d="M150 280l70-86 70 86M178 320l42-58 42 58"/>',
  '<path d="M115 270c42-125 168-125 210 0-58-33-152-33-210 0Z"/><path d="M125 292c48 88 142 88 190 0M168 214c0 70 104 70 104 0"/><circle cx="220" cy="178" r="30"/>',
  '<path d="M220 92l118 68v136l-118 68-118-68V160Z"/><path d="M220 138l78 45v90l-78 45-78-45v-90Z"/><path d="M220 184l38 22v44l-38 22-38-22v-44Z"/>',
];

function createCaseImage(study: CaseStudy, index: number) {
  const number = String(index + 1).padStart(2, "0");
  const motif = MOTIFS[index % MOTIFS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="440" height="700" viewBox="0 0 440 700">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${study.accent}"/>
        <stop offset="0.5" stop-color="${study.dark}"/>
        <stop offset="1" stop-color="#070505"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="32%" r="60%">
        <stop offset="0" stop-color="#fff1bd" stop-opacity=".24"/>
        <stop offset="1" stop-color="#fff1bd" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="440" height="700" rx="34" fill="url(#bg)"/>
    <rect width="440" height="700" rx="34" fill="url(#glow)"/>
    <g fill="none" stroke="#f6dfaa" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity=".88">${motif}</g>
    <text x="34" y="48" fill="#fff3cf" font-family="Arial,sans-serif" font-size="20" opacity=".82">/${number}</text>
    <text x="220" y="510" text-anchor="middle" fill="#fff" font-family="Arial,sans-serif" font-weight="700" font-size="25">${escapeXml(study.style)}</text>
    <text x="220" y="552" text-anchor="middle" fill="#fff3d0" font-family="Arial,sans-serif" font-size="18" opacity=".9">${escapeXml(study.module)}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const CARDS: CardItem[] = CASES.map((study, index) => ({
  imgUrl: createCaseImage(study, index),
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
const stars = document.querySelector<HTMLElement>(".case-fan-cta .stars");
const avatars = document.querySelector(".case-fan-cta .avatars");
const count = document.querySelector<HTMLElement>(".case-fan-cta .count");

if (legacyDetail) legacyDetail.hidden = true;
if (legacyNav) legacyNav.hidden = true;
if (stars) stars.textContent = "★★★★★";
if (count) count.textContent = "300+";

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
