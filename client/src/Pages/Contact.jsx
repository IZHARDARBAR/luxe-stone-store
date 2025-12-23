import React, { useState } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, } from 'lucide-react';
import toast from 'react-hot-toast'; 

const Contact = () => {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false); 

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- HANDLE SUBMIT WITH TOAST ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const toastId = toast.loading("Sending message...");

    try {
      const response = await fetch('https://luxe-backend-git-main-izhardarbars-projects.vercel.app/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      toast.dismiss(toastId);

      if (data.success) {
        toast.success("Message Sent Successfully!");
        setFormData({ name: '', email: '', phone: '', message: '' }); 
      } else {
        toast.error("Failed to send message. Try again.");
      }
    } catch (error) {
      toast.dismiss(toastId);
      console.error(error);
      toast.error("Server Error! Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans text-gray-900">
      
      {/* 1. HERO SECTION */}
      <div className="relative h-[100vh] w-full flex items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=2000" 
            alt="Contact Banner" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 px-4 mt-16">
          <h4 className="uppercase tracking-[0.2em] text-sm md:text-base mb-4 font-medium text-gray-200">
            24/7 Support
          </h4>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">
            Let's Connect
          </h1>
        </div>
      </div>

      {/* 2. CONTACT FORM & INFO SECTION */}
      <section className="container mx-auto px-6 md:px-12 py-24">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* --- LEFT COLUMN: Contact Info --- */}
          <div className="w-full lg:w-1/3">
            <h2 className="text-3xl font-serif font-bold mb-10">Send us a Message</h2>
            
            <div className="space-y-8">
              <ContactInfoItem 
                icon={<Phone />} 
                title="Phone" 
                text="+92 355 4952450" 
              />
              <ContactInfoItem 
                icon={<Mail />} 
                title="Email" 
                text="izhardarbar571@gmail.com" 
              />
              <ContactInfoItem 
                icon={<MapPin />} 
                title="Address" 
                text="Zulfiqar Abad GilGit" 
              />
            </div>
          </div>

          {/* --- RIGHT COLUMN: The Form --- */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-200 rounded p-3 focus:outline-none focus:border-[#84a93e] transition-colors" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border border-gray-200 rounded p-3 focus:outline-none focus:border-[#84a93e] transition-colors" placeholder="Your Email" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Phone *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border border-gray-200 rounded p-3 focus:outline-none focus:border-[#84a93e] transition-colors" placeholder="Your Phone Number" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                <textarea rows="5" name="message" value={formData.message} onChange={handleChange} required className="w-full border border-gray-200 rounded p-3 focus:outline-none focus:border-[#84a93e] transition-colors" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" disabled={loading} className="bg-[#84a93e] text-white px-10 py-3 rounded-full font-bold uppercase tracking-wide hover:bg-[#6e8f30] transition duration-300 shadow-lg disabled:bg-gray-400">
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 3. SOCIAL STRIP */}
      <section className="bg-[#f4f7eb] py-16 text-center">
        <div className="container mx-auto px-6">
          <h3 className="text-2xl font-serif font-bold text-gray-900 mb-6">Follow us LUXE STONE CO.</h3>
          <div className="flex justify-center gap-8">
            <SocialIconLink icon={<Facebook size={24} />} />
            <SocialIconLink icon={<Instagram size={24} />} />
          </div>
        </div>
      </section>

      {/* 4. BOTTOM CTA (NIKE MIX COLLECTION IMAGE ADDED) */}
      <section className="relative h-[400px] w-full flex items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          {/* --- NEW IMAGE: Nike Collection (Jordans, AF1, Dunks Mix) --- */}
          <img 
            src="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=2000" 
            alt="Nike Sneakers Collection" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 px-4 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Step Up Your Game
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Explore our exclusive collection.
          </p>
          <a href="/shop"> 
            <button className="bg-[#84a93e] text-white px-10 py-3 rounded-full font-bold uppercase hover:bg-[#6e8f30] transition shadow-lg transform hover:scale-105">
              Shop Now
            </button>
          </a>
        </div>
      </section>

    </div>
  );
};

// Helpers
const ContactInfoItem = ({ icon, title, text }) => (
  <div className="flex items-center gap-5">
    <div className="bg-[#f4f7eb] text-[#84a93e] p-4 rounded-full shrink-0">{React.cloneElement(icon, { size: 24, strokeWidth: 2 })}</div>
    <div><h3 className="text-lg font-bold text-gray-900">{title}</h3><p className="text-gray-600">{text}</p></div>
  </div>
);

const SocialIconLink = ({ icon }) => (
  <a href="#" className="text-gray-800 hover:text-[#84a93e] transition-transform duration-300 hover:scale-110">{icon}</a>
);

export default Contact;