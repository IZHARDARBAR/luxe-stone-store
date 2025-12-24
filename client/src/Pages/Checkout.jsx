import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';
import emailjs from '@emailjs/browser'; // <--- IMPORT

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', address: '', city: '', phone: '', email: '' });

  const grandTotal = cartTotal + 250;
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return alert("Cart is empty!");
    if (!formData.firstName || !formData.address || !formData.phone) return alert("Fill details!");

    setLoading(true);

    const orderData = {
      customer_name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
      total_amount: grandTotal,
      status: 'Pending',
      cart_items: cartItems,
      payment_method: 'Cash on Delivery'
    };

    // 1. Save to Database
    const { data, error } = await supabase.from('orders').insert([orderData]).select();

    if (error) {
      alert("Error Saving Order!");
    } else {
      const newOrderId = data[0].id;

      // 2. Send Email via EmailJS (Frontend se)
      const serviceID = "service_4ahf5j9";
      const templateID = "template_contact";
      const publicKey = "eeH0BCs9fLDJBPhrJ";

      // Products ko text mein convert karo
      const itemsList = cartItems.map(i => `${i.name} (x${i.quantity})`).join('\n');

      const templateParams = {
        from_name: formData.firstName,
        from_email: formData.email,
        phone: formData.phone,
        message: `
          NEW ORDER #${newOrderId}
          -----------------------
          Address: ${formData.address}, ${formData.city}
          Total: Rs. ${grandTotal}
          Payment: COD
          
          ITEMS:
          ${itemsList}
        `
      };

      emailjs.send(serviceID, templateID, templateParams, publicKey);

      clearCart();
      navigate('/order-success', { state: { orderId: newOrderId, paymentMethod: 'Cash on Delivery' } });
    }
    setLoading(false);
  };

  return (
    <div className="font-sans text-gray-900 pt-[100px]">
      {/* ... (Baaki UI ka Code Same Rahega) ... */}
      <div className="container mx-auto px-6 md:px-12 mb-24">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Form */}
          <div className="w-full lg:w-2/3">
             <form className="space-y-6">
                <input name="firstName" onChange={handleChange} placeholder="First Name *" className="w-full border p-3 rounded" />
                <input name="lastName" onChange={handleChange} placeholder="Last Name" className="w-full border p-3 rounded" />
                <input name="address" onChange={handleChange} placeholder="Address *" className="w-full border p-3 rounded" />
                <input name="city" onChange={handleChange} placeholder="City *" className="w-full border p-3 rounded" />
                <input name="phone" onChange={handleChange} placeholder="Phone *" className="w-full border p-3 rounded" />
                <input name="email" onChange={handleChange} placeholder="Email" className="w-full border p-3 rounded" />
             </form>
          </div>
          
          {/* Summary & Button */}
          <div className="w-full lg:w-1/3 border p-6 rounded">
             <h2 className="text-xl font-bold mb-4">Total: Rs. {grandTotal}</h2>
             <button onClick={handlePlaceOrder} disabled={loading} className="w-full bg-[#84a93e] text-white py-3 rounded font-bold">
               {loading ? "Processing..." : "Place Order"}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;