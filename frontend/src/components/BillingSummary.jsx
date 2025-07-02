export default function BillingSummary({ cart, onSubmit }) {
    const total = cart.reduce((sum, item) => sum + item.mrp * item.quantity, 0);

    return (
        <div className="flex justify-between items-center border-t pt-4 mt-4">
            <div className="text-lg font-semibold">Total: ₹{total}</div>
            <button
                onClick={onSubmit}
                disabled={!cart.length}
                className="px-6 py-2 bg-green-600 text-white rounded disabled:opacity-50"
            >
                🧾 Generate Bill
            </button>
        </div>
    );
}
