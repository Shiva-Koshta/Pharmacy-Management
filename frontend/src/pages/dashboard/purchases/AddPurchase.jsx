import { useState, useEffect } from "react";
import axios from "axios";

export default function AddPurchasePage() {
    const [supplier, setSupplier] = useState("");
    const [suppliers, setSuppliers] = useState([]);
    const [invoiceNo, setInvoiceNo] = useState("");
    const [invoiceDate, setInvoiceDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [medicineForm, setMedicineForm] = useState({
        name: "",
        batch_id: "",
        type: "",
        brand: "",
        expiry_date: "",
        quantity: 1,
        unit_price: 0,
        mrp: 0,
        discount: 0
    });
    const [cartItems, setCartItems] = useState([]);

    // Fetch suppliers on component mount
    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/apiv1/purchase/suppliers", {
                withCredentials: true
            });
            setSuppliers(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch suppliers:", err);
        }
    };

    const handleAddToCart = () => {
        if (!medicineForm.name || medicineForm.quantity <= 0 || medicineForm.unit_price <= 0) {
            alert("Please fill all required medicine fields (name, quantity > 0, unit price > 0)");
            return;
        }
        
        // Add unique ID for easier management
        const medicineWithId = {
            ...medicineForm,
            id: Date.now() + Math.random()
        };
        
        setCartItems([...cartItems, medicineWithId]);
        setMedicineForm({
            name: "",
            batch_id: "",
            type: "",
            brand: "",
            expiry_date: "",
            quantity: 1,
            unit_price: 0,
            mrp: 0,
            discount: 0
        });
    };

    const handleRemoveItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleSubmit = async () => {
        if (!supplier || !invoiceNo || !invoiceDate || cartItems.length === 0) {
            alert("Please fill all invoice details and add at least one medicine");
            return;
        }

        const payload = {
            supplier_name: supplier,
            invoice_number: invoiceNo,
            purchase_date: invoiceDate,
            medicines: cartItems.map(item => ({
                name: item.name,
                brand: item.brand || null,
                batch_id: item.batch_id || null,
                type: item.type || null,
                expiry_date: item.expiry_date || null,
                quantity: parseInt(item.quantity),
                unit_price: parseFloat(item.unit_price),
                mrp: item.mrp ? parseFloat(item.mrp) : null,
                discount: item.discount ? parseFloat(item.discount) : 0
            }))
        };

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:5000/apiv1/purchase", payload, {
                withCredentials: true
            });

            if (response.data.success) {
                alert(`Purchase created successfully! ${response.data.message}`);
                // Reset form
                setSupplier("");
                setInvoiceNo("");
                setInvoiceDate("");
                setCartItems([]);
            } else {
                alert("Failed to create purchase: " + response.data.message);
            }
        } catch (error) {
            console.error("Purchase creation error:", error);
            alert("Error creating purchase: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            return total + (item.quantity * item.unit_price);
        }, 0).toFixed(2);
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-2xl font-semibold text-blue-800">Add New Purchase</h2>
                <p className="text-blue-600 mt-1">Enter supplier details and add medicines to create a purchase record</p>
            </div>

            {/* Supplier & Invoice Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Invoice Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Name *</label>
                        <div className="relative">
                            <input
                                list="suppliers"
                                type="text"
                                value={supplier}
                                onChange={(e) => setSupplier(e.target.value)}
                                placeholder="Select or enter supplier name"
                                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                            <datalist id="suppliers">
                                {suppliers.map((sup) => (
                                    <option key={sup.supplier_id} value={sup.name} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number *</label>
                        <input
                            type="text"
                            value={invoiceNo}
                            onChange={(e) => setInvoiceNo(e.target.value)}
                            placeholder="Enter invoice number"
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date *</label>
                        <input
                            type="date"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                            className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Medicine Entry Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-4">Add Medicine</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
                        <input
                            type="text"
                            placeholder="Enter medicine name"
                            value={medicineForm.name}
                            onChange={(e) => setMedicineForm({ ...medicineForm, name: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input
                            type="text"
                            placeholder="Brand name"
                            value={medicineForm.brand}
                            onChange={(e) => setMedicineForm({ ...medicineForm, brand: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID</label>
                        <input
                            type="text"
                            placeholder="Batch number"
                            value={medicineForm.batch_id}
                            onChange={(e) => setMedicineForm({ ...medicineForm, batch_id: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                        <input
                            type="number"
                            min="1"
                            placeholder="Quantity"
                            value={medicineForm.quantity}
                            onChange={(e) => setMedicineForm({ ...medicineForm, quantity: parseInt(e.target.value) || 0 })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price *</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Price per unit"
                            value={medicineForm.unit_price}
                            onChange={(e) => setMedicineForm({ ...medicineForm, unit_price: parseFloat(e.target.value) || 0 })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="Maximum retail price"
                            value={medicineForm.mrp}
                            onChange={(e) => setMedicineForm({ ...medicineForm, mrp: parseFloat(e.target.value) || 0 })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            placeholder="Discount percentage"
                            value={medicineForm.discount}
                            onChange={(e) => setMedicineForm({ ...medicineForm, discount: parseFloat(e.target.value) || 0 })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                            type="date"
                            value={medicineForm.expiry_date}
                            onChange={(e) => setMedicineForm({ ...medicineForm, expiry_date: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-md font-medium transition-colors"
                        >
                            ➕ Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Cart Table */}
            {cartItems.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-lg font-semibold mb-4">Purchase Items ({cartItems.length})</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicine Name</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {cartItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {item.brand || '-'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {item.batch_id || '-'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                            ₹{parseFloat(item.unit_price).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                                            ₹{(item.quantity * item.unit_price).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                                            <button
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Summary and Submit */}
                    <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-gray-700">Total Amount:</span>
                            <span className="text-2xl font-semibold text-blue-600">₹{calculateTotal()}</span>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className={`px-8 py-3 rounded-md font-medium text-white transition-colors ${
                                    loading 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                                        Processing...
                                    </>
                                ) : (
                                    '✅ Submit Purchase Entry'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {cartItems.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <p className="text-gray-500 text-lg">No medicines added yet</p>
                    <p className="text-gray-400 text-sm">Add medicines using the form above to create a purchase record</p>
                </div>
            )}
        </div>
    );
}
