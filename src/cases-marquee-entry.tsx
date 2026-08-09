import { createRoot } from "react-dom/client";
import { TestimonialMarquee, type Testimonial } from "@/components/ui/testimonial-marquee";

const isUkrainian =
  document.documentElement.lang.toLowerCase().startsWith("uk") ||
  /\/ua(?:\/|$)/.test(window.location.pathname);

// Марта/Настя/Дмитрий/Карина: real graduate testimonials. Марта's quote
// is the same one that used to live in the single "chat-mock" card this
// marquee replaces. Настя/Дмитрий/Карина are the same real testimonials
// used in the "Что говорят выпускники курса" stack below.
//
// Оля/Андрей: also real graduates -- same two people (name/city/quote)
// already published in the "Кейсы учеников" case carousel, sourced
// from the client-provided document. Replaces the two placeholder
// (fabricated) cards that used to sit here.
const RU_TESTIMONIALS: Testimonial[] = [
  {
    id: "marta",
    initials: "М",
    name: "Марта_ink",
    role: "Lodz",
    quote: "Спасибо! 🙏 Мечтала уверенно держать машинку целый год, но всегда думала, что это не для меня. После разбора работы с ментором наконец чувствую себя мастером, а не «той, кто нарисовала пятно».",
    avatarGradient: "linear-gradient(135deg, var(--gold), var(--blood-dark))",
    rating: 5,
  },
  {
    id: 1,
    initials: "Н",
    name: "Настя",
    role: "Gander",
    quote: "Пришла с нулевым художественным опытом. Через 8 недель сделала первую тату на модели и ни разу не тряслась рука — система реально работает.",
    avatarGradient: "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
    rating: 4.8,
  },
  {
    id: 2,
    initials: "Д",
    name: "Дмитрий",
    role: "Edmonton",
    quote: "Боялся дорогого оборудования и думал, что без художки не стоит и начинать. Оказалось — стоит: за два месяца собрал первое портфолио и нашёл клиентов через Instagram.",
    avatarGradient: "linear-gradient(135deg, var(--blood-light), var(--blood-dark))",
    rating: 4,
  },
  {
    id: 3,
    initials: "К",
    name: "Карина",
    role: "Calgary",
    quote: "Разбор работ с ментором — то, чего не хватало на других курсах. Теперь беру клиентов на постоянной основе и не боюсь браться за цветные работы.",
    avatarGradient: "linear-gradient(135deg, var(--periwinkle), var(--periwinkle-dark))",
    rating: 4.5,
  },
  {
    id: 4,
    initials: "О",
    name: "Оля",
    role: "Gdansk",
    quote: "Важно никогда не отказываться от своей мечты 💫 Превращение художественного хобби в собственную тату-студию — иногда новые знакомства дарят нам новые пути и образ жизни 😊",
    avatarGradient: "linear-gradient(135deg, var(--sage), var(--gold-dark))",
    rating: 3.8,
  },
  {
    id: 5,
    initials: "А",
    name: "Андрей",
    role: "Kyiv",
    quote: "Тату — это современное искусство. И как художник (теперь по совместительству и тату-мастер) я всегда стараюсь делать свою работу так, чтобы клиент радовался новому имиджу.",
    avatarGradient: "linear-gradient(135deg, var(--ink-soft), var(--blood-dark))",
    rating: 4.3,
  },
];

const UK_TESTIMONIALS: Testimonial[] = [
  {
    id: "marta",
    initials: "М",
    name: "Марта_ink",
    role: "Lodz",
    quote: "Дякую! 🙏 Мріяла впевнено тримати машинку цілий рік, але завжди думала, що це не для мене. Після розбору роботи з ментором нарешті відчуваю себе майстром, а не «тією, хто намалювала пляму».",
    avatarGradient: "linear-gradient(135deg, var(--gold), var(--blood-dark))",
    rating: 5,
  },
  {
    id: 1,
    initials: "Н",
    name: "Настя",
    role: "Gander",
    quote: "Прийшла з нульовим художнім досвідом. Через 8 тижнів зробила першу тату на моделі, і рука жодного разу не тремтіла — система справді працює.",
    avatarGradient: "linear-gradient(135deg, var(--gold-light), var(--gold-dark))",
    rating: 4.8,
  },
  {
    id: 2,
    initials: "Д",
    name: "Дмитро",
    role: "Edmonton",
    quote: "Боявся дорогого обладнання і думав, що без художки й починати не варто. Виявилось — варто: за два місяці зібрав перше портфоліо і знайшов клієнтів через Instagram.",
    avatarGradient: "linear-gradient(135deg, var(--blood-light), var(--blood-dark))",
    rating: 4,
  },
  {
    id: 3,
    initials: "К",
    name: "Карина",
    role: "Calgary",
    quote: "Розбір робіт з ментором — те, чого не вистачало на інших курсах. Тепер беру клієнтів на постійній основі і не боюся братися за кольорові роботи.",
    avatarGradient: "linear-gradient(135deg, var(--periwinkle), var(--periwinkle-dark))",
    rating: 4.5,
  },
  {
    id: 4,
    initials: "О",
    name: "Оля",
    role: "Gdansk",
    quote: "Важливо ніколи не відмовлятися від своєї мрії 💫 Перетворення художнього хобі на власну тату-студію — іноді нові знайомства дарують нам нові шляхи й спосіб життя 😊",
    avatarGradient: "linear-gradient(135deg, var(--sage), var(--gold-dark))",
    rating: 3.8,
  },
  {
    id: 5,
    initials: "А",
    name: "Андрій",
    role: "Kyiv",
    quote: "Тату — це сучасне мистецтво. І як художник (тепер за сумісництвом і тату-майстер) я завжди намагаюся робити свою роботу так, щоб клієнт радів новому іміджу.",
    avatarGradient: "linear-gradient(135deg, var(--ink-soft), var(--blood-dark))",
    rating: 4.3,
  },
];

const mountNode = document.getElementById("casesTestimonialMarquee");
if (mountNode) {
  createRoot(mountNode).render(
    <TestimonialMarquee
      testimonials={isUkrainian ? UK_TESTIMONIALS : RU_TESTIMONIALS}
      verifiedLabel={isUkrainian ? "Верифіковано" : "Верифицировано"}
      ratingCaption={isUkrainian ? "Оцінка відгуків навчання" : "Оценка отзывов обучения"}
      ratingAriaLabel={(rating) => (isUkrainian ? `Оцінка ${rating} з 5` : `Оценка ${rating} из 5`)}
    />
  );
}
