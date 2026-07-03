export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <a href="#top" className="logo">
          <span className="logo-mark">
            <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 5h12l-6 5-6-5Zm0 10 6-5 6 5"
                stroke="#e3d2ae"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          МСММ
        </a>
        <small>© Copyright 2026 by MINDMASTER MCMM. Усі права захищені</small>
        <a href="#" style={{ fontSize: '0.82rem' }}>
          Політика конфіденційності
        </a>
      </div>
    </footer>
  )
}
