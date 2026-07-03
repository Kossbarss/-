import { audienceReasons } from '../data'

export default function AudienceReasons() {
  return (
    <section id="program" className="section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Mentor-Coach MindMaster</span>
          <h2 style={{ marginTop: 16 }}>Перше навчання за програмою МСММ</h2>
          <p>Для тих, хто хоче:</p>
        </div>

        <div className="reasons-grid">
          {audienceReasons.map((r) => (
            <div className="card reason-card" key={r.n}>
              <div className="reason-num">{r.n}</div>
              <h3>{r.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
