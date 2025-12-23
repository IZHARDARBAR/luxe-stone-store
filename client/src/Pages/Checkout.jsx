import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Truck } from 'lucide-react'; // Truck icon added
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Payment Method ab Fixed hai 'cod'
  const paymentMethod = 'cod'; 

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', address: '', city: '', phone: '', email: ''
  });

  const shippingCost = 250; // Delivery Charges
  const grandTotal = cartTotal + shippingCost;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return alert("Cart is empty!");
    if (!formData.firstName || !formData.address || !formData.phone) return alert("Please fill details!");

    setLoading(true);

    const orderData = {
      customer_name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
      total_amount: grandTotal,
      status: 'Pending',
      cart_items: cartItems,
      payment_method: 'Cash on Delivery', // Fixed Value
      transaction_id: '' // COD mein koi Trx ID nahi hoti
    };

    const { data, error } = await supabase.from('orders').insert([orderData]).select();

    if (error) {
      alert("Error Saving Order!");
      setLoading(false);
    } else {
      const newOrderId = data[0].id;
      
      // Email Sending Logic (Backend)
      try {
        await fetch('https://luxe-backend-nh8occsdk-izhardarbars-projects.vercel.app/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...orderData, orderId: newOrderId })
        });
      } catch (err) {}

      clearCart();
      navigate('/order-success', { state: { orderId: newOrderId, paymentMethod: 'Cash on Delivery' } });
      setLoading(false);
    }
  };

  return (
    <div className="font-sans text-gray-900 pt-[100px]">
      <div className="container mx-auto px-6 md:px-12 mb-24">
        <h1 className="text-4xl font-serif font-bold mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* LEFT: FORM (Same fields) */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4">Shipping Information</h2>
            <form className="space-y-6">
              <div className="flex gap-6">
                <input name="firstName" onChange={handleChange} placeholder="First name *" className="w-full border p-3 rounded bg-gray-50" />
                <input name="lastName" onChange={handleChange} placeholder="Last name" className="w-full border p-3 rounded bg-gray-50" />
              </div>
              
              <div className="relative">
                <select className="w-full border p-3 rounded appearance-none bg-gray-50">
                  <option>Pakistan</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              <input name="address" onChange={handleChange} placeholder="Complete Address *" className="w-full border p-3 rounded bg-gray-50" />
              
              <div className="flex gap-6">
                <input name="city" onChange={handleChange} placeholder="City *" className="w-full border p-3 rounded bg-gray-50" />
                <div className="relative w-full">
                  <select className="w-full border p-3 rounded appearance-none bg-gray-50">
                    <option>Gilgit-Baltistan</option><option>Punjab</option><option>Sindh</option><option>KPK</option><option>Balochistan</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-4 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              <input name="phone" onChange={handleChange} placeholder="Phone Number *" className="w-full border p-3 rounded bg-gray-50" />
              <input name="email" onChange={handleChange} placeholder="Email Address *" className="w-full border p-3 rounded bg-gray-50" />
            </form>
          </div>

          {/* RIGHT: ORDER SUMMARY (Only COD) */}
          <div className="w-full lg:w-1/3">
            <div className="border-2 border-gray-100 p-8 rounded-lg bg-white sticky top-24 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between border-b pb-4 mb-4 text-sm">
                  <span className="text-gray-600">{item.name} × {item.quantity}</span>
                  <span className="font-bold">Rs. {item.price * item.quantity}</span>
                </div>
              ))}

              <div className="flex justify-between pb-2 text-gray-600">
                <span>Subtotal</span>
                <span>Rs. {cartTotal}</span>
              </div>
              <div className="flex justify-between border-b pb-4 mb-4 text-gray-600">
                <span>Shipping</span>
                <span className="text-[#84a93e] font-bold">+ Rs. {shippingCost}</span>
              </div>
              <div className="flex justify-between border-b pb-4 mb-6 text-xl font-bold">
                <span>Total</span>
                <span>Rs. {grandTotal}</span>
              </div>

              {/* PAYMENT INFO BOX */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6 flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Cash on Delivery</h4>
                  <p className="text-xs text-blue-700 mt-1">Pay with cash when the courier delivers your parcel at your doorstep.</p>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-[#84a93e] text-white py-4 rounded-full font-bold uppercase hover:bg-[#6e8f30] transition shadow-lg"
              >
                {loading ? "Processing Order..." : "Confirm Order"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;