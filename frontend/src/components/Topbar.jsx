import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import { useEffect, useState } from "react";

export default function Topbar({ title, subtitle, onMenuClick, actions = null }) {
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const displayedPhoto = user?.photo ?? user?.avatar ?? user?.profile_photo ?? user?.image ?? user?.image_url ?? user?.imageUrl;
  const roleLabel = ["warehouse_manager", "warehouse_user"].includes(user?.role)
    ? "Warehouse Account"
    : "Super Administrator";
   
  return (
    <header className="admin-topbar">
      <div className="d-flex align-items-center gap-3 min-w-0">
        <button className="btn btn-sm border-0 d-lg-none p-0" onClick={onMenuClick} aria-label="Open navigation menu">
          <i className="bi bi-list fs-3" />
        </button>
        <div className="min-w-0">
          <h1 className="fw-bold mb-0 font-display text-truncate" style={{ fontSize: "1.15rem" }}>{title}</h1>
          {subtitle && <p className="fw-bold mb-0 d-none d-sm-block text-truncate" style={{ fontSize: "0.82rem" }}>{subtitle}</p>}
        </div>
      </div>

      <div className="d-flex align-items-center gap-2 gap-md-3 flex-shrink-0">
        {actions}
        <span className="d-none d-xl-flex align-items-center gap-2 border rounded-3 px-3 py-2" style={{ fontSize: "0.85rem" }}>
          <i className="bi bi-calendar3 text-muted-brand" />
          {today}
        </span>
        <button className="btn btn-sm border rounded-3 position-relative p-2" aria-label="Notifications">
          <i className="bi bi-bell" />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill" style={{ background: "var(--color-danger)", fontSize: "0.6rem" }}>1</span>
        </button>
        <div className="d-none d-sm-flex align-items-center gap-2">
          <Avatar name={user?.name || "Admin"} photo={displayedPhoto} size={38} className="flex-shrink-0" />
          <div className="d-none d-md-flex flex-column lh-1">
            <span className="fw-semibold text-truncate" style={{ fontSize: "0.85rem", maxWidth: 140 }}>{user?.name || "Admin"}</span>
            <span className="text-muted-brand" style={{ fontSize: "0.72rem" }}>{roleLabel}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
