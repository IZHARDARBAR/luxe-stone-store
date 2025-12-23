import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext'; // <--- IMPORT CONTEXT

const Cart = () => {
  // --- REAL DATA FROM CONTEXT (Not Dummy State) ---
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();

  return (
    <div className="font-sans text-gray-900 pt-[100px]">
      
      <div className="container mx-auto px-6 md:px-12 mb-20">
        
        {/* HEADING */}
        <h1 className="text-4xl font-serif font-bold mb-10">Cart</h1>

        {cartItems.length > 0 ? (
          <>
            {/* =======================
                1. CART TABLE
            ======================= */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-4 font-bold text-gray-700 w-12"></th>
                    <th className="py-4 font-bold text-gray-700 w-24"></th>
                    <th className="py-4 font-bold text-gray-700">Product</th>
                    <th className="py-4 font-bold text-gray-700">Price</th>
                    <th className="py-4 font-bold text-gray-700">Quantity</th>
                    <th className="py-4 font-bold text-gray-700 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 group">
                      
                      {/* Remove Icon */}
                      <td className="py-6">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <div className="border border-gray-300 rounded-full p-1 hover:border-red-500">
                             <X size={16} />
                          </div>
                        </button>
                      </td>

                      {/* Image (Handles both Array and String) */}
                      <td className="py-6">
                        <img 
                          src={item.images && item.images.length > 0 ? item.images[0] : item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover rounded" 
                        />
                      </td>

                      {/* Product Name */}
                      <td className="py-6 font-medium text-[#84a93e] hover:text-[#6e8f30] cursor-pointer">
                        {item.name}
                      </td>

                      {/* Price */}
                      <td className="py-6 text-gray-500">
                        Rs. {item.price}
                      </td>

                      {/* Quantity Input */}
                      <td className="py-6">
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-16 border border-gray-300 rounded p-2 text-center focus:outline-none focus:border-[#84a93e]"
                        />
                      </td>

                      {/* Subtotal */}
                      <td className="py-6 text-right font-bold text-gray-900">
                        Rs. {item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* =======================
                2. ACTIONS (Coupon & Update)
            ======================= */}
            <div className="flex flex-col md:flex-row justify-between items-center py-8 gap-4 border-b border-gray-200">
              
              <div className="flex gap-4 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="Coupon code" 
                  className="border border-gray-300 rounded px-4 py-3 w-full md:w-64 focus:outline-none focus:border-[#84a93e]"
                />
                <button className="bg-[#84a93e] text-white px-6 py-3 rounded font-bold uppercase text-sm hover:bg-[#6e8f30] transition">
                  Apply Coupon
                </button>
              </div>

              <button className="bg-[#d5ddc3] text-gray-600 px-6 py-3 rounded font-bold uppercase text-sm cursor-not-allowed" disabled>
                Update Cart
              </button>
            </div>

            {/* =======================
                3. CART TOTALS
            ======================= */}
            <div className="flex justify-end mt-12">
              <div className="w-full md:w-1/2 lg:w-1/3 border border-gray-200 p-8 rounded-sm">
                <h2 className="text-3xl font-serif font-bold mb-6">Cart totals</h2>
                
                <div className="flex justify-between py-4 border-b border-gray-100 text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">Rs. {cartTotal}</span>
                </div>

                <div className="flex justify-between py-4 border-b border-gray-100 text-gray-900 font-bold text-lg mb-6">
                  <span>Total</span>
                  <span>Rs. {cartTotal}</span>
                </div>

                <Link to="/checkout">
                  <button className="w-full bg-[#84a93e] text-white py-4 rounded-full font-bold uppercase tracking-wider hover:bg-[#6e8f30] transition shadow-lg">
                    Proceed to checkout
                  </button>
                </Link>

              </div>
            </div>
          </>
        ) : (
          // Empty State
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-6">Your cart is currently empty.</p>
            <Link to="/shop">
              <button className="bg-[#84a93e] text-white px-8 py-3 rounded-full font-bold uppercase">Return to Shop</button>
            </Link>
          </div>
        )}

      </div>

      {/* =========================================
          4. BOTTOM CTA
      ========================================= */}
      <section className="relative h-[400px] w-full flex items-center justify-center text-center text-white">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1626056577883-e18e692d049f?q=80&w=2000" 
            alt="CTA Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 px-4 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Ready to Find your Perfect Piece?
          </h2>
          <p className="text-lg text-gray-200 mb-8">
            Browse our online store or visit us in person.
          </p>
          <Link to="/shop">
            <button className="bg-[#84a93e] text-white px-10 py-3 rounded-full font-bold uppercase hover:bg-[#6e8f30] transition shadow-lg">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Cart;