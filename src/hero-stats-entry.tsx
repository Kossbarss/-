import { createRoot } from "react-dom/client";
import { NumberTicker } from "@/components/ui/be-ui-number-animation";

// Both mount points only exist on the RU page for now (the UA hero
// stats still show their original static "300+"/"11+" -- no UA copy
// was provided for the "22+" wording change, so the animated counter
// wiring for it was left RU-only too, per the same rule). The
// `if (mountNode)` guards below make this a no-op on the UA page
// rather than an error.
// The mount points themselves carry class="word-animate" with the same
// animation-delay:2600ms the plain "300+"/"22+" text had before this
// was converted to a ticker (see index.html), so the number fades in
// as part of the same hero-wide staggered reveal as its neighboring
// words ("выпускников" at 2690ms, etc.) instead of just popping in the
// instant React mounts, well before everything else has even started.
//
// startOnView is turned off (the hero is always above the fold, so
// scroll-triggering just adds a mismatch with the rest of the
// timeline) in favor of a fixed startDelay -- 3400ms is when that
// word-animate fade (2600ms delay + 800ms duration) finishes, so the
// digit roll only starts once the number is already fully visible,
// continuing the reveal rather than fighting it.
const TICKER_START_DELAY = 3400;

const graduatesMount = document.getElementById("heroStatGraduatesNumber");
if (graduatesMount) {
  createRoot(graduatesMount).render(
    <NumberTicker
      value={300}
      from={125}
      startOnView={false}
      startDelay={TICKER_START_DELAY}
      suffix="+"
      duration={2.2}
      stagger={0.15}
    />
  );
}

const countriesMount = document.getElementById("heroStatCountriesNumber");
if (countriesMount) {
  createRoot(countriesMount).render(
    <NumberTicker
      value={22}
      from={12}
      startOnView={false}
      startDelay={TICKER_START_DELAY}
      suffix="+"
      duration={2.2}
      stagger={0.15}
    />
  );
}

// The "22+" inside the hero-lede sentence ("...наши работы ценятся в
// 22+ странах мира.") gets the same ticker treatment. It already had
// its own animation-delay (4670ms) as part of that paragraph's word-
// by-word cascade -- no need to invent a new one, just start the roll
// once that word's own fade finishes (4670 + 800ms duration = 5470).
// digitHeightEm is shrunk from the 1.1 default (see be-ui-number-
// animation.tsx) because at 1.1 the digit boxes were visibly taller
// than the surrounding sentence's line height, making the number
// stick up above the text baseline instead of sitting in line with it.
const ledeCountriesMount = document.getElementById("heroLedeCountriesNumber");
if (ledeCountriesMount) {
  createRoot(ledeCountriesMount).render(
    <NumberTicker
      value={22}
      from={12}
      startOnView={false}
      startDelay={5470}
      suffix="+"
      duration={2.2}
      stagger={0.15}
      digitHeightEm={0.9}
    />
  );
}
