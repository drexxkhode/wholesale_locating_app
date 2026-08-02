export default function StatusBadge({ status }) {
  const normalized = String(status ?? "").trim().toLowerCase();

  if (["active", "enabled", "approved"].includes(normalized)) {
    return <span className="status-badge status-active">Active</span>;
  }

  if (["inactive", "disabled", "deactivated"].includes(normalized)) {
    return <span className="status-badge status-inactive">Inactive</span>;
  }

  if (["pending", "processing", "review"].includes(normalized)) {
    return <span className="status-badge status-pending">Pending</span>;
  }

  return <span className="status-badge status-pending">{status || "Unknown"}</span>;
}
