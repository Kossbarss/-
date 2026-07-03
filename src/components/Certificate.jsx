import { certificateChecklist } from '../data'

export default function Certificate() {
  return (
    <section className="section certificate-section">
      <div className="container">
        <div className="certificate-layout">
          <div>
            <div className="section-head" style={{ marginBottom: 28 }}>
              <h2>Сертифікат МСММ</h2>
              <p>
                Mentor-Coach MindMaster — перша асоціація з Growth Mindset
                тренерів в Україні.
              </p>
            </div>

            <div className="certificate-checklist">
              {certificateChecklist.map((c) => (
                <div className="check-row" key={c}>
                  <span className="arrow">↳</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>

            <a href="#pricing" className="btn btn-gold">
              Хочу отримати сертифікат
            </a>
          </div>

          <div className="certificate-badge">
            <div className="inner">
              <h3>МСММ</h3>
              <p>Mentor-Coach MindMaster · ISO · 2026</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
