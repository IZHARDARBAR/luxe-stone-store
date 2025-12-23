import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight, Loader, Eye, EyeOff } from 'lucide-react'; // Eye Icons Added
import toast from 'react-hot-toast';

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // --- PASSWORD VISIBILITY STATE ---
  const [showPassword, setShowPassword] = useState(false); 

  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', password: ''
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) navigate('/');
    };
    checkSession();
  }, [navigate]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { full_name: formData.fullName, phone: formData.phone },
          },
        });
        if (error) throw error;
        toast.success("Account created! Welcome to Luxe Stone.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
        toast.success("Welcome Back!");
      }
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-white">
      
      {/* Left Side Image */}
      <div className="hidden lg:flex w-1/2 bg-black items-center justify-center relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=2000" alt="Luxury" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="relative z-10 text-center text-white px-12">
          <h1 className="text-6xl font-serif font-bold mb-6">Luxe Stone.</h1>
          <p className="text-xl tracking-widest uppercase">Premium Accessories for the Modern Era.</p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12 bg-gray-50">
        <div className="max-w-md w-full mx-auto">
          <h2 className="text-4xl font-serif font-bold text-gray-900 mb-2">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-gray-500 mb-10">{isSignUp ? 'Enter your details to join our exclusive club.' : 'Please enter your details to sign in.'}</p>

          <form onSubmit={handleAuth} className="space-y-5">
            {isSignUp && (
              <>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input name="fullName" placeholder="Full Name" type="text" className="w-full border p-3 pl-12 rounded-lg focus:outline-[#84a93e] bg-white" onChange={handleChange} required />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <input name="phone" placeholder="Phone Number" type="tel" className="w-full border p-3 pl-12 rounded-lg focus:outline-[#84a93e] bg-white" onChange={handleChange} required />
                </div>
              </>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input name="email" placeholder="Email Address" type="email" className="w-full border p-3 pl-12 rounded-lg focus:outline-[#84a93e] bg-white" onChange={handleChange} required />
            </div>

            {/* --- PASSWORD FIELD WITH EYE ICON --- */}
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input 
                name="password" 
                placeholder="Password" 
                // Toggle Type here
                type={showPassword ? "text" : "password"} 
                className="w-full border p-3 pl-12 pr-12 rounded-lg focus:outline-[#84a93e] bg-white"
                onChange={handleChange} 
                required 
              />
              
              {/* Toggle Button */}
              <button 
                type="button" // Important: type button rakhein warna form submit ho jayega
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button disabled={loading} className="w-full bg-black text-white py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-[#84a93e] transition flex items-center justify-center gap-2 shadow-lg">
              {loading ? <Loader className="animate-spin" /> : (isSignUp ? 'Create Account' : 'Sign In')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-gray-200 pt-6">
            <p className="text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button onClick={() => setIsSignUp(!isSignUp)} className="text-[#84a93e] font-bold ml-2 hover:underline">
                {isSignUp ? 'Sign In' : 'Register Now'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;