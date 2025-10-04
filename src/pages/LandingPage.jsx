import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="page">
      <header className="container">
        {/* Top bar */}
        {/* <nav className="navbar">
          <div className="navbar-inner">
            <div className="brand">SyncSkilled</div>
            <div className="nav-links">
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="btn-primary">Get Started</Link>
            </div>
          </div>
        </nav> */}

        {/* Hero */}
        <section className="grid gap-6 md:grid-cols-2 items-center">
          <div className="card">
            <div className="card-content">
              <h1 className="heading-xl">Learn faster. Teach smarter. Build together.</h1>
              <p className="subtle">
                Trade skills with real people. Earn credits by teaching, spend them to learn.
                No gatekeepers—just a trusted community helping each other grow.
              </p>
              <div className="flex gap-3 mt-2">
                <Link to="/register" className="btn-primary">Create free account</Link>
                <Link to="/login" className="btn-outline">I already have an account</Link>
              </div>
              <div className="pill mt-2">100% community-powered</div>
            </div>
          </div>

          {/* Hero art */}
          <div className="card-soft">
            <div className="card-content">
              <div className="rounded-2xl w-full aspect-video border bg-white/80 grid place-items-center">
                <div className="text-center">
                  <div className="text-5xl font-extrabold mb-2">🔄</div>
                  <div className="heading">Exchange skills, not invoices</div>
                  <div className="subtle">Bright, friendly, and fast.</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="badge">Languages</div>
                <div className="badge">Programming</div>
                <div className="badge">Music</div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="card">
            <div className="card-header"><h3 className="card-title">1. Create your profile</h3></div>
            <div className="card-content subtle">
              Add what you can teach and what you want to learn. Set your credit rates.
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="card-title">2. Match & exchange</h3></div>
            <div className="card-content subtle">
              Find people by category and skill. Message, schedule, and swap sessions.
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="card-title">3. Grow your credits</h3></div>
            <div className="card-content subtle">
              Teach to earn, spend to learn—keep the cycle going and level up together.
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="card">
          <div className="card-header">
            <h3 className="card-title">Why SyncSkilled?</h3>
          </div>
          <div className="card-content">
            <ul className="list">
              <li className="row">
                <div className="row-left">
                  <div className="avatar">⚡</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Credit-based economy</div>
                    <div className="subtle">No money needed—just value for value.</div>
                  </div>
                </div>
              </li>
              <li className="row">
                <div className="row-left">
                  <div className="avatar">🧭</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Browse by categories</div>
                    <div className="subtle">Languages, Programming, Music, Fitness, and more.</div>
                  </div>
                </div>
              </li>
              <li className="row">
                <div className="row-left">
                  <div className="avatar">🔒</div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Privacy-first auth</div>
                    <div className="subtle">Secure cookies, short-lived tokens, clean logouts.</div>
                  </div>
                </div>
              </li>
            </ul>
            <div className="mt-2">
              <Link to="/register" className="btn-primary">Start free</Link>
              <Link to="/login" className="btn-ghost ml-2">Sign in</Link>
            </div>
          </div>
        </section>

        {/* Social proof / testimonials */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="card-soft">
            <div className="card-content">
              <div className="heading">“I traded Spanish for React.”</div>
              <div className="subtle">— Ada, Community Member</div>
            </div>
          </div>
          <div className="card-soft">
            <div className="card-content">
              <div className="heading">“I learned guitar by teaching yoga.”</div>
              <div className="subtle">— Jules, Maker</div>
            </div>
          </div>
          <div className="card-soft">
            <div className="card-content">
              <div className="heading">“No fees. Just real connections.”</div>
              <div className="subtle">— Noor, Engineer</div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="card">
          <div className="card-content text-center">
            <div className="heading-xl mb-2">Ready to join?</div>
            <p className="subtle">Your skill can be someone’s turning point—and theirs can be yours.</p>
            <div className="flex gap-3 justify-center mt-3">
              <Link to="/register" className="btn-primary">Create account</Link>
              <Link to="/login" className="btn-outline">Sign in</Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="subtle text-center mb-6">
          © {new Date().getFullYear()} SyncSkilled — Learn faster. Teach smarter. Build together.
        </footer>
      </header>
    </div>
  );
}
