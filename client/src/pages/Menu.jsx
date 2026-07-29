import { Link } from "react-router-dom";

const items = [
  { icon: "bi-heart", label: "My Favorites", to: "/favorites" },
  { icon: "bi-clock-history", label: "Recent Searches", to: "/companies" },
  { icon: "bi-geo", label: "Nearby Companies", to: "/map" },
  { icon: "bi-share", label: "Share App", to: "#" },
  { icon: "bi-info-circle", label: "About Us", to: "/about" },
  { icon: "bi-question-circle", label: "Help & Support", to: "/contact" },
  { icon: "bi-gear", label: "Settings", to: "#" },
];

export default function Menu() {
  return (
    <div className="d-lg-none">
      <div
        className="text-white p-4"
        style={{ background: "linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))" }}
      >
        <div className="d-flex align-items-center gap-3 mb-3">
          <span
            className="icon-circle bg-white"
            style={{ width: 56, height: 56, color: "var(--color-primary)" }}
          >
            <i className="bi bi-person-fill fs-3" />
          </span>
          <div>
            <p className="fw-bold mb-0 fs-5">Hello, Guest</p>
            <p className="mb-0" style={{ fontSize: "0.85rem", opacity: 0.9 }}>
              Explore wholesale companies around you.
            </p>
          </div>
        </div>
        <button className="btn btn-light fw-semibold w-100 rounded-3" style={{ color: "var(--color-primary)" }}>
          Login / Register
        </button>
      </div>

      <div className="d-flex flex-column">
        {items.map((it) => (
          <Link
            key={it.label}
            to={it.to}
            className="d-flex align-items-center justify-content-between text-decoration-none text-dark px-4 py-3 border-bottom"
          >
            <span className="d-flex align-items-center gap-3">
              <i className={`bi ${it.icon} fs-5 text-muted-brand`} />
              <span style={{ fontSize: "0.95rem" }}>{it.label}</span>
            </span>
            <i className="bi bi-chevron-right text-muted-brand" />
          </Link>
        ))}
      </div>
    </div>
  );
}
