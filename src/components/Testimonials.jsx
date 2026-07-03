import { testimonials } from '../data'

export default function Testimonials() {
  return (
    <section className="section" style={{ background: 'var(--cream-50)' }}>
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Соціальний доказ</span>
          <h2 style={{ marginTop: 16 }}>Відгуки студентів</h2>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((t) => (
            <div className="card testimonial-card" key={t.name}>
              <div className="quote-mark">“</div>
              <p className="text">{t.text}</p>
              <div className="who">{t.name}</div>
              <div className="role">{t.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
