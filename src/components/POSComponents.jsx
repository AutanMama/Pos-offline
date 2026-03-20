import React from 'react';

// Product Card Component
export const ProductCard = ({ product, onAdd }) => (
  <button 
    onClick={() => onAdd(product)}
    className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-500 transition-all text-left group active:scale-95"
  >
    <img src={product.image} alt={product.name} className="w-full h-32 object-cover rounded-lg mb-3" />
    <h3 className="font-semibold text-gray-800 truncate">{product.name}</h3>
    <div className="flex justify-between items-center mt-1">
      <span className="text-blue-600 font-bold">${product.price.toFixed(2)}</span>
      <span className="text-xs text-gray-400">SKU: {product.barcode}</span>
    </div>
  </button>
);

// Cart Item Component
export const CartItem = ({ item, updateQty, remove }) => (
  <div className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
    <div className="flex-1">
      <h4 className="font-medium text-gray-800 text-sm truncate">{item.name}</h4>
      <p className="text-xs text-gray-500">${item.price.toFixed(2)} / unit</p>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex items-center bg-gray-100 rounded-lg p-1">
        <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm text-gray-600">-</button>
        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
        <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 flex items-center justify-center hover:bg-white rounded shadow-sm text-gray-600">+</button>
      </div>
      <button onClick={() => remove(item.id)} className="text-red-400 hover:text-red-600 p-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
);

// Receipt Modal
export const ReceiptModal = ({ transaction, onClose }) => {
  if (!transaction) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl overflow-hidden">
        <div className="text-center mb-4 border-b border-dashed pb-4">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic">LuxeRetail</h2>
          <p className="text-xs text-gray-500 uppercase mt-1">123 Business Avenue, Tech City</p>
          <p className="text-[10px] text-gray-400 mt-1">TRANS ID: {transaction.id}</p>
        </div>
        
        <div className="space-y-2 mb-4">
          {transaction.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>{item.quantity}x {item.name}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-dashed pt-4 space-y-1">
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>${transaction.subtotal.toFixed(2)}</span></div>
          <div className="flex justify-between text-sm"><span>Tax (7.5%)</span><span>${transaction.tax.toFixed(2)}</span></div>
          <div className="flex justify-between font-bold text-lg pt-2"><span>TOTAL</span><span>${transaction.total.toFixed(2)}</span></div>
        </div>

        <div className="mt-6 text-center space-y-2 no-print">
          <button onClick={() => window.print()} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            Print Receipt
          </button>
          <button onClick={onClose} className="w-full text-gray-500 font-medium py-2">Close</button>
        </div>
      </div>
    </div>
  );
};