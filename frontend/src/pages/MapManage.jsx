import { useMemo, useState } from "react";
import Topbar from "../components/Topbar";
import AdminMap from "../components/AdminMap";
import { useSidebar } from "../context/SidebarContext";
import { companies } from "../data/companies";
import { categories } from "../data/categories";

export default function MapManage() {
  const { openSidebar } = useSidebar();
  const [activeCats, setActiveCats] = useState(categories.map((c) => c.slug));
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () => companies.filter((c) => activeCats.includes(c.category)),
    [activeCats]
  );

  const toggleCat = (slug) =>
    setActiveCats((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));

  const allChecked = activeCats.length === categories.length;
  const toggleAll = () => setActiveCats(allChecked ? [] : categories.map((c) => c.slug));

  return (
    <>
      <Topbar title="Manage Company Locations" subtitle="View and manage all company locations on the map." onMenuClick={openSidebar} />

      <div className="p-3 p-lg-4">
        <div className="row g-3">
          <div className="col-lg-3">
            <div className="card-surface p-3">
              <div className="d-flex align-items-center border rounded-3 px-3 py-2 mb-3">
                <i className="bi bi-search text-muted-brand me-2" />
                <input
                  className="border-0 flex-fill"
                  style={{ outline: "none", fontSize: "0.88rem" }}
                  placeholder="Search location..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <p className="fw-semibold mb-2" style={{ fontSize: "0.9rem" }}>Map Layers</p>
              <div className="form-check mb-2">
                <input className="form-check-input" type="checkbox" id="all-layers" checked={allChecked} onChange={toggleAll} />
                <label className="form-check-label" htmlFor="all-layers">All Companies</label>
              </div>
              {categories.map((c) => (
                <div className="form-check mb-2" key={c.slug}>
                  <input className="form-check-input" type="checkbox" id={`layer-${c.slug}`} checked={activeCats.includes(c.slug)} onChange={() => toggleCat(c.slug)} />
                  <label className="form-check-label" htmlFor={`layer-${c.slug}`}>{c.name}</label>
                </div>
              ))}

              <p className="fw-semibold mt-4 mb-2" style={{ fontSize: "0.9rem" }}>Legend</p>
              {categories.map((c) => (
                <div className="d-flex align-items-center gap-2 mb-2" key={c.slug}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: c.color, display: "inline-block" }} />
                  <span style={{ fontSize: "0.85rem" }}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-lg-9">
            <AdminMap companies={filtered} height={640} zoom={13} />
          </div>
        </div>
      </div>
    </>
  );
}
