import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import MobileHeader from "../components/MobileHeader";
import RatingStars from "../components/RatingStars";
import CompanyMap from "../components/CompanyMap";
import { getCompany, getNearby } from "../data/companies";
import { getCategory } from "../data/categories";
import { useFavorites } from "../context/FavoritesContext";
import { companyImageUrl, companyGalleryUrls } from "../utils/image";
import ImageCarousel from "../components/ImageCarousel";

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = getCompany(id);
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activeProduct, setActiveProduct] = useState(0);

  if (!company) {
    return (
      <div className="container py-5 text-center">
        <p className="fw-semibold">Company not found.</p>
        <Link to="/companies" className="text-primary-brand">Back to results</Link>
      </div>
    );
  }

  const cat = getCategory(company.category);
  const nearby = getNearby(company);
  const favorited = isFavorite(company.id);

  const infoRows = [
    { icon: "bi-geo-alt", text: company.address },
    { icon: "bi-telephone", text: company.phone },
    { icon: "bi-envelope", text: company.email },
    { icon: "bi-clock", text: company.hours },
  ];

  return (
    <>
      <MobileHeader
        variant="back"
        title=""
        rightIcons={
          <>
            <button className="btn btn-sm border-0 p-0 me-3" aria-label="Share">
              <i className="bi bi-share fs-5" />
            </button>
            <button
              className="btn btn-sm border-0 p-0"
              onClick={() => toggleFavorite(company.id)}
              aria-label="Favorite"
            >
              <i
                className={`bi ${favorited ? "bi-heart-fill" : "bi-heart"} fs-5`}
                style={{ color: favorited ? "#e0405a" : "inherit" }}
              />
            </button>
          </>
        }
      />

      <div className="container-fluid px-0 px-lg-4 py-lg-4" style={{ maxWidth: 1320, margin: "0 auto" }}>
        {/* Desktop back link */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-link d-none d-lg-inline-flex align-items-center gap-2 text-dark text-decoration-none mb-3 px-0"
        >
          <i className="bi bi-arrow-left" /> Back to results
        </button>

        <div className="row g-4">
          <div className="col-lg-8">
            <ImageCarousel
              images={companyGalleryUrls(company, 4, 1000, 500)}
              height={260}
            />

            <div className="px-3 px-lg-0 pt-3">
              <div className="d-flex align-items-start justify-content-between">
                <h1 className="fw-bold mb-1" style={{ fontSize: "1.4rem" }}>
                  {company.name}
                </h1>
              </div>
              <RatingStars rating={company.rating} reviews={company.reviews} size="0.9rem" />

              <span
                className="badge-category mt-2 mb-3 d-inline-block"
                style={{ background: cat.bg, color: cat.color }}
              >
                {cat.name}
              </span>

              <div className="d-flex flex-column gap-2 mb-4">
                {infoRows.map((r) => (
                  <div className="d-flex align-items-center gap-2 text-muted-brand" key={r.icon}>
                    <i className={`bi ${r.icon}`} />
                    <span style={{ fontSize: "0.9rem" }}>{r.text}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex gap-2 mb-4">
                <Link to={`/companies/${company.id}/directions`} className="btn btn-brand flex-fill rounded-3">
                  <i className="bi bi-signpost-2 me-2" /> Get Directions
                </Link>
                <a href={`tel:${company.phone.split(" / ")[0]}`} className="btn btn-brand-outline flex-fill rounded-3">
                  <i className="bi bi-telephone me-2" /> Call Now
                </a>
              </div>

              <p className="fw-semibold mb-2" style={{ fontSize: "0.95rem" }}>
                Products
              </p>
              <div className="d-flex gap-2 mb-4 flex-wrap">
                {[...company.products, "More..."].map((p, i) => (
                  <button
                    key={p}
                    onClick={() => setActiveProduct(i)}
                    className="btn btn-sm rounded-pill px-3"
                    style={
                      activeProduct === i
                        ? { background: "var(--color-primary)", color: "#fff", border: "none" }
                        : { background: "#fff", color: "var(--color-text)", border: "1px solid var(--color-border)" }
                    }
                  >
                    {p}
                  </button>
                ))}
              </div>

              <p className="fw-semibold mb-2" style={{ fontSize: "0.95rem" }}>
                About Company
              </p>
              <p className="text-muted-brand mb-4" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>
                {company.about}
              </p>

              {/* Mobile nearby list */}
              <div className="d-lg-none mb-4">
                <p className="fw-semibold mb-2" style={{ fontSize: "0.95rem" }}>
                  Nearby Companies
                </p>
                <div className="d-flex flex-column gap-2">
                  {nearby.map((n) => (
                    <Link
                      key={n.id}
                      to={`/companies/${n.id}`}
                      className="d-flex align-items-center justify-content-between text-decoration-none text-dark py-2 border-bottom"
                    >
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={companyImageUrl(n, 100, 100)}
                          loading="lazy"
                          alt={n.name}
                          className="rounded-2"
                          style={{ width: 40, height: 40, objectFit: "cover" }}
                        />
                        <div className="d-flex flex-column">
                          <span style={{ fontSize: "0.88rem" }} className="fw-medium">{n.name}</span>
                          <span className="text-muted-brand" style={{ fontSize: "0.78rem" }}>{n.distanceKm} km away</span>
                        </div>
                      </div>
                      <i className="bi bi-send text-primary-brand" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop sidebar */}
          <div className="col-lg-4 d-none d-lg-block">
            <div className="card-surface p-3 mb-3">
              <p className="fw-semibold mb-2" style={{ fontSize: "0.95rem" }}>Location</p>
              <CompanyMap
                companies={[company]}
                center={[company.lat, company.lng]}
                height={200}
                zoom={16}
                showUserLocation={false}
                linkToDetail={false}
              />
            </div>

            <div className="card-surface p-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <p className="fw-semibold mb-0" style={{ fontSize: "0.95rem" }}>Nearby Companies</p>
                <Link to="/companies" className="text-primary-brand" style={{ fontSize: "0.82rem" }}>View all</Link>
              </div>
              <div className="d-flex flex-column gap-2">
                {nearby.map((n) => (
                  <Link
                    key={n.id}
                    to={`/companies/${n.id}`}
                    className="d-flex align-items-center justify-content-between text-decoration-none text-dark py-2"
                  >
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={companyImageUrl(n, 100, 100)}
                          loading="lazy"
                        alt={n.name}
                        className="rounded-2"
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                      />
                      <span style={{ fontSize: "0.85rem" }}>{n.name}</span>
                    </div>
                    <span className="text-muted-brand" style={{ fontSize: "0.78rem" }}>{n.distanceKm} km away</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
