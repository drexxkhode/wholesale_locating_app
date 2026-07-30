export default function Pagination({ page, totalPages, onChange }) {
  const pages = [];
  const maxShown = 5;
  let start = Math.max(1, page - Math.floor(maxShown / 2));
  let end = Math.min(totalPages, start + maxShown - 1);
  start = Math.max(1, end - maxShown + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  const btn = (children, target, disabled = false, active = false) => (
    <button
      key={`${children}-${target}`}
      disabled={disabled}
      onClick={() => onChange(target)}
      className="btn btn-sm rounded-2"
      style={
        active
          ? { background: "var(--color-primary)", color: "#fff", border: "1px solid var(--color-primary)" }
          : { background: "#fff", border: "1px solid var(--color-border)", color: disabled ? "#c3cac5" : "var(--color-text)" }
      }
    >
      {children}
    </button>
  );

  return (
    <div className="d-flex align-items-center gap-1 flex-wrap">
      {btn(<i className="bi bi-chevron-left" />, page - 1, page === 1)}
      {start > 1 && <span className="px-1 text-muted-brand">…</span>}
      {pages.map((p) => btn(p, p, false, p === page))}
      {end < totalPages && <span className="px-1 text-muted-brand">…</span>}
      {btn(<i className="bi bi-chevron-right" />, page + 1, page === totalPages)}
    </div>
  );
}
