import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import AdminMap, { NIA_CENTER } from "../components/AdminMap";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { categories } from "../data/categories";
import { getCompanyById } from "../data/companies";

export default function CompanyForm() {
  const { openSidebar } = useSidebar();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const existing = isEdit ? getCompanyById(id) : null;
  const fileInputRef = useRef(null);

  // A "company" account may only ever edit its own linked company record.
  const isOwnCompany = user?.role === "super_admin" || (user?.role === "warehouse_manager" || user?.role === "warehouse_user") && String(user.companyId) === String(id);

  useEffect(() => {
    if (isEdit && user && !isOwnCompany) {
      navigate("/my-company", { replace: true });
    }
  }, [isEdit, user, isOwnCompany, navigate]);

  const [form, setForm] = useState({
    name: existing?.name || "",
    category: existing?.category || "",
    phone: existing?.phone || "",
    email: existing?.email || "",
    address: existing?.address || "",
    description: existing?.description || "",
    products: existing?.products?.join(", ") || "",
  });
  const [pin, setPin] = useState(existing ? [existing.lat, existing.lng] : null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  // Multiple images: each item is { file, previewUrl } for new uploads,
  // or { url } for images that already exist on the record.
  const [images, setImages] = useState(
    (existing?.images || []).map((url) => ({ url }))
  );
  const [saved, setSaved] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation isn't supported on this device/browser.");
      return;
    }
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPin([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      (err) => {
        setLocationError(err.message || "Couldn't get your location. Check location permissions.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const onFilesChosen = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const next = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...next]);
    e.target.value = ""; // allow re-selecting the same file later
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const target = prev[index];
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  useEffect(() => {
    // Clean up any object URLs when the form unmounts.
    return () => images.forEach((img) => img.previewUrl && URL.revokeObjectURL(img.previewUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    // Wire this to your real API — payload is already shaped and ready:
    // const body = new FormData();
    // Object.entries(form).forEach(([k, v]) => body.append(k, v));
    // if (pin) { body.append("lat", pin[0]); body.append("lng", pin[1]); }
    // images.filter((i) => i.file).forEach((i) => body.append("images", i.file));
    // await api.post(`/companies${isEdit ? "/" + id : ""}`, body, { isForm: true });
    setSaved(true);
    setTimeout(() => navigate(user?.role === "company" ? "/my-company" : "/companies"), 900);
  };

  if (isEdit && user?.role === "company" && !isOwnCompany) return null;

  return (
    <>
      <Topbar
        title={isEdit ? "Edit Company" : "Add New Company"}
        subtitle={isEdit ? "Update this company's details." : "Add a new wholesale company to the system."}
        onMenuClick={openSidebar}
      />

      <div className="p-3 p-lg-4">
        <form onSubmit={onSubmit}>
          <div className="row g-3 mb-3">
            <div className="col-lg-6">
              <div className="card-surface p-3 p-lg-4 h-100">
                <p className="fw-semibold mb-3">Company Information</p>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label">Company Name *</label>
                    <input required className="form-control" placeholder="Enter company name" value={form.name} onChange={update("name")} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Category *</label>
                    <select required className="form-select" value={form.category} onChange={update("category")}>
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Phone *</label>
                    <input required className="form-control" placeholder="Enter phone number" value={form.phone} onChange={update("phone")} />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" placeholder="Enter email address" value={form.email} onChange={update("email")} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address *</label>
                    <input required className="form-control" placeholder="Enter full address" value={form.address} onChange={update("address")} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card-surface p-3 p-lg-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <p className="fw-semibold mb-0">Location</p>
                  <button
                    type="button"
                    className="btn btn-sm btn-brand-outline rounded-3 d-flex align-items-center gap-2"
                    onClick={useMyLocation}
                    disabled={locating}
                  >
                    {locating ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <i className="bi bi-crosshair" />
                    )}
                    {locating ? "Locating..." : "Use current location"}
                  </button>
                </div>
                <p className="text-muted-brand mb-2" style={{ fontSize: "0.82rem" }}>
                  Stand at the company's location and tap the button — the map below just previews the pin.
                </p>
                {locationError && (
                  <div className="alert-brand-danger mb-2" style={{ fontSize: "0.8rem" }}>
                    <i className="bi bi-exclamation-circle-fill me-2" />{locationError}
                  </div>
                )}
                <AdminMap pinPosition={pin} height={220} center={pin || NIA_CENTER} zoom={pin ? 16 : 13} />
                <div className="row g-2 mt-2">
                  <div className="col-6">
                    <label className="form-label mb-1">Latitude</label>
                    <input readOnly className="form-control" value={pin ? pin[0].toFixed(5) : ""} placeholder="—" />
                  </div>
                  <div className="col-6">
                    <label className="form-label mb-1">Longitude</label>
                    <input readOnly className="form-control" value={pin ? pin[1].toFixed(5) : ""} placeholder="—" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-lg-6">
              <div className="card-surface p-3 p-lg-4 h-100">
                <p className="fw-semibold mb-3">Additional Information</p>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={4} placeholder="Enter company description..." value={form.description} onChange={update("description")} />
                </div>
                <div>
                  <label className="form-label">Products / Services</label>
                  <input className="form-control" placeholder="Enter products or services (comma separated)" value={form.products} onChange={update("products")} />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card-surface p-3 p-lg-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <p className="fw-semibold mb-0">Company Images</p>
                  {images.length > 0 && <span className="text-muted-brand" style={{ fontSize: "0.8rem" }}>{images.length} selected</span>}
                </div>

                <div
                  className="upload-dropzone py-4"
                  style={{ minHeight: 120 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="bi bi-images text-muted-brand mb-2" style={{ fontSize: "1.6rem" }} />
                  <p className="fw-semibold mb-1" style={{ fontSize: "0.9rem" }}>Click to add images</p>
                  <p className="text-muted-brand mb-0" style={{ fontSize: "0.78rem" }}>PNG or JPG, multiple allowed</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg"
                  multiple
                  className="d-none"
                  onChange={onFilesChosen}
                />

                {images.length > 0 && (
                  <div className="image-thumb-grid mt-3">
                    {images.map((img, i) => (
                      <div className="image-thumb" key={img.previewUrl || img.url || i}>
                        <img src={img.previewUrl || img.url} alt={`Company ${i + 1}`} />
                        {i === 0 && <span className="image-thumb-badge">Cover</span>}
                        <button type="button" className="image-thumb-remove" onClick={() => removeImage(i)} aria-label="Remove image">
                          <i className="bi bi-x-lg" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 flex-wrap">
            {saved && <span className="text-primary-brand fw-semibold align-self-center me-auto"><i className="bi bi-check-circle-fill me-1" />Saved!</span>}
            <button type="button" className="btn btn-brand-outline rounded-3 px-4" onClick={() => navigate(user?.role === "company" ? "/my-company" : "/companies")}>Cancel</button>
            <button type="submit" className="btn btn-brand rounded-3 px-4">
              <i className="bi bi-save me-2" /> Save Company
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
