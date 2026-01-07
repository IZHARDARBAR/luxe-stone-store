import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Package, LogOut, User } from 'lucide-react';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    // 1. Get Current User
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
      return;
    }
    setUser(user);

    // 2. Fetch Orders for THIS User only
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('email', user.email) // Filter by User Email
      .order('created_at', { ascending: false });
    
    if (data) setOrders(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) return <div className="pt-40 text-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-[100px] pb-20 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* --- HEADER (Responsive) --- */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 text-center md:text-left">
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-gray-200 p-4 rounded-full">
              <User size={32} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold break-all">{user.email.split('@')[0]}</h1>
              <p className="text-gray-500 text-sm md:text-base">{user.email}</p>
            </div>
          </div>

          <button 
            onClick={handleLogout} 
            className="w-full md:w-auto text-red-500 flex justify-center items-center gap-2 font-bold hover:bg-red-50 p-3 md:p-2 rounded transition border border-red-100 md:border-none"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>

        {/* --- ORDERS LIST --- */}
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Package className="text-[#84a93e]" /> My Order History
        </h2>
        
        {orders.length === 0 ? (
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
                
                {/* Order Top Row (ID & Status) */}
                <div className="flex flex-col md:flex-row justify-between items-start border-b pb-4 mb-4 gap-4 md:gap-0">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Order ID</span>
                    <p className="font-bold text-lg text-gray-800">#{order.id}</p>
                  </div>
                  
                  <div className="text-left md:text-right w-full md:w-auto flex flex-row md:flex-col justify-between md:justify-start items-center md:items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-0 md:mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {order.cart_items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-700 border-b border-dashed border-gray-100 pb-2 last:border-0 last:pb-0">
                      <span className="font-medium">{item.name} <span className="text-gray-400 text-xs">x{item.quantity}</span></span>
                      <span className="font-bold whitespace-nowrap">Rs. {item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="border-t pt-4 mt-4 flex justify-between items-center">
                  <span className="text-gray-500 font-medium">Total Amount</span>
                  <span className="font-bold text-lg text-gray-900">Rs. {order.total_amount}</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;