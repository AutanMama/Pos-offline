import React, { useState, useEffect } from 'react';
import { products, categories } from './data/product';
import { ProductCard, CartItem, ReceiptModal } from './components/POSComponents';
import { InventoryManager } from './components/InventoryManager';
import { useInventory } from './hooks/useInventory';

const App = () => {
  const { stock, deductStock, addToSyncQueue, isOnline, syncQueueLength } = useInventory();

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('pos_history')) || []);
  const [activeTab, setActiveTab] = useState("pos");
  const [lastTransaction, setLastTransaction] = useState(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  
  // Mobile UI State: Toggle cart visibility on small screens
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('pos_history', JSON.stringify(history));
  }, [history]);

  const addToCart = (product) => {
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

  const subtotal = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const total = subtotal + (subtotal * 0.075);

  const handleBarcodeSubmit = (e) => {
    e.preventDefault();
    const product = products.find(p => p.barcode === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput("");
    } else {
      setBarcodeInput("");
    }
  };

 const handleCheckout = (paymentMethod) => {
  if (cart.length === 0) return;

  try {
    const transaction = {
      id: `TXN-${Date.now()}`,
      items: [...cart],
      subtotal: subtotal || 0, // Ensure these aren't undefined
      tax: (subtotal * 0.075) || 0,
      total: total || 0,
      paymentMethod: paymentMethod || 'Cash',
      date: new Date().toLocaleString()
    };

    // 1. Update History
    setHistory(prev => [transaction, ...prev]);
    
    // 2. Deduct Stock (Wrapped in check)
    if (typeof deductStock === 'function') {
      deductStock(cart);
    }
    
    // 3. Sync Queue
    if (typeof addToSyncQueue === 'function') {
      addToSyncQueue(transaction);
    }

    // 4. Set for Modal & Reset
    setLastTransaction(transaction);
    setCart([]);
    setIsMobileCartOpen(false);
  } catch (error) {
    console.error("Checkout Error:", error);
    alert("Checkout failed. Check the console for details.");
  }
};

  const filteredProducts = products.filter(p => 
    (category === "All" || p.category === category) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* --- RESPONSIVE NAVBAR --- */}
      <nav className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full md:w-auto gap-6">
            <h1 className="text-xl font-black text-blue-600 tracking-tight">LUXE<span className="text-gray-900">POS</span></h1>
            
            {/* Status indicators moved inside a flex-wrap container for mobile */}
            <div className="flex gap-2">
               <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border text-[10px] font-bold uppercase ${isOnline ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                {isOnline ? 'Online' : 'Offline'}
              </div>
              {syncQueueLength > 0 && (
                <div className="bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-[10px] font-bold border border-amber-100 uppercase">
                  {syncQueueLength} Syncing
                </div>
              )}
            </div>
          </div>

          <div className="flex bg-gray-100 p-1 rounded-xl w-full md:w-auto">
            <button onClick={() => setActiveTab('pos')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'pos' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Terminal</button>
            <button onClick={() => setActiveTab('history')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'history' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>History</button>
            <button onClick={() => setActiveTab('inventory')} className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'inventory' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}>Inventory</button>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {activeTab === 'pos' && (
          <>
            {/* Terminal Main Area */}
            <div className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto pb-24 md:pb-6">
              <div className="flex flex-col gap-4 mb-6">
                <form onSubmit={handleBarcodeSubmit} className="relative w-full">
                  <input 
                    type="text" 
                    placeholder="Scan or Search..."
                    className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                  />
                  <svg className="h-5 w-5 absolute left-4 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </form>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${category === cat ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white border-gray-200 text-gray-500'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} />
                ))}
              </div>
            </div>

            {/* Desktop Cart Sidebar / Mobile Cart Drawer */}
            <aside className={`
              fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out bg-white
              md:relative md:translate-x-0 md:z-10 md:w-80 lg:w-96 md:border-l md:border-gray-200 md:flex md:flex-col
              ${isMobileCartOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
              {/* Mobile Close Button */}
              <button 
                onClick={() => setIsMobileCartOpen(false)}
                className="md:hidden absolute top-4 right-4 p-2 bg-gray-100 rounded-full"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="p-4 border-b border-gray-100 flex justify-between items-center mt-10 md:mt-0">
                <h2 className="font-black text-lg">Current Order ({cart.length})</h2>
                <button onClick={() => setCart([])} className="text-xs font-bold text-red-500 uppercase">Clear</button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="p-10 text-center opacity-30 italic">Cart is empty</div>
                ) : (
                  cart.map(item => <CartItem key={item.id} item={item} updateQty={updateQuantity} remove={removeFromCart} />)
                )}
              </div>

              <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200 space-y-4">
                <div className="flex justify-between text-xl font-black">
                  <span>Total</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['Cash', 'Card', 'Transfer'].map(method => (
                    <button key={method} onClick={() => handleCheckout(method)} className="bg-white border border-gray-300 py-3 rounded-xl text-[10px] font-bold uppercase hover:border-blue-500 active:scale-95">
                      {method}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={() => handleCheckout('Cash')}
                  disabled={cart.length === 0}
                  className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  PAY NOW
                </button>
              </div>
            </aside>

            {/* Mobile Bottom Bar (Visible only on mobile when cart has items) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Items: {cart.length}</p>
                <p className="text-lg font-black text-blue-600">${total.toFixed(2)}</p>
              </div>
              <button 
                onClick={() => setIsMobileCartOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md"
              >
                View Cart
              </button>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            <h2 className="text-2xl font-black mb-6">Transactions</h2>
            <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto shadow-sm">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr className="text-[10px] font-bold text-gray-400 uppercase">
                    <th className="p-4">Date</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Total</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map(txn => (
                    <tr key={txn.id} className="text-sm">
                      <td className="p-4 font-medium">{txn.date}</td>
                      <td className="p-4 uppercase text-[10px] font-bold">{txn.paymentMethod}</td>
                      <td className="p-4 font-black text-blue-600">${txn.total.toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => setLastTransaction(txn)} className="text-blue-500 font-bold">Receipt</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="flex-1 p-4 md:p-8 overflow-y-auto">
            <InventoryManager stock={stock} />
          </div>
        )}
      </div>

      {lastTransaction && (
        <ReceiptModal transaction={lastTransaction} onClose={() => setLastTransaction(null)} />
      )}
    </div>
  );
};

export default App;