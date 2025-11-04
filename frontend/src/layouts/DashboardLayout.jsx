// src/layouts/DashboardLayout.jsx

import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
import Topbar from "../components/Topbar";

const DashboardLayout = () => {
    return (
        <div className="flex flex-col h-screen">
            {/* Topbar stays at the top */}
            <Topbar />

            {/* Below Topbar: Sidebar and Main Content side by side */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar />

                {/* Main content */}
                <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
