export default function RatingStars({ rating, reviews, size = "0.85rem" }) {
  return (
    <span className="d-inline-flex align-items-center gap-1" style={{ fontSize: size }}>
      <i className="bi bi-star-fill" style={{ color: "#f5a623" }} />
      <span className="fw-semibold">{rating.toFixed(1)}</span>
      {typeof reviews === "number" && (
        <span className="text-muted-brand">({reviews} Reviews)</span>
      )}
    </span>
  );
}
