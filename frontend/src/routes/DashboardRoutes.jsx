import { Route, Routes } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/dashboard/Home";
import Inventory from "../pages/dashboard/Inventory";
import Purchases from "../pages/dashboard/purchases/Purchases";
import Billing from "../pages/dashboard/Billing";
import Reports from "../pages/dashboard/Reports";
// import Notifications from "@/pages/Dashboard/Notifications";
export default function DashboardRoutes() {
    return (
        <Routes>
            <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Home />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="purchases" element={<Purchases />} />
                <Route path="billing" element={<Billing />} />
                <Route path="reports" element={<Reports />} />
                <Route path="notifications" element={<Notifications />} />
            </Route>
        </Routes>
    );
}
