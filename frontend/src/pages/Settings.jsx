import { useState } from "react";
import Topbar from "../components/Topbar";
import { useSidebar } from "../context/SidebarContext";

const tabs = ["Profile", "Change Password", "System Settings", "Backup & Restore"];

export default function Settings() {
  const { openSidebar } = useSidebar();
  const [tab, setTab] = useState("Profile");

  return (
    <>
      <Topbar title="Settings" subtitle="Manage your account and system preferences." onMenuClick={openSidebar} />

      <div className="p-3 p-lg-4">
        <div className="d-flex gap-2 mb-3 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="btn btn-sm rounded-3 px-3"
              style={
                tab === t
                  ? { background: "var(--color-primary)", color: "#fff", border: "1px solid var(--color-primary)" }
                  : { background: "#fff", border: "1px solid var(--color-border)", color: "var(--color-text)" }
              }
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Profile" && (
          <div className="row g-3">
            <div className="col-lg-6">
              <div className="card-surface p-4">
                <p className="fw-semibold mb-3">Profile Information</p>
                <div className="d-flex flex-column align-items-center mb-4">
                  <span className="icon-circle bg-primary-brand text-white mb-2" style={{ width: 72, height: 72 }}>
                    <i className="bi bi-person-fill fs-2" />
                  </span>
                  <button className="btn btn-sm btn-brand-outline rounded-3">Change Photo</button>
                </div>
                <div className="row g-3">
                  <div className="col-sm-6"><label className="form-label">Full Name</label><input className="form-control" defaultValue="Admin" /></div>
                  <div className="col-sm-6"><label className="form-label">Username</label><input className="form-control" defaultValue="admin" /></div>
                  <div className="col-sm-6"><label className="form-label">Email</label><input className="form-control" defaultValue="admin@northindustrial.gov" /></div>
                  <div className="col-sm-6">
                    <label className="form-label">Role</label>
                    <select className="form-select" defaultValue="Super Administrator">
                      <option>Super Administrator</option>
                      <option>Manager</option>
                      <option>Staff</option>
                    </select>
                  </div>
                </div>
                <button className="btn btn-brand rounded-3 mt-4 px-4">Update Profile</button>
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
