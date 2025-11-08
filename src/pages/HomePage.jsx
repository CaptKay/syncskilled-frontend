import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="grid gap-10">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-copy">
            <span className="section-title">Skill exchange reinvented</span>
            <h1 className="heading-xl">
              Swap knowledge with a community that loves to teach as much as it loves to learn.
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              SyncSkilled connects curious minds and seasoned mentors. Discover peers ready to trade
              skills, earn exchange credits, and craft learning journeys that feel personal, vibrant,
              and fun.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn-primary">
                Get started
              </Link>
              <Link to="/posts" className="btn-muted">
                Explore posts
              </Link>
            </div>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">8k+</div>
                <div className="stat-label">Skill matches</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">120</div>
                <div className="stat-label">Active categories</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">98%</div>
                <div className="stat-label">Happy learners</div>
              </div>
            </div>
          </div>

          <div className="section-card">
            <div className="grid gap-4">
              <div>
                <span className="pill">Featured flow</span>
                <h2 className="heading text-lg mt-2">Design x Frontend pairing</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pair up with creatives leveling up their product design while trading modern frontend
                  techniques. Weekly live sessions, async feedback, and curated resources included.
                </p>
              </div>
              <div className="divider" />
              <div className="grid gap-3">
                <div className="surface-soft p-4 rounded-2xl">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-500">This week</div>
                  <div className="mt-2 text-base font-semibold text-slate-900">
                    24 new offers posted
                  </div>
                </div>
                <div className="surface-soft p-4 rounded-2xl">
                  <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Next up</div>
                  <div className="mt-2 text-base font-semibold text-slate-900">
                    Product strategy x Data storytelling
                  </div>
                </div>
              </div>
              <Link to="/posts" className="btn-outline justify-self-start">
                Browse community stories
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6">
        <div className="grid gap-2">
          <span className="section-title">Why SyncSkilled</span>
          <h2 className="heading text-3xl font-bold">Designed for modern learners</h2>
          <p className="text-base text-slate-600 leading-relaxed max-w-3xl">
            From onboarding to scheduling exchanges, every touchpoint feels polished and effortless.
            Curate your skill stack, track your progress, and connect with collaborators who are as
            invested in your growth as you are.
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-icon" aria-hidden>⚡️</span>
            <h3 className="feature-title">Guided matching</h3>
            <p className="feature-copy">
              Smart suggestions help you quickly pair with people teaching the exact skill you want to
              learn—no endless browsing required.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-icon" aria-hidden>🎯</span>
            <h3 className="feature-title">Goals that stick</h3>
            <p className="feature-copy">
              Personalized milestones and check-ins keep your exchanges on track and outcomes easy to
              celebrate.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-icon" aria-hidden>🤝</span>
            <h3 className="feature-title">Community built trust</h3>
            <p className="feature-copy">
              Reviews, streaks, and kudos make it simple to find committed collaborators and build
              long-term learning circles.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
