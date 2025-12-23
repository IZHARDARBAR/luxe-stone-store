import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Gem, ChevronUp } from 'lucide-react';

// --- REAL WHATSAPP ICON ---
const WhatsAppIcon = ({ size = 20, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor"
    className={className}
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.48 0 1.461 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
  </svg>
);

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const myNumber = "923554952450"; 
  
  // --- YAHAN APNE LINKS PASTE KAREIN ---
  const fbLink = "https://www.facebook.com/share/1BhNQjFYGi/";
  const instaLink = "https://www.instagram.com/luxestone2025?igsh=anhvanR6bnlxM2I5";

  return (
    <footer className="bg-[#eff5d8] text-gray-800 pt-10 pb-6 relative">
      <div className="container mx-auto px-6 md:px-12">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0 mb-10">
          
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 border-2 border-black rounded-full transition-transform group-hover:scale-105">
              <Gem strokeWidth={1.5} size={28} className="text-black" />
            </div>
            <span className="text-xl font-serif font-bold tracking-widest uppercase text-black">
              Luxe Stone Co.
            </span>
          </Link>

          <ul className="flex flex-wrap justify-center gap-8 text-sm font-medium uppercase tracking-wide text-gray-700">
            <li><Link to="/" className="hover:text-[#84a93e] transition">Home</Link></li>
            <li><Link to="/shop" className="hover:text-[#84a93e] transition">Shop</Link></li>
            <li><Link to="/about" className="hover:text-[#84a93e] transition">About</Link></li>
            <li><Link to="/contact" className="hover:text-[#84a93e] transition">Contact</Link></li>
          </ul>

          <div className="flex items-center gap-5">
            {/* FACEBOOK */}
            <a 
              href={fbLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#84a93e] transition"
            >
              <Facebook size={20} />
            </a>

            {/* INSTAGRAM */}
            <a 
              href={instaLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[#84a93e] transition"
            >
              <Instagram size={20} />
            </a>
            
            {/* WHATSAPP */}
            <a 
              href={`https://wa.me/${myNumber}?text=Hi, I want to know more about Luxe Stone.`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-[#25D366] transition"
            >
              <WhatsAppIcon size={20} />
            </a>
          </div>
        </div>

        <div className="border-t border-gray-300/50 w-full mb-6"></div>

        <div className="flex flex-col md:flex-row justify-center items-center relative">
          <p className="text-gray-500 text-sm text-center">
            Copyright © 2025 Luxe Stone eCommerce. All Rights Reserved.
          </p>
          <button 
            onClick={scrollToTop}
            className="hidden md:flex absolute right-0 bottom-[-10px] bg-[#84a93e] hover:bg-[#6e8f30] text-white p-3 rounded shadow-md transition-all hover:-translate-y-1"
          >
            <ChevronUp size={20} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;