import { formatStats, schedule, facultatives, scheduleMonths } from '../data'

const requirements = [
  {
    value: '100+',
    label: 'годин супервізії',
    caption:
      'Супервізія — як коучинг для коучів. Професійний супровід, що допомагає вдосконалювати навички та отримувати практичний досвід у безпечному середовищі. Проводить сертифікований супервізор, необхідно відвідати мінімум 60 годин супервізій за навчання.',
  },
  {
    value: '10',
    label: 'годин особистої терапії',
    caption:
      'Вимога для отримання фінального сертифіката є здобуття досвіду особистої терапії у сертифікованого спеціаліста обсягом 10 годин (у вільний час). Сплачується окремо.',
  },
]

export default function FormatSchedule() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Вимоги програми</span>
        </div>

        <div className="format-grid" style={{ marginBottom: 56 }}>
          {requirements.map((r) => (
            <div className="card format-stat" key={r.label} style={{ gridColumn: 'span 1' }}>
              <div className="value">{r.value}</div>
              <div className="caption" style={{ fontWeight: 600, color: 'var(--ink-900)' }}>
                {r.label}
              </div>
              <p className="caption" style={{ marginTop: 12 }}>
                {r.caption}
              </p>
            </div>
          ))}
        </div>

        <div className="section-head">
          <h2>Як проходить навчання</h2>
        </div>

        <div className="format-grid">
          {formatStats.map((f) => (
            <div className="card format-stat" key={f.caption}>
              <div className="value">
                {f.value} <small>{f.label}</small>
              </div>
              <div className="caption">{f.caption}</div>
            </div>
          ))}
        </div>

        <div className="schedule-layout">
          <div className="schedule-cards">
            <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', marginBottom: 4 }}>
              Розклад
            </h3>
            {schedule.map((s) => (
              <div className="card schedule-card" key={s.label}>
                <div className="label">{s.label}</div>
                <div className="time">{s.time}</div>
                <div className="note">{s.note}</div>
              </div>
            ))}
          </div>

          <div className="card facultative-table">
            <table>
              <thead>
                <tr>
                  <th>Факультатив</th>
                  {scheduleMonths.map((m) => (
                    <th key={m}>{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {facultatives.map((f, fi) => (
                  <tr key={f}>
                    <td>{f}</td>
                    {scheduleMonths.map((m, mi) => (
                      <td key={m}>
                        {m.includes('канікули') ? (
                          <span
                            className="dot-cell"
                            style={{ background: 'var(--maroon-700)' }}
                          />
                        ) : (
                          (fi + mi) % 2 === 0 && <span className="dot-cell" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
