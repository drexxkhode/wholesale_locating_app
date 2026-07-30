import { useRef, useState } from "react";

export default function ImageCarousel({ images, height = 260, rounded = "0" }) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef(null);

  const go = (dir) => {
    setIndex((prev) => (prev + dir + images.length) % images.length);
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) go(delta > 0 ? -1 : 1);
    touchStartX.current = null;
  };

  if (!images || images.length === 0) return null;

  return (
    <div
      className="position-relative overflow-hidden"
      style={{ height, borderRadius: rounded }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div
        className="d-flex h-100"
        style={{
          width: `${images.length * 100}%`,
          transform: `translateX(-${index * (100 / images.length)}%)`,
          transition: "transform 0.3s ease",
        }}
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Photo ${i + 1}`}
            loading={i === 0 ? "eager" : "lazy"}
            className="h-100 object-fit-cover flex-shrink-0"
            style={{ width: `${100 / images.length}%` }}
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="btn btn-sm position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle d-flex align-items-center justify-content-center border-0"
            style={{ width: 34, height: 34, background: "rgba(24,36,32,0.55)", color: "#fff" }}
          >
            <i className="bi bi-chevron-left" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next photo"
            className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle d-flex align-items-center justify-content-center border-0"
            style={{ width: 34, height: 34, background: "rgba(24,36,32,0.55)", color: "#fff" }}
          >
            <i className="bi bi-chevron-right" />
          </button>

          <div className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-1 mb-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to photo ${i + 1}`}
                className="border-0 p-0 rounded-pill"
                style={{
                  width: i === index ? 16 : 6,
                  height: 6,
                  background: i === index ? "#fff" : "rgba(255,255,255,0.6)",
                  transition: "width 0.2s ease",
                }}
              />
            ))}
          </div>

          <span
            className="position-absolute top-0 end-0 m-2 px-2 py-1 rounded-pill text-white"
            style={{ background: "rgba(24,36,32,0.55)", fontSize: "0.72rem" }}
          >
            {index + 1}/{images.length}
          </span>
        </>
      )}
    </div>
  );
}
