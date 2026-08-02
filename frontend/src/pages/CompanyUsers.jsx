import { useMemo, useState, useEffect } from "react";
import Topbar from "../components/Topbar";
import TableToolbar from "../components/TableToolbar";
import Avatar from "../components/Avatar";
import { useSidebar } from "../context/SidebarContext";
import { api } from "../api/client";
import { useModal } from "../context/ModalContext";

export default function CompanyUsers() {
  const { openSidebar } = useSidebar();
  const [users, setUsers] = useState([]); // Replace with actual data fetching logic
  const [q, setQ] = useState("");
  const {showModal} = useModal();
  const [message, setMessage] = useState("");

  const fetchAdmins = async () => {
    try {
     const admins = await api.get("/api/auth/company-admins");
      setUsers(Array.isArray(admins) ? admins : []);
    } catch (error) {
       showModal(error.message || "Could not load users.", { type: "error", title: "Error", 
        autoClose: true, autoCloseDelay: 2000, confirmText: false });
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const filtered = useMemo(
    () =>
      users.filter(
        (u) =>
          !q ||
          u.name?.toLowerCase().includes(q.toLowerCase()) ||
          u.email?.toLowerCase().includes(q.toLowerCase()),
      ),
    [users, q],
  );

  return (
    <>
      <Topbar
        title="Users"
        subtitle="Manage user accounts."
        onMenuClick={openSidebar}
      />

      <div className="p-3 p-lg-4">
        <div className="card-surface p-0">
          <TableToolbar
            search={q}
            onSearchChange={setQ}
            searchPlaceholder="Search name or email..."
            addLabel="Add User"
            onAdd={() => {}}
          />
          {message && <p
            className={`mt-3 mb-0 ${
              message.toLowerCase().includes("success")
                ? "text-success"
                : "text-danger"
            }`}
          >
            {message}
          </p>}
          <div className="table-responsive">
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Login</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td className="text-muted-brand">{i + 1}</td>
                    <td className="d-flex align-items-center gap-2 fw-medium">
                      <Avatar name={u.name} photo={u.photo ?? u.avatar ?? u.profile_photo ?? u.image ?? u.image_url ?? u.imageUrl} size={30} />
                      {u.name}
                    </td>
                    <td className="text-muted-brand">{u.email}</td>
                    <td className="text-muted-brand">{u.role}</td>
                    <td className="text-muted-brand">
                      {u.last_login
                        ? new Date(u.last_login).toLocaleString()
                        : "Never"}
                    </td>

                    <td className="text-muted-brand">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm border-0 p-1"
                          title="Edit"
                        >
                          <i className="bi bi-pencil text-primary-brand" />
                        </button>
                        <button
                          className="btn btn-sm border-0 p-1"
                          title="Delete"
                        >
                          <i
                            className="bi bi-trash"
                            style={{ color: "var(--color-danger)" }}
                          />
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
    </>
  );
}
