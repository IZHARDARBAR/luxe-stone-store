import React, { useState } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import toast from 'react-hot-toast'; 
import emailjs from '@emailjs/browser'; // <--- IMPORT THIS

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Sending message...");

    // --- EMAILJS CONFIGURATION ---
    const serviceID = "service_4ahf5j9";   // Yahan Apni Service ID Dalein
    const templateID = "template_contact"; // Yahan Apni Template ID Dalein
    const publicKey = "eeH0BCs9fLDJBPhrJ";   // Yahan Apni Public Key Dalein

    // Data jo template mein jayega
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      phone: formData.phone,
      message: formData.message,
    };

    emailjs.send(serviceID, templateID, templateParams, publicKey)
      .then(() => {
        toast.dismiss(toastId);
        toast.success("Message Sent Successfully!");
        setFormData({ name: '', email: '', phone: '', message: '' });
      })
      .catch((error) => {
        toast.dismiss(toastId);
        console.error("Email Error:", error);
        toast.error("Failed to send message.");
      })
      .finally(() => {
        setLoading(false);
      });
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
          <h4 className="uppercase tracking-[0.2em] text-sm md:text-base mb-4 font-medium text-gray-200">24/7 Support</h4>
          <h1 className="text-4xl md:text-6xl font-serif font-bold">Let's Connect</h1>
        </div>
      </div>

      {/* 2. FORM SECTION */}
      <section className="container mx-auto px-6 md:px-12 py-24">
        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="w-full lg:w-1/3 space-y-8">
            <ContactInfoItem icon={<Phone />} title="Phone" text="+92 355 4952450" />
            <ContactInfoItem icon={<Mail />} title="Email" text="izhardarbar571@gmail.com" />
            <ContactInfoItem icon={<MapPin />} title="Address" text="Zulfiqar Abad GilGit" />
          </div>

          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Your Name" className="w-full border p-3 rounded" />
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Your Email" className="w-full border p-3 rounded" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone Number" className="w-full border p-3 rounded" />
              <textarea rows="5" name="message" value={formData.message} onChange={handleChange} required placeholder="Your Message" className="w-full border p-3 rounded"></textarea>
              <button type="submit" disabled={loading} className="bg-[#84a93e] text-white px-10 py-3 rounded-full font-bold uppercase hover:bg-[#6e8f30] disabled:bg-gray-400">
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};

// Helpers... (Same as before)
const ContactInfoItem = ({ icon, title, text }) => (
  <div className="flex items-center gap-5">
    <div className="bg-[#f4f7eb] text-[#84a93e] p-4 rounded-full shrink-0">{React.cloneElement(icon, { size: 24, strokeWidth: 2 })}</div>
    <div><h3 className="text-lg font-bold text-gray-900">{title}</h3><p className="text-gray-600">{text}</p></div>
  </div>
);

export default Contact;