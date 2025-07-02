// pages/dashboard/purchases/ViewPurchases.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import PurchaseCard from "../../../components/PurchaseCard";

export default function ViewPurchases() {
    const [purchases, setPurchases] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [supplier, setSupplier] = useState("");

    useEffect(() => {
        fetchPurchases();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [startDate, endDate, supplier, purchases]);

    const fetchPurchases = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/purchases");
            setPurchases(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch purchases:", err);
        }
    };

    const applyFilters = () => {
        let data = [...purchases];

        if (startDate) {
            data = data.filter(p => new Date(p.invoice_date) >= new Date(startDate));
        }

        if (endDate) {
            data = data.filter(p => new Date(p.invoice_date) <= new Date(endDate));
        }

        if (supplier.trim()) {
            data = data.filter(p =>
                p.supplier_name?.toLowerCase().includes(supplier.toLowerCase())
            );
        }

        setFiltered(data);
    };

    const clearFilters = () => {
        setStartDate("");
        setEndDate("");
        setSupplier("");
    };

    return (
        <div className="p-6">
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 mb-6 items-center">
                <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded"
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded"
                />
                <input
                    type="text"
                    value={supplier}
                    onChange={e => setSupplier(e.target.value)}
                    placeholder="🏢 Supplier Name"
                    className="px-4 py-2 border border-gray-300 rounded w-44"
                />
                <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border rounded text-sm"
                >
                    Clear Filters
                </button>
            </div>

            {/* Purchase List */}
            {filtered.length === 0 ? (
                <p className="text-gray-500">No purchases found for selected filters.</p>
            ) : (
                filtered.map((purchase, idx) => (
                    <PurchaseCard key={idx} purchase={purchase} />
                ))
            )}
        </div>
    );
}
