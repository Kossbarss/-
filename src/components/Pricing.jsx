import {
  mainProgram,
  additionalModules,
  packageIncludes,
  packages,
} from '../data'

export default function Pricing() {
  return (
    <section id="pricing" className="section">
      <div className="container">
        <div className="section-head">
          <h2>Тарифи</h2>
          <p>
            Повноцінна підготовка коуча з практикою, сертифікацією та
            менторським супроводом
          </p>
        </div>

        <div className="pricing-top">
          <div className="card pricing-meta-card">
            <div className="label">Тривалість</div>
            <div className="value">11 місяців</div>
          </div>
          <div className="card pricing-meta-card">
            <div className="label">Кількість годин</div>
            <div className="value">350+ годин підготовки</div>
          </div>
          <div className="card pricing-meta-card">
            <div className="label">Формат навчання</div>
            <div className="value" style={{ fontSize: '1rem' }}>
              Жива робота з викладачами і супервізорами: online лекції з
              практикою
            </div>
          </div>
        </div>

        <div className="pricing-columns">
          <div>
            <h4>Основна програма</h4>
            <ul>
              {mainProgram.map((m) => (
                <li key={m}>
                  <span className="arrow">↳</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--ink-500)' }}>Додаткові модулі</h4>
            <ul>
              {additionalModules.map((m) => (
                <li key={m} style={{ color: 'var(--ink-500)' }}>
                  <span className="arrow">↳</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--ink-500)',
            marginBottom: 32,
          }}
        >
          ⓘ Усі години вказані у стандартних годинах, не академічних.
        </p>

        <div className="card includes-box">
          <h4>Що входить у пакет</h4>
          <ul className="includes-grid">
            {packageIncludes.map((i) => (
              <li key={i}>
                <span className="arrow">↳</span>
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="packages-grid">
          {packages.map((p, i) => (
            <div
              className={`card package-card ${i === 1 ? 'highlight' : ''}`}
              key={p.title}
            >
              <h4>{p.title}</h4>
              <p>{p.text}</p>
            </div>
          ))}
        </div>

        <div className="pricing-actions">
          <a href="#" className="btn btn-primary">
            Записатись на III потік
          </a>
          <a href="#" className="btn btn-outline">
            Зв’язатись з менеджером
          </a>
        </div>
      </div>
    </section>
  )
}
