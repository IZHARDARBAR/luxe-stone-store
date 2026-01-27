import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Facebook, Instagram, Menu, X, Gem, User, LogIn, Heart } from 'lucide-react';
import CartSidebar from './CartSidebar';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient'; 

// WhatsApp Icon
const WhatsAppIcon = ({ size = 20, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.48 0 1.461 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartCount } = useCart();
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => setUser(session?.user ?? null));
    return () => authListener.subscription.unsubscribe();
  }, []);

  const isLightPage = 
    location.pathname === '/cart' || 
    location.pathname === '/checkout' || 
    location.pathname === '/shop' || 
    location.pathname === '/order-success' || 
    location.pathname === '/profile' || 
    location.pathname === '/track-order' ||
    location.pathname === '/wishlist' || 
    location.pathname === '/policy' || // Policy page added
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/product');

  const textColor = isMobileMenuOpen 
    ? 'text-white' 
    : (isLightPage ? 'text-gray-900' : 'text-white');

  const borderColor = isMobileMenuOpen 
    ? 'border-white/10'
    : (isLightPage ? 'border-gray-200' : 'border-white/20');

  const myNumber = "923554952450";
  const fbLink = "https://www.facebook.com/share/1BhNQjFYGi/"; 
  const instaLink = "https://www.instagram.com/luxestone2025?igsh=anhvanR6bnlxM2I5"; 

  return (
    <>
      {/* --- ANNOUNCEMENT BAR (NEW) --- */}
      <div className="bg-black text-white text-[10px] md:text-xs font-bold text-center py-2 tracking-widest uppercase relative z-[60]">
        🚚 Free Delivery All Over Pakistan | Cash on Delivery Available
      </div>

      <nav className={`absolute top-[32px] left-0 w-full z-50 bg-transparent py-6 transition-all duration-300 border-b ${borderColor}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          
          <Link to="/" className={`flex items-center gap-2 z-50 hover:opacity-80 transition ${textColor}`} onClick={() => setIsMobileMenuOpen(false)}>
            <Gem strokeWidth={1.5} size={28} className={isMobileMenuOpen ? "text-white" : (isLightPage ? "text-gray-900" : "text-white")} />
            <span className="text-xl md:text-2xl font-serif tracking-widest uppercase font-bold">Luxe Stone</span>
          </Link>

          {/* DESKTOP LINKS */}
          <ul className={`hidden md:flex items-center space-x-8 text-sm font-medium tracking-widest uppercase ${textColor}`}>
            {['Home', 'Shop', 'About', 'Contact'].map((item) => (
              <li key={item}>
                <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="hover:text-[#84a93e] transition-colors relative group">
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#84a93e] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className={`flex items-center gap-5 ${textColor}`}>
            
            <div className={`hidden md:flex items-center space-x-4 border-r pr-5 ${isLightPage ? 'border-gray-300' : 'border-gray-500'}`}>
              {user ? (
                <Link to="/profile" title="My Profile"><User size={18} className="hover:text-[#84a93e]" /></Link>
              ) : (
                <Link to="/login" title="Login"><LogIn size={18} className="hover:text-[#84a93e]" /></Link>
              )}
              <a href={fbLink} target="_blank" rel="noopener noreferrer" className="hover:text-[#84a93e]"><Facebook size={18} /></a>
              <a href={instaLink} target="_blank" rel="noopener noreferrer" className="hover:text-[#84a93e]"><Instagram size={18} /></a>
              <a href={`https://wa.me/${myNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366]"><WhatsAppIcon size={18} /></a>
            </div>

            <Link to="/wishlist" className="hover:text-red-500 transition" title="Wishlist"><Heart size={24} /></Link>

            <div className="relative cursor-pointer hover:text-[#84a93e]" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={24} />
              <span className="absolute -top-1 -right-2 bg-[#84a93e] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-md">{cartCount}</span>
            </div>

            <button className="md:hidden z-50 focus:outline-none ml-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={30} /> : <Menu size={30} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black z-40 flex flex-col items-center justify-center transition-transform duration-500 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <ul className="flex flex-col items-center space-y-6 text-white text-xl font-serif tracking-widest uppercase mb-8">
          {['Home', 'Shop', 'About', 'Contact', 'Wishlist'].map((item) => (
            <li key={item}>
              <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)} className="hover:text-[#84a93e] transition">{item}</Link>
            </li>
          ))}
        </ul>

        <div className="mb-10 w-64">
          {user ? (
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full bg-white text-black py-3 rounded-full font-bold flex items-center justify-center gap-2">
                <User size={20} /> My Profile
              </button>
            </Link>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="w-full bg-[#84a93e] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2">
                <LogIn size={20} /> Login / Signup
              </button>
            </Link>
          )}
        </div>
        
        <div className="flex gap-8 text-gray-400">
          <a href={fbLink} target="_blank" rel="noopener noreferrer"><Facebook size={28} /></a>
          <a href={instaLink} target="_blank" rel="noopener noreferrer"><Instagram size={28} /></a>
          <a href={`https://wa.me/${myNumber}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366]"><WhatsAppIcon size={28} /></a>
        </div>
      </div>

      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
export default Navbar;