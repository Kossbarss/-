import { createRoot } from "react-dom/client";
import { NumberTicker } from "@/components/ui/be-ui-number-animation";

// Both mount points only exist on the RU page for now (the UA hero
// stats still show their original static "300+"/"11+" -- no UA copy
// was provided for the "22+" wording change, so the animated counter
// wiring for it was left RU-only too, per the same rule). The
// `if (mountNode)` guards below make this a no-op on the UA page
// rather than an error.
// startDelay holds on the "from" number long enough to actually read
// it (125+ / 12+) before the roll starts; duration/stagger are slow
// and staggered enough that the roll itself is easy to follow. blur is
// deliberately left off here -- it's a separate mount-triggered fade
// that isn't tied to the position hold, so with it on the held "from"
// number was still visibly hazy through part of the hold window,
// working against the "clearly visible" requirement.
const graduatesMount = document.getElementById("heroStatGraduatesNumber");
if (graduatesMount) {
  createRoot(graduatesMount).render(
    <NumberTicker value={300} from={125} startDelay={1400} suffix="+" duration={2.2} stagger={0.15} />
  );
}

const countriesMount = document.getElementById("heroStatCountriesNumber");
if (countriesMount) {
  createRoot(countriesMount).render(
    <NumberTicker value={22} from={12} startDelay={1400} suffix="+" duration={2.2} stagger={0.15} />
  );
}
