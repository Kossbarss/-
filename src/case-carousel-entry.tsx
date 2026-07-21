import { createRoot } from "react-dom/client";
import SocialCards, { type CardItem } from "@/components/ui/card-fan-carousel";

const cards: CardItem[] = [
  { imgUrl: "assets/hero-tattoo-process.jpg", alt: "Виктория работает над татуировкой" },
  { imgUrl: "assets/hero-student-practice.jpg", alt: "Ученица практикуется с тату-машинкой" },
  { imgUrl: "assets/hero-teaching.jpg", alt: "Обучение студентов VIP tattoo school" },
  { imgUrl: "assets/hero-guided-practice.jpg", alt: "Практика ученицы под руководством наставника" },
  { imgUrl: "assets/hero-founder-portrait.jpg", alt: "Виктория — основательница VIP tattoo school" },
  { imgUrl: "assets/hero-student-portrait.jpg", alt: "Ученица VIP tattoo school с тату-машинкой" },
  { imgUrl: "assets/hero-practice.jpg", alt: "Практическое занятие в VIP tattoo school" },
  { imgUrl: "assets/hero-client-practice.jpg", alt: "Практическая работа ученицы с моделью" },
  { imgUrl: "assets/hero-graduation.jpg", alt: "Выпускники VIP tattoo school" },
  { imgUrl: "assets/hero-process-moments.jpg", alt: "Рабочий процесс тату-мастера с клиентом" },
];

const mountNode = document.querySelector<HTMLElement>("[data-hero-carousel]");

if (mountNode) {
  mountNode.removeAttribute("data-hero-carousel");
  mountNode.setAttribute("data-card-fan-carousel", "true");
  mountNode.setAttribute("aria-label", "Фотогалерея Виктории и обучения в VIP tattoo school");
  createRoot(mountNode).render(<SocialCards cards={cards} />);
}
