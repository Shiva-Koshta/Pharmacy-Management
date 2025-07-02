import { useState, useEffect } from "react";
import axios from "axios";

export default function MedicineSearchAndAdd({ onAdd }) {
    const [medicines, setMedicines] = useState([]);
    const [selected, setSelected] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const res = await axios.get("http://localhost:3000/api/medicines");
            setMedicines(res.data.data);
        } catch (err) {
            console.error("Error fetching medicines", err);
        }
    };

    const handleAdd = () => {
        const med = medicines.find(m => m.id === parseInt(selected));
        if (med && quantity > 0) {
            onAdd({ ...med, quantity: parseInt(quantity) });
            setQuantity(1);
            setSelected("");
        }
    };

    return (
        <div className="flex flex-wrap gap-4 items-center mb-6">
            <select
                value={selected}
                onChange={e => setSelected(e.target.value)}
                className="px-3 py-2 border rounded w-64"
            >
                <option value="">🔍 Select Medicine</option>
                {medicines.map(m => (
                    <option key={m.id} value={m.id}>
                        {m.name} ({m.brand}) - ₹{m.mrp}
                    </option>
                ))}
            </select>
            <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="px-3 py-2 border rounded w-28"
                placeholder="Qty"
            />
            <button
                onClick={handleAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                ➕ Add
            </button>
        </div>
    );
}