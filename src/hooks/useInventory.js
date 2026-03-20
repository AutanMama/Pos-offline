import { useState, useEffect } from 'react';

// COMPLETE Initial Inventory matching all 8 products in products.js
const INITIAL_STOCK = {
  1: 100, // Wireless Mouse
  2: 50,  // Mechanical Keyboard
  3: 200, // Organic Milk
  4: 150, // Whole Grain Bread
  5: 80,  // Cotton T-Shirt
  6: 40,  // Denim Jacket
  7: 120, // Ceramic Mug
  8: 60,  // LED Desk Lamp
};

export const useInventory = () => {
  // Initialize from LocalStorage or use the Full INITIAL_STOCK above
  const [stock, setStock] = useState(() => {
    const saved = localStorage.getItem('pos_inventory');
    if (saved) {
      return JSON.parse(saved);
    }
    return INITIAL_STOCK;
  });

  const [syncQueue, setSyncQueue] = useState(() => {
    const saved = localStorage.getItem('sync_queue');
    return saved ? JSON.parse(saved) : [];
  });

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor Connection (Starlink/Mobile Data)
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  // Sync logic: Push queue when Starlink is back online
  useEffect(() => {
    if (isOnline && syncQueue.length > 0) {
      console.log("Starlink Connected: Syncing transactions...", syncQueue);
      
      const timer = setTimeout(() => {
        setSyncQueue([]);
        localStorage.setItem('sync_queue', JSON.stringify([]));
        // In a real app, you would POST to your MongoDB here
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isOnline, syncQueue]);

  // FIX: Proper state update for stock deduction
  const deductStock = (cartItems) => {
    setStock(prevStock => {
      const updatedStock = { ...prevStock };
      cartItems.forEach(item => {
        if (updatedStock[item.id] !== undefined) {
          updatedStock[item.id] -= item.quantity;
        }
      });
      // Save the updated stock to local storage for offline persistence
      localStorage.setItem('pos_inventory', JSON.stringify(updatedStock));
      return updatedStock;
    });
  };

  const addToSyncQueue = (transaction) => {
    setSyncQueue(prev => {
      const newQueue = [...prev, transaction];
      localStorage.setItem('sync_queue', JSON.stringify(newQueue));
      return newQueue;
    });
  };

  return { 
    stock, 
    deductStock, 
    addToSyncQueue, 
    isOnline, 
    syncQueueLength: syncQueue.length 
  };
};