import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'; // Icons Added

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@luxestone.com' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      alert('Invalid Credentials!');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm border border-gray-200">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-800">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-2">Secure access only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="email" placeholder="Admin Email" 
              className="w-full border p-2.5 pl-10 rounded focus:outline-[#84a93e] bg-gray-50"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              // Toggle Logic
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="w-full border p-2.5 pl-10 pr-10 rounded focus:outline-[#84a93e] bg-gray-50"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
            
            {/* Eye Icon Button */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button className="w-full bg-[#84a93e] text-white py-3 rounded font-bold hover:bg-[#6e8f30] transition shadow-md">
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;