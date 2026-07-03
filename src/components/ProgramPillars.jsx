import { programPillars } from '../data'

export default function ProgramPillars() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>З чого складається навчання МСММ</h2>
        </div>

        <div className="pillars-stack">
          {programPillars.map((p) => (
            <div
              key={p.n}
              className={`pillar-card pillar-tone-${p.tone}`}
            >
              <div className="pillar-top">
                <div className="pillar-num">{p.n}</div>
                <div className="pillar-body">
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                  <div className="pillar-tags">
                    {p.tags.map((t) => (
                      <span className="tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="program-cta">
          <a href="#pricing" className="link-arrow">
            Переглянути усю програму →
          </a>
        </div>
      </div>
    </section>
  )
}
