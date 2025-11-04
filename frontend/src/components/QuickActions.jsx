import { Link } from "react-router-dom";

const actions = [
    { label: "Add Medicine", to: "/dashboard/inventory" },
    { label: "Add Purchase", to: "/dashboard/purchases" },
    { label: "Generate Bill", to: "/dashboard/billing" },
    { label: "View Inventory", to: "/dashboard/inventory" },
];

export default function QuickActions() {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {actions.map((action, i) => (
                <Link
                    key={i}
                    to={action.to}
                    className="bg-white p-3 rounded-xl border hover:shadow-md transition text-center text-sm font-medium text-gray-700"
                >
                    {action.label}
                </Link>
            ))}
        </div>
    );
}