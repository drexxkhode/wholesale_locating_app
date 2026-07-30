import { useState } from "react";
import Topbar from "../components/Topbar";
import StatusBadge from "../components/StatusBadge";
import TableToolbar from "../components/TableToolbar";
import { useSidebar } from "../context/SidebarContext";
import { categories as seedCategories } from "../data/categories";

const iconOptions = ["bi-house-door-fill", "bi-lightning-charge-fill", "bi-bag-fill", "bi-gear-fill", "bi-box-seam-fill", "bi-grid-fill", "bi-cup-hot-fill", "bi-truck"];

export default function Categories() {
  const { openSidebar } = useSidebar();
  const [categories, setCategories] = useState(seedCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", icon: iconOptions[0] });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [q, setQ] = useState("");
  const filtered = categories.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()));

  const openAdd = () => { setEditing(null); setForm({ name: "", icon: iconOptions[0] }); setModalOpen(true); };
  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, icon: cat.icon }); setModalOpen(true); };

  const save = (e) => {
    e.preventDefault();
    if (editing) {
      setCategories((prev) => prev.map((c) => (c.id === editing.id ? { ...c, name: form.name, icon: form.icon } : c)));
    } else {
      setCategories((prev) => [
        ...prev,
        { id: Date.now(), slug: form.name.toLowerCase().replace(/\s+/g, "-"), name: form.name, icon: form.icon, color: "#1c6b41", bg: "#e8f5ec", companies: 0, status: "Active" },
      ]);
    }
    setModalOpen(false);
  };

  const remove = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setConfirmDeleteId(null);
  };

  return (
    <>
      <Topbar
        title="Categories"
        subtitle="Manage product/service categories."
        onMenuClick={openSidebar}
      />

      <div className="p-3 p-lg-4">
        <div className="card-surface p-0">
          <TableToolbar
            search={q}
            onSearchChange={setQ}
            searchPlaceholder="Search categories..."
            addLabel="Add Category"
            onAdd={openAdd}
          />
          <div className="table-responsive">
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Icon</th>
                  <th>Companies</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, i) => (
                  <tr key={c.id}>
                    <td className="text-muted-brand">{i + 1}</td>
                    <td className="fw-medium">{c.name}</td>
                    <td>
                      <span className="icon-circle" style={{ width: 34, height: 34, background: c.bg, color: c.color }}>
                        <i className={`bi ${c.icon}`} />
                      </span>
                    </td>
                    <td className="text-muted-brand">{c.companies}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-sm border-0 p-1" onClick={() => openEdit(c)} title="Edit">
                          <i className="bi bi-pencil text-primary-brand" />
                        </button>
                        <button className="btn btn-sm border-0 p-1" onClick={() => setConfirmDeleteId(c.id)} title="Delete">
                          <i className="bi bi-trash" style={{ color: "var(--color-danger)" }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 text-muted-brand" style={{ fontSize: "0.85rem" }}>
            Showing 1 to {filtered.length} of {filtered.length} entries
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: "rgba(14,46,28,0.4)", zIndex: 2000 }}>
          <form onSubmit={save} className="card-surface p-4 w-100" style={{ maxWidth: 420 }}>
            <p className="fw-semibold mb-3">{editing ? "Edit Category" : "Add Category"}</p>
            <div className="mb-3">
              <label className="form-label">Category Name *</label>
              <input required className="form-control" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Textiles" />
            </div>
            <div className="mb-4">
              <label className="form-label">Icon</label>
              <div className="d-flex flex-wrap gap-2">
                {iconOptions.map((icon) => (
                  <button
                    type="button"
                    key={icon}
                    onClick={() => setForm((f) => ({ ...f, icon }))}
                    className="icon-circle border-0"
                    style={{
                      width: 40, height: 40,
                      background: form.icon === icon ? "var(--color-primary)" : "var(--color-bg)",
                      color: form.icon === icon ? "#fff" : "var(--color-text)",
                    }}
                  >
                    <i className={`bi ${icon}`} />
                  </button>
                ))}
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-brand-outline rounded-3 px-3" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-brand rounded-3 px-3">Save</button>
            </div>
          </form>
        </div>
      )}

      {confirmDeleteId !== null && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: "rgba(14,46,28,0.4)", zIndex: 2000 }}>
          <div className="card-surface p-4 w-100" style={{ maxWidth: 380 }}>
            <p className="fw-semibold mb-2">Delete this category?</p>
            <p className="text-muted-brand mb-3" style={{ fontSize: "0.88rem" }}>Companies in this category will need to be reassigned.</p>
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-brand-outline rounded-3" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button className="btn rounded-3 text-white" style={{ background: "var(--color-danger)" }} onClick={() => remove(confirmDeleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
