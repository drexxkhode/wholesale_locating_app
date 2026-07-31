import { useEffect, useRef, useState } from "react";
import Topbar from "../components/Topbar";
import Avatar from "../components/Avatar";
import { useSidebar } from "../context/SidebarContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/client";

const tabs = ["Profile", "Change Password", "System Settings"];

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() || "")
    .join("");

function InitialAvatar({ name, size = 100 }) {
  const initials = getInitials(name);

  const colors = [
    "#0d6efd",
    "#198754",
    "#dc3545",
    "#0dcaf0",
    "#6f42c1",
    "#fd7e14",
  ];

  const color = colors[(name?.charCodeAt(0) ?? 0) % colors.length];

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 900,
        fontSize: size * 0.36,
        fontFamily: "'Barlow Condensed', sans-serif",
        boxShadow: `0 6px 24px ${color}55`,
      }}
    >
      {initials || "?"}
    </div>
  );
}

function EditableProfileField({ field, label, value, editingField, onChange, setEditingField }) {
  const isEditing = editingField === field;

  return (
    <div className="col-sm-6">
      <label className="form-label" htmlFor={field}>{label}</label>
      <div className="input-group">
        <input
          id={field}
          className="form-control"
          value={value}
          disabled={!isEditing}
          onChange={(event) => onChange(field, event.target.value)}
        />
        <button
          type="button"
          className="btn btn-brand-outline"
          onClick={() => setEditingField(isEditing ? null : field)}
          aria-label={isEditing ? `Lock ${label}` : `Edit ${label}`}
          title={isEditing ? "Lock field" : "Edit field"}
        >
          <i className={`bi ${isEditing ? "bi-lock-fill" : "bi-pencil-fill"}`} style={{ fontSize: "0.75rem" }} />
        </button>
      </div>
    </div>
  );
}


export default function Settings() {
  const { openSidebar } = useSidebar();
  const [tab, setTab] = useState("Profile");
    const { user, updateCurrentUser } = useAuth();
    const photoInputRef = useRef(null);
    const [editingField, setEditingField] = useState(null);
    const [profileUser, setProfileUser] = useState(null);
    const [profile, setProfile] = useState({ name: "", username: "", email: "", phone: "" });
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isRemovingPhoto, setIsRemovingPhoto] = useState(false);
    const [message, setMessage] = useState("");
  
    useEffect(() => {
      if (!user?.id) return;

      api
        .get("/api/auth/me")
        .then((meUser) => {
          const currentUser = Array.isArray(meUser)
            ? meUser.find((item) => String(item.id) === String(user.id))
            : meUser;

          if (currentUser?.id) {
            setProfileUser(currentUser);
            setProfile({
              name: currentUser.name ?? "",
              username: currentUser.username ?? "",
              email: currentUser.email ?? "",
              phone: currentUser.phone ?? "",
            });
            setMessage("");
          } else {
            setProfileUser(user);
            setProfile({
              name: user?.name ?? "",
              username: user?.username ?? "",
              email: user?.email ?? "",
              phone: user?.phone ?? "",
            });
            setMessage("Your profile could not be found.");
          }
        })
        .catch((error) => setMessage(error.message));
    }, [user?.id, user?.name, user?.username, user?.email, user?.phone]);
    
      useEffect(() => () => {
        if (photoPreview) URL.revokeObjectURL(photoPreview);
      }, [photoPreview]);
    
      const updateProfileField = (field, value) => {
        setProfile((currentProfile) => ({ ...currentProfile, [field]: value }));
      };
    
      const handlePhotoSelection = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        setSelectedPhoto(file);
        setPhotoPreview(URL.createObjectURL(file));
        setMessage("");
      };
    
      const clearSelectedPhoto = () => {
        setSelectedPhoto(null);
        setPhotoPreview(null);
        if (photoInputRef.current) photoInputRef.current.value = "";
      };
    
      const handleSave = async () => {
        if (!user?.id) return;
    
        setIsSaving(true);
        setMessage("");
        try {
          const formData = new FormData();
          formData.append("name", profile.name);
          formData.append("username", profile.username);
          formData.append("email", profile.email);
          formData.append("phone", profile.phone);
          if (selectedPhoto) formData.append("photo", selectedPhoto);
    
          const data = await api.put(`/api/auth/update/${user.id}`, formData, { isForm: true });
          updateCurrentUser(data.admin);
          setProfileUser(data.admin);
          clearSelectedPhoto();
          setEditingField(null);
          setMessage("Profile updated successfully.");
        } catch (error) {
          setMessage(error.message);
        } finally {
          setIsSaving(false);
        }
      };
    
      const handleDeleteExistingPhoto = async () => {
        if (!user?.id || !user.photo) return;
    
        setIsRemovingPhoto(true);
        setMessage("");
        try {
          const data = await api.del(`/api/auth/admins/${user.id}/photo`);
          updateCurrentUser(data.admin);
          setProfileUser(data.admin);
          setMessage("Profile photo removed.");
        } catch (error) {
          setMessage(error.message);
        } finally {
          setIsRemovingPhoto(false);
        }
      };
    
      const displayedPhoto = photoPreview || profileUser?.photo || user?.photo;
    

  return (
    <>
      <Topbar title="Settings" subtitle="Manage your account and system preferences." onMenuClick={openSidebar} />

      <div className="p-3 p-lg-4">
        <div className="d-flex gap-2 mb-3 flex-wrap">
          {tabs.map((currentTab) => (
            <button
              key={currentTab}
              onClick={() => setTab(currentTab)}
              className="btn btn-sm rounded-3 px-3"
              style={
                tab === currentTab
                  ? { background: "var(--color-primary)", color: "#fff", border: "1px solid var(--color-primary)" }
                  : { background: "#fff", border: "1px solid var(--color-border)", color: "var(--color-text)" }
              }
            >
              {currentTab}
            </button>
          ))}
        </div>


        {tab === "Profile" && (
          <div className="row g-3">
            <div className="col-lg-6">
              <div className="card-surface p-4">
                <p className="fw-semibold mb-3">Profile Information</p>
                <div className="d-flex flex-column align-items-center mb-4">
                  <div className="position-relative mb-2" style={{ width: 100, height: 100 }}>
                    <span className="icon-circle bg-primary-brand text-white" style={{ width: "100%", height: "100%", fontSize: 40, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                      <Avatar
                        name={profile.name || profileUser?.name || user?.name || "Admin"}
                        photo={displayedPhoto}
                        size={100}
                      />
                    </span>
                    {selectedPhoto && (
                      <button type="button" className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0" onClick={clearSelectedPhoto} aria-label="Remove selected photo preview" title="Remove selected preview">
                        <i className="bi bi-x-lg" />
                      </button>
                    )}
                    {!selectedPhoto && profileUser?.photo && (
                      <button type="button"  className="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0" onClick={handleDeleteExistingPhoto} disabled={isRemovingPhoto} aria-label="Remove profile photo" title="Remove profile photo">
                        <i className="bi bi-trash3-fill"  />
                      </button>
                    )}
                  </div>
                  <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="d-none" onChange={handlePhotoSelection} />
                  <button type="button" className="btn btn-sm btn-brand-outline rounded-circle" onClick={() => photoInputRef.current?.click()} aria-label="Choose profile photo" title="Choose profile photo">
                    <i className="bi bi-camera-fill" />
                  </button>
                </div>

                <div className="row g-3">
                  <div className="col-sm-6"><label className="form-label">ID</label><input className="form-control" value={profileUser?.id ?? ""} disabled /></div>
                  <EditableProfileField field="name" label="Full Name" value={profile.name} editingField={editingField} onChange={updateProfileField} setEditingField={setEditingField} />
                  <EditableProfileField field="username" label="Username" value={profile.username} editingField={editingField} onChange={updateProfileField} setEditingField={setEditingField} />
                  <EditableProfileField field="email" label="Email" value={profile.email} editingField={editingField} onChange={updateProfileField} setEditingField={setEditingField} />
                  <EditableProfileField field="phone" label="Phone" value={profile.phone} editingField={editingField} onChange={updateProfileField} setEditingField={setEditingField} />
                  <div className="col-sm-6"><label className="form-label">Role</label><input className="form-control" value={profileUser?.role ?? ""} disabled /></div>
                </div>
                 {message && <p className={`mt-3 mb-0 ${message.includes("successfully") || message.includes("removed") ? "text-success" : "text-danger"}`}>{message}</p>}
                <button type="button" className="btn btn-brand rounded-3 mt-4 px-4" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card-surface p-4">
                <p className="fw-semibold mb-3">System Information</p>
                {[
                  ["System Name", "North Industrial Area Locator"],
                  ["Version", "1.0.0"],
                  ["Developed By", "GIS Development Team"],
                  ["Last Updated", "May 20, 2025"],
                  ["Database Size", "45.6 MB"],
                  ["Total Companies", "128"],
                  ["Active Users", "250"],
                ].map(([label, value]) => (
                  <div key={label} className="d-flex justify-content-between py-2 border-bottom" style={{ fontSize: "0.88rem" }}>
                    <span className="text-muted-brand">{label}</span>
                    <span className="fw-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Change Password" && (
          <div className="card-surface p-4" style={{ maxWidth: 480 }}>
            <p className="fw-semibold mb-3">Change Password</p>
            <div className="mb-3"><label className="form-label">Current Password</label><input type="password" className="form-control" /></div>
            <div className="mb-3"><label className="form-label">New Password</label><input type="password" className="form-control" /></div>
            <div className="mb-3"><label className="form-label">Confirm New Password</label><input type="password" className="form-control" /></div>
            <button className="btn btn-brand rounded-3 px-4">Update Password</button>
          </div>
        )}

        {tab === "System Settings" && (
          <div className="card-surface p-4" style={{ maxWidth: 560 }}>
            <p className="fw-semibold mb-3">System Settings</p>
            <div className="mb-3"><label className="form-label">Site Name</label><input className="form-control" defaultValue="North Industrial Area Wholesale Locator" /></div>
            <div className="mb-3"><label className="form-label">Support Email</label><input className="form-control" defaultValue="support@northindustrial.gov" /></div>
            <div className="form-check form-switch mb-3">
              <input className="form-check-input" type="checkbox" role="switch" id="maintenance" />
              <label className="form-check-label" htmlFor="maintenance">Maintenance Mode</label>
            </div>
            <button className="btn btn-brand rounded-3 px-4">Save Settings</button>
          </div>
        )}

        {tab === "Backup & Restore" && (
          <div className="card-surface p-4" style={{ maxWidth: 560 }}>
            <p className="fw-semibold mb-3">Backup & Restore</p>
            <p className="text-muted-brand mb-3" style={{ fontSize: "0.88rem" }}>Last backup: May 24, 2025 at 2:00 AM</p>
            <div className="d-flex gap-2">
              <button className="btn btn-brand rounded-3 px-4"><i className="bi bi-cloud-download me-2" />Backup Now</button>
              <button className="btn btn-brand-outline rounded-3 px-4"><i className="bi bi-cloud-upload me-2" />Restore</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
