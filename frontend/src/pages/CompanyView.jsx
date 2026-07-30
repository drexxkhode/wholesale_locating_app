import { Link, useNavigate, useParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import StatusBadge from "../components/StatusBadge";
import AdminMap from "../components/AdminMap";
import { useSidebar } from "../context/SidebarContext";
import { getCompanyById } from "../data/companies";
import { getCategory } from "../data/categories";
import { useState } from "react";

export default function CompanyView() {
  const { openSidebar } = useSidebar();
  const navigate = useNavigate();
  const { id } = useParams();
  const company = getCompanyById(id);
  const images = company?.images || [];
  const [activeImage, setActiveImage] = useState(0);

  if (!company) {
    return (
      <>
        <Topbar title="Company Not Found" onMenuClick={openSidebar} />
        <div className="p-4 text-center">
          <p className="text-muted-brand">This company doesn't exist or was removed.</p>
          <Link to="/companies" className="text-primary-brand fw-semibold">Back to companies</Link>
        </div>
      </>
    );
  }

  const cat = getCategory(company.category);

  return (
    <>
      <Topbar
        title={company.name}
        subtitle="Company details"
        onMenuClick={openSidebar}
        actions={
          <button className="btn btn-brand rounded-3 px-3" onClick={() => navigate(`/companies/${company.id}/edit`)}>
            <i className="bi bi-pencil me-2" /> Edit
          </button>
        }
      />

      <div className="p-3 p-lg-4">
        <div className="row g-3">
          <div className="col-lg-7">
            <div className="card-surface p-0 overflow-hidden mb-3">
              {images.length > 0 ? (
                <>
                  <img src={images[activeImage]} alt={company.name} className="w-100" style={{ height: 220, objectFit: "cover" }} />
                  {images.length > 1 && (
                    <div className="d-flex gap-2 p-2" style={{ background: "var(--color-bg)", overflowX: "auto" }}>
                      {images.map((src, i) => (
                        <img
                          key={src + i}
                          src={src}
                          alt=""
                          onClick={() => setActiveImage(i)}
                          className={`image-gallery-thumb ${i === activeImage ? "active" : ""}`}
                        />
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center text-muted-brand" style={{ height: 180, background: "var(--color-bg)" }}>
                  <i className="bi bi-image mb-2" style={{ fontSize: "1.8rem" }} />
                  <span style={{ fontSize: "0.85rem" }}>No images uploaded yet</span>
                </div>
              )}
              <div className="p-3 p-lg-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <h2 className="fw-bold mb-0 font-display" style={{ fontSize: "1.3rem" }}>{company.name}</h2>
                  <StatusBadge status={company.status} />
                </div>
                <span className="fw-medium" style={{ color: cat.color, fontSize: "0.88rem" }}>{cat.name}</span>

                <div className="d-flex flex-column gap-2 mt-3">
                  <div className="d-flex align-items-center gap-2 text-muted-brand"><i className="bi bi-telephone" /> {company.phone}</div>
                  <div className="d-flex align-items-center gap-2 text-muted-brand"><i className="bi bi-envelope" /> {company.email}</div>
                  <div className="d-flex align-items-center gap-2 text-muted-brand"><i className="bi bi-geo-alt" /> {company.address}</div>
                  <div className="d-flex align-items-center gap-2 text-muted-brand"><i className="bi bi-calendar3" /> Added {new Date(company.addedOn).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
                </div>

                <p className="fw-semibold mt-4 mb-2">Description</p>
                <p className="text-muted-brand" style={{ fontSize: "0.9rem", lineHeight: 1.6 }}>{company.description}</p>

                <p className="fw-semibold mb-2">Products / Services</p>
                <div className="d-flex flex-wrap gap-2">
                  {company.products.map((p) => (
                    <span key={p} className="badge rounded-pill" style={{ background: cat.bg, color: cat.color, fontWeight: 500 }}>{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card-surface p-3">
              <p className="fw-semibold mb-2">Location</p>
              <AdminMap companies={[company]} center={[company.lat, company.lng]} zoom={15} height={280} />
              <p className="text-muted-brand mt-2 mb-0" style={{ fontSize: "0.82rem" }}>
                Lat {company.lat.toFixed(4)}, Lng {company.lng.toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
