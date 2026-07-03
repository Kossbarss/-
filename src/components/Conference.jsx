import { conferencePerks } from '../data'

export default function Conference() {
  return (
    <section className="section conference-section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow" style={{ color: 'var(--periwinkle)', borderColor: 'var(--periwinkle)' }}>
            Фінал потоку
          </span>
          <h2 style={{ marginTop: 16, color: 'var(--cream-50)' }}>Конференція</h2>
        </div>

        <div className="conference-layout">
          <div>
            <div className="conference-stat">500+ глядачів</div>
            <p style={{ color: 'rgba(250,246,239,0.7)', marginBottom: 20 }}>Ваші можливості:</p>
            <div className="perk-list">
              {conferencePerks.map((p) => (
                <div className="perk-item" key={p}>
                  <span className="arrow">↳</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="conference-visual">
            Підготовка з топ-тренером: на модулі з ораторської майстерності
            заявите про себе у соцмережах
          </div>
        </div>
      </div>
    </section>
  )
}
