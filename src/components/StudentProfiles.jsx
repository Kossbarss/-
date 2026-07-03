import { studentProfiles } from '../data'

export default function StudentProfiles() {
  return (
    <section className="section profiles-section">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Хто ми шукаємо</span>
          <h2 style={{ marginTop: 16 }}>Приймаємо у якості студентів</h2>
        </div>

        <div className="profiles-grid">
          {studentProfiles.map((p) => (
            <div className="profile-card" key={p.n}>
              <div className="reason-num">{p.n}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 36 }}>
          <a href="#pricing" className="btn btn-gold">
            Приєднатись
          </a>
        </div>
      </div>
    </section>
  )
}
