export default function PurchaseCard({ purchase }) {
    return (
        <div className="border border-gray-200 rounded p-3 mb-2">
            <div className="font-medium">{purchase.medicine_name}</div>
            <div className="text-sm text-gray-600">
                Quantity: {purchase.quantity} | Supplier: {purchase.supplier}
            </div>
            <div className="text-xs text-gray-500">
                Date: {purchase.invoice_date}
            </div>
        </div>
    );
}
