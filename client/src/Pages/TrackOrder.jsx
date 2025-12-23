import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Search, PackageCheck, Loader } from 'lucide-react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderId) return;
    setLoading(true);
    setError('');
    setOrder(null);

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !data) {
      setError('Order not found. Please check Order ID.');
    } else {
      setOrder(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[150px] pb-20 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-4xl font-serif font-bold mb-4">Track Your Order</h1>
        <p className="text-gray-500 mb-8">Enter your Order ID to check status</p>

        {/* Search Box */}
        <form onSubmit={handleTrack} className="flex gap-2 mb-10">
          <input 
            type="number" 
            placeholder="Order ID (e.g., 24)" 
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border p-3 rounded focus:outline-[#84a93e] shadow-sm"
          />
          <button className="bg-[#84a93e] text-white px-6 py-3 rounded font-bold hover:bg-[#6e8f30] transition flex items-center gap-2">
            {loading ? <Loader className="animate-spin" /> : <Search />} Track
          </button>
        </form>

        {/* Error */}
        {error && <div className="bg-red-100 text-red-600 p-4 rounded mb-6">{error}</div>}

        {/* Result */}
        {order && (
          <div className="bg-white p-8 rounded-lg shadow-md border-t-4 border-[#84a93e] text-left">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Order #{order.id}</h2>
              <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${
                order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {order.status}
              </span>
            </div>
            
            <div className="space-y-3 text-gray-600">
              <p><strong>Customer:</strong> {order.customer_name}</p>
              <p><strong>Total Amount:</strong> Rs. {order.total_amount}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3 text-[#84a93e] font-medium">
              <PackageCheck /> 
              {order.status === 'Pending' ? 'Your order is being processed.' : 
               order.status === 'Shipped' ? 'Your order is on the way!' : 'Order Delivered.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;