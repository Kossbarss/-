import { createRoot } from "react-dom/client";
import { Clock, Users } from "lucide-react";
import { TestimonialStack, type Testimonial } from "@/components/ui/glass-testimonial-swiper";

const isUkrainian =
  document.documentElement.lang.toLowerCase().startsWith("uk") ||
  /\/ua(?:\/|$)/.test(window.location.pathname);

// Настя/Дмитрий/Карина: the three real graduate testimonials already
// published in the "Что говорят выпускники курса" section, same names/
// quotes, just reformatted into the Testimonial shape. Cities per
// owner: Настя -- Gander, Дмитрий -- Edmonton, Карина -- Calgary.
//
// Лукас/Эмиль: also real graduates (Bergen, Norway / Berlin, Germany,
// per owner). Owner didn't have the verbatim review text on hand, so
// the quote below is a generalized paraphrase of a typical graduate's
// experience -- no invented specifics (numbers, client counts, etc.)
// were added, per owner's own direction.
const RU_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    initials: "Н",
    name: "Настя",
    role: "Gander",
    quote: "Пришла с нулевым художественным опытом. Через 8 недель сделала первую тату на модели и ни разу не тряслась рука — система реально работает.",
    tags: [{ text: "ПЕРВЫЙ ПОТОК", type: "featured" }],
    stats: [{ icon: Clock, text: "8 недель обучения" }],
    avatarGradient: "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
    rating: 4.9,
  },
  {
    id: 2,
    initials: "Д",
    name: "Дмитрий",
    role: "Edmonton",
    quote: "Боялся дорогого оборудования и думал, что без художки не стоит и начинать. Оказалось — стоит: за два месяца собрал первое портфолио и нашёл клиентов через Instagram.",
    tags: [{ text: "INSTAGRAM", type: "featured" }],
    stats: [{ icon: Clock, text: "2 месяца практики" }],
    avatarGradient: "linear-gradient(135deg, var(--blood-light), var(--blood-dark))",
    rating: 4.5,
  },
  {
    id: 3,
    initials: "К",
    name: "Карина",
    role: "Calgary",
    quote: "Разбор работ с ментором — то, чего не хватало на других курсах. Теперь беру клиентов на постоянной основе и не боюсь браться за цветные работы.",
    tags: [{ text: "ЦВЕТ", type: "featured" }],
    stats: [{ icon: Users, text: "Постоянные клиенты" }],
    avatarGradient: "linear-gradient(135deg, var(--periwinkle), var(--periwinkle-dark))",
    rating: 5,
  },
  {
    id: 4,
    initials: "Л",
    name: "Лукас",
    role: "Bergen",
    quote: "Учился онлайн из Норвегии, Берген, и переживал, что обратная связь будет не такой живой на расстоянии. Оказалось наоборот: разборы работ с ментором такие же подробные, как в очной студии. Теперь увереннее берусь за новые техники.",
    tags: [{ text: "МЕЖДУНАРОДНЫЙ УЧЕНИК", type: "featured" }],
    stats: [{ icon: Clock, text: "Обучение онлайн" }],
    avatarGradient: "linear-gradient(135deg, var(--sage), var(--gold-dark))",
    rating: 4.3,
  },
  {
    id: 5,
    initials: "Э",
    name: "Эмиль",
    role: "Berlin",
    quote: "Начинал с нуля в Берлине — только делал наброски для себя. Курс дал понятную систему: от базовой техники до общения с клиентами. Сейчас собираю собственное портфолио и не боюсь показывать работы вживую.",
    tags: [{ text: "С НУЛЯ", type: "featured" }],
    stats: [{ icon: Users, text: "Собственное портфолио" }],
    avatarGradient: "linear-gradient(135deg, var(--ink-soft), var(--blood-dark))",
    rating: 4.7,
  },
];

const UK_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    initials: "Н",
    name: "Настя",
    role: "Gander",
    quote: "Прийшла з нульовим художнім досвідом. Через 8 тижнів зробила першу тату на моделі, і рука жодного разу не тремтіла — система справді працює.",
    tags: [{ text: "ПЕРШИЙ ПОТІК", type: "featured" }],
    stats: [{ icon: Clock, text: "8 тижнів навчання" }],
    avatarGradient: "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
    rating: 4.9,
  },
  {
    id: 2,
    initials: "Д",
    name: "Дмитро",
    role: "Edmonton",
    quote: "Боявся дорогого обладнання і думав, що без художки й починати не варто. Виявилось — варто: за два місяці зібрав перше портфоліо і знайшов клієнтів через Instagram.",
    tags: [{ text: "INSTAGRAM", type: "featured" }],
    stats: [{ icon: Clock, text: "2 місяці практики" }],
    avatarGradient: "linear-gradient(135deg, var(--blood-light), var(--blood-dark))",
    rating: 4.5,
  },
  {
    id: 3,
    initials: "К",
    name: "Карина",
    role: "Calgary",
    quote: "Розбір робіт з ментором — те, чого не вистачало на інших курсах. Тепер беру клієнтів на постійній основі і не боюся братися за кольорові роботи.",
    tags: [{ text: "КОЛІР", type: "featured" }],
    stats: [{ icon: Users, text: "Постійні клієнти" }],
    avatarGradient: "linear-gradient(135deg, var(--periwinkle), var(--periwinkle-dark))",
    rating: 5,
  },
  {
    id: 4,
    initials: "Л",
    name: "Лукас",
    role: "Bergen",
    quote: "Навчався онлайн з Норвегії, Берген, і переживав, що зворотний зв'язок буде не таким живим на відстані. Виявилось навпаки: розбори робіт з ментором такі ж докладні, як в офлайн-студії. Тепер впевненіше беруся за нові техніки.",
    tags: [{ text: "МІЖНАРОДНИЙ УЧЕНЬ", type: "featured" }],
    stats: [{ icon: Clock, text: "Навчання онлайн" }],
    avatarGradient: "linear-gradient(135deg, var(--sage), var(--gold-dark))",
    rating: 4.3,
  },
  {
    id: 5,
    initials: "Е",
    name: "Еміль",
    role: "Berlin",
    quote: "Починав з нуля в Берліні — тільки робив ескізи для себе. Курс дав зрозумілу систему: від базової техніки до спілкування з клієнтами. Зараз збираю власне портфоліо і не боюся показувати роботи наживо.",
    tags: [{ text: "З НУЛЯ", type: "featured" }],
    stats: [{ icon: Users, text: "Власне портфоліо" }],
    avatarGradient: "linear-gradient(135deg, var(--ink-soft), var(--blood-dark))",
    rating: 4.7,
  },
];

const mountNode = document.getElementById("testimonialStack");
if (mountNode) {
  createRoot(mountNode).render(
    <TestimonialStack
      testimonials={isUkrainian ? UK_TESTIMONIALS : RU_TESTIMONIALS}
      ratingCaption={isUkrainian ? "Оцінка відгуків навчання" : "Оценка отзывов обучения"}
      paginationLabel={(n) => (isUkrainian ? `Перейти до відгуку ${n}` : `Перейти к отзыву ${n}`)}
    />
  );
}
