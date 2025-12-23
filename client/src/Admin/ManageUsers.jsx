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
    // Hum 'profiles' table se data layenge
    let { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setUsers(data);
    setLoading(false);
  };

  // Note: User delete karna complex hota hai (Auth se bhi udana padta hai).
  // Filhal hum sirf list se hatayenge.
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
    <div className="min-h-screen bg-gray-50 p-10">
      <Link to="/admin/dashboard" className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Users className="text-[#84a93e]" size={32} /> Registered Users
      </h1>

      <div className="bg-white rounded shadow overflow-hidden border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">Joined Date</th>
              <th className="p-4">Full Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-10 text-center">Loading Users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-gray-500">No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 text-sm text-gray-500 flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 font-bold text-gray-800 capitalize">
                    {user.full_name || "N/A"}
                  </td>
                  <td className="p-4 text-blue-600 flex items-center gap-2">
                    <Mail size={14} /> {user.email}
                  </td>
                  <td className="p-4 text-gray-600 flex items-center gap-2">
                    <Phone size={14} /> {user.phone || "N/A"}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-600 hover:text-white transition"
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
  );
};

export default ManageUsers;