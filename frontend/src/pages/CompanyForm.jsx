import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import AdminMap, { NIA_CENTER } from "../components/AdminMap";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { categories, getCategory, getCategoryValue } from "../data/categories";
import { api } from "../api/client";

const COMPANY_MANAGEMENT_ROLES = ["super_admin", "warehouse_manager", "warehouse_user"];

function parseProducts(value = "") {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function CompanyForm() {
  const { openSidebar } = useSidebar();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const companyId = id || (location.pathname === "/my-company" ? user?.companyId : null);
  const fileInputRef = useRef(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(Boolean(id));
  const [message, setMessage] = useState("");

  // A "company" account may only ever edit its own linked company record.
  const isOwnCompany = user?.role === "super_admin" || (COMPANY_MANAGEMENT_ROLES.includes(user?.role) && String(user.companyId) === String(companyId));

  useEffect(() => {
    if ((isEdit || location.pathname === "/my-company") && user && !isOwnCompany) {
      navigate("/my-company", { replace: true });
    }
  }, [isEdit, user, isOwnCompany, navigate]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    phone: "",
    email: "",
    address: "",
    description: "",
    products: "",
  });
  const [pin, setPin] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [images, setImages] = useState([]);
  const [saved, setSaved] = useState(false);
  const [editableFields, setEditableFields] = useState({});

  useEffect(() => {
    if (!companyId || !user) return;

    if (!isOwnCompany) {
      navigate("/my-company", { replace: true });
      return;
    }

    let ignore = false;
    setLoadingCompany(true);

    Promise.all([
      api.get(`/api/auth/mycompany/${companyId}`),
      api.get(`/api/company/${companyId}/images`),
    ])
      .then(([company, imageResponse]) => {
        if (ignore) return;

        const productNames = Array.isArray(company?.products)
          ? company.products.map((product) => product.product_name || product.name || product).filter(Boolean)
          : [];

        setCompanyDetails(company || null);
        setForm({
          name: company?.company_name || company?.name || "",
          category: getCategoryValue(company?.cat_id || company?.category || company?.category_name),
          phone: company?.phone || "",
          email: company?.email || "",
          address: company?.address || "",
          description: company?.description || "",
          products: productNames.join(", "),
        });
        setPin(company?.latitude && company?.longitude ? [Number(company.latitude), Number(company.longitude)] : null);
        setImages(Array.isArray(imageResponse?.images) ? imageResponse.images.map((image) => ({ ...image, previewUrl: image.url })) : []);
      })
      .catch((error) => {
        if (!ignore) setMessage(error.message || "Could not load company details.");
      })
      .finally(() => {
        if (!ignore) setLoadingCompany(false);
      });

    return () => {
      ignore = true;
    };
  }, [companyId, isEdit, isOwnCompany, user?.id, user?.role, user?.companyId, navigate, location.pathname]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggleFieldEdit = (field) => {
    setEditableFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

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

  const onFilesChosen = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const pendingImages = files.map((file, index) => ({
      key: `temp-${Date.now()}-${index}`,
      file,
      previewUrl: URL.createObjectURL(file),
      uploading: true,
    }));

    setImages((prev) => [...prev, ...pendingImages]);
    setMessage("");

    try {
      for (const item of pendingImages) {
        if (!companyId) {
          throw new Error("Save the company first before uploading images.");
        }

        const formData = new FormData();
        formData.append("images", item.file);
        const response = await api.post(`/api/company/${companyId}/images`, formData, { isForm: true });
        const uploadedImages = Array.isArray(response?.images) ? response.images : [];
        const uploaded = uploadedImages[0];

        if (!uploaded) throw new Error("Image upload failed.");

        setImages((prev) =>
          prev.map((current) =>
            current.key === item.key
              ? { ...current, ...uploaded, previewUrl: uploaded.url, uploading: false }
              : current
          )
        );
      }

      setMessage("Images uploaded successfully.");
    } catch (error) {
      setImages((prev) => prev.filter((item) => !pendingImages.some((pending) => pending.key === item.key)));
      setMessage(error.message || "Image upload failed.");
    } finally {
      event.target.value = "";
    }
  };

  const removeImage = async (image) => {
    if (image?.previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(image.previewUrl);
    }

    if (image?.id && !image.uploading) {
      try {
        await api.del(`/api/company/${companyId}/images/${image.id}`);
      } catch (error) {
        setMessage(error.message || "Could not delete image.");
        return;
      }
    }

    setImages((prev) => prev.filter((item) => item.key !== image.key && item.id !== image.id));
    setMessage("Image removed.");
  };

  const deleteAllImages = async () => {
    if (!companyId || images.length === 0) return;

    try {
      await Promise.all(images.filter((image) => image.id).map((image) => api.del(`/api/company/${companyId}/images/${image.id}`)));
      setImages([]);
      setMessage("All images removed.");
    } catch (error) {
      setMessage(error.message || "Could not delete all images.");
    }
  };

  const setCoverImage = async (image) => {
    if (!image?.id || image.is_cover) return;

    try {
      await api.put(`/api/company/${companyId}/images/${image.id}/cover`);
      setImages((prev) => prev.map((item) => ({ ...item, is_cover: item.id === image.id })));
      setMessage("Cover image updated.");
    } catch (error) {
      setMessage(error.message || "Could not update cover image.");
    }
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
    setTimeout(() => navigate(user?.role === "company" || COMPANY_MANAGEMENT_ROLES.includes(user?.role) ? "/my-company" : "/companies"), 900);
  };

  const productList = Array.isArray(companyDetails?.products) && companyDetails.products.length
    ? companyDetails.products.map((product) => product.product_name || product.name || product).filter(Boolean)
    : parseProducts(form.products);

  if (isEdit && !COMPANY_MANAGEMENT_ROLES.includes(user?.role) && user?.role !== "super_admin") return null;

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
                    <div className="input-group">
                      <input required className="form-control" placeholder="Enter company name" value={form.name} onChange={update("name")} disabled={!editableFields.name} />
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => toggleFieldEdit("name")} title="Edit field">
                        <i className="bi bi-pencil" />
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Category *</label>
                    <div className="input-group">
                      <select required className="form-select" value={form.category} onChange={update("category")} disabled={!editableFields.category}>
                        <option value="">Select category</option>
                        {categories.map((c) => (
                          <option key={c.slug} value={c.slug}>{c.name}</option>
                        ))}
                      </select>
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => toggleFieldEdit("category")} title="Edit field">
                        <i className="bi bi-pencil" />
                      </button>
                    </div>
                    {companyDetails?.cat_id && !form.category && (
                      <small className="text-muted-brand">Current category: {getCategory(companyDetails.cat_id)?.name || companyDetails.category_name}</small>
                    )}
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Phone *</label>
                    <div className="input-group">
                      <input required className="form-control" placeholder="Enter phone number" value={form.phone} onChange={update("phone")} disabled={!editableFields.phone} />
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => toggleFieldEdit("phone")} title="Edit field">
                        <i className="bi bi-pencil" />
                      </button>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Email</label>
                    <div className="input-group">
                      <input type="email" className="form-control" placeholder="Enter email address" value={form.email} onChange={update("email")} disabled={!editableFields.email} />
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => toggleFieldEdit("email")} title="Edit field">
                        <i className="bi bi-pencil" />
                      </button>
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address *</label>
                    <div className="input-group">
                      <input required className="form-control" placeholder="Enter full address" value={form.address} onChange={update("address")} disabled={!editableFields.address} />
                      <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => toggleFieldEdit("address")} title="Edit field">
                        <i className="bi bi-pencil" />
                      </button>
                    </div>
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
                  <div className="input-group">
                    <input className="form-control" placeholder="Enter products or services (comma separated)" value={form.products} onChange={update("products")} disabled={!editableFields.products} />
                    <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => toggleFieldEdit("products")} title="Edit field">
                      <i className="bi bi-pencil" />
                    </button>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {productList.length > 0 ? (
                      productList.map((product) => (
                        <span key={product} className="badge rounded-pill" style={{ background: "var(--color-bg)", color: "var(--color-primary)", border: "1px solid var(--color-border)", padding: "0.5rem 0.7rem" }}>
                          {product}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted-brand" style={{ fontSize: "0.85rem" }}>Add products to preview them here.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card-surface p-3 p-lg-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <p className="fw-semibold mb-0">Company Images</p>
                  {images.length > 0 && <span className="text-muted-brand" style={{ fontSize: "0.8rem" }}>{images.length} images</span>}
                </div>

                {message && <div className="alert-brand-danger mb-3" style={{ fontSize: "0.82rem" }}>{message}</div>}

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
                  <div className="d-flex justify-content-end mb-2">
                    <button type="button" className="btn btn-sm btn-outline-danger" onClick={deleteAllImages}>
                      <i className="bi bi-trash3 me-1" /> Delete all
                    </button>
                  </div>
                )}

                {loadingCompany ? (
                  <div className="text-muted-brand mt-3" style={{ fontSize: "0.9rem" }}>
                    <i className="bi bi-arrow-repeat me-2" />Loading company details...
                  </div>
                ) : images.length > 0 ? (
                  <div className="row g-3 mt-1">
                    {images.map((img, i) => (
                      <div className="col-sm-6" key={img.id || img.key || `${img.previewUrl}-${i}`}>
                        <div className="border rounded-3 overflow-hidden position-relative bg-light" style={{ minHeight: 150 }}>
                          <img src={img.previewUrl || img.url} alt={`Company ${i + 1}`} style={{ width: "100%", height: 150, objectFit: "cover" }} />
                          {img.is_cover && <span className="position-absolute top-0 start-0 badge rounded-pill m-2" style={{ background: "var(--color-primary)", color: "#fff" }}>Cover</span>}
                          {img.uploading && <span className="position-absolute bottom-0 start-0 end-0 px-2 py-1 text-center" style={{ background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "0.8rem" }}>Uploading...</span>}
                          <div className="position-absolute top-0 end-0 d-flex gap-1 m-2">
                            {!img.is_cover && (
                              <button type="button" className="btn btn-sm btn-light rounded-circle" onClick={() => setCoverImage(img)} title="Set as cover" aria-label="Set as cover">
                                <i className="bi bi-star-fill" style={{ color: "var(--color-warning)" }} />
                              </button>
                            )}
                            <button type="button" className="btn btn-sm btn-light rounded-circle" onClick={() => removeImage(img)} title="Delete image" aria-label="Delete image">
                              <i className="bi bi-trash3-fill" style={{ color: "var(--color-danger)" }} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-muted-brand mt-3" style={{ fontSize: "0.9rem" }}>No images yet. Add a few to showcase the company.</div>
                )}
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 flex-wrap">
            {saved && <span className="text-primary-brand fw-semibold align-self-center me-auto"><i className="bi bi-check-circle-fill me-1" />Saved!</span>}
            <button type="button" className="btn btn-brand-outline rounded-3 px-4" onClick={() => navigate(COMPANY_MANAGEMENT_ROLES.includes(user?.role) ? "/my-company" : "/companies")}>Cancel</button>
            <button type="submit" className="btn btn-brand rounded-3 px-4">
              <i className="bi bi-save me-2" /> Save Company
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
