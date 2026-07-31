export default function StatusBadge({ status }) {
  const cls = status === "Active" ? "active" : status === "Pending" ? "status-pending" : "status-inactive";
  return <span className={`status-badge ${cls}`}>{status}</span>;
}
