export default function CartList({ cart, onRemove }) {
    return (
        <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-300 bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2">Name</th>
                        <th className="px-4 py-2">Brand</th>
                        <th className="px-4 py-2">MRP</th>
                        <th className="px-4 py-2">Qty</th>
                        <th className="px-4 py-2">Subtotal</th>
                        <th className="px-4 py-2">Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, idx) => (
                        <tr key={idx} className="text-center border-t">
                            <td className="px-4 py-2">{item.name}</td>
                            <td className="px-4 py-2">{item.brand}</td>
                            <td className="px-4 py-2">₹{item.mrp}</td>
                            <td className="px-4 py-2">{item.quantity}</td>
                            <td className="px-4 py-2">₹{item.quantity * item.mrp}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => onRemove(idx)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    ❌
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
