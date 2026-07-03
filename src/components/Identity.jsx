import { identityCards, businessOwnerBenefits } from '../data'

export default function Identity() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Після навчання</span>
          <h2 style={{ marginTop: 16 }}>Професійна ідентичність</h2>
        </div>

        <div className="identity-grid">
          {identityCards.map((c) => (
            <div className="card identity-card" key={c.title}>
              <h4>{c.title}</h4>
              <p>{c.text}</p>
            </div>
          ))}
        </div>

        <div className="owner-card">
          <h4>Власник бізнесу, який інтегрує менторство у свою команду</h4>
          <ul>
            {businessOwnerBenefits.map((b) => (
              <li key={b}>
                <span className="arrow">↳</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
