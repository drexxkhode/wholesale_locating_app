import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Topbar from "../components/Topbar";
import TableToolbar from "../components/TableToolbar";
import { useSidebar } from "../context/SidebarContext";
import { api } from "../api/client";

export default function CompanyProducts() {
  const { openSidebar } = useSidebar();
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ product_name: "", quantity: 0 });
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [q, setQ] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const filtered = products.filter((p) => !q || (p.product_name || "").toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    if (!id) return;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await api.get(`/api/company/products/${id}`);
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        setMessage(error.message || "Could not load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [id]);

  const openAdd = () => { setEditing(null); setForm({ product_name: "", quantity: 0 }); setModalOpen(true); };
  const openEdit = (prod) => { setEditing(prod); setForm({ product_name: prod.product_name, quantity: prod.quantity || 0 }); setModalOpen(true); };

  const save = async (event) => {
    event.preventDefault();
    if (!id) return;

    try {
      if (editing) {
        await api.put(`/api/company/products/${editing.id}`, {
          company_id: id,
          product_name: form.product_name,
          quantity: Number(form.quantity || 0),
        });
        setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, product_name: form.product_name, quantity: Number(form.quantity || 0) } : p)));
      } else {
        const created = await api.post(`/api/company/new-product`, {
          company_id: id,
          product_name: form.product_name,
          quantity: Number(form.quantity || 0),
        });
        setProducts((prev) => [
          ...prev,
          { id: created.id, company_id: id, product_name: form.product_name, quantity: Number(form.quantity || 0), added_at: new Date().toISOString() },
        ]);
      }
      setModalOpen(false);
      setMessage(editing ? "Product updated." : "Product added.");
    } catch (error) {
      setMessage(error.message || "Could not save product.");
    }
  };

  const remove = async (productId) => {
    try {
      await api.del(`/api/company/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setConfirmDeleteId(null);
      setMessage("Product removed.");
    } catch (error) {
      setMessage(error.message || "Could not delete product.");
    }
  };

  return (
    <>
      <Topbar
        title="Products & Services"
        subtitle="Manage product/service listings."
        onMenuClick={openSidebar}
      />

      <div className="p-3 p-lg-4">
        <div className="card-surface p-0">
          <TableToolbar
            search={q}
            onSearchChange={setQ}
            searchPlaceholder="Search products..."
            addLabel="Add Product"
            onAdd={openAdd}
          />
          {message && <div className="alert-brand-danger mx-3 mt-3" style={{ fontSize: "0.82rem" }}>{message}</div>}
          <div className="table-responsive">
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Added At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted-brand py-4">Loading products...</td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center text-muted-brand py-4">No products yet.</td>
                  </tr>
                ) : filtered.map((c, i) => (
                  <tr key={c.id}>
                    <td className="text-muted-brand">{i + 1}</td>
                    <td className="fw-medium">{c.product_name}</td>
                    <td className="text-muted-brand">{c.quantity}</td>
                    <td className="text-muted-brand">{c.created_at
                        ? new Date(c.created_at).toLocaleDateString() + " " + new Date(c.created_at).toLocaleTimeString()
                        : "-"}</td>
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
            Showing {filtered.length} entr{filtered.length === 1 ? "y" : "ies"}
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3" style={{ background: "rgba(14,46,28,0.4)", zIndex: 2000 }}>
          <form onSubmit={save} className="card-surface p-4 w-100" style={{ maxWidth: 420 }}>
            <p className="fw-semibold mb-3">{editing ? "Edit Product" : "Add Product"}</p>
            <div className="mb-3">
              <label className="form-label">Product Name *</label>
              <input required className="form-control" value={form.product_name} onChange={(e) => setForm((f) => ({ ...f, product_name: e.target.value }))} placeholder="e.g. Textiles" />
            </div>
            <div className="mb-4">
              <label className="form-label">Quantity *</label>
              <input required className="form-control" type="number" value={form.quantity} onChange={(e) => setForm((f) => ({ ...f, quantity: parseInt(e.target.value) }))} placeholder="e.g. 100" />
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
            <p className="fw-semibold mb-2">Delete this product?</p>
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
