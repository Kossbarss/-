import { useState } from "react";
import { createRoot } from "react-dom/client";
import { TiltCard } from "@/components/ui/be-ui-tilt-card";
import { ShatterButton } from "@/components/ui/shatter-button";

const isUkrainian =
  document.documentElement.lang.toLowerCase().startsWith("uk") ||
  /\/ua(?:\/|$)/.test(window.location.pathname);

// Asset nesting depth is independent of language -- UA is now the root
// page and RU lives under /ru/, so this has to key off the URL's actual
// nesting, not which language is being displayed.
const assetPrefix = /\/ru(?:\/|$)/.test(window.location.pathname) ? "../assets/" : "assets/";
const certificateFilename = "certificate-vip-tattoo-school.jpg";

const alt = isUkrainian
  ? "Сертифікат про закінчення курсу VIP tattoo school"
  : "Сертификат об окончании курса VIP tattoo school";

const pressLabel = isUkrainian ? "НАТИСНИ" : "НАЖМИ";

// Same warm gradient as .btn-stardust (the site's main CTA button),
// kept semi-transparent so it reads as a hint layered on the
// certificate rather than a solid button of its own.
const HINT_GRADIENT =
  "linear-gradient(105deg, rgba(249,134,88,0.6) 0%, rgba(242,88,50,0.6) 24%, rgba(230,33,21,0.6) 52%, rgba(242,88,50,0.6) 78%, rgba(249,134,88,0.6) 100%)";
const HINT_ACCENT = "#E62115";

// The tilt itself reacts to mouse hover (desktop) or a finger drag
// (touch, see be-ui-tilt-card's onTouchMove) -- neither is obvious just
// from looking at a static certificate image, so this button is a
// discoverability hint layered on top, not a real "activation" step.
// On desktop, moving the mouse to click it already triggers the hover
// tilt. On touch devices there's no hover at all, so pressing it also
// bumps demoTrigger to play a short automatic tilt sweep as a preview.
// It shatters away on press, then comes back 10s later in case the
// visitor didn't notice the first time -- a `key` bump forces a clean
// remount so ShatterButton's own shattered/shards state resets too.
function CertificateWithHint() {
  const [demoTrigger, setDemoTrigger] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);
  const [hintKey, setHintKey] = useState(0);

  return (
    <div className="relative">
      <TiltCard
        className="w-full border border-border bg-card"
        demoTrigger={demoTrigger}
      >
        <img
          src={`${assetPrefix}${certificateFilename}`}
          alt={alt}
          className="block w-full h-auto"
        />
      </TiltCard>

      {hintVisible && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto">
            <ShatterButton
              key={hintKey}
              shatterColor={HINT_ACCENT}
              shardCount={16}
              style={{
                background: HINT_GRADIENT,
                border: "1px solid rgba(230,33,21,0.6)",
                color: "#fff",
                boxShadow: "0 0 16px rgba(230,33,21,0.35)",
                padding: "9px 14px",
                fontSize: "10px",
                letterSpacing: "0.03em",
              }}
              onClick={() => {
                setDemoTrigger((n) => n + 1);
                setTimeout(() => {
                  setHintVisible(false);
                  setTimeout(() => {
                    setHintKey((k) => k + 1);
                    setHintVisible(true);
                  }, 10000);
                }, 250);
              }}
            >
              {pressLabel}
            </ShatterButton>
          </div>
        </div>
      )}
    </div>
  );
}

const mountNode = document.getElementById("certificateTilt");
if (mountNode) {
  createRoot(mountNode).render(<CertificateWithHint />);
}
