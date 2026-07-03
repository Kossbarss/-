import { stats } from '../data'

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="container hero-inner">
        <div>
          <p className="hero-kicker">Атестаційне навчання з</p>
          <h1>Коучингу та Менторства</h1>
          <div className="hero-badge">
            у напрямках <b>&nbsp;business &amp; life</b>
          </div>
          <p className="hero-lede">
            Яке покаже вам, як працюють зміни зсередини — щоб ви могли
            створювати їх для інших.
          </p>
          <div className="hero-badges-row">
            <div className="badge-chip">ISO</div>
            <div className="badge-chip">МСММ</div>
          </div>
        </div>

        <div className="hero-card">
          <span className="kicker-gold">III потік</span>
          <h3>Початок 09.07.2026</h3>
          <p>Триває передзапис</p>
          <a href="#pricing" className="btn btn-gold">
            Приєднатись
          </a>
        </div>
      </div>

      <div className="ribbon-wrap">
        <div className="ribbon">
          <div className="ribbon-track" aria-hidden="false">
            {[...stats, ...stats].map((s, i) => (
              <span key={i}>
                {s}
                <span className="dot"> ✦ </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
