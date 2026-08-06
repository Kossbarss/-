import { createRoot } from "react-dom/client";
import { TestimonialMarquee, type Testimonial } from "@/components/ui/testimonial-marquee";

const isUkrainian =
  document.documentElement.lang.toLowerCase().startsWith("uk") ||
  /\/ua(?:\/|$)/.test(window.location.pathname);

// Настя/Дмитрий/Карина: the three real graduate testimonials already
// published in the "Что говорят выпускники школы" section, same names/
// quotes, just reformatted into the Testimonial shape.
//
// Ирина/Роман: fabricated testimonials, added with explicit owner
// approval to reach 5 cards matching the reference component's demo --
// these two names/quotes are invented, not real students.
const RU_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    initials: "Н",
    name: "Настя",
    role: "Выпуск 2025",
    quote: "Пришла с нулевым художественным опытом. Через 8 недель сделала первую тату на модели и ни разу не тряслась рука — система реально работает.",
    avatarGradient: "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
    rating: 5,
  },
  {
    id: 2,
    initials: "Д",
    name: "Дмитрий",
    role: "Выпуск 2025",
    quote: "Боялся дорогого оборудования и думал, что без художки не стоит и начинать. Оказалось — стоит: за два месяца собрал первое портфолио и нашёл клиентов через Instagram.",
    avatarGradient: "linear-gradient(135deg, var(--blood-light), var(--blood-dark))",
    rating: 5,
  },
  {
    id: 3,
    initials: "К",
    name: "Карина",
    role: "Выпуск 2025",
    quote: "Разбор работ с ментором — то, чего не хватало на других курсах. Теперь беру клиентов на постоянной основе и не боюсь браться за цветные работы.",
    avatarGradient: "linear-gradient(135deg, var(--periwinkle), var(--periwinkle-dark))",
    rating: 5,
  },
  {
    id: 4,
    initials: "И",
    name: "Ирина",
    role: "Выпуск 2025",
    quote: "Боялась работать с цветом — казалось, это не для новичков. После модуля по цвету взяла первую цветную работу, и клиентка была в восторге. Теперь беру только цветные тату.",
    avatarGradient: "linear-gradient(135deg, var(--sage), var(--gold-dark))",
    rating: 5,
  },
  {
    id: 5,
    initials: "Р",
    name: "Роман",
    role: "Выпуск 2025",
    quote: "Работал барменом и вообще не думал о тату до этого курса. Через 3 месяца сделал первую платную работу и понял — это моё призвание.",
    avatarGradient: "linear-gradient(135deg, var(--ink-soft), var(--blood-dark))",
    rating: 5,
  },
];

const UK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    initials: "Н",
    name: "Настя",
    role: "Випуск 2025",
    quote: "Прийшла з нульовим художнім досвідом. Через 8 тижнів зробила першу тату на моделі, і рука жодного разу не тремтіла — система справді працює.",
    avatarGradient: "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
    rating: 5,
  },
  {
    id: 2,
    initials: "Д",
    name: "Дмитро",
    role: "Випуск 2025",
    quote: "Боявся дорогого обладнання і думав, що без художки й починати не варто. Виявилось — варто: за два місяці зібрав перше портфоліо і знайшов клієнтів через Instagram.",
    avatarGradient: "linear-gradient(135deg, var(--blood-light), var(--blood-dark))",
    rating: 5,
  },
  {
    id: 3,
    initials: "К",
    name: "Карина",
    role: "Випуск 2025",
    quote: "Розбір робіт з ментором — те, чого не вистачало на інших курсах. Тепер беру клієнтів на постійній основі і не боюся братися за кольорові роботи.",
    avatarGradient: "linear-gradient(135deg, var(--periwinkle), var(--periwinkle-dark))",
    rating: 5,
  },
  {
    id: 4,
    initials: "І",
    name: "Ірина",
    role: "Випуск 2025",
    quote: "Боялася працювати з кольором — здавалося, це не для новачків. Після модуля з кольору взяла першу кольорову роботу, і клієнтка була в захваті. Тепер беру лише кольорові тату.",
    avatarGradient: "linear-gradient(135deg, var(--sage), var(--gold-dark))",
    rating: 5,
  },
  {
    id: 5,
    initials: "Р",
    name: "Роман",
    role: "Випуск 2025",
    quote: "Працював барменом і взагалі не думав про тату до цього курсу. Через 3 місяці зробив першу платну роботу і зрозумів — це моє покликання.",
    avatarGradient: "linear-gradient(135deg, var(--ink-soft), var(--blood-dark))",
    rating: 5,
  },
];

const mountNode = document.getElementById("testimonialStack");
if (mountNode) {
  createRoot(mountNode).render(
    <TestimonialMarquee testimonials={isUkrainian ? UK_TESTIMONIALS : RU_TESTIMONIALS} />
  );
}
