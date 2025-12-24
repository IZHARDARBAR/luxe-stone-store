import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Mail, Phone, Calendar, Trash2 } from 'lucide-react';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('isAdmin')) navigate('/admin');
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setUsers(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Remove this user from list?")) {
      const { error } = await supabase.from('profiles').delete().eq('id', id);
      if (!error) {
        setUsers(users.filter(u => u.id !== id));
        alert("User Removed!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      
      {/* Back Button */}
      <Link to="/admin/dashboard" className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black transition">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      {/* Heading */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3 text-gray-800">
        <Users className="text-[#84a93e]" size={28} /> Registered Users
      </h1>

      {/* --- TABLE CONTAINER (SCROLL FIX HERE) --- */}
      <div className="bg-white rounded-lg shadow border border-gray-200 w-full overflow-hidden">
        
        {/* 1. overflow-x-auto: Scroll allow karega */}
        <div className="overflow-x-auto w-full">
          
          {/* 2. min-w-[1000px]: Table ko force karega ke wo bada rahe (pichke nahi) */}
          <table className="w-full text-left border-collapse min-w-[1000px]">
            
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Joined Date</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Full Name</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Email</th>
                <th className="p-4 font-semibold text-gray-600 whitespace-nowrap">Phone</th>
                <th className="p-4 font-semibold text-gray-600 text-center whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-500">Loading Users...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan="5" className="p-10 text-center text-gray-500">No users found.</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition">
                    
                    {/* 3. whitespace-nowrap: Text ko tootne se rokega */}
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>

                    <td className="p-4 font-bold text-gray-800 capitalize whitespace-nowrap">
                      {user.full_name || "N/A"}
                    </td>

                    <td className="p-4 text-blue-600 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Mail size={16} /> {user.email}
                      </div>
                    </td>

                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Phone size={16} /> {user.phone || "N/A"}
                      </div>
                    </td>

                    <td className="p-4 text-center whitespace-nowrap">
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-600 hover:text-white transition shadow-sm border border-red-100"
                        title="Remove User"
                      >
                        <Trash2 size={18} />
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

export default ManageUsers;