import { createRoot } from "react-dom/client";
import { NumberTicker } from "@/components/ui/be-ui-number-animation";

// Both mount points only exist on the RU page for now (the UA hero
// stats still show their original static "300+"/"11+" -- no UA copy
// was provided for the "22+" wording change, so the animated counter
// wiring for it was left RU-only too, per the same rule). The
// `if (mountNode)` guards below make this a no-op on the UA page
// rather than an error.
const graduatesMount = document.getElementById("heroStatGraduatesNumber");
if (graduatesMount) {
  createRoot(graduatesMount).render(
    <NumberTicker value={300} from={125} suffix="+" duration={1.1} stagger={0.08} blur />
  );
}

const countriesMount = document.getElementById("heroStatCountriesNumber");
if (countriesMount) {
  createRoot(countriesMount).render(
    <NumberTicker value={22} from={12} suffix="+" duration={1.1} stagger={0.08} blur />
  );
}
