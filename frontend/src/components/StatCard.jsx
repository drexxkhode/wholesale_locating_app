export default function StatCard({ icon, label, value, delta, color = "var(--color-primary)", bg = "var(--color-primary-light)" }) {
  return (
    <div className="stat-card flex-fill">
      <span className="icon-circle" style={{ width: 46, height: 46, background: bg, color }}>
        <i className={`bi ${icon} fs-5`} />
      </span>
      <div>
        <div className="fw-bold" style={{ fontSize: "1.35rem" }}>{value}</div>
        <div className="text-muted-brand" style={{ fontSize: "0.82rem" }}>{label}</div>
        {delta && <div className="fw-semibold" style={{ fontSize: "0.72rem", color: "var(--color-primary)" }}>{delta}</div>}
      </div>
    </div>
  );
}
