import { useState } from "react";

export default function AddPurchasePage() {
    const [supplier, setSupplier] = useState("");
    const [invoiceNo, setInvoiceNo] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [medicineForm, setMedicineForm] = useState({
        name: "",
        batch_id: "",
        type: "",
        brand: "",
        expiry_date: "",
        quantity: 0,
        unit_price: 0,
        mrp: 0,
        discount: 0
    });
    const [cartItems, setCartItems] = useState([]);

    const handleAddToCart = () => {
        if (!medicineForm.name || medicineForm.quantity <= 0) return;
        setCartItems([...cartItems, medicineForm]);
        setMedicineForm({
            name: "",
            batch_id: "",
            type: "",
            brand: "",
            expiry_date: "",
            quantity: 0,
            unit_price: 0,
            mrp: 0,
            discount: 0
        });
    };

    const handleRemoveItem = (index) => {
        const newItems = [...cartItems];
        newItems.splice(index, 1);
        setCartItems(newItems);
    };

    const handleSubmit = () => {
        if (!supplier || !invoiceNo || !invoiceDate || cartItems.length === 0) {
            alert("Please fill all invoice details and add at least one medicine");
            return;
        }
        const payload = {
            supplier,
            invoiceNo,
            invoiceDate,
            medicines: cartItems
        };
        console.log("Submitting purchase:", payload);
        // Send to backend API via axios
    };

    return (
        <div className="p-6 space-y-6">
            {/* Supplier & Invoice Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label>Supplier Name</label>
                    <input
                        type="text"
                        value={supplier}
                        onChange={(e) => setSupplier(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label>Invoice No</label>
                    <input
                        type="text"
                        value={invoiceNo}
                        onChange={(e) => setInvoiceNo(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label>Invoice Date</label>
                    <input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>
            </div>

            {/* Medicine Entry Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded bg-gray-50">
                <input
                    placeholder="Medicine Name"
                    value={medicineForm.name}
                    onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                    className="p-2 border rounded"
                />
                <input
                    placeholder="Batch ID"
                    value={medicineForm.batch_id}
                    onChange={(e) => setMedicineForm({ ...medicineForm, batch_id: e.target.value })}
                    className="p-2 border rounded"
                />
                <input
                    placeholder="Type"
                    value={medicineForm.type}
                    onChange={(e) => setMedicineForm({ ...medicineForm, type: e.target.value })}
                    className="p-2 border rounded"
                />
                <input
                    placeholder="Brand"
                    value={medicineForm.brand}
                    onChange={(e) => setMedicineForm({ ...medicineForm, brand: e.target.value })}
                    className="p-2 border rounded"
                />
                <input
                    type="date"
                    value={medicineForm.expiry_date}
                    onChange={(e) => setMedicineForm({ ...medicineForm, expiry_date: e.target.value })}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Qty"
                    value={medicineForm.quantity}
                    onChange={(e) => setMedicineForm({ ...medicineForm, quantity: parseInt(e.target.value) })}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Unit Price"
                    value={medicineForm.unit_price}
                    onChange={(e) => setMedicineForm({ ...medicineForm, unit_price: parseFloat(e.target.value) })}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="MRP"
                    value={medicineForm.mrp}
                    onChange={(e) => setMedicineForm({ ...medicineForm, mrp: parseFloat(e.target.value) })}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="Discount"
                    value={medicineForm.discount}
                    onChange={(e) => setMedicineForm({ ...medicineForm, discount: parseFloat(e.target.value) })}
                    className="p-2 border rounded"
                />
                <button
                    onClick={handleAddToCart}
                    className="bg-green-500 text-white px-4 py-2 rounded self-end"
                >
                    ➕ Add to Cart
                </button>
            </div>

            {/* Cart Table */}
            {cartItems.length > 0 && (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-blue-100">
                                <th>Name</th>
                                <th>Batch</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>MRP</th>
                                <th>Expiry</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td>{item.name}</td>
                                    <td>{item.batch_id}</td>
                                    <td>{item.quantity}</td>
                                    <td>₹{item.unit_price}</td>
                                    <td>₹{item.mrp}</td>
                                    <td>{item.expiry_date}</td>
                                    <td>
                                        <button
                                            onClick={() => handleRemoveItem(idx)}
                                            className="text-red-500 hover:underline"
                                        >
                                            ❌ Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-4 text-right">
                        <button
                            onClick={handleSubmit}
                            className="bg-blue-600 text-white px-6 py-2 rounded"
                        >
                            ✅ Submit Purchase Entry
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
