import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MobileHeader from "../components/MobileHeader";
import CompanyMap, { NIA_CENTER } from "../components/CompanyMap";
import { companies } from "../data/companies";
import { categories, getCategory } from "../data/categories";
import { companyImageUrl } from "../utils/image";
import { useFavorites } from "../context/FavoritesContext";

export default function MapPage() {
  const [activeCats, setActiveCats] = useState(categories.map((c) => c.slug));
  const [locationQuery, setLocationQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  const filtered = useMemo(
    () => companies.filter((c) => activeCats.includes(c.category)),
    [activeCats]
  );

  const nearest = useMemo(
    () => [...filtered].sort((a, b) => a.distanceKm - b.distanceKm)[0],
    [filtered]
  );

  // default the sheet to the nearest company; keep selection if user taps a marker
  useEffect(() => {
    if (!selectedId && nearest) setSelectedId(nearest.id);
  }, [nearest, selectedId]);

  const selected = filtered.find((c) => c.id === selectedId) || nearest;
  const selectedCat = selected ? getCategory(selected.category) : null;
  const favorited = selected ? isFavorite(selected.id) : false;

  const toggleCat = (slug) => {
    setActiveCats((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const allChecked = activeCats.length === categories.length;
  const toggleAll = () => setActiveCats(allChecked ? [] : categories.map((c) => c.slug));

  return (
    <>
      <MobileHeader variant="plain" title="Map" />

      {/* ---------- MOBILE ---------- */}
      <div className="d-lg-none position-relative" style={{ height: "calc(100vh - var(--header-h-mobile) - var(--bottomnav-h))", overflow: "hidden" }}>
        <div className="position-absolute w-100 px-3 d-flex gap-2" style={{ top: 12, zIndex: 500 }}>
          <div className="search-shell d-flex align-items-center flex-fill rounded-3 px-3 py-2 shadow-sm">
            <i className="bi bi-search text-muted-brand me-2" />
            <input
              className="border-0 flex-fill bg-transparent"
              style={{ outline: "none", fontSize: "0.9rem" }}
              placeholder="Search in this area"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>
          <button className="btn bg-white rounded-3 shadow-sm px-3 border-0" aria-label="Filters">
            <i className="bi bi-sliders" />
          </button>
        </div>

        <CompanyMap
          companies={filtered}
          height="100%"
          selectedId={selected?.id}
          onSelect={(id) => setSelectedId(id)}
        />

        {selected && (
          <div
            className="position-absolute bottom-0 start-0 w-100 bg-white p-3"
            style={{
              zIndex: 500,
              borderTopLeftRadius: "var(--radius-lg)",
              borderTopRightRadius: "var(--radius-lg)",
              boxShadow: "0 -8px 24px rgba(14,46,28,0.16)",
            }}
          >
            <div className="mx-auto mb-2" style={{ width: 40, height: 4, borderRadius: 999, background: "var(--color-border-strong)" }} />
            <div className="d-flex align-items-center gap-3">
              <img
                src={companyImageUrl(selected, 120, 120)}
                loading="lazy"
                alt={selected.name}
                className="rounded-3"
                style={{ width: 56, height: 56, objectFit: "cover" }}
              />
              <div className="flex-fill min-w-0">
                <div className="fw-semibold text-truncate">{selected.name}</div>
                <div className="d-flex align-items-center gap-1" style={{ fontSize: "0.78rem" }}>
                  <span style={{ color: selectedCat.color }} className="fw-medium">{selectedCat.name}</span>
                  <span className="text-muted-brand">· {selected.distanceKm} km away</span>
                </div>
              </div>
              <button
                className="btn btn-sm border-0 p-0"
                onClick={() => toggleFavorite(selected.id)}
                aria-label="Favorite"
              >
                <i
                  className={`bi ${favorited ? "bi-heart-fill" : "bi-heart"} fs-5`}
                  style={{ color: favorited ? "#e0405a" : "#b7c0b9" }}
                />
              </button>
            </div>
            <Link to={`/companies/${selected.id}`} className="btn btn-brand w-100 mt-3 rounded-3">
              View Details
            </Link>
          </div>
        )}
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="d-none d-lg-flex container-fluid py-4 px-4 gap-4" style={{ maxWidth: 1320, margin: "0 auto" }}>
        <aside style={{ width: 280, flexShrink: 0 }}>
          <h1 className="fw-bold mb-3 font-display" style={{ fontSize: "1.3rem" }}>
            Interactive Map
          </h1>
          <div className="search-shell d-flex align-items-center rounded-3 px-3 py-2 mb-4">
            <i className="bi bi-search text-muted-brand me-2" />
            <input
              className="border-0 flex-fill bg-transparent"
              style={{ outline: "none", fontSize: "0.9rem" }}
              placeholder="Search location..."
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
            />
          </div>

          <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>
            Categories
          </p>
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="all-cats"
              checked={allChecked}
              onChange={toggleAll}
            />
            <label className="form-check-label" htmlFor="all-cats">
              All Categories
            </label>
          </div>
          {categories.map((c) => (
            <div className="form-check mb-2" key={c.slug}>
              <input
                className="form-check-input"
                type="checkbox"
                id={c.slug}
                checked={activeCats.includes(c.slug)}
                onChange={() => toggleCat(c.slug)}
              />
              <label className="form-check-label" htmlFor={c.slug}>
                {c.name}
              </label>
            </div>
          ))}

          <p className="fw-semibold mt-4 mb-2" style={{ fontSize: "0.9rem" }}>
            Legend
          </p>
          {categories.map((c) => (
            <div className="d-flex align-items-center gap-2 mb-2" key={c.slug}>
              <span
                style={{ width: 12, height: 12, borderRadius: "50%", background: c.color, display: "inline-block" }}
              />
              <span style={{ fontSize: "0.85rem" }}>{c.name}</span>
            </div>
          ))}

          <button className="btn btn-brand-outline w-100 mt-3 rounded-3">
            <i className="bi bi-crosshair me-2" /> My Location
          </button>
        </aside>

        <div className="flex-fill">
          <CompanyMap companies={filtered} height={640} zoom={14} selectedId={selected?.id} onSelect={setSelectedId} />
        </div>
      </div>
    </>
  );
}
