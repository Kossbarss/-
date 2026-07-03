import { teacherGroups } from '../data'

export default function Teachers() {
  return (
    <section className="section" style={{ background: 'var(--cream-50)' }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Наставники</span>
          <h2 style={{ marginTop: 16 }}>Викладачі</h2>
        </div>

        {teacherGroups.map((g) => (
          <div className="teacher-group" key={g.title}>
            <div className="teacher-group-title">{g.title}</div>
            <div className="teacher-grid">
              {g.teachers.map((t) => (
                <div className="card teacher-card" key={t.name}>
                  <div className="teacher-avatar">
                    {t.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')}
                  </div>
                  <h4>{t.name}</h4>
                  <div className="role">{t.role}</div>
                  <span className="social">{t.social}</span>
                  <ul>
                    {t.bio.map((b) => (
                      <li key={b}>
                        <span className="arrow">↳</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
