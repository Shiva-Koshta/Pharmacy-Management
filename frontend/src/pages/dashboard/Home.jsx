import { useEffect, useState } from "react";
import axios from "axios";
import LowStockCard from "../../components/LowStockCard";
import ExpiringSoonCard from "../../components/ExpiringSoonCard";
import ExpiredCard from "../../components/ExpiredCard";
import StatCard from "../../components/StatCard";
import QuickActions from "../../components/QuickActions";

export default function HomePage() {
    const [lowStockMeds, setLowStockMeds] = useState([]);
    const [expiredMeds, setExpiredMeds] = useState([]);
    const [expiringSoonMeds, setExpiringSoonMeds] = useState([]);
    const [validCount, setValidCount] = useState(0);

    useEffect(() => {
        fetchMedicineStats();
    }, []);

    const fetchMedicineStats = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/medicines");
            const meds = res.data.data || [];

            const now = new Date();
            const soon = new Date();
            soon.setDate(now.getDate() + 30);

            const lowStock = meds.filter((m) => m.quantity < 10);
            const expired = meds.filter((m) => new Date(m.expiry_date) < now);
            const expiringSoon = meds.filter((m) =>
                new Date(m.expiry_date) > now && new Date(m.expiry_date) <= soon
            );
            const valid = meds.filter((m) => new Date(m.expiry_date) > soon);

            setLowStockMeds(lowStock);
            setExpiredMeds(expired);
            setExpiringSoonMeds(expiringSoon);
            setValidCount(valid.length);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Welcome to Your Pharmacy Dashboard</h1>
            <p className="text-gray-500">Today is {new Date().toDateString()}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    label="Total Medicines"
                    value={
                        lowStockMeds.length +
                        expiredMeds.length +
                        expiringSoonMeds.length +
                        validCount
                    }
                    icon="💊"
                    bg="bg-blue-100"
                />
                <StatCard
                    label="Valid Medicines"
                    value={validCount}
                    icon="✅"
                    bg="bg-green-100"
                />
                <StatCard
                    label="Purchases"
                    value={0}
                    icon="🧾"
                    bg="bg-gray-100"
                />

            </div>

            {/* Collapsible Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <LowStockCard count={lowStockMeds.length} medicines={lowStockMeds} />
                <ExpiringSoonCard count={expiringSoonMeds.length} medicines={expiringSoonMeds} />
                <ExpiredCard count={expiredMeds.length} medicines={expiredMeds} />
            </div>

            <QuickActions />
        </div>
    );
}
