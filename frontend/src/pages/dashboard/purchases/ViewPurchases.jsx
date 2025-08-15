// pages/dashboard/purchases/ViewPurchases.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import PurchaseCard from "../../../components/PurchaseCard";

export default function ViewPurchases() {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        start_date: "",
        end_date: "",
        supplier_name: "",
        medicine_name: "",
        invoice_number: ""
    });

    useEffect(() => {
        fetchPurchases();
    }, [filters]);

    const fetchPurchases = async () => {
        try {
            setLoading(true);
            
            // Build query parameters
            const params = new URLSearchParams();
            Object.keys(filters).forEach(key => {
                if (filters[key]) {
                    params.append(key, filters[key]);
                }
            });
            
            const res = await axios.get(`http://localhost:5000/apiv1/purchase?${params.toString()}`, {
                withCredentials: true
            });
            setPurchases(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch purchases:", err);
            setPurchases([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setFilters({
            start_date: "",
            end_date: "",
            supplier_name: "",
            medicine_name: "",
            invoice_number: ""
        });
    };

    return (
        <div className="p-6">
            {/* Filter Controls */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Filter Purchases</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={filters.start_date}
                            onChange={e => handleFilterChange('start_date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            value={filters.end_date}
                            onChange={e => handleFilterChange('end_date', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name</label>
                        <input
                            type="text"
                            value={filters.supplier_name}
                            onChange={e => handleFilterChange('supplier_name', e.target.value)}
                            placeholder="Search supplier..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                        <input
                            type="text"
                            value={filters.medicine_name}
                            onChange={e => handleFilterChange('medicine_name', e.target.value)}
                            placeholder="Search medicine..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                        <input
                            type="text"
                            value={filters.invoice_number}
                            onChange={e => handleFilterChange('invoice_number', e.target.value)}
                            placeholder="Search invoice..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="mt-4">
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Clear All Filters
                    </button>
                </div>
            </div>

            {/* Purchase List */}
            {loading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading purchases...</span>
                </div>
            ) : purchases.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No purchases found for selected filters.</p>
                    <button
                        onClick={clearFilters}
                        className="mt-2 text-blue-600 hover:text-blue-800 underline"
                    >
                        Clear filters to see all purchases
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Purchase Records ({purchases.length})</h3>
                    </div>
                    {purchases.map((purchase) => (
                        <PurchaseCard key={purchase.id} purchase={purchase} />
                    ))}
                </div>
            )}
        </div>
    );
}
