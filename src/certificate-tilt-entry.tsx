import { createRoot } from "react-dom/client";
import { TiltCard } from "@/components/ui/be-ui-tilt-card";

const isUkrainian =
  document.documentElement.lang.toLowerCase().startsWith("uk") ||
  /\/ua(?:\/|$)/.test(window.location.pathname);

const assetPrefix = isUkrainian ? "../assets/" : "assets/";
const certificateFilename = "certificate-vip-tattoo-school.jpg";

const alt = isUkrainian
  ? "Сертифікат про закінчення курсу VIP tattoo school"
  : "Сертификат об окончании курса VIP tattoo school";

const mountNode = document.getElementById("certificateTilt");
if (mountNode) {
  createRoot(mountNode).render(
    <TiltCard className="w-full border border-border bg-card">
      <img
        src={`${assetPrefix}${certificateFilename}`}
        alt={alt}
        className="block w-full h-auto"
      />
    </TiltCard>
  );
}
