import AdminDashboard from "../components/AdminDashboard";
import WarehouseDashboard from "../components/WarehouseDashboard";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();

    switch (user?.role) {
        case "super_admin":
            return <AdminDashboard />;

        case "company":
            return <WarehouseDashboard />;

        default:
            return <div className="p-4 text-muted-brand">Your account does not have access to a dashboard.</div>;
    }
};

export default Dashboard;
