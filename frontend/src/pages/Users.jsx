import { useEffect, useMemo, useState } from "react";
import Topbar from "../components/Topbar";
import TableToolbar from "../components/TableToolbar";
import Avatar from "../components/Avatar";
import { useSidebar } from "../context/SidebarContext";
import { api } from "../api/client";

const getInitials = (name = "") => name.split(" ").filter(Boolean).map((part) => part[0]).slice(0, 2).join("").toUpperCase();

export default function Users() {
  const { openSidebar } = useSidebar();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/api/auth/admins")
      .then((admins) => setUsers(Array.isArray(admins) ? admins : []))
      .catch((error) => setMessage(error.message));
  }, []);

  const filtered = useMemo(() => users.filter((user) => {
    const query = q.toLowerCase();
    return !query || user.name?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query);
  }), [users, q]);

  return <>
    <Topbar title="Users" subtitle="Manage admin, staff, and warehouse accounts." onMenuClick={openSidebar} />
    <div className="p-3 p-lg-4"><div className="card-surface p-0">
      <TableToolbar search={q} onSearchChange={setQ} searchPlaceholder="Search name or email..." addLabel="Add User" onAdd={() => {}} />
      {message && <p className="mt-3 mb-0 text-danger">{message}</p>}
      <div className="table-responsive"><table className="table admin-table mb-0"><thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Last Login</th><th>Created At</th><th>Actions</th></tr></thead>
        <tbody>{filtered.map((user, index) => <tr key={user.id}>
          <td className="text-muted-brand">{index + 1}</td>
          <td className="d-flex align-items-center gap-2 fw-medium"><Avatar name={user.name} photo={user.photo ?? user.avatar ?? user.profile_photo ?? user.image ?? user.image_url ?? user.imageUrl} size={30} />{user.name}</td>
          <td className="text-muted-brand">{user.email}</td><td className="text-muted-brand">{user.role}</td>
          <td className="text-muted-brand">{user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}</td>
          <td className="text-muted-brand">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}</td>
          <td><div className="d-flex align-items-center gap-2"><button className="btn btn-sm border-0 p-1" title="Edit"><i className="bi bi-pencil text-primary-brand" /></button><button className="btn btn-sm border-0 p-1" title="Delete"><i className="bi bi-trash" style={{ color: "var(--color-danger)" }} /></button></div></td>
        </tr>)}</tbody>
      </table></div>
      <div className="p-3 text-muted-brand" style={{ fontSize: "0.85rem" }}>Showing 1 to {filtered.length} of {filtered.length} entries</div>
    </div></div>
  </>;
}
