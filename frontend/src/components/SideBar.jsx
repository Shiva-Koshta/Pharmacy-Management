// src/components/Sidebar.jsx
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const navItems = [
        { path: "/dashboard", label: "Home" },
        { path: "/dashboard/inventory", label: "Inventory" },
        { path: "/dashboard/purchases", label: "Purchases" },
        { path: "/dashboard/billing", label: "Billing" },
    ];

    return (
        <aside className="w-64 h-screen bg-blue-900 text-white p-4">
            <h2 className="text-2xl font-bold mb-6">Pharmacy</h2>
            <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `px-4 py-2 rounded hover:bg-blue-700 ${isActive ? "bg-blue-700" : ""
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
