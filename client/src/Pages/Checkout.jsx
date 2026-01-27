import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Truck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { supabase } from '../supabaseClient';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', address: '', city: '', phone: '', email: '' });

  // --- COUPON STATE ---
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const shippingCost = 250;
  const grandTotal = cartTotal + shippingCost - discount;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // --- APPLY COUPON ---
  const applyCoupon = async () => {
    if (!couponCode) return toast.error("Enter a code");
    
    // Check in Database
    const { data, error } = await supabase
      .from('coupons') // Ensure you created this table
      .select('*')
      .eq('code', couponCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) {
      toast.error("Invalid or Expired Coupon");
      setDiscount(0);
      setCouponApplied(false);
    } else {
      const discountAmount = Math.round((cartTotal * data.discount_percent) / 100);
      setDiscount(discountAmount);
      setCouponApplied(true);
      toast.success(`${data.discount_percent}% Discount Applied!`);
    }
  };

  // --- PLACE ORDER ---
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return alert("Cart is empty!");
    if (!formData.firstName || !formData.address || !formData.phone) return alert("Please fill all details!");
    setLoading(true);

    const orderData = {
      customer_name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      address: `${formData.address}, ${formData.city}`,
      total_amount: grandTotal, // Discounted Total
      status: 'Pending',
      cart_items: cartItems,
      payment_method: 'Cash on Delivery',
      transaction_id: couponApplied ? `Coupon: ${couponCode}` : ''
    };

    const { data, error } = await supabase.from('orders').insert([orderData]).select();

    if (error) {
      alert("Error Saving Order!");
      setLoading(false);
    } else {
      const newOrderId = data[0].id;

      // Update Stock
      for (const item of cartItems) {
        const { data: prod } = await supabase.from('products').select('stock').eq('id', item.id).single();
        if (prod) {
          await supabase.from('products').update({ stock: Math.max(0, prod.stock - item.quantity) }).eq('id', item.id);
        }
      }

      // Email Logic (EmailJS)
      const serviceID = "service_4ahf5j9";
      const templateID = "template_contact";
      const publicKey = "eeH0BCs9fLDJBPhrJ";
      
      const itemsList = cartItems.map(i => `${i.name} (x${i.quantity})`).join('\n');
      emailjs.send(serviceID, templateID, {
        from_name: formData.firstName,
        from_email: formData.email,
        phone: formData.phone,
        message: `ORDER #${newOrderId}\nTotal: Rs. ${grandTotal} (Discount: Rs. ${discount})\n\nITEMS:\n${itemsList}`
      }, publicKey);

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
          
          {/* LEFT: FORM */}
          <div className="w-full lg:w-2/3">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4">Shipping Information</h2>
            <form className="space-y-6">
              <div className="flex gap-6">
                <input name="firstName" onChange={handleChange} placeholder="First name *" className="w-full border p-3 rounded bg-gray-50 focus:outline-[#84a93e]" />
                <input name="lastName" onChange={handleChange} placeholder="Last name" className="w-full border p-3 rounded bg-gray-50 focus:outline-[#84a93e]" />
              </div>
              <input name="address" onChange={handleChange} placeholder="Complete Address *" className="w-full border p-3 rounded bg-gray-50 focus:outline-[#84a93e]" />
              <div className="flex gap-6">
                <input name="city" onChange={handleChange} placeholder="City *" className="w-full border p-3 rounded bg-gray-50 focus:outline-[#84a93e]" />
                <input name="phone" onChange={handleChange} placeholder="Phone *" className="w-full border p-3 rounded bg-gray-50 focus:outline-[#84a93e]" />
              </div>
              <input name="email" onChange={handleChange} placeholder="Email (Optional)" className="w-full border p-3 rounded bg-gray-50 focus:outline-[#84a93e]" />
            </form>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="w-full lg:w-1/3">
            <div className="border-2 border-gray-100 p-8 rounded-lg bg-white sticky top-24 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between border-b pb-4 mb-4 text-sm">
                  <span className="text-gray-600">{item.name} × {item.quantity}</span>
                  <span className="font-bold">Rs. {item.price * item.quantity}</span>
                </div>
              ))}

              {/* COUPON INPUT */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wide">Have a Coupon?</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Code" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="border p-2 rounded w-full uppercase text-sm focus:outline-[#84a93e]"
                    disabled={couponApplied}
                  />
                  <button 
                    onClick={applyCoupon}
                    disabled={couponApplied}
                    className={`px-4 py-2 rounded text-white font-bold text-xs ${couponApplied ? 'bg-gray-400' : 'bg-black hover:bg-gray-800'}`}
                  >
                    {couponApplied ? "APPLIED" : "APPLY"}
                  </button>
                </div>
                {couponApplied && <p className="text-green-600 text-xs mt-1 font-bold flex items-center gap-1"><Tag size={12}/> You saved Rs. {discount}!</p>}
              </div>

              {/* TOTALS */}
              <div className="space-y-2 mb-6 border-t pt-4">
                <div className="flex justify-between text-gray-600 text-sm"><span>Subtotal</span><span>Rs. {cartTotal}</span></div>
                <div className="flex justify-between text-gray-600 text-sm"><span>Shipping</span><span>Rs. {shippingCost}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-600 text-sm font-bold"><span>Discount</span><span>- Rs. {discount}</span></div>}
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t pt-2 mt-2"><span>Total</span><span>Rs. {grandTotal}</span></div>
              </div>

              {/* COD INFO */}
              <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-6 flex items-start gap-3">
                <Truck className="text-blue-600 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Cash on Delivery</h4>
                  <p className="text-xs text-blue-700">Pay cash upon delivery.</p>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-[#84a93e] text-white py-4 rounded-full font-bold uppercase hover:bg-[#6e8f30] transition shadow-lg flex justify-center items-center"
              >
                {loading ? "Processing..." : "Confirm Order"}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;