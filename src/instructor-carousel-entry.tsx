import { createRoot } from "react-dom/client";
import { CircularTestimonials, type Testimonial } from "@/components/ui/circular-testimonials";
import { NumberTicker } from "@/components/ui/be-ui-number-animation";

const isUkrainian =
  document.documentElement.lang.toLowerCase().startsWith("uk") ||
  /\/ua(?:\/|$)/.test(window.location.pathname);

const assetPrefix = isUkrainian ? "../assets/" : "assets/";

const RU_TESTIMONIALS: Testimonial[] = [
  {
    name: "Виктория Поникарова",
    designation: "Тату-мастер и наставница",
    quote: "Я не теоретик, а практикующий мастер, который каждый день работает с клиентами и видит, какие ошибки совершают новички.",
    src: `${assetPrefix}hero-founder-portrait.jpg`,
  },
  {
    name: "Виктория Поникарова",
    designation: "Лицо обложки Bomond VIP fashion magazine",
    quote: "Для меня красота без смысла — пуста, а смысл без красоты — нем.",
    src: `${assetPrefix}instructor-bomond-cover.jpg`,
  },
  {
    name: "Виктория Поникарова",
    designation: "Основательница студии «Sarna Tattoo», победительница Personal Branding Awards Poland Ukraine",
    quote: "Настоящий мастер начинается с уважения — к телу, к человеку, к процессу.",
    src: `${assetPrefix}instructor-tattoo-machine.jpg`,
  },
];

const UK_TESTIMONIALS: Testimonial[] = [
  {
    name: "Вікторія Понікарова",
    designation: "Тату-майстриня та наставниця",
    quote: "Я не теоретик, а практикуюча майстриня, яка щодня працює з клієнтами і бачить, які помилки роблять новачки.",
    src: `${assetPrefix}hero-founder-portrait.jpg`,
  },
  {
    name: "Вікторія Понікарова",
    designation: "Обличчя цифрової обкладинки Bomond VIP fashion magazine",
    quote: "Для мене краса без сенсу — порожня, а сенс без краси — німий.",
    src: `${assetPrefix}instructor-bomond-cover.jpg`,
  },
  {
    name: "Вікторія Понікарова",
    designation: "Засновниця студії «Sarna Tattoo», переможниця Personal Branding Awards Poland Ukraine",
    quote: "Справжній майстер починається з поваги — до тіла, до людини, до процесу.",
    src: `${assetPrefix}instructor-tattoo-machine.jpg`,
  },
];

const mountNode = document.getElementById("instructorCarousel");
if (mountNode) {
  createRoot(mountNode).render(
    <CircularTestimonials
      testimonials={isUkrainian ? UK_TESTIMONIALS : RU_TESTIMONIALS}
      autoplay={true}
      colors={{
        name: "var(--paper)",
        designation: "var(--gold-light)",
        testimony: "rgba(250, 246, 239, 0.82)",
        arrowBackground: "var(--ink)",
        arrowForeground: "var(--paper)",
        arrowHoverBackground: "var(--gold)",
      }}
      fontSizes={{
        name: "1.3rem",
        designation: "0.9rem",
        quote: "1rem",
      }}
    />
  );
}

// Same rolling-digit mechanism as the hero's "300+"/"22+" counters
// (components/ui/be-ui-number-animation.tsx), reused here for the
// stats-row. Unlike the hero (always above the fold, so it uses a
// fixed startDelay tied to the hero's own word-reveal timeline),
// this section scrolls into view, so the default startOnView
// behaviour is the right trigger here instead.
const statsToMount: Array<{ id: string; value: number; suffix?: string }> = [
  { id: "instructorStatMakeup", value: 80, suffix: "%" },
  { id: "instructorStatGraduates", value: 300, suffix: "+" },
  { id: "instructorStatWorks", value: 2000, suffix: "+" },
  { id: "instructorStatPartners", value: 12 },
];

for (const stat of statsToMount) {
  const node = document.getElementById(stat.id);
  if (node) {
    createRoot(node).render(
      <NumberTicker value={stat.value} suffix={stat.suffix} duration={2.2} stagger={0.15} />
    );
  }
}
