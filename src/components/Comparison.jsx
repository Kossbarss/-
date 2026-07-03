import { comparisonOurs, comparisonOthers, guarantee } from '../data'

export default function Comparison() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Чому саме МСММ</span>
          <h2 style={{ marginTop: 16 }}>Чим ми відрізняємось від типового курсу коучингу</h2>
        </div>

        <div className="comparison-grid">
          <div className="card comparison-col comparison-good">
            <h4>Навчання за програмою МСММ</h4>
            <ul>
              {comparisonOurs.map((c) => (
                <li key={c}>
                  <span className="check-icon">✓</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card comparison-col comparison-bad">
            <h4>Типовий курс коучингу</h4>
            <ul>
              {comparisonOthers.map((c) => (
                <li key={c}>
                  <span className="minus-icon">–</span>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card guarantee-box">
          <div className="guarantee-icon">🛡</div>
          <div>
            <h4>{guarantee.title}</h4>
            <p>{guarantee.text}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
