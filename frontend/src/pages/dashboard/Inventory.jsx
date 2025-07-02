import { useEffect, useState } from "react";
import axios from "axios";
import FilterBar from "../../components/FilterBar";

export default function Inventory() {
    const [medicines, setMedicines] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [filters, setFilters] = useState({
        query: "",
        brand: "",
        type: "",
        expiry: "all",
        minQty: "",
    });

    useEffect(() => {
        fetchMedicines();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, medicines]);

    const fetchMedicines = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/medicines");
            setMedicines(res.data.data);
        } catch (err) {
            console.error("Failed to fetch medicines", err);
        }
    };

    const applyFilters = () => {
        let data = [...medicines];
        const now = new Date();

        const { query, brand, type, expiry, minQty } = filters;

        if (query?.trim()) {
            data = data.filter(m =>
                m.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (brand?.trim()) {
            data = data.filter(m =>
                m.brand?.toLowerCase().includes(brand.toLowerCase())
            );
        }

        if (type?.trim()) {
            data = data.filter(m =>
                m.type?.toLowerCase().includes(type.toLowerCase())
            );
        }

        if (expiry !== "all") {
            if (expiry === "expired") {
                data = data.filter(m => m.expiry_date && new Date(m.expiry_date) < now);
            } else if (expiry === "valid") {
                data = data.filter(m => m.expiry_date && new Date(m.expiry_date) > now);
            } else if (expiry === "soon") {
                const soon = new Date();
                soon.setDate(now.getDate() + 30);
                data = data.filter(m =>
                    m.expiry_date &&
                    new Date(m.expiry_date) > now &&
                    new Date(m.expiry_date) <= soon
                );
            }
        }

        if (minQty) {
            data = data.filter(m => m.quantity >= parseInt(minQty));
        }

        setFiltered(data);
    };

    return (
        <div className="p-6">
            {/* FilterBar */}
            <div className="mb-4">
                <FilterBar
                    showDateRange={false}
                    showSupplier={false}
                    showSearch={true}
                    filters={filters}
                    setFilters={setFilters}
                    onSearch={applyFilters}
                />
            </div>

            {/* Extra mini filters (optional) */}
            <div className="flex flex-wrap gap-2 mb-3">
                <input
                    type="text"
                    value={filters.brand}
                    onChange={(e) => setFilters(prev => ({ ...prev, brand: e.target.value }))}
                    placeholder="🏷️ Brand"
                    className="px-2 py-1 text-sm border border-gray-300 rounded w-28"
                />
                <input
                    type="text"
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                    placeholder="💊 Type"
                    className="px-2 py-1 text-sm border border-gray-300 rounded w-28"
                />
                <select
                    value={filters.expiry}
                    onChange={(e) => setFilters(prev => ({ ...prev, expiry: e.target.value }))}
                    className="px-2 py-1 text-sm border border-gray-300 rounded w-36"
                >
                    <option value="all">⏳ All Expiry</option>
                    <option value="expired">❌ Expired</option>
                    <option value="valid">✅ Valid</option>
                    <option value="soon">⚠️ Expiring Soon</option>
                </select>
                <input
                    type="number"
                    min="0"
                    value={filters.minQty}
                    onChange={(e) => setFilters(prev => ({ ...prev, minQty: e.target.value }))}
                    placeholder="📦 Min Qty"
                    className="px-2 py-1 text-sm border border-gray-300 rounded w-28"
                />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded shadow">
                    <thead className="bg-blue-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Brand</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Batch ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Quantity</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">MRP (₹)</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Expiry</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-500">
                                    No medicines found
                                </td>
                            </tr>
                        ) : (
                            filtered.map((med) => (
                                <tr key={med.id} className="hover:bg-gray-50 border-t">
                                    <td className="px-6 py-3 text-sm text-gray-800">{med.name}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">{med.type || '-'}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">{med.brand || '-'}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">{med.batch_id || '-'}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">{med.quantity}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">₹{med.mrp}</td>
                                    <td className="px-6 py-3 text-sm text-gray-800">
                                        {med.expiry_date
                                            ? new Date(med.expiry_date).toLocaleDateString()
                                            : '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
