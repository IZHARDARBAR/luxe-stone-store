import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Trash2, ArrowLeft, Tag, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const navigate = useNavigate();

  // 1. Security Check
  useEffect(() => {
    if (!localStorage.getItem('isAdmin')) {
      navigate('/admin');
    }
    fetchCoupons();
  }, []);

  // 2. Fetch Data
  const fetchCoupons = async () => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('id', { ascending: false });
    
    if (data) setCoupons(data);
    if (error) console.error(error);
  };

  // 3. Add Coupon Logic
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!newCode || !newDiscount) return alert("Please fill all details");
    
    const { error } = await supabase
      .from('coupons')
      .insert([
        { code: newCode.toUpperCase(), discount_percent: newDiscount }
      ]);

    if (!error) {
      alert("Coupon Added Successfully!");
      setNewCode('');
      setNewDiscount('');
      fetchCoupons(); // Refresh List
    } else {
      alert("Error! Coupon Code might already exist.");
    }
  };

  // 4. Delete Coupon Logic
  const handleDelete = async (id) => {
    if (confirm("Delete this coupon?")) {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (!error) {
        setCoupons(coupons.filter(c => c.id !== id));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      
      <Link to="/admin/dashboard" className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black transition">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2 text-gray-800">
        <Tag className="text-[#84a93e]" /> Manage Coupons
      </h1>

      {/* --- ADD COUPON FORM --- */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h3 className="font-bold mb-4 text-gray-700">Create New Coupon</h3>
        <form onSubmit={handleAddCoupon} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Code (e.g. SALE50)" 
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="border p-3 rounded w-full md:w-1/2 uppercase focus:outline-[#84a93e]"
            required
          />
          <input 
            type="number" 
            placeholder="Discount % (e.g. 20)" 
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            className="border p-3 rounded w-full md:w-1/4 focus:outline-[#84a93e]"
            required
          />
          <button className="bg-black text-white px-6 py-3 rounded font-bold hover:bg-gray-800 flex items-center justify-center gap-2 transition">
            <Plus size={18} /> Add Coupon
          </button>
        </form>
      </div>

      {/* --- COUPONS LIST TABLE --- */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600">Code</th>
                <th className="p-4 font-semibold text-gray-600">Discount</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.length === 0 ? (
                <tr><td colSpan="4" className="p-8 text-center text-gray-500">No active coupons found.</td></tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-bold text-[#84a93e] text-lg">{c.code}</td>
                    <td className="p-4 font-medium">{c.discount_percent}% OFF</td>
                    <td className="p-4">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Active</span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDelete(c.id)} 
                        className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-600 hover:text-white transition"
                        title="Delete Coupon"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCoupons;