import { useState } from "react";
import MedicineSearchAndAdd from "../../components/MedicineSearchAndAdd";
import CartList from "../../components/CartList";
import BillingSummary from "../../components/BillingSummary";

export default function BillingPage() {
    const [cart, setCart] = useState([]);

    const handleAddToCart = (item) => {
        setCart(prev => [...prev, item]);
    };

    const handleRemove = (index) => {
        setCart(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        // Placeholder: send to server or generate invoice
        console.log("Submitting bill:", cart);
        alert("Bill generated! (Check console)");
        setCart([]);
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">🧾 Billing</h2>
            <MedicineSearchAndAdd onAdd={handleAddToCart} />
            <CartList cart={cart} onRemove={handleRemove} />
            <BillingSummary cart={cart} onSubmit={handleSubmit} />
        </div>
    );
}
