import { useEffect, useState } from "react";

// Set this to whenever maintenance is expected to end.
const TARGET_TIME = Date.now() + 4 * 60 * 60 * 1000 + 32 * 60 * 1000;

function useCountdown(target) {
  const [remaining, setRemaining] = useState(Math.max(0, target - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(Math.max(0, target - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (n) => String(n).padStart(2, "0");

const features = [
  { icon: "bi-gear-fill", title: "System Upgrade", desc: "We are updating the system to serve you better." },
  { icon: "bi-shield-check", title: "Enhancing Security", desc: "Improving security to keep your data safe." },
  { icon: "bi-graph-up-arrow", title: "Better Performance", desc: "Optimizing speed and reliability." },
];

export default function MaintenancePage() {
  const { days, hours, minutes, seconds } = useCountdown(TARGET_TIME);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const onNotify = (e) => {
    e.preventDefault();
    if (!email) return;
    // Wire this to your API, e.g. api.post("/maintenance/notify", { email })
    setSubmitted(true);
  };

  return (
    <div className="maint-page">
      <div className="maint-body">
        <div className="container-xl py-5">
          <div className="row align-items-center g-5">
            {/* Left column */}
            <div className="col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-5">
                <span className="maint-logo">
                  <i className="bi bi-geo-alt-fill" />
                </span>
                <div className="d-flex flex-column lh-1">
                  <span className="fw-bold" style={{ fontSize: "1rem", letterSpacing: "0.02em" }}>NORTH INDUSTRIAL AREA</span>
                  <span className="fw-semibold" style={{ fontSize: "0.8rem", color: "var(--color-primary)" }}>WHOLESALE LOCATOR</span>
                </div>
              </div>

              <h1 className="maint-title mb-3">
                WE&apos;LL BE<br />
                <span style={{ color: "var(--color-primary)" }}>RIGHT BACK!</span>
              </h1>
              <div className="maint-title-rule mb-4" />

              <p className="text-muted-brand mb-4" style={{ fontSize: "1rem", maxWidth: 460 }}>
                Our system is currently under maintenance to improve performance and enhance your
                experience. We apologize for the inconvenience.
              </p>

              <div className="row g-3 mb-4">
                {features.map((f) => (
                  <div className="col-4" key={f.title}>
                    <div className="maint-feature-card">
                      <span className="maint-feature-icon">
                        <i className={`bi ${f.icon}`} />
                      </span>
                      <p className="fw-semibold mb-1" style={{ fontSize: "0.82rem" }}>{f.title}</p>
                      <p className="text-muted-brand mb-0" style={{ fontSize: "0.74rem", lineHeight: 1.4 }}>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="maint-countdown mb-4">
                <span className="maint-countdown-icon">
                  <i className="bi bi-clock-history" />
                </span>
                <span className="fw-semibold flex-shrink-0" style={{ fontSize: "0.88rem", maxWidth: 110 }}>
                  Estimated time to be back
                </span>
                <div className="d-flex align-items-center gap-2 ms-auto flex-wrap">
                  {[
                    ["DAYS", days],
                    ["HOURS", hours],
                    ["MINUTES", minutes],
                    ["SECONDS", seconds],
                  ].map(([label, value], i) => (
                    <span key={label} className="d-flex align-items-center gap-2">
                      {i > 0 && <span className="text-muted-brand fw-bold">:</span>}
                      <span className="d-flex flex-column align-items-center">
                        <span className="maint-countdown-value">{pad(value)}</span>
                        <span className="maint-countdown-label">{label}</span>
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <form onSubmit={onNotify} className="d-flex align-items-center gap-3 flex-wrap">
                <span className="maint-bell">
                  <i className="bi bi-bell-fill" />
                </span>
                <span className="fw-semibold flex-shrink-0" style={{ fontSize: "0.9rem" }}>Get notified when we&apos;re back online</span>
                <div className="d-flex gap-2 flex-fill" style={{ minWidth: 260 }}>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button type="submit" className="btn btn-brand rounded-3 px-4 d-flex align-items-center gap-2 flex-shrink-0">
                    {submitted ? <i className="bi bi-check-lg" /> : <i className="bi bi-send-fill" />}
                    {submitted ? "Sent" : "Notify Me"}
                  </button>
                </div>
              </form>
            </div>

            {/* Right column — illustrated panel */}
            <div className="col-lg-6">
              <div className="maint-illustration">
                <div className="maint-skyline">
                  <i className="bi bi-building" />
                  <i className="bi bi-building-fill-gear" />
                  <i className="bi bi-house-door-fill" />
                </div>

                <div className="maint-monitor">
                  <div className="maint-monitor-screen">
                    <div className="maint-gears">
                      <i className="bi bi-gear-fill maint-gear-big" />
                      <i className="bi bi-gear-fill maint-gear-small" />
                    </div>
                    <div className="maint-progress">
                      <div className="maint-progress-bar" />
                    </div>
                    <p className="fw-bold text-center mb-0 mt-2" style={{ fontSize: "0.78rem", letterSpacing: "0.04em" }}>
                      MAINTENANCE IN PROGRESS...
                    </p>
                  </div>
                  <div className="maint-monitor-stand" />
                </div>

                <i className="bi bi-cone-striped maint-cone" />

                <div className="maint-sign">
                  <div className="maint-sign-board">
                    <span>UNDER</span>
                    <span>MAINTENANCE</span>
                    <i className="bi bi-tools" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="maint-footer">
        <div className="container-xl py-4">
          <div className="row g-4 text-center text-md-start">
            <div className="col-md-4 d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
              <span className="maint-footer-icon"><i className="bi bi-geo-alt-fill" /></span>
              <div>
                <p className="fw-semibold mb-0">Thank you for your patience</p>
                <p className="mb-0 opacity-75" style={{ fontSize: "0.85rem" }}>We are working hard to serve you better.</p>
              </div>
            </div>
            <div className="col-md-4 d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
              <span className="maint-footer-icon"><i className="bi bi-telephone-fill" /></span>
              <div>
                <p className="fw-semibold mb-0">055 123 4567</p>
                <p className="mb-0 opacity-75" style={{ fontSize: "0.85rem" }}>Mon - Fri, 8:00 AM - 5:00 PM</p>
              </div>
            </div>
            <div className="col-md-4 d-flex align-items-center gap-3 justify-content-center justify-content-md-start">
              <span className="maint-footer-icon"><i className="bi bi-envelope-fill" /></span>
              <div>
                <p className="fw-semibold mb-0">info@nialocator.com</p>
                <p className="mb-0 opacity-75" style={{ fontSize: "0.85rem" }}>We&apos;ll respond as soon as possible</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}