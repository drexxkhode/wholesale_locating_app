import { useMemo, useState } from "react";
import Topbar from "../components/Topbar";
import StatusBadge from "../components/StatusBadge";
import TableToolbar from "../components/TableToolbar";
import { useSidebar } from "../context/SidebarContext";
import { users as seedUsers } from "../data/users";

export default function Users() {
  const { openSidebar } = useSidebar();
  const [users] = useState(seedUsers);
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () => users.filter((u) => !q || u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())),
    [users, q]
  );

  return (
    <>
      <Topbar
        title="Users"
        subtitle="Manage admin, staff, and warehouse accounts."
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
          <div className="table-responsive">
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Login</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u.id}>
                    <td className="text-muted-brand">{i + 1}</td>
                    <td className="d-flex align-items-center gap-2 fw-medium">
                      <span className="icon-circle bg-primary-brand text-white" style={{ width: 30, height: 30, fontSize: "0.75rem" }}>
                        {u.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                      {u.name}
                    </td>
                    <td className="text-muted-brand">{u.email}</td>
                    <td className="text-muted-brand">{u.role}</td>
                    <td className="text-muted-brand">{u.lastLogin}</td>
                    <td><StatusBadge status={u.status} /></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-sm border-0 p-1" title="Edit"><i className="bi bi-pencil text-primary-brand" /></button>
                        <button className="btn btn-sm border-0 p-1" title="Delete"><i className="bi bi-trash" style={{ color: "var(--color-danger)" }} /></button>
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
