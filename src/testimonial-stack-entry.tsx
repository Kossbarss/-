import { createRoot } from "react-dom/client";
import { Clock } from "lucide-react";
import { TestimonialStack, type Testimonial } from "@/components/ui/glass-testimonial-swiper";

const isUkrainian =
  document.documentElement.lang.toLowerCase().startsWith("uk") ||
  /\/ua(?:\/|$)/.test(window.location.pathname);

// Same three real graduate testimonials already published in the
// "Что говорят выпускники школы" / "Що кажуть випускники школи" section --
// reformatted into the Testimonial shape, no new quotes or facts added.
const RU_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    initials: "Н",
    name: "Настя",
    role: "Выпуск 2025",
    quote: "Пришла с нулевым художественным опытом. Через 8 недель сделала первую тату на модели и ни разу не тряслась рука — система реально работает.",
    tags: [],
    stats: [{ icon: Clock, text: "8 недель обучения" }],
    avatarGradient: "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
  },
  {
    id: 2,
    initials: "Д",
    name: "Дмитрий",
    role: "Выпуск 2025",
    quote: "Боялся дорогого оборудования и думал, что без художки не стоит и начинать. Оказалось — стоит: за два месяца собрал первое портфолио и нашёл клиентов через Instagram.",
    tags: [],
    stats: [{ icon: Clock, text: "2 месяца практики" }],
    avatarGradient: "linear-gradient(135deg, var(--blood-light), var(--blood-dark))",
  },
  {
    id: 3,
    initials: "К",
    name: "Карина",
    role: "Выпуск 2025",
    quote: "Разбор работ с ментором — то, чего не хватало на других курсах. Теперь беру клиентов на постоянной основе и не боюсь браться за цветные работы.",
    tags: [],
    stats: [],
    avatarGradient: "linear-gradient(135deg, var(--periwinkle), var(--periwinkle-dark))",
  },
];

const UK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    initials: "Н",
    name: "Настя",
    role: "Випуск 2025",
    quote: "Прийшла з нульовим художнім досвідом. Через 8 тижнів зробила першу тату на моделі, і рука жодного разу не тремтіла — система справді працює.",
    tags: [],
    stats: [{ icon: Clock, text: "8 тижнів навчання" }],
    avatarGradient: "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
  },
  {
    id: 2,
    initials: "Д",
    name: "Дмитро",
    role: "Випуск 2025",
    quote: "Боявся дорогого обладнання і думав, що без художки й починати не варто. Виявилось — варто: за два місяці зібрав перше портфоліо і знайшов клієнтів через Instagram.",
    tags: [],
    stats: [{ icon: Clock, text: "2 місяці практики" }],
    avatarGradient: "linear-gradient(135deg, var(--blood-light), var(--blood-dark))",
  },
  {
    id: 3,
    initials: "К",
    name: "Карина",
    role: "Випуск 2025",
    quote: "Розбір робіт з ментором — те, чого не вистачало на інших курсах. Тепер беру клієнтів на постійній основі і не боюся братися за кольорові роботи.",
    tags: [],
    stats: [],
    avatarGradient: "linear-gradient(135deg, var(--periwinkle), var(--periwinkle-dark))",
  },
];

const mountNode = document.getElementById("testimonialStack");
if (mountNode) {
  createRoot(mountNode).render(
    <TestimonialStack testimonials={isUkrainian ? UK_TESTIMONIALS : RU_TESTIMONIALS} />
  );
}
