import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import AdminMap from "../components/AdminMap";
import { useSidebar } from "../context/SidebarContext";
import { companies, TOTAL_COMPANIES } from "../data/companies";
import { categories } from "../data/categories";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function WarehouseDashboard() {
  const { openSidebar } = useSidebar();
  const recent = [...companies].sort((a, b) => new Date(b.addedOn) - new Date(a.addedOn)).slice(0, 3);
  const activeCount = companies.filter((c) => c.status === "Active").length;
  const activePct = ((activeCount / companies.length) * 100).toFixed(1);

  const chartData = categories.map((c) => ({ name: c.name, value: c.companies, color: c.color }));
  const totalCatCompanies = chartData.reduce((s, d) => s + d.value, 0);
  const { user } = useAuth();
  const [companyName, setCompanyName] = useState("");
  const [message, setMessage] = useState("");
  const isAdmin = user?.role === "super_admin";

  const getCompanyName = async () => {
    try {
      const response = await api.get("/api/auth/company-name");
      setCompanyName(response.company_name);
    } catch (error) {
      console.error("Error fetching company name:", error);
    } 
  }
    useEffect(() => {
      if (!isAdmin) {
        getCompanyName();
      }
    }, [isAdmin]);

  return (
    <>
      <Topbar title="Dashboard" subtitle={isAdmin ? " Wholesale Locator Platform" : ` ${companyName}`} onMenuClick={openSidebar} />

      <div className="p-3 p-lg-4">
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <StatCard icon="bi-building" label="Total Companies" value={TOTAL_COMPANIES} delta="+12 this month" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard icon="bi-check-circle-fill" label="Active Companies" value={`${Math.round(TOTAL_COMPANIES * 0.875)}`} delta={`${activePct}%`} color="#1f9d55" bg="#e7f7ef" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard icon="bi-grid-3x3-gap-fill" label="Categories" value={categories.length} delta="+2 this month" color="#2f6fed" bg="#e9f0ff" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard icon="bi-people-fill" label="Total Users" value="250" delta="+18 this month" color="#7a5cd6" bg="#f0ecfd" />
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-lg-5">
            <div className="card-surface p-3 h-100">
              <p className="fw-semibold mb-3">Companies by Category</p>
              <div className="d-flex align-items-center">
                <div style={{ width: 140, height: 140 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={chartData} dataKey="value" innerRadius={38} outerRadius={62} paddingAngle={2}>
                        {chartData.map((d) => (
                          <Cell key={d.name} fill={d.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => `${v} companies`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-fill ps-3">
                  {chartData.map((d) => (
                    <div key={d.name} className="d-flex align-items-center justify-content-between mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, display: "inline-block" }} />
                        <span style={{ fontSize: "0.82rem" }}>{d.name}</span>
                      </div>
                      <span className="text-muted-brand" style={{ fontSize: "0.8rem" }}>
                        {d.value} ({((d.value / totalCatCompanies) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-7">
            <div className="card-surface p-3 h-100">
              <p className="fw-semibold mb-3">Company Locations Overview</p>
              <AdminMap companies={companies} height={230} zoom={13} />
            </div>
          </div>
        </div>

        <div className="card-surface p-3">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <p className="fw-semibold mb-0">Recent Added Companies</p>
            <Link to="/companies" className="text-primary-brand fw-semibold" style={{ fontSize: "0.85rem" }}>View all</Link>
          </div>
          <div className="table-responsive">
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Category</th>
                  <th>Phone</th>
                  <th>Added On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((c) => (
                  <tr key={c.id}>
                    <td className="fw-medium">{c.name}</td>
                    <td className="text-muted-brand">{categories.find((cat) => cat.slug === c.category)?.name}</td>
                    <td className="text-muted-brand">{c.phone}</td>
                    <td className="text-muted-brand">{new Date(c.addedOn).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
