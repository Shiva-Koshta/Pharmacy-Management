export default function PurchaseCard({ purchase }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        if (!amount) return '₹0.00';
        return `₹${parseFloat(amount).toFixed(2)}`;
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <h4 className="font-semibold text-lg text-gray-800">{purchase.medicine_name || 'Unknown Medicine'}</h4>
                    {purchase.brand && (
                        <p className="text-sm text-gray-600">Brand: {purchase.brand}</p>
                    )}
                    {purchase.batch_id && (
                        <p className="text-xs text-gray-500">Batch: {purchase.batch_id}</p>
                    )}
                </div>
                <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(purchase.purchase_price)}</p>
                    <p className="text-xs text-gray-500">per unit</p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <p className="text-gray-500 mb-1">Quantity</p>
                    <p className="font-medium">{purchase.quantity || 0} units</p>
                </div>
                <div>
                    <p className="text-gray-500 mb-1">Supplier</p>
                    <p className="font-medium">{purchase.supplier_name || 'Unknown'}</p>
                </div>
                <div>
                    <p className="text-gray-500 mb-1">Purchase Date</p>
                    <p className="font-medium">{formatDate(purchase.purchase_date)}</p>
                </div>
                <div>
                    <p className="text-gray-500 mb-1">Invoice #</p>
                    <p className="font-medium text-blue-600">{purchase.invoice_number || 'N/A'}</p>
                </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Total Value:</span>
                    <span className="font-semibold text-gray-800">
                        {formatCurrency(purchase.purchase_price * purchase.quantity)}
                    </span>
                </div>
            </div>
        </div>
    );
}
