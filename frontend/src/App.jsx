import { Navigate, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Companies from "./pages/Companies";
import CompanyForm from "./pages/CompanyForm";
import CompanyView from "./pages/CompanyView";
import Categories from "./pages/Categories";
import MapManage from "./pages/MapManage";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Settings from "./pages/Settings";

function MyWarehouseRedirect() {
  const { user } = useAuth();
  if (!user?.companyId) return <Navigate to="/" replace />;
  return <Navigate to={`/companies/${user.companyId}/edit`} replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Navigate to="/login" replace />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-company" element={<MyWarehouseRedirect />} />

          {/* Full company directory: super admin only */}
          <Route path="/companies" element={<ProtectedRoute roles={["super_admin"]}><Companies /></ProtectedRoute>} />
          <Route path="/companies/new" element={<ProtectedRoute roles={["super_admin"]}><CompanyForm /></ProtectedRoute>} />
          <Route path="/companies/:id" element={<ProtectedRoute roles={["super_admin"]}><CompanyView /></ProtectedRoute>} />
          {/* Edit is shared: a company account may only edit its own id (enforced inside CompanyForm) */}
          <Route path="/companies/:id/edit" element={<CompanyForm />} />

          <Route path="/categories" element={<ProtectedRoute roles={["super_admin"]}><Categories /></ProtectedRoute>} />
          <Route path="/map" element={<MapManage />} />
          <Route path="/reports" element={<ProtectedRoute roles={["super_admin"]}><Reports /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute roles={["super_admin"]}><Users /></ProtectedRoute>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </>
  );
}
