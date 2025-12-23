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
    <div className="min-h-screen bg-gray-50 pt-[120px] pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gray-200 p-4 rounded-full"><User size={32} /></div>
            <div>
              <h1 className="text-2xl font-bold">{user.email.split('@')[0]}</h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="text-red-500 flex items-center gap-2 font-bold hover:bg-red-50 p-2 rounded transition">
            <LogOut size={20} /> Logout
          </button>
        </div>

        {/* Orders List */}
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Package /> My Order History</h2>
        
        {orders.length === 0 ? (
          <p className="text-gray-500">You haven't placed any orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex justify-between items-start border-b pb-4 mb-4">
                  <div>
                    <span className="text-xs text-gray-400">Order ID</span>
                    <p className="font-bold text-lg">#{order.id}</p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {order.status}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.cart_items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-700">
                      <span>{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                      <span>Rs. {item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mt-4 flex justify-between font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>Rs. {order.total_amount}</span>
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