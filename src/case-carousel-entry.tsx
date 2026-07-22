import { createRoot } from "react-dom/client";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";

type CaseStudy = {
  idx: string;
  name: string;
  module: string;
  text: string;
  stat: string;
};

const ru: CaseStudy[] = [
  { idx: "01", name: "Марго, 24 года", module: "До / После · Модуль 5", text: "Первая тату на модели под наблюдением ментора — ровная линия без дрожи с первого раза.", stat: "3 клиента за первую неделю" },
  { idx: "02", name: "Максим, 31 год", module: "До / После · Модуль 7", text: "Перешёл от рисования на бумаге сразу к цветной работе — портфолио за 2 месяца.", stat: "12 работ в портфолио" },
  { idx: "03", name: "Оля, 27 лет", module: "До / После · Модуль 9", text: "Нашла первых клиентов через Instagram ещё до завершения курса, по шаблону из бонусов.", stat: "30+ заявок, 5 продаж" },
  { idx: "04", name: "Дмитрий, 29 лет", module: "До / После · Модуль 6", text: "Освоил лайнворк и штриховку с нуля, преподаватель разобрал его технику на трёх личных созвонах.", stat: "8 работ за месяц практики" },
  { idx: "05", name: "Настя, 22 года", module: "До / После · Модуль 4", text: "Пришла без художественного опыта — после блока по композиции взяла первую платную работу.", stat: "Первый клиент на 3 неделе" },
  { idx: "06", name: "Карина, 34 года", module: "До / После · Модуль 8", text: "Сменила профессию в 34 — курс подтянул именно то, чего не хватало для перехода в цвет и реализм.", stat: "15 работ в портфолио" },
  { idx: "07", name: "Марта, 26 лет", module: "До / После · Модуль 10", text: "Прошла курс полностью удалённо, дипломную работу разбирали на выпускном созвоне с ментором.", stat: "20+ заявок после выпуска" },
  { idx: "08", name: "Артём, 33 года", module: "До / После · Модуль 5", text: "Раньше рисовал только скетчи для себя — на курсе впервые набил тату другу под контролем ментора.", stat: "Первая оплаченная работа на 4 неделе" },
  { idx: "09", name: "Юля, 25 лет", module: "До / После · Модуль 8", text: "Боялась цвета — блок по цветовой теории и разбор работ сняли страх.", stat: "10 цветных работ за 2 месяца" },
  { idx: "10", name: "Богдан, 27 лет", module: "До / После · Модуль 7", text: "Пришёл из графического дизайна — перенос композиции на кожу дался легко.", stat: "18 работ в портфолио" },
  { idx: "11", name: "Соня, 30 лет", module: "До / После · Модуль 9", text: "Совмещала обучение с основной работой и к выпуску набрала первую очередь клиентов.", stat: "Запись на 3 недели вперёд" },
  { idx: "12", name: "Игорь, 36 лет", module: "До / После · Модуль 6", text: "Сменил профессию после 15 лет в другой сфере и начал работать с реальной кожей.", stat: "6 клиентов за первый месяц" },
];

const uk: CaseStudy[] = [
  { idx: "01", name: "Марго, 24 роки", module: "До / Після · Модуль 5", text: "Перше тату на моделі під наглядом ментора — рівна лінія без тремтіння з першого разу.", stat: "3 клієнти за перший тиждень" },
  { idx: "02", name: "Максим, 31 рік", module: "До / Після · Модуль 7", text: "Перейшов від малювання на папері одразу до кольорової роботи — портфоліо за 2 місяці.", stat: "12 робіт у портфоліо" },
  { idx: "03", name: "Оля, 27 років", module: "До / Після · Модуль 9", text: "Знайшла перших клієнтів через Instagram ще до завершення курсу.", stat: "30+ заявок, 5 продажів" },
  { idx: "04", name: "Дмитро, 29 років", module: "До / Після · Модуль 6", text: "Опанував лайнворк і штрихування з нуля з особистими розборами викладача.", stat: "8 робіт за місяць практики" },
  { idx: "05", name: "Настя, 22 роки", module: "До / Після · Модуль 4", text: "Прийшла без художнього досвіду та взяла першу платну роботу.", stat: "Перший клієнт на 3 тижні" },
  { idx: "06", name: "Карина, 34 роки", module: "До / Після · Модуль 8", text: "Змінила професію та перейшла до кольору й реалізму.", stat: "15 робіт у портфоліо" },
  { idx: "07", name: "Марта, 26 років", module: "До / Після · Модуль 10", text: "Пройшла курс дистанційно, дипломну роботу розбирали з ментором.", stat: "20+ заявок після випуску" },
  { idx: "08", name: "Артем, 33 роки", module: "До / Після · Модуль 5", text: "На курсі вперше зробив тату другові під контролем ментора.", stat: "Перша оплачена робота на 4 тижні" },
  { idx: "09", name: "Юля, 25 років", module: "До / Після · Модуль 8", text: "Блок із теорії кольору та розбір робіт зняли страх перед кольором.", stat: "10 кольорових робіт за 2 місяці" },
  { idx: "10", name: "Богдан, 27 років", module: "До / Після · Модуль 7", text: "Перенесення композиції на шкіру допомогло обрати спеціалізацію.", stat: "18 робіт у портфоліо" },
  { idx: "11", name: "Соня, 30 років", module: "До / Після · Модуль 9", text: "Поєднувала навчання з роботою та зібрала першу чергу клієнтів.", stat: "Запис на 3 тижні наперед" },
  { idx: "12", name: "Ігор, 36 років", module: "До / Після · Модуль 6", text: "Змінив професію після 15 років в іншій сфері.", stat: "6 клієнтів за перший місяць" },
];

const studies = document.documentElement.lang === "uk" ? uk : ru;
const palettes = [
  ["#b98426", "#f0c76b", "#3b240f"],
  ["#8d0908", "#e31b12", "#250706"],
  ["#b97f21", "#f4d27e", "#3d250d"],
  ["#6f100c", "#bd2818", "#24100c"],
];

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    "\"": "&quot;",
  })[character] || character);
}

function createCaseImage(study: CaseStudy, index: number) {
  const [start, highlight, end] = palettes[index % palettes.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="720" viewBox="0 0 420 720">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${start}"/>
        <stop offset="0.34" stop-color="${highlight}"/>
        <stop offset="0.48" stop-color="${start}"/>
        <stop offset="1" stop-color="${end}"/>
      </linearGradient>
      <linearGradient id="shine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#fff" stop-opacity="0.78"/>
        <stop offset="0.16" stop-color="#fff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect width="420" height="720" rx="42" fill="url(#bg)"/>
    <path d="M0 0H180L0 250Z" fill="url(#shine)"/>
    <rect x="1" y="1" width="418" height="718" rx="41" fill="none" stroke="#f6d68b" stroke-opacity="0.38" stroke-width="2"/>
    <text x="210" y="285" text-anchor="middle" fill="#fff7df" fill-opacity="0.72" font-family="Arial, sans-serif" font-size="28">/${escapeXml(study.idx)}</text>
    <text x="210" y="350" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-weight="700" font-size="30">${escapeXml(study.name)}</text>
    <text x="210" y="405" text-anchor="middle" fill="#fff7df" fill-opacity="0.82" font-family="Arial, sans-serif" font-size="20">${escapeXml(study.module)}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const cards: CardItem[] = studies.map((study, index) => ({
  imgUrl: createCaseImage(study, index),
  alt: `${study.name}. ${study.stat}`,
}));

const mountNode = document.getElementById("caseFanLayout");
const detailNode = document.getElementById("caseFanDetail");
const legacyNav = document.getElementById("caseFanNav");

function renderDetail(index: number) {
  const study = studies[index];
  if (!detailNode || !study) return;
  detailNode.replaceChildren();

  const module = document.createElement("span");
  module.className = "case-fan-detail-module";
  module.textContent = study.module;

  const title = document.createElement("h4");
  title.textContent = study.name;

  const text = document.createElement("p");
  text.textContent = study.text;

  const stat = document.createElement("div");
  stat.className = "case-stat";
  stat.textContent = study.stat;

  detailNode.append(module, title, text, stat);
}

if (mountNode) {
  (window as Window & { __vipTattooCasesLoaded?: boolean }).__vipTattooCasesLoaded = true;
  mountNode.replaceChildren();
  mountNode.setAttribute("data-card-fan-carousel", "true");
  mountNode.setAttribute("aria-label", document.documentElement.lang === "uk" ? "Кейси учнів" : "Кейсы учеников");
  if (legacyNav) legacyNav.hidden = true;

  createRoot(mountNode).render(<SocialCards cards={cards} onSelect={renderDetail} />);
}
