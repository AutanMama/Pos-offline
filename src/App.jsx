import React, { useState, useEffect, useRef } from 'react';
import { products, categories } from './data/product';
import { ProductCard, CartItem, ReceiptModal } from './components/POSComponents';
import { InventoryManager } from './components/InventoryManager';
import { useInventory } from './hooks/useInventory';

const App = () => {
  // 1. Inventory & Sync Custom Hook
  const { stock, deductStock, addToSyncQueue, isOnline, syncQueueLength } = useInventory();

  // 2. State Management
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('pos_history')) || []);
  const [activeTab, setActiveTab] = useState("pos"); // 'pos', 'history', or 'inventory'
  const [lastTransaction, setLastTransaction] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState("");

  // 3. Persistence Effect
  useEffect(() => {
    localStorage.setItem('pos_history', JSON.stringify(history));
  }, [history]);

  // 4. Cart Logic
  const addToCart = (product) => {
    // Check if stock is available
    const currentStock = stock[product.id] || 0;
    const inCart = cart.find(item => item.id === product.id)?.quantity || 0;

    if (inCart >= currentStock) {
      alert("Insufficient stock available!");
      return;
    }

    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        if (delta > 0 && newQty > (stock[id] || 0)) {
          alert("Stock limit reached");
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));

  // 5. Totals
  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const tax = subtotal * 0.075;
  const total = subtotal + tax;

  // 6. Barcode Handler
  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const product = products.find(p => p.barcode === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput("");
    } else {
      alert("Product not found");
      setBarcodeInput("");
    }
  };

  // 7. Checkout Process
  const handleCheckout = (paymentMethod) => {
    if (cart.length === 0) return;

    const transaction = {
      id: `TXN-${Date.now()}`,
      items: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod,
      date: new Date().toLocaleString()
    };

    // Update Local UI State
    setHistory([transaction, ...history]);
    
    // Manage Backend-Simulated Tasks
    deductStock(cart);
    addToSyncQueue(transaction);

    // Show Receipt and Reset
    setLastTransaction(transaction);
    setCart([]);
  };

  const filteredProducts = products.filter(p => 
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* --- SHARED NAVBAR --- */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-black text-blue-600 tracking-tight">LUXE<span className="text-gray-900">POS</span></h1>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button onClick={() => setActiveTab('pos')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'pos' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Terminal</button>
            <button onClick={() => setActiveTab('history')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>History</button>
            <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'inventory' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Inventory</button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {syncQueueLength > 0 && (
            <div className="bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-100 animate-pulse">
              {syncQueueLength} Pending Sync
            </div>
          )}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider ${isOnline ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            {isOnline ? 'Starlink Online' : 'Offline Mode'}
          </div>
        </div>
      </nav>

      {/* --- DYNAMIC VIEWS --- */}
      {activeTab === 'pos' ? (
        <main className="flex-1 flex overflow-hidden">
          {/* Main Terminal Area */}
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <form onSubmit={handleBarcodeSubmit} className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Scan barcode or type SKU (e.g. 1001)..."
                  className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-4 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </form>
              
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${category === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <aside className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-black text-lg flex items-center gap-2">Order <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{cart.length}</span></h2>
              <button onClick={() => setCart([])} className="text-xs font-bold text-red-500 uppercase hover:bg-red-50 px-2 py-1 rounded">Clear</button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 italic p-10 text-center">
                  <p>Ready for next customer</p>
                </div>
              ) : (
                cart.map(item => (
                  <CartItem key={item.id} item={item} updateQty={updateQuantity} remove={removeFromCart} />
                ))
              )}
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500"><span>Subtotal</span><span className="font-medium">${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-xl font-black pt-2 border-t border-gray-200"><span>Total</span><span className="text-blue-600">${total.toFixed(2)}</span></div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['Cash', 'Card', 'Transfer'].map(method => (
                  <button key={method} onClick={() => handleCheckout(method)} className="flex flex-col items-center justify-center bg-white border border-gray-300 py-3 rounded-xl hover:border-blue-500 active:scale-95 group transition-all">
                    <span className="text-[10px] font-bold uppercase text-gray-400 group-hover:text-blue-500">{method}</span>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handleCheckout('Cash')}
                disabled={cart.length === 0}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-[0.98]"
              >
                PAY NOW
              </button>
            </div>
          </aside>
        </main>
      ) : activeTab === 'history' ? (
        <div className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-2xl font-black mb-6">Recent Transactions</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">ID</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Payment</th>
                  <th className="p-4 text-xs font-bold text-gray-400 uppercase">Total</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-mono text-gray-400">{txn.id.slice(-6)}</td>
                    <td className="p-4 text-sm font-medium">{txn.date}</td>
                    <td className="p-4"><span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold uppercase">{txn.paymentMethod}</span></td>
                    <td className="p-4 text-sm font-black text-blue-600">${txn.total.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => setLastTransaction(txn)} className="text-blue-500 text-xs font-bold hover:underline">Receipt</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex-1 p-8 overflow-y-auto">
          <InventoryManager stock={stock} />
        </div>
      )}

      {/* --- MODALS --- */}
      {lastTransaction && (
        <ReceiptModal 
          transaction={lastTransaction} 
          onClose={() => setLastTransaction(null)} 
        />
      )}
    </div>
  );
};

export default App;