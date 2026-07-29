import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MobileHeader from "../components/MobileHeader";
import SearchBar from "../components/SearchBar";
import CompanyCard from "../components/CompanyCard";
import CompanyMap from "../components/CompanyMap";
import { companies } from "../data/companies";
import { getCategory } from "../data/categories";

const PAGE_SIZE = 5;

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").toLowerCase();
  const categorySlug = params.get("category") || "";
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    return companies
      .filter((c) => (categorySlug ? c.category === categorySlug : true))
      .filter((c) => {
        if (!q) return true;
        const cat = getCategory(c.category);
        return (
          c.name.toLowerCase().includes(q) ||
          cat.name.toLowerCase().includes(q) ||
          c.products.some((p) => p.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [q, categorySlug]);

  const results = filtered.slice(0, visible);

  return (
    <>
      <MobileHeader variant="back" title="Search Results" />

      <div className="container-fluid py-3 py-lg-4 px-3 px-lg-4" style={{ maxWidth: 1320, margin: "0 auto" }}>
        <div className="mb-3">
          <SearchBar defaultValue={q} onFilterClick={() => {}} />
        </div>

        <div className="row g-3 g-lg-4">
          <div className="col-lg-4">
            <p className="fw-semibold text-muted-brand mb-2" style={{ fontSize: "0.82rem" }}>
              {filtered.length} {filtered.length === 1 ? "Company" : "Companies"} Found
            </p>

            <div className="d-flex flex-column gap-2" style={{ maxHeight: "72vh", overflowY: "auto" }}>
              {results.length === 0 && (
                <div className="text-center text-muted-brand py-5">
                  No companies match your search. Try a different keyword.
                </div>
              )}
              {results.map((c) => (
                <CompanyCard key={c.id} company={c} dense />
              ))}
            </div>

            {visible < filtered.length && (
              <button
                className="btn btn-brand-outline w-100 mt-3 rounded-3"
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
              >
                Load More <i className="bi bi-chevron-down ms-1" />
              </button>
            )}
          </div>

          <div className="col-lg-8 d-none d-lg-block">
            <div className="position-sticky" style={{ top: "calc(var(--navbar-h-desktop) + 16px)" }}>
              <CompanyMap companies={filtered} height={720} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
