import React from 'react';
import { products } from '../data/product';

export const InventoryManager = ({ stock }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-black">Inventory Levels</h2>
      <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold uppercase">Live Stock</span>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map(p => {
        const currentQty = stock[p.id] || 0;
        const isLow = currentQty < 10;
        return (
          <div key={p.id} className={`p-4 rounded-xl border ${isLow ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-gray-50'}`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold text-gray-800">{p.name}</p>
                <p className="text-xs text-gray-500">SKU: {p.barcode}</p>
              </div>
              <span className={`text-lg font-black ${isLow ? 'text-red-600' : 'text-green-600'}`}>
                {currentQty}
              </span>
            </div>
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${isLow ? 'bg-red-500' : 'bg-green-500'}`} 
                style={{ width: `${Math.min(currentQty, 100)}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);